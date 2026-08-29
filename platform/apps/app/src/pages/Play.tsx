import { Alert, Loader, Stack, Text } from '@mantine/core';
import { useParams } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { GameHost } from '@aprincar/extension-host';
import type { ResolvedExtension } from '@aprincar/extension-contracts';
import { extensionManager, useAppStore } from '../app-store';
import { createGameServices } from '../game-services';
import { db, sumUsageSecondsForDay } from '@aprincar/storage';
export function Play() {
  const { gameId } = useParams({ from: '/play/$gameId' });
  const { registry, profile } = useAppStore();
  const [resolved, setResolved] = useState<ResolvedExtension | null>(null);
  const [error, setError] = useState('');
  const entry = registry.find((e) => e.id === gameId);
  useEffect(() => {
    if (!entry || !profile) return;
    (async () => {
      const limit = Number((await db.settings.get(`dailyLimit:${profile.id}`))?.value ?? 0);
      if (limit > 0) {
        const sessions = await db.sessions.where('profileId').equals(profile.id).toArray();
        const today = new Date().toISOString().slice(0, 10);
        const used = sumUsageSecondsForDay(sessions, today);
        if (used >= limit * 60) {
          setError(`O limite diário de ${limit} minutos foi atingido.`);
          return;
        }
      }
      setResolved(await extensionManager.resolve(entry));
    })().catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [entry?.id, entry?.version, profile?.id]);
  const services = useMemo(
    () => (profile ? createGameServices(profile.id, gameId) : null),
    [profile?.id, gameId],
  );
  if (error) return <Alert color="red">{error}</Alert>;
  if (!entry) return <Alert>Jogo não encontrado no registry.</Alert>;
  if (!resolved || !services)
    return (
      <Stack align="center" py={80}>
        <Loader />
        <Text>Preparando jogo…</Text>
      </Stack>
    );
  return (
    <div className="game-surface">
      <GameHost html={resolved.html} manifest={resolved.manifest} services={services} />
    </div>
  );
}
