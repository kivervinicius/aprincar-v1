# Contributing to Aprincar

Read the [organization documentation](docs/README.md) before starting. Choose the repository that owns the change; the [project map](docs/PROJECTS.md) explains the boundary.

## Workflow

1. Fork or create a branch from `main` with a focused name.
2. Make the smallest change that preserves the approved architecture and visual contract.
3. Add or update tests for behavior changes.
4. Run the repository's documented checks and audit.
5. Update the closest domain documentation when behavior or commands change.
6. Open a pull request using the template and describe validation evidence.
7. Wait for CI, security checks, technical review and pedagogical review when learning behavior is affected.

Use Conventional Commits. Do not commit secrets, child data, `.env` files, generated debug dumps or unlicensed assets.

## Special reviews

- Platform architecture changes require an RFC/ADR.
- New Skill IDs require Skill Graph and pedagogical review.
- Curriculum mappings require a cited source and pedagogical review.
- Community games go through `community-games` and must use the GameManifest contract.
- Changes to sandbox, permissions, integrity, profile data or Parent Mode require security review.
