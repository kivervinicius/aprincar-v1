# Platform operations

The App and Hub are static builds. Use the generated `apps/app/dist` and `apps/hub/dist` directories with a static host.

Configure `VITE_APRINCAR_REGISTRY_URLS` for additional registries. Configure `APRINCAR_GAMES_BASE_URL` while building official or community registries. Keep registry URLs HTTPS in production.

The service worker precaches the PWA shell. A game must be explicitly prepared for offline use before its immutable artifact is cached.
