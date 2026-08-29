import { Button, Group, PasswordInput, Select, Stack, Switch, Text } from '@mantine/core';
import { db } from '@aprincar/storage';
import { useEffect, useState } from 'react';
import { Download, LockKeyhole, Palette, ShieldCheck } from 'lucide-react';
import { useAppStore } from '../app-store';

export function Settings() {
  const { allowCommunity, setAllowCommunity } = useAppStore();
  const [theme, setTheme] = useState('standard');
  const [pin, setPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);
  useEffect(() => {
    db.settings.get('theme').then((r) => {
      const t = String(r?.value ?? 'standard');
      setTheme(t);
      document.documentElement.dataset.aprincarTheme = t;
    });
    db.settings.get('parentPin').then((r) => {
      if (r?.value) setPin(String(r.value));
    });
  }, []);
  async function changeTheme(value: string | null) {
    const t = value ?? 'standard';
    setTheme(t);
    document.documentElement.dataset.aprincarTheme = t;
    await db.settings.put({ key: 'theme', value: t });
  }
  return (
    <div className="aprincar-page">
      <section className="section-head">
        <div>
          <div className="child-eyebrow">Preferências</div>
          <h2 style={{ fontSize: 38 }}>Configurações</h2>
          <p>Personalize o Aprincar e mantenha os controles do responsável no mesmo lugar.</p>
        </div>
      </section>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 15 }}>
        <section className="parent-card">
          <div className="aprincar-principle-icon">
            <Palette size={20} />
          </div>
          <h3>Tema e aparência</h3>
          <Select
            label="Tema"
            value={theme}
            onChange={changeTheme}
            data={[
              { value: 'standard', label: 'Padrão' },
              { value: 'pastel', label: 'Pastel' },
              { value: 'contrast', label: 'Alto contraste' },
              { value: 'night', label: 'Noturno' },
            ]}
          />
          <Text size="sm" c="dimmed" mt="sm">
            O tema vale para a plataforma. Jogos mantêm sua própria cena respeitando acessibilidade e
            contraste.
          </Text>
        </section>
        <section className="parent-card">
          <div className="aprincar-principle-icon">
            <ShieldCheck size={20} />
          </div>
          <h3>Jogos da comunidade</h3>
          <Switch
            checked={allowCommunity}
            onChange={(e) => setAllowCommunity(e.currentTarget.checked)}
            label="Mostrar jogos Community no modo infantil"
            description="Oficial e Curado aparecem por padrão."
          />
        </section>
        <section className="parent-card">
          <div className="aprincar-principle-icon">
            <LockKeyhole size={20} />
          </div>
          <h3>PIN do responsável</h3>
          <Stack gap="xs">
            <PasswordInput
              placeholder="Definir PIN (ex: 1234)"
              value={pin}
              onChange={(e) => setPin(e.currentTarget.value)}
              maxLength={8}
            />
            <Group>
              <Button
                className="ap-secondary"
                onClick={async () => {
                  await db.settings.put({ key: 'parentPin', value: pin.trim() });
                  setPinSaved(true);
                  setTimeout(() => setPinSaved(false), 2000);
                }}
              >
                {pinSaved ? 'Salvo!' : 'Salvar PIN'}
              </Button>
              {pin && (
                <Button
                  variant="subtle"
                  color="red"
                  onClick={async () => {
                    await db.settings.delete('parentPin');
                    setPin('');
                  }}
                >
                  Remover
                </Button>
              )}
            </Group>
          </Stack>
        </section>
        <section className="parent-card">
          <div className="aprincar-principle-icon">
            <Download size={20} />
          </div>
          <h3>Dados locais</h3>
          <Text size="sm" c="dimmed" mb="md">
            Exporte perfis, biblioteca e progresso para backup.
          </Text>
          <Button
            className="ap-secondary"
            onClick={async () => {
              const data = {
                profiles: await db.profiles.toArray(),
                library: await db.library.toArray(),
                evidence: await db.evidence.toArray(),
                skillStates: await db.skillStates.toArray(),
                rewards: await db.rewards.toArray(),
                gameState: await db.gameState.toArray(),
              };
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = 'aprincar-backup.json';
              a.click();
              URL.revokeObjectURL(a.href);
            }}
          >
            Exportar dados
          </Button>
        </section>
      </div>
    </div>
  );
}
