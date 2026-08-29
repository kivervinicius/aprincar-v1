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
export function isGameMessage(value: unknown): value is GameMessage {
  if (!value || typeof value !== 'object') return false;
  const type = (value as Record<string, unknown>).type;
  return typeof type === 'string' && (GAME_MESSAGE_TYPES as readonly string[]).includes(type);
}
