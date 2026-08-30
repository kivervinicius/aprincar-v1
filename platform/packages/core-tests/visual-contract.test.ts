import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = (relative: string) => fs.readFileSync(new URL(relative, import.meta.url), 'utf8');

test('Aprincar child experience is mobile-first and preserves the single-file UX hierarchy', () => {
  const ui = read('../ui/src/index.tsx');
  const layout = read('../../apps/app/src/layout.tsx');
  const home = read('../../apps/app/src/pages/Home.tsx');
  const onboarding = read('../../apps/app/src/pages/Onboarding.tsx');
  const play = read('../../apps/app/src/pages/Play.tsx');
  const styles = read('../../apps/app/src/styles.css');

  assert.match(ui, /function BrandMark/);
  assert.match(ui, /AprincarMascot/);
  assert.doesNotMatch(layout, /\bAppShell\b/);
  assert.match(layout, /mobile-bottom-nav/);
  assert.match(layout, /mobile-topbar/);
  assert.match(layout, /path\.startsWith\(['"]\/play\//);
  assert.match(home, /child-hero/);
  assert.match(home, /game-shelf/);
  assert.match(home, /Começar a brincar/);
  assert.match(onboarding, /ONBOARDING_STEPS/);
  assert.match(onboarding, /Interesses/);
  assert.match(onboarding, /Tempo/);
  assert.match(play, /game-runtime/);

  assert.match(styles, /--ap-bg:\s*#F7F6F2/i);
  assert.match(styles, /safe-area-inset-bottom/);
  assert.match(styles, /100dvh/);
  assert.match(styles, /100svh/);
  assert.match(styles, /scroll-snap-type:\s*x mandatory/);
  assert.match(styles, /min-height:\s*48px/);
  assert.match(styles, /@media\s*\(max-width:\s*767px\)/);
  assert.match(styles, /@media\s*\(max-width:\s*359px\)/);

  const landscapeRules = styles.slice(styles.indexOf('@media (orientation: landscape)'));
  assert.doesNotMatch(landscapeRules, /\.mobile-topbar[\s\S]*display:\s*none/);
  assert.doesNotMatch(landscapeRules, /\.mobile-bottom-nav[\s\S]*display:\s*none/);
});

test('profile model can persist onboarding preferences without requiring cloud identity', () => {
  const storage = read('../storage/src/index.ts');
  const store = read('../../apps/app/src/app-store.tsx');
  assert.match(storage, /interests\?:\s*string\[\]/);
  assert.match(storage, /focusSkills\?:\s*string\[\]/);
  assert.match(storage, /dailyGoalMinutes\?:\s*number/);
  assert.match(store, /CreateProfileInput/);
  assert.match(store, /dailyGoalMinutes/);
});
