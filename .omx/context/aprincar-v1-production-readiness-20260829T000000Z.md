# Aprincar V1 production-readiness context

- Task: validate and repair the Aprincar V1 GitHub bundle for local publication readiness.
- Desired outcome: highest evidence-backed readiness without redesigning the approved architecture or visual contract.
- Known facts: bundle contains platform, games-official, community-games, curriculum-bncc, and four game templates; root itself is not the Git repository root, but `.git` is present here.
- Constraints: preserve architecture/design; no skips, disabled checks, `any` casts, test removal, auto-commit, or auto-push; destructive cleanup only after identifying exact generated targets.
- Unknowns: dependencies may be absent; prior `_validation` evidence may be stale; browser/offline/WebGL support must be verified live.
- Current phase: inventory.
- Next action: record environment and inspect executable project surfaces before dependency installation.
- Validation command: `git -C . status --short --branch` plus workspace script inventory.
