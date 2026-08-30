import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const gamesDist = path.join(root, 'games-official', 'dist');

if (!fs.existsSync(gamesDist)) {
  console.error('games-official/dist does not exist. Run "npm run check" in games-official first.');
  process.exit(1);
}

const targets = [
  path.join(root, 'platform', 'apps', 'app', 'public'),
  path.join(root, 'platform', 'apps', 'hub', 'public')
];

for (const target of targets) {
  // Sync registry.json
  fs.copyFileSync(path.join(gamesDist, 'registry.json'), path.join(target, 'registry.json'));
  
  // Sync extensions
  const srcExt = path.join(gamesDist, 'extensions');
  const dstExt = path.join(target, 'extensions');
  fs.rmSync(dstExt, { recursive: true, force: true });
  fs.cpSync(srcExt, dstExt, { recursive: true });
  console.log(`Synced official games to ${path.relative(root, target)}`);
}

console.log('Official games synchronized successfully across App and Hub.');
