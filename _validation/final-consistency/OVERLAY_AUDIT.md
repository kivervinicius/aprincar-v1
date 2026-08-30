# APRINCAR — OVERLAY & Z-INDEX CONTRACT AUDIT

**Data:** 30 de Agosto de 2026  
**Auditoria de Telas:** Mobile (390px/430px), Tablet (768px/820px), Desktop (1280px+)

---

## 1. Escala Oficial de Z-Index Contratual

| Token | Valor Numérico | Finalidade |
|---|---|---|
| `--ap-z-base` | `0` | Conteúdo comum, cards, ilustrações |
| `--ap-z-content` | `1` | Elementos de destaque em fluxo |
| `--ap-z-sticky` | `2` | Headers de navegação, GameRuntimeHeader |
| `--ap-z-nav` | `10` | Bottom Navigation infantil, barras fixas |
| `--ap-z-runtime` | `20` | Superfície do container de jogos |
| `--ap-z-modal` | `100` | Diálogos modais (ExitDialog, Parental Gate) |
| `--ap-z-toast` | `200` | Toasts, alertas e notificações flutuantes |

---

## 2. Diagnóstico e Resolução de Conflitos de Layout

1. **Sobreposição do Botão Sair no GameRuntime:**
   - **Causa Raiz Anterior:** Headers com position absolute e canvas sem restrição no iframe.
   - **Correção Definitiva:** `GameRuntime` utiliza `display: grid` com `grid-template-rows: auto minmax(0, 1fr)`. O header (`min-height: 64px`, `z-index: 2`) fica no topo sem colidir com a área do jogo (`.game-surface`), que ocupa exatamente o espaço restante com `overflow: hidden`.
2. **Double Scroll no Iframe:**
   - **Correção Definitiva:** `html, body, #game { width: 100%; height: 100%; margin: 0; overflow: hidden; overscroll-behavior: none; }` em todos os shells internos dos 10 jogos.
3. **Safe-Area Insets em Notches e Gestos:**
   - **Correção Definitiva:** Aplicado `max(9px, env(safe-area-inset-top))` e `env(safe-area-inset-bottom)` nos contêineres e headers do App Shell e GameRuntime.
