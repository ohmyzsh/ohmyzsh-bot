import { Application } from 'probot' // eslint-disable-line no-unused-vars
import triagePullRequest from './triage'

export = (app: Application) => {
  app.on('pull_request.opened', triagePullRequest)
  app.on('pull_request.synchronize', triagePullRequest)
}
