# Aprincar V1 Visual & Gameplay Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restore the approved Aprincar visual identity and replace fixture games with validated procedural Phaser/Three.js experiences while preserving the existing platform core.

**Architecture:** React/Mantine remains the application infrastructure, but all child-facing visuals are implemented through Aprincar-specific UI primitives. Official games are generated from pure challenge generators and renderer runtimes; generators own correctness while Phaser/Three.js only render and collect interaction.

**Tech Stack:** React 19, Mantine 9, Vite 7, Dexie, TanStack Router, Phaser 3.90, Three.js, Node test runner, Playwright.

**Spec:** Approved conversation scope “Aprincar V1 — Visual & Gameplay Parity”.

## Global Constraints
- Preserve Extension Platform, Game SDK/Host, storage, PWA, Skill Graph, Evidence/Progress/Reward and BNCC contracts.
- App must never import game source code.
- Official 2D games use Phaser; one official reference experience uses Three.js.
- Correct answers originate in pure generators and are validated before rendering.
- No remote executable code in published game HTML.
- Approved visual baseline is the original single-HTML UX plus Aprincar branding boards.

---

### Task 1: Procedural challenge core
- Add deterministic generators and invariant validation for counting, colors, patterns, letters and memory.
- Add fuzz tests that prove the correct answer exists exactly once and generated challenges remain solvable.

### Task 2: Official game runtime
- Add shared SDK bridge, Aprincar game chrome, Phaser runtime and Three.js runtime.
- Generate self-contained game HTML artifacts and integrity hashes.

### Task 3: Official catalog rebuild
- Rebuild existing game IDs on top of procedural generators.
- Add memory and 3D geometry reference games.
- Update registry and platform bundled extensions.

### Task 4: Visual identity and application UI
- Centralize BrandMark/Brand components and design tokens in @aprincar/ui.
- Rebuild Child Home, Discover/Hub, Library, onboarding and parent surfaces using Aprincar-specific components.
- Preserve responsive/mobile behavior and themes.

### Task 5: Behavioral and visual QA
- Strengthen gameplay E2E to verify wrong and correct answers and evidence.
- Run unit, challenge fuzz, typecheck, lint, format, build, PWA and E2E gates.
- Produce final validation report and release ZIP.
