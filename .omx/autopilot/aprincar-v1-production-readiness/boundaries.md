# Boundaries

## NEVER

- Do not redesign or replace the approved architecture/design system.
- Do not use destructive Git commands, auto-commit, or auto-push.
- Do not expose secrets or change production/external accounts.
- Do not mask failures with skips, disabled checks, `@ts-ignore`, `@ts-nocheck`, broad eslint disables, or `as any`.

## DANGER

- Browser tests may create local profile/progress data only in isolated test contexts.
- Dependency installation and builds may rewrite generated lock/build artifacts; inspect diffs before cleanup.
- Removing generated artifacts is deferred until their exact ownership is established.

## ROLLBACK

- Preserve the current working tree; inspect `git diff` before each repair.
- Revert only narrowly identified generated or task-owned changes with explicit review; never reset the repository.

## VERIFY

- Run the affected focused test first, then related workspace gates, then the final report checks.
