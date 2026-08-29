# Aprincar MVP & Gameplay Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the React V1 match the approved single-file MVP interaction model and make all ten bundled games semantically playable and recoverable.

**Architecture:** Preserve the platform kernel and Extension/GameHost boundaries. Restore missing App UX at the React layer and isolate gameplay state into pure helpers consumed by Phaser/Three runtimes so correctness can be tested without rendering.

**Tech Stack:** React, TypeScript, Mantine primitives, TanStack Router, Dexie, Phaser, Three.js, Node test runner, Playwright.

**Spec:** `docs/superpowers/specs/2026-08-29-mvp-gameplay-parity-design.md`

## Global Constraints

- `aprincar-ux-baseline.html` is the structural/interaction contract.
- Do not import official games directly into the App.
- Challenge generators determine answer truth; renderers do not.
- Keep all games self-contained/offline.
- No skipped tests or broad suppressions.

---

### Task 1: Restore onboarding and runtime UX

**Files:**
- Modify: `platform/packages/storage/src/index.ts`
- Modify: `platform/apps/app/src/app-store.tsx`
- Modify: `platform/apps/app/src/pages/Onboarding.tsx`
- Modify: `platform/apps/app/src/layout.tsx`
- Modify: `platform/apps/app/src/pages/Play.tsx`
- Modify: `platform/apps/app/src/styles.css`
- Test: `platform/packages/core-tests/visual-contract.test.ts`

**Interfaces:**
- Produces persisted `ChildProfile` metadata: avatar, abilities, interests, optional daily limit.
- Produces `.game-runtime` full-screen route composition.

- [ ] Write failing source-contract tests for five onboarding steps and dedicated game runtime.
- [ ] Run platform unit tests and confirm RED.
- [ ] Implement five-step onboarding and profile metadata persistence.
- [ ] Implement full-screen Game Runtime with exit action and hide normal shell during `/play/*`.
- [ ] Run tests/typecheck/lint and confirm GREEN.

### Task 2: Add pure gameplay state helpers

**Files:**
- Create: `games-official/src/runtime/gameplay-state.mjs`
- Modify: `games-official/tests/challenges.test.mjs`
- Modify: `games-official/scripts/build-games.mjs`

**Interfaces:**
- Produces `togglePicked`, `selectionCount`, `classifyPointerGesture`, `drawingIsNonEmpty`.

- [ ] Write failing tests for reversible selections, gesture classification and drawing state.
- [ ] Run official tests and confirm RED.
- [ ] Implement pure helpers.
- [ ] Inline helpers before Phaser/Three runtimes in generated games.
- [ ] Run tests and confirm GREEN.

### Task 3: Repair Phaser games

**Files:**
- Modify: `games-official/src/runtime/phaser-runtime.js`
- Modify: `games-official/src/config/games.mjs`
- Modify: `games-official/tests/challenges.test.mjs`

**Interfaces:**
- Consumes pure gameplay helpers.
- Exposes diagnostic state in `window.__APRINCAR_GAME_STATE__`.

- [ ] Add failing static/behavioral tests for listener cleanup, reversible fruit/block selection and paint storage permission.
- [ ] Confirm RED.
- [ ] Add round-scoped listener cleanup.
- [ ] Make fruit/block objects toggleable and visually reversible.
- [ ] Make paint persist serialized strokes to `aprincar.storage` and restore them.
- [ ] Add guidance fading for handwriting by level.
- [ ] Improve per-game scene identity and Aprincar typography tokens.
- [ ] Rebuild generated games and confirm tests/build/validation GREEN.

### Task 4: Repair handwriting semantics

**Files:**
- Modify: `platform/packages/handwriting/src/index.ts`
- Modify: `platform/packages/core-tests/handwriting.test.ts`

**Interfaces:**
- Produces `evaluateHandwriting()` with template-distance shape score.

- [ ] Write failing test showing an unrelated large scribble must fail for `A`.
- [ ] Confirm RED.
- [ ] Implement normalized template/path-distance comparison for supported uppercase letters, preserving generic fallback only when no template exists.
- [ ] Confirm representative A succeeds and scribble fails.
- [ ] Run platform tests/typecheck.

### Task 5: Repair Three.js tap-vs-drag

**Files:**
- Modify: `games-official/src/runtime/three-runtime.js`
- Test: `games-official/tests/challenges.test.mjs`

**Interfaces:**
- Consumes `classifyPointerGesture(startX,startY,endX,endY,threshold)`.

- [ ] Add failing source-contract test proving pointerdown coordinates are preserved until pointerup.
- [ ] Confirm RED.
- [ ] Implement drag tracking from initial pointer position and pointer capture/loss handling.
- [ ] Confirm GREEN.

### Task 6: Semantic gameplay QA for all official games

**Files:**
- Replace/extend: `platform/e2e/gameplay.spec.ts`
- Add: `platform/e2e/gameplay-families.spec.ts`
- Modify: `games-official/src/runtime/phaser-runtime.js`
- Modify: `games-official/src/runtime/three-runtime.js`

**Interfaces:**
- Diagnostic test state includes mode, level, challenge, targets, selected count, last result and relevant game-specific state.

- [ ] Add E2E cases for counting animals, fruit basket, block tower, color, pattern, letters, memory, handwriting, paint and 3D.
- [ ] Run browser suite when environment permits.
- [ ] Fix semantic failures without weakening assertions.

### Task 7: Final validation and packaging

**Files:**
- Create/update: `_validation/final-report.md`
- Create/update: `_validation/challenge-fuzz-report.md`

- [ ] Run `npm run check` in platform.
- [ ] Run `npm run check` in games-official.
- [ ] Run template/community/curriculum validators already present.
- [ ] Run E2E if browser environment permits; otherwise mark blocker truthfully.
- [ ] Confirm generated game artifacts contain no remote runtime dependency.
- [ ] Remove node_modules/caches from deliverable.
- [ ] Create final ZIP and SHA-256.
