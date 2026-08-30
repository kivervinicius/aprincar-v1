# Aprincar — GitHub Production Settings & Governance Checklist

Este documento define a configuração canônica de governança, proteção e conformidade para todos os repositórios da organização **@aprincar**.

---

## 1. Template Repositories (Modelos de Extensão)

Os repositórios de template de jogos devem ser marcados explicitamente no GitHub como **Template Repository** (`Settings -> General -> Template repository`):

- [x] `aprincar/game-template-vite`
- [x] `aprincar/game-template-react`
- [x] `aprincar/game-template-phaser`
- [x] `aprincar/game-template-threejs`

**Objetivo:** Permitir que desenvolvedores da comunidade cliquem em *"Use this template"* e gerem um repositório isolado já pronto para empacotamento em bundle único HTML com CSP e protocolo SDK v1.

---

## 2. Branch Protection & Rulesets para `main`

Para todos os repositórios da organização (`platform`, `games-official`, `community-games`, `curriculum-bncc`, `game-template-*`, `.github`), configurar Ruleset ou Branch Protection na branch padrão (`main`):

### 2.1. Bloqueios Obrigatórios
- **Block Force Push (`allow_force_pushes: false`)**: Proíbe estritamente `git push --force` ou reescrita de histórico em `main`.
- **Block Deletion (`allow_deletions: false`)**: Proíbe a exclusão da branch `main`.
- **Require Pull Request before merging (`required_pull_request_reviews`)**:
  - Pelo menos 1 aprovação de code review.
  - Dismiss stale pull request approvals when new commits are pushed.
  - Require review from Code Owners (quando aplicável).

### 2.2. Required Status Checks (Verificações Obrigatórias de CI)
Nenhum PR pode sofrer merge sem que todos os seguintes checks estejam verdes:

- **`aprincar/platform`**:
  - `check-and-test` (TypeScript Typecheck, Lint, Core Unit Tests, PWA build, Snapshot validation)
  - `e2e` (Playwright Test Suite across all 10 viewports)
  - `verify-boundaries` (Architecture and package isolation)
- **`aprincar/games-official`**:
  - `test-and-validate` (Runtime test, Syntax check, Manifest validation, SHA-256 integrity, Registry build)
- **`aprincar/community-games`**:
  - `validate-community-games`
- **`aprincar/curriculum-bncc`**:
  - `validate-curriculum` (Catalog & Skill Snapshot consistency)
- **`aprincar/game-template-*`**:
  - `test-build-package-validate` (Single HTML build, manifest, SDK compliance)

---

## 3. GitHub Pages Settings

No repositório `aprincar/platform`:
- **Source:** Deploy from a branch (`gh-pages` ou GitHub Actions `deploy-pages`).
- **Custom Domain:** Opcional (se configurado, forçar HTTPS).
- **Paths de Produção:**
  - Base: `/platform/`
  - App Shell: `/platform/app/`
  - Hub: `/platform/hub/`
  - Fallback 404 SPA ativo para rotas do TanStack Router.

---

## 4. Dependabot Strategy

- **Patches & Minors:** Agrupamento automático permitido para dependências utilitárias de build/test.
- **Majors:** PRs individuais com verificação rigorosa de regressão antes do merge. Proibido merge em lote de majors sem revisão arquitetural.

---

## 5. Security & Vulnerability Scanning

- **Secret Scanning:** Habilitado em toda a organização.
- **Dependabot Alerts & Security Updates:** Habilitado.
- **Auditoria de dependências:** `npm audit --audit-level=high` obrigatório em todos os pipelines de CI.
