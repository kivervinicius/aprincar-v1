# APRINCAR — REPOSITORY SOURCE OF TRUTH & SYNC STRATEGY
## Arquitetura de Monorepo Canônico e Espelhamento Público de Componentes

**Data:** 30 de Agosto de 2026  
**Status:** Canonical Monorepo Strategy (Aprovado)

---

## 1. Definição do Source of Truth

- **Repositório Canônico de Desenvolvimento:**
  `https://github.com/kivervinicius/aprincar-v1.git`
  - Toda a engenharia de produto, desenvolvimento de jogos, motores pedagógicos, testes E2E e releases ocorrem primeiramente neste repositório.
  - Árvore de diretórios canônica:
    - `/platform` -> Aplicação PWA, Hub, UI Design System, Activity Engine e Testes E2E.
    - `/games-official` -> Fonte oficial dos 10 jogos em Phaser e Three.js, scripts de empacotamento e assets.
    - `/community-games` -> Sandbox de validação para jogos da comunidade.
    - `/curriculum-bncc` -> Grafo de 46 habilidades pedagógicas e matriz de correlação BNCC.
    - `/game-template-*` -> Templates de desenvolvimento para a comunidade (Vite, React, Phaser, Three.js).
    - `/docs` & `/DEV` -> Memória operacional, especificações de produto e auditorias.

- **Organização de Componentes e Releases Públicas:**
  `https://github.com/orgs/aprincar/repositories`
  - Os 9 repositórios da organização `aprincar/*` atuam como **espelhos públicos e pontos de distribuição de componentes open-source**.
  - O fluxo de publicação segue uma exportação automatizada e auditada por scripts, garantindo que nenhuma alteração manual divergente ocorra diretamente nas réplicas.

---

## 2. Estratégia de Sincronização Automatizada

Para sincronizar o código canônico com os repositórios da organização:
1. **Script Automatizado (`scripts/sync-official-games.mjs`):**
   - Compara arquivos entre o workspace canônico e o repositório destino.
   - Sincroniza apenas as alterações canônicas preservando os metadados do repositório `.git` e `.github` específicos de cada um.
2. **Gates de Validação no Destino:**
   - Cada repositório destino executa sua suíte de testes (`npm test`, `npm run check`, etc.) antes da abertura de Pull Request.
3. **Governança via Pull Request:**
   - Criação de PRs com branches rastreáveis (ex: `sync/v1.1-update`).
   - CI verde obrigatório antes de merge na branch `main` protegida.
