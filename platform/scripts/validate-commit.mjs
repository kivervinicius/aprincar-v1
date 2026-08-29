import fs from 'node:fs';
const msg = fs.readFileSync(process.argv[2], 'utf8').trim();
if (!/^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?!?: .{3,}/.test(msg)) {
  console.error('Use Conventional Commits, ex: feat(app): add offline library');
  process.exit(1);
}
