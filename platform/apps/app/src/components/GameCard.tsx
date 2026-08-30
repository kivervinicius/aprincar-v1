import { Badge, Button, Group, Text } from '@mantine/core';
import { CloudDownload, Play, Star } from 'lucide-react';
import type { RegistryEntry } from '@aprincar/extension-contracts';
import { OfflineBadge } from '@aprincar/ui';
import { useEffect, useMemo, useState } from 'react';
import { useAppStore } from '../app-store';
import { Link } from '@tanstack/react-router';

function art(entry: RegistryEntry) {
  const tags = entry.tags ?? [];
  if (entry.id.includes('space-shapes')) return { emoji: '🪐', cls: 'cover-3d' };
  if (entry.id.includes('memory')) return { emoji: '🦕🦊', cls: 'cover-memory' };
  if (tags.includes('letters') || tags.includes('writing')) return { emoji: 'Aa', cls: 'cover-letters' };
  if (tags.includes('paint') || tags.includes('creative')) return { emoji: '🎨', cls: 'cover-paint' };
  if (tags.includes('colors')) return { emoji: '●▲■', cls: 'cover-colors' };
  if (tags.includes('logic') || tags.includes('patterns')) return { emoji: '🧩', cls: 'cover-logic' };
  if (tags.includes('math') || tags.includes('counting')) return { emoji: '123', cls: 'cover-math' };
  return { emoji: '🎮', cls: 'cover-logic' };
}

export function GameCard({ entry, compact = false }: { entry: RegistryEntry; compact?: boolean }) {
  const store = useAppStore();
  const [offline, setOffline] = useState(false);
  const cover = useMemo(() => art(entry), [entry.id, entry.tags?.join(',')]);
  useEffect(() => {
    store.isOfflineReady(entry).then(setOffline);
  }, [entry.id, entry.version]);
  const name = entry.name['pt-BR'] ?? entry.id.split('.').at(-1)?.replaceAll('-', ' ');

  return (
    <article className={`child-card ${compact ? 'compact' : ''}`} data-game-id={entry.id}>
      <Link
        to="/play/$gameId"
        params={{ gameId: entry.id }}
        className="game-card-main-link"
        aria-label={`Jogar ${name}`}
      >
        <div className={`game-cover ${cover.cls}`}>
          <div className="game-cover-art">{cover.emoji}</div>
          <div className="game-cover-play">
            <Play size={20} fill="currentColor" />
          </div>
        </div>
      </Link>
      <div className="game-card-body">
        <Group justify="space-between" gap="xs" wrap="nowrap" className="game-card-heading">
          <div className="game-title">{name}</div>
        </Group>
        <div className="game-meta">
          <Badge radius="xl" variant="light">
            {entry.ageGuidance?.min ?? 2}–{entry.ageGuidance?.max ?? 10} anos
          </Badge>
          <span className="game-offline-badge">
            <OfflineBadge ready={offline} />
          </span>
          {entry.tags?.slice(0, 1).map((tag) => (
            <Badge key={tag} variant="outline" radius="xl" className="game-tag-badge">
              {tag}
            </Badge>
          ))}
        </div>
        {!compact && (
          <Text size="sm" c="dimmed" lineClamp={2} className="game-card-description">
            {entry.description?.['pt-BR'] ?? 'Uma experiência Aprincar.'}
          </Text>
        )}
        <div className="game-actions">
          <Link to="/play/$gameId" params={{ gameId: entry.id }}>
            <Button className="ap-primary game-play-button" fullWidth leftSection={<Play size={16} />}>
              Jogar
            </Button>
          </Link>
          <Button
            className="ap-secondary game-card-library-action"
            leftSection={<Star size={16} />}
            onClick={() => store.addLibrary(entry)}
          >
            Biblioteca
          </Button>
        </div>
        {!offline && (
          <Button
            className="game-card-offline-action"
            variant="subtle"
            color="blue"
            size="xs"
            leftSection={<CloudDownload size={15} />}
            onClick={async () => {
              await store.prepareOffline(entry);
              setOffline(true);
            }}
          >
            Disponibilizar offline
          </Button>
        )}
      </div>
    </article>
  );
}
