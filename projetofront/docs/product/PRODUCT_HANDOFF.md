# Handoff do Projeto — Plataforma Open Source de Aprendizagem Lúdica Infantil

Baseado na conversa de 17–25 de agosto de 2026. Documento preparado para continuar o planejamento com outra IA ou em uma nova conversa.

## 1. Objetivo original

Criar um aplicativo open source para crianças aproximadamente entre 3 e 7 anos aprenderem de forma extremamente lúdica. A inspiração principal é Montessori, jogos de lógica e inteligência, aprendizagem pela manipulação e descoberta.

O objetivo não é criar apenas uma coleção de exercícios escolares digitalizados. A proposta é ensinar habilidades e formas de pensar: empilhar, combinar, classificar, contar, somar, reconhecer cores e formas, escrever letra de forma e cursiva, digitar, resolver problemas e compreender sequências e procedimentos.

A ideia central é que a criança aprenda “como fazer as coisas” brincando, com progressão natural e pouca dependência de leitura.

## 2. Problema que o projeto pretende resolver

Muitos aplicativos infantis transformam aprendizagem em perguntas e respostas, excesso de recompensas, moedas, anúncios ou repetição mecânica. A proposta discutida é diferente:

- criança manipula antes de abstrair;
- erro é parte da descoberta, não punição;
- progresso representa domínio de habilidades, não apenas fases concluídas;
- conteúdo pode ser reutilizado e gerado a partir de uma engine;
- o aplicativo incentiva atividades fora da tela;
- o núcleo e o conteúdo devem poder ser ampliados pela comunidade open source.

## 3. Conceito do produto

Uma plataforma de aprendizagem lúdica, offline-first e extensível, composta por:

1. Skill Graph — mapa de habilidades e pré-requisitos.
2. Activity Engine — engine genérica que executa tipos de atividades.
3. Learning Engine — decide qual atividade faz sentido apresentar.
4. Content Packs — conteúdos, temas e atividades instaláveis.
5. Child Mode — experiência simples para crianças.
6. Parent Mode — visão pedagógica e sugestões.
7. Authoring Tools — ferramentas para a comunidade criar conteúdo sem alterar o núcleo.

A visão de longo prazo é funcionar como uma espécie de “sistema operacional para brinquedos educacionais digitais”.

## 4. Princípios pedagógicos

O projeto deve organizar as experiências segundo a progressão:

**CONCRETO → VISUAL → ABSTRATO**

Exemplo de soma:

- concreto: juntar 2 brinquedos com mais 3 brinquedos;
- visual: visualizar 2 círculos + 3 círculos;
- abstrato: resolver 2 + 3 = 5.

Outros princípios:

- autonomia;
- descoberta;
- repetição voluntária;
- progressão individual;
- manipulação;
- feedback gentil;
- ausência de punição artificial;
- ligação entre mundo digital e mundo real.

## 5. Mundos ou domínios iniciais

### 🎨 Cores e Formas

- classificação;
- percepção visual;
- tamanho;
- formas;
- atributos combinados.

### 🧩 Lógica

- padrões;
- sequências;
- ordenação;
- associação;
- labirintos;
- simetria;
- resolução de problemas.

### 🔢 Matemática

- reconhecimento de quantidade;
- contagem;
- associação número ↔ quantidade;
- comparação;
- adição;
- subtração.

### 🔤 Linguagem

- reconhecimento de letras;
- sons;
- associação letra/som;
- formação de palavras;
- leitura inicial.

### ✍️ Escrita

- coordenação;
- tracing;
- letra de forma;
- cursiva.

### ⌨️ Tecnologia

- reconhecimento do teclado;
- localização espacial das teclas;
- digitação de letras;
- palavras;
- frases.

### 🏗️ Construção

- equilíbrio;
- planejamento;
- geometria espacial;
- causa e efeito.

### 🤖 Pensamento Computacional

- comandos;
- sequências;
- loops;
- condições;
- algoritmos.

### 🏠 Vida Prática

- organizar;
- cozinhar;
- vestir-se;
- plantar;
- limpar;
- executar procedimentos.

## 6. Skill Graph — o coração pedagógico

O sistema não deve dizer apenas “a criança concluiu a fase 8”. Ele deve acompanhar habilidades.

Exemplo:

```text
Matemática
└── Contagem
    ├── reconhecer pequenas quantidades
    ├── contar até 3
    ├── contar até 5
    ├── contar até 10
    └── contar até 20
```

Depois:

- associar quantidade ao símbolo;
- comparar maior/menor/igual;
- somar concretamente;
- somar visualmente;
- somar simbolicamente.

Cada skill deve ter:

- id;
- descrição;
- faixa etária sugerida, sem ser bloqueio rígido;
- pré-requisitos;
- nível de abstração;
- atividades capazes de exercitá-la;
- critérios de domínio.

## 7. Activity Engine

Em vez de programar centenas de jogos individualmente, criar uma engine baseada em tipos reutilizáveis:

- sorting;
- matching;
- sequencing;
- counting;
- tracing;
- drag-and-drop;
- construction;
- maze;
- keyboard;
- programming.

Uma atividade é descrita por dados e executada pelo componente correspondente.

Exemplo conceitual:

```yaml
type: sorting
skills:
  - logic.classification
rule:
  - color
objects:
  - red
  - blue
difficulty:
  distractors: 2
  attributes: 1
```

Isso permite criar novas atividades e temas sem reescrever o núcleo.

## 8. Dimensões de dificuldade

A dificuldade não deve ser apenas um número. Ela pode variar em múltiplos eixos:

- quantidade de objetos;
- quantidade de distrações;
- quantidade de atributos a considerar;
- complexidade do padrão;
- tamanho da sequência;
- nível de abstração;
- necessidade de memória;
- precisão motora;
- ajuda disponível;
- tempo, quando pedagogicamente adequado.

Exemplo: “classificar por cor” pode evoluir para “classificar por cor e tamanho” e depois para “encontrar o objeto que atende a três propriedades”.

## 9. Learning Engine e adaptatividade

O Learning Engine recebe eventos de aprendizagem e recomenda a próxima experiência.

Dados possíveis:

- tentativas;
- erros;
- tipo de erro;
- pistas solicitadas;
- tempo;
- abandono;
- repetição espontânea;
- skills relacionadas;
- histórico recente.

Não começar com uma LLM tomando decisões. O MVP deve usar regras transparentes e determinísticas.

Exemplo:

A criança erra repetidamente 7 + 2 na forma simbólica. O engine reduz a abstração e oferece representação visual ou concreta. Quando o desempenho melhora, retorna gradualmente ao nível simbólico.

## 10. Tratamento do erro

Não usar mensagens punitivas como “ERRADO!”.

Preferir:

- “Vamos tentar de outro jeito?”
- “O que acontece se juntarmos estes objetos?”
- demonstrar parcialmente;
- oferecer pista;
- reduzir temporariamente a complexidade.

O erro deve alimentar o modelo de aprendizagem, não apenas reduzir uma pontuação.

## 11. Child Mode

Interface minimalista e predominantemente visual.

Requisitos:

- funcionar para criança que não lê;
- grandes áreas de toque;
- áudio opcional;
- poucas decisões por tela;
- sem menus administrativos;
- sem anúncios;
- sem moedas artificiais;
- sem vidas;
- sem ranking.

Os mundos podem ser apresentados como um mapa visual: cores, lógica, números, letras, construção e robôs.

## 12. Parent Mode

O painel dos responsáveis não deve focar apenas em porcentagens.

Mostrar:

- habilidades consolidadas;
- habilidades em desenvolvimento;
- dificuldades observadas;
- progresso ao longo do tempo;
- sugestões de brincadeiras fora da tela.

Exemplo:

“Está confortável contando até 5. Está começando a trabalhar quantidades maiores.”

Sugestão:

“Durante a arrumação, peça para separar 5 carrinhos e depois mais 2.”

## 13. Missões fora da tela

Esse é um possível grande diferencial.

Exemplos:

- encontre 3 objetos vermelhos na casa;
- conte quantas portas existem;
- separe talheres por tamanho;
- organize objetos por categoria;
- encontre algo redondo e azul.

A intenção é conectar a habilidade digital com o mundo físico e evitar que o produto se transforme em mera ocupação de tela.

## 14. Tecnologia e digitação

Foi considerada especialmente interessante a criação de uma progressão para teclado:

- Fase 1: localizar uma letra.
- Fase 2: escolher entre poucas teclas.
- Fase 3: digitar uma sequência curta.
- Fase 4: formar palavras.
- Fase 5: copiar palavras.
- Fase 6: frases simples.
- Fase 7: expressão livre.

A criança aprende som → símbolo → localização no teclado → digitação.

## 15. Pensamento computacional

Proposta de progressão:

**3–4 anos:**

- setas e sequência simples.

**4–5 anos:**

- repetir uma sequência.

**5–6 anos:**

- introdução a loops.

**6–7 anos:**

- condições simples.

Exemplo:

“Leve o robô até a estrela.”

A criança monta comandos visualmente e aprende planejamento, algoritmo, repetição e condição antes de escrever código.

## 16. Arquitetura técnica sugerida

Stack inicial compatível com o conhecimento técnico já discutido:

Frontend:

- React;
- TypeScript;
- Vite;
- PWA;
- SVG e/ou Canvas para atividades;
- Web Audio API.

Estado e persistência:

- estado local simples por feature;
- IndexedDB para dados offline;
- sincronização opcional posteriormente.

Arquitetura conceitual:

```text
App
├── Child UI
├── Parent UI
├── Activity Engine
├── Learning Engine
├── Skill Graph
├── Content Registry
├── Storage
└── Accessibility
```

A recomendação é começar sem backend obrigatório.

## 17. Offline-first e privacidade

O primeiro produto deve funcionar completamente no navegador.

Dados iniciais:

```text
Browser → IndexedDB
```

Depois:

```text
Browser ↔ API ↔ PostgreSQL
```

A sincronização deve ser opcional.

Para perfis infantis:

- evitar coleta de dados pessoais;
- usar perfis locais;
- não usar publicidade;
- não usar rastreamento desnecessário;
- projetar privacidade desde o início.

## 18. Arquitetura de repositório

Estrutura sugerida:

```text
ludi/
├── apps/
│   ├── web/
│   ├── parent/
│   └── author/
├── packages/
│   ├── activity-engine/
│   ├── learning-engine/
│   ├── skill-graph/
│   ├── ui/
│   ├── audio/
│   ├── storage/
│   └── accessibility/
├── content/
│   ├── skills/
│   ├── activities/
│   ├── stories/
│   └── assets/
├── tools/
│   ├── content-validator/
│   ├── activity-generator/
│   └── authoring-cli/
├── docs/
└── README.md
```

O conteúdo deve ficar separado da engine.

## 19. Plugins e Content Packs

Atividades devem ser extensíveis.

Uma atividade pode conter:

- manifest;
- metadados;
- skills trabalhadas;
- parâmetros de dificuldade;
- gerador;
- avaliador;
- assets;
- traduções.

Também deve existir conceito de tema:

- animais;
- carros;
- espaço;
- dinossauros;
- brinquedos.

A mesma mecânica pode usar vários temas sem duplicar lógica.

## 20. Authoring Tool

O objetivo futuro é permitir que educadores e contribuidores criem atividades sem alterar o código da engine.

Fluxo:

1. escolher tipo de atividade;
2. escolher skills;
3. configurar idade/dificuldade;
4. escolher objetos e tema;
5. testar;
6. validar;
7. exportar content pack.

A ferramenta pode inicialmente gerar arquivos declarativos e depois evoluir para uma interface visual.

## 21. IA no projeto

IA deve ser ferramenta auxiliar, não o núcleo pedagógico.

Possíveis usos:

- ajudar a criar manifests;
- sugerir variações;
- gerar histórias;
- auxiliar traduções;
- criar documentação;
- ajudar autores de conteúdo.

O sistema deve validar automaticamente conteúdo gerado.

Decisões básicas de progressão devem continuar transparentes e reproduzíveis no início.

## 22. MVP recomendado

Não construir tudo de uma vez.

MVP:

Infraestrutura:

- Skill Graph;
- Activity Engine;
- Child Mode;
- Parent Mode básico;
- IndexedDB;
- PWA offline;
- tracking de eventos.

10 atividades:

1. separar por cor;
2. separar por forma;
3. completar sequência;
4. contar objetos;
5. associar número e quantidade;
6. soma concreta;
7. reconhecer letras;
8. tracing de letras;
9. labirinto;
10. sequência de comandos para robô.

Critério de sucesso:

A arquitetura precisa provar que uma nova atividade pode ser adicionada sem alterar o núcleo principal.

## 23. Roadmap proposto anteriormente

### Fase MVP

- núcleo pedagógico;
- engine;
- 10 atividades;
- offline.

### V0.2

- aproximadamente 30 atividades;
- áudio;
- mais idiomas;
- teclado;
- vida prática.

### V0.3

- Learning Engine;
- adaptatividade;
- recomendações.

### V0.4

- Authoring Tool;
- plugins;
- distribuição de content packs.

### V0.5

- sincronização opcional;
- famílias;
- relatórios.

### V1

- plataforma comunitária de conteúdo educacional open source.

## 24. Projetos existentes que merecem estudo

Projetos e produtos citados na conversa como referências conceituais:

- GCompris — referência open source de grande conjunto de atividades infantis.
- eduActiv8 — referência de atividades educativas offline/open source.
- Pok Pok — referência de experiência infantil aberta e exploratória.
- Montessori Preschool — referência comercial de atividades inspiradas em Montessori.
- TALight — referência acadêmica/open source relacionada a aprendizagem por problemas interativos.
- pequenos projetos de alfabetização e jogos HTML/JS — úteis para estudar mecânicas simples.

**IMPORTANTE:** antes de copiar código, assets, conteúdo ou licenças, analisar individualmente a licença e os direitos de cada projeto.

## 25. O que precisa ser melhorado antes de começar a programar

A conversa chegou a uma boa visão, mas ainda não há um plano de produto suficientemente rigoroso. Antes do código, a próxima IA deve ajudar a definir:

1. Público exato:
   - 3–7 é amplo demais para um único UX?
   - haverá trilhas por estágio de desenvolvimento?
2. Base pedagógica:
   - quais princípios Montessori serão realmente adotados?
   - quais serão apenas inspiração?
   - haverá revisão de educadores?
3. Métrica de domínio:
   - como calcular confiança em uma skill?
   - quantos acertos importam?
   - como distinguir chute de domínio?
   - como evitar medir apenas velocidade?
4. Modelo de conteúdo:
   - JSON, YAML ou TypeScript?
   - schema versionado?
   - como validar plugins?
5. Segurança infantil:
   - perfis locais;
   - consentimento;
   - sincronização;
   - conteúdo da comunidade;
   - moderação.
6. Open source:
   - licença do código;
   - licença do conteúdo;
   - contribuição;
   - governança.
7. Produto:
   - PWA primeiro?
   - desktop?
   - Android/iOS posteriormente?
8. Escopo:
   - qual é a primeira experiência que provará a proposta?
   - 10 atividades talvez ainda sejam demais para o primeiro protótipo.

O maior risco é começar a construir jogos antes de validar o modelo de skills e o contrato da Activity Engine.

## 26. Próximo plano superior recomendado

A próxima etapa deve ser um PLANEJAMENTO DE PRODUTO E ARQUITETURA, não programação imediata.

Ordem sugerida:

### ETAPA 1 — Discovery

Definir problema, usuários, faixas de desenvolvimento e proposta de valor.

### ETAPA 2 — Pedagogical Core

Criar uma taxonomia inicial de 20–40 skills, pré-requisitos e critérios de domínio.

### ETAPA 3 — Activity Contract

Definir exatamente como uma atividade conversa com:

- Skill Graph;
- Learning Engine;
- UI;
- eventos;
- armazenamento.

### ETAPA 4 — Vertical Slice

Construir apenas UMA mecânica completa, por exemplo Sorting, incluindo:

- geração;
- execução;
- eventos;
- avaliação;
- progresso;
- recomendação.

### ETAPA 5 — Validar extensibilidade

Criar uma segunda atividade sem modificar o núcleo.

### ETAPA 6 — Crianças reais

Testar usabilidade com supervisão de responsáveis e colher observações qualitativas.

### ETAPA 7 — MVP

Somente depois expandir para os demais domínios.

Esse caminho reduz o risco de criar uma arquitetura sofisticada demais antes de provar a experiência infantil.

## 27. Prompt de continuidade para outra IA

Quero que você atue como uma equipe multidisciplinar formada por Product Manager de edtech infantil, arquiteto de software, especialista em UX para crianças de 3 a 7 anos, especialista em aprendizagem baseada em manipulação e pensamento computacional, e estrategista de projetos open source.

Estou desenvolvendo uma plataforma open source de aprendizagem lúdica infantil. A visão é criar uma engine extensível de atividades, um grafo de habilidades e um sistema de progressão adaptativa. O projeto não deve ser apenas uma coleção de exercícios. A criança deve aprender manipulando, explorando e descobrindo, preferencialmente seguindo a progressão concreto → visual → abstrato.

Analise criticamente todo o contexto deste documento. Não concorde automaticamente com as decisões já tomadas. Identifique falhas pedagógicas, riscos de arquitetura, excesso de escopo e oportunidades melhores.

Quero um plano superior ao que foi produzido até agora, organizado em:

1. visão e proposta de valor;
2. personas e faixas de desenvolvimento;
3. princípios pedagógicos concretos;
4. taxonomia inicial de habilidades;
5. modelo de dados do Skill Graph;
6. contrato da Activity Engine;
7. modelo de eventos e avaliação;
8. estratégia de adaptatividade sem depender inicialmente de LLM;
9. UX do modo criança;
10. UX do modo responsável;
11. arquitetura técnica;
12. modelo de plugins/content packs;
13. privacidade e segurança infantil;
14. estratégia open source e licenciamento;
15. MVP mínimo realista;
16. vertical slice inicial;
17. roadmap técnico;
18. critérios objetivos de sucesso;
19. principais riscos;
20. decisões que precisam ser tomadas antes de escrever código.

Sempre diferencie claramente:

- decisão confirmada;
- hipótese;
- recomendação;
- questão em aberto.

Priorize simplicidade, extensibilidade e validação precoce. Não proponha backend, IA, microserviços ou arquitetura complexa sem justificar a necessidade.
