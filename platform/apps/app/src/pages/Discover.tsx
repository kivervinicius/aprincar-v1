import { Button, TextInput } from '@mantine/core';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';

const filters = [
  ['all', 'Todos'],
  ['math', 'Números'],
  ['letters', 'Letras'],
  ['logic', 'Lógica'],
  ['creative', 'Criar'],
  ['3d', '3D'],
] as const;

export function Discover() {
  const { registry } = useAppStore();
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const list = useMemo(
    () =>
      registry.filter((e) => {
        const hay = (
          e.id +
          ' ' +
          (e.name?.['pt-BR'] ?? '') +
          ' ' +
          (e.description?.['pt-BR'] ?? '') +
          ' ' +
          (e.tags ?? []).join(' ')
        ).toLowerCase();
        const qok = !q || hay.includes(q.toLowerCase());
        const fok =
          filter === 'all' || (filter === '3d' ? e.id.includes('3d') : (e.tags ?? []).includes(filter));
        return qok && fok;
      }),
    [registry, q, filter],
  );
  return (
    <div className="aprincar-page">
      <section className="hub-hero">
        <div>
          <div className="child-eyebrow" style={{ color: '#BDB4FF' }}>
            Aprincar Hub
          </div>
          <h1>Jogos são peças do ecossistema.</h1>
          <p>
            Explore experiências oficiais, curadas e da comunidade. Você pode jogar online e preparar seus
            favoritos para funcionar offline.
          </p>
        </div>
        <div className="hub-stat">
          <strong>{registry.length}</strong>
          <span>jogos disponíveis</span>
        </div>
      </section>
      <section className="aprincar-panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <TextInput
            leftSection={<Search size={17} />}
            placeholder="Buscar jogos, temas ou habilidades..."
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            style={{ flex: '1 1 320px' }}
            radius="xl"
          />
          <Button variant="light" color="violet" leftSection={<SlidersHorizontal size={16} />}>
            Filtros
          </Button>
        </div>
        <div className="filter-row" style={{ marginTop: 13 }}>
          {filters.map(([id, label]) => (
            <button
              key={id}
              className={`filter-chip ${filter === id ? 'active' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <section>
        <div className="section-head">
          <div>
            <h2>{list.length} jogos para descobrir</h2>
            <p>Escolha livremente. Idade e skills orientam recomendações, mas não bloqueiam o adulto.</p>
          </div>
        </div>
        <div className="game-grid" style={{ marginTop: 15 }}>
          {list.map((e) => (
            <GameCard key={e.id} entry={e} />
          ))}
        </div>
        {list.length === 0 && (
          <div className="empty-state" style={{ marginTop: 14 }}>
            Não encontramos jogos com esses filtros.
          </div>
        )}
      </section>
    </div>
  );
}
