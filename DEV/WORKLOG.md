# Aprincar DEV Worklog

## [2026-08-30] Estabilização Evidence/Progress e auditoria mestre

- O runtime Phaser passou a publicar `inputReady` somente depois de persistir a tentativa e liberar nova interação; o E2E de gameplay espera esse contrato.
- Artefatos oficiais foram regenerados e sincronizados em App e Hub.
- Verificação: teste de gameplay passou 3/3, Playwright 28/28 e `./validate-production.sh` sem flags de skip.
- Auditoria mestre atualizada para `CONDITIONAL GO`; resta apenas confirmar controles remotos de GitHub antes de promoção pública.

## [2026-08-30] Reformulação Completa do Frontend V1 Mobile-First & Offline-First

### Objetivos Concluídos:
1. **Identidade Visual e Design System (@aprincar/ui):**
   - Paleta de cores oficial implementada (`#2563EB`, `#FBBF24`, `#FB923C`, `#22C55E`, `#F43F5E`, `#8B5CF6`, `#0F172A`, `#F7F6F2`, `#FFFFFF`).
   - Mascote Estrelinha com mochila, lápis e tênis desenhada em SVG vetorial responsivo (`<AprincarMascot />`).
   - Tipografia arredondada `Nunito Rounded` / `ui-rounded`.
   - Componentes de UI com alvos de toque mínimos de 48px e suporte a `safe-area-inset`.
2. **Motor de Atividades (@aprincar/activity-engine):**
   - Implementado pacote modular para atividades pedagógicas com assistência progressiva (dica visual, redução de complexidade, demonstração) e avaliação determinística sem punição.
3. **9 Mundos de Descoberta e Missões Fora da Tela:**
   - 9 mundos mapeados em `worlds.ts` (*Cores e Formas*, *Lógica*, *Matemática*, *Linguagem*, *Escrita*, *Construção*, *Pensamento Computacional*, *Vida Prática*, *Tecnologia*).
   - Trilha visual de progresso contínuo e missões físicas no mundo real sem uso de câmera.
4. **Arquitetura de Navegação & Páginas da Aplicação:**
   - Barra de navegação inferior mobile de 4 itens (`Início`, `Descobrir`, `Biblioteca`, `Mais`).
   - Isolamento e proteção do modo responsável por PIN e desafio aritmético.
   - Páginas completas: `Home`, `Discover`, `Library`, `WorldDetail`, `Missions`, `More`, `Play` (Runtime dedicado com diálogo de saída), `Parent` (Dashboard com Grafo de Habilidades, Perfis, Histórico e Tempo de Tela), `ParentSkillDetail`, `ParentOffline` e `Settings`.
5. **Validação e Testes:**
   - 32 Testes unitários do core e activity engine aprovados.
   - 28 Testes E2E do Playwright aprovados em múltiplos viewports (mobile, tablet, desktop).
   - 12 Screenshots de validação gerados em `platform/_validation/screenshots/`.
   - `npm run check:production` executado com 100% de sucesso.
