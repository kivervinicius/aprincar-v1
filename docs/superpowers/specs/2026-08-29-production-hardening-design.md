# Aprincar V1 Production Hardening Design

## Objective

Turn the currently published Aprincar organization into a production-grade V1 bundle without rewriting the architecture. Preserve the nine-repository topology and harden the boundaries that are already in place: canonical artifacts, extension validation, runtime trust, offline behavior, CI/CD, curriculum integrity, release/versioning and GitHub governance metadata.

## Scope

Repositories in scope:

- `.github`
- `platform`
- `games-official`
- `community-games`
- `curriculum-bncc`
- `game-template-vite`
- `game-template-react`
- `game-template-phaser`
- `game-template-threejs`

The deliverable is a local replacement bundle containing all repositories plus deterministic validation scripts and a final production-readiness report.

## Architecture Decisions

### 1. Canonical game artifacts

`games-official` is the canonical source for official `manifest.json`, `game.html`, integrity metadata and registry entries. The platform may contain a synchronized deploy snapshot, but that snapshot must be generated or verified from `games-official`; App and Hub cannot maintain independent registries by hand.

A cross-repository consistency gate must prove that:

- each official game exists in both platform deploy surfaces when bundled locally;
- App and Hub copies are byte-identical;
- `integrity.json` equals SHA-256 of `game.html`;
- registry integrity equals SHA-256 of `game.html`;
- manifest `id` and `version` equal registry identity;
- official registry entries are identical between App and Hub after URL normalization.

### 2. Hub production routing

Hub navigation to the App must never fall back to localhost in a production build. It uses `VITE_APRINCAR_APP_URL` when explicitly supplied and otherwise derives the sibling App URL from `BASE_URL`/current deployment. GitHub Pages build must set an explicit `/platform/app` target and E2E must assert it.

### 3. Runtime evidence trust

Extension trust is part of the runtime input. `official` and `curated` extensions may update pedagogical progress normally. `community` evidence is accepted into the ledger but is down-weighted and cannot independently cause a consolidated state. `experimental` evidence is stored as observational telemetry and cannot update pedagogical SkillState.

All extension messages receive runtime payload validation and finite numeric bounds. Evidence, reward and storage calls are rate/size limited per game session to prevent a game from flooding the host.

### 4. PWA/offline model

The service worker precaches the application shell and static UI assets but excludes `/extensions/**` from global precache. Game availability offline is controlled by the extension cache through explicit resolve/pin behavior. The navigation strategy includes an App-shell fallback so direct offline reload of an internal route works after the shell has been cached.

Library membership and offline cache remain separate concepts.

### 5. Canonical extension validator

The implementation in `platform/packages/extension-validator` is the reference behavior. Repositories that cannot consume the package directly in isolation keep a small local CLI, but parity is machine-checked against platform schemas/skill ids as part of the aggregate production gate. Templates validate manifest, bundle mode, remote executable code and integrity, not only `vite build`.

### 6. Curriculum integrity

`curriculum-bncc` includes an explicit versioned BNCC reference catalog for every BNCC code used by the current crosswalk and a versioned Aprincar Skill ID snapshot. Validation fails when a mapping references a missing Skill ID, a missing BNCC code, a duplicate pair/relation or unsupported relation type.

The mapping remains conservative and does not claim that a game or Skill is equivalent to full BNCC mastery.

### 7. CI/CD

`platform` CI runs unit tests, typecheck, lint, build, boundary checks and Playwright E2E. GitHub Pages deployment depends on the same production gate and validates registry/artifact consistency before upload. Security workflows continue to audit high/critical dependency findings.

Official games, community games, curriculum and all templates keep repository-local CI plus aggregate local verification.

### 8. Release compatibility

Platform owns the V1 compatibility contract:

- Manifest version: `1`
- SDK protocol: `1`
- Aprincar engine range for V1 games: `^1.0.0`

A release readiness document and changelog entry identify this bundle as the production candidate without fabricating a GitHub Release that is not actually published.

### 9. GitHub governance and metadata

Repository documentation must explain purpose, production commands and compatibility. A `GITHUB_PRODUCTION_SETTINGS.md` checklist records settings that cannot be encoded in repository files, including marking the four game repositories as GitHub Template Repositories and enabling organization/repository rulesets.

Dependabot major upgrades stay separated from patch/minor automation; no automatic merge of grouped ecosystem majors is assumed.


### 10. Production brand and mobile-first child experience

The single-file MVP remains the structural UX baseline, but the production UI is mobile-first rather than a desktop layout collapsed by media queries. The approved brand direction is a clean vector identity derived from the yellow star character concept: a reusable star mark, multicolor Aprincar wordmark and a richer mascot illustration for hero/onboarding use. Raster AI artwork is reference material only and is never the canonical logo asset.

Child navigation uses a compact logo/profile header plus a fixed safe-area-aware bottom navigation on phones. Responsible/settings controls remain available through the profile/adult affordance instead of occupying the child's primary navigation. Game routes suppress the normal shell and use a dedicated fullscreen runtime based on dynamic viewport units.

Responsive acceptance covers 320, 360, 375, 390, 393, 412 and 430 px phone widths plus 768/820 px tablets, including portrait/landscape behavior, 44 px minimum interactive targets, safe areas, no accidental horizontal overflow, touch-first game interaction and keyboard-safe onboarding. Home shelves use horizontal snap on phones; discovery/library use adaptive grids. Parent mode becomes a compact scrollable tab/section navigation instead of a desktop sidebar on small screens.

## Security Model

Games remain untrusted code. The host keeps `sandbox="allow-scripts"`, no same-origin privilege, no direct parent DOM access and CSP default deny. Network access is granted only when permission is declared. Remote executable code is rejected by the extension manager. Integrity is verified before caching.

Runtime hardening adds payload schemas, numeric clamping/rejection, per-session rate limits and storage-size limits. Trust level is never taken from the game manifest; it comes from the registry entry selected by the host.

## Testing and Acceptance

Production acceptance requires all of the following:

1. Platform unit tests pass.
2. TypeScript, lint and production build pass.
3. Platform Playwright suite passes, including Hub-to-App and offline deep-route tests.
4. Official games generate deterministically, validate, syntax-check and match platform deploy snapshots.
5. Community gate rejects forbidden remote executable code and invalid manifest/skills.
6. Curriculum crosswalk validates referential integrity.
7. All four templates install/build/package/validate to a self-contained single HTML artifact.
8. `npm audit --audit-level=high` reports no blocking findings in roots with lockfiles.
9. Aggregate `validate-production.sh` finishes with exit code 0.
10. Final report contains no unresolved P0/P1 production blockers.

## Non-goals

- Cloud account/synchronization backend.
- Institutional Aprincar Connect.
- Expanding the BNCC crosswalk beyond the codes already mapped in V1.
- Replacing Phaser/Three.js.
- Publishing GitHub settings through unsupported APIs from the local bundle.
