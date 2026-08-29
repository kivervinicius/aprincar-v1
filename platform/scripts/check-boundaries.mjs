import fs from 'node:fs';
import path from 'node:path';
const root = new URL('../apps/app/src/', import.meta.url);
const files = [];
function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    e.isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(e.name) && files.push(p);
  }
}
walk(root.pathname);
const bad = [];
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (/from\s+['"][^'"]*games\//.test(s) || /from\s+['"]@aprincar\/games/.test(s)) bad.push(f);
}
if (bad.length) {
  console.error('Forbidden App -> games coupling:', bad);
  process.exit(1);
}
console.log(`Architecture boundary OK (${files.length} App files scanned)`);
