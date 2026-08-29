import test from 'node:test';
import assert from 'node:assert/strict';
import { NoopSyncAdapter, type LocalChange, type SyncAdapter } from '../sync/src/index.ts';

test('NoopSyncAdapter handles offline local-first changes without cloud failure', async () => {
  const adapter: SyncAdapter = new NoopSyncAdapter();
  const change: LocalChange = {
    id: 'ch-1',
    entity: 'profile',
    entityId: 'p-1',
    operation: 'upsert',
    payload: { name: 'Lucas' },
    changedAt: new Date().toISOString(),
  };

  const pushResult = await adapter.push([change]);
  assert.deepEqual(pushResult.accepted, ['ch-1']);

  const pullResult = await adapter.pull('cursor-0');
  assert.deepEqual(pullResult.changes, []);
  assert.equal(pullResult.cursor, 'cursor-0');
});
