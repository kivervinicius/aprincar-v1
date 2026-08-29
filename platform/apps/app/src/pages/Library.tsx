import { Button, Text } from '@mantine/core';
import { Compass } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';

export function Library() {
  const { registry, libraryIds } = useAppStore();
  const list = registry.filter((e) => libraryIds.has(e.id));
  return (
    <div className="aprincar-page">
      <section>
        <div className="section-head">
          <div>
            <div className="child-eyebrow">Sua coleção</div>
            <h2 style={{ fontSize: 36 }}>Biblioteca</h2>
            <p>Os jogos que você escolheu ficam reunidos aqui.</p>
          </div>
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
        <div className="empty-state">
          <Text fw={850} fz="lg">
            Sua biblioteca ainda está vazia.
          </Text>
          <Text mt={5}>Adicione jogos para encontrá-los aqui e prepare os favoritos para usar offline.</Text>
          <Button component={Link} to="/discover" className="ap-primary" mt="lg">
            Explorar o Hub
          </Button>
        </div>
      ) : (
        <div className="game-grid">
          {list.map((e) => (
            <GameCard key={e.id} entry={e} />
          ))}
        </div>
      )}
    </div>
  );
}
