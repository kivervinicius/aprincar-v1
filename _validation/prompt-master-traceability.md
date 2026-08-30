# Rastreabilidade do Prompt Mestre — 48 seções

O arquivo do Prompt Mestre não está no working tree. Para manter as 48 seções exigidas, esta matriz usa o plano aprovado e a especificação local como baseline. Aprincar Connect é explicitamente não-meta da V1. `BLOCKED` significa que a evidência exige GitHub remoto ou outro ambiente fora do escopo local.

| # | Requisito auditado | Status | Evidência nova / lacuna | Severidade | Aceitação pendente |
| ---: | --- | --- | --- | --- | --- |
| 1 | Nove repositórios locais | PASS | Inventário e `README.md` raiz | — | Manter os nove publicáveis |
| 2 | Produto local-first V1 | PASS | App, storage e docs locais | — | Teste unitário de perfil |
| 3 | Child Mode | PASS | `community-filtering.spec.ts` | — | E2E passou |
| 4 | Onboarding e perfis | PASS | `onboarding.spec.ts`, `profiles.spec.ts` | — | E2E passou |
| 5 | Biblioteca | PASS | `library-offline.spec.ts` | — | E2E passou |
| 6 | Parent Mode e PIN | PASS | `parent-mode.spec.ts` | — | E2E passou |
| 7 | Hub | PASS | `hub.spec.ts` | — | E2E passou |
| 8 | PWA | PASS | build precache e teste PWA | — | Build passou |
| 9 | Offline e reconexão | PASS | `library-offline.spec.ts` | — | E2E passou |
| 10 | Matriz mobile/tablet/landscape | PASS | `mobile-layout.spec.ts` | — | 320–430, tablets e landscape passaram |
| 11 | Dez jogos oficiais | PASS | Snapshot e registry, 10 jogos | — | Verificador passou |
| 12 | Erro, recuperação, avanço e Evidence | PASS | 28/28 E2E após sincronizar `inputReady` | — | Gate integral passou |
| 13 | Experiência 3D/WebGL | PASS | cenário Three.js passou | — | E2E passou |
| 14 | Resize e touch | PASS | mobile + 3D E2E | — | E2E passou |
| 15 | Property/fuzz dos geradores | PASS | 20.000 seeds, cinco invariantes | — | [log](evidence/challenge-property.log) |
| 16 | Sem import direto de jogos | PASS | boundary check | — | 17 arquivos passaram |
| 17 | Sandbox de extensões | PASS | `GameHost.tsx`, teste sandbox | — | Unitário passou |
| 18 | CSP e referrer policy | PASS | `sandbox.ts` | — | Teste sandbox passou |
| 19 | MessageChannel / SDK | PASS | host, protocolo e testes SDK | — | Unitário passou |
| 20 | Permissões e storage isolado | PASS | game services e storage | — | Unitário passou |
| 21 | Evidence → Progress | PASS | Recovery E2E e gate integral verdes | — | Gate completo passou |
| 22 | Rewards independentes | PASS | `reward-engine.test.ts` | — | Unitário passou |
| 23 | Níveis de confiança | PASS | progress tests official/community/experimental | — | Unitário passou |
| 24 | Peso pedagógico | PASS | `ProgressEngine` e testes | — | Unitário passou |
| 25 | Skill Graph | PASS | pacote e snapshot de 46 skills | — | Validação passou |
| 26 | Curriculum Mapping | PASS | crosswalk de seis mapeamentos | — | Validação passou |
| 27 | BNCC | PASS | cinco referências BNCC validadas | — | Teste passou |
| 28 | Manifests canônicos | PASS | validator oficial e templates | — | Checks passaram |
| 29 | Schemas e Skill IDs | PASS | parity checker | — | Paridade passou |
| 30 | Registry canônico | PASS | build oficial/comunidade | — | Checks passaram |
| 31 | Integridade SHA-256 | PASS | snapshot/parity | — | Verificadores passaram |
| 32 | Sem código remoto | PASS | validator, fixtures negativos e manager | — | Testes passaram |
| 33 | Licenças vendor | PASS | `PHASER-LICENSE.md`, `THREE-LICENSE.txt` | — | Arquivos presentes |
| 34 | Testes de plataforma | PASS | 30/30 | — | [log](evidence/platform.npm_run_test.log) |
| 35 | TypeScript, lint e formato | PASS | Todos zero erro | — | Gates passaram |
| 36 | Build App/Hub | PASS | Vite/PWA e Hub | — | Gate passou |
| 37 | Auditoria de dependências | PASS | Oito `npm audit`, zero vulnerabilidades | — | Logs em evidence |
| 38 | README e arquitetura | PASS | Todos os roots têm README; mapa central | — | Revisão local |
| 39 | SDK e templates documentados | PASS | docs e READMEs dos templates | — | Revisão local |
| 40 | CONTRIBUTING/SECURITY/GOVERNANCE/SUPPORT | PARTIAL | Cobertura central; falta em roots independentes | P2 | Padronizar por repo |
| 41 | ROADMAP, RFC/ADR e release notes | PARTIAL | Roadmap central, sem conjunto uniforme | P2 | Definir e versionar |
| 42 | CODEOWNERS | PARTIAL | Falta nos quatro templates e root organizacional | P2 | Adicionar cobertura |
| 43 | Dependabot e CodeQL | PARTIAL | Apenas plataforma tem ambos | P2 | Política para os demais |
| 44 | CI por repositório | PASS | CI em todos os produtos | — | Revisão de workflows |
| 45 | Pages e entrega | BLOCKED | Workflows locais existem; deploy remoto não verificável | — | Verificar run publicado |
| 46 | Estado local e branch | PASS | `main`, `origin/main` 0/0; alterações incluídas | — | Repetir antes de release |
| 47 | Proteção de branch/organização | BLOCKED | Não acessado por escopo | — | Conferir rulesets e alertas no GitHub |
| 48 | Aprincar Connect institucional | NOT APPLICABLE | Declarado fora de escopo V1 | — | Reavaliar em roadmap futuro |
