# APRINCAR V1.1 — GAME AUDIT & QUALITY RUBRIC REPORT
## Auditoria Técnica e Sensorial dos 10 Jogos Oficiais Aprincar

**Data:** 30 de Agosto de 2026  
**Avaliador:** Agente Game Design & Quality Assurance / Orquestrador Maestro  
**Escopo:** 10 Extensões de Jogos Oficiais (`games-official/`)

---

## 1. Rubrica de Qualidade de Game Design (Escala 0.0 a 5.0)

Critérios avaliados para cada jogo:
1. **Clarity:** Objetivo imediato e intuitivo em < 5 segundos sem texto explicativo longo.
2. **Fantasy:** Tema imersivo e lúdico com identidade cenográfica própria.
3. **Visual Quality:** Gráficos vetoriais/sprites distintos, sem formas geométricas genéricas ou cinzas.
4. **Interaction:** Interação tátil responsiva, natural e satisfatória.
5. **Direct Manipulation:** Sensação física de agarrar, arrastar, empilhar, girar ou traçar.
6. **Animation:** Movimento com inércia, partículas leves, idle breathing e drop feedback.
7. **Feedback:** Resposta visual e sonora imediata em qualquer ação.
8. **Error Recovery:** Recuperação imediata sem penalidade, perda de vidas ou frustração.
9. **Progression:** Pelo menos 3 variações estruturais de gameplay (Concreto -> Pictórico -> Simbólico).
10. **Variety:** Variação procedural de elementos, distribuições e cenários entre rodadas.
11. **Replayability:** Fator de rejogabilidade duradouro e agradável.
12. **Pedagogy:** Alinhamento preciso à habilidade BNCC correspondente.
13. **Touch Targets:** Áreas de toque generosas (>= 64px) ideais para mãos infantis.
14. **Accessibility:** Alto contraste, suporte a movimento reduzido e feedback multissensorial.
15. **Performance:** 60 FPS estáveis em dispositivos móveis sem sobrecarga de memória.
16. **Delight:** Encantamento e diversão perceptível pela criança.

---

## 2. Tabela de Avaliação Individual dos Jogos (Diagnóstico V1.0 vs Meta V1.1)

| Jogo | Fantasia | Mecânica Principal | V1.0 Diagnostic (Pontos Fracos) | V1.1 Meta 10/10 (Transformação) | Média V1.0 | Meta V1.1 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Conte os Bichos** | Safari dos Bichos | Tap-Count / Cercado | Animais eram círculos/elipses genéricas; apenas contava e escolhia número | Animais vetoriais ilustrados (leão, elefante, macaco, girafa) com reação tátil individual, contagem no cercado e subitização | 3.2 | **4.8** |
| **Cesta de Frutas** | Feira da Cesta | Drag-into-Basket | Frutas eram círculos coloridos com letras pequenas | Frutas com arte distinta (maçã, banana, laranja, morango), física suave ao arrastar e drop generoso na cesta de vime | 3.4 | **4.9** |
| **Torre de Blocos** | Obra da Torre | Stacking & Physics | Blocos retangulares simples com seleção de botões | Blocos de brinquedo 3D isométricos com sombras, snapping magnético suave, empilhamento físico e equilíbrio de torre | 3.3 | **4.8** |
| **Mundo das Cores** | Ateliê das Cores | Drag-Match / Classificação | Apenas arrastava círculo colorido para quadrado da mesma cor | Objetos temáticos do cotidiano (carro vermelho, folha verde, patinho amarelo, uva roxa) para suas respectivas casinhas | 3.4 | **4.8** |
| **Trem dos Padrões** | Trem dos Padrões | Sequence / Drag | Retângulos em linha sem sensação de trem | Locomotiva charmosa a vapor com vagões de carga, trilhos de trem e animação de partida a cada estação completada | 3.5 | **4.9** |
| **Caça às Letras** | Caça ao Tesouro | Tap-Chase / Flutuação | Letras estáticas em botões circulares | Letras navegando em bolhas de sabão ou balões suaves flutuando pelo céu com física leve de deriva | 3.4 | **4.8** |
| **Ateliê de Letras** | Escola de Escrita | Tracing Progressivo | Tracing único sem apoio progressivo | Tracing em 4 estágios: demonstração guiada por estrela -> guia pontilhado -> traço leve -> escrita livre com scoring suave | 3.6 | **4.9** |
| **Pintura Livre** | Estúdio de Pintura | Free-Draw & Mini-Studio | Canvas básico com poucas opções | Mini-estúdio com paleta vibrante, pincéis (giz, pincel, carimbos de animais, borracha), desfazer e salvar desenho na galeria | 3.8 | **4.9** |
| **Memória dos Bichos**| Reserva dos Pares | Card Flip & Match | Cartas cinzas sem animação de giro | Cartas ilustradas com animais da floresta, animação suave de rotação 3D do verso, som de flip e celebração por par | 3.5 | **4.8** |
| **Formas no Espaço 3D**| Missão Espacial | Rotate-Select 3D | 4 formas cinzas estáticas | Ambiente espacial estrelado com nave de pesquisa, sólidos 3D texturizados e rotacionáveis pelo toque, associados a objetos do mundo real | 3.6 | **4.9** |

---

## 3. Diretriz Arquitetural: Fim do Monólito `phaser-runtime.js`

O arquivo monolítico `games-official/src/runtime/phaser-runtime.js` foi identificado como o principal causador da sensação de "jogos genéricos".
Para atingir o padrão **10/10**, a infraestrutura de jogos é decomposta em:
- `games-official/src/common/`: Módulos de infraestrutura compartilhada (Áudio suave, feedback visual, transições, cálculo de toque, pontuação e protocolo SDK).
- `games-official/src/games/`: 10 implementações totalmente independentes e especializadas com assets vetoriais ricos, lógicas de cena próprias e animações dedicadas.
