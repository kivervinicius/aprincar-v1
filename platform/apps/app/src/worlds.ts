export interface WorldInfo {
  id: string;
  title: string;
  icon: string;
  color: string;
  accentBg: string;
  description: string;
  childSummary: string;
  skillIds: string[];
  suggestedAges: string;
  trail: string[];
}

export const WORLDS: WorldInfo[] = [
  {
    id: 'colors-shapes',
    title: 'Cores e Formas',
    icon: '🎨',
    color: '#22C55E',
    accentBg: '#EAF8EE',
    description: 'Classificação, percepção visual, tamanhos, cores e formas geométricas.',
    childSummary: 'Vamos misturar, combinar e descobrir cores e formatos incríveis!',
    skillIds: [
      'perception.colors.match',
      'perception.colors.name',
      'perception.shapes.match',
      'perception.visual.discrimination',
      'math.geometry.plane-shapes',
    ],
    suggestedAges: '2 a 6 anos',
    trail: ['Separar cores', 'Descobrir formas', 'Combinações', 'Desafio visual'],
  },
  {
    id: 'logic',
    title: 'Lógica',
    icon: '🧩',
    color: '#8B5CF6',
    accentBg: '#F3EFFF',
    description: 'Padrões, sequências, ordenação, associação e resolução de problemas.',
    childSummary: 'Encontre o que vem depois, descubra segredos e monte quebra-cabeças!',
    skillIds: [
      'logic.classification.one-attribute',
      'logic.classification.multi-attribute',
      'logic.patterns.ab',
      'logic.patterns.abc',
      'logic.sequence.order',
    ],
    suggestedAges: '3 a 9 anos',
    trail: ['Padrão AB', 'Classificar', 'Sequências', 'Desafios'],
  },
  {
    id: 'math',
    title: 'Matemática',
    icon: '🔢',
    color: '#FBBF24',
    accentBg: '#FFF9E6',
    description: 'Quantidades, contagem até 10, números, comparações, adição e subtração concreta.',
    childSummary: 'Conte bichinhos, separe frutas e descubra o poder dos números!',
    skillIds: [
      'math.quantity.subitize-1-3',
      'math.counting.1-3',
      'math.counting.1-5',
      'math.counting.1-10',
      'math.number-symbol.1-10',
      'math.compare.quantities',
      'math.addition.concrete',
      'math.subtraction.concrete',
    ],
    suggestedAges: '3 a 8 anos',
    trail: ['Quantidades', 'Contar até 5', 'Contar até 10', 'Juntar e Somar'],
  },
  {
    id: 'language',
    title: 'Linguagem',
    icon: '🔤',
    color: '#2563EB',
    accentBg: '#EBF2FF',
    description: 'Vocabulário cotidiano, rimas, sons, letras, palavras e histórias.',
    childSummary: 'Ouça sons, conheça letrinhas divertidas e crie suas histórias!',
    skillIds: [
      'language.vocabulary.everyday',
      'language.story.sequence',
      'language.listen.instructions',
      'language.describe.attributes',
      'phonology.rhyme.recognition',
      'phonology.syllable.segment',
      'phonology.initial-sound',
      'phonology.final-sound',
      'phonology.phoneme.isolate',
      'literacy.letter.recognition',
      'literacy.letter.sound',
      'literacy.letter.case',
      'literacy.word.image',
    ],
    suggestedAges: '3 a 8 anos',
    trail: ['Sons iniciais', 'Caça às letras', 'Palavras e figuras', 'Histórias'],
  },
  {
    id: 'writing',
    title: 'Escrita',
    icon: '✍️',
    color: '#F43F5E',
    accentBg: '#FFEBF0',
    description: 'Coordenação motora, traçado de linhas e curvas, letra de forma e primeiras palavras.',
    childSummary: 'Segure o lápis mágico, desenhe caminhos e faça suas primeiras letras!',
    skillIds: [
      'motor.tap.control',
      'motor.drag.control',
      'motor.prewriting.lines',
      'motor.prewriting.curves',
      'writing.trace-letter',
      'writing.copy-letter',
      'writing.free-letter',
      'writing.copy-word',
      'writing.write-name',
    ],
    suggestedAges: '3 a 8 anos',
    trail: ['Linhas e curvas', 'Traçar letras', 'Letras livres', 'Seu nome'],
  },
  {
    id: 'construction',
    title: 'Construção',
    icon: '🏗️',
    color: '#FB923C',
    accentBg: '#FFF2E8',
    description: 'Equilíbrio, planejamento espacial, blocos e estruturas tridimensionais.',
    childSummary: 'Empilhe, equilibre e construa torres e cidades com muita imaginação!',
    skillIds: ['math.geometry.solids', 'math.counting.1-10', 'motor.drag.control', 'logic.sequence.order'],
    suggestedAges: '3 a 9 anos',
    trail: ['Blocos básicos', 'Torres altas', 'Equilíbrio', 'Formas no espaço'],
  },
  {
    id: 'computing',
    title: 'Pensamento Computacional',
    icon: '🤖',
    color: '#8B5CF6',
    accentBg: '#F3EFFF',
    description: 'Comandos, sequências de passos, rotinas, raciocínio lógico e robôs.',
    childSummary: 'Comande o robôzinho até a estrela com passos passo a passo!',
    skillIds: ['computing.sequence.commands', 'logic.patterns.ab', 'logic.sequence.order'],
    suggestedAges: '4 a 9 anos',
    trail: ['Passo a passo', 'Sequência de setas', 'Caminhos do robô', 'Missão estrela'],
  },
  {
    id: 'practical-life',
    title: 'Vida Prática',
    icon: '🏠',
    color: '#22C55E',
    accentBg: '#EAF8EE',
    description: 'Organização, autonomia, separação de objetos e rotinas do dia a dia.',
    childSummary: 'Aprenda a organizar, cuidar e fazer coisas incríveis no seu dia a dia!',
    skillIds: ['logic.classification.one-attribute', 'motor.drag.control', 'language.listen.instructions'],
    suggestedAges: '2 a 7 anos',
    trail: ['Guardar brinquedos', 'Separar materiais', 'Rotinas alegres', 'Cuidar do espaço'],
  },
  {
    id: 'technology',
    title: 'Tecnologia',
    icon: '⌨️',
    color: '#2563EB',
    accentBg: '#EBF2FF',
    description: 'Reconhecimento do teclado, espaço de digitação e exploração digital consciente.',
    childSummary: 'Descubra as teclas, digite suas letrinhas favoritas e explore o teclado!',
    skillIds: ['literacy.letter.recognition', 'motor.tap.control', 'writing.copy-word'],
    suggestedAges: '4 a 9 anos',
    trail: ['Achar a tecla', 'Poucas teclas', 'Primeiras palavras', 'Digitação livre'],
  },
];

export interface MissionItem {
  id: string;
  title: string;
  prompt: string;
  category: string;
  worldId: string;
  icon: string;
  skills?: string[];
}

export const MISSIONS: MissionItem[] = [
  {
    id: 'mission-colors-1',
    title: 'Caça Vermelha',
    prompt: 'Encontre 3 objetos vermelhos perto de você e mostre para quem estiver com você.',
    category: 'Cores e Formas',
    worldId: 'colors-shapes',
    icon: '🎨',
  },
  {
    id: 'mission-math-1',
    title: 'Contador da Casa',
    prompt: 'Conte quantas portas e janelas existem no cômodo em que você está agora.',
    category: 'Matemática',
    worldId: 'math',
    icon: '🔢',
  },
  {
    id: 'mission-logic-1',
    title: 'Organização por Tamanho',
    prompt: 'Separe 4 brinquedos ou calçados do menor para o maior em uma fileira.',
    category: 'Lógica',
    worldId: 'logic',
    icon: '🧩',
  },
  {
    id: 'mission-language-1',
    title: 'Som Misterioso',
    prompt: 'Procure na casa um objeto que comece com o som da primeira letra do seu nome.',
    category: 'Linguagem',
    worldId: 'language',
    icon: '🔤',
  },
  {
    id: 'mission-writing-1',
    title: 'Traço no Ar',
    prompt: 'Com o dedo indicador esticado, desenhe no ar um círculo grande e depois a letra A.',
    category: 'Escrita',
    worldId: 'writing',
    icon: '✍️',
  },
  {
    id: 'mission-construction-1',
    title: 'Torre de Equilíbrio',
    prompt: 'Monte uma torre com 4 almofadas ou livros que não quebrem sem deixar cair.',
    category: 'Construção',
    worldId: 'construction',
    icon: '🏗️',
  },
  {
    id: 'mission-computing-1',
    title: 'Passos de Robô',
    prompt: 'Finja ser um robô: dê 3 passos para frente, 1 giro para a direita e 2 pulinhos!',
    category: 'Pensamento Computacional',
    worldId: 'computing',
    icon: '🤖',
  },
  {
    id: 'mission-practical-1',
    title: 'Guardião da Organização',
    prompt: 'Escolha 3 objetos que estão fora do lugar e guarde cada um no seu cantinho.',
    category: 'Vida Prática',
    worldId: 'practical-life',
    icon: '🏠',
  },
];
