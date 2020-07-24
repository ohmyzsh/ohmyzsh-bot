import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { different } from '../utils'

// List of labels determined *only* via the triage function.
// The result of the triage function will have precedence
// on these labels over a maintainer having applied them from
// the GitHub web UI.
import labelConstants from './labels.json'

export default async function triagePullRequest (context: Context) {
  // Get PR number and current PR labels
  const PRNumber = context.payload.number
  const oldLabels: string[] = context.payload.pull_request.labels.map((label: { name: string }) => label.name)

  // A little bit of helpful logging
  context.log.info('PR Number:', PRNumber, 'labels:', oldLabels)

  // Get new PR labels
  let newLabels = await labelsOfPR(context)

  // Add the labels that are not determined via the triage function
  newLabels = newLabels.concat(oldLabels.filter(label => !Object.values(labelConstants).includes(label)))

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
  const pull_number = context.payload.number

  // Get list of modified files and parse it
  const modifiedFilesResponse = await context.github.pulls.listFiles({
    owner,
    repo,
    pull_number
  })
  const modifiedFiles: ModifiedFile[] = modifiedFilesResponse.data.map(
    ({ filename, patch }) => ({ filename, patch })
  )

  // List of labels
  const labels: Set<string> = new Set()

  // If the mergeable field is false, the Pull Request has conflicts
  // NOTE: mergeable might be null if the mergeable state is unknown
  if (context.payload.pull_request.mergeable === false) {
    labels.add(labelConstants.CONFLICTS)
  }

  // Matching functions: based on filepath
  const isCoreFile = (file: string) => (file.startsWith('lib/') || file.startsWith('tools/'))
  const isPluginFile = (file: string) => file.startsWith('plugins/')
  const isThemeFile = (file: string) => file.startsWith('themes/')
  // Matching functions: based on patch contents
  const hasAliasChanges = (patch: string) => /(^|\n)[-+] *alias /.test(patch)
  const hasBindkeyChanges = (patch: string) => /(^|\n)[-+] *bindkey /.test(patch)

  for (let { filename, patch } of modifiedFiles) {
    // Belongs to some of these three areas?
    if (isCoreFile(filename)) {
      labels.add(labelConstants.CORE)
    } else if (isPluginFile(filename)) {
      labels.add(labelConstants.PLUGIN)
      // TODO: check if new plugin
    } else if (isThemeFile(filename)) {
      labels.add(labelConstants.THEME)
      // TODO: check if new theme
    }

    // Has documentation?
    if (/(^README\..+|.+\/README\..+$)/.test(filename)) {
      labels.add('Type: documentation')
      continue
    }

    // Match the full filepath to these categories
    switch (true) {
    case /^oh-my-zsh\.(sh|zsh)/.test(filename):
      labels.add(labelConstants.INIT)
      break
    case /^tools\/.*upgrade\.sh/.test(filename):
      labels.add(labelConstants.UPDATE)
      break
    case /^tools\/install\.sh/.test(filename):
      labels.add(labelConstants.INSTALL)
      break
    case /^tools\/uninstall\.sh/.test(filename):
      labels.add(labelConstants.UNINSTALL)
      break
    case /^plugins\/aws\//.test(filename):
      labels.add(labelConstants.PLUGIN_AWS)
      break
    case /^plugins\/git\//.test(filename):
      labels.add(labelConstants.PLUGIN_GIT)
      break
    case /^plugins\/mercurial\//.test(filename):
      labels.add(labelConstants.PLUGIN_MERCURIAL)
      break
    case /^plugins\/tmux\//.test(filename):
      labels.add(labelConstants.PLUGIN_TMUX)
      break
    }

    // Match only the last part of the filename
    const basename = filename.split('/').slice(-1)[0]
    switch (true) {
    case /\.zsh$/.test(basename):
      if (hasAliasChanges(patch)) {
        labels.add(labelConstants.ALIAS)
      }
      if (hasBindkeyChanges(patch)) {
        labels.add(labelConstants.BINDKEY)
      }
      break
    case /^_/.test(basename):
      labels.add(labelConstants.COMPLETION)
      break
    }
  }

  return Array.from(labels)
}
