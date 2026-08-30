import test from 'node:test';
import assert from 'node:assert/strict';
import type { RegistryEntry, SkillState } from '../extension-contracts/src/types.ts';
import { recommendNextExperience } from '../learning-engine/src/index.ts';

const entry = (id: string, skill: string, interests: string[] = []): RegistryEntry => ({
  id,
  version: '1.1.0',
  trust: 'official',
  publisher: 'aprincar',
  name: { 'pt-BR': id },
  skills: [skill],
  ageGuidance: { min: 4, max: 8 },
  manifestUrl: `/extensions/${id}/manifest.json`,
  entryUrl: `/extensions/${id}/game.html`,
  integrity: 'sha256:test',
  tags: interests,
  experience: {
    fantasy: `Fantasia ${id}`,
    mechanic: `mecânica-${id}`,
    interaction: 'tap',
    progression: { maxLevel: 3, adaptive: true },
    learningSignals: ['accuracy'],
  },
});

test('Learning Engine chooses an uncovered skill without repeating the last game', () => {
  const registry = [
    entry('game-count', 'math.counting.1-10', ['math']),
    entry('game-letters', 'literacy.letter.recognition', ['letters']),
  ];
  const states: SkillState[] = [
    {
      profileId: 'child-1',
      skillId: 'math.counting.1-10',
      state: 'developing',
      confidence: 0.4,
      evidenceCount: 2,
      independentSuccesses: 1,
      assistedSuccesses: 1,
      failures: 1,
      contextCount: 1,
      updatedAt: '2026-01-01',
    },
  ];

  const recommendation = recommendNextExperience({
    profileId: 'child-1',
    age: 5,
    interests: ['math'],
    registry,
    skillStates: states,
    recentGameIds: ['game-count'],
  });

  assert.equal(recommendation.entry.id, 'game-letters');
  assert.equal(recommendation.reason, 'expand-context');
  assert.equal(recommendation.targetSkillId, 'literacy.letter.recognition');
});

test('Learning Engine is deterministic and prioritizes low-confidence skills', () => {
  const registry = [entry('game-a', 'skill-a'), entry('game-b', 'skill-b')];
  const states: SkillState[] = [
    {
      profileId: 'child-1',
      skillId: 'skill-a',
      state: 'comfortable',
      confidence: 0.9,
      evidenceCount: 5,
      independentSuccesses: 5,
      assistedSuccesses: 0,
      failures: 0,
      contextCount: 2,
      updatedAt: '2026-01-01',
    },
    {
      profileId: 'child-1',
      skillId: 'skill-b',
      state: 'developing',
      confidence: 0.2,
      evidenceCount: 1,
      independentSuccesses: 0,
      assistedSuccesses: 1,
      failures: 1,
      contextCount: 1,
      updatedAt: '2026-01-01',
    },
  ];
  const input = { profileId: 'child-1', age: 5, registry, skillStates: states, recentGameIds: [] };
  assert.equal(recommendNextExperience(input).entry.id, 'game-b');
  assert.deepEqual(recommendNextExperience(input), recommendNextExperience(input));
});
