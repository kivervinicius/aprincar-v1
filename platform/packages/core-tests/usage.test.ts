import test from 'node:test';
import assert from 'node:assert/strict';
import { sumUsageSecondsForDay } from '../storage/src/usage.ts';

test('sums only sessions that started on the requested local day', () => {
  const sessions: any[] = [
    { startedAt: '2026-08-27T10:00:00-03:00', durationSeconds: 600 },
    { startedAt: '2026-08-27T11:00:00-03:00', durationSeconds: 300 },
    { startedAt: '2026-08-26T11:00:00-03:00', durationSeconds: 999 },
  ];
  assert.equal(sumUsageSecondsForDay(sessions, '2026-08-27'), 900);
});
