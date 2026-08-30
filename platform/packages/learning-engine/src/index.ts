import type { RegistryEntry, SkillState } from '../../extension-contracts/src/types.ts';

export interface LearningInput {
  profileId: string;
  age?: number;
  interests?: string[];
  registry: RegistryEntry[];
  skillStates: SkillState[];
  recentGameIds?: string[];
}

export interface LearningRecommendation {
  entry: RegistryEntry;
  reason: 'develop-skill' | 'expand-context' | 'interest-match' | 'explore';
  targetSkillId?: string;
  difficulty: number;
}

export function recommendNextExperience(input: LearningInput): LearningRecommendation | null {
  const recent = new Set(input.recentGameIds ?? []);
  const candidates = input.registry.filter((entry) => entry.experience);
  if (!candidates.length) return null;
  const ranked = candidates.map((entry) => {
    const skillId = entry.skills[0];
    const state = input.skillStates.find(
      (item) => item.profileId === input.profileId && item.skillId === skillId,
    );
    const ageFit =
      input.age === undefined ||
      !entry.ageGuidance ||
      (input.age >= entry.ageGuidance.min && input.age <= entry.ageGuidance.max)
        ? 12
        : 0;
    const interestFit =
      (input.interests ?? []).filter((interest) => entry.tags?.includes(interest)).length * 8;
    const recentPenalty = recent.has(entry.id) ? -40 : 0;
    const confidence = state?.confidence ?? 0;
    const develop =
      state && ['unknown', 'exploring', 'developing'].includes(state.state) ? 35 + (1 - confidence) * 20 : 0;
    const unseen = state ? 0 : 18;
    const reason: LearningRecommendation['reason'] =
      develop > 0
        ? 'develop-skill'
        : unseen > 0
          ? 'expand-context'
          : interestFit > 0
            ? 'interest-match'
            : 'explore';
    return {
      entry,
      skillId,
      score: ageFit + interestFit + recentPenalty + develop + unseen,
      reason,
      confidence,
    };
  });
  ranked.sort((a, b) => b.score - a.score || a.entry.id.localeCompare(b.entry.id));
  const selected = ranked[0]!;
  return {
    entry: selected.entry,
    reason: selected.reason,
    targetSkillId: selected.skillId,
    difficulty: Math.max(0.1, Math.min(1, 0.35 + selected.confidence * 0.4)),
  };
}
