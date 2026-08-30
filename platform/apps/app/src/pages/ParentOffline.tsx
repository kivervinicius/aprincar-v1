import { Badge, Button, Group, Progress, Table, Text } from '@mantine/core';
import { ArrowLeft, Check, CloudDownload, CloudOff, HardDrive, RefreshCw, Trash2 } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { db, extensionCacheAdapter } from '@aprincar/storage';
import { useAppStore, extensionManager } from '../app-store';
import { TrustBadge, OfflineBadge } from '@aprincar/ui';

export function ParentOffline() {
  const navigate = useNavigate();
  const { registry, isOfflineReady, prepareOffline } = useAppStore();

  const [offlineMap, setOfflineMap] = useState<Record<string, boolean>>({});
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [storageStats, setStorageStats] = useState({
    profileCount: 0,
    sessionCount: 0,
    evidenceCount: 0,
    offlineGameCount: 0,
    estimatedKb: 0,
  });

  const refreshStatus = async () => {
    const map: Record<string, boolean> = {};
    let offlineCount = 0;
    for (const item of registry) {
      const ready = await isOfflineReady(item);
      map[item.id] = ready;
      if (ready) offlineCount++;
    }
    setOfflineMap(map);

    const profiles = await db.profiles.count();
    const sessions = await db.sessions.count();
    const evidence = await db.evidence.count();

    setStorageStats({
      profileCount: profiles,
      sessionCount: sessions,
      evidenceCount: evidence,
      offlineGameCount: offlineCount,
      estimatedKb: Math.round(offlineCount * 120 + evidence * 0.5 + sessions * 0.2 + 250),
    });
  };

  useEffect(() => {
    refreshStatus();
  }, [registry]);

  const handleDownload = async (entry: any) => {
    setLoadingMap((prev) => ({ ...prev, [entry.id]: true }));
    try {
      await prepareOffline(entry);
      await refreshStatus();
    } finally {
      setLoadingMap((prev) => ({ ...prev, [entry.id]: false }));
    }
  };

  const handleRemove = async (entry: any) => {
    setLoadingMap((prev) => ({ ...prev, [entry.id]: true }));
    try {
      await extensionCacheAdapter.remove(extensionManager.key(entry));
      await refreshStatus();
    } finally {
      setLoadingMap((prev) => ({ ...prev, [entry.id]: false }));
    }
  };

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
            Voltar para Painel do Responsável
          </Button>
          <div className="child-eyebrow">Armazenamento & Funcionamento Local</div>
          <h2 style={{ fontSize: 34 }}>Gerenciador Offline</h2>
          <p>
            Controle quais jogos ficam baixados neste dispositivo para brincar sem conexão com a internet.
          </p>
        </div>
      </section>

      {/* KPI stats */}
      <div className="parent-kpis">
        <div className="parent-card">
          <Text size="sm" c="dimmed">
            Jogos baixados
          </Text>
          <Text fz={32} fw={900}>
            {storageStats.offlineGameCount} de {registry.length}
          </Text>
          <Text size="xs" c="teal">
            Prontos para uso offline
          </Text>
        </div>

        <div className="parent-card">
          <Text size="sm" c="dimmed">
            Espaço estimado utilizado
          </Text>
          <Text fz={32} fw={900}>
            ~{storageStats.estimatedKb} KB
          </Text>
          <Text size="xs" c="dimmed">
            armazenado no IndexedDB local
          </Text>
        </div>

        <div className="parent-card">
          <Text size="sm" c="dimmed">
            Evidências & Registros
          </Text>
          <Text fz={32} fw={900}>
            {storageStats.evidenceCount}
          </Text>
          <Text size="xs" c="dimmed">
            em {storageStats.sessionCount} sessões locais
          </Text>
        </div>
      </div>

      {/* Games management table */}
      <div className="parent-card">
        <div className="section-head" style={{ marginBottom: 16 }}>
          <div>
            <h3>Gerenciamento de Jogos</h3>
            <p>Baixe para jogar em viagens ou em locais sem internet.</p>
          </div>
          <Button variant="light" color="blue" leftSection={<RefreshCw size={14} />} onClick={refreshStatus}>
            Atualizar status
          </Button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <Table verticalSpacing="md">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Jogo</Table.Th>
                <Table.Th>Confiança</Table.Th>
                <Table.Th>Status Offline</Table.Th>
                <Table.Th style={{ textAlign: 'right' }}>Ação</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {registry.map((entry) => {
                const isReady = Boolean(offlineMap[entry.id]);
                const isLoading = Boolean(loadingMap[entry.id]);
                const title = entry.name?.['pt-BR'] ?? entry.id;

                return (
                  <Table.Tr key={entry.id}>
                    <Table.Td>
                      <strong>{title}</strong>
                      <Text size="xs" c="dimmed">
                        {entry.id} · v{entry.version}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <TrustBadge trust={entry.trust} />
                    </Table.Td>
                    <Table.Td>
                      <OfflineBadge ready={isReady} />
                    </Table.Td>
                    <Table.Td style={{ textAlign: 'right' }}>
                      {isReady ? (
                        <Button
                          variant="subtle"
                          color="red"
                          size="xs"
                          leftSection={<Trash2 size={13} />}
                          loading={isLoading}
                          onClick={() => handleRemove(entry)}
                        >
                          Remover download
                        </Button>
                      ) : (
                        <Button
                          className="ap-primary"
                          size="xs"
                          leftSection={<CloudDownload size={13} />}
                          loading={isLoading}
                          onClick={() => handleDownload(entry)}
                        >
                          Baixar offline
                        </Button>
                      )}
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </div>
      </div>
    </div>
  );
}
