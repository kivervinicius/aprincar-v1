import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { db } from '../storage/src/index.ts';

const root = path.resolve(new URL('..', import.meta.url).pathname, '..');
const appPublic = path.join(root, 'apps', 'app', 'public');
const registryFile = path.join(appPublic, 'registry.json');
const registry = JSON.parse(fs.readFileSync(registryFile, 'utf8'));

test('All 10 official games exist in App public registry with required V1.1 metadata', () => {
  assert.equal(registry.length, 10, 'Must have exactly 10 official games');

  const requiredSlugs = [
    'counting-animals',
    'fruit-basket',
    'block-tower',
    'color-match',
    'pattern-play',
    'letter-hunt',
    'write-a',
    'paint-free',
    'memory-animals',
    'space-shapes-3d',
  ];

  for (const slug of requiredSlugs) {
    const entry = registry.find((e: any) => e.entryUrl.includes(slug));
    assert.ok(entry, `Registry must include ${slug}`);
    assert.equal(entry.trust, 'official');
    assert.ok(entry.skills && entry.skills.length > 0, `${slug} must declare at least one primary skill`);
    assert.ok(entry.ageGuidance && entry.ageGuidance.min >= 2, `${slug} must have valid age guidance`);
    assert.ok(entry.integrity && entry.integrity.length === 64, `${slug} must have valid sha256 integrity`);

    // Verify actual files exist
    const gameDir = path.join(appPublic, 'extensions', slug);
    assert.ok(fs.existsSync(path.join(gameDir, 'game.html')), `${slug}/game.html must exist`);
    assert.ok(fs.existsSync(path.join(gameDir, 'manifest.json')), `${slug}/manifest.json must exist`);
    assert.ok(fs.existsSync(path.join(gameDir, 'integrity.json')), `${slug}/integrity.json must exist`);
  }
});

test('Dexie storage declares MissionHistory table with versioned migration and profile isolation', () => {
  const storageCode = fs.readFileSync(path.join(root, 'packages', 'storage', 'src', 'index.ts'), 'utf8');
  assert.match(storageCode, /export interface MissionHistoryRow/);
  assert.match(storageCode, /missionHistory!:\s*EntityTable<MissionHistoryRow/);
  assert.match(
    storageCode,
    /this\.version\(2\)\.stores\({\s*missionHistory:\s*'id,profileId,missionId,completedAt'/,
  );

  const appStoreCode = fs.readFileSync(path.join(root, 'apps', 'app', 'src', 'app-store.tsx'), 'utf8');
  assert.match(appStoreCode, /completedMissionIds:\s*Set<string>/);
  assert.match(appStoreCode, /completeMission\(missionId:\s*string/);
  assert.match(appStoreCode, /db\.missionHistory\.put/);
});
