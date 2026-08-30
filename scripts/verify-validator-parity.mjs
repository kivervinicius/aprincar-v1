import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { spawnSync } from 'node:child_process';

const root = path.resolve(new URL('..', import.meta.url).pathname);
const errors = [];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}
function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === 'object')
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  return value;
}
function sameJson(a, b) {
  return JSON.stringify(canonical(readJson(a))) === JSON.stringify(canonical(readJson(b)));
}

const platformSchema = path.join(root, 'platform', 'schemas', 'extension-manifest-v1.schema.json');
for (const repo of [
  'games-official',
  'community-games',
  'game-template-vite',
  'game-template-react',
  'game-template-phaser',
  'game-template-threejs',
]) {
  const schema = path.join(root, repo, 'schemas', 'extension-manifest-v1.schema.json');
  if (!fs.existsSync(schema)) errors.push(`${repo}: missing extension manifest schema snapshot`);
  else if (!sameJson(platformSchema, schema)) errors.push(`${repo}: manifest schema snapshot differs from platform`);
}

const canonicalSkills = readJson(path.join(root, 'games-official', 'schemas', 'skill-ids.json'));
for (const repo of [
  'community-games',
  'curriculum-bncc',
  'game-template-vite',
  'game-template-react',
  'game-template-phaser',
  'game-template-threejs',
]) {
  const file = path.join(root, repo, 'schemas', 'skill-ids.json');
  if (!fs.existsSync(file)) errors.push(`${repo}: missing Skill ID snapshot`);
  else if (JSON.stringify(readJson(file)) !== JSON.stringify(canonicalSkills))
    errors.push(`${repo}: Skill ID snapshot differs from games-official`);
}

const skillGraphSource = fs.readFileSync(path.join(root, 'platform', 'packages', 'skill-graph', 'src', 'index.ts'), 'utf8');
const platformSkills = [...skillGraphSource.matchAll(/^\s{4}id: '([^']+)'/gm)].map((match) => match[1]);
if (JSON.stringify(platformSkills) !== JSON.stringify(canonicalSkills))
  errors.push('games-official Skill ID snapshot differs from platform Skill Graph');

const validatorCli = path.join(root, 'platform', 'packages', 'extension-validator', 'src', 'cli.mjs');
for (const repo of ['game-template-vite', 'game-template-react', 'game-template-phaser', 'game-template-threejs']) {
  const packageDir = path.join(root, repo, 'package');
  if (!fs.existsSync(path.join(packageDir, 'game.html'))) {
    errors.push(`${repo}: package artifact missing; run npm run check first`);
    continue;
  }
  const run = spawnSync(process.execPath, ['--experimental-strip-types', validatorCli, packageDir], {
    cwd: path.join(root, 'platform'),
    encoding: 'utf8',
  });
  if (run.status !== 0) errors.push(`${repo}: canonical validator failed: ${run.stderr.trim()}`);
}

if (errors.length) {
  console.error(`Validator parity FAILED with ${errors.length} issue(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log('Validator/schema/Skill snapshot parity PASS');
