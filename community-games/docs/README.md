# Community games documentation

Community games are submitted as immutable, self-contained artifacts under `games/<publisher>/<slug>/`. They are reviewed through pull requests and never receive privileges beyond the GameManifest contract.

## Required artifact

Each submission contains:

- `manifest.json`
- `game.html`
- a short `README.md`
- declared skills and permissions
- no remote runtime dependency

Run `npm run check` before opening a pull request. Maintainers review technical validity, security, accessibility and pedagogy before promotion to Curated.

