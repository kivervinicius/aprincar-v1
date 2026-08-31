import { Button, Group, RangeSlider, Select, Text, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Compass, RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';
import { EmptyState } from '@aprincar/ui';

const childCategories = [
  ['all', 'Todos', '🌟'],
  ['math', 'Números', '🔢'],
  ['letters', 'Letras', '🔤'],
  ['logic', 'Lógica', '🧩'],
  ['creative', 'Criar', '🎨'],
  ['colors', 'Cores', '🌈'],
  ['3d', '3D', '🪐'],
] as const;

export function Discover() {
  const { registry } = useAppStore();
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('all');

  // Adult filter state
  const [adultFiltersOpen, { toggle: toggleAdultFilters }] = useDisclosure(false);
  const [trustFilter, setTrustFilter] = useState<string>('all');
  const [ageRange, setAgeRange] = useState<[number, number]>([2, 10]);

  const list = useMemo(() => {
    return registry.filter((e) => {
      // Text query
      const hay = (
        e.id +
        ' ' +
        (e.name?.['pt-BR'] ?? '') +
        ' ' +
        (e.description?.['pt-BR'] ?? '') +
        ' ' +
        (e.tags ?? []).join(' ') +
        ' ' +
        (e.skills ?? []).join(' ')
      ).toLowerCase();
      const qok = !q || hay.includes(q.toLowerCase());

      // Child category filter
      const catOk =
        category === 'all' || (category === '3d' ? e.id.includes('3d') : (e.tags ?? []).includes(category));

      // Adult filters
      const trustOk = trustFilter === 'all' || e.trust === trustFilter;
      const minAge = e.ageGuidance?.min ?? 2;
      const maxAge = e.ageGuidance?.max ?? 10;
      const ageOk = minAge <= ageRange[1] && maxAge >= ageRange[0];

      return qok && catOk && trustOk && ageOk;
    });
  }, [registry, q, category, trustFilter, ageRange]);

  const resetFilters = () => {
    setQ('');
    setCategory('all');
    setTrustFilter('all');
    setAgeRange([2, 10]);
  };

  return (
    <div className="aprincar-page">
      {/* Hub Hero */}
      <section className="hub-hero">
        <div>
          <div className="child-eyebrow" style={{ color: '#BDB4FF' }}>
            Aprincar Hub & Descoberta
          </div>
          <h1>Explore brincadeiras e atividades</h1>
          <p>
            Descubra experiências criadas com carinho pedagógico. Você pode jogar online e guardar suas
            favoritas para brincar offline.
          </p>
        </div>
        <div className="hub-stat">
          <strong>{registry.length}</strong>
          <span>brincadeiras no catálogo</span>
        </div>
      </section>

      {/* Search and Category Filter Bar */}
      <section className="aprincar-panel" style={{ padding: 18 }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <TextInput
            leftSection={<Search size={17} />}
            placeholder="Buscar brincadeiras, temas ou palavras…"
            value={q}
            onChange={(e) => setQ(e.currentTarget.value)}
            style={{ flex: '1 1 300px' }}
            radius="xl"
            aria-label="Buscar brincadeiras"
          />
          <Button
            variant={adultFiltersOpen ? 'filled' : 'light'}
            color="violet"
            leftSection={<SlidersHorizontal size={16} />}
            onClick={toggleAdultFilters}
          >
            Filtros do adulto
          </Button>
        </div>

        {/* Child Category Chips */}
        <div className="filter-row" style={{ marginTop: 14 }}>
          {childCategories.map(([id, label, icon]) => (
            <button
              key={id}
              className={`filter-chip ${category === id ? 'active' : ''}`}
              onClick={() => setCategory(id)}
            >
              <span>{icon}</span> {label}
            </button>
          ))}
        </div>

        {/* Collapsible Adult Filters */}
        {adultFiltersOpen && (
          <div
            className="adult-filters-box"
            style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--ap-border)' }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              <div>
                <Text size="sm" fw={800} mb={6}>
                  Nível de confiança (Trust)
                </Text>
                <Select
                  value={trustFilter}
                  onChange={(v) => setTrustFilter(v ?? 'all')}
                  data={[
                    { value: 'all', label: 'Todos os níveis' },
                    { value: 'official', label: 'Oficial Aprincar' },
                    { value: 'curated', label: 'Curado pela equipe' },
                    { value: 'community', label: 'Comunidade' },
                    { value: 'experimental', label: 'Experimental' },
                  ]}
                  radius="md"
                />
              </div>

              <div>
                <Text size="sm" fw={800} mb={6}>
                  Faixa etária sugerida ({ageRange[0]} a {ageRange[1]} anos)
                </Text>
                <RangeSlider
                  min={2}
                  max={12}
                  step={1}
                  value={ageRange}
                  onChange={setAgeRange}
                  color="violet"
                  mt="sm"
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <Button
                  variant="subtle"
                  color="gray"
                  leftSection={<RotateCcw size={14} />}
                  onClick={resetFilters}
                >
                  Limpar filtros
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Results grid */}
      <section>
        <div className="section-head">
          <div>
            <h2>{list.length} experiências encontradas</h2>
            <p>Escolha livremente. Todas respeitam o ritmo da criança e não possuem anúncios.</p>
          </div>
        </div>
        {list.length === 0 ? (
          <EmptyState
            title="Nenhuma brincadeira encontrada"
            description="Tente ajustar sua busca ou limpar os filtros para encontrar outras experiências."
            action={
              <Button className="ap-primary" onClick={resetFilters}>
                Ver todas as brincadeiras
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
      </section>
    </div>
  );
}
