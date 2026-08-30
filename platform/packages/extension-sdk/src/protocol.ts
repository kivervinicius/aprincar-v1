export const PROTOCOL_VERSION = 1 as const;
export const GAME_MESSAGE_TYPES = [
  'game.ready',
  'session.start',
  'session.complete',
  'session.abandon',
  'evidence.submit',
  'reward.request',
  'storage.get',
  'storage.set',
  'storage.remove',
  'capability.request',
  'host.navigateBack',
] as const;
export type GameMessageType = (typeof GAME_MESSAGE_TYPES)[number];
export interface GameMessage {
  type: GameMessageType;
  requestId?: string;
  payload?: unknown;
}
export interface HostResponse {
  type: 'host.response';
  requestId: string;
  ok: boolean;
  payload?: unknown;
  error?: string;
}

const MAX_REQUEST_ID = 128;
const MAX_SKILL_ID = 160;
const MAX_REASON = 128;
const MAX_STORAGE_KEY = 128;
const MAX_STORAGE_VALUE_BYTES = 32 * 1024;
const MAX_METADATA_BYTES = 8 * 1024;
const MAX_CAPABILITY_PAYLOAD_BYTES = 64 * 1024;

function record(value: unknown): Record<string, unknown> | null {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
function finiteInRange(value: unknown, min: number, max: number) {
  return typeof value === 'number' && Number.isFinite(value) && value >= min && value <= max;
}
function encodedBytes(value: unknown) {
  try {
    const serialized = JSON.stringify(value);
    return serialized === undefined ? Infinity : new TextEncoder().encode(serialized).byteLength;
  } catch {
    return Infinity;
  }
}
function validKey(value: unknown) {
  return typeof value === 'string' && value.length > 0 && value.length <= MAX_STORAGE_KEY;
}

export function validateGameMessagePayload(message: unknown): { ok: boolean; error?: string } {
  if (!message || typeof message !== 'object') return { ok: false, error: 'message must be an object' };
  const value = message as Record<string, unknown>;
  if (typeof value.type !== 'string' || !(GAME_MESSAGE_TYPES as readonly string[]).includes(value.type))
    return { ok: false, error: 'unsupported message type' };
  if (
    value.requestId !== undefined &&
    (typeof value.requestId !== 'string' ||
      value.requestId.length === 0 ||
      value.requestId.length > MAX_REQUEST_ID)
  )
    return { ok: false, error: 'invalid requestId' };

  const payload = value.payload === undefined ? {} : record(value.payload);
  if (!payload) return { ok: false, error: 'payload must be an object' };

  switch (value.type) {
    case 'evidence.submit': {
      if (
        typeof payload.skillId !== 'string' ||
        payload.skillId.length === 0 ||
        payload.skillId.length > MAX_SKILL_ID
      )
        return { ok: false, error: 'invalid skillId' };
      if (
        payload.result !== undefined &&
        !['success', 'failure', 'observed'].includes(String(payload.result))
      )
        return { ok: false, error: 'invalid evidence result' };
      if (payload.independent !== undefined && typeof payload.independent !== 'boolean')
        return { ok: false, error: 'independent must be boolean' };
      if (
        payload.assistance !== undefined &&
        !['none', 'hint', 'guided'].includes(String(payload.assistance))
      )
        return { ok: false, error: 'invalid assistance' };
      if (payload.difficulty !== undefined && !finiteInRange(payload.difficulty, 0, 1))
        return { ok: false, error: 'difficulty must be finite between 0 and 1' };
      if (payload.confidence !== undefined && !finiteInRange(payload.confidence, 0, 1))
        return { ok: false, error: 'confidence must be finite between 0 and 1' };
      if (
        payload.attempts !== undefined &&
        (!Number.isInteger(payload.attempts) || !finiteInRange(payload.attempts, 1, 50))
      )
        return { ok: false, error: 'attempts must be an integer between 1 and 50' };
      if (payload.metadata !== undefined && encodedBytes(payload.metadata) > MAX_METADATA_BYTES)
        return { ok: false, error: 'metadata exceeds size limit' };
      return { ok: true };
    }
    case 'reward.request':
      if (payload.amount !== undefined && !finiteInRange(payload.amount, 1, 50))
        return { ok: false, error: 'reward amount must be finite between 1 and 50' };
      if (
        payload.reason !== undefined &&
        (typeof payload.reason !== 'string' || payload.reason.length > MAX_REASON)
      )
        return { ok: false, error: 'reward reason is invalid' };
      return { ok: true };
    case 'storage.get':
    case 'storage.remove':
      return validKey(payload.key) ? { ok: true } : { ok: false, error: 'storage key is invalid' };
    case 'storage.set':
      if (!validKey(payload.key)) return { ok: false, error: 'storage key is invalid' };
      if (encodedBytes(payload.value) > MAX_STORAGE_VALUE_BYTES)
        return { ok: false, error: 'storage value exceeds size limit' };
      return { ok: true };
    case 'capability.request':
      if (typeof payload.name !== 'string' || payload.name.length === 0 || payload.name.length > 128)
        return { ok: false, error: 'capability name is invalid' };
      if (payload.payload !== undefined && encodedBytes(payload.payload) > MAX_CAPABILITY_PAYLOAD_BYTES)
        return { ok: false, error: 'capability payload exceeds size limit' };
      return { ok: true };
    default:
      return { ok: true };
  }
}

export function isGameMessage(value: unknown): value is GameMessage {
  if (!value || typeof value !== 'object') return false;
  const type = (value as Record<string, unknown>).type;
  return typeof type === 'string' && (GAME_MESSAGE_TYPES as readonly string[]).includes(type);
}

export type RuntimeBudgetKind = 'evidence' | 'reward' | 'storageWrite';
export class RuntimeBudget {
  private readonly limits: Record<RuntimeBudgetKind, number>;
  private readonly used: Record<RuntimeBudgetKind, number> = { evidence: 0, reward: 0, storageWrite: 0 };

  constructor(limits: Partial<{ evidence: number; rewards: number; storageWrites: number }> = {}) {
    this.limits = {
      evidence: limits.evidence ?? 120,
      reward: limits.rewards ?? 60,
      storageWrite: limits.storageWrites ?? 120,
    };
  }

  consume(kind: RuntimeBudgetKind) {
    this.used[kind] += 1;
    if (this.used[kind] > this.limits[kind]) throw new Error(`${kind} quota exceeded for this session`);
  }

  reset() {
    this.used.evidence = 0;
    this.used.reward = 0;
    this.used.storageWrite = 0;
  }
}
