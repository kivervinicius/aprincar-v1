#!/usr/bin/env bash
set -euo pipefail
ORG="${ORG:-aprincar}"
command -v gh >/dev/null || { echo "GitHub CLI (gh) is required" >&2; exit 1; }
gh auth status >/dev/null
repos=(.github platform games-official community-games curriculum-bncc game-template-vite game-template-react game-template-phaser game-template-threejs)
for repo in "${repos[@]}"; do
  dir="$(cd "$(dirname "$0")/$repo" && pwd)"
  echo "==> $ORG/$repo"
  if ! gh repo view "$ORG/$repo" >/dev/null 2>&1; then gh repo create "$ORG/$repo" --public --description "Aprincar — $repo"; fi
  if [ ! -d "$dir/.git" ]; then git -C "$dir" init -b main; git -C "$dir" add .; git -C "$dir" commit -m "chore: bootstrap Aprincar V1"; fi
  git -C "$dir" remote get-url origin >/dev/null 2>&1 || git -C "$dir" remote add origin "git@github.com:$ORG/$repo.git"
  git -C "$dir" push -u origin main
 done
