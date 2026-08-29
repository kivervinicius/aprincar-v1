# Aprincar V1 — MVP & Gameplay Parity Design

## Goal

Restore the React Aprincar experience to the approved single-file MVP interaction model while preserving the existing Core, Extension Platform, Skill Graph, Evidence, Progress, Storage and offline architecture. Rebuild official gameplay so every bundled game is recoverable, semantically correct and testable.

## Sources of truth

1. `platform/docs/design/reference/aprincar-ux-baseline.html` is the structural/interaction contract.
2. `platform/docs/design/reference/aprincar-brand-board.png` is the branding/finish contract.
3. `platform/docs/design/DESIGN_SYSTEM.md` owns the shared visual tokens.
4. Newer screenshots may inspire illustration quality, but may not override the single-file MVP structure.

## App experience

- Child mode keeps the horizontal topbar and warm cream layout from the MVP.
- Home keeps hero, child library/recommendations, discovery sections and profile chip.
- Onboarding is restored to five real steps: identity/avatar, age, current abilities, interests, and initial screen-time preference.
- Profile metadata is persisted locally and remains optional/non-blocking.
- Game play becomes a dedicated full-screen Game Runtime, with a runtime header and explicit exit action, rather than rendering as an ordinary page inside the app shell.
- Parent mode remains richer/admin-like but uses the same visual tokens.

## Game architecture

- Game code remains independent from the App and loads through GameHost.
- Challenge generators remain pure and engine-independent.
- Phaser/Three render the challenge but never define pedagogical truth.
- Round-scoped input listeners must be detached before the next round.
- Interactive selection games must be recoverable after a mistake: selected fruit/blocks can be removed.
- Paint actually persists the drawing through scoped Aprincar storage and declares the storage permission.
- 3D differentiates tap from drag using total pointer displacement from pointerdown.
- Handwriting uses reference-shape comparison rather than geometry volume alone, and game guidance weakens by level.

## Gameplay validation

Each official game must expose deterministic test state through `window.__APRINCAR_GAME_STATE__` only for testing/diagnostics. Tests validate the meaningful interaction for every game family, not merely canvas existence.

At minimum, tests prove:
- wrong answer can be produced and recovered from;
- correct answer produces success evidence and progression where applicable;
- count selection can be corrected before submission;
- drag/drop reports the actual destination;
- patterns/letters use generator truth;
- memory pairs are solvable;
- paint saves a non-empty drawing state;
- handwriting rejects unrelated scribbles and accepts representative templates;
- 3D drag does not trigger accidental selection.

## Code quality

- Source files are the maintained implementation; generated `game.html` files are artifacts.
- Shared input/selection behavior lives in pure testable helpers.
- Large runtime behavior is split by responsibility where practical.
- No `@ts-ignore`, broad eslint suppression, or test skipping is introduced.
