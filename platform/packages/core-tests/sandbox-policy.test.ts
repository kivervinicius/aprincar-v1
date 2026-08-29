import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSandboxDocument } from '../extension-host/src/sandbox.ts';

const manifest: any = { permissions: [], optionalPermissions: [] };
test('injects a CSP that blocks network connections for normal games', () => {
  const html = buildSandboxDocument('<!doctype html><html><head></head><body>ok</body></html>', manifest);
  assert.match(html, /Content-Security-Policy/i);
  assert.match(html, /connect-src 'none'/i);
  assert.match(html, /default-src 'none'/i);
});

test('places CSP metadata inside a head even when the extension omits one', () => {
  const html = buildSandboxDocument('<!doctype html><html><body>ok</body></html>', manifest);
  assert.match(html, /<html[^>]*><head><meta http-equiv="Content-Security-Policy"/i);
});
