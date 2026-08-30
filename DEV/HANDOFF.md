# Handoff

V1.1 foi implementada localmente: cada jogo oficial possui contrato de experiência e a Home exibe a próxima experiência selecionada pelo Learning Engine a partir do progresso pedagógico. Artefatos oficiais foram regenerados e sincronizados no App/Hub. Gates locais passaram; após o push, confirmar o workflow de Pages e o smoke público.

O bundle local passou a validação integral de produção em 2026-08-30. O defeito de recuperação de gameplay foi estabilizado por meio do contrato `inputReady` entre o runtime Phaser e o Playwright. A publicação do Pages foi corrigida: o workflow agora está em `.github/workflows/pages.yml`, usa a base `/aprincar-v1/` e o roteador do App respeita essa base.

O GitHub Pages foi habilitado com fonte GitHub Actions. As rotas profundas recebem o shell do App pelo `404.html` e o PWA verifica/ativa versões novas automaticamente. Próxima ação: confirmar o deploy deste ajuste na URL pública.
