#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(process.argv[2] ?? '.');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8')),
  html = fs.readFileSync(path.join(dir, 'game.html'), 'utf8');
const errors = [];
if (manifest.manifestVersion !== 1 || manifest.bundleMode !== 'single-html')
  errors.push('invalid Aprincar V1 manifest');
if (/<script[^>]+src=["']https?:\/\//i.test(html) || /eval\s*\(/.test(html))
  errors.push('remote/dynamic executable code forbidden');
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`${manifest.id}@${manifest.version}: valid`);
