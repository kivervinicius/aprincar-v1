import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHandwriting } from '../handwriting/src/index.ts';

const A = {
  symbol: 'A',
  strokes: [
    [
      { x: 0.12, y: 0.9 },
      { x: 0.5, y: 0.08 },
      { x: 0.88, y: 0.9 },
    ],
    [
      { x: 0.28, y: 0.56 },
      { x: 0.72, y: 0.56 },
    ],
  ],
};

test('recognizes a structurally plausible A and rejects generic scribbles with the same coverage', () => {
  assert.equal(evaluateHandwriting(A).recognized, true);
  const scribble = evaluateHandwriting({
    symbol: 'A',
    strokes: [
      [
        { x: 0.08, y: 0.1 },
        { x: 0.9, y: 0.15 },
        { x: 0.1, y: 0.85 },
        { x: 0.9, y: 0.9 },
      ],
      [
        { x: 0.1, y: 0.2 },
        { x: 0.9, y: 0.8 },
      ],
    ],
  });
  assert.equal(scribble.recognized, false);
});

test('recognizes V directionality instead of accepting any long stroke', () => {
  const correct = evaluateHandwriting({
    symbol: 'V',
    strokes: [
      [
        { x: 0.12, y: 0.12 },
        { x: 0.5, y: 0.9 },
        { x: 0.88, y: 0.12 },
      ],
    ],
  });
  const wrong = evaluateHandwriting({
    symbol: 'V',
    strokes: [
      [
        { x: 0.12, y: 0.9 },
        { x: 0.5, y: 0.1 },
        { x: 0.88, y: 0.9 },
      ],
    ],
  });
  assert.equal(correct.recognized, true);
  assert.equal(wrong.recognized, false);
});

test('rejects non-finite or out-of-range handwriting points', () => {
  assert.equal(
    evaluateHandwriting({
      symbol: 'A',
      strokes: [
        [
          { x: Number.NaN, y: 0.2 },
          { x: 0.2, y: 0.3 },
        ],
      ],
    }).recognized,
    false,
  );
  assert.equal(
    evaluateHandwriting({
      symbol: 'T',
      strokes: [
        [
          { x: -2, y: 0 },
          { x: 2, y: 1 },
        ],
      ],
    }).recognized,
    false,
  );
});
