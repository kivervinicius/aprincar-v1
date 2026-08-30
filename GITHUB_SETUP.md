# GitHub organization setup

Create organization `aprincar` and these repositories:

- `.github`
- `platform`
- `games-official`
- `community-games`
- `curriculum-bncc`
- `game-template-vite`
- `game-template-react`
- `game-template-phaser`
- `game-template-threejs`

Create teams used by CODEOWNERS before enabling mandatory review:

- `maintainers`
- `platform-maintainers`
- `game-reviewers`
- `pedagogy-reviewers`
- `community-reviewers`
- `security-reviewers`

Recommended repository ruleset on `main`: pull request required, at least one approval, Code Owner approval on protected paths, required CI checks, conversation resolution, no force-push, no branch deletion. `community-games` should never accept direct pushes to `main`.

Enable Dependabot alerts/updates, secret scanning, push protection and private vulnerability reporting where available.

## Registry publication

`games-official` and `community-games` include Pages workflows. Enable GitHub Pages with **GitHub Actions** as source. For production CDN/custom domain, set repository variable `APRINCAR_GAMES_BASE_URL` to the public base URL before generating registries, for example `https://games.aprincar.org/official`.

The platform reads multiple registries using `VITE_APRINCAR_REGISTRY_URLS` (comma-separated). Child Mode displays Official + Curated by default; Community must be enabled by the responsible adult.

## Template repositories

After publishing the four starter repositories, enable **Template repository** in GitHub repository settings for:

- `game-template-vite`
- `game-template-react`
- `game-template-phaser`
- `game-template-threejs`

## Required checks

For `platform`, require the CI workflow that includes unit/type/lint/build, official artifact parity and Playwright semantic/responsive E2E before merging to `main`. GitHub Pages deployment already declares the browser validation job as a prerequisite in source.
