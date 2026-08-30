# Aprincar Frontend V1 — Implementation Checklist

## Contratos

- [ ] `PRODUCT_HANDOFF.md` lido integralmente.
- [ ] `FRONTEND_V1_SPEC.md` lido integralmente.
- [ ] arquitetura atual do Aprincar inventariada antes de alterações.
- [ ] GameHost/SDK/ExtensionManager preservados.
- [ ] nenhuma importação direta de games no App.

## Mobile / Touch

- [ ] 360x640
- [ ] 390x844
- [ ] 430x932
- [ ] targets gerais >= 48x48
- [ ] targets infantis principais >= 64px
- [ ] nenhum fluxo depende de hover
- [ ] safe areas iOS

## Tablet

- [ ] 768x1024 portrait
- [ ] 834x1194 portrait
- [ ] 1024x1366 portrait
- [ ] tablet landscape
- [ ] Runtime em landscape validado

## Desktop

- [ ] 1280x800
- [ ] 1440x900
- [ ] 1920x1080
- [ ] mouse
- [ ] keyboard
- [ ] focus visible

## Onboarding

- [ ] boas-vindas
- [ ] nome/avatar
- [ ] idade
- [ ] habilidades observadas
- [ ] interesses
- [ ] tempo inicial opcional
- [ ] persistência local

## Child Mode

- [ ] Home
- [ ] BottomNavigation
- [ ] recomendação principal
- [ ] Continue explorando
- [ ] Mundos
- [ ] Missões
- [ ] Descobrir
- [ ] Biblioteca
- [ ] Mais

## Runtime

- [ ] fullscreen/dedicado
- [ ] sem navegação normal
- [ ] GameHost
- [ ] loading
- [ ] error
- [ ] exit
- [ ] orientation hint
- [ ] touch
- [ ] keyboard quando aplicável

## Parent Mode

- [ ] adult gate / PIN
- [ ] visão geral
- [ ] perfis
- [ ] skills
- [ ] skill detail
- [ ] timeline
- [ ] tempo
- [ ] missões sugeridas
- [ ] Offline Manager
- [ ] settings

## Offline / PWA

- [ ] App Shell offline
- [ ] IndexedDB
- [ ] profile offline
- [ ] Evidence offline
- [ ] SkillState offline
- [ ] Library != Offline Cache
- [ ] download individual de games
- [ ] deep route reload offline
- [ ] install prompt
- [ ] update prompt
- [ ] update não interrompe gameplay

## Accessibility

- [ ] ARIA
- [ ] teclado
- [ ] screen reader Parent Mode
- [ ] reduced motion
- [ ] high contrast
- [ ] não depender de cor
- [ ] font scaling

## Performance

- [ ] Phaser fora do bundle inicial
- [ ] Three.js fora do bundle inicial
- [ ] Parent Mode lazy
- [ ] routes lazy
- [ ] games lazy
- [ ] assets responsivos

## QA

- [ ] TypeScript
- [ ] lint
- [ ] unit tests
- [ ] build
- [ ] Playwright
- [ ] visual screenshots
- [ ] mobile QA
- [ ] tablet QA
- [ ] desktop QA
- [ ] offline QA
- [ ] PWA QA

## Relatório final

- [ ] `_validation/frontend-final-report.md`
- [ ] `_validation/screenshots/`
- [ ] P0 = 0
- [ ] P1 = 0
