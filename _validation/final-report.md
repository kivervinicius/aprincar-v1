# APRINCAR V1 FINAL VALIDATION REPORT

## Executive Verdict

**GO**

The local bundle meets the defined unconditional acceptance gates: dependencies install, core checks pass, production builds complete, all 15 Playwright scenarios pass, official games validate, offline behavior passes the specified flow, and no high/critical dependency findings remain. Non-blocking P2 follow-ups remain listed below.

## Environment

- Node: v22.17.0
- npm: 10.9.2
- OS: Linux Dev-Web-Kiver, kernel 6.17.0-23-generic, x86_64
- Browser: `/usr/bin/google-chrome`; Playwright Chromium installed and used; WebGL rendered through Chrome/SwiftShader
- Commit/working tree: nested canonical repositories present; changes from this validation are currently uncommitted
- Full environment inventory: `_validation/environment.md`

## Quality Gates

| Gate | Status | Evidence |
|---|---|---|
| Dependencies installed | PASS | `npm ci` platform/templates; `npm install --ignore-scripts` for lockless roots; all 8 roots audited |
| Core tests | PASS | Platform 18/18; official generator tests 5/5 |
| TypeScript | PASS | `npm run typecheck` in platform and template builds |
| Lint | PASS | `platform npm run lint` |
| Format | PASS | `platform npx prettier --check e2e/*.ts` and `npm run format:check` |
| Production builds | PASS | App, Hub, official games, and four templates |
| E2E | PASS | 15/15 Playwright scenarios in Chromium |
| PWA offline | PASS | Production preview: cache, network cut, root reload, internal navigation, cached game open, reconnection |
| Security audit | PASS | `npm audit --audit-level=high`: 0 vulnerabilities in all 8 roots |

## App

Verified in Chromium: first opening, onboarding, profile creation, multiple profiles and switching, Child Home, Discover, library, settings, community filtering, parent PIN, screen-time limit, reload persistence, and local storage behavior.

## Visual Parity

The approved custom visual contract is present in the live App and screenshots: Aprincar mark, warm cream/purple palette, rounded surfaces, child-oriented shelves, custom hero, game cards, Parent Mode, onboarding, and game scenes. Child Mode does not use a generic Mantine dashboard composition.

Screenshots captured in `_validation/screenshots/`:

- `child-home.png`
- `hub.png`
- `parent.png`
- `onboarding.png`
- `game-memory.png`
- `game-counting.png`
- `game-3d.png`

## Hub

The separate Hub dev app opened at port 4174 and was captured in `hub.png`; its public catalog rendered 10 official games with filtering and registry metadata.

## Games

| Game | Engine | Build | Browser render | Semantic gameplay | Offline artifact |
|---|---|---|---|---|---|
| block-tower | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |
| color-match | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |
| counting-animals | Phaser | PASS | PASS; wrong/correct/advance E2E | PASS | Manifest `offline: true` |
| fruit-basket | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |
| letter-hunt | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |
| memory-animals | Phaser | PASS | PASS semantic gameplay; screenshot | PASS | Manifest `offline: true` |
| paint-free | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |
| pattern-play | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |
| space-shapes-3d | Three.js | PASS | PASS WebGL and semantic interaction; screenshot | PASS | Manifest `offline: true` |
| write-a | Phaser | PASS | PASS semantic gameplay | PASS | Manifest `offline: true` |

Official build produced 10 games, syntax checked 10 generated HTML files, validated 10 manifests, and generated the official registry with integrity hashes. The shared Phaser runtime exposes semantic interaction state for E2E verification and includes touch-friendly input, correct/incorrect feedback, and round transitions.

## Challenge Fuzzing

PASS: 20,000 seeds across counting, colors, patterns, letters, and memory. Full details: `_validation/challenge-fuzz-report.md`.

## PWA / Offline

PASS for the specified operational flow. The production build contains manifest, PNG/SVG icons, service worker, and 42 precache entries. A real Chromium context cached “Mundo das Cores”, went offline, reloaded the root App, navigated internally to the library, opened the cached game, and recovered after reconnection.

Direct reload of `/library` while offline returned `ERR_FAILED` in a separate probe. The required flow reloads the root App before internal navigation; the deep-route behavior remains a P2 follow-up.

## Skill / Progress

PASS for covered core invariants: evidence from different games consolidates into one SkillState, games cannot emit undeclared skills, a single context does not mark mastery, and Reward Engine is independent from Progress Engine. The full three-game browser scenario was not implemented as a dedicated E2E test.

## BNCC

PASS for current infrastructure: 6 conservative mappings validated; mappings reference Aprincar Skill IDs and BNCC codes through the curriculum crosswalk, with no direct game-to-BNCC declarations.

## Security

PASS for runtime boundaries and dependency audit: sandbox `allow-scripts` only, no same-origin access, CSP blocks network for normal games, MessageChannel protocol validation, permission checks, isolated game storage, and no App imports from `games/*`.

Static `new Function`, `XMLHttpRequest`, and documentation URLs occur inside vendored Phaser/Three bundles. They are not loaded remotely; vendor licenses accompany them. This is a P2 hardening item if the project adopts a zero-dynamic-code static policy.

## Licenses

AGPL-3.0-only files are present for code roots; content license and trademarks documents are present; vendored Phaser and Three.js license files are present under `games-official/vendor/`. No unlicensed remote assets were found in the validated artifact path.

## GitHub / Community

Present and inspected: organization-level contribution, conduct, security, support, issue/PR templates; platform CODEOWNERS, Dependabot, CodeQL, CI, dependency review, and artifact workflows; official/community/template CI workflows; community and curriculum CODEOWNERS.

All four official templates installed and built into self-contained `package/` artifacts with manifest and integrity files.

## Performance

App and Hub production builds complete. Vite reports one non-blocking warning: the App JavaScript chunk is approximately 710 kB minified, above the 500 kB advisory threshold. Phaser and Three.js single-file artifacts are intentionally larger because they vendor their engines.

## Remaining Issues

### P0

None found.

### P1

None found.

### P2

- Direct offline reload of a deep `/library` route is not supported by the current preview fallback probe.
- App production JavaScript chunk exceeds Vite's advisory 500 kB threshold.
- A dedicated three-game shared-skill browser scenario remains a P2 coverage improvement; the core invariant tests pass.
- Canonical repositories have committed validation fixes on the published branch; the local root aggregator is separate from those repositories.
- Vendored engine bundles contain static dynamic-code/network API strings; CSP and no-remote checks pass, but a stricter static policy would require vendor review.

### P3

- Browser smoke contexts report the expected service-worker-disabled warning when service workers are deliberately blocked for isolation.
- npm emits deprecation warnings for transitive `glob` and `eslint` versions; no audit vulnerabilities were reported.

## Final Recommendation

**GO** for publication under the defined acceptance contract. P0/P1 are clear, all 15 Playwright scenarios pass, and dependency audits report no high/critical findings. Address the listed P2 follow-ups in subsequent maintenance work; they do not invalidate the specified acceptance flow.
