import type { CSSProperties, ReactNode } from 'react';
import { Badge, Group, Text } from '@mantine/core';
import { CloudOff, ShieldCheck } from 'lucide-react';

export const APRINCAR_COLORS = {
  bg: '#F7F6F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F0EEE8',
  text: '#242523',
  muted: '#6F716D',
  border: '#E2DFD7',
  purple: '#6F5BD7',
  purpleStrong: '#5D49CC',
  purpleSoft: '#EFEAFE',
  coral: '#F07867',
  sun: '#F4C95D',
  leaf: '#65A67A',
  sky: '#62A6D8',
} as const;

export function BrandMark({ size = 46, style }: { size?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" style={style}>
      <defs>
        <linearGradient id="aprincarA" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#8069EC" />
          <stop offset="1" stopColor="#5D49CC" />
        </linearGradient>
      </defs>
      <path d="M25 5c3-5 11-5 14 0l16 30c3 6-1 13-8 13H17c-7 0-11-7-8-13L25 5Z" fill="url(#aprincarA)" />
      <path
        d="m32 18 2.5 5 5.5.8-4 3.9.9 5.5-4.9-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L32 18Z"
        fill="white"
        opacity=".96"
      />
      <rect x="4" y="40" width="25" height="16" rx="8" transform="rotate(-18 4 40)" fill="#F07867" />
      <rect x="25" y="42" width="17" height="17" rx="5" fill="#65A67A" />
      <circle cx="53" cy="50" r="9" fill="#62A6D8" />
    </svg>
  );
}

export function Brand({ compact = false, light = false }: { compact?: boolean; light?: boolean }) {
  return (
    <Group gap={10} wrap="nowrap" className="aprincar-brand">
      <BrandMark size={compact ? 38 : 46} />
      <div>
        <Text
          fw={900}
          fz={compact ? 22 : 28}
          lh={1}
          c={light ? 'white' : APRINCAR_COLORS.purpleStrong}
          style={{ letterSpacing: '-0.04em' }}
        >
          Aprincar
        </Text>
        {!compact && (
          <Text size="xs" c={light ? 'gray.2' : 'dimmed'} mt={3}>
            Aprender acontece brincando.
          </Text>
        )}
      </div>
    </Group>
  );
}

export function TrustBadge({ trust }: { trust: string }) {
  const label = trust === 'official' ? 'Oficial' : trust === 'curated' ? 'Curado' : 'Comunidade';
  const color = trust === 'official' ? 'violet' : trust === 'curated' ? 'teal' : 'gray';
  return (
    <Badge variant="light" radius="xl" color={color}>
      {label}
    </Badge>
  );
}

export function OfflineBadge({ ready }: { ready: boolean }) {
  return (
    <Badge leftSection={<CloudOff size={12} />} color={ready ? 'teal' : 'gray'} radius="xl" variant="light">
      {ready ? 'Offline pronto' : 'Online'}
    </Badge>
  );
}

export function PrincipleCard({ title, text, icon }: { title: string; text: string; icon?: ReactNode }) {
  return (
    <div className="aprincar-principle-card">
      <div className="aprincar-principle-icon">{icon ?? <ShieldCheck size={20} />}</div>
      <Text fw={850}>{title}</Text>
      <Text c="dimmed" size="sm">
        {text}
      </Text>
    </div>
  );
}
