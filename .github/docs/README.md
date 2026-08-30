# Documentação geral do Aprincar

Este diretório é o ponto de entrada da organização Aprincar. Ele explica como os repositórios se conectam, como executar o sistema localmente, como criar extensões e como participar do fluxo de revisão.

## Navegação

| Documento                           | Quando consultar                     |
| ----------------------------------- | ------------------------------------ |
| [Começando](GETTING_STARTED.md)     | Primeira instalação e execução local |
| [Projetos](PROJECTS.md)             | Escolher o repositório correto       |
| [Arquitetura](ARCHITECTURE.md)      | Entender App, Hub, jogos e dados     |
| [Extensões](EXTENSIONS.md)          | Criar, validar e publicar um jogo    |
| [Operação e release](OPERATIONS.md) | CI, Pages, offline e troubleshooting |
| [Contribuição](../CONTRIBUTING.md)  | Branches, commits, PRs e revisão     |
| [Segurança](../SECURITY.md)         | Reportar vulnerabilidades            |

## Princípios

- O App é local-first: perfis, biblioteca, progresso e evidências permanecem no dispositivo.
- Jogos são extensões independentes; o App não importa código de `games/*`.
- A comunicação entre jogo e plataforma acontece pelo Game SDK e por `MessageChannel`.
- Jogos produzem evidências; somente o Progress Engine calcula estados de habilidade.
- Recompensas são separadas de mastery pedagógico.
- BNCC é um mapeamento opcional de Skill IDs, nunca uma dependência direta do jogo.
- Privacidade infantil, acessibilidade, segurança e revisão pedagógica são requisitos do produto.

## Repositórios

Todos os repositórios públicos estão em [github.com/aprincar](https://github.com/aprincar). O site publicado está em [aprincar.github.io/platform](https://aprincar.github.io/platform/).
