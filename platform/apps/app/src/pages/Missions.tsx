import { Button, Group, Text } from '@mantine/core';
import { ArrowLeft, Check, Sparkles, Trophy } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useState } from 'react';
import { MISSIONS, type MissionItem } from '../worlds';
import { MissionCard } from '@aprincar/ui';

export function Missions() {
  const [filter, setFilter] = useState('all');
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const filteredMissions = MISSIONS.filter((m) => filter === 'all' || m.worldId === filter);

  const toggleComplete = (id: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const categories = [
    { id: 'all', label: 'Todas as missões', icon: '🌟' },
    { id: 'colors-shapes', label: 'Cores e Formas', icon: '🎨' },
    { id: 'math', label: 'Matemática', icon: '🔢' },
    { id: 'logic', label: 'Lógica', icon: '🧩' },
    { id: 'language', label: 'Linguagem', icon: '🔤' },
    { id: 'writing', label: 'Escrita', icon: '✍️' },
    { id: 'construction', label: 'Construção', icon: '🏗️' },
    { id: 'computing', label: 'Pensamento Comp.', icon: '🤖' },
    { id: 'practical-life', label: 'Vida Prática', icon: '🏠' },
  ];

  return (
    <div className="aprincar-page">
      <section className="hub-hero" style={{ background: 'linear-gradient(135deg, #1d4ed8, #4338ca)' }}>
        <div>
          <div className="child-eyebrow" style={{ color: '#fed7aa' }}>
            Mundo Real & Família
          </div>
          <h1>Missões fora da tela</h1>
          <p>
            Aprender também acontece longe da tela! Realize desafios práticos em casa, com objetos reais,
            brincando e conversando com a família.
          </p>
        </div>
        <div className="hub-stat">
          <strong>{completed.size}</strong>
          <span>missões realizadas 🎉</span>
        </div>
      </section>

      {/* Filter chips */}
      <section className="aprincar-panel" style={{ padding: 16 }}>
        <div className="filter-row">
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-chip ${filter === c.id ? 'active' : ''}`}
              onClick={() => setFilter(c.id)}
            >
              <span>{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </section>

      {/* Mission list */}
      <section>
        <div className="section-head">
          <div>
            <h2>{filteredMissions.length} missões para brincar</h2>
            <p>Não precisa de câmera nem fotos. Basta fazer a brincadeira e comemorar!</p>
          </div>
        </div>
        <div className="missions-grid" style={{ marginTop: 16 }}>
          {filteredMissions.map((m) => (
            <MissionCard
              key={m.id}
              id={m.id}
              title={m.title}
              prompt={m.prompt}
              category={m.category}
              completed={completed.has(m.id)}
              onComplete={() => toggleComplete(m.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
