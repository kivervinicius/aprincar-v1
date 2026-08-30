# APRINCAR V1.1 — IMMUTABLE BASELINE CAPTURE

**Data / Timestamp:** 30 de Agosto de 2026, 18:37 UTC (14:37 BRT)  
**Branch Inicial:** `feat/aprincar-v1-1-product-gameplay-10-10`  
**Base Commit (HEAD):** `bf3b810cc15cdbd35e45e6884480f6a66116da0a`  
**Remote Origin:** `https://github.com/kivervinicius/aprincar-v1.git`

---

## 1. Status Inicial dos Gates

| Componente | Comando | Resultado | Duração |
| :--- | :--- | :--- | :--- |
| **Platform Unit Tests** | `npm test` | ✅ 33/33 PASS | 1.6s |
| **Platform Typecheck** | `npm run typecheck` | ✅ 0 errors | 3.2s |
| **Platform Lint** | `npm run lint` | ✅ 0 errors | 1.8s |
| **Platform Build** | `npm run build` | ✅ App & Hub built, PWA generated | 32s |
| **Official Games Snapshot** | `npm run verify:official` | ✅ 10 games PASS | 0.8s |
| **Games Official Tests** | `npm test` | ✅ 13/13 PASS | 0.8s |
| **Community Games Tests** | `npm test` | ✅ 2/2 PASS | 0.6s |
| **Curriculum BNCC Tests** | `npm test` | ✅ 4/4 PASS | 0.6s |
| **Templates Tests** | `npm test` (4 repos) | ✅ 4/4 PASS | 1.0s |

---

## 2. Inventário de Findings Iniciais da V1.0

1. **Runtime Phaser Compartilhado & Genérico:**
   - Atualmente `games-official/src/runtime/phaser-runtime.js` implementa um `setupMode()` monolítico de ~380 linhas que atende 9 dos 10 jogos com geometria simplificada e mecânicas básicas.
   - Necessário refatorar para manter infraestrutura comum (`common/`) e modularizar cada um dos jogos em arquivos e cenas dedicados (`games/*`).
2. **Qualidade Visual & Fantasia dos Jogos:**
   - Animais ainda utilizam círculos/elipses ou marcadores geométricos ao invés de ilustrações vetoriais ricas e distintas.
   - Falta animação fluida (idle motion, drop reactions, snap feedback, particulado leve) e identidades cenográficas vivas.
3. **Mecânicas de Interação & Progressão:**
   - Cada jogo precisa ter no mínimo 3 tipos de rounds com progressão representacional real (`concreto -> pictórico -> simbólico`).
   - O modelo adaptativo (`adaptive: true`) precisa reagir a erros consecutivos e sucessos independentes com assistência progressiva não-punitiva.
4. **Learning Engine 2.0:**
   - O `LearningEngine` precisa estar perfeitamente integrado no `AppStore` consumindo o histórico recente (`recentGameIds`) de sessões reais para priorizar diversidade de contexto, novidade e disponibilidade offline.
5. **Persistência de Missões (MissionHistory):**
   - O histórico de missões fora da tela precisa ser persistido por perfil no IndexedDB (Dexie) com migração versionada.
6. **Activity Engine:**
   - Integrar vertical slice de atividades pedagógicas diretamente na experiência do App.
7. **Acessibilidade e Usabilidade Infantil:**
   - Alvos de toque generosos (56-72px para botões gerais, 64-96px para alvos preschool).
   - Eliminação de qualquer jargão técnico visível no Child Mode.
8. **Cobertura E2E Semântica e QA Visual:**
   - 90 screenshots dedicados aos 10 jogos (phone, tablet, landscape).
   - 3 execuções consecutivas 100% verdes sem flakiness.

---

## 3. Próximo Passo
Iniciar a **Fase 1 (Product Audit Real)** e **Fase 2 (Game Audit Real)** para documentar a análise detalhada e gerar a especificação de Game Design 10/10.
