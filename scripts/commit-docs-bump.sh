#!/usr/bin/env bash
set -xeuo pipefail

git checkout -b docs-release-$1
git add .
git commit -m "v$1 release"
git push --set-upstream origin docs-release-$1
echo "Pushed docs-release-$1 to remote - go open a PR!"
