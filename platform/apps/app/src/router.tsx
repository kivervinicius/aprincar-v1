import { createMemoryHistory, createRootRoute, createRoute, createRouter } from '@tanstack/react-router';
import { RootLayout } from './layout';
import { Home } from './pages/Home';
import { Discover } from './pages/Discover';
import { Library } from './pages/Library';
import { Parent } from './pages/Parent';
import { Settings } from './pages/Settings';
import { Play } from './pages/Play';

const root = createRootRoute({ component: RootLayout });
const index = createRoute({ getParentRoute: () => root, path: '/', component: Home });
const discover = createRoute({ getParentRoute: () => root, path: '/discover', component: Discover });
const library = createRoute({ getParentRoute: () => root, path: '/library', component: Library });
const parent = createRoute({ getParentRoute: () => root, path: '/parent', component: Parent });
const settings = createRoute({ getParentRoute: () => root, path: '/settings', component: Settings });
const play = createRoute({ getParentRoute: () => root, path: '/play/$gameId', component: Play });
const useMemoryHistory = Boolean(
  (globalThis as typeof globalThis & { __APRINCAR_E2E_MEMORY__?: boolean }).__APRINCAR_E2E_MEMORY__,
);
export const router = createRouter({
  routeTree: root.addChildren([index, discover, library, parent, settings, play]),
  ...(useMemoryHistory ? { history: createMemoryHistory({ initialEntries: ['/'] }) } : {}),
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
