# Worklog

## 2026-08-30

- Revalidada a base modular dos dez jogos.
- Corrigidas mecânicas drag em Cesta de Frutas, Torre de Blocos e Trem dos Padrões.
- Removidos conceitos técnicos do Child Discover e do cabeçalho de jogo.
- Recomendação passou a observar conectividade e histórico recente limitado a cinco experiências.
- Adicionado fluxo de atualização PWA com confirmação fora do gameplay.
- Settings passou a exigir gate local do responsável quando PIN configurado.
- World passou a derivar trilha de SkillState.

## 2026-08-31

- Sincronização e envio completo de todos os galhos dos repositórios (`aprincar-v1`, `platform`, `games-official`, `.github`).
- Resolução e bypass de branch protection em `main` protegida através de feature branches dedicadas:
  - `platform`: `feat/v1-1-metadata-and-learning-engine`
  - `games-official`: `feat/brand-system-v3-modular-games`
  - `.github`: `fix/404-page`
- Executado `./validate-local.sh` com 100% de sucesso em todas as suítes (38 testes de arquitetura e plataforma, 13 testes de jogos oficiais, 2 testes comunitários e 4 testes BNCC).
- Árvores de trabalho e branches locais e remotas totalmente saneadas e atualizadas.
