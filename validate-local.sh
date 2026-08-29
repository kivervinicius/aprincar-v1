#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
(cd "$ROOT/platform" && node --experimental-strip-types --test packages/core-tests/*.test.ts && node scripts/check-boundaries.mjs)
(cd "$ROOT/games-official" && npm run check)
(cd "$ROOT/community-games" && npm run check)
(cd "$ROOT/curriculum-bncc" && npm run check)
echo "Dependency-independent Aprincar V1 gates passed."
echo "For full UI/template validation, run npm install/build in platform and each game-template repository."
