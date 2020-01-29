#!/bin/zsh
set -e
set -o pipefail

# Preconditions to run this script:
# 1. The current working directory is set to the root of the app (/app normally)
# 2. The current user has permission to create or modify the repository directory
# 3. The network works and GitHub allows fetching to the host running the script
# 4. REPO_URL is set to the URL of the repository
# 5. REPO_DIR is set to the repository directory

if [[ -z "$REPO_URL" || -z "$REPO_DIR" ]]; then
	exit 1
fi

# FD redirection magic to only allow explicit output to caller:
# stdout and stderr will be redirected to stderr. Only messages
# explicitly sent to &3 will be seen by the caller.
exec 3>&1 1>&2

# Label definitions
typeset -A LABELS
LABELS=(
	core              'Area: core'
	init              'Area: init'
	install           'Area: installer'
	update            'Area: updater'
	plugin            'Area: plugin'
	theme             'Area: theme'
	uninstall         'Area: uninstaller'
	new_plugin        'New: plugin'
	new_theme         'New: theme'
	plugin_aws        'Plugin: aws'
	plugin_git        'Plugin: git'
	plugin_mercurial  'Plugin: mercurial'
	plugin_tmux       'Plugin: tmux'
	alias             'Topic: alias'
	bindkey           'Topic: bindkey'
	completion        'Topic: completion'
	documentation     'Type: documentation'
	conflicts         'Status: conflicts'
)

# Return whether a merge was possible to know if there are conflicts
has_conflicts() {
	# user.name and user.email need to be set, otherwise a merge fails
	git -c user.name=bot -c user.email=b@o.t \
		merge --no-commit --no-ff $GITHUB_SHA &>/dev/null && ret=1 || ret=0
	git merge --abort &>/dev/null
	return $ret
}

# Return PR labels according to its changes
pr_labels() {
	local -aU labels files plugins themes
	local file plugin theme diff

	# Changed files
	files=("${(f)$(git diff --name-only HEAD...$GITHUB_SHA)}")

	# Filter files to only obtain core files (inside 'lib/' or 'tools/')
	if (( ${files[(I)lib/*|tools/*]} > 0 )); then
		labels+=($LABELS[core])
	fi

	# Filter files to only obtain changed plugins ('plugins/$name')
	plugins=(${(M)files#plugins/*/})
	if (( $#plugins > 0 )); then
		labels+=($LABELS[plugin])
		for plugin ($plugins); do
			# If the plugin doesn't exist mark it as new
			[[ ! -e "$plugin" ]] && labels+=($LABELS[new_plugin])
		done
	fi

	# Filter files to only obtain changed themes ('themes/$name.zsh-theme')
	themes=(${(M)files#themes/*.zsh-theme})
	if (( $#themes > 0 )); then
		labels+=($LABELS[theme])
		for theme ($themes); do
			[[ ! -e "$theme" ]] && labels+=($LABELS[new_theme])
		done
	fi

	# Loop over the rest of the files for miscellaneous tests
	for file ($files); do
		case $file in
			oh-my-zsh.(sh|.zsh)) labels+=($LABELS[init]) ;;
			tools/*upgrade.sh) labels+=($LABELS[update]) ;;
			tools/install.sh) labels+=($LABELS[install]) ;;
			tools/uninstall.sh) labels+=($LABELS[uninstall]) ;;
			plugins/aws/*) labels+=($LABELS[plugin_aws]) ;;
			plugins/git/*) labels+=($LABELS[plugin_git]) ;;
			plugins/mercurial/*) labels+=($LABELS[plugin_mercurial]) ;;
			plugins/tmux/*) labels+=($LABELS[plugin_tmux]) ;;
			(|*/)README.*) labels+=($LABELS[documentation]) ;;
		esac

		case ${file:t} in
			*.zsh) # check if or aliases or bindkeys are added, deleted or modified
				diff=$(git diff HEAD...$GITHUB_SHA -- $file)
				grep -q -E '^[-+] *alias ' <<< $diff && labels+=($LABELS[alias])
				grep -q -E '^[-+] *bindkey ' <<< $diff && labels+=($LABELS[bindkey]) ;;
			_*) # check if completion files are added, deleted or modified
				labels+=($LABELS[completion]) ;;
		esac
	done

	# Print labels in ascending order and quote for labels with spaces
	if (( $#labels > 0 )); then
		print -l ${(oq)labels}
	fi
}

main() {
	local -aU labels
	local number=$1

	# Get the latest changes or clone the repository if needed
	if [[ -d "$REPO_DIR/.git" ]]; then
		cd "$REPO_DIR"
		git fetch
	else
		git clone "$REPO_URL" "$REPO_DIR"
		cd "$REPO_DIR"
	fi
	# Make sure we're on master to correctly git-diff the changes of the Pull Request
	git checkout -q origin/master

	# Fetch Pull Request commits
	git fetch origin "refs/pull/${number}/head"
	# Both pr_labels and has_conflicts rely on $GITHUB_SHA
	GITHUB_SHA=$(git rev-parse FETCH_HEAD)

	# Creates an array of labels to apply to the PR being analyzed
	labels=("${(f)$(pr_labels)}")

	# Check if PR has conflicts with master
	if has_conflicts; then
		labels+=($LABELS[conflicts])
	fi

	# Output labels of PR in array form, consumable by JS
	if [[ -z "$labels" ]]; then
		echo >&3 "[]"
	else
		echo >&3 "["${(j:,:)${(qq)labels}}"]"
	fi
}

case "$LOG_LEVEL" in
	trace|debug) set -x ;;
esac

main "$@"
