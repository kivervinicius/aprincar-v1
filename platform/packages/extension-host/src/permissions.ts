import type { ExtensionManifest, Permission } from '../../extension-contracts/src/types.ts';
const SENSITIVE = new Set<Permission>(['camera', 'microphone', 'network', 'geolocation']);
export function hasPermission(manifest: ExtensionManifest, permission: Permission) {
  return manifest.permissions.includes(permission) || manifest.optionalPermissions.includes(permission);
}
export function isSensitivePermission(permission: Permission) {
  return SENSITIVE.has(permission);
}
