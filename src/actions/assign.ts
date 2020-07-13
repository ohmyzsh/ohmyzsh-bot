import { Context } from "probot"
import { different } from "../utils"

export = async function assign(context: Context) {
  const PRnumber = context.payload.number
  const owner = context.payload.pull_request.head.user.login
  const repo = context.payload.pull_request.head.repo.name

  context.log.info("PR number:", PRnumber, "owner:", owner, "repo:", repo)

  const oldReviewers: string[] = context.payload.pull_request.requested_reviewers.map(
    (reviewer: { login: string }) => reviewer
  )

  let newReviewers: string[] = []
  try {
    newReviewers = await reviewersOfPR(context, PRnumber, owner, repo)
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
    const response = await context.github.pulls.createReviewRequest(params)
    context.log.info("Status:", response.headers.status)
  } else {
    context.log.info("No reviewers changed")
  }
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

  const codeownersResponse = await context.github.repos.getContents({
    owner: repoOwner,
    repo: repo,
    path: ".github/CODEOWNERS",
  })

  const modifiedFilesResponse = await context.github.pulls.listFiles({
    owner: repoOwner,
    repo: repo,
    pull_number: PRnumber,
  })
  context.log.info(modifiedFilesResponse)

  const filesData: any = modifiedFilesResponse.data
  const filenames: string[] = []
  for (const file of filesData) {
    context.log.info(`${file.status} file ${file.filename}`)
    filenames.push(file.filename)
  }

  const data: any = codeownersResponse.data

  const codeownersFile = Buffer.from(data.content, "base64").toString()
  context.log.info(codeownersFile)

  for (const line of codeownersFile.split("\n")) {
    const [codePath, codeOwner] = line.split(" ")

    // Ignore first line and empty newline at the end of the file
    if (!codeOwner?.includes("@")) {
      continue
    }

    for (const filename of filenames) {
      if (filename.includes(codePath)) {
        context.log.info(`${filename} was modified. ${codeOwner} owns ${codePath}`)
        reviewers.push(codeOwner)
      }
    }
  }

  return reviewers
}
