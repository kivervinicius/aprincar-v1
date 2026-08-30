import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const surfaces = [path.join(root, 'apps', 'app', 'public'), path.join(root, 'apps', 'hub', 'public')];
const canonicalRoot = process.env.APRINCAR_CANONICAL_GAMES_DIR
  ? path.resolve(process.env.APRINCAR_CANONICAL_GAMES_DIR)
  : null;

const sha = (file) => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const json = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const errors = [];
const registries = surfaces.map((surface) => json(path.join(surface, 'registry.json')));

function normalized(entries) {
  return entries.map((entry) => ({
    ...entry,
    manifestUrl: String(entry.manifestUrl).replace(/^https?:\/\/[^/]+/, ''),
    entryUrl: String(entry.entryUrl).replace(/^https?:\/\/[^/]+/, ''),
  }));
}

if (JSON.stringify(normalized(registries[0])) !== JSON.stringify(normalized(registries[1]))) {
  errors.push('App and Hub official registries differ');
}

for (let index = 0; index < surfaces.length; index += 1) {
  const surface = surfaces[index];
  const registry = registries[index];
  for (const entry of registry) {
    const slug = String(entry.entryUrl).split('/').filter(Boolean).at(-2);
    const dir = path.join(surface, 'extensions', slug);
    for (const file of ['game.html', 'manifest.json', 'integrity.json']) {
      if (!fs.existsSync(path.join(dir, file)))
        errors.push(`${path.relative(root, surface)} missing ${slug}/${file}`);
    }
    if (!fs.existsSync(path.join(dir, 'game.html'))) continue;
    const actual = sha(path.join(dir, 'game.html'));
    const integrity = json(path.join(dir, 'integrity.json'));
    const manifest = json(path.join(dir, 'manifest.json'));
    if (entry.integrity !== actual) errors.push(`${entry.id}: registry integrity does not match game.html`);
    if (integrity.sha256 !== actual) errors.push(`${entry.id}: integrity.json does not match game.html`);
    if (manifest.id !== entry.id || manifest.version !== entry.version)
      errors.push(`${entry.id}: manifest identity mismatch`);
  }
}

if (canonicalRoot) {
  const canonicalRegistryFile = path.join(canonicalRoot, 'registry.json');
  if (!fs.existsSync(canonicalRegistryFile))
    errors.push(`Canonical registry missing at ${canonicalRegistryFile}`);
  else {
    const canonicalRegistry = json(canonicalRegistryFile);
    if (JSON.stringify(normalized(canonicalRegistry)) !== JSON.stringify(normalized(registries[0]))) {
      errors.push('Platform registry differs from games-official canonical registry');
    }
    for (const entry of canonicalRegistry) {
      const slug = String(entry.entryUrl).split('/').filter(Boolean).at(-2);
      for (const surface of surfaces) {
        for (const file of ['game.html', 'manifest.json', 'integrity.json']) {
          const canonical = path.join(canonicalRoot, 'extensions', slug, file);
          const deployed = path.join(surface, 'extensions', slug, file);
          if (fs.existsSync(canonical) && fs.existsSync(deployed) && sha(canonical) !== sha(deployed)) {
            errors.push(
              `${path.relative(root, surface)} ${slug}/${file} differs from canonical games-official`,
            );
          }
        }
      }
    }
  }
}

if (errors.length) {
  console.error(`Official snapshot validation FAILED (${errors.length})`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(
  `Official snapshot validation PASS (${registries[0].length} games${canonicalRoot ? ', canonical checked' : ''})`,
);
