#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { validateGamePackage } from './index.ts';

const dir = path.resolve(process.argv[2] ?? '.');
const manifestPath = path.join(dir, 'manifest.json');
const htmlPath = path.join(dir, 'game.html');

if (!fs.existsSync(manifestPath) || !fs.existsSync(htmlPath)) {
  console.error('package must contain manifest.json and game.html');
  process.exit(1);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (error) {
  console.error(`invalid manifest JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}
const html = fs.readFileSync(htmlPath, 'utf8');
const result = validateGamePackage(manifest, html);
if (!result.ok) {
  console.error(result.errors.join('\n'));
  process.exit(1);
}
console.log(`${result.manifest?.id}@${result.manifest?.version}: valid`);
