import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

test('App does not statically import any game files or packages', () => {
  const appSrc = new URL('../../apps/app/src/', import.meta.url).pathname;
  const files: string[] = [];

  function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (/\.(ts|tsx)$/.test(e.name)) files.push(p);
    }
  }
  walk(appSrc);

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(content, /from\s+['"][^'"]*games\//, `Forbidden game import in ${file}`);
    assert.doesNotMatch(
      content,
      /from\s+['"]@aprincar\/games/,
      `Forbidden @aprincar/games import in ${file}`,
    );
  }
  assert.ok(files.length > 0, 'Scanned App source files');
});

test('Extensions declare Aprincar Skill IDs and never direct BNCC codes', () => {
  const starterExtensionsDir = new URL('../../apps/app/public/extensions/', import.meta.url).pathname;
  for (const gameName of fs.readdirSync(starterExtensionsDir)) {
    const manifestPath = path.join(starterExtensionsDir, gameName, 'manifest.json');
    if (!fs.existsSync(manifestPath)) continue;
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    for (const skill of [
      ...(manifest.contributes?.skills ?? []),
      ...(manifest.contributes?.secondarySkills ?? []),
    ]) {
      assert.doesNotMatch(
        skill,
        /^(EI|EF|EM)[0-9]{2}[A-Z]{2}[0-9]{2}$/,
        `Game ${gameName} declared BNCC code ${skill} directly instead of Aprincar Skill ID`,
      );
    }
  }
});
