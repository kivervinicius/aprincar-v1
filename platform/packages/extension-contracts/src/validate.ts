import type { ExtensionManifest, Permission } from './types.ts';

const ID = /^[a-z0-9][a-z0-9.-]*[a-z0-9]$/;
const VERSION = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;
const PERMISSIONS: Permission[] = [
  'storage',
  'audio',
  'haptics',
  'fullscreen',
  'drawing',
  'handwriting',
  'camera',
  'microphone',
  'network',
  'geolocation',
];

export function validateExtensionManifest(input: unknown): {
  ok: boolean;
  errors: string[];
  manifest?: ExtensionManifest;
} {
  const errors: string[] = [];
  if (!input || typeof input !== 'object') return { ok: false, errors: ['manifest must be an object'] };
  const m = input as Record<string, any>;
  if (m.manifestVersion !== 1) errors.push('manifestVersion must be 1');
  if (typeof m.id !== 'string' || !ID.test(m.id))
    errors.push('id must be a lowercase reverse-domain style identifier');
  if (!['game', 'theme', 'curriculum', 'content'].includes(m.kind)) errors.push('kind is invalid');
  if (typeof m.version !== 'string' || !VERSION.test(m.version))
    errors.push('version must use semantic versioning');
  if (typeof m.publisher !== 'string' || m.publisher.trim().length < 2) errors.push('publisher is required');
  if (!m.name || typeof m.name !== 'object' || Object.keys(m.name).length === 0)
    errors.push('name requires at least one locale');
  if (!m.engines || typeof m.engines.aprincar !== 'string' || m.engines.sdkProtocol !== 1)
    errors.push('engines must target Aprincar and sdkProtocol 1');
  if (m.kind === 'game') {
    if (!m.entrypoints || typeof m.entrypoints.game !== 'string' || !m.entrypoints.game.endsWith('.html'))
      errors.push('game entrypoint must be a local HTML file');
    if (typeof m.entrypoints?.game === 'string' && /^(https?:)?\/\//i.test(m.entrypoints.game))
      errors.push('game entrypoint cannot be remote');
  }
  if (m.bundleMode !== 'single-html') errors.push('bundleMode must be single-html in Aprincar V1');
  if (
    !Array.isArray(m.permissions) ||
    !m.permissions.every((p: unknown) => PERMISSIONS.includes(p as Permission))
  )
    errors.push('permissions contains unsupported permission');
  if (Array.isArray(m.permissions) && m.permissions.includes('remote-code'))
    errors.push('remote-code is forbidden');
  if (
    !Array.isArray(m.optionalPermissions) ||
    !m.optionalPermissions.every((p: unknown) => PERMISSIONS.includes(p as Permission))
  )
    errors.push('optionalPermissions contains unsupported permission');
  if (!m.contributes || !Array.isArray(m.contributes.skills))
    errors.push('contributes.skills must be an array');
  const age = m.contributes?.ageGuidance;
  if (
    age &&
    (!Number.isFinite(age.min) ||
      !Number.isFinite(age.max) ||
      age.min < 2 ||
      age.max > 14 ||
      age.min > age.max)
  )
    errors.push('ageGuidance must be between 2 and 14');
  if (m.offline !== true && !(Array.isArray(m.permissions) && m.permissions.includes('network')))
    errors.push('non-offline games must explicitly request network permission');
  return errors.length ? { ok: false, errors } : { ok: true, errors, manifest: input as ExtensionManifest };
}
