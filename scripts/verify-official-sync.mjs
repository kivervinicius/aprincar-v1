import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const canonicalRoot = path.join(root, 'games-official', 'dist');
const surfaces = [
  path.join(root, 'platform', 'apps', 'app', 'public'),
  path.join(root, 'platform', 'apps', 'hub', 'public'),
];

function sha256File(file) {
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}
function json(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function normalizedRegistry(entries) {
  return entries.map((entry) => ({
    ...entry,
    manifestUrl: String(entry.manifestUrl).replace(/^https?:\/\/[^/]+/, ''),
    entryUrl: String(entry.entryUrl).replace(/^https?:\/\/[^/]+/, ''),
  }));
}

const errors = [];
if (!fs.existsSync(path.join(canonicalRoot, 'registry.json'))) {
  errors.push('games-official/dist/registry.json is missing; run npm run build in games-official first');
} else {
  const canonicalRegistry = json(path.join(canonicalRoot, 'registry.json'));
  for (const surface of surfaces) {
    const name = path.relative(root, surface);
    const registryFile = path.join(surface, 'registry.json');
    if (!fs.existsSync(registryFile)) {
      errors.push(`${name}: registry.json is missing`);
      continue;
    }
    const registry = json(registryFile);
    if (JSON.stringify(normalizedRegistry(registry)) !== JSON.stringify(normalizedRegistry(canonicalRegistry))) {
      errors.push(`${name}: registry.json differs from canonical games-official registry`);
    }
    for (const entry of canonicalRegistry) {
      const slug = String(entry.entryUrl).split('/').filter(Boolean).at(-2);
      const extensionDir = path.join(surface, 'extensions', slug);
      const canonicalDir = path.join(canonicalRoot, 'extensions', slug);
      for (const fileName of ['game.html', 'manifest.json', 'integrity.json']) {
        const actual = path.join(extensionDir, fileName);
        const expected = path.join(canonicalDir, fileName);
        if (!fs.existsSync(actual)) {
          errors.push(`${name}: missing extensions/${slug}/${fileName}`);
          continue;
        }
        if (sha256File(actual) !== sha256File(expected)) {
          errors.push(`${name}: extensions/${slug}/${fileName} differs from canonical artifact`);
        }
      }
      const gameHash = sha256File(path.join(extensionDir, 'game.html'));
      const integrity = json(path.join(extensionDir, 'integrity.json'));
      if (integrity.sha256 !== gameHash) errors.push(`${name}: ${slug} integrity.json does not match game.html`);
      const surfaceEntry = registry.find((item) => item.id === entry.id && item.version === entry.version);
      if (!surfaceEntry) errors.push(`${name}: missing registry entry ${entry.id}@${entry.version}`);
      else if (surfaceEntry.integrity !== gameHash)
        errors.push(`${name}: registry integrity mismatch for ${entry.id}@${entry.version}`);
      const manifest = json(path.join(extensionDir, 'manifest.json'));
      if (manifest.id !== entry.id || manifest.version !== entry.version)
        errors.push(`${name}: manifest identity mismatch for ${entry.id}@${entry.version}`);
    }
  }
}

if (errors.length) {
  console.error(`Official artifact consistency FAILED with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Official artifact consistency PASS');
