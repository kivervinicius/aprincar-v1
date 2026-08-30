# APRINCAR PRODUCTION READINESS REPORT

## Executive verdict

**CONDITIONAL GO — production source candidate complete; two environment-backed release gates must still run on a normal workstation/CI: Playwright browser acceptance and registry-backed npm vulnerability audit.**

This package replaces the previous ZIP baselines. All deterministic source, architecture, gameplay, cross-repository, TypeScript, lint, formatting, build, manifest, integrity, package and dependency-tree gates that can execute without external network/browser policy access pass in the current workspace.

The final release command is:

```bash
./validate-production.sh
```

It does **not** skip Playwright or `npm audit` by default.

## Production changes included

- Brand System v3 using the approved friendly star character and multicolor Aprincar wordmark.
- Canonical vector brand assets shared by App, Hub, PWA and official game runtime.
- Child experience redesigned mobile-first while preserving the single-file MVP hierarchy.
- Dedicated mobile header + bottom navigation with iOS safe-area handling.
- Responsive acceptance rules for 320px phones through tablets and landscape phones.
- Five-step local onboarding restored.
- Fullscreen game runtime using dynamic viewport units (`dvh`/`svh`).
- Game Cards, Home, Discover, Library, Parent Mode and Hub made responsive.
- Hub production navigation no longer contains a localhost fallback.
- App bundle code-split; largest JS chunk is ~242 kB minified, below the previous >500 kB warning.
- PWA precaches the App Shell while extension/game bundles remain cache-on-demand.
- `games-official` is the canonical source for official artifacts; App/Hub deployment snapshots are hash-verified.
- Evidence Trust Policy: Community evidence cannot independently consolidate mastery; Experimental evidence does not mutate pedagogical state.
- SDK message payload validation, finite-number validation and per-session runtime budgets.
- Canonical extension validator/schema/Skill snapshots synchronized across official, community and templates.
- BNCC mapping validation now enforces Aprincar Skill IDs, known BNCC reference codes and duplicate prevention.
- CI and Pages deployment require semantic/responsive Playwright E2E.
- Phaser painting, handwriting, round listener lifecycle and Three.js drag/tap handling hardened.
- Production TypeScript gate consolidated into one deterministic project (`tsconfig.all.json`).
- Production build gate explicitly builds App and Hub instead of relying on npm workspace aggregation behavior.

## Fresh verification evidence

| Gate | Status | Fresh evidence |
| --- | --- | --- |
| Platform Core tests | PASS | 30/30 |
| Platform TypeScript | PASS | unified App/Hub/packages `tsc -p tsconfig.all.json` |
| ESLint | PASS | 0 errors |
| Prettier | PASS | all matched files formatted |
| App production build | PASS | Vite + PWA |
| Hub production build | PASS | Vite |
| App largest JS chunk | PASS | ~241.82 kB minified |
| PWA shell precache | PASS | 20 entries, ~1.03 MiB; extension bundles excluded |
| Official snapshot validation | PASS | 10 games |
| Production dependency tree | PASS | `npm ls --omit=dev --all` exit 0 |
| games-official tests | PASS | 12/12 |
| Challenge property/fuzz generation | PASS | 20,000 generated challenges, 0 invariant failures |
| Official game build | PASS | 10 games |
| Generated inline JS syntax | PASS | 10/10 |
| Official manifest validation | PASS | 10/10 |
| Official registry generation | PASS | 10 entries |
| Community tests | PASS | 2/2 |
| Community package validation | PASS | 1 package |
| Community registry generation | PASS | 1 entry |
| BNCC tests | PASS | 4/4 |
| BNCC crosswalk | PASS | 6 mappings / 46 Aprincar Skills / 5 reference codes |
| Vite game template | PASS | test + build + package + validate |
| React game template | PASS | test + build + package + validate |
| Phaser game template | PASS | test + build + package + validate |
| Three.js game template | PASS | test + build + package + validate |
| Official App/Hub artifact parity | PASS | registry + manifests + game HTML + integrity |
| Validator/schema/Skill snapshot parity | PASS | cross-repository |
| Hub production localhost scan | PASS | no `localhost:4173` in built Hub |
| PWA extension-precache scan | PASS | no extension URLs in generated service-worker precache |
| Secret-pattern scan | PASS | no obvious private-key/GitHub/OpenAI/AWS credential patterns in source scan |
| Vendored runtime licenses | PASS | Phaser MIT and Three.js MIT license texts included |
| Playwright definitions | READY | 27 tests in 9 files |
| Playwright execution here | ENVIRONMENT BLOCKED | system Chromium returns `ERR_BLOCKED_BY_ADMINISTRATOR` for `http://localhost:4173` |
| Registry-backed `npm audit` here | ENVIRONMENT BLOCKED | npm registry DNS returns `EAI_AGAIN` |

The non-browser automated test count is **52 tests**: 30 Platform + 12 official games + 2 community + 4 BNCC + 4 template contract tests. The Playwright suite adds **27 browser tests** when executed in normal CI/local conditions.

## Mobile/browser acceptance encoded in Playwright

Phone portrait:

- 320×568
- 360×800
- 375×667
- 390×844
- 412×915
- 430×932

Tablet:

- 768×1024
- 820×1180

Landscape:

- 667×375
- 844×390

Browser scenarios additionally cover onboarding, multiple profiles, Parent Mode/PIN/screen time, offline library persistence, Hub → App navigation, fullscreen gameplay and semantic behavior for all 10 official game families.

## Why Playwright cannot run in this container

The only installed Chromium is managed by an enterprise policy containing:

```json
"URLBlocklist": ["*"]
```

The attempted browser test fails before application code executes:

```text
page.goto: net::ERR_BLOCKED_BY_ADMINISTRATOR at http://localhost:4173/
```

Downloading Playwright's own Chromium is also unavailable because this execution environment cannot resolve the Playwright CDN. No policy bypass was attempted.

## Why npm audit cannot run in this container

The fresh command:

```bash
npm audit --omit=dev --audit-level=high
```

fails before receiving vulnerability data:

```text
getaddrinfo EAI_AGAIN registry.npmjs.org
```

This is not recorded as PASS. The normal release script keeps the audit mandatory.

## Final release condition

On the target developer machine or CI runner, run exactly:

```bash
./validate-production.sh
```

A final **GO** requires that command to exit 0 without `SKIP_E2E` or `SKIP_NETWORK_AUDIT`.

For diagnostics only in an isolated/restricted environment:

```bash
SKIP_E2E=1 SKIP_NETWORK_AUDIT=1 ./validate-production.sh
```

The diagnostic command is not release approval.

## GitHub settings outside the ZIP

Source code cannot toggle these account/repository settings. After replacing/publishing the repositories, confirm:

- `game-template-vite`, `game-template-react`, `game-template-phaser`, `game-template-threejs` are marked as Template repositories;
- organization/repository rulesets protect `main`, require PR review and required CI/security/E2E checks, and block force-push/delete;
- secret scanning, push protection and private vulnerability reporting are enabled where available;
- repository descriptions, topics and homepages match `GITHUB_SETUP.md`;
- a formal release/tag is published only after the default production validation passes.

## Recommendation

Use this bundle as the **production replacement candidate**. Do not use previous Aprincar ZIPs as the source of truth. Promote it to a formal production release only after `./validate-production.sh` passes on the target workstation/CI runner.
