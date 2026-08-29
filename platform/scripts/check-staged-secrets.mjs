import { execFileSync } from 'node:child_process';

const staged = execFileSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACMR'], {
  encoding: 'utf8',
})
  .trim()
  .split('\n')
  .filter(Boolean);

const forbiddenNames = /(^|\/)(\.env($|\.)|id_rsa|id_ed25519|.*\.(pem|key))$/i;
const forbiddenContent =
  /(-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|gh[pousr]_[A-Za-z0-9_]+|AKIA[0-9A-Z]{16})/;
const offenders = [];

for (const file of staged) {
  if (forbiddenNames.test(file)) offenders.push(`${file} (arquivo sensível)`);
  try {
    const content = execFileSync('git', ['show', `:${file}`], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    if (forbiddenContent.test(content)) offenders.push(`${file} (credencial detectada)`);
  } catch {
    // Binary or deleted files are ignored by the content check.
  }
}

if (offenders.length > 0) {
  console.error('Commit bloqueado: possível segredo nos arquivos staged:');
  for (const offender of offenders) console.error(`- ${offender}`);
  process.exit(1);
}
