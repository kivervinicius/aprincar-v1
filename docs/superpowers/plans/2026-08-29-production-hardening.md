# Aprincar V1 Production Hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a production-grade Aprincar V1 bundle with deterministic artifacts, hardened extension trust, correct offline behavior, cross-repository validation and deployment-blocking E2E.

**Architecture:** Preserve the current nine-repository ecosystem. Harden the existing extension platform and make `games-official` canonical while keeping a verified deploy snapshot in `platform`; make trust, cache and curriculum references explicit at runtime and in CI.

**Tech Stack:** Node.js 22, npm workspaces, TypeScript, React, Vite, Mantine, Dexie, Workbox/Vite PWA, Playwright, Phaser, Three.js, GitHub Actions.

**Spec:** `docs/superpowers/specs/2026-08-29-production-hardening-design.md`

## Global Constraints

- No game may be imported as an App React component.
- Game runtime stays inside sandboxed iframe with SDK/MessageChannel communication.
- Manifest version is `1`; SDK protocol is `1`; V1 engine range is `^1.0.0`.
- `games-official` is canonical for official artifacts.
- Library membership and offline cache are distinct.
- Community/experimental code cannot gain official pedagogical trust by declaring it in its manifest.
- No remote executable code in offline V1 game bundles.
- A production ZIP is only generated after aggregate verification succeeds.

---

### Task 1: Reconcile the local bundle with the published production shape

**Files:**
- Modify: `platform/.github/workflows/pages.yml`
- Modify: `platform/apps/app/public/registry.json`
- Modify: `platform/apps/hub/public/registry.json`
- Modify: platform deploy snapshot under both `public/extensions/`
- Create: `scripts/verify-official-sync.mjs`

**Interfaces:**
- Consumes: `games-official/dist/registry.json` and `games-official/dist/extensions/*`.
- Produces: byte-identical deploy snapshots and a consistency verifier with exit code 0/1.

- [ ] Regenerate official games and registry.
- [ ] Write a failing aggregate consistency check against the current App/Hub registry drift.
- [ ] Synchronize both platform public snapshots from canonical `games-official/dist`.
- [ ] Re-run the consistency check and require PASS.

### Task 2: Fix Hub production navigation and cover it with E2E

**Files:**
- Modify: `platform/apps/hub/src/main.tsx`
- Modify: `platform/.github/workflows/pages.yml`
- Test: `platform/e2e/hub.spec.ts` or existing Hub E2E suite.

**Interfaces:**
- Produces: `getAppBaseUrl()` behavior with no localhost fallback in deployed builds.

- [ ] Add an E2E assertion that Hub game links resolve under `/platform/app/play/...` in Pages-style build.
- [ ] Confirm the test fails against current fallback behavior.
- [ ] Implement environment/sibling URL resolution and set explicit Pages environment variable.
- [ ] Re-run Hub E2E.

### Task 3: Harden extension protocol and evidence trust

**Files:**
- Modify: `platform/packages/extension-sdk/src/protocol.ts`
- Modify: `platform/apps/app/src/game-services.ts`
- Modify: `platform/apps/app/src/pages/Play.tsx`
- Modify: `platform/packages/progress-engine/src/index.ts` only if trust weighting belongs in engine domain.
- Test: platform unit tests for protocol, trust and limits.

**Interfaces:**
- Consumes: registry `trust` from `RegistryEntry`.
- Produces: validated message payloads and `createGameServices(profileId, gameId, trust)`.

- [ ] Add failing tests for NaN/infinite numeric evidence, oversized storage, reward flooding and community/experimental trust semantics.
- [ ] Add message payload validators and finite numeric bounds.
- [ ] Pass registry trust from Play to game services.
- [ ] Add per-session quotas for evidence/reward/storage mutations.
- [ ] Ensure community evidence cannot by itself consolidate and experimental evidence does not mutate SkillState.
- [ ] Run focused tests and full platform tests.

### Task 4: Make offline caching match the local-first model

**Files:**
- Modify: `platform/apps/app/vite.config.ts`
- Modify: `platform/apps/app/src/sw.ts`
- Test: `platform/e2e/offline.spec.ts` or existing offline E2E suite.

**Interfaces:**
- Produces: shell precache without extension bundles and offline navigation fallback.

- [ ] Add tests for direct offline deep-route reload after first shell load and for games not being globally precached.
- [ ] Exclude `extensions/**` from injectManifest glob patterns.
- [ ] Implement navigation fallback to cached App shell.
- [ ] Verify explicit offline game preparation still works through ExtensionManager cache.
- [ ] Run production-preview offline E2E.

### Task 5: Strengthen curriculum referential integrity

**Files:**
- Create: `curriculum-bncc/references/bncc-v1.json`
- Keep/update: `curriculum-bncc/schemas/skill-ids.json`
- Modify: `curriculum-bncc/scripts/validate.mjs`
- Modify: `curriculum-bncc/README.md`

**Interfaces:**
- Produces: deterministic validator requiring both Skill and BNCC reference existence.

- [ ] Add a failing validator fixture/probe for unknown Skill ID and unknown BNCC code.
- [ ] Add a reference record for each currently mapped BNCC code only.
- [ ] Validate duplicates, relation type and referential integrity.
- [ ] Run curriculum CI command.

### Task 6: Harden official/community/template validators

**Files:**
- Modify: `games-official/scripts/validate.mjs`
- Modify: `community-games/scripts/validate.mjs`
- Modify: four template `scripts/package.mjs` and/or add `scripts/validate.mjs`
- Modify: four template `.github/workflows/ci.yml`
- Create/modify: aggregate parity verifier under root `scripts/`.

**Interfaces:**
- Consumes: platform manifest schema/skill ID snapshot semantics.
- Produces: equivalent core validation behavior across standalone repositories.

- [ ] Add negative tests/probes for remote executable code, manifest mismatch and unknown skill.
- [ ] Add integrity verification after packaging.
- [ ] Ensure each template CI runs build + package + validate.
- [ ] Add aggregate parity comparison for schema/skill snapshots.
- [ ] Run all repository checks.

### Task 7: Put E2E and consistency in deployment gates

**Files:**
- Modify: `platform/.github/workflows/ci.yml`
- Modify: `platform/.github/workflows/pages.yml`
- Modify: root `validate-production.sh`

**Interfaces:**
- Produces: one deterministic production gate used locally and mirrored in CI.

- [ ] Install Playwright Chromium in CI.
- [ ] Run Playwright after production build.
- [ ] Run official artifact consistency before deployment.
- [ ] Make Pages deployment depend on the production validation sequence.
- [ ] Keep timeouts bounded and cache npm only.

### Task 8: Production metadata, release and operator documentation

**Files:**
- Modify: repository READMEs as needed.
- Modify: `platform/CHANGELOG.md` or create if absent.
- Create: `GITHUB_PRODUCTION_SETTINGS.md`
- Modify: `platform/.github/dependabot.yml`
- Modify: `.github/profile/README.md`

**Interfaces:**
- Produces: explicit manual GitHub settings checklist and release compatibility contract.

- [ ] Document four repositories that must be marked as GitHub Templates.
- [ ] Document required branch/ruleset checks and force-push/delete protection.
- [ ] Separate Dependabot major updates from patch/minor groups.
- [ ] Document V1 manifest/SDK/engine compatibility and production URLs.

### Task 10: Rebuild brand and mobile-first UX

**Files:**
- Modify: `platform/packages/ui/src/index.tsx`
- Modify: `platform/apps/app/src/layout.tsx`
- Modify: `platform/apps/app/src/pages/Home.tsx`
- Modify: `platform/apps/app/src/pages/Onboarding.tsx`
- Modify: `platform/apps/app/src/pages/Play.tsx`
- Modify: `platform/apps/app/src/components/GameCard.tsx`
- Modify: `platform/apps/app/src/styles.css`
- Modify: `platform/apps/hub/src/main.tsx`
- Modify: `platform/apps/hub/src/styles.css`
- Modify: brand/PWA SVG and PNG assets under `platform/apps/app/public/`
- Test: `platform/packages/core-tests/brand-system.test.ts`
- Test: `platform/packages/core-tests/visual-contract.test.ts`
- Test: Playwright mobile UX specs

**Interfaces:**
- Produces: Brand System v3 and a mobile-first child shell without changing extension architecture.

- [ ] Change brand tests first to require the star mark, multicolor wordmark and canonical SVG assets; verify RED.
- [ ] Add mobile contract tests first for bottom navigation, safe-area handling, dynamic viewport game shell and responsive touch targets; verify RED.
- [ ] Implement Brand System v3 in shared UI and static assets.
- [ ] Rebuild child shell into desktop top nav + phone header/bottom nav.
- [ ] Restore a real five-step onboarding flow and persist profile preferences.
- [ ] Recompose Home and GameCard for mobile-first hierarchy and horizontal snap shelves.
- [ ] Make play routes fullscreen and dynamic-viewport/safe-area aware.
- [ ] Align Hub and Parent/Settings responsive treatment with the same visual language.
- [ ] Run unit/type/lint/build and mobile Playwright coverage.

### Task 9: Full verification and production ZIP

**Files:**
- Create/update: `_validation/production-hardening-report.md`
- Create: `validate-production.sh`
- Output: `/mnt/data/aprincar-v1-production.zip`
- Output: `/mnt/data/aprincar-v1-production.zip.sha256`

**Interfaces:**
- Produces: user-replaceable production bundle and cryptographic checksum.

- [ ] Run platform tests/typecheck/lint/build.
- [ ] Run Playwright E2E.
- [ ] Run official games tests/build/validate/syntax/registry consistency.
- [ ] Run community and curriculum validation.
- [ ] Run all four template install/build/package/validate checks.
- [ ] Run high-level dependency audits where lockfiles exist.
- [ ] Write final report with explicit PASS/FAIL evidence.
- [ ] Remove transient `node_modules`, test output and browser caches from ZIP.
- [ ] Build ZIP and verify with `unzip -t`.
- [ ] Generate SHA-256 checksum.
