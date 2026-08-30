# Auditoria Mestre Local do Aprincar

Data: 2026-08-29. Escopo: estado local atual dos nove repositórios do bundle, inclusive alterações não commitadas. Esta auditoria substitui os veredictos anteriores `GO` e `CONDITIONAL GO`: eles não são evidência suficiente para este estado porque o Playwright foi executado novamente e falhou.

## Veredict

**CONDITIONAL GO.** O gate de gameplay/Evidence foi corrigido após a auditoria: o runtime agora expõe prontidão de entrada somente depois de persistir uma tentativa, e o Playwright passou integralmente. Aprincar Connect permanece explicitamente fora do escopo da V1, portanto não é bloqueador desta entrega.

Não foram encontrados P0 ou P1. Controles de GitHub remoto são `BLOCKED`, pois esta auditoria não acessou nem alterou GitHub.

## Ambiente e estado auditado

- Sistema: Linux 6.17.0-23-generic, x86_64.
- Node.js 22.17.0 e npm 10.9.2, via NVM.
- Branch local: `main`; divergência conhecida de `origin/main`: `0 0`.
- Estado: 169 entradas no índice/worktree antes dos artefatos desta auditoria; alterações existentes foram preservadas e auditadas como parte do produto.
- Cópia de execução: `/tmp/aprincar-master-audit-Wnshuw`, criada sem `.git`, `node_modules`, builds, cobertura ou resultados anteriores.
- Browser: Chromium headless Playwright disponível. O Chrome do sistema é gerenciado, mas não foi necessário para a execução final.
- Repositórios: `.github`, `platform`, `games-official`, `community-games`, `curriculum-bncc` e quatro templates.

## Gates reproduzidos

| Área | Resultado | Evidência |
| --- | --- | --- |
| Sete repositórios satélite: `npm ci` + `npm run check` | PASS | [logs](evidence/games-official.check.log) |
| Jogos oficiais: build, sintaxe, manifests e registry | PASS, 10 jogos | [log](evidence/games-official.check.log) |
| Fuzz determinístico | PASS, 20.000 seeds e 5 invariantes | [log](evidence/challenge-property.log) |
| Plataforma: unitário | PASS, 30/30 | [log](evidence/platform.npm_run_test.log) |
| Plataforma: TypeScript, lint e formato | PASS | [typecheck](evidence/platform.npm_run_typecheck.log) |
| Plataforma: builds App/Hub e PWA | PASS | [log](evidence/platform.npm_run_build.log) |
| Snapshot oficial e fronteiras arquiteturais | PASS, 10 jogos / 17 arquivos | [snapshot](evidence/platform.npm_run_verify_official.log) |
| Paridade de artefatos e validator/schema/Skill | PASS | [logs](evidence/cross-official-sync.log) |
| `npm audit --audit-level=high`, oito roots | PASS, zero vulnerabilidades | [platform](evidence/platform.npm-audit.log) |
| Playwright completo após correção | PASS, 28/28 | `npm run test:e2e` e `./validate-production.sh` |
| Reprodução isolada anterior | RESOLVIDA | Falhava 3/3; agora passou três execuções consecutivas |

## Achados

### Correção verificada — Gate de gameplay/evidência

`platform/e2e/gameplay.spec.ts` agora espera `inputReady`; `games-official/src/runtime/phaser-runtime.js` só o expõe depois de persistir a evidência e liberar a tentativa seguinte. A correção foi validada em três execuções isoladas, na suíte Playwright completa (28/28) e no gate `./validate-production.sh` sem flags de skip.

### Escopo V1 — Aprincar Connect

`docs/superpowers/specs/2026-08-29-production-hardening-design.md` lista “Institutional Aprincar Connect” como não-meta. Ele permanece uma decisão futura de produto, não uma lacuna da V1.

### P2 — Governança e documentação distribuídas

Cada root tem README e licença; a organização tem CONTRIBUTING, SECURITY e SUPPORT. Porém `games-official`, `curriculum-bncc` e os quatro templates não possuem documentação local equivalente de contribuição/segurança, e não há ADR/RFC/release notes consistentes por repositório. Há CodeQL apenas na plataforma e Dependabot apenas na plataforma. Isto não altera o NO-GO já determinado pelos P1, mas reduz a maturidade de publicação independente.

## Segurança e arquitetura

As fronteiras executáveis passaram. O host usa iframe `sandbox="allow-scripts"`, CSP `default-src 'none'`, `MessageChannel`, validação de payload, cotas por sessão, armazenamento com chave de perfil/jogo, SHA-256 e bloqueio de código executável remoto. Evidence e Rewards são separados; a política de confiança impede consolidação exclusivamente comunitária e exclui evidência experimental do estado pedagógico. O scan de padrões de segredo só encontrou a própria expressão regular de detecção; nenhuma credencial candidata foi encontrada. As licenças de Phaser e Three.js estão versionadas junto aos vendors.

## Limites da auditoria

Não houve publicação, commit, push, alteração de código, arquitetura, design ou workflow. Configurações efetivas de proteção de branch, templates no GitHub, secret scanning, Pages publicado, releases e regras da organização não são verificáveis localmente e permanecem `BLOCKED`.

Consulte a matriz completa em [prompt-master-traceability.md](prompt-master-traceability.md) e a sequência de correção em [remediation-plan.md](remediation-plan.md).
