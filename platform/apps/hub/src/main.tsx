import React, { useEffect, useMemo, useState } from 'react';
import ReactDOM from 'react-dom/client';
import '@mantine/core/styles.css';
import './styles.css';
import { Badge, Group, MantineProvider, Text, TextInput } from '@mantine/core';
import { Search } from 'lucide-react';
import { AprincarMascot, Brand, TrustBadge } from '@aprincar/ui';
function artwork(e: any) {
  if (e.id.includes('3d')) return '🪐';
  if (e.id.includes('memory')) return '🦕🦊';
  if ((e.tags ?? []).includes('letters')) return 'Aa';
  if ((e.tags ?? []).includes('paint')) return '🎨';
  if ((e.tags ?? []).includes('math')) return '123';
  if ((e.tags ?? []).includes('colors')) return '●▲■';
  return '🧩';
}
function appUrl(gameId: string) {
  const configured = String(import.meta.env.VITE_APRINCAR_APP_URL ?? '').replace(/\/$/, '');
  if (configured) return `${configured}/play/${encodeURIComponent(gameId)}`;
  const basePath = String(import.meta.env.BASE_URL || '/');
  const siblingApp = basePath.replace(/\/hub\/?$/, '/app');
  const normalized = siblingApp === basePath ? '/app' : siblingApp.replace(/\/$/, '');
  return `${normalized}/play/${encodeURIComponent(gameId)}`;
}

function Hub() {
  const [registry, setRegistry] = useState<any[]>([]),
    [q, setQ] = useState(''),
    [filter, setFilter] = useState('all');
  useEffect(() => {
    (async () => {
      const urls = [
        `${import.meta.env.BASE_URL}registry.json`,
        ...String(import.meta.env.VITE_APRINCAR_REGISTRY_URLS ?? '')
          .split(',')
          .map((x) => x.trim())
          .filter(Boolean),
      ];
      const map = new Map();
      for (const url of urls) {
        try {
          const r = await fetch(url);
          if (!r.ok) continue;
          for (const e of await r.json()) map.set(`${e.id}@${e.version}`, e);
        } catch {}
      }
      setRegistry([...map.values()]);
    })();
  }, []);
  const list = useMemo(
    () =>
      registry.filter((e) => {
        const hay = (e.id + ' ' + (e.name?.['pt-BR'] ?? '') + ' ' + (e.tags ?? []).join(' ')).toLowerCase();
        return (
          (!q || hay.includes(q.toLowerCase())) &&
          (filter === 'all' || (filter === '3d' ? e.id.includes('3d') : (e.tags ?? []).includes(filter)))
        );
      }),
    [registry, q, filter],
  );
  return (
    <div className="hub-page">
      <div className="hub-top">
        <Brand />
        <Badge variant="light" color="violet" radius="xl">
          Hub público
        </Badge>
      </div>
      <section className="hub-banner">
        <div>
          <Text size="xs" fw={900} tt="uppercase" c="#BDB4FF">
            Comunidade Aprincar
          </Text>
          <h1>Jogos são peças do ecossistema.</h1>
          <p>
            Experiências abertas, revisadas pelo mesmo contrato de extensões e prontas para funcionar online
            ou offline quando preparadas no dispositivo.
          </p>
        </div>
        <div className="hub-hero-side">
          <AprincarMascot size={132} withPencil={false} className="hub-mascot" />
          <div className="hub-stat">
            <strong>{registry.length}</strong>
            <span>jogos publicados</span>
          </div>
        </div>
      </section>
      <section className="hub-toolbar">
        <TextInput
          leftSection={<Search size={17} />}
          placeholder="Buscar jogos, habilidades ou temas..."
          value={q}
          onChange={(e) => setQ(e.currentTarget.value)}
          radius="xl"
        />
        <div className="hub-filters">
          {(
            [
              ['all', 'Todos'],
              ['math', 'Números'],
              ['letters', 'Letras'],
              ['logic', 'Lógica'],
              ['creative', 'Criar'],
              ['3d', '3D'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              className={`hub-chip ${filter === id ? 'active' : ''}`}
              onClick={() => setFilter(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </section>
      <Group justify="space-between" mb="md">
        <div>
          <Text fw={900} fz={28}>
            Todos os jogos
          </Text>
          <Text c="dimmed">Oficiais, curados e contribuições da comunidade.</Text>
        </div>
      </Group>
      <div className="hub-grid">
        {list.map((e) => (
          <article className="hub-card" key={e.id}>
            <div className="hub-cover">{artwork(e)}</div>
            <div className="hub-body">
              <Group justify="space-between">
                <TrustBadge trust={e.trust} />
                <Badge variant="light" radius="xl">
                  {e.ageGuidance?.min}–{e.ageGuidance?.max} anos
                </Badge>
              </Group>
              <div className="hub-title">{e.name?.['pt-BR'] ?? e.id}</div>
              <Group gap={6}>
                {(e.tags ?? []).slice(0, 2).map((t: string) => (
                  <Badge key={t} variant="outline" radius="xl">
                    {t}
                  </Badge>
                ))}
              </Group>
              <div className="hub-actions">
                <a href={appUrl(e.id)}>
                  <button>Abrir no Aprincar</button>
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <MantineProvider>
    <Hub />
  </MantineProvider>,
);
