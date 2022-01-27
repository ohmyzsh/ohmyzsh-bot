import triagePullRequest from '../src/actions/triage'
import LABELS from '../src/actions/labels.json'

import pr9135OpenedEvent from './fixtures/triage/pr9135.opened'
import pr9135ModifiedFiles from './fixtures/triage/pr9135ModifiedFiles.json'
import pr9102SynchronizeEvent from './fixtures/triage/pr9102.synchronize'
import pr9102ModifiedFiles from './fixtures/triage/pr9102ModifiedFiles.json'

import { Probot, ProbotOctokit } from 'probot'
import nock from 'nock'

// Only test the triage action
const probotApp = (app: Probot) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], triagePullRequest)
}

describe('triage Pull Request', () => {
  const probot = new Probot({
    appId: 1,
    githubToken: 'test',
    Octokit: ProbotOctokit.defaults({ retry: { enabled: false }, throttle: { enabled: false } })
  })
  probot.load(probotApp)

  const githubScope = nock('https://api.github.com')
  nock.disableNetConnect()

  afterEach(() => {
    expect(githubScope.isDone()).toBe(true)
    nock.cleanAll()
  })

  test('correctly labels a pull request when it is opened', async () => {
    const expectedLabels = [
      LABELS.ALIAS,
      LABELS.PLUGIN
    ]

    // Mock PR listFiles
    githubScope
      .get('/repos/ohmyzsh/ohmyzsh/pulls/9135/files')
      .reply(200, pr9135ModifiedFiles)

    // Mock plugin getContent
    githubScope
      .head('/repos/ohmyzsh/ohmyzsh/contents/plugins%2Flaravel')
      .reply(200)

    // Mock PR replaceLabels
    githubScope
      .put('/repos/ohmyzsh/ohmyzsh/issues/9135/labels', (body: any) => {
        expect(body.labels.sort()).toMatchObject(expectedLabels.sort())
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ id: 'event-id', name: 'pull_request', payload: pr9135OpenedEvent })
  })

  test('correctly labels a pull request when it is synchronized', async () => {
    // Mock PR listFiles
    githubScope
      .get('/repos/ohmyzsh/ohmyzsh/pulls/9102/files')
      .reply(200, pr9102ModifiedFiles)

    // Mock plugin getContent
    githubScope
      .head('/repos/ohmyzsh/ohmyzsh/contents/plugins%2Fdotenv')
      .reply(200)

    // We don't need to mock anything else, labels shouldn't be changed

    // Receive a webhook event
    await probot.receive({ id: 'event-id', name: 'pull_request', payload: pr9102SynchronizeEvent })
  })

  test('correctly labels a pull request with new plugins when it is opened', async () => {
    const expectedLabels = [
      LABELS.ALIAS,
      LABELS.PLUGIN,
      LABELS.NEW_PLUGIN
    ]

    // Mock PR listFiles
    githubScope
      .get('/repos/ohmyzsh/ohmyzsh/pulls/9135/files')
      .reply(200, pr9135ModifiedFiles)

    // Mock plugin getContent
    githubScope
      .head('/repos/ohmyzsh/ohmyzsh/contents/plugins%2Flaravel')
      .reply(404)

    // Mock PR replaceLabels
    githubScope
      .put('/repos/ohmyzsh/ohmyzsh/issues/9135/labels', (body: any) => {
        expect(body.labels.sort()).toMatchObject(expectedLabels.sort())
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ id: 'event-id', name: 'pull_request', payload: pr9135OpenedEvent })
  })
})
