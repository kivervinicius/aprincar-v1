import {
  Avatar,
  Button,
  Group,
  Menu,
  Modal,
  NumberInput,
  Stack,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Home, Compass, Library, Users, Settings, UserPlus, Check, Wifi, WifiOff } from 'lucide-react';
import { Link, Outlet, useRouterState } from '@tanstack/react-router';
import { Brand } from '@aprincar/ui';
import { useState } from 'react';
import { useAppStore } from './app-store';

const items = [
  ['/', 'Início', Home],
  ['/discover', 'Descobrir', Compass],
  ['/library', 'Biblioteca', Library],
  ['/parent', 'Responsável', Users],
  ['/settings', 'Configurações', Settings],
] as const;

export function RootLayout() {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure();
  const [newName, setNewName] = useState('');
  const [newAge, setNewAge] = useState<number | string>(5);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { profile, profiles, selectProfile, createProfile } = useAppStore();
  const online = typeof navigator === 'undefined' ? true : navigator.onLine;
  const handleCreateProfile = async () => {
    if (!newName.trim()) return;
    await createProfile(newName, Number(newAge));
    setNewName('');
    closeModal();
  };
  return (
    <div className="app-bg">
      <header className="aprincar-topbar">
        <div className="aprincar-topbar-inner">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Brand compact />
          </Link>
          <nav className="aprincar-nav" aria-label="Navegação principal">
            {items.map(([to, label, Icon]) => (
              <Link key={to} to={to} className={`aprincar-nav-link ${path === to ? 'active' : ''}`}>
                <Icon size={17} />
                <span>{label}</span>
              </Link>
            ))}
          </nav>
          <Menu shadow="md" width={235} position="bottom-end" radius="lg">
            <Menu.Target>
              <UnstyledButton aria-label="Menu de perfis" className="profile-button">
                <div className="profile-avatar">{profile?.avatar ?? '🦕'}</div>
                <div>
                  <Text size="sm" fw={800} lh={1.1}>
                    {profile?.name ?? 'Perfil'}
                  </Text>
                  <Text size="xs" c="dimmed" mt={3}>
                    {online ? (
                      <>
                        <Wifi size={11} style={{ verticalAlign: -1 }} /> Online
                      </>
                    ) : (
                      <>
                        <WifiOff size={11} style={{ verticalAlign: -1 }} /> Offline
                      </>
                    )}
                  </Text>
                </div>
              </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Perfis infantis</Menu.Label>
              {profiles.map((p) => (
                <Menu.Item
                  key={p.id}
                  onClick={() => selectProfile(p.id)}
                  leftSection={
                    <Avatar size="sm" color="violet">
                      {p.avatar}
                    </Avatar>
                  }
                  rightSection={p.id === profile?.id ? <Check size={14} /> : null}
                >
                  {p.name}
                </Menu.Item>
              ))}
              <Menu.Divider />
              <Menu.Item leftSection={<UserPlus size={14} />} onClick={openModal}>
                Adicionar perfil
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </header>
      <main className="aprincar-shell">
        <Outlet />
      </main>
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Criar novo perfil infantil"
        centered
        radius="xl"
      >
        <Stack>
          <TextInput
            label="Nome ou apelido"
            placeholder="Ex: Lucas"
            value={newName}
            onChange={(e) => setNewName(e.currentTarget.value)}
            required
          />
          <NumberInput label="Idade aproximada" min={2} max={14} value={newAge} onChange={setNewAge} />
          <Button className="ap-primary" fullWidth onClick={handleCreateProfile} disabled={!newName.trim()}>
            Criar perfil
          </Button>
        </Stack>
      </Modal>
    </div>
  );
}
