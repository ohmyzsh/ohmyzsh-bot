import { Application } from 'probot' // eslint-disable-line no-unused-vars
import triagePullRequest from './actions/triage'

export = (app: Application) => {
  app.on(['pull_request.opened', 'pull_request.synchronize'], triagePullRequest)
}
