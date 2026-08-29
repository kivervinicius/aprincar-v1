# Platform development

## Requirements

Node 22 and npm 10. Run `npm install` from this directory.

## Commands

```bash
npm run dev
npm run dev:hub
npm run test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
npm run check
```

The E2E suite uses Playwright. Set `PLAYWRIGHT_EXECUTABLE_PATH` when the environment does not use the bundled browser.

## Local hooks

Husky is installed by `npm install`. The commit hook checks staged files for common secrets and formats staged files. The push hook runs the unit tests.

## Adding an extension

Build the game in its own repository, validate its manifest and registry entry, then publish the immutable artifact. The App consumes registry artifacts; it does not import `games/*`.
