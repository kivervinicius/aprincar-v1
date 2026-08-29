import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateHandwriting } from '../handwriting/src/index.ts';

test('requires multi-stroke structure for the letter A', () => {
  const oneStroke = evaluateHandwriting({
    symbol: 'A',
    strokes: [
      [
        { x: 0.1, y: 0.9 },
        { x: 0.5, y: 0.1 },
        { x: 0.9, y: 0.9 },
        { x: 0.2, y: 0.5 },
        { x: 0.8, y: 0.5 },
      ],
    ],
  });
  assert.equal(oneStroke.recognized, false);
  const structured = evaluateHandwriting({
    symbol: 'A',
    strokes: [
      [
        { x: 0.1, y: 0.9 },
        { x: 0.5, y: 0.1 },
        { x: 0.9, y: 0.9 },
      ],
      [
        { x: 0.25, y: 0.58 },
        { x: 0.75, y: 0.58 },
        { x: 0.8, y: 0.58 },
      ],
    ],
  });
  assert.equal(structured.recognized, true);
});
