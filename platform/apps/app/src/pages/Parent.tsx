import {
  Avatar,
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  PasswordInput,
  Progress,
  Select,
  Stack,
  Switch,
  Table,
  Tabs,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { db, sumUsageSecondsForDay } from '@aprincar/storage';
import { useEffect, useState } from 'react';
import type { SkillState } from '@aprincar/extension-contracts';
import { getSkill, SKILLS } from '@aprincar/skill-graph';
import {
  BarChart3,
  BookOpen,
  Clock3,
  Download,
  HardDrive,
  Link2,
  LockKeyhole,
  Palette,
  Plus,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAppStore } from '../app-store';
import { ProgressState, SkillProgress, TrustBadge } from '@aprincar/ui';

export function Parent() {
  const { profile, profiles, selectProfile, createProfile, allowCommunity, setAllowCommunity } =
    useAppStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [states, setStates] = useState<SkillState[]>([]);
  const [sessions, setSessions] = useState<any[]>([]);
  const [dailyLimit, setDailyLimit] = useState<number | string>(0);
  const [usedMinutesToday, setUsedMinutesToday] = useState(0);

  // Security gate / PIN
  const [pinRequired, setPinRequired] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [configuredPin, setConfiguredPin] = useState('');
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathProblem, setMathProblem] = useState({ q: '4 + 5', a: 9 });

  // Add profile modal
  const [addProfileModalOpened, { open: openAddProfileModal, close: closeAddProfileModal }] = useDisclosure();
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState<number | string>(5);
  const [newChildAvatar, setNewChildAvatar] = useState('⭐');

  // PIN settings state
  const [newPin, setNewPin] = useState('');
  const [pinSaved, setPinSaved] = useState(false);

  useEffect(() => {
    db.settings.get('parentPin').then((r) => {
      if (r?.value) {
        setPinRequired(true);
        setConfiguredPin(String(r.value));
        setUnlocked(false);
      } else {
        setPinRequired(false);
        setUnlocked(true);
      }
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
      .then((s) => {
        setSessions(s.reverse());
        setUsedMinutesToday(Math.round(sumUsageSecondsForDay(s, today) / 60));
      });
  }, [profile?.id]);

  const unlockWithPin = async () => {
    if (pinInput.trim() === configuredPin) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('PIN incorreto. Tente novamente.');
    }
  };

  const unlockWithMath = () => {
    if (Number(mathAnswer.trim()) === mathProblem.a) {
      setUnlocked(true);
      setPinError('');
    } else {
      setPinError('Resposta incorreta. Tente novamente.');
    }
  };

  const changeLimit = async (val: number | string) => {
    const n = Math.max(0, Number(val) || 0);
    setDailyLimit(n);
    if (profile) await db.settings.put({ key: `dailyLimit:${profile.id}`, value: n });
  };

  const handleCreateNewProfile = async () => {
    if (!newChildName.trim()) return;
    await createProfile({
      name: newChildName.trim(),
      age: Number(newChildAge),
      avatar: newChildAvatar,
    });
    setNewChildName('');
    closeAddProfileModal();
  };

  if (pinRequired && !unlocked) {
    return (
      <div className="aprincar-page" style={{ alignItems: 'center', paddingTop: 40 }}>
        <div className="parent-card" style={{ maxWidth: 440, width: '100%' }}>
          <div className="aprincar-principle-icon">
            <LockKeyhole size={20} />
          </div>
          <h2>Acesso do responsável</h2>
          <Text c="dimmed" mb="md" size="sm">
            Digite o PIN do responsável para abrir os dados pedagógicos e configurações.
          </Text>
          <PasswordInput
            label="PIN do responsável"
            placeholder="Digite o PIN de 4 dígitos"
            value={pinInput}
            onChange={(e) => setPinInput(e.currentTarget.value)}
            error={pinError}
            autoFocus
          />
          <Button className="ap-primary" fullWidth mt="md" onClick={unlockWithPin}>
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  if (!pinRequired && !unlocked) {
    return (
      <div className="aprincar-page" style={{ alignItems: 'center', paddingTop: 40 }}>
        <div className="parent-card" style={{ maxWidth: 440, width: '100%' }}>
          <div className="aprincar-principle-icon">
            <ShieldCheck size={20} />
          </div>
          <h2>Confirmação do adulto</h2>
          <Text c="dimmed" mb="md" size="sm">
            Para garantir que uma criança não entre por engano no modo adulto, responda:
          </Text>
          <TextInput
            label={`Quanto é ${mathProblem.q}?`}
            placeholder="Digite a resposta"
            value={mathAnswer}
            onChange={(e) => setMathAnswer(e.currentTarget.value)}
            error={pinError}
            autoFocus
          />
          <Button className="ap-primary" fullWidth mt="md" onClick={unlockWithMath}>
            Entrar
          </Button>
        </div>
      </div>
    );
  }

  const consolidatedCount = states.filter((s) => s.state === 'consolidated').length;
  const developingCount = states.filter((s) => s.state === 'developing' || s.state === 'comfortable').length;
  const exploringCount = states.filter((s) => s.state === 'exploring').length;

  return (
    <div className="aprincar-page">
      <section className="section-head">
        <div>
          <div className="child-eyebrow">Modo Responsável</div>
          <h2 style={{ fontSize: 36 }}>Olá, responsável! 👋</h2>
          <p>Acompanhe o desenvolvimento lúdico sem transformar brincadeira em boletim ou ranking.</p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Select
            value={profile?.id}
            onChange={(val) => val && selectProfile(val)}
            data={profiles.map((p) => ({ value: p.id, label: `${p.avatar} ${p.name}` }))}
            radius="xl"
            style={{ width: 170 }}
          />
          <Badge size="lg" color="teal" variant="light">
            Dados locais
          </Badge>
        </div>
      </section>

      <div className="parent-layout">
        {/* Sidebar navigation */}
        <aside className="aprincar-panel parent-sidebar">
          <a
            className={activeTab === 'overview' ? 'active' : ''}
            onClick={() => setActiveTab('overview')}
            style={{ cursor: 'pointer' }}
          >
            <BarChart3 size={18} />
            Visão Geral
          </a>
          <a
            className={activeTab === 'skills' ? 'active' : ''}
            onClick={() => setActiveTab('skills')}
            style={{ cursor: 'pointer' }}
          >
            <BookOpen size={18} />
            Habilidades ({states.length})
          </a>
          <a
            className={activeTab === 'profiles' ? 'active' : ''}
            onClick={() => setActiveTab('profiles')}
            style={{ cursor: 'pointer' }}
          >
            <Users size={18} />
            Perfis ({profiles.length})
          </a>
          <a
            className={activeTab === 'history' ? 'active' : ''}
            onClick={() => setActiveTab('history')}
            style={{ cursor: 'pointer' }}
          >
            <Clock3 size={18} />
            Linha do Tempo
          </a>
          <Link to="/parent/offline" style={{ textDecoration: 'none' }}>
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 14px',
                cursor: 'pointer',
              }}
            >
              <HardDrive size={18} />
              Gerenciador Offline
            </span>
          </Link>
          <a
            className={activeTab === 'settings' ? 'active' : ''}
            onClick={() => setActiveTab('settings')}
            style={{ cursor: 'pointer' }}
          >
            <Settings2 size={18} />
            Configurações & PIN
          </a>
        </aside>

        {/* Content area */}
        <div className="parent-content">
          {/* Tab 1: Overview */}
          {activeTab === 'overview' && (
            <>
              <div className="parent-kpis">
                <div className="parent-card">
                  <Text size="sm" c="dimmed">
                    Perfil Selecionado
                  </Text>
                  <Text fz={26} fw={900}>
                    {profile?.avatar} {profile?.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {profile?.age ?? '—'} anos · foco personalizado
                  </Text>
                </div>

                <div className="parent-card">
                  <Text size="sm" c="dimmed">
                    Tempo Brincando Hoje
                  </Text>
                  <Text fz={32} fw={900}>
                    {usedMinutesToday} min
                  </Text>
                  <Text size="sm" c="dimmed">
                    {Number(dailyLimit) > 0 ? `de ${dailyLimit} min definidos` : 'sem limite diário'}
                  </Text>
                </div>

                <div className="parent-card">
                  <Text size="sm" c="dimmed">
                    Habilidades em Exploração
                  </Text>
                  <Text fz={32} fw={900} c="violet">
                    {states.length}
                  </Text>
                  <Text size="sm" c="dimmed">
                    {consolidatedCount} consolidadas · {developingCount} praticando
                  </Text>
                </div>
              </div>

              {/* Observed skills list preview */}
              <div className="parent-card">
                <div className="section-head" style={{ marginBottom: 12 }}>
                  <div>
                    <h3 style={{ margin: 0 }}>Habilidades Observadas Recentemente</h3>
                    <p>Evidências geradas organicamente através da manipulação e descoberta.</p>
                  </div>
                  <Button variant="subtle" color="violet" onClick={() => setActiveTab('skills')}>
                    Ver todas
                  </Button>
                </div>

                {states.length === 0 ? (
                  <div className="empty-state">
                    Jogue algumas atividades para começar a registrar evidências locais de habilidades.
                  </div>
                ) : (
                  <div>
                    {states.slice(0, 6).map((s) => {
                      const skillDef = getSkill(s.skillId);
                      return (
                        <SkillProgress
                          key={s.skillId}
                          label={skillDef?.label['pt-BR'] ?? s.skillId}
                          state={s.state}
                          evidenceCount={s.evidenceCount}
                          contextCount={s.contextCount}
                          confidence={s.confidence}
                          description={skillDef?.description['pt-BR']}
                          onClick={() =>
                            navigate({ to: '/parent/skills/$skillId', params: { skillId: s.skillId } })
                          }
                        />
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Screen time & Off-screen suggestions */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: 14,
                }}
              >
                <div className="parent-card">
                  <h3>Tempo de tela & Limites</h3>
                  <Text size="sm" c="dimmed" mb="md">
                    Defina um limite diário de uso para {profile?.name ?? 'a criança'} neste aparelho.
                  </Text>
                  <NumberInput
                    label="Limite diário (minutos)"
                    description="0 = sem limite de tempo"
                    min={0}
                    max={300}
                    step={15}
                    value={dailyLimit}
                    onChange={changeLimit}
                  />
                </div>

                <div className="parent-card" style={{ background: 'var(--ap-purple-soft)' }}>
                  <h3>Missões em Família</h3>
                  <Text size="sm">
                    Incentive atividades fora da tela para conectar o aprendizado digital com objetos e
                    situações do mundo real.
                  </Text>
                  <Button component={Link} to="/missions" className="ap-primary" size="sm" mt="md">
                    Explorar Missões Fora da Tela ✨
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Tab 2: Skills Graph */}
          {activeTab === 'skills' && (
            <div className="parent-card">
              <div className="section-head" style={{ marginBottom: 14 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Mapa de Habilidades Pedagógicas</h3>
                  <p>Acompanhamento por áreas do desenvolvimento infantil.</p>
                </div>
              </div>

              {SKILLS.map((sk) => {
                const st = states.find((s) => s.skillId === sk.id);
                return (
                  <SkillProgress
                    key={sk.id}
                    label={sk.label['pt-BR'] ?? sk.id}
                    state={st?.state ?? 'unknown'}
                    evidenceCount={st?.evidenceCount ?? 0}
                    contextCount={st?.contextCount ?? 0}
                    confidence={st?.confidence ?? 0}
                    description={sk.description['pt-BR']}
                    onClick={() => navigate({ to: '/parent/skills/$skillId', params: { skillId: sk.id } })}
                  />
                );
              })}
            </div>
          )}

          {/* Tab 3: Profiles */}
          {activeTab === 'profiles' && (
            <div className="parent-card">
              <div className="section-head" style={{ marginBottom: 16 }}>
                <div>
                  <h3 style={{ margin: 0 }}>Perfis Infantis Cadastrados</h3>
                  <p>Cada perfil mantém seu próprio progresso, biblioteca e tempo de tela.</p>
                </div>
                <Button className="ap-primary" leftSection={<Plus size={16} />} onClick={openAddProfileModal}>
                  Novo Perfil
                </Button>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: 12,
                }}
              >
                {profiles.map((p) => (
                  <div
                    key={p.id}
                    className={`profile-manage-card ${p.id === profile?.id ? 'active' : ''}`}
                    onClick={() => selectProfile(p.id)}
                    style={{
                      padding: 16,
                      borderRadius: 18,
                      border:
                        p.id === profile?.id ? '2px solid var(--ap-primary)' : '1px solid var(--ap-border)',
                      background: p.id === profile?.id ? 'var(--ap-primary-soft)' : 'var(--ap-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    <Group gap="md">
                      <div style={{ fontSize: 32 }}>{p.avatar}</div>
                      <div>
                        <strong>{p.name}</strong>
                        <Text size="xs" c="dimmed">
                          {p.age} anos · {p.id === profile?.id ? 'Ativo agora' : 'Toque para selecionar'}
                        </Text>
                      </div>
                    </Group>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: History / Timeline */}
          {activeTab === 'history' && (
            <div className="parent-card">
              <h3 style={{ marginBottom: 14 }}>Linha do Tempo de Brincadeiras</h3>
              {sessions.length === 0 ? (
                <div className="empty-state">Nenhuma sessão registrada recentemente.</div>
              ) : (
                <Table verticalSpacing="sm">
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Jogo / Brincadeira</Table.Th>
                      <Table.Th>Início</Table.Th>
                      <Table.Th>Duração</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {sessions.slice(0, 15).map((s) => (
                      <Table.Tr key={s.id}>
                        <Table.Td>
                          <strong>{s.extensionId}</strong>
                        </Table.Td>
                        <Table.Td>{new Date(s.startedAt).toLocaleString('pt-BR')}</Table.Td>
                        <Table.Td>
                          {s.endedAt
                            ? `${Math.round((new Date(s.endedAt).getTime() - new Date(s.startedAt).getTime()) / 1000)}s`
                            : 'Em andamento'}
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </div>
          )}

          {/* Tab 5: Settings & PIN */}
          {activeTab === 'settings' && (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 14,
              }}
            >
              <div className="parent-card">
                <h3>PIN de Segurança do Adulto</h3>
                <Text size="sm" c="dimmed" mb="md">
                  Proteja a área do responsável contra acessos acidentais.
                </Text>
                <PasswordInput
                  placeholder="Definir PIN (ex: 1234)"
                  value={newPin}
                  onChange={(e) => setNewPin(e.currentTarget.value)}
                  maxLength={8}
                />
                <Group mt="md">
                  <Button
                    className="ap-primary"
                    onClick={async () => {
                      if (newPin.trim()) {
                        await db.settings.put({ key: 'parentPin', value: newPin.trim() });
                        setConfiguredPin(newPin.trim());
                        setPinRequired(true);
                        setPinSaved(true);
                        setTimeout(() => setPinSaved(false), 2000);
                      }
                    }}
                  >
                    {pinSaved ? 'Salvo!' : 'Salvar PIN'}
                  </Button>
                  {pinRequired && (
                    <Button
                      variant="subtle"
                      color="red"
                      onClick={async () => {
                        await db.settings.delete('parentPin');
                        setPinRequired(false);
                        setConfiguredPin('');
                        setNewPin('');
                      }}
                    >
                      Remover PIN
                    </Button>
                  )}
                </Group>
              </div>

              <div className="parent-card">
                <h3>Extensões da Comunidade</h3>
                <Switch
                  checked={allowCommunity}
                  onChange={(e) => setAllowCommunity(e.currentTarget.checked)}
                  label="Permitir jogos da Comunidade"
                  description="Oficial e Curado aparecem por padrão."
                  mt="md"
                />
              </div>

              <div className="parent-card">
                <h3>Backup e Exportação</h3>
                <Text size="sm" c="dimmed" mb="md">
                  Exporte todo o histórico de perfis e progresso para um arquivo JSON seguro.
                </Text>
                <Button
                  className="ap-secondary"
                  leftSection={<Download size={16} />}
                  onClick={async () => {
                    const data = {
                      profiles: await db.profiles.toArray(),
                      library: await db.library.toArray(),
                      evidence: await db.evidence.toArray(),
                      skillStates: await db.skillStates.toArray(),
                      sessions: await db.sessions.toArray(),
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const a = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    a.href = url;
                    a.download = `aprincar-backup-${new Date().toISOString().slice(0, 10)}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Exportar Dados do Aprincar
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add profile modal */}
      <Modal
        opened={addProfileModalOpened}
        onClose={closeAddProfileModal}
        title="Cadastrar Nova Criança"
        centered
        radius="xl"
      >
        <Stack>
          <TextInput
            label="Nome ou apelido"
            placeholder="Ex: Pedro, Alice…"
            value={newChildName}
            onChange={(e) => setNewChildName(e.currentTarget.value)}
            required
            autoFocus
          />
          <NumberInput label="Idade" min={2} max={14} value={newChildAge} onChange={setNewChildAge} />
          <Button
            className="ap-primary"
            fullWidth
            onClick={handleCreateNewProfile}
            disabled={!newChildName.trim()}
          >
            Salvar Perfil
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}
