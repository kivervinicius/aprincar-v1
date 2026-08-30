# Aprincar Design System — Production Visual Contract

Aprincar V1 uses three complementary sources of truth:

1. `docs/design/reference/aprincar-ux-baseline.html` — interaction hierarchy and product flows.
2. `docs/design/reference/aprincar-brand-v3-concept.png` — approved visual direction for the star character and multicolor wordmark.
3. The production components in `@aprincar/ui` — canonical vector implementation used by App, Hub, PWA and official games.

If references disagree, preserve the UX hierarchy of the single-file baseline while following the production Brand System v3 and the mobile-first rules below.

## Brand System v3

- Primary symbol: friendly yellow star with a small learning/pencil cue.
- Wordmark: multicolor `Aprincar`, with blue, yellow, green, coral, orange and purple accents.
- The canonical production identity is vector code from `packages/ui/src/index.tsx`; generated/bitmap concept artwork is reference material only.
- App, Hub, PWA icons, official games and templates must not invent independent Aprincar logos.
- The brand must remain legible in small sizes and must not depend on gradients, 3D rendering or raster artwork to function.

## Core tokens

- Background: `#F7F6F2`
- Surface: `#FFFFFF`
- Text: `#242523`
- Blue: `#2563EB`
- Sun: `#FBCB24`
- Orange: `#FB923C`
- Leaf: `#22C55E`
- Coral: `#F43F5E`
- Purple: `#8B5CF6`
- Navy: `#13203D`

Mantine provides accessible primitives; it does **not** define Aprincar appearance.

## Child experience

Child Mode must never resemble an administrative dashboard. It prioritizes illustration, large touch targets, short copy, direct actions, horizontal shelves and low cognitive load.

### Desktop

- Sticky top navigation with brand, primary child destinations and profile control.
- Hero may use a two-column composition.
- Game discovery uses 3–4 columns where space permits.

### Mobile

Mobile is a first-class layout, not a compressed desktop view.

- Header contains brand + profile only.
- Child navigation moves to the fixed bottom navigation.
- Responsible/settings actions remain in the profile/adult flow, not in the child bottom bar.
- Touch targets are at least 44px; primary actions target 48–56px.
- Respect `env(safe-area-inset-*)`.
- No accidental horizontal page overflow at 320px width.
- Shelves may scroll horizontally with snap; discovery grids adapt to available width.
- Important content must not be hidden by browser chrome, the home indicator or the bottom navigation.

## Game runtime

Entering a game is a focused fullscreen experience. The normal App shell must not compete with gameplay.

- Use dynamic viewport units (`100dvh` / `100svh`) with safe fallbacks.
- Phaser and Three.js must react to resize/orientation changes.
- Do not require hover for essential actions.
- Drag/drop targets must remain touch friendly.
- Portrait and landscape are supported where the game mechanics permit them.

## Onboarding

The original five-step product flow is mandatory:

1. child name/avatar;
2. age;
3. current exploration/focus;
4. interests;
5. play-time goal.

On mobile, show one clear question per step and keep primary progression within thumb reach.

## Parent Mode

Parent Mode may use denser dashboard patterns, but must retain Aprincar typography, surfaces and navigation language. Desktop side navigation becomes tabs/segmented navigation on narrow screens; data tables must have mobile list/card fallbacks.

## Regression gates

Future UI changes must verify:

- Brand System v3 remains canonical.
- Child Mode retains the UX hierarchy of `aprincar-ux-baseline.html`.
- No desktop-only navigation is merely wrapped onto mobile.
- 320/360/375/390/412/430px widths do not create unintended overflow.
- PWA safe-area handling remains intact.
- Game runtime remains fullscreen and viewport-safe.

Playwright E2E in CI is the final behavioral/responsive gate.
