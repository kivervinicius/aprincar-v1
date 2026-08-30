import { Alert, Badge, Button, Group, Loader, Modal, Stack, Text } from '@mantine/core';
import { ArrowLeft, CloudOff, RotateCcw, ShieldCheck, Sparkles, Trophy } from 'lucide-react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { GameHost } from '@aprincar/extension-host';
import type { ResolvedExtension } from '@aprincar/extension-contracts';
import { extensionManager, useAppStore } from '../app-store';
import { createGameServices } from '../game-services';
import { db, sumUsageSecondsForDay } from '@aprincar/storage';
import { GameError, GameExitDialog, GameLoading, TrustBadge, OfflineBadge } from '@aprincar/ui';

export function Play() {
  const { gameId } = useParams({ from: '/play/$gameId' });
  const navigate = useNavigate();
  const { registry, profile, isOfflineReady } = useAppStore();

  const [resolved, setResolved] = useState<ResolvedExtension | null>(null);
  const [error, setError] = useState('');
  const [limitReached, setLimitReached] = useState(false);
  const [limitMinutes, setLimitMinutes] = useState(0);
  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  const entry = registry.find((e) => e.id === gameId);

  useEffect(() => {
    if (!entry || !profile) return;

    (async () => {
      // Check screen time limit
      const limit = Number((await db.settings.get(`dailyLimit:${profile.id}`))?.value ?? 0);
      setLimitMinutes(limit);
      if (limit > 0) {
        const sessions = await db.sessions.where('profileId').equals(profile.id).toArray();
        const today = new Date().toISOString().slice(0, 10);
        const used = sumUsageSecondsForDay(sessions, today);
        if (used >= limit * 60) {
          setLimitReached(true);
          return;
        }
      }

      const isOffline = await isOfflineReady(entry);
      setOffline(isOffline);

      const res = await extensionManager.resolve(entry);
      setResolved(res);
    })().catch((e) => setError(e instanceof Error ? e.message : String(e)));
  }, [entry?.id, entry?.version, profile?.id]);

  const services = useMemo(
    () => (profile && entry ? createGameServices(profile.id, gameId, entry.trust) : null),
    [profile?.id, gameId, entry?.trust],
  );

  const gameName = entry?.name?.['pt-BR'] ?? 'Jogo Aprincar';

  // Handle ESC key for exit dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExitDialogOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (limitReached) {
    return (
      <div className="game-runtime">
        <header className="game-runtime-header">
          <Link to="/" className="game-runtime-back" aria-label="Voltar ao início">
            <ArrowLeft size={21} />
            <span>Início</span>
          </Link>
          <div className="game-runtime-title">
            <strong>Hora de descansar os olhos</strong>
            <span>Aprincar</span>
          </div>
        </header>
        <main className="game-runtime-body" style={{ placeItems: 'center', textAlign: 'center' }}>
          <div className="game-runtime-message" style={{ padding: 32 }}>
            <div style={{ fontSize: 54, marginBottom: 12 }}>🌿☀️</div>
            <h2>Você atingiu seu tempo de tela hoje! ({limitMinutes} min)</h2>
            <p style={{ marginTop: 8, color: 'var(--ap-muted)', fontSize: 16 }}>
              Que tal fazer uma missão no mundo real, correr um pouco ou desenhar no papel?
            </p>
            <Group justify="center" mt="xl">
              <Button component={Link} to="/missions" className="ap-primary" size="lg">
                Ver missões fora da tela ✨
              </Button>
              <Button component={Link} to="/" className="ap-secondary" size="lg">
                Voltar para Início
              </Button>
            </Group>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="game-runtime">
      <header className="game-runtime-header">
        <button
          type="button"
          onClick={() => setExitDialogOpen(true)}
          className="game-runtime-back"
          aria-label="Sair do jogo e voltar ao início"
        >
          <ArrowLeft size={21} />
          <span>Sair</span>
        </button>

        <div className="game-runtime-title">
          <strong>{gameName}</strong>
          <span>Aprincar</span>
        </div>

        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          {entry && (
            <Badge variant="light" color="blue" size="sm" className="game-runtime-badge">
              {entry.trust === 'official' ? 'Oficial' : entry.trust}
            </Badge>
          )}
          <Badge
            variant="light"
            color="teal"
            leftSection={<CloudOff size={11} />}
            className="game-runtime-badge"
          >
            local-first
          </Badge>
        </div>
      </header>

      <main className="game-runtime-body">
        {error ? (
          <GameError
            message={error}
            onRetry={() => {
              setError('');
              if (entry)
                extensionManager
                  .resolve(entry)
                  .then(setResolved)
                  .catch((e) => setError(String(e)));
            }}
            onExit={() => navigate({ to: '/' })}
          />
        ) : !entry ? (
          <GameError
            message="Esta brincadeira não foi encontrada no catálogo."
            onExit={() => navigate({ to: '/' })}
          />
        ) : !resolved || !services ? (
          <GameLoading title={`Preparando ${gameName}…`} />
        ) : (
          <div className="game-surface">
            <GameHost
              html={resolved.html}
              manifest={resolved.manifest}
              services={services}
              title={gameName}
            />
          </div>
        )}
      </main>

      <GameExitDialog
        opened={exitDialogOpen}
        onConfirm={() => {
          setExitDialogOpen(false);
          navigate({ to: '/' });
        }}
        onCancel={() => setExitDialogOpen(false)}
      />
    </div>
  );
}
