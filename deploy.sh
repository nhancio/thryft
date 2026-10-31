#!/usr/bin/env bash
#
# Thryft — canonical deploy script (push to GitHub, then platform deploy).
#
# Step 1 (push):   git add -A, commit (message arg or a sensible default),
#                   push the current branch to GitHub.
# Step 2 (deploy): Netlify site "thryft1" (domain thryft.life) is confirmed
#                   git-linked to nhancio/thryft with continuous deployment
#                   (verified via the Netlify API) — every push to `main`
#                   already triggers a Netlify build + deploy per
#                   netlify.toml (npm run build -> publish dist/). So by
#                   default this script does NOT also run a manual Netlify
#                   deploy after pushing — that would be redundant.
#                   Pass --force-manual to run one anyway (e.g. if the
#                   Netlify git integration is ever broken/paused).
#
# Usage:
#   ./deploy.sh ["commit message"] [--force-manual]
#   ./deploy.sh -h | --help
#
set -euo pipefail
# Select the GitHub account for this repository before every push.
# Override GITHUB_ACCOUNT when a repository is intentionally owned by a different account.
GITHUB_ACCOUNT="${GITHUB_ACCOUNT:-didigamnithin}"

ensure_github_account() {
  command -v gh >/dev/null 2>&1 || {
    echo "GitHub CLI (gh) is required to push as $GITHUB_ACCOUNT." >&2
    echo "Install gh and authenticate with: gh auth login --hostname github.com" >&2
    return 1
  }
  gh auth token --hostname github.com --user "$GITHUB_ACCOUNT" >/dev/null 2>&1 || {
    echo "GitHub CLI is not authenticated as $GITHUB_ACCOUNT." >&2
    echo "Authenticate that account first, then rerun this deploy." >&2
    return 1
  }
  # Push as $GITHUB_ACCOUNT through git-credential-ghuser (see ~/.gitconfig-<company>)
  # instead of switching gh's active account for every other terminal and repo.
  export GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=credential.https://github.com.username GIT_CONFIG_VALUE_0="$GITHUB_ACCOUNT"
  echo "Using GitHub account: $GITHUB_ACCOUNT"
}

push_with_github_account() {
  ensure_github_account
  git push "$@"
}


ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"
# Deploys ship main: commit pending work, merge every local and GitHub branch
# into main, and push main before the deploy below runs. Anything unsafe (a
# merge conflict, a secret, dependency folder or >100 MB file about to be
# committed, a failed push) stops the deploy before it ships.
# Flags that skip git skip this too.
_sync_git() {
  if [ -n "${_SYNC_TOKEN:-}" ]; then
    GH_TOKEN="$_SYNC_TOKEN" git -c credential.helper= -c 'credential.helper=!gh auth git-credential' "$@"
  else
    git "$@"
  fi
}

# Unstages everything and fails if `git add -A` picked up a new file that must not be committed.
_sync_check_staged() {
  local raw big line meta path mode sha bad=""
  raw="$(git -c core.quotePath=false diff --cached --diff-filter=A --no-renames --raw --no-abbrev)"
  [ -n "$raw" ] || return 0
  big=" $(printf '%s\n' "$raw" | awk '$2 != "160000" {print $4}' \
    | git cat-file --batch-check='%(objectsize) %(objectname)' | awk '$1 > 100000000 {print $2}' | tr '\n' ' ')"
  while IFS= read -r line; do
    meta="${line%%	*}"; path="${line#*	}"
    read -r _ mode _ sha _ <<< "$meta"
    case "/$path" in
      */.env.example|*/.env.sample|*/.env.template|*.example) ;;
      */.env|*/.env.*|*.pem|*.key|*.p12|*.pfx|*.jks|*.keystore|*/id_rsa*|*/id_ed25519*|*service-account*.json|*serviceAccount*.json|*/credentials.json|*client_secret*.json)
        bad="$bad"$'\n'"  $path  (looks like a secret)" ;;
      */node_modules/*) bad="$bad"$'\n'"  $path  (dependency folder)" ;;
    esac
    case "$big" in *" $sha "*) bad="$bad"$'\n'"  $path  (over 100 MB; GitHub rejects it)" ;; esac
    if [ "$mode" = 160000 ] && ! git config -f .gitmodules --get-regexp '\.path$' 2>/dev/null | awk '{print $2}' | grep -qxF "$path"; then
      bad="$bad"$'\n'"  $path  (nested git repo; its files would not ship)"
    fi
  done <<< "$raw"
  [ -n "$bad" ] || return 0
  git reset -q
  echo "Deploy stopped: nothing was committed, because these new files should not go into git:$bad" >&2
  echo "Add them to .gitignore (or commit them yourself if they really belong in git), then rerun." >&2
  return 1
}

# Each app keeps its videos and marketing files in content/, which never goes into git.
_sync_ignore_content() {
  grep -qxF '/content/' .gitignore 2>/dev/null \
    || printf '\n# Videos and marketing content live here; never committed.\n/content/\n' >> .gitignore
  [ -z "$(git ls-files content)" ] || git rm -r -q --cached content
}

_sync_merge() {
  case "$1" in refs/heads/main|refs/remotes/origin/HEAD|*/gh-pages) return 0 ;; esac
  git merge-base --is-ancestor "$1" HEAD 2>/dev/null && return 0
  echo "Merging ${1#refs/}"
  git merge -q --no-edit "$1" && return 0
  git merge --abort 2>/dev/null || true
  echo "Deploy stopped: ${1#refs/} does not merge cleanly into main. Merge it by hand, then rerun." >&2
  return 1
}

sync_branches_into_main() {
  local arg ref start start_ref before tries _SYNC_TOKEN=""
  for arg in "$@"; do
    case "$arg" in -h|--help|--dry-run|--no-git|--no-push|--skip-push|--deploy-only) return 0 ;; esac
  done
  [ -z "${DEPLOY_BRANCHES_SYNCED:-}" ] || return 0
  if [ -f .git ] || [ "$(git rev-parse --show-toplevel 2>/dev/null)" != "$(pwd -P)" ]; then
    echo "Branch sync skipped: $(pwd) is not a standalone git repository."
    return 0
  fi
  git remote get-url origin >/dev/null 2>&1 || { echo "Branch sync skipped: no 'origin' remote."; return 0; }
  for ref in MERGE_HEAD CHERRY_PICK_HEAD REVERT_HEAD rebase-merge rebase-apply; do
    [ ! -e "$(git rev-parse --git-path "$ref")" ] || { echo "Deploy stopped: finish the in-progress git operation first." >&2; return 1; }
  done
  ref="$(git rev-parse --git-path index.lock)"
  [ ! -e "$ref" ] || { echo "Deploy stopped: another git command is running (or delete the stale $ref)." >&2; return 1; }
  case "$(git remote get-url origin)" in
    https://github.com/*)
      if [ -n "${GITHUB_ACCOUNT:-}" ] && command -v gh >/dev/null 2>&1; then
        _SYNC_TOKEN="$(gh auth token --hostname github.com --user "$GITHUB_ACCOUNT" 2>/dev/null)" \
          || { echo "Deploy stopped: GitHub CLI is not logged in as $GITHUB_ACCOUNT (gh auth login)." >&2; return 1; }
      fi ;;
  esac
  before="$(cksum < deploy.sh)"
  start="$(git symbolic-ref -q --short HEAD || git rev-parse --short HEAD)"

  echo "==> 1/3 Commit pending changes on $start"
  _sync_ignore_content || return 1
  git add -A || return 1
  _sync_check_staged || return 1
  git diff --cached --quiet || git commit -q -m "chore: commit pending changes before deploy" || return 1
  start_ref="$(git symbolic-ref -q HEAD || git rev-parse HEAD)"

  echo "==> 2/3 Merge local and GitHub branches into main"
  _sync_git fetch -q --prune origin || { echo "Deploy stopped: could not fetch from origin." >&2; return 1; }
  if git show-ref --verify --quiet refs/heads/main || git show-ref --verify --quiet refs/remotes/origin/main; then
    git checkout -q main || { echo "Deploy stopped: could not switch to main (git's reason is above)." >&2; return 1; }
  else
    git checkout -q -b main || return 1
  fi
  for ref in "$start_ref" $(git for-each-ref --format='%(refname)' refs/heads refs/remotes/origin); do
    _sync_merge "$ref" || { echo "You were on $start; you are now on main." >&2; return 1; }
  done

  echo "==> 3/3 Push main"
  for tries in 1 2; do
    _sync_git push -q -u origin main && break
    [ "$tries" = 1 ] || { echo "Deploy stopped: pushing main to origin failed." >&2; return 1; }
    echo "Push rejected; merging the latest origin/main and retrying."
    _sync_git fetch -q origin || return 1
    _sync_merge refs/remotes/origin/main || return 1
  done
  [ "$(_sync_git ls-remote origin refs/heads/main | cut -f1)" = "$(git rev-parse HEAD)" ] \
    || { echo "Deploy stopped: origin main does not match local main after the push." >&2; return 1; }

  export DEPLOY_BRANCHES_SYNCED=1
  if [ "$(cksum < deploy.sh)" != "$before" ]; then
    echo "deploy.sh changed in the merge; restarting with the merged version."
    exec bash ./deploy.sh "$@"
  fi
}
# A fresh checkout has no node_modules; install the locked dependencies before building.
_ensure_node_deps() {
  [ -f package.json ] && [ ! -d node_modules ] || return 0
  echo "==> Installing npm dependencies (node_modules is missing)"
  if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi \
    || { echo "Deploy stopped: npm could not install dependencies." >&2; return 1; }
}
sync_branches_into_main "$@" || exit 1
_ensure_node_deps || exit 1


REMOTE_NAME="origin"
REMOTE_URL="https://github.com/nhancio/thryft.git"
DEFAULT_BRANCH="main"

usage() {
  cat <<'EOF'
Usage: ./deploy.sh ["commit message"] [--force-manual]

  Step 1 (push):   git add -A, commit (default message if none given),
                   push the current branch to GitHub (origin).
  Step 2 (deploy): Netlify's GitHub integration (site "thryft1", domain
                   thryft.life) auto-deploys on every push to `main`, so by
                   default no manual deploy runs after the push.

Options:
  --force-manual   Also run a manual `netlify deploy --prod` from local
                   build output after pushing, even though Netlify's git
                   integration should already cover it. Requires the
                   Netlify CLI to be installed and authenticated
                   (and the site linked, or NETLIFY_SITE_ID / --site set).
  -h, --help       Show this help and exit.
EOF
}

FORCE_MANUAL=0
COMMIT_MSG=""

for arg in "$@"; do
  case "$arg" in
    -h|--help)
      usage
      exit 0
      ;;
    --force-manual)
      FORCE_MANUAL=1
      ;;
    *)
      if [ -z "$COMMIT_MSG" ]; then
        COMMIT_MSG="$arg"
      fi
      ;;
  esac
done

COMMIT_MSG="${COMMIT_MSG:-chore: automated commit}"

echo "================================================="
echo "Thryft deploy — Step 1: push to GitHub"
echo "================================================="

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "error: '$ROOT' is not a git repository yet." >&2
  echo "Run 'git init', then re-run this script to add the remote, commit, and push." >&2
  exit 1
fi

# Guard against `git add -A` silently swallowing a nested git repo (e.g. a
# cloned example/subproject) as an opaque gitlink instead of real files.
NESTED_REPOS="$(find . -mindepth 2 -name ".git" -not -path "./node_modules/*" 2>/dev/null || true)"
if [ -n "$NESTED_REPOS" ]; then
  echo "warning: nested git repositories found below the project root:" >&2
  echo "$NESTED_REPOS" >&2
  echo "these will be committed as submodule-style gitlinks, not their actual file contents." >&2
  echo "add a .gitmodules entry (or remove the nested .git) if that's not what you want." >&2
fi

if ! git remote get-url "$REMOTE_NAME" >/dev/null 2>&1; then
  echo "No '$REMOTE_NAME' remote configured — adding it: $REMOTE_URL"
  git remote add "$REMOTE_NAME" "$REMOTE_URL"
else
  CURRENT_URL="$(git remote get-url "$REMOTE_NAME")"
  if [ "$CURRENT_URL" != "$REMOTE_URL" ]; then
    echo "'$REMOTE_NAME' remote points to '$CURRENT_URL' — fixing to '$REMOTE_URL'"
    git remote set-url "$REMOTE_NAME" "$REMOTE_URL"
  fi
fi

git add -A

if git diff --cached --quiet; then
  echo "Nothing staged to commit — working tree matches the last commit."
else
  git commit -m "$COMMIT_MSG"
fi

CURRENT_BRANCH="$(git symbolic-ref --short -q HEAD || true)"
if [ -z "$CURRENT_BRANCH" ]; then
  echo "warning: HEAD is detached, defaulting to '$DEFAULT_BRANCH'." >&2
  CURRENT_BRANCH="$DEFAULT_BRANCH"
fi

echo "Pushing '$CURRENT_BRANCH' to '$REMOTE_NAME'..."
push_with_github_account -u "$REMOTE_NAME" "$CURRENT_BRANCH"

echo ""
echo "================================================="
echo "Thryft deploy — Step 2: platform deploy"
echo "================================================="

if [ "$FORCE_MANUAL" -eq 1 ]; then
  echo "--force-manual passed: running a manual Netlify deploy from local code..."
  if ! command -v netlify >/dev/null 2>&1; then
    echo "error: netlify CLI not found. Install it with 'npm i -g netlify-cli' (or use 'npx netlify-cli')." >&2
    exit 1
  fi
  npm install
  npm run build
  netlify deploy --prod --dir=dist --site=thryft1
else
  cat <<'EOF'
Netlify site "thryft1" (thryft.life) is git-linked to nhancio/thryft with
continuous deployment enabled (confirmed via the Netlify API) — this push
to GitHub will automatically trigger a Netlify build & deploy per
netlify.toml (npm run build -> publish dist/). No manual deploy needed.

Run './deploy.sh --force-manual' to also trigger a manual
`netlify deploy --prod` from local code (requires the Netlify CLI
installed & authenticated, with the site linked or reachable via
--site=thryft1 / NETLIFY_SITE_ID).
EOF
fi
