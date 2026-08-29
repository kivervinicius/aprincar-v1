import { Button, NumberInput, Stack, Text, TextInput } from '@mantine/core';
import { useState } from 'react';
import { Brand } from '@aprincar/ui';
import { useAppStore } from '../app-store';

export function Onboarding() {
  const store = useAppStore();
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | string>(5);
  return (
    <div className="onboarding-shell">
      <div className="onboarding-card">
        <div className="onboarding-visual">
          <div className="hero-world" style={{ minHeight: 400, width: '100%' }}>
            <div className="hero-hill" />
            <div className="hero-house one" />
            <div className="hero-house two" />
            <div className="hero-mascot" style={{ width: 145, height: 160, bottom: 85 }}>
              <span className="hero-smile" />
              <span className="hero-arm" />
            </div>
          </div>
        </div>
        <div className="onboarding-form">
          <Brand />
          <div className="onboarding-steps">
            <span className="onboarding-step active" />
            <span className="onboarding-step" />
            <span className="onboarding-step" />
          </div>
          <div className="child-eyebrow">Novo perfil</div>
          <h1>Vamos começar a aprincar?</h1>
          <p>Poucas perguntas, sem cadastro. A idade orienta sugestões, mas nunca bloqueia uma descoberta.</p>
          <Stack mt="xl" gap="md">
            <TextInput
              label="Nome ou apelido"
              placeholder="Como podemos chamar a criança?"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              size="md"
              radius="lg"
            />
            <NumberInput
              label="Idade aproximada"
              min={2}
              max={14}
              value={age}
              onChange={setAge}
              size="md"
              radius="lg"
            />
            <Button
              size="lg"
              className="ap-primary"
              disabled={!name.trim()}
              onClick={() => store.createProfile(name, Number(age))}
            >
              Criar meu espaço
            </Button>
            <Text size="xs" c="dimmed" ta="center">
              Perfis e progresso ficam neste dispositivo. Uma conta será opcional no futuro.
            </Text>
          </Stack>
        </div>
      </div>
    </div>
  );
}
