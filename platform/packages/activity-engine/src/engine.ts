import type {
  ActivityDefinition,
  ActivityAttempt,
  EvaluationResult,
  ProgressiveHint,
  AssistanceLevel,
} from './types.ts';

export function getAssistanceLevelForAttempt(attemptNumber: number): AssistanceLevel {
  if (attemptNumber <= 1) return 'none';
  if (attemptNumber === 2) return 'visual-cue';
  if (attemptNumber === 3) return 'reduced-complexity';
  return 'partial-demonstration';
}

export function generateProgressiveHint(
  activity: ActivityDefinition,
  attemptNumber: number,
  lastAttempt?: ActivityAttempt,
): ProgressiveHint {
  const level = getAssistanceLevelForAttempt(attemptNumber);

  switch (level) {
    case 'none':
      return {
        level,
        message: 'Experimente e descubra!',
      };

    case 'visual-cue': {
      let targetId: string | undefined;
      let itemId: string | undefined;

      if (activity.type === 'sorting' && activity.targets && activity.targets.length > 0) {
        const firstTarget = activity.targets[0];
        if (firstTarget) {
          targetId = firstTarget.id;
          const matchingItem = activity.items.find((item) => {
            if (firstTarget.acceptsValue !== undefined) return item.value === firstTarget.acceptsValue;
            if (firstTarget.acceptsAttribute) {
              return (
                item.attributes?.[firstTarget.acceptsAttribute.key] === firstTarget.acceptsAttribute.value
              );
            }
            return false;
          });
          itemId = matchingItem?.id;
        }
      }

      return {
        level,
        message: 'Quase! Veja onde esse elemento combina.',
        highlightedTargetId: targetId,
        highlightedItemId: itemId,
        suggestedAction: 'Observe as cores e formas com atenção.',
      };
    }

    case 'reduced-complexity': {
      const eliminated = activity.items
        .slice(Math.max(2, Math.floor(activity.items.length / 2)))
        .map((i) => i.id);
      return {
        level,
        message: 'Vamos simplificar para descobrirmos juntos.',
        eliminatedItemIds: eliminated,
        suggestedAction: 'Concentre-se em poucos objetos de cada vez.',
      };
    }

    case 'partial-demonstration': {
      const firstTarget = activity.targets?.[0];
      const matchingItem = activity.items.find((item) => {
        if (!firstTarget) return false;
        if (firstTarget.acceptsValue !== undefined) return item.value === firstTarget.acceptsValue;
        if (firstTarget.acceptsAttribute) {
          return item.attributes?.[firstTarget.acceptsAttribute.key] === firstTarget.acceptsAttribute.value;
        }
        return false;
      });

      return {
        level,
        message: 'Vamos ver juntos como funciona esta etapa.',
        highlightedTargetId: firstTarget?.id,
        highlightedItemId: matchingItem?.id,
        suggestedAction: `Veja: este elemento vai aqui!`,
      };
    }
  }
}

export function evaluateActivityAttempt(
  activity: ActivityDefinition,
  attempt: ActivityAttempt,
  attemptNumber = 1,
): EvaluationResult {
  const assistanceLevel = getAssistanceLevelForAttempt(attemptNumber);

  switch (activity.type) {
    case 'sorting': {
      if (!attempt.placements || !activity.targets) {
        return {
          valid: false,
          score: 0,
          assistanceLevel,
          feedbackMessage: 'Vamos tentar de outro jeito?',
          remainingAttemptsAllowed: true,
        };
      }

      const misplaced: string[] = [];
      const correct: string[] = [];

      for (const item of activity.items) {
        const targetId = attempt.placements[item.id];
        if (!targetId) {
          misplaced.push(item.id);
          continue;
        }

        const target = activity.targets.find((t) => t.id === targetId);
        if (!target) {
          misplaced.push(item.id);
          continue;
        }

        let isMatch = false;
        if (target.acceptsValue !== undefined) {
          isMatch = item.value === target.acceptsValue;
        } else if (target.acceptsAttribute) {
          isMatch = item.attributes?.[target.acceptsAttribute.key] === target.acceptsAttribute.value;
        } else {
          isMatch = true;
        }

        if (isMatch) {
          correct.push(item.id);
        } else {
          misplaced.push(item.id);
        }
      }

      const isValid = misplaced.length === 0 && correct.length === activity.items.length;
      const score = activity.items.length > 0 ? correct.length / activity.items.length : 0;

      return {
        valid: isValid,
        score,
        assistanceLevel,
        feedbackMessage: isValid
          ? '✨ Muito bem! Você organizou tudo direitinho!'
          : 'Quase lá. Vamos ajustar?',
        misplacedItemIds: misplaced,
        correctItemIds: correct,
        remainingAttemptsAllowed: true,
      };
    }

    case 'counting': {
      const selected = attempt.selectedCount ?? attempt.selectedIds?.length ?? 0;
      const expected =
        activity.expectedCount ??
        (typeof activity.items[0]?.value === 'number' ? activity.items[0].value : activity.items.length);
      const isValid = selected === expected;

      return {
        valid: isValid,
        score: isValid ? 1 : 0,
        assistanceLevel,
        feedbackMessage: isValid
          ? '✨ Isso mesmo! Quantidade certinha!'
          : 'Quase! Vamos contar novamente juntos?',
        remainingAttemptsAllowed: true,
      };
    }

    case 'sequencing': {
      const chosen = attempt.sequence ?? [];
      const expected = activity.expectedSequence ?? activity.items.map((i) => i.id);
      const isMatch = chosen.length === expected.length && chosen.every((id, idx) => id === expected[idx]);

      return {
        valid: isMatch,
        score: isMatch ? 1 : 0,
        assistanceLevel,
        feedbackMessage: isMatch
          ? '✨ Incrível! A sequência ficou perfeita!'
          : 'Tente de outro jeito. Qual vem primeiro?',
        remainingAttemptsAllowed: true,
      };
    }

    case 'matching':
    case 'drag-and-drop':
    case 'tracing':
    default: {
      const valid = Boolean(attempt.selectedIds && attempt.selectedIds.length > 0);
      return {
        valid,
        score: valid ? 1 : 0,
        assistanceLevel,
        feedbackMessage: valid ? '✨ Muito bem!' : 'Vamos tentar de outro jeito?',
        remainingAttemptsAllowed: true,
      };
    }
  }
}
