/// <reference lib="webworker" />
import { clientsClaim } from 'workbox-core';
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
declare const self: ServiceWorkerGlobalScope & { __WB_MANIFEST: Array<any> };
clientsClaim();
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);
registerRoute(
  ({ request }) => request.mode === 'navigate',
  new NetworkFirst({ cacheName: 'aprincar-pages' }),
);
registerRoute(
  ({ url }) => url.pathname.endsWith('/registry.json'),
  new StaleWhileRevalidate({ cacheName: 'aprincar-registry' }),
);
