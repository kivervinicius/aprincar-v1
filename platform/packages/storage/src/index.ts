import Dexie, { type EntityTable } from 'dexie';
import type {
  EvidenceEvent,
  ResolvedExtension,
  RewardEvent,
  SkillState,
} from '../../extension-contracts/src/types.ts';
export interface ChildProfile {
  id: string;
  name: string;
  age?: number;
  avatar: string;
  interests?: string[];
  focusSkills?: string[];
  dailyGoalMinutes?: number;
  createdAt: string;
}
export interface LibraryItem {
  id: string;
  profileId: string;
  extensionId: string;
  version: string;
  favorite: boolean;
  addedAt: string;
}
export interface GameStateRow {
  id: string;
  profileId: string;
  extensionId: string;
  key: string;
  value: unknown;
  updatedAt: string;
}
export interface SettingRow {
  key: string;
  value: unknown;
}
export interface GameSessionRow {
  id: string;
  profileId: string;
  extensionId: string;
  startedAt: string;
  endedAt?: string;
  durationSeconds?: number;
}
export interface ExtensionCacheRow extends ResolvedExtension {
  key: string;
}
export class AprincarDatabase extends Dexie {
  profiles!: EntityTable<ChildProfile, 'id'>;
  library!: EntityTable<LibraryItem, 'id'>;
  evidence!: EntityTable<EvidenceEvent, 'id'>;
  skillStates!: EntityTable<SkillState, 'skillId'>;
  rewards!: EntityTable<RewardEvent, 'id'>;
  gameState!: EntityTable<GameStateRow, 'id'>;
  extensionCache!: EntityTable<ExtensionCacheRow, 'key'>;
  settings!: EntityTable<SettingRow, 'key'>;
  sessions!: EntityTable<GameSessionRow, 'id'>;
  constructor() {
    super('aprincar');
    this.version(1).stores({
      profiles: 'id,createdAt',
      library: 'id,profileId,extensionId',
      evidence: 'id,[profileId+skillId],profileId,skillId,gameId,occurredAt',
      skillStates: '[profileId+skillId],profileId,skillId',
      rewards: 'id,profileId,gameId',
      gameState: 'id,[profileId+extensionId+key]',
      extensionCache: 'key,manifest.id,manifest.version',
      settings: 'key',
      sessions: 'id,profileId,extensionId,startedAt',
    });
  }
}
export const db = new AprincarDatabase();
export const extensionCacheAdapter = {
  async get(key: string) {
    const row = await db.extensionCache.get(key);
    return row
      ? { manifest: row.manifest, html: row.html, source: row.source, resolvedAt: row.resolvedAt }
      : null;
  },
  async put(key: string, value: ResolvedExtension) {
    await db.extensionCache.put({ ...value, key });
  },
  async remove(key: string) {
    await db.extensionCache.delete(key);
  },
};
export async function persistStorage() {
  if (navigator.storage?.persist) return navigator.storage.persist();
  return false;
}

export * from './usage.ts';
