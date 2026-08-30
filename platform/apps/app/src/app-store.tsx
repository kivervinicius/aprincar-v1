import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { db, extensionCacheAdapter, persistStorage, type ChildProfile } from '@aprincar/storage';
import { ExtensionManager } from '@aprincar/extension-manager';
import { recommendNextExperience, type LearningRecommendation } from '@aprincar/learning-engine';
import type { RegistryEntry, SkillState } from '@aprincar/extension-contracts';

export interface CreateProfileInput {
  name: string;
  age?: number;
  avatar?: string;
  interests?: string[];
  focusSkills?: string[];
  dailyGoalMinutes?: number;
}

export interface AppStore {
  profile: ChildProfile | null;
  profiles: ChildProfile[];
  registry: RegistryEntry[];
  loading: boolean;
  initialized: boolean;
  recommendation: LearningRecommendation;
  recentGameIds: string[];
  completedMissionIds: Set<string>;
  createProfile(input: CreateProfileInput | string, age?: number): Promise<void>;
  selectProfile(id: string): Promise<void>;
  prepareOffline(entry: RegistryEntry): Promise<void>;
  isOfflineReady(entry: RegistryEntry): Promise<boolean>;
  addLibrary(entry: RegistryEntry): Promise<void>;
  removeLibrary(entry: RegistryEntry): Promise<void>;
  completeMission(missionId: string, worldId: string, skills: string[]): Promise<void>;
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
  ];
  const all: RegistryEntry[] = [];
  for (const url of urls) {
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      for (const e of await r.json()) {
        if (!all.some((x) => x.id === e.id && x.version === e.version)) all.push(e);
      }
    } catch {
      // Offline startup is expected; cached extensions and local data remain usable.
    }
  }
  return all;
}

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [profiles, setProfiles] = useState<ChildProfile[]>([]);
  const [profile, setProfile] = useState<ChildProfile | null>(null);
  const [registry, setRegistry] = useState<RegistryEntry[]>([]);
  const [libraryIds, setLibraryIds] = useState(new Set<string>());
  const [completedMissionIds, setCompletedMissionIds] = useState(new Set<string>());
  const [recentGameIds, setRecentGameIds] = useState<string[]>([]);
  const [skillStates, setSkillStates] = useState<SkillState[]>([]);
  const [offlineReadyIds, setOfflineReadyIds] = useState<Set<string>>(new Set());
  const [allowCommunity, setAllowCommunityState] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

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

    // Load persisted completed missions
    const missions = p ? await db.missionHistory.where('profileId').equals(p.id).toArray() : [];
    setCompletedMissionIds(new Set(missions.map((m) => m.missionId)));

    // Load recent game sessions for history window
    const recentSessions = p ? await db.sessions.where('profileId').equals(p.id).toArray() : [];
    const recentIds = recentSessions
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .map((s) => s.extensionId)
      .filter(Boolean)
      .slice(0, 5);
    setRecentGameIds(recentIds);

    // Load skill states for adaptive recommendation
    const states = p ? await db.skillStates.where('profileId').equals(p.id).toArray() : [];
    setSkillStates(states);

    // Check cached extensions for offline availability
    const cachedRows = await db.extensionCache.toArray();
    const cachedSet = new Set(cachedRows.map((r) => r.manifest?.id).filter(Boolean) as string[]);
    setOfflineReadyIds(cachedSet);

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

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    const focus = () => void refresh();
    window.addEventListener('focus', focus);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
      window.removeEventListener('focus', focus);
    };
  }, []);

  const recommendation = useMemo<LearningRecommendation>(() => {
    return recommendNextExperience({
      profile,
      registry,
      skillStates,
      recentGameIds,
      offlineReadyIds,
      libraryIds,
      isOffline: !isOnline,
    });
  }, [profile, registry, skillStates, recentGameIds, offlineReadyIds, libraryIds, isOnline]);

  const value = useMemo<AppStore>(
    () => ({
      profile,
      profiles,
      registry,
      loading,
      initialized: !loading,
      recommendation,
      recentGameIds,
      completedMissionIds,
      libraryIds,
      allowCommunity,
      async setAllowCommunity(value) {
        await db.settings.put({ key: 'allowCommunity', value });
        await refresh();
      },
      refresh,
      async createProfile(input, legacyAge) {
        const normalized: CreateProfileInput =
          typeof input === 'string' ? { name: input, age: legacyAge } : input;
        const p: ChildProfile = {
          id: crypto.randomUUID(),
          name: normalized.name.trim(),
          age: normalized.age,
          avatar: normalized.avatar ?? '⭐',
          interests: normalized.interests ?? [],
          focusSkills: normalized.focusSkills ?? [],
          dailyGoalMinutes: normalized.dailyGoalMinutes,
          createdAt: new Date().toISOString(),
        };
        await db.profiles.add(p);
        await db.settings.put({ key: 'selectedProfile', value: p.id });
        if (typeof normalized.dailyGoalMinutes === 'number' && normalized.dailyGoalMinutes > 0) {
          await db.settings.put({ key: `dailyLimit:${p.id}`, value: normalized.dailyGoalMinutes });
        }
        await refresh();
      },
      async selectProfile(id) {
        await db.settings.put({ key: 'selectedProfile', value: id });
        await refresh();
      },
      async prepareOffline(entry) {
        await manager.resolve(entry);
        await refresh();
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
      async removeLibrary(entry) {
        if (!profile) return;
        await db.library.delete(`${profile.id}:${entry.id}`);
        await refresh();
      },
      async completeMission(missionId, worldId, skills) {
        if (!profile) return;
        await db.missionHistory.put({
          id: `${profile.id}:${missionId}`,
          profileId: profile.id,
          missionId,
          worldId,
          skills,
          completedAt: new Date().toISOString(),
        });
        await refresh();
      },
    }),
    [
      profile,
      profiles,
      registry,
      loading,
      libraryIds,
      allowCommunity,
      recommendation,
      recentGameIds,
      completedMissionIds,
    ],
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useAppStore() {
  const v = useContext(C);
  if (!v) throw new Error('AppStoreProvider missing');
  return v;
}
export { manager as extensionManager };
