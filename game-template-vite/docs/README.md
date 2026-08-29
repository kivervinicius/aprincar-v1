# Vite game template

Use this template for a lightweight Aprincar game without a framework-specific renderer.

## Lifecycle

1. Edit `manifest.json` and `src/main.ts`.
2. Keep the game self-contained and touch-friendly.
3. Use the SDK bridge for lifecycle and Evidence events.
4. Run `npm run build`.
5. Review `package/game.html`, `package/manifest.json` and `package/integrity.json`.
6. Submit the package to the appropriate registry workflow.

The output is a single extension artifact; do not add remote scripts or network calls.

