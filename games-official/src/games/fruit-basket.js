// Cesta de Frutas — Feira da Cesta
(() => {
  const { C, FONT } = window.AprincarConstants;
  const FRUIT_TYPES = ['apple', 'orange', 'strawberry', 'banana'];

  class FruitBasketScene extends window.AprincarBaseScene {
    nextRound() {
      this.clearRound();
      this.levelText.setText(`Fase ${this.level}`);
      const seed = (Date.now() % 100000) + this.level * 97;
      const rng = createSeededRandom(seed);
      this.challenge = generateCountingChallenge({ rng, seed, level: this.level, theme: 'fruit' });
      this.selected = 0;

      this.promptText.setText(`Coloque ${this.challenge.answer} frutas na cesta`);

      // Cesta de Vime no Centro Inferior
      const basketContainer = this.add.container(480, 430);
      const basketGfx = this.add.graphics();
      // Corpo da cesta
      basketGfx.fillStyle(0xc98749, 1);
      basketGfx.fillRoundedRect(-140, -45, 280, 90, 16);
      basketGfx.lineStyle(4, 0x8f5b2c, 1);
      basketGfx.strokeRoundedRect(-140, -45, 280, 90, 16);
      // Detalhe de trançado
      basketGfx.lineStyle(2, 0x8f5b2c, 0.45);
      for (let x = -110; x <= 110; x += 30) {
        basketGfx.lineBetween(x, -40, x, 40);
      }
      this.counter = this.add.text(0, 0, '0', { fontFamily: FONT, fontSize: '46px', fontStyle: 'bold', color: '#ffffff' }).setOrigin(0.5);
      basketContainer.add([basketGfx, this.counter]);
      this.roundGroup.add(basketContainer);

      // Frutas na bancada superior
      const count = Math.min(10, this.challenge.answer + 3);
      for (let i = 0; i < count; i++) {
        const x = 200 + (i % 5) * 140;
        const y = 205 + Math.floor(i / 5) * 90;
        const fruitType = FRUIT_TYPES[i % FRUIT_TYPES.length];

        const fruitContainer = this.add.container(x, y);
        const fruitGfx = this.add.graphics();
        window.AprincarVectorArt.drawFruit(fruitGfx, fruitType, 0, 0, 58);
        const hitZone = this.add.circle(0, 0, 38, 0xffffff, 0.001).setInteractive({ draggable: true, useHandCursor: true });
        this.input.setDraggable(hitZone);
        fruitContainer.add([fruitGfx, hitZone]);
        this.roundGroup.add(fruitContainer);

        this.target(`fruit-${i + 1}`, x, y, 76, 76, 'drag-source');
        this.target(`fruit-${i + 1}`, x, y, 76, 76, 'toggle');
        hitZone.on('drag', (_pointer, _gameObject, dragX, dragY) => {
          fruitContainer.x = dragX;
          fruitContainer.y = dragY;
        });
        hitZone.on('dragend', (_pointer, _gameObject) => {
          const inBasket = Phaser.Geom.Rectangle.Contains(new Phaser.Geom.Rectangle(340, 365, 280, 130), fruitContainer.x, fruitContainer.y);
          const picked = fruitContainer.getData('picked') === true;
          if (inBasket && !picked) {
            fruitContainer.setData('picked', true);
            this.selected += 1;
            this.tweens.add({ targets: basketContainer, scale: 1.06, duration: 100, yoyo: true });
            if (window.AprincarAudio) window.AprincarAudio.drop();
          } else if (!inBasket && picked) {
            fruitContainer.setData('picked', false);
            this.selected = Math.max(0, this.selected - 1);
            if (window.AprincarAudio) window.AprincarAudio.pop();
          }
          this.counter.setText(String(this.selected));
          this.updateState({ selectedCount: this.selected, lastGesture: 'drag', inputReady: true });
        });
        hitZone.on('pointerup', (pointer) => {
          if (pointer.getDistance?.() > 8) return;
          if (fruitContainer.getData('picked') === true) {
            fruitContainer.setData('picked', false);
            this.selected = Math.max(0, this.selected - 1);
            fruitContainer.x = x;
            fruitContainer.y = y;
            this.counter.setText(String(this.selected));
            this.updateState({ selectedCount: this.selected, lastGesture: 'tap-remove', inputReady: true });
            return;
          }
          fruitContainer.setData('picked', true);
          fruitContainer.x = 480 + (this.selected % 5) * 36 - 72;
          fruitContainer.y = 410;
          this.selected += 1;
          this.counter.setText(String(this.selected));
          this.updateState({ selectedCount: this.selected, lastGesture: 'tap-fallback', inputReady: true });
        });
      }

      // Botão de Conferir
      this.target('basket', 480, 430, 300, 150, 'drop-zone');
      const check = this.addCardButton(480, 535, 200, 60, 'Conferir', '__check__', C.sun, 'action');
      check.removeAllListeners('pointerup');
      check.on('pointerup', () => {
        const ok = this.selected === this.challenge.answer;
        this.submitResult(ok, { selected: this.selected, target: this.challenge.answer });
      });

      window.__APRINCAR_GAME_STATE__ = {
        mode: 'counting',
        variant: 'fruit',
        level: this.level,
        challenge: this.challenge,
        targets: this.testTargets,
        inputReady: true
      };
    }
  }

  new Phaser.Game({
    type: Phaser.AUTO,
    width: 960,
    height: 640,
    parent: 'game',
    backgroundColor: '#f7f6f2',
    scene: [FruitBasketScene],
    scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
    input: { activePointers: 3 },
    render: { antialias: true }
  });
})();
