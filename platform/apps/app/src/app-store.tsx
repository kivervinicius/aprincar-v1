import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db, extensionCacheAdapter, persistStorage, type ChildProfile } from '@aprincar/storage';
import { ExtensionManager } from '@aprincar/extension-manager';
import type { RegistryEntry } from '@aprincar/extension-contracts';
export interface AppStore {
  profile: ChildProfile | null;
  profiles: ChildProfile[];
  registry: RegistryEntry[];
  loading: boolean;
  createProfile(name: string, age?: number): Promise<void>;
  selectProfile(id: string): Promise<void>;
  prepareOffline(entry: RegistryEntry): Promise<void>;
  isOfflineReady(entry: RegistryEntry): Promise<boolean>;
  addLibrary(entry: RegistryEntry): Promise<void>;
  libraryIds: Set<string>;
  allowCommunity: boolean;
  setAllowCommunity(value: boolean): Promise<void>;
  refresh(): Promise<void>;
}
const C = createContext<AppStore | null>(null);
const manager = new ExtensionManager(extensionCacheAdapter, { fetch: (url) => fetch(url) });
async function loadRegistry() {
  const urls = [
    `${import.meta.env.BASE_URL}registry.json`,
    ...String(import.meta.env.VITE_APRINCAR_REGISTRY_URLS ?? '')
      .split(',')
      .map((x) => x.trim())
      .filter(Boolean),
  ] as string[];
  const all: RegistryEntry[] = [];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (r.ok) {
        for (const e of await r.json())
          if (!all.some((x) => x.id === e.id && x.version === e.version)) all.push(e);
      }
    } catch {}
  }
  return all;
}
export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [registry, setRegistry] = useState<RegistryEntry[]>([]);
  const [libraryIds, setLibraryIds] = useState(new Set<string>());
  const [allowCommunity, setAllowCommunityState] = useState(false);
  const [loading, setLoading] = useState(true);
  const refresh = async () => {
    const savedTheme = String((await db.settings.get('theme'))?.value ?? 'standard');
    document.documentElement.dataset.aprincarTheme = savedTheme;
    const ps = await db.profiles.toArray();
    setProfiles(ps);
    const selected = String((await db.settings.get('selectedProfile'))?.value ?? '');
    const p = ps.find((x) => x.id === selected) ?? ps[0] ?? null;
    setProfile(p);
    const lib = p ? await db.library.where('profileId').equals(p.id).toArray() : [];
    setLibraryIds(new Set(lib.map((x) => x.extensionId)));
    const allow = Boolean((await db.settings.get('allowCommunity'))?.value ?? false);
    setAllowCommunityState(allow);
    const loaded = await loadRegistry();
    setRegistry(
      loaded.filter(
        (e) => e.trust === 'official' || e.trust === 'curated' || (allow && e.trust === 'community'),
      ),
    );
    setLoading(false);
  };
  useEffect(() => {
    persistStorage().catch(() => false);
    refresh();
  }, []);
  const value = useMemo<AppStore>(
    () => ({
      profile,
      profiles,
      registry,
      loading,
      libraryIds,
      allowCommunity,
      async setAllowCommunity(value) {
        await db.settings.put({ key: 'allowCommunity', value });
        await refresh();
      },
      refresh,
      async createProfile(name, age) {
        const p = {
          id: crypto.randomUUID(),
          name: name.trim(),
          age,
          avatar: '🦊',
          createdAt: new Date().toISOString(),
        };
        await db.profiles.add(p);
        await db.settings.put({ key: 'selectedProfile', value: p.id });
        await refresh();
      },
      async selectProfile(id) {
        await db.settings.put({ key: 'selectedProfile', value: id });
        await refresh();
      },
      async prepareOffline(entry) {
        await manager.resolve(entry);
      },
      async isOfflineReady(entry) {
        return !!(await extensionCacheAdapter.get(manager.key(entry)));
      },
      async addLibrary(entry) {
        if (!profile) return;
        await db.library.put({
          id: `${profile.id}:${entry.id}`,
          profileId: profile.id,
          extensionId: entry.id,
          version: entry.version,
          favorite: true,
          addedAt: new Date().toISOString(),
        });
        await refresh();
      },
    }),
    [profile, profiles, registry, loading, libraryIds, allowCommunity],
  );
  return <C.Provider value={value}>{children}</C.Provider>;
}
export function useAppStore() {
  const v = useContext(C);
  if (!v) throw new Error('AppStoreProvider missing');
  return v;
}
export { manager as extensionManager };
