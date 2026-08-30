# Aprincar V1 — GitHub organization bundle

Aprincar is an open, local-first platform for playful learning. The canonical repositories live under the [`aprincar`](https://github.com/aprincar) GitHub organization.

Start with the [organization documentation](.github/docs/README.md) for the complete architecture, setup, project map, extension workflow, operations and contribution guide.

Each top-level directory (except `docs/`) is intended to become an independent GitHub repository under the `aprincar` organization.

Recommended upload order:

1. `.github`
2. `platform`
3. `games-official`
4. `community-games`
5. `curriculum-bncc`
6. the four `game-template-*` repositories

The published static site is available at [aprincar.github.io/platform](https://aprincar.github.io/platform/). The platform also contains a mirrored starter registry from `games-official`, so it can demonstrate games independently. In production, configure a remote immutable registry/CDN and keep the local starter mirror as an offline bootstrap/fallback.
