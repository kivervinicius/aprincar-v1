import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const framework = readJson(path.join(root, 'framework.json'));
const mappingsFile = process.env.APRINCAR_MAPPINGS_FILE || path.join(root, 'mappings.json');
const mappings = readJson(mappingsFile);
const skillIds = new Set(readJson(path.join(root, 'schemas', 'skill-ids.json')));
const bnccCatalog = readJson(path.join(root, 'references', 'bncc-v1.json'));
const bnccCodes = new Map(bnccCatalog.references.map((reference) => [reference.code, reference]));
const relations = new Set(['direct', 'partial', 'supports', 'prerequisite']);
const errors = [];
const seen = new Set();

if (framework.id !== 'BNCC') errors.push('framework id must be BNCC');
if (bnccCatalog.framework !== 'BNCC' || bnccCatalog.version !== '2018')
  errors.push('BNCC reference catalog must identify BNCC version 2018');
if (!Array.isArray(mappings)) errors.push('mappings must be an array');

for (const [index, mapping] of (Array.isArray(mappings) ? mappings : []).entries()) {
  const prefix = `mapping ${index}`;
  if (!mapping || typeof mapping !== 'object') {
    errors.push(`${prefix}: mapping must be an object`);
    continue;
  }
  if (typeof mapping.skillId !== 'string' || !skillIds.has(mapping.skillId))
    errors.push(`${prefix}: unknown Skill ID ${String(mapping.skillId)}`);
  if (mapping.reference?.framework !== 'BNCC') errors.push(`${prefix}: reference framework must be BNCC`);
  const code = mapping.reference?.code;
  if (typeof code !== 'string' || !/^(EI|EF)\d{2}[A-Z]{2}\d{2}$/.test(code))
    errors.push(`${prefix}: invalid BNCC code ${String(code)}`);
  else if (!bnccCodes.has(code)) errors.push(`${prefix}: unknown BNCC reference ${code}`);
  if (!relations.has(mapping.relation)) errors.push(`${prefix}: unsupported relation ${String(mapping.relation)}`);
  if (
    mapping.confidence !== undefined &&
    (typeof mapping.confidence !== 'number' ||
      !Number.isFinite(mapping.confidence) ||
      mapping.confidence < 0 ||
      mapping.confidence > 1)
  )
    errors.push(`${prefix}: confidence must be finite between 0 and 1`);

  const catalogReference = bnccCodes.get(code);
  if (catalogReference && mapping.reference?.version !== bnccCatalog.version)
    errors.push(`${prefix}: BNCC version must be ${bnccCatalog.version}`);
  if (catalogReference && mapping.reference?.stage && mapping.reference.stage !== catalogReference.stage)
    errors.push(`${prefix}: BNCC stage does not match catalog for ${code}`);
  if (catalogReference?.grade && mapping.reference?.grade && mapping.reference.grade !== catalogReference.grade)
    errors.push(`${prefix}: BNCC grade does not match catalog for ${code}`);

  const duplicateKey = `${mapping.skillId}|${code}|${mapping.relation}`;
  if (seen.has(duplicateKey)) errors.push(`${prefix}: duplicate mapping relation ${duplicateKey}`);
  seen.add(duplicateKey);
}

if (errors.length) {
  for (const error of errors) console.error(error);
  process.exit(1);
}
console.log(
  `Validated ${mappings.length} conservative BNCC mappings against ${skillIds.size} Aprincar skills and ${bnccCodes.size} BNCC references`,
);
