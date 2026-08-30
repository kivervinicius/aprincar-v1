# Aprincar Frontend V1 — Product + UX + UI Specification

## 1. Objetivo do frontend

O Aprincar deve parecer, para a criança:

> “um lugar onde eu entro para descobrir, brincar, construir e experimentar.”

E não:

> “um aplicativo onde eu entro para fazer exercícios.”

Para o responsável, deve parecer:

> “um espaço onde consigo entender o que a criança está explorando, sem transformar isso em boletim.”

Para a comunidade:

> “uma plataforma aberta onde novas experiências podem ser adicionadas sem reconstruir o produto.”

A arquitetura visual deve suportar Skill Graph, Activity/Game Engine, Learning Engine futuro, Content Packs, Child Mode, Parent Mode e atividades fora da tela.

## 2. Princípios obrigatórios de experiência

1. Mobile first.
2. Tablet como experiência premium/principal.
3. Desktop totalmente funcional, mas secundário.
4. Touch como método principal de interação.
5. Mouse/teclado como equivalentes funcionais.
6. Offline-first.
7. PWA instalável.
8. Pouca dependência de leitura no Child Mode.
9. Nada de anúncios.
10. Nada de vidas.
11. Nada de ranking.
12. Nada de moeda artificial.
13. Nada de “ERRADO!”.
14. Erros sempre recuperáveis.
15. A criança nunca deve ficar presa em uma fase.
16. Recompensa deve representar descoberta, não vício.
17. Progressão pedagógica não pode depender apenas de pontuação.
18. Toda ação importante deve poder ser executada com um dedo.
19. Não depender de hover.
20. O aplicativo precisa permanecer utilizável com Internet completamente desligada.

## 3. Dispositivos-alvo

### Prioridade 1 — celular

```text
360 × 640
375 × 667
390 × 844
393 × 852
430 × 932
```

Interface predominantemente vertical.

### Prioridade 2 — tablet

```text
768 × 1024
800 × 1280
834 × 1194
1024 × 1366
```

Tanto portrait quanto landscape. Para atividades educacionais, tablet landscape deve receber atenção especial.

### Prioridade 3 — desktop

```text
1280+
1440+
1920+
```

Não deve simplesmente ampliar o mobile. Utilizar `max-content-width ≈ 1200–1360px` e preservar tamanho confortável dos elementos.

## 4. Breakpoints sugeridos

A origem do design é mobile.

```text
base      0–479
sm        480+
md        768+
lg        1024+
xl        1280+
```

Preferir grid fluido e container queries quando apropriado.

## 5. Ergonomia touch

Nenhum controle infantil importante abaixo de `48 × 48px`.

Preferencial geral: `56–72px`.

Jogos para crianças pequenas: `64–96px`.

Espaçamento mínimo entre ações: `8px`. Ideal em Child Mode: `12–16px`.

## 6. Sistema visual

Base sugerida:

```text
Background #F7F6F2
Surface    #FFFFFF
Text       #242523
Muted      #6F716D
```

Cores de personalidade entram principalmente em ilustrações, categorias, estados, objetos interativos, marca e mundos.

Evitar fundo inteiro extremamente saturado.

## 7. Tipografia

Priorizar fonte arredondada extremamente legível.

Sugestão: Nunito Sans / Nunito.

Fallback: Inter, system-ui, sans-serif.

Child Mode:

```text
títulos        28–42px mobile
ações          18–22px
texto          16–20px
```

Parent Mode pode ser mais compacto.

## 8. Estrutura principal da aplicação

```text
Aprincar
│
├── Child Mode
│   ├── Início
│   ├── Descobrir
│   ├── Minha Biblioteca
│   ├── Mundos
│   ├── Missões
│   └── Game / Activity Runtime
│
├── Parent Mode
│   ├── Visão geral
│   ├── Crianças
│   ├── Habilidades
│   ├── Atividades
│   ├── Tempo
│   ├── Sugestões
│   ├── Offline
│   └── Configurações
│
└── System
    ├── Onboarding
    ├── Perfil
    ├── Offline Manager
    ├── Install PWA
    ├── Update
    └── Accessibility
```

## 9. Navegação principal — Child Mode

Mobile:

```text
┌─────────────────────────┐
│ Aprincar        🦕 Luna │
│                         │
│       CONTEÚDO          │
│                         │
├─────────────────────────┤
│ 🏠    🧭    🎒    ⋯    │
│ Início Explorar Biblioteca
└─────────────────────────┘
```

Máximo de 4 destinos principais:

- Início
- Explorar
- Biblioteca
- Mais

Parent Mode não deve aparecer diretamente na navegação infantil.

## 10. Tablet

Tablet permite logo + perfil, conteúdo amplo e bottom navigation; ou em landscape uma mini rail lateral com grande área interativa. Não transformar em dashboard.

## 11. Desktop

Pode usar top navigation com Início, Descobrir, Biblioteca e Missões, além de Perfil/Responsável. Child Mode continua visual e simples.

## 12. Onboarding

Não pedir conta.

Fluxo:

```text
1 Nome
2 Avatar
3 Idade
4 O que já consegue fazer
5 O que gosta
6 Tempo opcional
→ pronto
```

Nome + Avatar podem ocupar a mesma etapa.

## 13. Tela 1 — boas-vindas

```text
         personagem Aprincar

       Vamos aprincar?

Aprender acontece brincando.

        [ Começar ]
```

Texto adulto discreto:

> Sem cadastro obrigatório. Os dados ficam neste dispositivo.

## 14. Perfil infantil

```text
Como vamos te chamar?

[ Luna                  ]

Escolha um amigo:

🦊  🦕  🐼
🐯  🐸  🐙
```

Não usar foto real da criança por padrão.

## 15. Idade

Evitar select tradicional. Usar opções de toque grandes.

A idade é orientação, não bloqueio rígido.

## 16. Habilidades iniciais

Responsável responde. Exemplo:

- 🧩 Encontra coisas iguais
- 🌈 Reconhece cores
- 🔢 Conta alguns objetos
- 🔤 Reconhece letras
- ✏️ Desenha/escreve

Explicação: “Não é uma avaliação. Isso só ajuda o Aprincar a começar de um lugar confortável.”

## 17. Interesses

Exemplos:

- 🦕 Animais
- 🚗 Carros
- 🚀 Espaço
- 🎨 Desenho
- 🎵 Música
- 🧩 Desafios
- 🏗 Construção

Interesses influenciam tema, não habilidade.

## 18. Home infantil

Não mostrar dezenas de jogos.

Estrutura:

```text
Olá, Luna! 👋

O que vamos descobrir hoje?

┌─────────────────────────┐
│      EXPERIÊNCIA        │
│   recomendada grande    │
│                         │
│      [ Brincar ]        │
└─────────────────────────┘

Continue explorando
[ game ] [ game ] [ game ]

Mundos
🌈 🧩 🔢 🔤 🏗 🤖

Missão fora da tela
🔎 Encontre 3 coisas vermelhas
```

## 19. Card recomendado principal

Não mostrar Skill %, difficulty ou BNCC para a criança.

Mostrar linguagem humana e CTA grande.

## 20. Mundos

Mundos iniciais:

- 🌈 Cores e Formas
- 🧩 Lógica
- 🔢 Matemática
- 🔤 Linguagem
- ✍️ Escrita
- 🏗 Construção
- 🤖 Robôs
- 🏠 Vida Prática
- ⌨️ Tecnologia

Cada mundo deve ter identidade visual própria.

## 21. Tela Mundo

Exemplo:

```text
←

🔢 Mundo dos Números

Vamos brincar com quantidades,
contagens e pequenos desafios.

Seu caminho
●━━●━━○━━○

Comece daqui
[ Conte os bichos ]

Outras brincadeiras
[ fruta ] [ blocos ] [ formas ]
```

Não usar porcentagem concluída.

## 22. Skill visual para criança

Representar sem porcentagens:

- 🌱 Descobrindo
- 🌿 Praticando
- 🌳 Confortável
- ✨ Já sabe muito bem

## 23. Biblioteca

Biblioteca significa experiências escolhidas pela família. Não significa necessariamente offline.

Separar “Salvo na biblioteca” de “Disponível offline”.

## 24. Descobrir

Mobile:

```text
Descobrir

[ 🔎 Buscar brincadeira ]

Para sua idade
[ cards horizontais ]

Números
[ cards ]

Letras
[ cards ]

Criatividade
[ cards ]

Todos
```

## 25. Filtros

Adulto: idade, mundo, skill, offline, oficial, curado, comunidade.

Criança: quase nenhum filtro.

## 26. Trust das extensões

Comunicar discretamente:

- ✓ Aprincar
- ✓ Curado
- 🌱 Comunidade
- 🧪 Experimental

Detalhes completos ficam disponíveis ao adulto.

## 27. Game / Activity Runtime

Ao abrir uma experiência, a aplicação normal desaparece.

```text
┌───────────────────────────┐
│ ← sair          Aprincar  │
├───────────────────────────┤
│                           │
│        ATIVIDADE          │
│                           │
└───────────────────────────┘
```

Sem bottom navigation, sidebar ou distrações.

## 28. Orientação de tela

Runtime pode declarar `portrait`, `landscape` ou `adaptive`. Se necessário, orientar a rotação sem bloquear quando houver alternativa responsiva.

## 29. Feedback infantil

Correto: “✨ Isso!” ou animação.

Incorreto: “Quase. Tente de outro jeito.”

Nunca “❌ ERRADO”.

## 30. Sistema de ajuda

Progressivo:

- tentativa 1: nenhuma pista;
- tentativa 2: objeto correto reage levemente;
- tentativa 3: redução de complexidade;
- tentativa 4: demonstração parcial.

Não entregar a resposta instantaneamente.

## 31. Concreto → visual → abstrato

A UX deve suportar explicitamente os três níveis de representação e deixar o engine decidir a progressão.

## 32. Missões fora da tela

Exemplo:

```text
🏠 Uma missão de verdade!

Encontre três coisas
vermelhas perto de você.

[ Fizemos! ]
[ Outra missão ]
```

Sem câmera obrigatória.

## 33. Parent Mode

Acesso protegido por PIN ou adult gate.

Mobile:

```text
Responsável

Luna ▼

Hoje
────────────────

⏱ 22 min brincando

🌱 Explorando
5 habilidades

🌿 Desenvolvendo
3 habilidades

✨ Confortável
2 habilidades
```

## 34. Parent Home

Mostrar resumo, habilidades, sugestões práticas e progresso em linguagem humana.

## 35. Habilidades

Usar hierarquia/accordion, não árvore técnica gigante.

## 36. Detalhe da skill

Exemplo:

```text
Contar até 5

🌿 Desenvolvendo

Luna consegue contar pequenas
coleções de objetos com boa
consistência.

Foi observada em:
- Conte os Bichos
- Cesta de Frutas
- Torre de Blocos

Tente fora da tela:
Separe 5 carrinhos juntos.
```

Game != Skill.

## 37. Não usar nota

Nunca nota, porcentagem como domínio, ranking ou classificação competitiva.

Usar estados pedagógicos.

## 38. Timeline

Mostrar atividades e skills trabalhadas, sem telemetria excessiva.

## 39. Controle de tela

Permitir limite diário opcional e, ao atingir o limite, sugerir descanso e brincadeira fora da tela.

## 40. Offline Manager

Tela própria para espaço usado, jogos disponíveis offline, download, remoção e atualização.

Não remover da biblioteca automaticamente.

## 41. Estado sem Internet

Mensagem humana: “Tudo bem. Você pode continuar brincando com o que já está neste dispositivo.”

## 42. Primeiro uso offline

App shell abre mesmo sem jogos; explicar que ainda não há brincadeiras baixadas.

## 43. Instalação PWA

Prompt contextual, não agressivo, depois de algum uso.

## 44. Atualizações

Nunca atualizar no meio de um jogo. Mostrar atualização disponível em momento seguro.

## 45. Estados obrigatórios

Todo componente deve considerar:

- loading
- empty
- offline
- error
- disabled
- success
- stale
- updating

## 46. Loading infantil

Usar animação Aprincar suave e texto “Preparando a brincadeira…”.

## 47. Empty states

Devem orientar a próxima ação de forma lúdica.

## 48. Acessibilidade

Obrigatório:

- WCAG;
- contraste;
- focus visible;
- reduced motion;
- teclado;
- leitor de tela no Parent Mode;
- aria labels;
- não depender só de cor;
- áudio opcional;
- legendas;
- tamanho de fonte escalável.

## 49. Reduced Motion

Usar `prefers-reduced-motion` para reduzir/remover bouncing constante, partículas, parallax e animações complexas.

## 50. Desktop / teclado

Todos os elementos touch devem permitir Tab, Enter, Space, Arrow Keys e Esc quando aplicável.

## 51. Gestos

Permitidos: tap, drag, swipe, pinch e draw. Não usar gesto escondido para função essencial.

## 52. Componentes-base em `@aprincar/ui`

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
- Carousel
- GameShelf
- OfflineBadge
- TrustBadge
- ProgressState
- ParentHeader
- ParentNavigation
- EmptyState
- OfflineState
- ErrorState
- LoadingState
- InstallPrompt
- UpdatePrompt
- AvatarPicker
- AgePicker
- InterestPicker
- SkillProgress
- SkillEvidenceList

## 53. Componentes do runtime

- GameRuntime
- GameRuntimeHeader
- GameHostContainer
- OrientationHint
- GameLoading
- GameError
- GameExitDialog

## 54. Design tokens

Centralizar spacing, radius, touch targets, typography, surfaces, elevation, motion, safe areas e states.

Não espalhar números mágicos nos componentes.

## 55. Estados pedagógicos

- unknown
- exploring
- developing
- comfortable
- consolidated

Não mapear simplesmente vermelho = ruim / verde = bom.

## 56. Arquitetura frontend recomendada

```text
apps/app
├── features/
│   ├── onboarding
│   ├── child-home
│   ├── discovery
│   ├── library
│   ├── worlds
│   ├── missions
│   ├── parent
│   ├── offline
│   └── settings
├── routes/
├── shell/
└── app.tsx
```

Packages:

```text
packages/
├── ui
├── storage
├── extension-host
├── extension-sdk
├── extension-manager
├── skill-graph
├── progress-engine
├── reward-engine
├── learning-engine
├── activity-engine
└── accessibility
```

## 57. Dados locais

IndexedDB.

Entidades:

- Profile
- ProfilePreferences
- LibraryEntry
- OfflineExtension
- GameSession
- Evidence
- SkillState
- RewardEvent
- MissionHistory
- GameState
- AppSettings

## 58. Frontend nunca calcula mastery sozinho

Fluxo obrigatório:

```text
Game
 ↓
Evidence
 ↓
Progress Engine
 ↓
SkillState
 ↓
UI
```

Nunca Game → “skill complete”.

## 59. Learning Engine

Frontend recebe recomendação e mostra linguagem humana, sem expor confidence/difficulty técnica à criança.

## 60. Activity Engine + jogos independentes

Suportar conceitualmente:

```text
Extension
├── game
└── activity-pack
```

Um game pode ser próprio em Phaser/Three. Atividades simples podem ser declarativas.

## 61. Busca do adulto

Buscar por temas, skills, mundos, games e activities.

## 62. Futuro — trilha por objetivo

A UI deve permitir evolução futura para objetivos definidos por adulto sem implementar backend obrigatório agora.

## 63. Privacidade

Child Mode não deve exibir email, nome completo, escola, IDs ou analytics. Sincronização futura deve ser opcional.

## 64. Autenticação futura

```text
Guest/local
     ↓
Optional account
     ↓
Sync
```

Login nunca deve quebrar o modo local.

## 65. Performance

Meta de App shell gzip abaixo de 200–250 KB idealmente.

Não carregar Phaser, Three.js ou todos os jogos no bundle principal.

## 66. Lazy loading

Usar lazy loading/route splitting, especialmente para Parent Mode, Hub, 3D e Authoring.

## 67. Imagens

Preferir SVG, WebP e AVIF. Usar `srcset`/`sizes` quando aplicável.

## 68. Áudio

Web Audio com som on/off, volume, narração e efeitos. Preferências herdáveis pelos jogos via SDK.

## 69. Haptics

Suave e opcional; nunca agressivo.

## 70. Responsividade dos cards

Mobile: 1.3–1.5 cards visíveis horizontalmente.

Tablet: 2.5–4.

Desktop: 4–5.

## 71. Scroll

Child Mode: scroll vertical + shelves horizontais.

## 72. Header mobile

Logo + perfil, aproximadamente 64px, sem menus grandes.

## 73. Safe areas

Usar `env(safe-area-inset-top)` e `env(safe-area-inset-bottom)`.

## 74. Landscape mobile

Runtime full viewport, navegação compacta/oculta.

## 75. Parent gating

PIN ou adult gate claro, evitando acesso infantil acidental.

## 76. Segurança da comunidade no frontend

Conteúdo Community/Experimental deve mostrar publisher/trust/permissões ao adulto. Permissões sensíveis exigem confirmação explícita.

## 77. Game detail

Para criança: título, mundo/faixa sugerida e CTA.

Para adulto: skills, trust, offline, permissions, publisher e version.

## 78. BNCC

Não mostrar BNCC no Child Mode. Parent Mode pode mostrar referências curriculares como “apoia”, nunca como domínio escolar completo.

## 79. Copywriting infantil

Frases curtas e concretas.

## 80. Copywriting adulto

Mais preciso e pedagógico, sem transformar em boletim.

## 81. Rotas sugeridas

```text
/
/onboarding
/discover
/library
/world/:id
/missions
/play/:extensionId
/parent
/parent/profile/:id
/parent/skills
/parent/skills/:skillId
/parent/activity
/parent/offline
/parent/settings
/settings
```

## 82. Hierarquia do produto

```text
              EXPERIÊNCIA DA CRIANÇA
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
      Games        Activities      Missions
        │              │              │
        └──────────────┴──────────────┘
                       │
                    Evidence
                       │
                  Skill Graph
                       │
                 Progress Engine
                       │
                 Learning Engine
                       │
                próxima descoberta
```

## 83. Mudança conceitual do produto

Antes: Hub → escolher jogo → jogar.

Agora: perfil → recomendação → mundo/habilidade → experiência (game/activity/missão) → Evidence → Skill Graph → próxima descoberta.

O Hub continua existindo como infraestrutura de conteúdo, não como metáfora principal do Child Mode.

## 84. Hierarquia de implementação

1. Shell: PWA, tokens, Brand, responsive container, bottom navigation, offline state e App/Parent shells.
2. Perfil: onboarding, seleção, avatar e preferências.
3. Child Mode: Home, Mundo, Descobrir, Biblioteca e Missões.
4. Runtime: GameRuntime, GameHost, orientação, loading, erro, saída e permission gate.
5. Parent Mode: resumo, skills, timeline, sugestões, tempo e offline.
6. Engines: SkillState UI, recommendations e Activity Engine.
7. Qualidade: PWA offline real, responsive QA, touch QA, keyboard QA, accessibility e visual regression.

## 85. Critério de aceite de cada tela

Validar:

```text
320–430px mobile
768px tablet
1024px tablet
1280+ desktop
portrait
landscape quando aplicável
touch
mouse
keyboard
offline
online
loading
empty
error
high contrast
reduced motion
```

## 86. Critério de aceite do produto

Jornada obrigatória sem Internet:

```text
abrir PWA
→ selecionar criança
→ Home
→ abrir Mundo
→ abrir jogo baixado
→ jogar
→ errar
→ recuperar
→ acertar
→ Evidence
→ SkillState
→ voltar
→ Biblioteca
→ Parent Mode
→ ver habilidade
```

Tudo sem backend, sem refresh quebrando estado e sem dependência de Internet.
