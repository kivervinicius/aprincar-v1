import { Badge, Button, Group, Text } from '@mantine/core';
import { CloudCheck, CloudOff, Compass, Sparkles, Star, Trash2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';
import { EmptyState } from '@aprincar/ui';

export function Library() {
  const { registry, libraryIds, isOfflineReady } = useAppStore();
  const [offlineStatus, setOfflineStatus] = useState<Record<string, boolean>>({});

  const list = registry.filter((e) => libraryIds.has(e.id));

  useEffect(() => {
    let mounted = true;
    (async () => {
      const statusMap: Record<string, boolean> = {};
      for (const item of list) {
        statusMap[item.id] = await isOfflineReady(item);
      }
      if (mounted) setOfflineStatus(statusMap);
    })();
    return () => {
      mounted = false;
    };
  }, [list.length, registry]);

  const offlineReadyCount = list.filter((e) => offlineStatus[e.id]).length;

  return (
    <div className="aprincar-page">
      <section className="section-head">
        <div>
          <div className="child-eyebrow">Sua coleção</div>
          <h1 style={{ fontSize: 36, margin: 0 }}>Biblioteca</h1>
          <p>As brincadeiras que você escolheu guardar ficam reunidas aqui.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge size="lg" color="teal" variant="light" leftSection={<CloudOff size={14} />}>
            {offlineReadyCount} de {list.length} prontas offline
          </Badge>
          <Button
            component={Link}
            to="/discover"
            className="ap-secondary"
            leftSection={<Compass size={17} />}
          >
            Descobrir mais
          </Button>
        </div>
      </section>

      {list.length === 0 ? (
        <EmptyState
          title="Sua biblioteca ainda está vazia"
          description="Guarde suas brincadeiras favoritas para encontrá-las facilmente e prepará-las para brincar sem internet."
          action={
            <Button component={Link} to="/discover" className="ap-primary">
              Explorar brincadeiras
            </Button>
          }
        />
      ) : (
        <div className="game-grid" style={{ marginTop: 16 }}>
          {list.map((e) => (
            <GameCard key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
