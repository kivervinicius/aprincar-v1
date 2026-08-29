# Final local acceptance commands

Run these on a machine where the browser can access localhost and npm registry is available.

```bash
cd platform
npm ci
npm run test
npm run typecheck
npm run lint
npm run format:check
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --audit-level=high

cd ../games-official
npm install
npm run check
npm audit --audit-level=high

cd ../community-games
npm install
npm run check
npm audit --audit-level=high

cd ../curriculum-bncc
npm install
npm run check
npm audit --audit-level=high

cd ..
for d in game-template-vite game-template-react game-template-phaser game-template-threejs; do
  (cd "$d" && npm ci && npm run check && npm audit --audit-level=high)
done
```

Unconditional GO requires all 15 Playwright scenarios to pass and no unresolved high/critical dependency findings.
