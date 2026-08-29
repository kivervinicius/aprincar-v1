# Aprincar Design System — Visual Contract

The files under `docs/design/reference/` are the visual baseline for Aprincar V1.

## Non-negotiable principles

- Mantine is infrastructure for accessibility, overlays and form primitives; it is **not** the visual identity.
- Child Mode must not look like an administration dashboard.
- The geometric Aprincar mark is the single source of brand identity in App, Hub and PWA icons.
- Default tokens: warm cream `#F7F6F2`, white surfaces, charcoal `#242523`, Aprincar purple `#6F5BD7`, soft purple `#EFEAFE`, coral `#F07867`, sun `#F4C95D`, leaf `#65A67A`, sky `#62A6D8`.
- Cards use generous radius (20–28 px), subtle borders and soft elevation.
- Child Mode prioritizes large touch targets, illustration, short copy and horizontal shelves.
- Parent Mode may use dashboard patterns, but must remain visually related to Child Mode.
- Official games share motion, feedback, palette and typography but are free to create distinct scenes.

## Regression rule

Any future UI change must be compared against the baseline references before merge. Replacing Aprincar-specific composition with default library components is a visual regression even if functionality still works.
