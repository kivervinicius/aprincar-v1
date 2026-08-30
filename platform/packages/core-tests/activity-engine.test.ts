import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateActivityAttempt,
  generateProgressiveHint,
  getAssistanceLevelForAttempt,
  type ActivityDefinition,
} from '../activity-engine/src/index.ts';

test('Activity Engine generates progressive assistance on successive attempts without punitive failure', () => {
  assert.equal(getAssistanceLevelForAttempt(1), 'none');
  assert.equal(getAssistanceLevelForAttempt(2), 'visual-cue');
  assert.equal(getAssistanceLevelForAttempt(3), 'reduced-complexity');
  assert.equal(getAssistanceLevelForAttempt(4), 'partial-demonstration');

  const sortingActivity: ActivityDefinition = {
    id: 'activity-sort-colors',
    type: 'sorting',
    skillId: 'perception.colors.match',
    title: 'Separar por Cor',
    prompt: 'Separe os blocos por cor',
    difficulty: 0.2,
    items: [
      { id: 'item-1', value: 'red', color: '#F43F5E' },
      { id: 'item-2', value: 'blue', color: '#2563EB' },
      { id: 'item-3', value: 'red', color: '#F43F5E' },
    ],
    targets: [
      { id: 'target-red', label: 'Vermelho', acceptsValue: 'red' },
      { id: 'target-blue', label: 'Azul', acceptsValue: 'blue' },
    ],
  };

  const hint1 = generateProgressiveHint(sortingActivity, 1);
  assert.equal(hint1.level, 'none');

  const hint2 = generateProgressiveHint(sortingActivity, 2);
  assert.equal(hint2.level, 'visual-cue');
  assert.ok(hint2.highlightedTargetId);

  const hint3 = generateProgressiveHint(sortingActivity, 3);
  assert.equal(hint3.level, 'reduced-complexity');
  assert.ok(hint3.eliminatedItemIds?.length);

  // Attempt 1: wrong
  const eval1 = evaluateActivityAttempt(
    sortingActivity,
    {
      activityId: sortingActivity.id,
      placements: { 'item-1': 'target-blue', 'item-2': 'target-red', 'item-3': 'target-blue' },
    },
    1,
  );
  assert.equal(eval1.valid, false);
  assert.doesNotMatch(eval1.feedbackMessage, /ERRADO|PERDEU|ERROU/i);
  assert.match(eval1.feedbackMessage, /Quase|tentar/i);

  // Attempt 2: correct
  const eval2 = evaluateActivityAttempt(
    sortingActivity,
    {
      activityId: sortingActivity.id,
      placements: { 'item-1': 'target-red', 'item-2': 'target-blue', 'item-3': 'target-red' },
    },
    2,
  );
  assert.equal(eval2.valid, true);
  assert.equal(eval2.score, 1);
  assert.match(eval2.feedbackMessage, /Muito bem|Isso/i);
});

test('Activity Engine evaluates counting and sequencing activities accurately', () => {
  const countingActivity: ActivityDefinition = {
    id: 'activity-count-5',
    type: 'counting',
    skillId: 'math.counting.1-5',
    title: 'Contar Estrelas',
    prompt: 'Quantas estrelas você vê?',
    expectedCount: 4,
    difficulty: 0.3,
    items: [
      { id: 'star-1', value: 'star' },
      { id: 'star-2', value: 'star' },
      { id: 'star-3', value: 'star' },
      { id: 'star-4', value: 'star' },
    ],
  };

  const countWrong = evaluateActivityAttempt(
    countingActivity,
    { activityId: countingActivity.id, selectedCount: 3 },
    1,
  );
  assert.equal(countWrong.valid, false);

  const countCorrect = evaluateActivityAttempt(
    countingActivity,
    { activityId: countingActivity.id, selectedCount: 4 },
    2,
  );
  assert.equal(countCorrect.valid, true);
  assert.equal(countCorrect.score, 1);
});
