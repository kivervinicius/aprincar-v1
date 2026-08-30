# APRINCAR V1.1 — GAME DESIGN SPECIFICATION 10/10
## Especificação Completa de Fantasia, Mecânicas, Arte Vetorial e Progressão Adaptativa

---

## 1. Princípios Fundamentais de Game Design Infantil (Aprincar)

1. **Manipulação Direta sobre Quiz:** A criança aprende tocando, arrastando, empilhando, traçando e explorando, não lendo perguntas e clicando em opções de texto.
2. **Progressão Concreto -> Pictórico -> Abstrato (C-P-A):** Cada experiência começa com objetos manipuláveis concretos antes de introduzir numerais ou símbolos formais.
3. **Assistência Progressiva Não-Punitiva:** Erros não produzem sons estridentes, perda de corações ou bloqueios; acionam dicas visuais suaves (brilho sutil, redução de distratores, demonstração parcial).
4. **Identidade Visual Vibrante e Distinta:** Cada jogo possui seu próprio universo temático, paleta de cores harmoniosa, personagens vetoriais expressivos e ambientação viva.
5. **Acessibilidade e Desempenho:** Áreas de toque de 64–96px, 60 FPS consistentes em dispositivos móveis, suporte a movimento reduzido e persistência 100% offline.

---

## 2. Especificação Individual dos 10 Jogos

### 2.1. Conte os Bichos (Safari dos Bichos)
- **Habilidade BNCC:** `EI03ET07` / `math.counting.1-10`
- **Fantasia:** Safari ensolarado na savana com leões, girafas, macacos e elefantes amigáveis.
- **Loop Central:** A criança toca nos animais que aparecem no cenário; cada animal reage com uma animação alegre (pulo, piscadela) e emite um brilho numerado; ao contar todos, o grupo comemora e avança para o próximo desafio.
- **Estágios de Progressão:**
  - *Estágio 1 (Concreto):* Toque e conte animais individuais (1 a 5).
  - *Estágio 2 (Agrupamento/Cercado):* Coloque exatamente N animais dentro do cercado do safari.
  - *Estágio 3 (Subitização & Comparação):* Reconheça rapidamente qual dos dois grupos possui a quantidade solicitada.
- **Arte Vetorial:** Ilustrações vetoriais detalhadas de animais em SVG/Canvas com olhos expressivos e animação de respiração idle.

### 2.2. Cesta de Frutas (Feira da Cesta)
- **Habilidade BNCC:** `EI03ET07` / `math.counting.1-10`
- **Fantasia:** Uma barraquinha de feira orgânica ao ar livre com frutas frescas (maçãs, bananas, laranjas, morangos) e uma cesta de vime acolhedora.
- **Loop Central:** A feirante pede uma quantidade de frutas; a criança arrasta as frutas diretamente da bancada para dentro da cesta; a cesta balança suavemente ao receber cada fruta e um contador de estrelas celebra a quantidade correta.
- **Estágios de Progressão:**
  - *Estágio 1 (Arrastar N Frutas):* Arraste qualquer fruta até atingir N (1 a 5).
  - *Estágio 2 (Seleção por Tipo):* Escolha especificamente "3 maçãs vermelhas" entre diferentes frutas.
  - *Estágio 3 (Ajuste Reversível):* Se colocar frutas a mais, a criança pode simplesmente retirar frutas da cesta de volta para a bancada sem erro punitivo.
- **Arte Vetorial:** Frutas com folhas verdes, brilho suave e cesta trançada detalhada com feedback de queda.

### 2.3. Torre de Blocos (Obra da Torre)
- **Habilidade BNCC:** `EI03ET05` / `math.counting.1-10`
- **Fantasia:** Canteiro de obras com bloquinhos de montar coloridos de madeira.
- **Loop Central:** A criança arrasta blocos para o centro; os blocos possuem efeito de snapping magnético com leve balanço físico, empilhando-se verticalmente para formar torres altas e estáveis.
- **Estágios de Progressão:**
  - *Estágio 1 (Empilhar N Blocos):* Construa uma torre de altura N (1 a 6).
  - *Estágio 2 (Padrão de Cores na Torre):* Empilhe alternando cores (ex: azul, amarelo, azul).
  - *Estágio 3 (Remoção e Ajuste):* Ajuste a altura da torre removendo o bloco do topo se ultrapassar a meta.
- **Arte Vetorial:** Blocos isométricos com chanfros, sombras dinâmicas projetadas e estrelinhas ao completar.

### 2.4. Mundo das Cores (Ateliê das Cores)
- **Habilidade BNCC:** `EI02ET05` / `perception.colors.match`
- **Fantasia:** Um ateliê de arte lúdico com casinhas/baldes de tinta coloridos (Vermelho, Azul, Amarelo, Verde, Roxo, Laranja).
- **Loop Central:** Objetos ilustrados do cotidiano (carrinho vermelho, folha verde, patinho amarelo, uva roxa) aparecem no centro; a criança arrasta cada objeto para a sua casinha de cor correspondente.
- **Estágios de Progressão:**
  - *Estágio 1 (Classificação 1:1):* Leve 1 objeto à sua cor correspondente (2 opções).
  - *Estágio 2 (Classificação Múltipla):* Distribua 4 a 6 objetos em 3 casinhas de cores diferentes.
  - *Estágio 3 (Mistura Introdutória / Tons):* Identifique cores quentes, frias ou pares primários.
- **Arte Vetorial:** Objetos reconhecíveis com contornos nítidos e casinhas coloridas com portas animadas que se abrem ao aproximar o objeto.

### 2.5. Trem dos Padrões (Trem dos Padrões)
- **Habilidade BNCC:** `EI03ET05` / `logic.patterns.ab`
- **Fantasia:** Uma ferrovia encantada por onde passa um trenzinho com locomotiva a vapor e vagões abertos transportando formas e cores.
- **Loop Central:** O trem chega à estação com uma sequência nos vagões (ex: Círculo Azul, Quadrado Amarelo, Círculo Azul, ___); a criança seleciona ou arrasta a peça correta para o vagão vazio; ao completar o padrão, o apito soa suavemente e o trem viaja para a próxima estação.
- **Estágios de Progressão:**
  - *Estágio 1 (Padrão AB):* Sequências simples de 2 elementos alternados (Cor ou Forma).
  - *Estágio 2 (Padrão AAB / ABB):* Sequências com repetições duplas.
  - *Estágio 3 (Padrão ABC):* Sequências com 3 elementos distintos combinando cor e geometria.
- **Arte Vetorial:** Locomotiva clássica, fumaça em formato de nuvens arredondadas, trilhos de madeira e vagões detalhados.

### 2.6. Caça às Letras (Caça ao Tesouro das Letras)
- **Habilidade BNCC:** `EI03EF09` / `literacy.letter.recognition`
- **Fantasia:** Um céu azul com nuvens suaves onde letras coloridas flutuam suavemente dentro de bolhas de sabão brilhantes.
- **Loop Central:** Uma letra-guia é exibida no topo (ex: Letra "A"); várias bolhas com letras flutuam com movimento suave de deriva; a criança toca na bolha certa, que estoura em pequenas estrelinhas e revela a letra encontrada.
- **Estágios de Progressão:**
  - *Estágio 1 (Vogais Principais):* Caça às vogais com poucas bolhas e baixa velocidade.
  - *Estágio 2 (Consoantes Iniciais):* Letras de nomes comuns (B, M, L, S, T, P) com distratores visuais suaves.
  - *Estágio 3 (Discriminação Visual Fina):* Diferenciação entre letras com formatos semelhantes (ex: P vs R, E vs F, B vs D).
- **Arte Vetorial:** Bolhas de sabão transparentes com reflexos iridescentes e letras em tipografia arredondada de alta legibilidade.

### 2.7. Ateliê de Letras (Escola de Escrita)
- **Habilidade BNCC:** `EI03EF09` / `writing.trace-letter`
- **Fantasia:** Uma lousa mágica infantil onde uma estrelinha brilhante ensina os caminhos dos traços das letras.
- **Loop Central:** A criança acompanha o traço da letra com o dedo; o traço produz um rastro brilhante multicolorido com partículas mágicas. O sistema analisa proximidade, ordem de traços e direção de forma suave.
- **Estágios de Progressão:**
  - *Estágio 1 (Demonstração e Guia Forte):* A estrelinha percorre o traço e um guia pontilhado largo com setas direcionais orienta o dedo.
  - *Estágio 2 (Guia Médio com Início Marcado):* Apenas o ponto de partida verde e a rota semi-transparente são exibidos.
  - *Estágio 3 (Escrita com Apoio Mínimo):* A criança desenha a forma da letra livremente sobre a silhueta.
- **Arte Vetorial:** Efeito de giz mágico / neon suave com partículas douradas e feedback de conclusão com aplausos visuais.

### 2.8. Pintura Livre (Estúdio de Pintura)
- **Habilidade BNCC:** `EI02TS02` / `creativity.visual-expression`
- **Fantasia:** Um ateliê completo de pintura para artistas mirins, sem respostas "certas" ou "erradas".
- **Loop Central:** A criança escolhe ferramentas na barra lateral (Pincel grosso, Pincel fino, Carimbos de animais, Borracha, Balde mágico de preenchimento) e cores vibrantes, desenha livremente e pode salvar suas obras na galeria local.
- **Recursos Principais:**
  - Paleta com 8 cores oficiais vibrantes + borracha.
  - 3 espessuras de pincel (Fino, Médio, Gigante).
  - Carimbos ilustrados (Estrelinha, Coração, Árvore, Sol, Cachorrinho).
  - Botões de Desfazer (Undo), Limpar Tela e Salvar Obra.
- **Arte Vetorial:** Cavalete de madeira, barra de ferramentas estilo aquarela e canvas responsivo de alta resolução.

### 2.9. Memória dos Bichos (Reserva dos Pares)
- **Habilidade BNCC:** `EI02ET05` / `perception.visual.discrimination`
- **Fantasia:** Cartas de madeira na reserva florestal que escondem bichinhos fofos da fauna brasileira e mundial.
- **Loop Central:** A criança toca nas cartas para virá-las; ao encontrar o par igual, os animais celebram com um som suave e as cartas permanecem abertas com moldura dourada.
- **Estágios de Progressão:**
  - *Estágio 1 (Tabuleiro 2x2 - 2 Pares):* Ideal para crianças bem pequenas (3–4 anos) com preview inicial de 2 segundos.
  - *Estágio 2 (Tabuleiro 2x3 - 3 Pares):* Progressão natural com 6 cartas.
  - *Estágio 3 (Tabuleiro 2x4 - 4 Pares):* Desafio expandido para desenvolvimento de memória de trabalho.
- **Arte Vetorial:** Cartas em relevo com texturas de madeira e ilustrações vetoriais nítidas de animais.

### 2.10. Formas no Espaço 3D (Missão Espacial)
- **Habilidade BNCC:** `EI03ET05` / `math.geometry.solids`
- **Fantasia:** Uma estação espacial orbital de exploração geométrica cercada por estrelas cintilantes e planetas coloridos.
- **Loop Central:** Sólidos geométricos tridimensionais (Esfera, Cubo, Cilindro, Cone, Pirâmide) flutuam suavemente na cabine holográfica. A criança pode girar o sólido com o dedo para explorar suas faces e associá-lo a objetos do mundo real (ex: Cubo = Dado, Cilindro = Lata, Esfera = Planeta).
- **Estágios de Progressão:**
  - *Estágio 1 (Reconhecimento e Rotação Livre):* Gire e selecione o sólido solicitado (ex: "Encontre o Cubo").
  - *Estágio 2 (Associação com Objetos Reais):* Relacione a forma 3D com o objeto do dia a dia (ex: Esfera ↔ Bola de Futebol).
  - *Estágio 3 (Silhueta e Projeção de Sombra):* Identifique qual sólido 3D projeta a sombra bidimensional exibida na tela.
- **Arte Tridimensional (Three.js):** Shaders limpos em estilo toon/flat pastel, iluminação direcional suave, rotação inercial ao deslizar o dedo e partículas estelares de fundo otimizadas para 60 FPS mobile.
