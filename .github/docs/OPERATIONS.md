# Operação, CI e publicação

## Checks por projeto

O `platform` executa testes, TypeScript, lint, formato, build e Playwright. `games-official` executa testes dos geradores, geração de artefatos, sintaxe, manifests, registry e hashes. Community e currículo executam validação de seus pacotes/dados. Templates executam build e empacotamento.

Todos os repositórios usam CI em pull requests, Dependabot/CodeQL ou auditoria conforme o domínio e proteção de `main`.

## GitHub Pages

Publicações atuais:

- App: <https://kivervinicius.github.io/aprincar-v1/app/>
- Hub: <https://kivervinicius.github.io/aprincar-v1/hub/>
- Registry oficial: <https://kivervinicius.github.io/aprincar-v1/registry.json>

O workflow da raiz monta uma página estática com App, Hub e extensões. O App usa base `/aprincar-v1/app/`, o Hub usa `/aprincar-v1/hub/` e o site possui uma entrada HTML na raiz.

## Publicação segura

1. Faça merge somente após checks verdes e revisão exigida.
2. Confirme que o artifact contém apenas arquivos esperados.
3. Verifique o registry e os hashes.
4. Abra App e Hub em navegador real.
5. Teste uma extensão oficial online e offline.
6. Registre qualquer limitação no relatório de validação.

## Troubleshooting

- **Registry vazio:** confira `registry.json`, a base URL e o console do navegador.
- **Jogo não abre:** confira manifesto, hash, entrypoint e se o artefato foi preparado offline.
- **Offline falha:** execute primeiro `Prepare offline`; biblioteca e cache são estados diferentes.
- **E2E usa servidor antigo:** encerre processos Vite existentes ou rode a suíte em ambiente limpo.
- **Hook não encontra npm:** carregue Node 22/NVM no shell; os hooks do repositório também possuem caminhos locais determinísticos.

## Rollback

Artefatos de extensão são versionados e têm hash. Em caso de regressão, reverta o deploy Pages para o commit anterior e remova a entrada problemática do próximo registry por PR. Não substitua silenciosamente um artefato publicado com o mesmo hash/versionamento.
