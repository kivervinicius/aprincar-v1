import type {
  EvidenceEvent,
  SkillState,
  SkillStateName,
  TrustLevel,
} from '../../extension-contracts/src/types.ts';

function trustOf(evidence: EvidenceEvent): TrustLevel {
  return evidence.trust ?? 'official';
}
function trustWeight(evidence: EvidenceEvent): number {
  return trustOf(evidence) === 'community' ? 0.5 : 1;
}

export class ProgressEngine {
  calculate(profileId: string, skillId: string, evidence: EvidenceEvent[]): SkillState {
    const relevant = evidence.filter(
      (item) =>
        item.profileId === profileId &&
        item.skillId === skillId &&
        item.result !== 'observed' &&
        trustOf(item) !== 'experimental',
    );
    const independentSuccesses = relevant.filter((e) => e.result === 'success' && e.independent).length;
    const trustedIndependentSuccesses = relevant.filter(
      (e) => e.result === 'success' && e.independent && trustOf(e) !== 'community',
    ).length;
    const assistedSuccesses = relevant.filter((e) => e.result === 'success' && !e.independent).length;
    const failures = relevant.filter((e) => e.result === 'failure').length;
    const contexts = new Set(relevant.map((e) => e.gameId));
    const trustedContexts = new Set(relevant.filter((e) => trustOf(e) !== 'community').map((e) => e.gameId));
    const total = relevant.length;
    const effectiveTotal = relevant.reduce((sum, e) => sum + trustWeight(e), 0);
    const weightedPositive = relevant.reduce((sum, e) => {
      if (e.result !== 'success') return sum;
      const independence = e.independent ? 1 : 0.65;
      return (
        sum +
        independence *
          clamp(e.confidence, 0.25, 1) *
          (0.75 + clamp(e.difficulty, 0, 1) * 0.25) *
          trustWeight(e)
      );
    }, 0);
    const weightedNegative = relevant.reduce(
      (sum, e) => sum + (e.result === 'failure' ? 0.55 * trustWeight(e) : 0),
      0,
    );
    const score =
      effectiveTotal === 0
        ? 0
        : clamp(
            (weightedPositive - weightedNegative + effectiveTotal * 0.55) / (effectiveTotal * 1.55),
            0,
            1,
          );
    let state: SkillStateName = 'unknown';
    if (total > 0) state = 'exploring';
    if (total >= 2 && score >= 0.5) state = 'developing';
    if (total >= 4 && score >= 0.68 && independentSuccesses >= 2) state = 'comfortable';
    if (total >= 5 && score >= 0.8 && trustedIndependentSuccesses >= 3 && trustedContexts.size >= 3)
      state = 'consolidated';
    return {
      profileId,
      skillId,
      state,
      confidence: Number(score.toFixed(3)),
      evidenceCount: total,
      independentSuccesses,
      assistedSuccesses,
      failures,
      contextCount: contexts.size,
      updatedAt: relevant.at(-1)?.occurredAt ?? new Date(0).toISOString(),
    };
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
