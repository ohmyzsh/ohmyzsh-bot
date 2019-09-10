import { Context } from 'probot' // eslint-disable-line no-unused-vars
import { execSync } from 'child_process'

export = async function triage (context: Context) {
  // Get PR number and current PR labels
  const PRNumber = context.payload.number
  const oldLabels = context.payload.pull_request.labels.map((label: { name: string }) => label.name)

  // Get clone URL of repository and repository directory
  // Export them to the environment for the triage script
  const repoURL = context.payload.repository.clone_url
  process.env['REPO_URL'] = repoURL
  process.env['REPO_DIR'] = `${process.cwd()}/github`

  // Get new PR labels
  const newLabels = labelsOfPR(PRNumber)

  // Check if old and new labels differ. Otherwise we can skip an API call
  if (different(oldLabels, newLabels)) {
    const params = context.repo({ issue_number: PRNumber, labels: newLabels })
    await context.github.issues.replaceLabels(params)
  }
}

function labelsOfPR (PRNumber: number): string[] {
  // Path to script based on app root
  const zshScript = `${process.cwd()}/src/actions/triage.zsh`

  // Synchronous call to the script
  const stdout = execSync(`${zshScript} ${PRNumber}`).toString()

  // Zsh uses single quotes and the JSON parser only accepts double quotes
  // NOTE: this assumes there are no "s in the original string
  return JSON.parse(stdout.replace(/'/g, '"'))
}

// Precondition: A and B are sorted
// Returns: true if arrays are different, false if not.
function different (A: string[], B: string[]): boolean {
  if (A.length !== B.length) return true

  for (let i = 0; i < A.length; i++) {
    if (A[i] !== B[i]) return true
  }

  return false
}
