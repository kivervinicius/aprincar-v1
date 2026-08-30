# Começando

## Pré-requisitos

- Node.js 22 ou superior.
- npm 10 ou superior.
- Git.
- Chromium/Firefox/WebKit quando for executar E2E; o projeto usa Playwright.

## Clonar os repositórios

```bash
git clone https://github.com/aprincar/platform.git
git clone https://github.com/aprincar/games-official.git
git clone https://github.com/aprincar/community-games.git
git clone https://github.com/aprincar/curriculum-bncc.git
```

Os quatro templates podem ser clonados quando você for criar um jogo: `game-template-vite`, `game-template-react`, `game-template-phaser` e `game-template-threejs`.

## Executar o App e o Hub

```bash
cd platform
npm ci
npm run dev
```

O App abre em `http://localhost:4173`.

Em outro terminal:

```bash
cd platform
npm run dev:hub
```

O Hub abre em `http://localhost:4174`.

## Verificar antes de abrir um PR

```bash
npm run test
npm run typecheck
npm run lint
npm run format:check
npm run build
npm run test:e2e
npm audit --audit-level=high
```

Para os jogos oficiais:

```bash
cd games-official
npm ci
npm run check
npm audit --audit-level=high
```

O primeiro `npm install` instala os hooks locais. Os hooks não substituem a CI: eles fornecem feedback rápido; a CI continua sendo a autoridade do PR.
