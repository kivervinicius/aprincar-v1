import type { RegistryEntry, SkillState } from '@aprincar/extension-contracts';

export interface LearningRecommendationInput {
  profile?: {
    id: string;
    name: string;
    age?: number;
    interests?: string[];
    focusSkills?: string[];
  } | null;
  registry: RegistryEntry[];
  skillStates?: SkillState[];
  recentGameIds?: string[];
  offlineReadyIds?: Set<string>;
  libraryIds?: Set<string>;
  isOffline?: boolean;
}

export interface RecommendationScore {
  entry: RegistryEntry;
  score: number;
  reason: string;
  skillId?: string;
  focusSkillMatch: boolean;
  interestMatch: boolean;
  contextDiversityBonus: boolean;
  noveltyBonus: boolean;
}

export interface LearningRecommendation {
  recommended: RegistryEntry | null;
  reason: string;
  ranked: RecommendationScore[];
}

export function recommendNextExperience(input: LearningRecommendationInput): LearningRecommendation {
  const {
    profile,
    registry,
    skillStates = [],
    recentGameIds = [],
    offlineReadyIds = new Set(),
    libraryIds = new Set(),
    isOffline = false,
  } = input;

  if (!registry || registry.length === 0) {
    return { recommended: null, reason: 'Nenhum jogo disponível no momento.', ranked: [] };
  }

  const skillStateMap = new Map<string, SkillState>();
  for (const st of skillStates) {
    skillStateMap.set(st.skillId, st);
  }

  const childAge = profile?.age ?? 5;
  const interests = new Set(profile?.interests ?? []);
  const focusSkills = new Set(profile?.focusSkills ?? []);
  const recentWindow = recentGameIds.slice(-5);
  const lastPlayedId = recentWindow.length > 0 ? recentWindow[recentWindow.length - 1] : null;

  const ranked: RecommendationScore[] = registry.map((entry) => {
    let score = 50; // Base score
    const reasons: string[] = [];

    const contributesSkills = entry.skills ?? [];
    let focusMatch = false;
    let needsPractice = false;
    let contextDiversity = false;

    // 1. Alinhamento com Foco Pedagógico & Estado de Habilidade
    for (const skillId of contributesSkills) {
      if (focusSkills.has(skillId)) {
        score += 30;
        focusMatch = true;
        reasons.push('Desenvolve habilidade em foco');
      }

      const st = skillStateMap.get(skillId);
      if (st) {
        if (st.state === 'developing' || st.state === 'exploring') {
          score += 20;
          needsPractice = true;
        } else if (st.state === 'consolidated') {
          score -= 10; // Habilidade já dominada tem leve despriorização para dar espaço a novas
        }

        // Context Diversity: Se a habilidade está sendo praticada mas o jogo anterior foi diferente
        const playedThisGameForSkill = recentWindow.includes(entry.id);
        if (!playedThisGameForSkill && (st.state === 'developing' || st.state === 'exploring')) {
          score += 18;
          contextDiversity = true;
          reasons.push('Novo contexto para a mesma habilidade');
        }
      } else {
        // Habilidade ainda não iniciada (Descoberta)
        score += 12;
      }
    }

    // 2. Interesses da Criança
    let interestMatch = false;
    const tags = entry.tags ?? [];
    for (const tag of tags) {
      if (interests.has(tag)) {
        score += 15;
        interestMatch = true;
        reasons.push('Combina com os interesses da criança');
        break;
      }
    }

    // 3. Faixa Etária Apropriada
    if (entry.ageGuidance) {
      if (childAge >= entry.ageGuidance.min && childAge <= entry.ageGuidance.max) {
        score += 12;
      } else if (childAge < entry.ageGuidance.min - 1 || childAge > entry.ageGuidance.max + 2) {
        score -= 25; // Fora da faixa recomendada
      }
    }

    // 4. Novidade / Bônus de Exploração
    const noveltyBonus = !recentWindow.includes(entry.id);
    if (noveltyBonus) {
      score += 14;
      reasons.push('Nova descoberta');
    }

    // 5. Penalidade de Repetição Consecutiva
    if (entry.id === lastPlayedId) {
      score -= 40; // Evita abrir o mesmo jogo imediatamente a menos que não haja opção
    } else if (recentWindow.includes(entry.id)) {
      const idx = recentWindow.lastIndexOf(entry.id);
      const recency = recentWindow.length - 1 - idx;
      score -= Math.max(5, 25 - recency * 8);
    }

    // 6. Disponibilidade Offline
    const isCached = offlineReadyIds.has(entry.id);
    if (isOffline) {
      if (isCached) {
        score += 60;
        reasons.push('Pronto para jogar offline');
      } else {
        score -= 100; // Desprioriza fortemente jogos não cacheados no modo offline
      }
    } else if (isCached) {
      score += 8; // Leve preferência por jogos já baixados
    }

    // 7. Favorito na Biblioteca
    if (libraryIds.has(entry.id)) {
      score += 6;
    }

    const primaryReason = reasons.length > 0 ? reasons[0]! : 'Recomendado para o seu perfil';

    return {
      entry,
      score,
      reason: primaryReason,
      skillId: contributesSkills[0],
      focusSkillMatch: focusMatch,
      interestMatch,
      contextDiversityBonus: contextDiversity,
      noveltyBonus,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  const top = ranked.length > 0 ? ranked[0]! : null;

  return {
    recommended: top ? top.entry : null,
    reason: top ? top.reason : 'Explore as novidades do dia',
    ranked,
  };
}
