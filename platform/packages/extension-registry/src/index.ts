import type { RegistryEntry, TrustLevel } from '@aprincar/extension-contracts';
export function mergeRegistries(...registries: RegistryEntry[][]): RegistryEntry[] {
  const map = new Map<string, RegistryEntry>();
  for (const registry of registries)
    for (const entry of registry) {
      const key = `${entry.id}@${entry.version}`;
      const current = map.get(key);
      if (!current || rank(entry.trust) > rank(current.trust)) map.set(key, entry);
    }
  return [...map.values()].sort((a, b) => a.id.localeCompare(b.id));
}
export function visibleForChild(entries: RegistryEntry[], allowCommunity = false) {
  return entries.filter(
    (e) => e.trust === 'official' || e.trust === 'curated' || (allowCommunity && e.trust === 'community'),
  );
}
function rank(t: TrustLevel) {
  return ({ experimental: 0, community: 1, curated: 2, official: 3 } as const)[t];
}
