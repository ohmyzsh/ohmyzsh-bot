import { Context } from "probot"
import { different } from "../utils"

export = async function assign(context: Context) {
  // Get PR number and current PR reviewers
  const PRnumber = context.payload.number
  const oldReviewers: string[] = context.payload.pull_request.requested_reviewers.map(
    (reviewer: { login: string }) => reviewer
  )

  context.log.info("PR number:", PRnumber)

  const owner = context.payload.pull_request.head.user.login
  const repo = context.payload.pull_request.head.repo.name

  const codeownersResponse = await context.github.repos.getContents({
    owner: owner,
    repo: repo,
    path: ".github/CODEOWNERS",
  })

  const modifiedFilesResponse = await context.github.pulls.listFiles({
    owner: owner,
    repo: repo,
    pull_number: PRnumber,
  })
  context.log.info(modifiedFilesResponse)

  const filesData: any = modifiedFilesResponse.data
  for (const file of filesData) {
    context.log.info(`${file.status} file ${file.filename}`)
  }

  const data: any = codeownersResponse.data

  const codeowners = Buffer.from(data.content, "base64").toString()
  context.log.info(codeowners)

  let newReviewers: string[] = []
  try {
    newReviewers = reviewersOfPR(PRnumber)
  } catch (err) {
    context.log.error(err, "Error while calling reviewersOfPR function")
    return
  }

  // Check if old and new reviewers differ. Otherwise we can skip an API call
  if (different(oldReviewers, newReviewers)) {
    // Log reviewers replacement
    context.log.info("Old reviewers:", oldReviewers)
    context.log.info("New reviewers:", newReviewers)

    const params = context.repo({ pull_number: PRnumber, reviewers: newReviewers })
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
  const reviewers: string[] = []

  // TODO: Parse files that changed in the PR of PRNumber
  // TODO: Find whether any of the changed file has the owner (defined in CODEOWNERS)
  // TODO: If there is a match, request a review from the responsible user (a.k.a assign a PR reviewer)
  // TODO: Write the logic in TypeScript

  return reviewers
}
