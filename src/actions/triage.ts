import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { execSync } from 'child_process'
// List of labels determined *only* via the triage function.
// The result of the triage function will have precedence
// on these labels over a maintainer having applied them from
// the GitHub web UI.
import codeLabels from './labels.json'

export = async function triage (context: Context) {
  // Get PR number and current PR labels
  const PRNumber = context.payload.number
  const oldLabels: string[] = context.payload.pull_request.labels.map((label: { name: string }) => label.name)

  // A little bit of helpful logging
  context.log.info('PR Number:', PRNumber)

  // Get clone URL of repository and repository directory
  // Export them to the environment for the triage script
  const repoURL = context.payload.repository.clone_url
  process.env['REPO_URL'] = repoURL
  process.env['REPO_DIR'] = `${process.cwd()}/github`

  let newLabels
  try {
    // Get new PR labels
    newLabels = labelsOfPR(PRNumber)
  } catch (err) {
    context.log.error(err, 'Error in triage.zsh script call')
    return
  }

  // Add the labels that are not determined via the triage function
  newLabels = newLabels.concat(oldLabels.filter(label => !codeLabels.includes(label)))

  // Check if old and new labels differ. Otherwise we can skip an API call
  if (different(oldLabels, newLabels)) {
    // Log label replacement
    context.log.info('Old labels:', oldLabels)
    context.log.info('New labels:', newLabels)

    const params = context.repo({ issue_number: PRNumber, labels: newLabels })
    await context.github.issues.replaceLabels(params)
  } else {
    context.log.info('No labels changed')
  }
}

function reviewersOfPR (PRNumber: number): string[] {
  // Path to script based on app root
  const zshScript = `${process.cwd()}/src/actions/reviewers.zsh`

  const reviewers: string[] = []

  // TODO: Use a ZSH script or write the logic in TypeScript

  return reviewers
}

/**
 * Executes the zsh script that assign labels to the PR of PRNumber.
 * The zsh script assign the labels basing on the files that have been changed.
 */
function labelsOfPR (PRNumber: number): string[] {
  // Path to script based on app root
  const zshScript = `${process.cwd()}/src/actions/triage.zsh`

  // Synchronous call to the script
  // Can throw an error if the script returns a non-zero exit code
  const stdout = execSync(`${zshScript} ${PRNumber}`).toString()

  // Zsh uses single quotes and the JSON parser only accepts double quotes
  // NOTE: this assumes there are no "s in the original string
  return JSON.parse(stdout.replace(/'/g, '"'))
}

function different (A: string[], B: string[]): boolean {
  if (A.length !== B.length) return true

  A.sort()
  B.sort()

  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) return true
  }

  return false
}
