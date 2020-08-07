import { Context, Octokit } from "probot"
import { different } from "../utils"

export default async function assignPullRequestReviewers(context: Context) {
  const PRnumber = context.payload.number
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name

  context.log.info("PR number:", PRnumber, ", owner:", owner, ", repo:", repo)

  const oldReviewers: string[] = context.payload.pull_request.requested_reviewers.map(
    (reviewer: { login: string }) => reviewer.login
  )

  const newReviewers = await reviewersOfPR(context, PRnumber, owner, repo)

  // Check if old and new reviewers differ. Otherwise we can skip an API call
  if (different(oldReviewers, newReviewers)) {
    // Log reviewers replacement
    context.log.info("Old reviewers:", oldReviewers)
    context.log.info("New reviewers:", newReviewers)

    const params = context.repo({ pull_number: PRnumber, reviewers: newReviewers })
    const response = await context.github.pulls.createReviewRequest(params)
    context.log.info("Status:", response.headers.status)
  } else {
    context.log.info("No reviewers changed")
  }
}

interface CodeOwner {
  path: string
  username: string
}

function parseModifiedFiles(filesResponse: Octokit.PullsListFilesResponse): string[] {
  const modifiedFiles: string[] = []

  for (const file of filesResponse) {
    modifiedFiles.push(file.filename)
  }

  return modifiedFiles
}

function parseCodeOwners(codeOwnersFile: string): CodeOwner[] {
  const codeOwners: CodeOwner[] = []
  for (const line of codeOwnersFile.split("\n")) {
    // Ignore empty lines and comments
    if (line.length === 0 || line.startsWith("#")) {
      continue
    }

    let [path, owner] = line.split(" ")

    // Allow only owners in the form of @username
    if (!owner?.startsWith("@")) {
      continue
    }

    const codeOwner: CodeOwner = {
      path: path,
      username: owner.slice(1) // Remove initial '@'
    }

    codeOwners.push(codeOwner)
  }

  return codeOwners
}

/**
 * @return List of maintainers of the files that were modified in `PRnumber`
 */
async function reviewersOfPR(
  context: Context,
  PRnumber: number,
  repoOwner: string,
  repo: string
): Promise<string[]> {
  const reviewers: string[] = []

  // Get list of modified files
  const modifiedFilesResponse = await context.github.pulls.listFiles({
    owner: repoOwner,
    repo: repo,
    pull_number: PRnumber,
  })

  const filesData: any = modifiedFilesResponse.data
  const modifiedFiles = parseModifiedFiles(filesData)

  // Get CODEOWNERS file contents
  const codeOwnersResponse = await context.github.repos.getContents({
    owner: repoOwner,
    repo: repo,
    path: ".github/CODEOWNERS",
  })

  const codeOwnersData: any = codeOwnersResponse.data
  const codeOwnersFile = Buffer.from(codeOwnersData.content, "base64").toString()
  const codeOwners = parseCodeOwners(codeOwnersFile)

  // Assumptions:
  // - There can be many files owned by the same owner
  // - There can be many owners for the same file. For example:
  //   /plugins/git/git.plugin.zsh could have 2 owners (for /plugins and for /plugins/git)
  // - The number of codeOwners >> the number of modified files
  for (const codeOwner of codeOwners) {
    for (const path of modifiedFiles) {
      if (path.includes(codeOwner.path)) {
        context.log.info(`${path} was modified. ${codeOwner.username} owns ${codeOwner.path}`)
        reviewers.push(codeOwner.username)
        break // This user is a reviewer, let's look at the next one
      }
    }
  }

  return reviewers
}

export { parseModifiedFiles, parseCodeOwners, CodeOwner }
