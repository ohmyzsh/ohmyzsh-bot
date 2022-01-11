import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { different } from '../utils'

// List of labels determined *only* via the triage function.
// The result of the triage function will have precedence
// on these labels over a maintainer having applied them
// manually via the GitHub web UI.
import LABELS from './labels.json'

export default async function triagePullRequest (context: Context) {
  // Get PR number and current PR labels
  const PRNumber = context.payload.number
  const oldLabels: string[] = context.payload.pull_request.labels.map((label: { name: string }) => label.name)

  // A little bit of helpful logging
  context.log.info('PR Number:', PRNumber, 'labels:', oldLabels)

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
    context.log.info('Old labels:', oldLabels)
    context.log.info('New labels:', newLabels)

    const params = context.repo({ issue_number: PRNumber, labels: newLabels })
    await context.github.issues.replaceLabels(params)
  }
}

interface ModifiedFile {
  filename: string,
  patch: string
}

async function labelsOfPR (context: Context): Promise<string[]> {
  // Important payload values
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name
  const PRnumber = context.payload.number

  // Get list of modified files and parse it
  const modifiedFilesResponse = await context.github.pulls.listFiles({
    owner, repo, pull_number: PRnumber
  })
  const modifiedFiles: ModifiedFile[] = modifiedFilesResponse.data.map(
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
  const hasAliasChanges = (patch: string) => /(^|\n)[-+] *alias /.test(patch)
  const hasBindkeyChanges = (patch: string) => /(^|\n)[-+] *bindkey /.test(patch)

  // Gather list of modified plugins and themes for later processing to see if any of them
  // are new to the repository. Only save the plugin name ('git') or the theme filename
  // ('robbyrussell.zsh-theme'), not the full path.
  const modifiedPlugins: Set<string> = new Set()
  const modifiedThemes: Set<string> = new Set()

  for (const { filename, patch } of modifiedFiles) {
    // Belongs to some of these three areas?
    if (isCoreFile(filename)) {
      labels.add(LABELS.CORE)
    } else if (isPluginFile(filename)) {
      labels.add(LABELS.PLUGIN)
      modifiedPlugins.add(filename.split('/')[1]) // Only store the plugin name
    } else if (isThemeFile(filename)) {
      labels.add(LABELS.THEME)
      modifiedThemes.add(filename.split('/')[1]) // Only store the theme filename
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

  // Process the list of modified plugins and themes to see if any of them
  // are new to the repository.
  if (await areThereNewPlugins(context, modifiedPlugins)) {
    labels.add(LABELS.NEW_PLUGIN)
  }
  if (await areThereNewThemes(context, modifiedThemes)) {
    labels.add(LABELS.NEW_THEME)
  }

  return Array.from(labels)
}

async function areThereNewPlugins (context: Context, modifiedPlugins: Set<string>): Promise<boolean> {
  return areThereNewFiles(context, Array.from(modifiedPlugins), 'plugins')
}

async function areThereNewThemes (context: Context, modifiedThemes: Set<string>): Promise<boolean> {
  return areThereNewFiles(context, Array.from(modifiedThemes), 'themes')
}

async function areThereNewFiles (context: Context, modifiedFiles: string[], path: string): Promise<boolean> {
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name

  // Process the list of modified plugins and themes to see if any of them
  // are new to the repository. Two options:
  // 1. Make a getContents() call for any plugin and theme if only one exists.
  //    This will be the most common use case since most PRs only modify one.
  // 2. Make one getContents() call for a list of all the repository plugins and
  //    themes, then look up the modified files to see if any of them are new.

  if (modifiedFiles.length === 0) return false
  else if (modifiedFiles.length === 1) { // (1)
    try {
      await context.github.repos.getContents({
        method: 'HEAD',
        owner,
        repo,
        path: `${path}/${modifiedFiles[0]}`
      })
    } catch (error) {
      // If we get a 404 error, the plugin doesn't exist
      if (error.status === 404) return true
      else context.log.error(error)
    }
    return false
  } else { // (2)
    try {
      const repoFilesResponse = await context.github.repos.getContents({
        owner, repo, path
      })
      const repoFiles = repoFilesResponse.data
      if (Array.isArray(repoFiles)) {
        for (const filename of modifiedFiles) {
          // Check all plugins in the repository for a match.
          // If none matches, the plugin doesn't exist.
          if (!repoFiles.some(({ name }) => name === filename)) {
            return true
          }
        }
      }
    } catch (error) {
      context.log.error(error)
    }
    return false
  }
}
