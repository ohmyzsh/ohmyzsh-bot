import { PullRequestOpenedEvent } from '@octokit/webhooks-types'

export default {
  action: 'opened',
  number: 13,
  pull_request: {
    url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/13',
    id: 448254133,
    node_id: 'MDExOlB1bGxSZXF1ZXN0NDQ4MjU0MTMz',
    html_url: 'https://github.com/bartekpacia/ohmyzsh/pull/13',
    diff_url: 'https://github.com/bartekpacia/ohmyzsh/pull/13.diff',
    patch_url: 'https://github.com/bartekpacia/ohmyzsh/pull/13.patch',
    issue_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/13',
    number: 13,
    state: 'open',
    locked: false,
    title: 'updated gitfast plugin',
    user: {
      login: 'bartekpacia',
      id: 40357511,
      node_id: 'MDQ6VXNlcjQwMzU3NTEx',
      avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/bartekpacia',
      html_url: 'https://github.com/bartekpacia',
      followers_url: 'https://api.github.com/users/bartekpacia/followers',
      following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
      gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
      organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
      repos_url: 'https://api.github.com/users/bartekpacia/repos',
      events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
      received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
      type: 'User',
      site_admin: false
    },
    body: 'lol9\r\n\r\ntesting `ohmyzsh-bot`',
    created_at: '2020-07-13T13:24:35Z',
    updated_at: '2020-07-13T13:24:35Z',
    closed_at: null,
    merged_at: null,
    merge_commit_sha: null,
    assignee: null,
    assignees: [],
    requested_reviewers: [],
    requested_teams: [],
    labels: [],
    milestone: null,
    draft: false,
    commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/13/commits',
    review_comments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/13/comments',
    review_comment_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/comments{/number}',
    comments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/13/comments',
    statuses_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/statuses/5383477f0701be7802f356fbc5c5db118dc4edd8',
    head: {
      label: 'bartekpacia:lol9',
      ref: 'lol9',
      sha: '5383477f0701be7802f356fbc5c5db118dc4edd8',
      user: {
        login: 'bartekpacia',
        id: 40357511,
        node_id: 'MDQ6VXNlcjQwMzU3NTEx',
        avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bartekpacia',
        html_url: 'https://github.com/bartekpacia',
        followers_url: 'https://api.github.com/users/bartekpacia/followers',
        following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
        gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
        organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
        repos_url: 'https://api.github.com/users/bartekpacia/repos',
        events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
        received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
        type: 'User',
        site_admin: false
      },
      repo: {
        id: 278045475,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNzgwNDU0NzU=',
        name: 'ohmyzsh',
        full_name: 'bartekpacia/ohmyzsh',
        private: false,
        owner: {
          login: 'bartekpacia',
          id: 40357511,
          node_id: 'MDQ6VXNlcjQwMzU3NTEx',
          avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bartekpacia',
          html_url: 'https://github.com/bartekpacia',
          followers_url: 'https://api.github.com/users/bartekpacia/followers',
          following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
          gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
          organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
          repos_url: 'https://api.github.com/users/bartekpacia/repos',
          events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
          received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
          type: 'User',
          site_admin: false
        },
        html_url: 'https://github.com/bartekpacia/ohmyzsh',
        description: '🙃 A delightful community-driven (with 1700+ contributors) framework for managing your zsh configuration. Includes 200+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, php, python, etc), over 140 themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community.',
        fork: true,
        url: 'https://api.github.com/repos/bartekpacia/ohmyzsh',
        forks_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/forks',
        keys_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/keys{/key_id}',
        collaborators_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/teams',
        hooks_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/hooks',
        issue_events_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/events{/number}',
        events_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/events',
        assignees_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/assignees{/user}',
        branches_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/branches{/branch}',
        tags_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/tags',
        blobs_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/blobs{/sha}',
        git_tags_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/tags{/sha}',
        git_refs_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/refs{/sha}',
        trees_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/trees{/sha}',
        statuses_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/statuses/{sha}',
        languages_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/languages',
        stargazers_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/stargazers',
        contributors_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/contributors',
        subscribers_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/subscribers',
        subscription_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/subscription',
        commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/commits{/sha}',
        git_commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/commits{/sha}',
        comments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/comments{/number}',
        issue_comment_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/comments{/number}',
        contents_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/contents/{+path}',
        compare_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/compare/{base}...{head}',
        merges_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/merges',
        archive_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/{archive_format}{/ref}',
        downloads_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/downloads',
        issues_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues{/number}',
        pulls_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls{/number}',
        milestones_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/milestones{/number}',
        notifications_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/notifications{?since,all,participating}',
        labels_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/labels{/name}',
        releases_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/releases{/id}',
        deployments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/deployments',
        created_at: '2020-07-08T09:22:05Z',
        updated_at: '2020-07-12T23:25:29Z',
        pushed_at: '2020-07-13T13:24:18Z',
        git_url: 'git://github.com/bartekpacia/ohmyzsh.git',
        ssh_url: 'git@github.com:bartekpacia/ohmyzsh.git',
        clone_url: 'https://github.com/bartekpacia/ohmyzsh.git',
        svn_url: 'https://github.com/bartekpacia/ohmyzsh',
        homepage: 'https://ohmyz.sh',
        size: 6983,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: false,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 1,
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz'
        },
        forks: 0,
        open_issues: 1,
        watchers: 0,
        default_branch: 'master',
        allow_squash_merge: true,
        allow_merge_commit: true,
        allow_rebase_merge: true,
        is_template: false,
        topics: [],
        visibility: 'public',
        delete_branch_on_merge: false,
        web_commit_signoff_required: false
      }
    },
    base: {
      label: 'bartekpacia:master',
      ref: 'master',
      sha: 'e3131d98aa056145ed34ef19dfe77efff87be21b',
      user: {
        login: 'bartekpacia',
        id: 40357511,
        node_id: 'MDQ6VXNlcjQwMzU3NTEx',
        avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
        gravatar_id: '',
        url: 'https://api.github.com/users/bartekpacia',
        html_url: 'https://github.com/bartekpacia',
        followers_url: 'https://api.github.com/users/bartekpacia/followers',
        following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
        gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
        starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
        subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
        organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
        repos_url: 'https://api.github.com/users/bartekpacia/repos',
        events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
        received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
        type: 'User',
        site_admin: false
      },
      repo: {
        id: 278045475,
        node_id: 'MDEwOlJlcG9zaXRvcnkyNzgwNDU0NzU=',
        name: 'ohmyzsh',
        full_name: 'bartekpacia/ohmyzsh',
        private: false,
        owner: {
          login: 'bartekpacia',
          id: 40357511,
          node_id: 'MDQ6VXNlcjQwMzU3NTEx',
          avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
          gravatar_id: '',
          url: 'https://api.github.com/users/bartekpacia',
          html_url: 'https://github.com/bartekpacia',
          followers_url: 'https://api.github.com/users/bartekpacia/followers',
          following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
          gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
          starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
          subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
          organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
          repos_url: 'https://api.github.com/users/bartekpacia/repos',
          events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
          received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
          type: 'User',
          site_admin: false
        },
        html_url: 'https://github.com/bartekpacia/ohmyzsh',
        description: '🙃 A delightful community-driven (with 1700+ contributors) framework for managing your zsh configuration. Includes 200+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, php, python, etc), over 140 themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community.',
        fork: true,
        url: 'https://api.github.com/repos/bartekpacia/ohmyzsh',
        forks_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/forks',
        keys_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/keys{/key_id}',
        collaborators_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/collaborators{/collaborator}',
        teams_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/teams',
        hooks_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/hooks',
        issue_events_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/events{/number}',
        events_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/events',
        assignees_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/assignees{/user}',
        branches_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/branches{/branch}',
        tags_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/tags',
        blobs_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/blobs{/sha}',
        git_tags_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/tags{/sha}',
        git_refs_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/refs{/sha}',
        trees_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/trees{/sha}',
        statuses_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/statuses/{sha}',
        languages_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/languages',
        stargazers_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/stargazers',
        contributors_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/contributors',
        subscribers_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/subscribers',
        subscription_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/subscription',
        commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/commits{/sha}',
        git_commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/commits{/sha}',
        comments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/comments{/number}',
        issue_comment_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/comments{/number}',
        contents_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/contents/{+path}',
        compare_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/compare/{base}...{head}',
        merges_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/merges',
        archive_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/{archive_format}{/ref}',
        downloads_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/downloads',
        issues_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues{/number}',
        pulls_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls{/number}',
        milestones_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/milestones{/number}',
        notifications_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/notifications{?since,all,participating}',
        labels_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/labels{/name}',
        releases_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/releases{/id}',
        deployments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/deployments',
        created_at: '2020-07-08T09:22:05Z',
        updated_at: '2020-07-12T23:25:29Z',
        pushed_at: '2020-07-13T13:24:18Z',
        git_url: 'git://github.com/bartekpacia/ohmyzsh.git',
        ssh_url: 'git@github.com:bartekpacia/ohmyzsh.git',
        clone_url: 'https://github.com/bartekpacia/ohmyzsh.git',
        svn_url: 'https://github.com/bartekpacia/ohmyzsh',
        homepage: 'https://ohmyz.sh',
        size: 6983,
        stargazers_count: 0,
        watchers_count: 0,
        language: 'Shell',
        has_issues: false,
        has_projects: true,
        has_downloads: true,
        has_wiki: true,
        has_pages: false,
        forks_count: 0,
        mirror_url: null,
        archived: false,
        disabled: false,
        open_issues_count: 1,
        license: {
          key: 'mit',
          name: 'MIT License',
          spdx_id: 'MIT',
          url: 'https://api.github.com/licenses/mit',
          node_id: 'MDc6TGljZW5zZTEz'
        },
        forks: 0,
        open_issues: 1,
        watchers: 0,
        default_branch: 'master',
        allow_squash_merge: true,
        allow_merge_commit: true,
        allow_rebase_merge: true,
        is_template: false,
        topics: [],
        visibility: 'public',
        delete_branch_on_merge: false,
        web_commit_signoff_required: false
      }
    },
    _links: {
      self: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/13'
      },
      html: {
        href: 'https://github.com/bartekpacia/ohmyzsh/pull/13'
      },
      issue: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/13'
      },
      comments: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/13/comments'
      },
      review_comments: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/13/comments'
      },
      review_comment: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/comments{/number}'
      },
      commits: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls/13/commits'
      },
      statuses: {
        href: 'https://api.github.com/repos/bartekpacia/ohmyzsh/statuses/5383477f0701be7802f356fbc5c5db118dc4edd8'
      }
    },
    author_association: 'OWNER',
    auto_merge: null,
    active_lock_reason: null,
    merged: false,
    mergeable: null,
    rebaseable: null,
    mergeable_state: 'unknown',
    merged_by: null,
    comments: 0,
    review_comments: 0,
    maintainer_can_modify: false,
    commits: 1,
    additions: 2,
    deletions: 0,
    changed_files: 1
  },
  repository: {
    id: 278045475,
    node_id: 'MDEwOlJlcG9zaXRvcnkyNzgwNDU0NzU=',
    name: 'ohmyzsh',
    full_name: 'bartekpacia/ohmyzsh',
    private: false,
    owner: {
      login: 'bartekpacia',
      id: 40357511,
      node_id: 'MDQ6VXNlcjQwMzU3NTEx',
      avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/bartekpacia',
      html_url: 'https://github.com/bartekpacia',
      followers_url: 'https://api.github.com/users/bartekpacia/followers',
      following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
      gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
      organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
      repos_url: 'https://api.github.com/users/bartekpacia/repos',
      events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
      received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
      type: 'User',
      site_admin: false
    },
    html_url: 'https://github.com/bartekpacia/ohmyzsh',
    description: '🙃 A delightful community-driven (with 1700+ contributors) framework for managing your zsh configuration. Includes 200+ optional plugins (rails, git, OSX, hub, capistrano, brew, ant, php, python, etc), over 140 themes to spice up your morning, and an auto-update tool so that makes it easy to keep up with the latest updates from the community.',
    fork: true,
    url: 'https://api.github.com/repos/bartekpacia/ohmyzsh',
    forks_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/forks',
    keys_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/keys{/key_id}',
    collaborators_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/collaborators{/collaborator}',
    teams_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/teams',
    hooks_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/hooks',
    issue_events_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/events{/number}',
    events_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/events',
    assignees_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/assignees{/user}',
    branches_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/branches{/branch}',
    tags_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/tags',
    blobs_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/blobs{/sha}',
    git_tags_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/tags{/sha}',
    git_refs_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/refs{/sha}',
    trees_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/trees{/sha}',
    statuses_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/statuses/{sha}',
    languages_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/languages',
    stargazers_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/stargazers',
    contributors_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/contributors',
    subscribers_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/subscribers',
    subscription_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/subscription',
    commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/commits{/sha}',
    git_commits_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/git/commits{/sha}',
    comments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/comments{/number}',
    issue_comment_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues/comments{/number}',
    contents_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/contents/{+path}',
    compare_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/compare/{base}...{head}',
    merges_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/merges',
    archive_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/{archive_format}{/ref}',
    downloads_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/downloads',
    issues_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/issues{/number}',
    pulls_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/pulls{/number}',
    milestones_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/milestones{/number}',
    notifications_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/notifications{?since,all,participating}',
    labels_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/labels{/name}',
    releases_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/releases{/id}',
    deployments_url: 'https://api.github.com/repos/bartekpacia/ohmyzsh/deployments',
    created_at: '2020-07-08T09:22:05Z',
    updated_at: '2020-07-12T23:25:29Z',
    pushed_at: '2020-07-13T13:24:18Z',
    git_url: 'git://github.com/bartekpacia/ohmyzsh.git',
    ssh_url: 'git@github.com:bartekpacia/ohmyzsh.git',
    clone_url: 'https://github.com/bartekpacia/ohmyzsh.git',
    svn_url: 'https://github.com/bartekpacia/ohmyzsh',
    homepage: 'https://ohmyz.sh',
    size: 6983,
    stargazers_count: 0,
    watchers_count: 0,
    language: 'Shell',
    has_issues: false,
    has_projects: true,
    has_downloads: true,
    has_wiki: true,
    has_pages: false,
    forks_count: 0,
    mirror_url: null,
    archived: false,
    disabled: false,
    open_issues_count: 1,
    license: {
      key: 'mit',
      name: 'MIT License',
      spdx_id: 'MIT',
      url: 'https://api.github.com/licenses/mit',
      node_id: 'MDc6TGljZW5zZTEz'
    },
    forks: 0,
    open_issues: 1,
    watchers: 0,
    is_template: false,
    topics: [],
    visibility: 'public',
    default_branch: 'master',
    web_commit_signoff_required: false
  },
  sender: {
    login: 'bartekpacia',
    id: 40357511,
    node_id: 'MDQ6VXNlcjQwMzU3NTEx',
    avatar_url: 'https://avatars0.githubusercontent.com/u/40357511?v=4',
    gravatar_id: '',
    url: 'https://api.github.com/users/bartekpacia',
    html_url: 'https://github.com/bartekpacia',
    followers_url: 'https://api.github.com/users/bartekpacia/followers',
    following_url: 'https://api.github.com/users/bartekpacia/following{/other_user}',
    gists_url: 'https://api.github.com/users/bartekpacia/gists{/gist_id}',
    starred_url: 'https://api.github.com/users/bartekpacia/starred{/owner}{/repo}',
    subscriptions_url: 'https://api.github.com/users/bartekpacia/subscriptions',
    organizations_url: 'https://api.github.com/users/bartekpacia/orgs',
    repos_url: 'https://api.github.com/users/bartekpacia/repos',
    events_url: 'https://api.github.com/users/bartekpacia/events{/privacy}',
    received_events_url: 'https://api.github.com/users/bartekpacia/received_events',
    type: 'User',
    site_admin: false
  },
  installation: {
    id: 10376642,
    node_id: 'MDIzOkludGVncmF0aW9uSW5zdGFsbGF0aW9uMTAzNzY2NDI='
  }
} satisfies PullRequestOpenedEvent
