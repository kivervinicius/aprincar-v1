# Deployment

The App and Hub are static builds. Recommended production deployment is Cloudflare Pages (or any static host).

- App build: `npm install && npm run build -w @aprincar/app` -> `apps/app/dist`
- Hub build: `npm install && npm run build -w @aprincar/hub` -> `apps/hub/dist`

Game registries may be hosted independently. Configure `VITE_APRINCAR_REGISTRY_URLS` as a comma-separated list of registry URLs. Remote registries must contain absolute `manifestUrl` and `entryUrl` values. The official/community registry build scripts accept `APRINCAR_GAMES_BASE_URL` to generate those URLs.

The App ships an official starter mirror for offline bootstrap; production registries can update independently without rebuilding game source into React.
