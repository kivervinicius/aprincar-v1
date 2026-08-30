# Aprincar — Post-Production Ecosystem Real Inventory

**Timestamp:** 2026-08-30T14:30:00Z  
**Source of Truth:** Live GitHub API & Git Remotes  
**Organization:** [`https://github.com/orgs/aprincar/repositories`](https://github.com/orgs/aprincar/repositories)  
**Total Active Repositories:** 9

---

## 1. Summary of Organization Repositories

| Repository                           | Role                | Default Branch | Current Main SHA                           | Main Protection | CI Status | Template Repo | GitHub Pages                                                                                 |
| :----------------------------------- | :------------------ | :------------- | :----------------------------------------- | :-------------- | :-------- | :------------ | :------------------------------------------------------------------------------------------- |
| **`aprincar/.github`**               | Governance & Health | `main`         | `2203a1f1aa40acb045efd777aa6f9f03d06d5768` | ✅ PROTECTED    | —         | No            | None                                                                                         |
| **`aprincar/platform`**              | Core PWA & Hub      | `main`         | `65c43103ed5677188b915dc84346cb3627453183` | ✅ PROTECTED    | ✅ PASS   | No            | [`https://aprincar.github.io/platform/`](https://aprincar.github.io/platform/)               |
| **`aprincar/games-official`**        | Canonical Games     | `main`         | `5029c1930eccdcb2dbde3994f16e3b377d3c3552` | ✅ PROTECTED    | ✅ PASS   | No            | [`https://aprincar.github.io/games-official/`](https://aprincar.github.io/games-official/)   |
| **`aprincar/community-games`**       | Community Catalog   | `main`         | `4236a85098907037724e83a60dc5dee654c6fc51` | ✅ PROTECTED    | ✅ PASS   | No            | [`https://aprincar.github.io/community-games/`](https://aprincar.github.io/community-games/) |
| **`aprincar/curriculum-bncc`**       | BNCC Crosswalk      | `main`         | `53d74f8cf7c64dba27fdcfa693c099f145894ebd` | ✅ PROTECTED    | ✅ PASS   | No            | None                                                                                         |
| **`aprincar/game-template-vite`**    | Vite Template       | `main`         | `7a607264a00412421e5562c9e493b075be16ac21` | ✅ PROTECTED    | ✅ PASS   | ✅ Yes        | None                                                                                         |
| **`aprincar/game-template-react`**   | React Template      | `main`         | `72783570029fa928f1efa03ed93d9f3c0a85d82d` | ✅ PROTECTED    | ✅ PASS   | ✅ Yes        | None                                                                                         |
| **`aprincar/game-template-phaser`**  | Phaser Template     | `main`         | `1930e977b9f9f3bdd6060c128f70712d851b31a4` | ✅ PROTECTED    | ✅ PASS   | ✅ Yes        | None                                                                                         |
| **`aprincar/game-template-threejs`** | Three.js Template   | `main`         | `b55a16e0a5b753c97483f7510fc6717e7c761eb9` | ✅ PROTECTED    | ✅ PASS   | ✅ Yes        | None                                                                                         |

---

## 2. Detailed Per-Repository Audit

### 2.1. `aprincar/.github`

- **Default Branch:** `main`
- **Current HEAD SHA:** `2203a1f1aa40acb045efd777aa6f9f03d06d5768`
- **Remote Branches:** `main` (0 stale branches)
- **Open PRs:** 0
- **Last Merged PR:** [PR #1](https://github.com/aprincar/.github/pull/1) — `feat(governance): add GITHUB_PRODUCTION_SETTINGS.md and update org documentation`
- **Main Protection:**
  - `enforce_admins: true`
  - `allow_force_pushes: false` (Block force push active)
  - `allow_deletions: false` (Block deletion active)
  - `required_pull_request_reviews`: 1 approving review required, dismiss stale reviews active
  - `required_conversation_resolution: true`
- **Topics:** `aprincar`, `community-health`, `governance`, `open-source`
- **Template Repository:** No

### 2.2. `aprincar/platform`

- **Default Branch:** `main`
- **Current HEAD SHA:** `65c43103ed5677188b915dc84346cb3627453183`
- **Remote Branches:** `main`, `dependabot/npm_and_yarn/production-87efac2322`
- **Open PRs:**
  - [PR #1](https://github.com/aprincar/platform/pull/1) — `chore(deps): bump lucide-react from 0.542.0 to 1.34.0` (Pending migration review, kept isolated)
- **Last Merged PRs:**
  - [PR #7](https://github.com/aprincar/platform/pull/7) — `docs(validation): add production-final-report.md, PRODUCTION_GO.md and live smoke spec`
  - [PR #6](https://github.com/aprincar/platform/pull/6) — `feat(platform): implement Mobile-First & Offline-First frontend v1, Brand System v3, Activity Engine and E2E suite`
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`verify` job from `ci.yml`)
  - `required_pull_request_reviews`: 1
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:**
  - `CI` (`.github/workflows/ci.yml`) -> `verify`, `canonical-games`
  - `Publish App and Hub to GitHub Pages` (`.github/workflows/pages.yml`)
  - `Security checks` (`.github/workflows/security.yml`)
  - `CodeQL` (`.github/workflows/codeql.yml`)
  - `Dependency Review` (`.github/workflows/dependency-review.yml`)
  - `Dependabot Updates` (`.github/workflows/dependabot.yml`)
- **Pages URL:** `https://aprincar.github.io/platform/` (Status: active, green)
- **Topics:** `aprincar`, `educational-games`, `offline-first`, `pwa`, `react`, `typescript`

### 2.3. `aprincar/games-official`

- **Default Branch:** `main`
- **Current HEAD SHA:** `5029c1930eccdcb2dbde3994f16e3b377d3c3552`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Last Merged PR:** [PR #3](https://github.com/aprincar/games-official/pull/3) — `feat(games): implement Brand System v3, procedural round cleanup and official game suite`
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`validate` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Games CI`, `Publish Registry to GitHub Pages`, `Security checks`
- **Pages URL:** `https://aprincar.github.io/games-official/`
- **Topics:** `aprincar`, `canvas`, `educational-games`, `offline-first`, `phaser`, `threejs`

### 2.4. `aprincar/community-games`

- **Default Branch:** `main`
- **Current HEAD SHA:** `4236a85098907037724e83a60dc5dee654c6fc51`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Last Merged PR:** [PR #2](https://github.com/aprincar/community-games/pull/2) — `feat(community): add explicit production validation and security gates`
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`validate` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Community Game Gate`, `Publish Registry to GitHub Pages`, `Security checks`
- **Pages URL:** `https://aprincar.github.io/community-games/`
- **Topics:** `aprincar`, `community-games`, `education`, `sandbox`, `validation`

### 2.5. `aprincar/curriculum-bncc`

- **Default Branch:** `main`
- **Current HEAD SHA:** `53d74f8cf7c64dba27fdcfa693c099f145894ebd`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Last Merged PR:** [PR #2](https://github.com/aprincar/curriculum-bncc/pull/2) — `feat(curriculum): validate BNCC skill snapshot consistency and catalog relations`
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`validate` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Crosswalk CI`, `Security checks`
- **Topics:** `aprincar`, `bncc`, `curriculum`, `early-childhood-education`, `learning-goals`

### 2.6. `aprincar/game-template-vite`

- **Default Branch:** `main`
- **Current HEAD SHA:** `7a607264a00412421e5562c9e493b075be16ac21`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Template Repository:** ✅ `is_template: true`
- **Last Merged PR:** [PR #2](https://github.com/aprincar/game-template-vite/pull/2)
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`build` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Template CI`, `Security checks`
- **Topics:** `aprincar`, `game-template`, `single-file-html`, `typescript`, `vite`

### 2.7. `aprincar/game-template-react`

- **Default Branch:** `main`
- **Current HEAD SHA:** `72783570029fa928f1efa03ed93d9f3c0a85d82d`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Template Repository:** ✅ `is_template: true`
- **Last Merged PR:** [PR #2](https://github.com/aprincar/game-template-react/pull/2)
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`build` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Template CI`, `Security checks`
- **Topics:** `aprincar`, `game-template`, `react`, `typescript`, `vite`

### 2.8. `aprincar/game-template-phaser`

- **Default Branch:** `main`
- **Current HEAD SHA:** `1930e977b9f9f3bdd6060c128f70712d851b31a4`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Template Repository:** ✅ `is_template: true`
- **Last Merged PR:** [PR #2](https://github.com/aprincar/game-template-phaser/pull/2)
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`build` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Template CI`, `Security checks`
- **Topics:** `aprincar`, `game-development`, `game-template`, `phaser`, `typescript`, `vite`

### 2.9. `aprincar/game-template-threejs`

- **Default Branch:** `main`
- **Current HEAD SHA:** `b55a16e0a5b753c97483f7510fc6717e7c761eb9`
- **Remote Branches:** `main`
- **Open PRs:** 0
- **Template Repository:** ✅ `is_template: true`
- **Last Merged PR:** [PR #2](https://github.com/aprincar/game-template-threejs/pull/2)
- **Main Protection:**
  - `enforce_admins: true`
  - `required_status_checks`: strict (`build` job from `ci.yml`)
  - `allow_force_pushes: false`
  - `allow_deletions: false`
- **Workflows:** `Template CI`, `Security checks`
- **Topics:** `3d`, `aprincar`, `game-template`, `threejs`, `typescript`, `vite`, `webgl`
