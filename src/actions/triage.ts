import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { different } from '../utils'

// List of labels determined *only* via the triage function.
// The result of the triage function will have precedence
// on these labels over a maintainer having applied them
// manually via the GitHub web UI.
import LABELS from './labels.json'

export default async function triagePullRequest (context: Context<'pull_request'>): Promise<void> {
  // Get PR number and current PR labels
  const PRNumber = context.payload.number
  const oldLabels: string[] = context.payload.pull_request.labels.map((label: { name: string }) => label.name)

  // A little bit of helpful logging
  context.log.info(`PR Number: ${PRNumber}, labels: ${JSON.stringify(oldLabels)}`)

  // Get new PR labels
  let newLabels = await labelsOfPR(context)

  // Add the labels that are not determined via the triage function
  newLabels = newLabels.concat(oldLabels.filter(label => !Object.values(LABELS).includes(label)))
  // If the DOCUMENTATION label is present in oldLabels, keep it
  if (oldLabels.includes(LABELS.DOCUMENTATION) && !newLabels.includes(LABELS.DOCUMENTATION)) {
    newLabels.push(LABELS.DOCUMENTATION)
  }

  // If old and new labels are the same skip an API call
  if (!different(oldLabels, newLabels)) {
    context.log.info('No labels changed')
  } else {
    // Log label replacement
    context.log.info(`New labels: ${JSON.stringify(newLabels)}`)

    const params = context.repo({ issue_number: PRNumber, labels: newLabels })
    await context.octokit.issues.setLabels(params)
  }
}

type PullRequestFile = {
  filename: string,
  patch?: string
}

async function labelsOfPR (context: Context<'pull_request'>): Promise<string[]> {
  // Important context.payload values
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name
  const PRnumber = context.payload.number

  // Get list of modified files and parse it
  const pullRequestFilesResponse = await context.octokit.pulls.listFiles({
    owner, repo, pull_number: PRnumber
  })
  const pullRequestFiles: PullRequestFile[] = pullRequestFilesResponse.data.map(
    ({ filename, patch }) => ({ filename, patch })
  )

  // List of labels
  const labels: Set<string> = new Set()

  // If the mergeable field is false, the Pull Request has conflicts
  // NOTE: mergeable might be null if the mergeable state is unknown
  if (context.payload.pull_request.mergeable === false) {
    labels.add(LABELS.CONFLICTS)
  }

  // Matching functions: based on filepath
  const isCoreFile = (file: string) => (file.startsWith('lib/') || file.startsWith('tools/'))
  const isPluginFile = (file: string) => file.startsWith('plugins/')
  const isThemeFile = (file: string) => file.startsWith('themes/')
  // Matching functions: based on patch contents
  const hasAliasChanges = (patch?: string) => patch != null && /(^|\n)[-+] *alias /.test(patch)
  const hasBindkeyChanges = (patch?: string) => patch != null && /(^|\n)[-+] *bindkey /.test(patch)

  // Gather list of modified plugins and themes for later processing to see if any of them
  // are new to the repository. Only save the plugin name ('git') or the theme filename
  // ('robbyrussell.zsh-theme'), not the full path.
  const pullRequestPlugins: Set<string> = new Set()
  const pullRequestThemes: Set<string> = new Set()

  for (const { filename, patch } of pullRequestFiles) {
    // Belongs to some of these three areas?
    if (isCoreFile(filename)) {
      labels.add(LABELS.CORE)
    } else if (isPluginFile(filename)) {
      labels.add(LABELS.PLUGIN)
      pullRequestPlugins.add(filename.split('/')[1]) // Only store the plugin name
    } else if (isThemeFile(filename)) {
      labels.add(LABELS.THEME)
      pullRequestThemes.add(filename.split('/')[1]) // Only store the theme filename
    }

    // Has documentation? (ends in README.*)
    if (/(^README\..+|\/README\..+$)/.test(filename)) {
      labels.add(LABELS.DOCUMENTATION)
      continue
    }

    // Match the full filepath to these categories
    switch (true) {
      case /^oh-my-zsh\.(sh|zsh)/.test(filename):
        labels.add(LABELS.INIT)
        break
      case /^tools\/.*upgrade\.sh/.test(filename):
        labels.add(LABELS.UPDATE)
        break
      case /^tools\/install\.sh/.test(filename):
        labels.add(LABELS.INSTALL)
        break
      case /^tools\/uninstall\.sh/.test(filename):
        labels.add(LABELS.UNINSTALL)
        break
    }

    // Match only the last part of the filename
    const basename = filename.split('/').slice(-1)[0]
    switch (true) {
      case /\.zsh$/.test(basename):
        if (hasAliasChanges(patch)) {
          labels.add(LABELS.ALIAS)
        }
        if (hasBindkeyChanges(patch)) {
          labels.add(LABELS.BINDKEY)
        }
        break
      case /^_/.test(basename):
        labels.add(LABELS.COMPLETION)
        break
    }
  }

  // Check the list of modified plugins and themes for new ones
  if (await areThereNewPlugins(context, pullRequestPlugins)) {
    labels.add(LABELS.NEW_PLUGIN)
  }
  if (await areThereNewThemes(context, pullRequestThemes)) {
    labels.add(LABELS.NEW_THEME)
  }

  return Array.from(labels)
}

async function areThereNewPlugins (context: Context<'pull_request'>, pullRequestPlugins: Set<string>): Promise<boolean> {
  return areThereNewFiles(context, Array.from(pullRequestPlugins), 'plugins')
}

async function areThereNewThemes (context: Context<'pull_request'>, pullRequestThemes: Set<string>): Promise<boolean> {
  return areThereNewFiles(context, Array.from(pullRequestThemes), 'themes')
}

async function areThereNewFiles (context: Context<'pull_request'>, pullRequestFiles: string[], path: string): Promise<boolean> {
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name

  // Process the list of modified plugins and themes to see if any of them
  // are new to the repository. Two options:
  // 1. Make a getContent() call for any plugin and theme if only one exists.
  //    This will be the most common use case since most PRs only modify one.
  // 2. Make one getContent() call for a list of all the repository plugins and
  //    themes, then look up the modified files to see if any of them are new.

  if (pullRequestFiles.length === 0) return false

  // (1): only one plugin or theme is modified, just test this one in specific
  if (pullRequestFiles.length === 1) {
    return context.octokit.repos.getContent({
      method: 'HEAD',
      owner,
      repo,
      path: `${path}/${pullRequestFiles[0]}`
    }).then(() => {
      return false
    }).catch(error => {
      if (error != null && typeof error === 'object' && 'status' in error) {
        if ((error as any).status === 404) return true
      }
      context.log.error(error)
      return false
    })
  }

  // (2): more than one plugin or theme are modified, get the whole list
  return context.octokit.repos.getContent({
    owner, repo, path
  }).then(res => {
    const repoFiles = res.data
    if (Array.isArray(repoFiles)) {
      for (const filename of pullRequestFiles) {
        // Check all files in the repository for a match.
        // If none matches, the plugin / theme doesn't exist.
        if (!repoFiles.some(({ name }) => name === filename)) {
          return true
        }
      }
    }
    return false
  }).catch(error => {
    context.log.error(error)
    return false
  })
}
