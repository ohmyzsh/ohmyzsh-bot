import { Context } from "probot"
import { different } from "../utils"

export = async function assign(context: Context) {
  // Get PR number and current PR reviewers
  const PRNumber = context.payload.number
  const oldReviewers: string[] = context.payload.pull_request.requested_reviewers.map(
    (reviewer: { login: string }) => reviewer
  )

  // A little bit of helpful logging
  context.log.info("PR Number:", PRNumber)

  // Get clone URL of repository and repository directory
  // Export them to the environment for the triage script
  const repoURL = context.payload.repository.clone_url
  process.env["REPO_URL"] = repoURL
  process.env["REPO_DIR"] = `${process.cwd()}/github`

  let newReviewers: string[] = []
  try {
    newReviewers = reviewersOfPR(PRNumber)
  } catch (err) {
    context.log.error(err, "Error while calling reviewersOfPR function")
    return
  }

  // Check if old and new reviewers differ. Otherwise we can skip an API call
  if (different(oldReviewers, newReviewers)) {
    // Log reviewers replacement
    context.log.info("Old reviewers:", oldReviewers)
    context.log.info("New reviewers:", newReviewers)

    const params = context.repo({ pull_number: PRNumber, reviewers: newReviewers })
    await context.github.pulls.createReviewRequest(params)
  } else {
    context.log.info("No reviewers changed")
  }
}

/**
 * Executes the zsh script that assign reviewers to the PR of PRNumber.
 * The zsh script assign the reviewers basing on the files that have been changed.
 *
 * @return The list of maintainers of the changed files
 */
function reviewersOfPR(PRNumber: number): string[] {
  // Path to script based on app root
  const zshScript = `${process.cwd()}/src/actions/reviewers.zsh`

  const reviewers: string[] = []

  // TODO: Parse files that changed in the PR of PRNumber
  // TODO: Find whether any of the changed file has the owner (defined in CODEOWNERS)
  // TODO: If there is a match, request a review from the responsible user (a.k.a assign a PR reviewer)
  // TODO: Use a ZSH script or write the logic in TypeScript

  return reviewers
}
