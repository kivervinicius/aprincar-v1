import { Button, NumberInput, Text, TextInput } from '@mantine/core';
import { ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AprincarMascot, Brand, AvatarPicker, AgePicker, InterestPicker } from '@aprincar/ui';
import { useAppStore } from '../app-store';

export const ONBOARDING_STEPS = ['Perfil', 'Idade', 'Habilidades', 'Interesses', 'Tempo'] as const;

const focusOptions = [
  ['letters', '🔤', 'Letras e Sons'],
  ['math', '123', 'Contagem e Números'],
  ['logic', '🧩', 'Lógica e Padrões'],
  ['motor', '✋', 'Coordenação e Traçado'],
  ['creative', '🎨', 'Criatividade e Cores'],
] as const;

const timeOptions = [15, 30, 45, 0] as const;

function toggle(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

export function Onboarding() {
  const store = useAppStore();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>(5);
  const [avatar, setAvatar] = useState('⭐');
  const [focusSkills, setFocusSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>(['animals']);
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(30);

  const canContinue = useMemo(() => {
    if (step === 0) return name.trim().length > 0;
    if (step === 1) return Number(age) >= 2 && Number(age) <= 14;
    return true;
  }, [step, name, age]);

  async function finish() {
    await store.createProfile({
      name: name.trim() || 'Criança Aprincar',
      age: Number(age),
      avatar,
      focusSkills,
      interests,
      dailyGoalMinutes,
    });
  }

  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <aside className="onboarding-visual" aria-hidden="true">
          <div className="onboarding-brand">
            <Brand compact />
          </div>
          <AprincarMascot size={285} className="onboarding-mascot" />
          <div className="onboarding-visual-copy">
            <strong>Um espaço para descobrir no seu ritmo.</strong>
            <span>Sem ranking, sem anúncios e sem cadastro infantil.</span>
          </div>
        </aside>

        <main className="onboarding-form">
          <div className="onboarding-mobile-brand">
            <Brand compact />
          </div>

          <div className="onboarding-progress" aria-label={`Etapa ${step + 1} de ${ONBOARDING_STEPS.length}`}>
            {ONBOARDING_STEPS.map((label, index) => (
              <div key={label} className={`onboarding-progress-item ${index <= step ? 'active' : ''}`}>
                <span className="onboarding-step">{index < step ? <Check size={12} /> : index + 1}</span>
                <small>{label}</small>
              </div>
            ))}
          </div>

          {/* Step 0: Nome + Avatar */}
          {step === 0 && (
            <section className="onboarding-step-panel">
              <div className="child-eyebrow">Etapa 1 de 5 · Boas-vindas</div>
              <h1>Quem vai brincar?</h1>
              <p>Escolha um nome ou apelido carinhoso e um amigo avatar para acompanhar suas aventuras.</p>
              <TextInput
                label="Nome ou apelido"
                placeholder="Como vamos te chamar? Ex: Sofia, Lucas…"
                value={name}
                onChange={(e) => setName(e.currentTarget.value)}
                size="lg"
                radius="lg"
                autoFocus
                required
              />
              <Text fw={800} mt="lg" mb={8}>
                Escolha um amigo avatar
              </Text>
              <AvatarPicker value={avatar} onChange={setAvatar} />
            </section>
          )}

          {/* Step 1: Idade */}
          {step === 1 && (
            <section className="onboarding-step-panel">
              <div className="child-eyebrow">Etapa 2 de 5</div>
              <h1>Quantos anos?</h1>
              <p>A idade nos ajuda a sugerir brincadeiras confortáveis, sem limitar descobertas.</p>
              <NumberInput
                label="Idade aproximada"
                min={2}
                max={14}
                value={age}
                onChange={setAge}
                size="lg"
                radius="lg"
              />
              <AgePicker value={Number(age)} onChange={setAge} />
            </section>
          )}

          {/* Step 2: Habilidades observadas */}
          {step === 2 && (
            <section className="onboarding-step-panel">
              <div className="child-eyebrow">Etapa 3 de 5</div>
              <h1>O que já gosta de explorar?</h1>
              <p>Não é uma prova. Isso apenas nos ajuda a começar de um lugar confortável para a criança.</p>
              <div className="onboarding-choice-grid">
                {focusOptions.map(([id, icon, label]) => (
                  <button
                    key={id}
                    type="button"
                    className={`onboarding-choice ${focusSkills.includes(id) ? 'selected' : ''}`}
                    onClick={() => setFocusSkills(toggle(focusSkills, id))}
                  >
                    <span>{icon}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>
            </section>
          )}

          {/* Step 3: Interesses */}
          {step === 3 && (
            <section className="onboarding-step-panel">
              <div className="child-eyebrow">Etapa 4 de 5</div>
              <h1>Interesses</h1>
              <p>Quais temas despertam o brilho nos olhos? Isso personaliza as sugestões de jogos.</p>
              <InterestPicker selected={interests} onToggle={(id) => setInterests(toggle(interests, id))} />
            </section>
          )}

          {/* Step 4: Tempo inicial */}
          {step === 4 && (
            <section className="onboarding-step-panel">
              <div className="child-eyebrow">Etapa 5 de 5</div>
              <h1>Tempo para brincar</h1>
              <p>
                Defina uma meta ou limite diário inicial. O responsável pode alterar isso a qualquer momento.
              </p>
              <div className="time-choice-grid">
                {timeOptions.map((minutes) => (
                  <button
                    key={minutes}
                    type="button"
                    className={`time-choice ${dailyGoalMinutes === minutes ? 'selected' : ''}`}
                    onClick={() => setDailyGoalMinutes(minutes)}
                  >
                    <strong>{minutes === 0 ? 'Livre' : `${minutes} min`}</strong>
                    <span>{minutes === 0 ? 'sem limite diário' : 'por dia'}</span>
                  </button>
                ))}
              </div>
              <div className="onboarding-summary" style={{ marginTop: 20 }}>
                <span className="onboarding-summary-avatar">{avatar}</span>
                <div>
                  <strong>{name || 'Novo perfil'}</strong>
                  <span>{age} anos · tudo salvo localmente neste aparelho</span>
                </div>
              </div>
            </section>
          )}

          {/* Action buttons */}
          <div className="onboarding-actions">
            <Button
              variant="subtle"
              color="gray"
              disabled={step === 0}
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              leftSection={<ArrowLeft size={17} />}
            >
              Voltar
            </Button>
            {step < ONBOARDING_STEPS.length - 1 ? (
              <Button
                className="ap-primary"
                disabled={!canContinue}
                onClick={() => setStep((value) => value + 1)}
                rightSection={<ArrowRight size={17} />}
              >
                Continuar
              </Button>
            ) : (
              <Button className="ap-primary" onClick={finish} rightSection={<Sparkles size={17} />}>
                Criar meu espaço ✨
              </Button>
            )}
          </div>
          <Text size="xs" c="dimmed" ta="center" mt="lg">
            Perfis e progresso ficam neste dispositivo. Nenhuma conta na nuvem é exigida.
          </Text>
        </main>
      </div>
    </div>
  );
}
