import type { ExtensionManifest, EvidenceEvent, TrustLevel } from '@aprincar/extension-contracts';
import { RuntimeBudget, validateGameMessagePayload } from '@aprincar/game-sdk';
import { db } from '@aprincar/storage';
import { getSkill } from '@aprincar/skill-graph';
import { ProgressEngine } from '@aprincar/progress-engine';
import { RewardEngine } from '@aprincar/reward-engine';
import { evaluateHandwriting } from '@aprincar/handwriting';

const progress = new ProgressEngine();
const rewards = new RewardEngine();

export function createGameServices(profileId: string, gameId: string, trust: TrustLevel = 'official') {
  let sessionId = crypto.randomUUID();
  const budget = new RuntimeBudget();

  return {
    async handle(message: { type: string; requestId?: string; payload?: any }, manifest: ExtensionManifest) {
      const validation = validateGameMessagePayload(message);
      if (!validation.ok) throw new Error(`Invalid game message: ${validation.error}`);

      const p = message.payload ?? {};
      switch (message.type) {
        case 'game.ready':
          return { profile: { id: profileId }, gameId, trust };
        case 'session.start': {
          sessionId = crypto.randomUUID();
          budget.reset();
          await db.sessions.put({
            id: sessionId,
            profileId,
            extensionId: gameId,
            startedAt: new Date().toISOString(),
          });
          return { sessionId };
        }
        case 'session.complete':
        case 'session.abandon': {
          const row = await db.sessions.get(sessionId);
          if (row) {
            const endedAt = new Date().toISOString();
            const durationSeconds = Math.max(
              0,
              Math.round((Date.parse(endedAt) - Date.parse(row.startedAt)) / 1000),
            );
            await db.sessions.put({ ...row, endedAt, durationSeconds });
          }
          return { sessionId };
        }
        case 'evidence.submit': {
          budget.consume('evidence');
          const skillId = String(p.skillId ?? '');
          if (
            !manifest.contributes.skills.includes(skillId) &&
            !manifest.contributes.secondarySkills?.includes(skillId)
          )
            throw new Error('Game cannot emit evidence for undeclared skill');
          if (!getSkill(skillId)) throw new Error('Unknown skill');

          const requestedResult =
            p.result === 'failure' ? 'failure' : p.result === 'observed' ? 'observed' : 'success';
          const ev: EvidenceEvent = {
            id: crypto.randomUUID(),
            profileId,
            gameId,
            sessionId,
            skillId,
            result: trust === 'experimental' ? 'observed' : requestedResult,
            independent: p.independent !== false,
            assistance: p.assistance ?? 'none',
            difficulty: Number(p.difficulty ?? 0.5),
            confidence: Number(p.confidence ?? 0.85),
            attempts: Number(p.attempts ?? 1),
            metadata: p.metadata,
            trust,
            occurredAt: new Date().toISOString(),
          };
          await db.evidence.add(ev);

          if (trust !== 'experimental') {
            const evidence = await db.evidence
              .where('[profileId+skillId]')
              .equals([profileId, skillId])
              .toArray();
            await db.skillStates.put(progress.calculate(profileId, skillId, evidence));
          }
          return { accepted: true, affectsProgress: trust !== 'experimental' };
        }
        case 'reward.request': {
          budget.consume('reward');
          const event = rewards.grant({
            profileId,
            gameId,
            reason: String(p.reason ?? 'play'),
            amount: Number(p.amount ?? 1),
          });
          await db.rewards.add(event);
          return event;
        }
        case 'storage.get': {
          if (!manifest.permissions.includes('storage')) throw new Error('storage permission not declared');
          const key = `${profileId}:${gameId}:${p.key}`;
          return (await db.gameState.get(key))?.value ?? null;
        }
        case 'storage.set': {
          if (!manifest.permissions.includes('storage')) throw new Error('storage permission not declared');
          budget.consume('storageWrite');
          const key = `${profileId}:${gameId}:${p.key}`;
          await db.gameState.put({
            id: key,
            profileId,
            extensionId: gameId,
            key: String(p.key),
            value: p.value,
            updatedAt: new Date().toISOString(),
          });
          return { saved: true };
        }
        case 'storage.remove': {
          if (!manifest.permissions.includes('storage')) throw new Error('storage permission not declared');
          budget.consume('storageWrite');
          await db.gameState.delete(`${profileId}:${gameId}:${p.key}`);
          return { removed: true };
        }
        case 'capability.request': {
          if (p.name === 'handwriting.evaluate') {
            if (!manifest.permissions.includes('handwriting'))
              throw new Error('handwriting permission not declared');
            return evaluateHandwriting(p.payload);
          }
          if (p.name === 'haptics' && manifest.permissions.includes('haptics')) {
            navigator.vibrate?.(20);
            return { ok: true };
          }
          throw new Error('Capability not available');
        }
        case 'host.navigateBack':
          history.back();
          return { ok: true };
        default:
          throw new Error(`Unsupported game message: ${message.type}`);
      }
    },
  };
}
