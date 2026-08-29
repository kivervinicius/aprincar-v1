import test from 'node:test';
import assert from 'node:assert/strict';
import { ExtensionManager } from '../extension-manager/src/index.ts';

class MemoryCache {
  map = new Map<string, any>();
  async get(key: string) {
    return this.map.get(key) ?? null;
  }
  async put(key: string, value: any) {
    this.map.set(key, value);
  }
  async remove(key: string) {
    this.map.delete(key);
  }
}

test('resolves a cached extension without remote access', async () => {
  const cache = new MemoryCache();
  await cache.put('aprincar.demo@1.0.0', {
    manifest: { id: 'aprincar.demo', version: '1.0.0' },
    html: '<h1>cached</h1>',
    source: 'cache',
  });
  let remoteCalls = 0;
  const manager = new ExtensionManager(cache, {
    fetch: async () => {
      remoteCalls++;
      throw new Error('offline');
    },
  });
  const resolved = await manager.resolve({
    id: 'aprincar.demo',
    version: '1.0.0',
    manifestUrl: '/m.json',
    entryUrl: '/game.html',
    integrity: '',
  });
  assert.equal(resolved.html, '<h1>cached</h1>');
  assert.equal(remoteCalls, 0);
});

test('fetches and caches an extension when not locally available', async () => {
  const cache = new MemoryCache();
  const manifest = {
    manifestVersion: 1,
    id: 'aprincar.demo',
    kind: 'game',
    version: '1.0.0',
    publisher: 'aprincar',
    name: { 'pt-BR': 'Demo' },
    engines: { aprincar: '^1.0.0', sdkProtocol: 1 },
    entrypoints: { game: 'game.html' },
    permissions: [],
    optionalPermissions: [],
    contributes: { skills: [] },
    offline: true,
    bundleMode: 'single-html',
  };
  const responses: Record<string, string> = {
    '/m.json': JSON.stringify(manifest),
    '/game.html': '<h1>remote</h1>',
  };
  const manager = new ExtensionManager(cache, {
    fetch: async (url: string) =>
      ({ ok: true, text: async () => responses[url], json: async () => JSON.parse(responses[url]) }) as any,
  });
  const resolved = await manager.resolve({
    id: 'aprincar.demo',
    version: '1.0.0',
    manifestUrl: '/m.json',
    entryUrl: '/game.html',
    integrity: '',
  });
  assert.equal(resolved.html, '<h1>remote</h1>');
  assert.ok(await cache.get('aprincar.demo@1.0.0'));
});
