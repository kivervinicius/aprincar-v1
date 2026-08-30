import { Badge, Button, Group, Progress, Stack, Text } from '@mantine/core';
import { ArrowLeft, BookOpen, CheckCircle, Clock, Sparkles, Star } from 'lucide-react';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db } from '@aprincar/storage';
import type { SkillState } from '@aprincar/extension-contracts';
import { getSkill } from '@aprincar/skill-graph';
import { ProgressState, SkillEvidenceList } from '@aprincar/ui';
import { useAppStore } from '../app-store';

export function ParentSkillDetail() {
  const { skillId } = useParams({ from: '/parent/skills/$skillId' });
  const navigate = useNavigate();
  const { profile, registry } = useAppStore();

  const [state, setState] = useState<SkillState | null>(null);
  const [evidences, setEvidences] = useState<any[]>([]);

  const skill = getSkill(skillId);

  useEffect(() => {
    if (!profile || !skillId) return;

    db.skillStates
      .where('[profileId+skillId]')
      .equals([profile.id, skillId])
      .first()
      .then((s) => setState(s ?? null));

    db.evidence
      .where('profileId')
      .equals(profile.id)
      .filter((e) => e.skillId === skillId)
      .toArray()
      .then((evList) => {
        const mapped = evList.map((ev) => {
          const game = registry.find((g) => g.id === ev.gameId);
          return {
            id: ev.id,
            gameTitle: game?.name?.['pt-BR'] ?? ev.gameId,
            date: new Date(ev.occurredAt).toLocaleDateString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            result: ev.result,
            independent: ev.independent,
          };
        });
        setEvidences(mapped);
      });
  }, [profile?.id, skillId, registry]);

  const skillTitle = skill?.label['pt-BR'] ?? skillId;
  const skillDesc = skill?.description['pt-BR'] ?? 'Habilidade de desenvolvimento na infância.';
  const currentState = state?.state ?? 'unknown';
  const confidence = state?.confidence ?? 0;

  // Offscreen recommendations mapped by domain
  const offscreenSuggestions: Record<string, string> = {
    'perception.colors.match': 'Separe meias ou copos coloridos juntos durante a arrumação.',
    'perception.shapes.match': 'Procure objetos circulares e quadrados ao redor da sala.',
    'math.counting.1-10': 'Peça para contar 5 brinquedos e depois adicionar mais 2.',
    'literacy.letter.recognition': 'Procure as letras do nome da criança em placas ou embalagens.',
    'writing.trace-letter': 'Faça traçados na areia, farinha ou no papel com giz de cera.',
    'logic.patterns.ab': 'Monte uma sequência de garfo, colher, garfo, colher na mesa.',
    'creativity.visual-expression': 'Desenhe livremente no papel com tintas guache ou lápis de cor.',
  };

  const suggestion =
    offscreenSuggestions[skillId] ?? 'Explore atividades práticas e conversas em família no dia a dia.';

  return (
    <div className="aprincar-page">
      <section className="section-head">
        <div>
          <Button
            variant="subtle"
            color="gray"
            leftSection={<ArrowLeft size={16} />}
            onClick={() => navigate({ to: '/parent' })}
            mb="xs"
          >
            Voltar para Visão Geral do Responsável
          </Button>
          <div className="child-eyebrow">Detalhe pedagógico da habilidade</div>
          <h2 style={{ fontSize: 32 }}>{skillTitle}</h2>
          <p>{skillDesc}</p>
        </div>
        <ProgressState state={currentState} />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <div className="parent-card">
          <h3>Estado de Domínio</h3>
          <Text size="sm" c="dimmed">
            O Aprincar avalia consistência em múltiplos contextos, sem notas escolares ou punições.
          </Text>
          <div style={{ marginTop: 16 }}>
            <Progress value={confidence * 100} color="violet" radius="xl" size="lg" />
            <Group justify="space-between" mt="xs">
              <Text size="xs" c="dimmed">
                Confiança pedagógica: {Math.round(confidence * 100)}%
              </Text>
              <Text size="xs" c="dimmed">
                {state?.contextCount ?? 0} contextos observados
              </Text>
            </Group>
          </div>
        </div>

        <div className="parent-card" style={{ background: 'var(--ap-purple-soft)' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Sparkles size={20} color="var(--ap-purple)" />
            <h3 style={{ margin: 0 }}>Sugestão fora da tela</h3>
          </div>
          <Text size="md" mt="sm" fw={600}>
            {suggestion}
          </Text>
          <Text size="xs" c="dimmed" mt="xs">
            Conectar a habilidade digital ao mundo real reforça a aprendizagem natural.
          </Text>
        </div>
      </div>

      <div className="parent-card">
        <h3>Histórico de evidências registradas ({evidences.length})</h3>
        <Text size="sm" c="dimmed" mb="md">
          Cada rodada concluída com sucesso ou autonomia gera uma evidência pedagógica local.
        </Text>

        {evidences.length === 0 ? (
          <div className="empty-state">
            Ainda não há evidências registradas para esta habilidade. Continue brincando com atividades
            relacionadas!
          </div>
        ) : (
          <SkillEvidenceList evidences={evidences} />
        )}
      </div>
    </div>
  );
}
