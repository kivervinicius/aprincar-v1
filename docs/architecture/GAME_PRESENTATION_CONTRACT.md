# APRINCAR — GAME PRESENTATION CONTRACT
## Contrato Canônico de Execução, Viewport, Input e Ciclo de Vida dos Jogos

**Data:** 30 de Agosto de 2026  
**Status:** Canonical Standard (Obrigatório para jogos oficiais e da comunidade)

---

## 1. Princípio Fundamental

> **"A experiência interna dos jogos pode e deve ser diferente (mecânicas, fantasias, regras, arte). Mas o container, host e runtime visual devem ser estritamente padronizados."**

Nenhum jogo tem permissão para:
- Abrir maior que a viewport útil da aplicação;
- Invadir ou ficar atrás do header do GameRuntime;
- Sobrepor controles do sistema (ex: botão Sair ou Som);
- Gerar scroll duplo na página ou overflow horizontal;
- Modificar estilos globais do host (`document.body` externo);
- Forçar orientação do dispositivo de maneira silenciosa ou destrutiva;
- Depender de resoluções de desktop fixas que fiquem ilegíveis ou microscópicas no mobile/tablet.

---

## 2. Hierarquia de Apresentação e Enclausuramento

Todo jogo executa sob a seguinte árvore determinística:

```text
Platform App Host
  └─ <GameRuntime> (layout grid em 100dvh, gerenciamento de safe-area e header)
       ├─ <GameRuntimeHeader> (botões Sair, Som, título da atividade)
       └─ <GameViewport> (superfície contida, sem overflow)
            └─ <iframe> (sandbox isolado, 100% width/height)
                 └─ GameShell (html, body, #game em 100% w/h, touch-action balanceado)
                      └─ Game Engine Scene (Phaser / Three.js via createAprincarPhaserConfig)
```

---

## 3. Contrato de Viewport e Unidades

- **Dimensões do Iframe:** `width: 100%`, `height: 100%`, `border: 0`, `display: block`.
- **Dimensões do Container:** `overflow: hidden`, `min-height: 0`.
- **Unidades:** Utilizar `100dvh` / `100svh` com fallback para `100vh`. Respeito mandatório a `env(safe-area-inset-*)`.
- **Resolução Lógica vs Apresentação Física:**
  - Jogos Phaser operam com resolução base de design `960x640`.
  - Apresentação física governada pelo factory `createAprincarPhaserConfig` com `Phaser.Scale.FIT` e `Phaser.Scale.CENTER_BOTH`.
  - Limite de DPR (`Math.min(window.devicePixelRatio, 2)`) para garantir estabilidade térmica e fluidez de 60fps em dispositivos móveis.

---

## 4. Contrato de Input e Primitives Compartilhadas

1. **Detecção Robusta de Tap vs Drag (`TapOrDragController`):**
   - Rastreamento inicial com threshold lógico (8–12px).
   - Movimentos menores que o threshold disparam `onTap` no pointerup.
   - Movimentos que excedem o threshold ativam `onDrag` e suprimem o clique/tap.
2. **Targets Semânticos de Teste (`TestTargetRegistry`):**
   - O jogo expõe `window.__APRINCAR_GAME_STATE__` tipado com `targets: Array<GameTarget>`.
   - Kinds permitidos: `choice`, `toggle`, `drag-source`, `drop-zone`, `action`, `memory-card`, `stack-zone`, `paint-area`, `trace-area`, `three-object`.

---

## 5. Ciclo de Vida e Experiência do Usuário

- **Loading Padrão:** Apresentação unificada com Mascot Aprincar e título humanizado.
- **Tratamento de Erros:** Exibição amigável via `GameError` com opções de retry ou retorno, sem expor stack traces técnicos para a criança.
- **Saída Segura:** Diálogo suave `GameExitDialog` quando acionado pelo usuário ou via tecla `Escape`.
- **Evidências:** Toda conclusão ou exploração relevante submete evidência pedagógica ao host via `aprincar.evidence.submit()`.
