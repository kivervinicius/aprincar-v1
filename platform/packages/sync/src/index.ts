export interface LocalChange {
  id: string;
  entity: string;
  entityId: string;
  operation: 'upsert' | 'delete';
  payload: unknown;
  changedAt: string;
}
export interface SyncAdapter {
  push(changes: LocalChange[]): Promise<{ accepted: string[] }>;
  pull(cursor?: string): Promise<{ changes: LocalChange[]; cursor?: string }>;
}
export class NoopSyncAdapter implements SyncAdapter {
  async push(changes: LocalChange[]) {
    return { accepted: changes.map((c) => c.id) };
  }
  async pull(cursor?: string) {
    return { changes: [], cursor };
  }
}
