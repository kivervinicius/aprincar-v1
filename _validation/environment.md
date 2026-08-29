# Aprincar V1 validation environment

- Date: 2026-08-29
- OS: Linux Dev-Web-Kiver, kernel 6.17.0-23-generic, x86_64
- Node: v22.17.0
- npm: 10.9.2
- Git: 2.51.0 binary present, but the checked-out `.git` directory contains no repository metadata; commit/working-tree identity is unavailable.
- Browser: `/usr/bin/google-chrome` is present. Playwright CLI is available through `npx` after Node initialization; browser availability and real launch will be verified during E2E.
- Bundle roots: `platform`, `games-official`, `community-games`, `curriculum-bncc`, `game-template-vite`, `game-template-react`, `game-template-phaser`, `game-template-threejs`.
- Platform package manager: npm workspaces (`apps/*`, `packages/*`), lockfile present.
- Template package managers: npm, lockfiles present.
- Other package roots: npm manifests without lockfiles for `games-official`, `community-games`, and `curriculum-bncc`.
- Initial dependency state: no `node_modules` directory was present in any bundle root.
- Visual references: `platform/docs/design/reference/` contains the brand board, UX baseline HTML, and child-home, hub, and parent reference PNGs.
- Official games discovered: 10 directories (`block-tower`, `color-match`, `counting-animals`, `fruit-basket`, `letter-hunt`, `memory-animals`, `paint-free`, `pattern-play`, `space-shapes-3d`, `write-a`).
- Existing `_validation` logs and screenshots were treated as historical evidence only and will not be used as proof of fresh results.
