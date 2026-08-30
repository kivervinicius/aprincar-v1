import { test } from 'node:test';
import assert from 'node:assert/strict';
import { recommendNextExperience } from '../learning-engine/src/index.ts';
import type { RegistryEntry, SkillState } from '../extension-contracts/src/types.ts';

const mockRegistry: RegistryEntry[] = [
  {
    id: 'aprincar.counting-animals',
    version: '1.1.0',
    trust: 'official',
    name: { 'pt-BR': 'Conte os Bichos' },
    description: { 'pt-BR': 'Safari dos bichos' },
    skills: ['math.counting.1-10'],
    tags: ['math', 'counting', 'animals'],
    ageGuidance: { min: 4, max: 7 },
    manifestUrl: '/extensions/counting-animals/manifest.json',
    entryUrl: '/extensions/counting-animals/game.html',
    integrity: 'hash1',
  },
  {
    id: 'aprincar.fruit-basket',
    version: '1.1.0',
    trust: 'official',
    name: { 'pt-BR': 'Cesta de Frutas' },
    description: { 'pt-BR': 'Feira da cesta' },
    skills: ['math.counting.1-10'],
    tags: ['math', 'counting', 'fruits'],
    ageGuidance: { min: 4, max: 7 },
    manifestUrl: '/extensions/fruit-basket/manifest.json',
    entryUrl: '/extensions/fruit-basket/game.html',
    integrity: 'hash2',
  },
  {
    id: 'aprincar.color-match',
    version: '1.1.0',
    trust: 'official',
    name: { 'pt-BR': 'Mundo das Cores' },
    description: { 'pt-BR': 'Ateliê das cores' },
    skills: ['perception.colors.match'],
    tags: ['colors', 'logic', 'drag'],
    ageGuidance: { min: 2, max: 6 },
    manifestUrl: '/extensions/color-match/manifest.json',
    entryUrl: '/extensions/color-match/game.html',
    integrity: 'hash3',
  },
];

test('Learning Engine 2.0 recommends focus skills', () => {
  const result = recommendNextExperience({
    profile: { id: 'p1', name: 'Theo', age: 5, focusSkills: ['perception.colors.match'] },
    registry: mockRegistry,
  });

  assert.equal(result.recommended?.id, 'aprincar.color-match');
});

test('Learning Engine 2.0 penalizes immediate repetition and applies context diversity', () => {
  const skillStates: SkillState[] = [
    {
      profileId: 'p1',
      skillId: 'math.counting.1-10',
      state: 'developing',
      confidence: 0.6,
      evidenceCount: 3,
      independentSuccesses: 2,
      assistedSuccesses: 1,
      failures: 0,
      contextCount: 1,
      updatedAt: new Date().toISOString(),
    },
  ];

  // Child just played counting-animals; the engine should recommend fruit-basket (different context for same counting skill)
  const result = recommendNextExperience({
    profile: { id: 'p1', name: 'Lia', age: 5, interests: ['math'] },
    registry: mockRegistry,
    skillStates,
    recentGameIds: ['aprincar.counting-animals'],
  });

  assert.equal(result.recommended?.id, 'aprincar.fruit-basket');
  const topScore = result.ranked.find((r) => r.entry.id === 'aprincar.fruit-basket');
  assert.equal(topScore?.contextDiversityBonus, true);
});

test('Learning Engine 2.0 heavily prioritizes cached games when offline', () => {
  const result = recommendNextExperience({
    profile: { id: 'p1', name: 'Noah', age: 5 },
    registry: mockRegistry,
    offlineReadyIds: new Set(['aprincar.color-match']),
    isOffline: true,
  });

  assert.equal(result.recommended?.id, 'aprincar.color-match');
});
