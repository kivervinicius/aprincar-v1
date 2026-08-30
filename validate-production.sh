#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

need_node() {
  command -v node >/dev/null 2>&1 || { echo "Node.js 22+ is required" >&2; exit 1; }
  local major
  major="$(node -p 'Number(process.versions.node.split(".")[0])')"
  (( major >= 22 )) || { echo "Node.js 22+ is required; found $(node -v)" >&2; exit 1; }
}

install_if_needed() {
  local dir="$1"
  if [[ -f "$dir/package-lock.json" && ! -d "$dir/node_modules" ]]; then
    echo "== npm ci: ${dir#$ROOT/} =="
    (cd "$dir" && npm ci)
  fi
}

run_repo() {
  local dir="$1"
  echo "== validate: ${dir#$ROOT/} =="
  install_if_needed "$dir"
  (cd "$dir" && npm run check)
}

need_node

run_repo "$ROOT/games-official"
run_repo "$ROOT/community-games"
run_repo "$ROOT/curriculum-bncc"
for repo in game-template-vite game-template-react game-template-phaser game-template-threejs; do
  run_repo "$ROOT/$repo"
done

node "$ROOT/scripts/verify-official-sync.mjs"
node "$ROOT/scripts/verify-validator-parity.mjs"

install_if_needed "$ROOT/platform"
cd "$ROOT/platform"
npm run test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run verify:official
npm ls --omit=dev --all >/dev/null

if [[ "${SKIP_NETWORK_AUDIT:-0}" != "1" ]]; then
  npm audit --omit=dev --audit-level=high
else
  echo "WARNING: SKIP_NETWORK_AUDIT=1 — registry-backed vulnerability audit was not executed."
fi

if [[ "${SKIP_E2E:-0}" != "1" ]]; then
  if [[ -z "${PLAYWRIGHT_EXECUTABLE_PATH:-}" ]]; then
    npx playwright install chromium
  fi
  npm run test:e2e
else
  echo "WARNING: SKIP_E2E=1 — browser acceptance was not executed."
fi

echo "Aprincar production validation completed."
