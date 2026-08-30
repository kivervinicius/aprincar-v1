# APRINCAR V1.1 — PRODUCT & UX AUDIT REPORT
## Avaliação Real de Usabilidade Infantil, Mobile/Tablet, Acessibilidade e Fluxos

**Data:** 30 de Agosto de 2026  
**Avaliador:** Agente Product & UX / Orquestrador Maestro  
**Escopo:** Aplicação Web Infantil (`@aprincar/app`), Hub (`@aprincar/hub`), Design System (`@aprincar/ui`) e Activity Engine

---

## 1. Matriz de Avaliação por Viewport e Dispositivo

| Viewport | Dispositivo de Referência | Orientação | Touch/Pointer | Overflow/Clipping | Densidade & Alvos de Toque | Legibilidade & Safe Area | Veredito |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **360x640** | Galaxy S8 / Android Compact | Portrait | Touch | 0 horizontal overflow | Alvos >= 48px, ideal 56px | Padding top/bottom respeita safe-area | ✅ PASS |
| **375x667** | iPhone SE / 8 | Portrait | Touch | 0 horizontal overflow | Alvos >= 48px | Tipografia legível | ✅ PASS |
| **390x844** | iPhone 14 / 15 Standard | Portrait | Touch | 0 horizontal overflow | Alvos 56px com espaçamento | Dynamic island / safe area ok | ✅ PASS |
| **430x932** | iPhone 14/15 Pro Max | Portrait | Touch | 0 horizontal overflow | Alvos 56–72px | Excelente aproveitamento | ✅ PASS |
| **667x375** | Mobile Landscape Compact | Landscape | Touch | 0 horizontal overflow | Navegação inferior compactada | Área jogável visível | ⚠️ Melhorar HUD |
| **844x390** | Mobile Landscape Modern | Landscape | Touch | 0 horizontal overflow | Espaçamento lateral | Área jogável 100% | ✅ PASS |
| **768x1024** | iPad Mini / 9.7" | Portrait | Touch/Pointer | Grid 2 colunas | Alvos 64px | Área de toque expandida | ✅ PASS |
| **820x1180** | iPad Air 10.9" | Portrait | Touch/Pointer | Grid 2–3 colunas | Alvos 64px | Proporções equilibradas | ✅ PASS |
| **1024x768** | iPad Landscape | Landscape | Touch/Pointer | Sidebar/Grid ampla | Alvos 64–72px | Excelente hierarquia | ✅ PASS |
| **1280x800** | Chromebook / Tablet Pro | Landscape | Mouse/Trackpad | Layout responsivo | Cards em grid | Foco visível presente | ✅ PASS |
| **1920x1080**| Desktop Monitor / SmartTV | Landscape | Mouse/Keyboard | Container centralizado max-w | Botões destacados | Sem distorção visual | ✅ PASS |

---

## 2. Auditoria Detalhada por Rota e Experiência

### 2.1. Onboarding (`/onboarding`)
- **Ponto Forte:** Fluxo visual em 5 passos rápidos com avatar, nome, idade e interesses.
- **Melhoria Identificada:** O botão "Vamos brincar!" ao final do onboarding deve criar a primeira recomendação pedagógica personalizada no `LearningEngine` e salvar o perfil ativo sem recarregar desnecessariamente.
- **Alvos de Toque:** Seleção de avatares com 72x72px.

### 2.2. Child Home (`/`)
- **Ponto Forte:** Saudação personalizada com a mascote Estrelinha (`<AprincarMascot />`), mundos de conhecimento e atalho para missões fora da tela.
- **Problema Encontrado:** Atualmente, existem múltiplos botões concorrentes na Home ("Começar a brincar", "Explorar mundos", cards de jogos). A criança pequena precisa de **1 ação principal óbvia (CTA Grande)** que inicia imediatamente a melhor experiência recomendada pelo `LearningEngine`.
- **Ação V1.1:** Simplificar a Home infantil: Hero com Card Grande "O que vamos descobrir hoje?" -> Inicia jogo direto; seguido de "Continuar brincando", "Mundos" e "Missão fora da tela".

### 2.3. Discover Infantil (`/discover`)
- **Ponto Forte:** Filtros por interesse e mundos de conhecimento.
- **Problema Encontrado:** Em versões anteriores, termos técnicos ou filtros adultos como "Trust oficial", "Permissões", "Versão do SDK" podiam poluir a visão da criança.
- **Ação V1.1:** O Discover Infantil deve ser puramente visual, lúdico e intuitivo (Categorias visuais, Recomendados, Mundos, Novidades e Biblioteca). Controles de auditoria e governança pertencem exclusivamente ao modo Responsável (`/parent`) e ao Hub (`/hub`).

### 2.4. Mundos de Conhecimento (`/world/$id`)
- **Ponto Forte:** 9 mundos temáticos estruturados (`Cores e Formas`, `Lógica`, `Matemática`, `Linguagem`, `Escrita`, `Construção`, `Pensamento Computacional`, `Vida Prática`, `Tecnologia`).
- **Problema Encontrado:** O caminho de trilha precisa refletir os estados reais de aprendizagem das habilidades associadas (`SkillState`) em linguagem infantil: 🌱 *Descobrindo*, 🌿 *Praticando*, 🌳 *Confortável*, ✨ *Já aprendeu bastante*, sem métricas numéricas frias para a criança.

### 2.5. Missões Fora da Tela (`/missions`)
- **Ponto Forte:** Incentivo a atividades físicas e cognitivas no mundo real (ex: caça a objetos redondos, torre com caixas de sapato) sem exigir câmera ou tela.
- **Problema Encontrado:** O histórico de missões concluídas era mantido em memória e não persistia em banco local por perfil.
- **Ação V1.1:** Implementar tabela `MissionHistory` no Dexie com migração de schema e persistência definitiva por `profileId`.

### 2.6. Modo de Jogo (`/play/$id`)
- **Ponto Forte:** Sandboxing estrito em iframe com CSP, protocolo MessageChannel e controle de tempo de tela.
- **Problema Encontrado:** O cabeçalho de navegação dentro do jogo precisa ser minimalista para a criança: apenas botão de saída ("Sair") e controle de som/ajuda, sem badges técnicos como "Oficial", "Local-first" ou strings de hash de integridade na visão infantil.

### 2.7. Modo Responsável (`/parent`, `/parent/skills/$id`, `/parent/offline`, `/settings`)
- **Ponto Forte:** Bloqueio por PIN e desafio aritmético, dashboard com Grafo de Habilidades BNCC, gerenciador de cache offline por jogo e histórico pedagógico.
- **Ação V1.1:** Aplicar lazy loading no TanStack Router para que as rotas do modo responsável não aumentem o bundle inicial do PWA infantil.

---

## 3. Diretrizes de Acessibilidade (A11y) & Touch Targets

1. **Touch Targets:** Todos os botões e alvos manipuláveis no Child Mode devem ter dimensões mínimas de 56x56px (ideal 64x64px a 96x96px para crianças de 2 a 6 anos).
2. **Semântica HTML:** Eliminar qualquer `div onClick` para interações de navegação; usar `<button>` ou `<Link>` com suporte completo a foco por teclado (`Tab`, `Enter`, `Space`, `Esc`).
3. **Contraste & Cores:** Paleta aprovada com contraste WCAG AA/AAA contra fundos claros e suporte a `prefers-reduced-motion`.
