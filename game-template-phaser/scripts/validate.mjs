import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const packageDir = path.join(root, 'package');
const manifestFile = path.join(packageDir, 'manifest.json');
const htmlFile = path.join(packageDir, 'game.html');
const integrityFile = path.join(packageDir, 'integrity.json');
const errors = [];

for (const file of [manifestFile, htmlFile, integrityFile]) {
  if (!fs.existsSync(file)) errors.push(`missing packaged file: ${path.basename(file)}`);
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
const html = fs.readFileSync(htmlFile, 'utf8');
const integrity = JSON.parse(fs.readFileSync(integrityFile, 'utf8'));
const skillIds = new Set(JSON.parse(fs.readFileSync(path.join(root, 'schemas', 'skill-ids.json'), 'utf8')));
const allowedPermissions = new Set([
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
]);

if (manifest.manifestVersion !== 1) errors.push('manifestVersion must be 1');
if (manifest.kind !== 'game') errors.push('kind must be game');
if (manifest.bundleMode !== 'single-html') errors.push('bundleMode must be single-html');
if (manifest.entrypoints?.game !== 'game.html') errors.push('entrypoints.game must be game.html');
if (!/^[a-z0-9][a-z0-9.-]*[a-z0-9]$/.test(String(manifest.id ?? ''))) errors.push('invalid extension id');
if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(String(manifest.version ?? ''))) errors.push('invalid semantic version');
if (manifest.engines?.sdkProtocol !== 1) errors.push('sdkProtocol must be 1');
if (typeof manifest.engines?.aprincar !== 'string' || !manifest.engines.aprincar.includes('1.0.0'))
  errors.push('Aprincar engine must target V1 (^1.0.0)');
if (!Array.isArray(manifest.permissions) || !manifest.permissions.every((permission) => allowedPermissions.has(permission)))
  errors.push('unsupported permission');
if (!Array.isArray(manifest.optionalPermissions) || !manifest.optionalPermissions.every((permission) => allowedPermissions.has(permission)))
  errors.push('unsupported optional permission');
const skills = [...(manifest.contributes?.skills ?? []), ...(manifest.contributes?.secondarySkills ?? [])];
if (skills.length === 0) errors.push('at least one Aprincar Skill ID is required');
for (const skill of skills) if (!skillIds.has(skill)) errors.push(`unknown skill: ${skill}`);
if (manifest.offline !== true && !manifest.permissions?.includes('network'))
  errors.push('non-offline games must request network permission');
if (/<script[^>]+src=["']https?:\/\//i.test(html) || /import\s*\([^)]*https?:\/\//i.test(html) || /eval\s*\(/.test(html))
  errors.push('remote or dynamic executable code is forbidden');
if (manifest.offline === true && /<(?:img|audio|video|source|link)\b[^>]*(?:src|href)=["']https?:\/\//i.test(html))
  errors.push('offline package references a remote asset');

const actualHash = crypto.createHash('sha256').update(html).digest('hex');
if (integrity.algorithm !== 'sha256' || integrity.entry !== 'game.html' || integrity.sha256 !== actualHash)
  errors.push('integrity.json does not match game.html');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`${manifest.id}@${manifest.version}: packaged Aprincar extension is valid`);
