# Aprincar V1 — GitHub organization bundle

Each top-level directory (except `docs/`) is intended to become an independent GitHub repository under the `aprincar` organization.

Recommended upload order:
1. `.github`
2. `platform`
3. `games-official`
4. `community-games`
5. `curriculum-bncc`
6. the four `game-template-*` repositories

The platform already contains a mirrored starter registry from `games-official`, so it can demonstrate games independently. In production, configure a remote immutable registry/CDN and keep the local starter mirror as an offline bootstrap/fallback.
