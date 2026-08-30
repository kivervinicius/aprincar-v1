# Aprincar — Production Workspace Bundle

Aprincar is an open-source, local-first learning-through-play platform. This bundle contains the complete production workspace used by the `aprincar` GitHub organization.

## Repositories

- `.github` — organization profile, contribution and support defaults.
- `platform` — App, Hub, extension contracts/runtime, storage, progress, rewards, PWA and E2E.
- `games-official` — canonical official game sources and immutable extension artifacts.
- `community-games` — community intake, validation and registry generation.
- `curriculum-bncc` — conservative Aprincar Skill Graph ↔ BNCC mappings.
- `game-template-vite`
- `game-template-react`
- `game-template-phaser`
- `game-template-threejs`

Each repository remains independently publishable. `games-official` is the canonical source of official game artifacts; App and Hub carry a verified deployment snapshot for bootstrap/offline distribution.

## Production validation

Run from this directory:

```bash
./validate-production.sh
```

The script installs missing dependencies with `npm ci`, validates all repositories, checks cross-repository schema/artifact parity and finally runs the Platform E2E suite. A normal local Chromium installed by Playwright is required for E2E.

For diagnostics in a restricted environment without browser/CDN or npm registry access:

```bash
SKIP_E2E=1 SKIP_NETWORK_AUDIT=1 ./validate-production.sh
```

Skip flags are diagnostic only and must not be used as the final release gate.

## Development

```bash
cd platform
npm ci
npm run dev       # App: http://localhost:4173
npm run dev:hub   # Hub: http://localhost:4174
```

## Licensing

Code is licensed under AGPL-3.0-only unless a repository/file states otherwise. Official educational/content assets use the content licensing policy documented by the relevant repository. Aprincar trademarks are governed separately by `platform/TRADEMARKS.md`.
