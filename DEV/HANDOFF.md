# Handoff

O bundle local passou a validação integral de produção em 2026-08-30. O defeito de recuperação de gameplay foi estabilizado por meio do contrato `inputReady` entre o runtime Phaser e o Playwright. A publicação do Pages foi corrigida: o workflow agora está em `.github/workflows/pages.yml`, usa a base `/aprincar-v1/` e o roteador do App respeita essa base.

O GitHub Pages foi habilitado com fonte GitHub Actions; o workflow de validação e deploy passou. O App está em `https://kivervinicius.github.io/aprincar-v1/` e não há bloqueador local aberto.
