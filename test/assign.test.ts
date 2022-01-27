import assignPullRequestReviewers, { parseModifiedFiles, parseCodeOwners, CodeOwner } from '../src/actions/assign'
import modifiedFilesResponse from './fixtures/assign/modifiedFiles.json'
import pullRequestOpenedEvent from './fixtures/assign/pull_request.opened.json'

import { Probot, ProbotOctokit } from 'probot'
import nock from 'nock'
import fs from 'fs'

const codeOwnersFile = fs.readFileSync('./test/fixtures/assign/CODEOWNERS').toString()

nock.disableNetConnect()

// Only test the assign action
const probotApp = (app: Probot) => {
  app.on('pull_request.opened', assignPullRequestReviewers)
}

describe('assign PR reviewers', () => {
  test('correctly parses modified files', async () => {
    const expectedModifiedFiles = ['plugins/gitfast/update']
    const modifiedFiles = parseModifiedFiles(modifiedFilesResponse)
    expect(modifiedFiles).toEqual(expectedModifiedFiles)
  })

  test('correctly parses CODEOWNERS file', async () => {
    const expectedCodeOwners: CodeOwner[] = [
      {
        path: 'plugins/gitfast/',
        username: 'felipec'
      },
      {
        path: 'plugins/sdk/',
        username: 'rgoldberg'
      }
    ]
    const codeOwners = parseCodeOwners(codeOwnersFile)
    expect(codeOwners.sort()).toEqual(expectedCodeOwners.sort())
  })

  test('correctly mentions reviewers when a pull request is opened', async () => {
    const probot = new Probot({
      appId: 1,
      githubToken: 'test',
      Octokit: ProbotOctokit.defaults({ retry: { enabled: false }, throttle: { enabled: false } })
    })
    probot.load(probotApp)

    const githubScope = nock('https://api.github.com')

    // Mock PR listFiles
    githubScope
      .get('/repos/bartekpacia/ohmyzsh/pulls/13/files')
      .reply(200, modifiedFilesResponse)

    // Mock CODEOWNERS file getContent
    githubScope
      .get('/repos/bartekpacia/ohmyzsh/contents/.github%2FCODEOWNERS')
      .reply(200, { content: Buffer.from(codeOwnersFile).toString('base64') })

    // Mock PR createComment
    githubScope
      .post('/repos/bartekpacia/ohmyzsh/issues/13/comments', (req: any) => {
        expect(req.body).toMatch(/(^|\s)@felipec\b/)
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ id: 'event-id', name: 'pull_request', payload: pullRequestOpenedEvent })

    expect(githubScope.isDone()).toBe(true)
  })
})
