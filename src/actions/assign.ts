import { Context, Octokit } from "probot"
import { different } from "../utils"

async function assign(context: Context) {
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

function parseCodeOwners(codeownersFile: string): CodeOwner[] {
  const codeOwners: CodeOwner[] = []
  for (const line of codeownersFile.split("\n")) {
    if (line.length === 0 || line.startsWith("#")) {
      continue
    }

    let [path, owner] = line.split(" ")

    // Ignore first line and empty newline at the end of the file
    if (!owner?.startsWith("@")) {
      continue
    }

    owner = owner.replace("@", "")

    const codeOwner: CodeOwner = {
      path: path,
      username: owner,
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

  const modifiedFilesResponse = await context.github.pulls.listFiles({
    owner: repoOwner,
    repo: repo,
    pull_number: PRnumber,
  })

  const filesData: any = modifiedFilesResponse.data
  const modifiedFiles = parseModifiedFiles(filesData)

  const codeownersResponse = await context.github.repos.getContents({
    owner: repoOwner,
    repo: repo,
    path: ".github/CODEOWNERS",
  })

  const data: any = codeownersResponse.data
  const codeownersFile = Buffer.from(data.content, "base64").toString()

  const codeOwners = parseCodeOwners(codeownersFile)

  for (const codeOwner of codeOwners) {
    for (const path of modifiedFiles) {
      if (path.includes(codeOwner.path)) {
        context.log.info(`${path} was modified. ${codeOwner.username} owns ${codeOwner.path}`)
        reviewers.push(codeOwner.username)
      }
    }
  }

  return reviewers
}

export { assign, parseModifiedFiles, parseCodeOwners, CodeOwner }
