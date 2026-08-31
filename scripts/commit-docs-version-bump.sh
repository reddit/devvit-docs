#!/usr/bin/env bash
set -xeuo pipefail

# Commits & pushes the regenerated "next" docs (produced by `yarn bump-version
# minor|major` in the monorepo) as their own PR branch, so /docs/next/ documents
# the new in-development version.
#
# Unlike commit-docs-release.sh, this does NOT cut a frozen versioned snapshot or
# change which version is @latest - it only updates the current "next" docs.
#
# The version is derived automatically from the monorepo's lerna.json, so no manual
# input is required. Pass an explicit "X.Y" as the first argument to override, or set
# DEVVIT_MONOREPO_DIR if your monorepo checkout is not the sibling "../devvit".

MONOREPO_DIR="${DEVVIT_MONOREPO_DIR:-../devvit}"
VERSION="${1:-$(node -pe "require('${MONOREPO_DIR}/lerna.json').version.split('-')[0].split('.').slice(0, 2).join('.')")}"

BRANCH="next-docs-${VERSION}"
git checkout -b "${BRANCH}"
yarn
git add .
git commit -m "Update next docs for v${VERSION}"
git push --set-upstream origin "${BRANCH}"
echo "Pushed ${BRANCH} to remote - go open a PR!"
