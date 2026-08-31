import { Button, Text, Group, Badge } from '@mantine/core';
import { ArrowLeft, Play, Sparkles, Star, Trophy } from 'lucide-react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { WORLDS, type WorldInfo } from '../worlds';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';

export function WorldDetail() {
  const { worldId } = useParams({ from: '/world/$worldId' });
  const navigate = useNavigate();
  const { registry } = useAppStore();

  const world: WorldInfo = WORLDS.find((w) => w.id === worldId) ?? WORLDS[0]!;

  // Match games related to this world by skillIds or tags
  const matchingGames = registry.filter((game) => {
    const hasSkill = (game.skills ?? []).some((s) => world.skillIds.includes(s));
    const hasTag = (game.tags ?? []).some(
      (t) => world.id.includes(t) || world.title.toLowerCase().includes(t),
    );
    return hasSkill || hasTag;
  });

  const featuredGame = matchingGames[0] ?? registry[0];
  const otherGames = matchingGames.slice(1);

  return (
    <div className="aprincar-page">
      {/* World header */}
      <section
        className="world-detail-hero"
        style={{ '--world-hero-accent': world.color, backgroundColor: world.accentBg } as React.CSSProperties}
      >
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={18} />}
          onClick={() => navigate({ to: '/' })}
          className="world-back-button"
        >
          Voltar para Início
        </Button>
        <div className="world-detail-header-inner">
          <div className="world-detail-icon">{world.icon}</div>
          <div>
            <div className="child-eyebrow" style={{ color: world.color }}>
              Mundo Aprincar · {world.suggestedAges}
            </div>
            <h1>{world.title}</h1>
            <p className="world-detail-desc">{world.description}</p>
          </div>
        </div>

        {/* Visual learning path trail */}
        <div className="world-trail-panel">
          <div className="world-trail-title">
            <Sparkles size={16} color={world.color} />
            <strong>Seu caminho de descobertas</strong>
          </div>
          <div className="world-trail-nodes">
            {world.trail.map((step, idx) => (
              <div key={step} className="world-trail-node-wrap">
                <div className={`world-trail-node ${idx === 0 ? 'current' : 'upcoming'}`}>
                  {idx === 0 ? <Star size={16} fill="currentColor" /> : idx + 1}
                </div>
                <span className="world-trail-label">{step}</span>
                {idx < world.trail.length - 1 && <div className="world-trail-line" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary recommendation: Comece daqui */}
      {featuredGame && (
        <section className="aprincar-panel world-spotlight-card">
          <div className="section-head">
            <div>
              <div className="child-eyebrow" style={{ color: world.color }}>
                Recomendado para começar
              </div>
              <h2>Comece daqui</h2>
              <p>Uma brincadeira perfeita para dar os primeiros passos neste mundo.</p>
            </div>
          </div>
          <div style={{ marginTop: 16 }}>
            <GameCard entry={featuredGame} />
          </div>
        </section>
      )}

      {/* Other games in this world */}
      <section>
        <div className="section-head">
          <div>
            <h2>Outras brincadeiras deste mundo</h2>
            <p>Mais maneiras de explorar {world.title.toLowerCase()} no seu ritmo.</p>
          </div>
        </div>
        <div className="game-grid" style={{ marginTop: 16 }}>
          {(otherGames.length > 0 ? otherGames : matchingGames).map((game) => (
            <GameCard key={game.id} entry={game} />
          ))}
        </div>
      </section>
    </div>
  );
}
