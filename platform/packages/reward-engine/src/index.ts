import type { RewardEvent } from '../../extension-contracts/src/types.ts';

export interface GrantRewardInput {
  profileId: string;
  gameId: string;
  reason: string;
  amount: number;
}
export class RewardEngine {
  grant(input: GrantRewardInput): RewardEvent {
    if (!Number.isFinite(input.amount) || input.amount <= 0 || input.amount > 1000)
      throw new Error('reward amount must be between 1 and 1000');
    return { id: crypto.randomUUID(), ...input, occurredAt: new Date().toISOString() };
  }
  balance(events: RewardEvent[], profileId: string): number {
    return events.filter((e) => e.profileId === profileId).reduce((sum, e) => sum + e.amount, 0);
  }
}
