import { Probot } from 'probot'
import triagePullRequest from './actions/triage'
import assignPullRequestReviewers from './actions/assign'

const probotApp = (app: Probot) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], triagePullRequest)
  app.on('pull_request.opened', assignPullRequestReviewers)
}

export default probotApp
