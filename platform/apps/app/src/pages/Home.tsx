import { Button, Text } from '@mantine/core';
import { ArrowRight, Compass, Library, Sparkles, Star } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { AprincarMascot, MissionCard, WorldCard } from '@aprincar/ui';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';
import { WORLDS, MISSIONS, type MissionItem } from '../worlds';
import { useState } from 'react';

export function Home() {
  const { profile, registry, libraryIds, recommendation, completedMissionIds, completeMission } =
    useAppStore();
  const navigate = useNavigate();
  const age = profile?.age ?? 5;

  const [missionIndex, setMissionIndex] = useState(0);

  const currentMission: MissionItem = MISSIONS[missionIndex % MISSIONS.length] ?? MISSIONS[0]!;
  const isCurrentMissionDone = completedMissionIds.has(currentMission.id);

  const handleCompleteMission = () => {
    completeMission(currentMission.id, currentMission.worldId, currentMission.skills ?? []);
  };

  const handleNextMission = () => {
    setMissionIndex((prev) => prev + 1);
  };

  const topRecommended = recommendation.recommended;
  const primaryGameLink = topRecommended ? `/play/${topRecommended.id}` : '/discover';
  const primaryGameName = topRecommended ? topRecommended.name['pt-BR'] : 'Começar a brincar';

  // Find games fitting age and child preferences
  const fitting = registry.filter(
    (e) => age >= (e.ageGuidance?.min ?? 2) - 1 && age <= (e.ageGuidance?.max ?? 10) + 1,
  );
  const featured = (fitting.length ? fitting : registry).slice(0, 6);
  const library = registry
    .filter((e) => libraryIds.has(e.id) && !featured.some((f) => f.id === e.id))
    .slice(0, 5);

  return (
    <div className="aprincar-page">
      {/* Hero child section */}
      <section className="child-hero aprincar-panel">
        <div className="child-hero-main">
          <div className="child-eyebrow">Seu espaço de descobertas</div>
          <h1>
            Oi, {profile?.name}! <span aria-hidden="true">👋</span>
          </h1>
          <p className="hero-question">O que vamos descobrir hoje?</p>
          <p className="hero-description">
            {recommendation.reason ? `${recommendation.reason}. ` : ''}
            Escolha uma aventura, continue algo que gostou ou experimente um jogo novo. Aqui, aprender
            acontece brincando.
          </p>
          <div className="hero-actions">
            <Button
              component={Link}
              to={primaryGameLink}
              className="ap-primary hero-cta"
              rightSection={<ArrowRight size={18} />}
            >
              {topRecommended ? `Brincar: ${primaryGameName}` : 'Começar a brincar'}
            </Button>
            <Button
              component={Link}
              to="/library"
              className="ap-secondary"
              leftSection={<Library size={18} />}
            >
              Minha biblioteca
            </Button>
          </div>
        </div>
        <div className="child-hero-side" aria-hidden="true">
          <div className="hero-spark hero-spark-one">★</div>
          <div className="hero-spark hero-spark-two">●</div>
          <div className="hero-spark hero-spark-three">▲</div>
          <AprincarMascot size={250} className="hero-star-mascot" />
        </div>
      </section>

      {/* Featured shelf */}
      <section>
        <div className="section-head">
          <div>
            <h2>Destaques para você</h2>
            <p>Brincadeiras que combinam com sua idade e seu momento.</p>
          </div>
          <Button component={Link} to="/discover" variant="subtle" color="blue" className="section-more">
            Ver todos
          </Button>
        </div>
        <div className="game-shelf" style={{ marginTop: 14 }}>
          {featured.map((e) => (
            <GameCard key={e.id} entry={e} compact />
          ))}
        </div>
      </section>

      {/* Continue exploring library */}
      {library.length > 0 && (
        <section>
          <div className="section-head">
            <div>
              <h2>Continue brincando</h2>
              <p>Sua coleção de favoritos por perto.</p>
            </div>
            <Button component={Link} to="/library" variant="subtle" color="blue" className="section-more">
              Abrir biblioteca
            </Button>
          </div>
          <div className="game-shelf" style={{ marginTop: 14 }}>
            {library.map((e) => (
              <GameCard key={e.id} entry={e} compact />
            ))}
          </div>
        </section>
      )}

      {/* 9 Educational Worlds */}
      <section>
        <div className="section-head">
          <div>
            <h2>Mundos de Descoberta</h2>
            <p>Explore por áreas do conhecimento com caminhos lúdicos.</p>
          </div>
        </div>
        <div className="worlds-grid" style={{ marginTop: 16 }}>
          {WORLDS.map((w) => (
            <WorldCard
              key={w.id}
              id={w.id}
              title={w.title}
              icon={w.icon}
              color={w.color}
              description={w.childSummary}
              onClick={() => navigate({ to: '/world/$worldId', params: { worldId: w.id } })}
            />
          ))}
        </div>
      </section>

      {/* Off-screen mission */}
      <section>
        <div className="section-head">
          <div>
            <h2>Missão fora da tela</h2>
            <p>Brincadeiras e desafios para fazer no mundo real com a família.</p>
          </div>
          <Button component={Link} to="/missions" variant="subtle" color="blue" className="section-more">
            Ver todas as missões
          </Button>
        </div>
        <div style={{ marginTop: 14 }}>
          <MissionCard
            id={currentMission.id}
            title={currentMission.title}
            prompt={currentMission.prompt}
            category={currentMission.category}
            completed={isCurrentMissionDone}
            onComplete={handleCompleteMission}
            onNext={handleNextMission}
          />
        </div>
      </section>

      {/* Local-first banner */}
      <section className="aprincar-panel local-first-card">
        <Sparkles className="local-first-icon" />
        <div>
          <Text fw={850}>Seu espaço continua seu, mesmo sem internet.</Text>
          <Text size="sm" c="dimmed">
            Perfis e progresso ficam salvos com segurança neste dispositivo.
          </Text>
        </div>
        <Button
          component={Link}
          to="/discover"
          variant="subtle"
          color="blue"
          leftSection={<Compass size={17} />}
        >
          Explorar
        </Button>
      </section>
    </div>
  );
}
