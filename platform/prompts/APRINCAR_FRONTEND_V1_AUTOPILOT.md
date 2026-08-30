# APRINCAR — FRONTEND V1 MOBILE-FIRST / OFFLINE-FIRST

## IMPLEMENTAÇÃO AUTÔNOMA BASEADA EM ESPECIFICAÇÃO

Você está trabalhando no projeto open source Aprincar.

Seu objetivo é reconstruir e finalizar todo o frontend da plataforma seguindo EXATAMENTE a especificação de produto/UX fornecida no repositório.

Não crie um novo produto. Não faça redesign livre. Não simplifique os fluxos. Não transforme o Child Mode em dashboard. Não substitua a arquitetura existente.

## Fontes de verdade

Prioridade:

1. `docs/product/PRODUCT_HANDOFF.md`
2. `docs/product/FRONTEND_V1_SPEC.md`
3. código/arquitetura atual do Aprincar

Se houver conflito, preserve o produto/pedagogia, depois a especificação de UX e por fim adapte a implementação técnica existente sem quebrar seus contratos.

## Objetivo final

Entregar o Aprincar como uma plataforma de aprendizagem lúdica:

```text
Criança
→ descobre
→ manipula
→ joga
→ realiza atividades
→ recebe feedback gentil
→ gera evidências

Evidence
→ Skill Graph
→ Progress Engine
→ recomendações futuras

Responsável
→ acompanha
→ entende habilidades
→ recebe sugestões
→ controla tempo/offline

Comunidade
→ adiciona games/activity packs
→ Registry
→ Aprincar
```

O Child Mode NÃO deve parecer um marketplace de jogos. O Hub é infraestrutura de conteúdo.

## Princípios obrigatórios

- mobile-first;
- prioridade celular → tablet → desktop;
- touch-first;
- mouse/teclado como equivalentes funcionais;
- nunca depender de hover;
- targets gerais mínimos de 48x48px;
- targets infantis preferenciais de 64–96px;
- portrait e landscape quando aplicável;
- safe-area iOS;
- PWA standalone;
- reduced motion;
- high contrast;
- offline-first.

## Offline-first

Garantir:

- App Shell offline;
- IndexedDB;
- perfis locais;
- SkillState local;
- Library local;
- Evidence local;
- progresso local;
- jogos explicitamente preparados offline;
- reload de rota interna offline;
- service worker;
- update seguro.

NÃO colocar todos os jogos no precache global.

Library != Offline Cache.

## Child Mode

Navegação mobile:

- Início
- Explorar
- Biblioteca
- Mais

Bottom navigation.

Parent Mode NÃO deve aparecer como destino infantil primário.

Home infantil:

- saudação;
- recomendação principal grande;
- continue explorando;
- mundos;
- missão fora da tela;
- poucas decisões por tela.

Não mostrar porcentagens, confidence, BNCC, Skill IDs, telemetria, ranking, moedas ou vidas.

## Mundos

Criar estrutura visual para:

- Cores e Formas
- Lógica
- Matemática
- Linguagem
- Escrita
- Construção
- Pensamento Computacional
- Vida Prática
- Tecnologia

Mundos são organização pedagógica. Jogos continuam extensões.

## Onboarding

Fluxo obrigatório:

```text
Boas-vindas
↓
Nome + Avatar
↓
Idade
↓
Habilidades observadas
↓
Interesses
↓
Tempo inicial opcional
↓
Child Home
```

Sem login obrigatório. Tudo persistido localmente.

## Game Runtime

Ao abrir uma extensão, a UI normal deve desaparecer.

Criar runtime dedicado com:

- ← Sair
- Aprincar
- Nome do jogo
- Trust discreto
- GameHost ocupando área principal

Sem bottom navigation, sidebar ou distrações.

Suportar portrait, landscape e adaptive.

## Tratamento do erro

Nunca usar “ERRADO”, ❌, “perdeu” ou vidas.

Preferir:

- “Quase.”
- “Tente de outro jeito.”
- “Vamos descobrir?”

Ajuda progressiva:

1. tentativa 1 → sem pista;
2. tentativa 2 → pista visual;
3. tentativa 3 → redução da complexidade;
4. tentativa 4 → demonstração parcial.

Nenhuma rodada pode ficar impossível de resolver.

## Parent Mode

Acesso protegido por PIN/adult gate.

Criar:

- visão geral;
- perfis;
- habilidades;
- atividades;
- timeline;
- tempo de uso;
- missões sugeridas;
- offline manager;
- configurações.

Estados:

- unknown
- exploring
- developing
- comfortable
- consolidated

Não usar nota escolar, ranking ou porcentagem como aprendizado.

## Skill Detail

Mostrar descrição humana, estado, jogos/atividades que geraram evidência e sugestão fora da tela.

Game != Skill.

## Missões fora da tela

Criar `MissionCard` e experiência de missões sem exigir câmera.

## Descobrir

Child Mode: recomendações, categorias, mundos, jogos e atividades.

Filtros avançados no modo adulto.

Trust:

- Official
- Curated
- Community
- Experimental

## Biblioteca

Separar “Salvo na biblioteca” de “Disponível offline”.

## Offline Manager

Parent Mode:

- espaço utilizado;
- jogos offline;
- disponíveis para download;
- remover download;
- atualizar;
- status.

## PWA

Implementar:

- Install Prompt contextual;
- Update Prompt;
- offline badge discreto;
- update nunca durante gameplay;
- standalone safe areas.

## Design System

Centralizar em `@aprincar/ui`.

Criar/revisar:

- Brand
- BrandMark
- ChildHeader
- BottomNavigation
- ChildHero
- WorldCard
- GameCard
- SkillCard
- MissionCard
- TouchButton
- TouchIconButton
- GameShelf
- Carousel
- OfflineBadge
- TrustBadge
- ProgressState
- ParentHeader
- ParentNavigation
- LoadingState
- EmptyState
- OfflineState
- ErrorState
- InstallPrompt
- UpdatePrompt
- AvatarPicker
- AgePicker
- InterestPicker
- SkillProgress
- SkillEvidenceList
- GameRuntime
- GameRuntimeHeader
- OrientationHint
- GameLoading
- GameError
- GameExitDialog

## Design tokens

Centralizar spacing, radius, touch targets, typography, surfaces, elevation, motion, safe area e states.

Não espalhar números mágicos.

## Responsividade obrigatória

Validar:

```text
360x640
390x844
430x932
768x1024
834x1194
1024x1366
1280x800
1440x900
1920x1080
```

Além de tablet landscape.

## Performance

Bundle inicial NÃO pode carregar Phaser, Three.js, todos os games ou Parent Mode inteiro.

Usar lazy loading, route splitting e dynamic imports.

## Acessibilidade

Garantir ARIA, focus visible, keyboard, screen reader no Parent Mode, reduced motion, contraste, touch targets, font scaling e não depender apenas de cor.

## Arquitetura

Preservar:

```text
App
→ ExtensionManager
→ GameHost
→ iframe sandbox
→ SDK
→ Evidence
→ Progress
```

NÃO importar games diretamente no React App.

NÃO permitir Game alterar SkillState diretamente.

NÃO permitir Game declarar BNCC diretamente.

Fluxo curricular obrigatório:

```text
Game
→ Aprincar Skill
→ Curriculum Mapping
→ BNCC
```

## Activity Engine

Preparar arquitetura para:

```text
extension:game
extension:activity-pack
```

Criar contrato e vertical slice inicial para Activity Engine se ainda não existir.

Tipos futuros:

- sorting
- matching
- sequencing
- counting
- tracing
- drag-and-drop
- construction
- maze
- keyboard
- programming

## Testes obrigatórios

Não considerar tela pronta porque compila.

Criar testes de:

- onboarding;
- child home;
- mundos;
- discovery;
- library;
- parent;
- offline manager;
- game runtime;
- PWA;
- update;
- touch;
- responsive;
- keyboard;
- reduced motion.

Playwright obrigatório.

## Visual regression

Gerar screenshots em `_validation/screenshots/`:

- mobile-home.png
- mobile-discover.png
- mobile-library.png
- mobile-world.png
- tablet-home.png
- tablet-world.png
- tablet-game.png
- parent-mobile.png
- parent-tablet.png
- parent-desktop.png
- offline-manager.png
- onboarding.png

## Critério de aceite final

Executar esta jornada offline:

```text
abrir PWA
→ selecionar criança
→ Home
→ abrir Mundo
→ abrir jogo offline
→ errar
→ recuperar
→ acertar
→ gerar Evidence
→ voltar
→ Biblioteca
→ Parent Mode
→ ver Skill
```

Tudo deve funcionar sem backend.

## Metodologia

Trabalhe em AUTOPILOT.

Use TDD.

Para cada etapa:

1. reproduzir estado;
2. escrever teste;
3. implementar;
4. verificar;
5. executar regressão;
6. screenshot;
7. avançar.

Não usar `@ts-ignore`, `@ts-nocheck`, `skip`, `eslint-disable` global, casts indiscriminados ou remoção de teste.

## Fases

1. Design System + App Shell
2. Onboarding
3. Child Home
4. Worlds
5. Discover
6. Library
7. Game Runtime
8. Parent Mode
9. Offline Manager
10. PWA/install/update
11. Accessibility
12. Performance/code splitting
13. Responsive QA
14. E2E
15. Production build

## Entrega final

Criar:

```text
_validation/frontend-final-report.md
```

O relatório deve cobrir:

- telas implementadas;
- componentes;
- rotas;
- responsividade;
- dispositivos;
- touch QA;
- desktop QA;
- accessibility;
- offline;
- PWA;
- performance;
- E2E;
- screenshots;
- P0;
- P1;
- P2.

Só declarar GO se:

- TypeScript PASS
- Lint PASS
- Tests PASS
- Build PASS
- E2E PASS
- Mobile PASS
- Tablet PASS
- Desktop PASS
- Offline PASS
- PWA PASS
- Accessibility PASS

Se existir P0/P1, corrigir antes de finalizar. Não apenas relatar problemas: corrigir automaticamente.
