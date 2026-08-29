import { Badge, Button, NumberInput, PasswordInput, Progress, Text } from '@mantine/core';
import { db, sumUsageSecondsForDay } from '@aprincar/storage';
import { useEffect, useState } from 'react';
import type { SkillState } from '@aprincar/extension-contracts';
import { getSkill } from '@aprincar/skill-graph';
import { BarChart3, BookOpen, Clock3, Link2, LockKeyhole, Settings2, Users } from 'lucide-react';
import { useAppStore } from '../app-store';

const labels = {
  unknown: 'Não observado',
  exploring: 'Explorando',
  developing: 'Desenvolvendo',
  comfortable: 'Confortável',
  consolidated: 'Consolidado',
} as const;

export function Parent() {
  const { profile, profiles } = useAppStore();
  const [states, setStates] = useState<SkillState[]>([]);
  const [dailyLimit, setDailyLimit] = useState<number | string>(0);
  const [usedMinutesToday, setUsedMinutesToday] = useState(0);
  const [pinRequired, setPinRequired] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  useEffect(() => {
    db.settings.get('parentPin').then((r) => {
      if (r?.value) setPinRequired(true);
      else setUnlocked(true);
    });
  }, []);
  useEffect(() => {
    if (!profile) return;
    db.skillStates.where('profileId').equals(profile.id).toArray().then(setStates);
    db.settings.get(`dailyLimit:${profile.id}`).then((r) => setDailyLimit(Number(r?.value ?? 0)));
    const today = new Date().toISOString().slice(0, 10);
    db.sessions
      .where('profileId')
      .equals(profile.id)
      .toArray()
      .then((s) => setUsedMinutesToday(Math.round(sumUsageSecondsForDay(s, today) / 60)));
  }, [profile?.id]);
  const unlock = async () => {
    const p = await db.settings.get('parentPin');
    if (String(p?.value) === pinInput) {
      setUnlocked(true);
      setPinError('');
    } else setPinError('PIN incorreto. Tente novamente.');
  };
  const changeLimit = async (val: number | string) => {
    const n = Math.max(0, Number(val) || 0);
    setDailyLimit(n);
    if (profile) await db.settings.put({ key: `dailyLimit:${profile.id}`, value: n });
  };
  if (pinRequired && !unlocked)
    return (
      <div className="aprincar-page" style={{ alignItems: 'center', paddingTop: 60 }}>
        <div className="parent-card" style={{ maxWidth: 420, width: '100%' }}>
          <div className="aprincar-principle-icon">
            <LockKeyhole size={20} />
          </div>
          <h2>Acesso do responsável</h2>
          <Text c="dimmed" mb="md">
            Digite o PIN configurado para abrir esta área.
          </Text>
          <PasswordInput
            label="PIN do responsável"
            value={pinInput}
            onChange={(e) => setPinInput(e.currentTarget.value)}
            error={pinError}
          />
          <Button className="ap-primary" fullWidth mt="md" onClick={unlock}>
            Entrar
          </Button>
        </div>
      </div>
    );
  const visible = states.slice(0, 8);
  const average = visible.length
    ? Math.round((visible.reduce((s, x) => s + x.confidence, 0) / visible.length) * 100)
    : 0;
  return (
    <div className="aprincar-page">
      <section className="section-head">
        <div>
          <div className="child-eyebrow">Modo responsável</div>
          <h2 style={{ fontSize: 38 }}>Olá, responsável! 👋</h2>
          <p>Acompanhe o desenvolvimento sem transformar brincadeira em ranking.</p>
        </div>
        <Badge size="lg" color="teal" variant="light">
          Dados locais
        </Badge>
      </section>
      <div className="parent-layout">
        <aside className="aprincar-panel parent-sidebar">
          <a className="active">
            <BarChart3 size={18} />
            Visão geral
          </a>
          <a>
            <Users size={18} />
            Perfis ({profiles.length})
          </a>
          <a>
            <BookOpen size={18} />
            Atividades
          </a>
          <a>
            <Clock3 size={18} />
            Tempo de uso
          </a>
          <a>
            <Link2 size={18} />
            Aprincar Connect <Badge size="xs">futuro</Badge>
          </a>
          <a>
            <Settings2 size={18} />
            Preferências
          </a>
        </aside>
        <div className="parent-content">
          <div className="parent-kpis">
            <div className="parent-card">
              <Text size="sm" c="dimmed">
                Perfil selecionado
              </Text>
              <Text fz={26} fw={900}>
                {profile?.avatar} {profile?.name}
              </Text>
              <Text size="sm" c="dimmed">
                {profile?.age ?? '—'} anos
              </Text>
            </div>
            <div className="parent-card">
              <Text size="sm" c="dimmed">
                Tempo hoje
              </Text>
              <Text fz={30} fw={900}>
                {usedMinutesToday} min
              </Text>
              <Text size="sm" c="dimmed">
                {Number(dailyLimit) > 0 ? `de ${dailyLimit} min definidos` : 'sem limite diário'}
              </Text>
            </div>
            <div className="parent-card">
              <Text size="sm" c="dimmed">
                Confiança média observada
              </Text>
              <Text fz={30} fw={900}>
                {average}%
              </Text>
              <Text size="sm" c="dimmed">
                não é nota escolar
              </Text>
            </div>
          </div>
          <div className="parent-card">
            <div className="section-head">
              <div>
                <h2 style={{ fontSize: 24 }}>Habilidades observadas</h2>
                <p>Evidências reunidas em jogos e contextos diferentes.</p>
              </div>
            </div>
            {visible.length === 0 ? (
              <div className="empty-state" style={{ marginTop: 14 }}>
                Jogue algumas atividades para começar a reunir evidências.
              </div>
            ) : (
              <div style={{ marginTop: 10 }}>
                {visible.map((s) => (
                  <div className="skill-row" key={s.skillId}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                      <Text fw={800}>{getSkill(s.skillId)?.label['pt-BR'] ?? s.skillId}</Text>
                      <Text size="sm" c="dimmed">
                        {labels[s.state]}
                      </Text>
                    </div>
                    <Progress value={s.confidence * 100} color="violet" radius="xl" mt={7} />
                    <Text size="xs" c="dimmed" mt={5}>
                      {s.evidenceCount} evidências · {s.contextCount} contextos
                    </Text>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 14 }}
          >
            <div className="parent-card">
              <h3>Tempo de tela</h3>
              <Text size="sm" c="dimmed" mb="md">
                Defina um limite diário para {profile?.name ?? 'a criança'} neste dispositivo.
              </Text>
              <NumberInput
                label="Limite diário (minutos)"
                description="0 = sem limite"
                min={0}
                max={300}
                step={15}
                value={dailyLimit}
                onChange={changeLimit}
              />
            </div>
            <div className="parent-card" style={{ background: 'var(--ap-purple-soft)' }}>
              <h3>Aprincar Connect</h3>
              <Text size="sm">
                Login, sincronização entre dispositivos e vínculos com escolas serão uma camada opcional. O
                Aprincar continuará funcional localmente.
              </Text>
              <Badge mt="lg" variant="light">
                Planejado
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
