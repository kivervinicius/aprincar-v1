import { Button, Modal, PasswordInput, Text, TextInput, UnstyledButton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  ChevronRight,
  Compass,
  Globe2,
  HardDrive,
  LockKeyhole,
  Palette,
  Settings,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db } from '@aprincar/storage';
import { useAppStore } from '../app-store';

export function More() {
  const navigate = useNavigate();
  const { profile, profiles } = useAppStore();

  const [gateOpened, { open: openGate, close: closeGate }] = useDisclosure();
  const [pinRequired, setPinRequired] = useState(false);
  const [configuredPin, setConfiguredPin] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [mathAnswer, setMathAnswer] = useState('');
  const [mathProblem, setMathProblem] = useState({ q: '4 + 3', a: 7 });
  const [gateError, setGateError] = useState('');

  useEffect(() => {
    db.settings.get('parentPin').then((r) => {
      if (r?.value) {
        setPinRequired(true);
        setConfiguredPin(String(r.value));
      } else {
        setPinRequired(false);
        // Generate friendly random math question for adult gate
        const n1 = Math.floor(Math.random() * 5) + 3;
        const n2 = Math.floor(Math.random() * 5) + 2;
        setMathProblem({ q: `${n1} + ${n2}`, a: n1 + n2 });
      }
    });
  }, [gateOpened]);

  const handleEnterParent = () => {
    if (pinRequired) {
      if (pinInput.trim() === configuredPin) {
        setGateError('');
        closeGate();
        navigate({ to: '/parent' });
      } else {
        setGateError('PIN incorreto. Tente novamente.');
      }
    } else {
      if (Number(mathAnswer.trim()) === mathProblem.a) {
        setGateError('');
        closeGate();
        navigate({ to: '/parent' });
      } else {
        setGateError('Resposta incorreta. Tente novamente.');
      }
    }
  };

  return (
    <div className="aprincar-page">
      <section className="section-head">
        <div>
          <div className="child-eyebrow">Menu</div>
          <h2 style={{ fontSize: 34 }}>Mais opções</h2>
          <p>Mundos, missões em família, configurações e área do responsável.</p>
        </div>
      </section>

      <div className="more-menu-grid">
        <Link to="/missions" className="more-menu-item">
          <div className="more-menu-icon" style={{ background: '#FFF3D4', color: '#B45309' }}>
            <Sparkles size={22} />
          </div>
          <div className="more-menu-body">
            <strong>Missões fora da tela</strong>
            <span>Brincadeiras no mundo real para fazer em família</span>
          </div>
          <ChevronRight size={18} className="more-menu-arrow" />
        </Link>

        <Link to="/discover" className="more-menu-item">
          <div className="more-menu-icon" style={{ background: '#EBF2FF', color: '#1D4ED8' }}>
            <Compass size={22} />
          </div>
          <div className="more-menu-body">
            <strong>Explorar todas as brincadeiras</strong>
            <span>Catálogo completo de jogos e atividades</span>
          </div>
          <ChevronRight size={18} className="more-menu-arrow" />
        </Link>

        <Link to="/settings" className="more-menu-item">
          <div className="more-menu-icon" style={{ background: '#F3EFFF', color: '#6D28D9' }}>
            <Palette size={22} />
          </div>
          <div className="more-menu-body">
            <strong>Aparência e Temas</strong>
            <span>Personalize as cores e contraste da tela</span>
          </div>
          <ChevronRight size={18} className="more-menu-arrow" />
        </Link>

        {/* Protected Parent Area */}
        <button type="button" className="more-menu-item more-menu-parent-item" onClick={openGate}>
          <div className="more-menu-icon" style={{ background: '#D1FAE5', color: '#047857' }}>
            <ShieldCheck size={22} />
          </div>
          <div className="more-menu-body">
            <strong>Área do Responsável</strong>
            <span>Acompanhamento pedagógico, tempo de tela e controle offline</span>
          </div>
          <LockKeyhole size={18} className="more-menu-arrow" />
        </button>
      </div>

      {/* Adult Gate Modal */}
      <Modal
        opened={gateOpened}
        onClose={closeGate}
        title="Controle dos Pais / Adult Gate"
        centered
        radius="xl"
      >
        <div style={{ padding: '6px 0' }}>
          <Text size="sm" c="dimmed" mb="md">
            {pinRequired
              ? 'Digite o PIN configurado pelo responsável para acessar esta área.'
              : `Para confirmar que você é um adulto, responda: Quanto é ${mathProblem.q}?`}
          </Text>

          {pinRequired ? (
            <PasswordInput
              label="PIN do responsável"
              placeholder="Digite seu PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.currentTarget.value)}
              error={gateError}
              autoFocus
            />
          ) : (
            <TextInput
              label={`Quanto é ${mathProblem.q}?`}
              placeholder="Digite o resultado"
              value={mathAnswer}
              onChange={(e) => setMathAnswer(e.currentTarget.value)}
              error={gateError}
              autoFocus
            />
          )}

          <Button className="ap-primary" fullWidth mt="lg" onClick={handleEnterParent}>
            Entrar na Área do Responsável
          </Button>
        </div>
      </Modal>
    </div>
  );
}
