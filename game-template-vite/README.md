# game-template-vite

GitHub Template for an Aprincar game using **vite**. Edit `manifest.json`, implement the experience, then run:
```bash
npm install
npm run dev
npm run build
```
The output under `package/` is the reviewable Aprincar V1 extension artifact (`manifest.json`, `game.html`, `integrity.json`).

See `docs/README.md` for the authoring lifecycle and submission contract.

## Production gate

Run `npm run check` before publishing. It executes the template tests, production build, packages the game as a self-contained `package/game.html`, writes SHA-256 integrity metadata and validates the Aprincar V1 manifest/Skill IDs/offline security contract.
