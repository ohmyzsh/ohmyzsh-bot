import { Context } from 'probot'
import { GetResponseDataTypeFromEndpointMethod } from '@octokit/types'

export default async function assignPullRequestReviewers (context: Context<'pull_request'>) {
  const PRnumber = context.payload.number
  const owner = context.payload.repository.owner.login
  const repo = context.payload.repository.name

  context.log.info(`PR number: ${PRnumber}, repo: ${owner}/${repo}`)

  let reviewers = await reviewersOfPR(context, PRnumber, owner, repo)

  // Remove author of the PR from the reviewers list
  const author = context.payload.pull_request.user.login
  reviewers = reviewers.filter(reviewer => reviewer !== author)

  const reviewersText = reviewers.map(reviewer => '@' + reviewer).join(', ')
  context.log.info(`Reviewers: ${reviewersText || 'none'}`)

  // If no reviewers assigned, do nothing
  if (reviewers.length === 0) return

  // Otherwise, create a comment mentioning the reviewers
  const body = `Bleep bloop. I determined that these users own the modified files: ${reviewersText}.`
  const response = await context.octokit.issues.createComment({
    owner, repo, issue_number: PRnumber, body
  })

  context.log.info(`Comment status: ${response.status}`)
}

interface CodeOwner {
  path: string
  username: string
}

export type PullsListFilesResponseData = GetResponseDataTypeFromEndpointMethod<Context['octokit']['pulls']['listFiles']>

function parseModifiedFiles (filesResponse: PullsListFilesResponseData): string[] {
  const modifiedFiles: string[] = []

  for (const file of filesResponse) {
    modifiedFiles.push(file.filename)
  }

  return modifiedFiles
}

function parseCodeOwners (codeOwnersFile: string): CodeOwner[] {
  const codeOwners: CodeOwner[] = []
  for (const line of codeOwnersFile.split('\n')) {
    // Ignore empty lines and comments
    if (line.length === 0 || line.startsWith('#')) {
      continue
    }

    const [path, owner] = line.split(/\s+/)

    // Allow only owners in the form of @username
    if (!owner?.startsWith('@')) {
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
async function reviewersOfPR (
  context: Context<'pull_request'>,
  PRnumber: number,
  repoOwner: string,
  repo: string
): Promise<string[]> {
  const reviewers: string[] = []

  // Get list of modified files
  const modifiedFilesResponse = await context.octokit.pulls.listFiles({
    owner: repoOwner,
    repo: repo,
    pull_number: PRnumber
  })

  const filesData = modifiedFilesResponse.data
  const modifiedFiles = parseModifiedFiles(filesData)

  // Get CODEOWNERS file contents
  const { data: codeOwnersData } = await context.octokit.repos.getContent({
    owner: repoOwner,
    repo: repo,
    path: '.github/CODEOWNERS'
  })

  // Check that the API returned the contents of the CODEOWNERS file
  if (!('content' in codeOwnersData)) return []

  const codeOwnersFile = Buffer.from(codeOwnersData.content, 'base64').toString()
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

  return reviewers.sort()
}

export { parseModifiedFiles, parseCodeOwners, CodeOwner }
