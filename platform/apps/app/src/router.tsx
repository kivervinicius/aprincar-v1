import { createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from './layout';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Library } from './pages/Library';
import { WorldDetail } from './pages/WorldDetail';
import { Missions } from './pages/Missions';
import { More } from './pages/More';
import { Parent } from './pages/Parent';
import { ParentSkillDetail } from './pages/ParentSkillDetail';
import { ParentOffline } from './pages/ParentOffline';
import { Settings } from './pages/Settings';
import { Play } from './pages/Play';
import { Onboarding } from './pages/Onboarding';

const root = createRootRoute({ component: RootLayout });
const index = createRoute({ getParentRoute: () => root, path: '/', component: Home });
const onboarding = createRoute({ getParentRoute: () => root, path: '/onboarding', component: Onboarding });
const discover = createRoute({ getParentRoute: () => root, path: '/discover', component: Discover });
const library = createRoute({ getParentRoute: () => root, path: '/library', component: Library });
const world = createRoute({ getParentRoute: () => root, path: '/world/$worldId', component: WorldDetail });
const missions = createRoute({ getParentRoute: () => root, path: '/missions', component: Missions });
const more = createRoute({ getParentRoute: () => root, path: '/more', component: More });
const parent = createRoute({ getParentRoute: () => root, path: '/parent', component: Parent });
const parentSkill = createRoute({
  getParentRoute: () => root,
  path: '/parent/skills/$skillId',
  component: ParentSkillDetail,
});
const parentOffline = createRoute({
  getParentRoute: () => root,
  path: '/parent/offline',
  component: ParentOffline,
});
const settings = createRoute({ getParentRoute: () => root, path: '/settings', component: Settings });
const play = createRoute({ getParentRoute: () => root, path: '/play/$gameId', component: Play });

const useMemoryHistory = Boolean(
  (globalThis as typeof globalThis & { __APRINCAR_E2E_MEMORY__?: boolean }).__APRINCAR_E2E_MEMORY__,
);

export const router = createRouter({
  basepath: import.meta.env.BASE_URL,
  routeTree: root.addChildren([
    index,
    onboarding,
    discover,
    library,
    world,
    missions,
    more,
    parent,
    parentSkill,
    parentOffline,
    settings,
    play,
  ]),
  ...(useMemoryHistory ? { history: createMemoryHistory({ initialEntries: ['/'] }) } : {}),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
