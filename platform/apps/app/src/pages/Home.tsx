import { Button, Text } from '@mantine/core';
import { Compass, Library, Sparkles } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAppStore } from '../app-store';
import { GameCard } from '../components/GameCard';

const categories = [
  ['🔤', 'Letras', 'letters'],
  ['123', 'Números', 'math'],
  ['🎨', 'Criar', 'creative'],
  ['🧩', 'Lógica', 'logic'],
  ['🎵', 'Sons', 'music'],
] as const;

export function Home() {
  const { profile, registry, libraryIds } = useAppStore();
  const age = profile?.age ?? 5;
  const fitting = registry.filter(
    (e) => age >= (e.ageGuidance?.min ?? 2) - 1 && age <= (e.ageGuidance?.max ?? 10) + 1,
  );
  const featured = (fitting.length ? fitting : registry).slice(0, 6);
  const library = registry.filter((e) => libraryIds.has(e.id)).slice(0, 5);
  return (
    <div className="aprincar-page">
      <section className="child-hero">
        <div className="aprincar-panel child-hero-main">
          <div className="child-eyebrow">Seu espaço de descobertas</div>
          <h1>Olá, {profile?.name}! 👋</h1>
          <p>
            Escolha uma aventura, continue algo que gostou ou descubra um jogo novo. Aqui, aprender acontece
            brincando.
          </p>
          <div className="hero-actions">
            <Button
              component={Link}
              to="/discover"
              className="ap-primary"
              leftSection={<Compass size={18} />}
            >
              Descobrir jogos
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
        <div className="aprincar-panel child-hero-side" aria-hidden="true">
          <div className="hero-world">
            <div className="hero-hill" />
            <div className="hero-house one" />
            <div className="hero-house two" />
            <div className="hero-mascot">
              <span className="hero-smile" />
              <span className="hero-arm" />
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="section-head">
          <div>
            <h2>Destaques para você</h2>
            <p>Jogos que combinam com sua idade e com o que você vem explorando.</p>
          </div>
          <Button component={Link} to="/discover" variant="subtle" color="violet">
            Ver todos
          </Button>
        </div>
        <div className="game-shelf" style={{ marginTop: 14 }}>
          {featured.map((e) => (
            <GameCard key={e.id} entry={e} compact />
          ))}
        </div>
      </section>

      {library.length > 0 && (
        <section>
          <div className="section-head">
            <div>
              <h2>Continue brincando</h2>
              <p>Sua biblioteca fica sempre por perto.</p>
            </div>
            <Button component={Link} to="/library" variant="subtle" color="violet">
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

      <section>
        <div className="section-head">
          <div>
            <h2>Explore do seu jeito</h2>
            <p>Escolha pelo tipo de descoberta que você quer fazer agora.</p>
          </div>
        </div>
        <div className="category-grid" style={{ marginTop: 14 }}>
          {categories.map(([icon, label, tag]) => (
            <Link key={tag} to="/discover" style={{ textDecoration: 'none' }} className="category-card">
              <div>
                <div className="category-icon">{icon}</div>
                <div className="category-label">{label}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section
        className="aprincar-panel"
        style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 14 }}
      >
        <Sparkles color="#6F5BD7" />
        <div>
          <Text fw={850}>Tudo funciona localmente.</Text>
          <Text size="sm" c="dimmed">
            Perfis e progresso ficam neste dispositivo. Jogos preparados para offline continuam disponíveis
            sem Internet.
          </Text>
        </div>
      </section>
    </div>
  );
}
