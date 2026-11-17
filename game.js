
/*
 * SHADOW REBORN — Phaser 4.2.1
 * Mobile + desktop side-scroller.
 * Procedural graphics; no external game assets.
 * Multi-touch controls with release-outside handling.
 */
(() => {
  'use strict';

  const GAME_W = 1280;
  const GAME_H = 720;
  const WORLD_W = 5200;

  const COLORS = {
    ink: 0x070b14,
    sky: 0x101a2d,
    pale: 0xdce8ff,
    blue: 0x8fb9ef,
    cyan: 0x8ce8ef,
    violet: 0x9b78d4,
    red: 0xe65b68,
    gold: 0xe6c27a,
    stone: 0x1a2435,
    stoneEdge: 0x52627d
  };

  class BootScene extends Phaser.Scene {
    constructor() {
      super('Boot');
    }

    create() {
      const g = this.make.graphics({
        x: 0,
        y: 0,
        add: false
      });

      // Player texture
      g.clear();
      g.fillStyle(0x101827, 1);
      g.fillRoundedRect(18, 22, 28, 38, 9);

      g.fillStyle(0x27364d, 1);
      g.fillTriangle(21, 32, 2, 63, 31, 55);
      g.fillTriangle(43, 32, 62, 63, 34, 55);

      g.fillStyle(0x090e18, 1);
      g.fillCircle(32, 17, 14);

      g.fillStyle(0x9eb8dc, 1);
      g.fillRoundedRect(20, 10, 24, 14, 7);

      g.fillStyle(COLORS.cyan, 1);
      g.fillRect(24, 17, 6, 2);
      g.fillRect(35, 17, 6, 2);

      g.fillStyle(0x101827, 1);
      g.fillRoundedRect(19, 54, 12, 11, 3);
      g.fillRoundedRect(33, 54, 12, 11, 3);

      g.generateTexture('hero', 64, 68);

      // Wraith texture
      g.clear();
      g.fillStyle(0x28223e, 1);
      g.fillTriangle(30, 3, 3, 60, 57, 60);
      g.fillRoundedRect(11, 21, 38, 34, 12);

      g.fillStyle(0xe66b8d, 1);
      g.fillRect(18, 27, 9, 3);
      g.fillRect(34, 27, 9, 3);

      g.generateTexture('wraith', 60, 64);

      // Platform texture
      g.clear();
      g.fillStyle(COLORS.stone, 1);
      g.fillRoundedRect(0, 0, 256, 44, 5);

      g.lineStyle(2, COLORS.stoneEdge, 0.8);
      g.strokeRoundedRect(1, 1, 254, 42, 5);

      g.fillStyle(0x7185a4, 0.75);
      g.fillRect(0, 0, 256, 5);

      g.fillStyle(0x83dce8, 0.24);
      for (let x = 28; x < 245; x += 64) {
        g.fillRect(x, 5, 2, 8);
      }

      g.generateTexture('platform', 256, 44);

      // Glow texture
      g.clear();
      g.fillStyle(0xffffff, 1);
      g.fillCircle(6, 6, 6);
      g.generateTexture('glow', 12, 12);

      g.destroy();

      this.scene.start('Menu');
    }
  }

  class MenuScene extends Phaser.Scene {
    constructor() {
      super('Menu');
    }

    create() {
      this.add.rectangle(
        GAME_W / 2,
        GAME_H / 2,
        GAME_W,
        GAME_H,
        COLORS.ink
      );

      const bg = this.add.graphics();

      for (let i = 0; i < 95; i++) {
        const x = (i * 197) % GAME_W;
        const y = (i * 83) % GAME_H;

        bg.fillStyle(0x9dbce8, 0.2 + (i % 4) * 0.12);
        bg.fillCircle(x, y, i % 5 === 0 ? 2 : 1);
      }

      bg.fillStyle(0x9ebde4, 0.75);
      bg.fillCircle(1010, 145, 58);

      bg.fillStyle(0x111b31, 1);
      bg.fillCircle(1035, 125, 57);

      for (let layer = 0; layer < 3; layer++) {
        const base = 430 + layer * 62;

        bg.fillStyle(
          [0x17243b, 0x111c30, 0x0d1525][layer],
          1
        );

        bg.beginPath();
        bg.moveTo(0, GAME_H);

        for (let x = 0; x <= GAME_W; x += 70) {
          bg.lineTo(
            x,
            base + Math.sin(x * 0.012 + layer) * 45
          );
        }

        bg.lineTo(GAME_W, GAME_H);
        bg.closePath();
        bg.fillPath();
      }

      this.add.text(GAME_W / 2, 190, 'SHADOW', {
        fontFamily: 'Georgia',
        fontSize: '92px',
        fontStyle: 'bold',
        color: '#dce8ff',
        stroke: '#334c77',
        strokeThickness: 3
      })
      .setOrigin(0.5)
      .setShadow(0, 0, 28, '#6faaff', 0.8);

      this.add.text(GAME_W / 2, 275, 'REBORN', {
        fontFamily: 'Georgia',
        fontSize: '74px',
        color: '#8fb9ef',
        letterSpacing: 16
      }).setOrigin(0.5);

      this.add.text(
        GAME_W / 2,
        355,
        'THE KINGDOM REMEMBERS YOUR NAME',
        {
          fontFamily: 'Arial',
          fontSize: '14px',
          color: '#8d9db8',
          letterSpacing: 5
        }
      ).setOrigin(0.5);

      const start = this.add.text(
        GAME_W / 2,
        485,
        '[ ENTER THE FORGOTTEN REALM ]',
        {
          fontFamily: 'Arial',
          fontSize: '20px',
          color: '#e6c27a',
          letterSpacing: 3
        }
      )
      .setOrigin(0.5)
      .setPadding(18, 12, 18, 12);

      start.setInteractive({ useHandCursor: true });

      start.on('pointerover', () => {
        start.setColor('#ffffff');
      });

      start.on('pointerout', () => {
        start.setColor('#e6c27a');
      });

      start.on('pointerdown', () => {
        this.startGame();
      });

      this.add.text(
        GAME_W / 2,
        570,
        'A / D OR ARROWS  ·  SPACE TO JUMP  ·  J TO STRIKE  ·  K TO SHADOW BURST',
        {
          fontFamily: 'Arial',
          fontSize: '12px',
          color: '#71809b',
          letterSpacing: 1
        }
      ).setOrigin(0.5);

      this.add.text(
        GAME_W / 2,
        610,
        'MOBILE: ROTATE YOUR PHONE AND USE THE ON-SCREEN CONTROLS',
        {
          fontFamily: 'Arial',
          fontSize: '11px',
          color: '#7c8ba7',
          letterSpacing: 1
        }
      ).setOrigin(0.5);

      // Touch anywhere to start
      this.input.once('pointerdown', () => {
        this.startGame();
      });

      if (this.input.keyboard) {
        this.input.keyboard.once('keydown-ENTER', () => {
          this.startGame();
        });
      }
    }

    startGame() {
      if (this.starting || !this.scene.isActive('Menu')) {
        return;
      }

      this.starting = true;
      this.scene.start('Game');
    }
  }

  class GameScene extends Phaser.Scene {
    constructor() {
      super('Game');
    }

    create() {
      this.hp = 100;
      this.score = 0;
      this.dead = false;

      this.invulnerableUntil = 0;
      this.lastAttack = -10000;
      this.lastBurst = -10000;

      this.touch = {
        left: new Set(),
        right: new Set(),
        jumpPressed: false,
        attackPressed: false,
        burstPressed: false
      };

      this.physics.world.setBounds(
        0,
        0,
        WORLD_W,
        GAME_H
      );

      this.physics.world.gravity.y = 1050;

      this.createBackground();
      this.createPlatforms();

      this.player = this.physics.add.sprite(
        130,
        560,
        'hero'
      ).setDepth(10);

      this.player.setMaxVelocity(360, 900);
      this.player.setDragX(1800);
      this.player.body.setSize(27, 52).setOffset(18, 12);

      this.enemies = this.physics.add.group({
        allowGravity: true
      });

      [650, 1330, 2070, 3190, 4020, 4830].forEach(
        (x, i) => {
          this.spawnEnemy(
            x,
            570,
            i % 2 === 0 ? -1 : 1
          );
        }
      );

      this.physics.add.collider(
        this.player,
        this.platforms
      );

      this.physics.add.collider(
        this.enemies,
        this.platforms
      );

      this.physics.add.collider(
        this.player,
        this.enemies,
        () => this.hitPlayer()
      );

      this.cursors = this.input.keyboard
        ? this.input.keyboard.createCursorKeys()
        : null;

      this.keys = this.input.keyboard
        ? this.input.keyboard.addKeys(
            'A,D,W,J,K,SHIFT,ENTER,ESC'
          )
        : {};

      this.cameras.main.setBounds(
        0,
        0,
        WORLD_W,
        GAME_H
      );

      this.cameras.main.startFollow(
        this.player,
        true,
        0.08,
        0.08
      );

      this.cameras.main.setDeadzone(330, 170);
      this.cameras.main.fadeIn(500, 0, 0, 0);

      this.createHUD();
      this.createTouchControls();
      this.bindGlobalTouchRelease();

      if (this.input.keyboard) {
        this.input.keyboard.on('keydown-ESC', () => {
          this.scene.start('Menu');
        });
      }

      this.add.text(
        30,
        105,
        'CHAPTER I  /  THE ASHEN PASS',
        {
          fontFamily: 'Arial',
          fontSize: '12px',
          color: '#9baecb',
          letterSpacing: 3
        }
      )
      .setScrollFactor(0)
      .setDepth(100);

      this.showToast('THE DEAD DO NOT SLEEP', 1700);

      this.spawnTimer = this.time.addEvent({
        delay: 16000,
        loop: true,
        callback: () => {
          if (
            !this.dead &&
            this.enemies.countActive(true) < 10
          ) {
            const x = Phaser.Math.Clamp(
              this.player.x + Phaser.Math.Between(500, 850),
              100,
              WORLD_W - 100
            );

            this.spawnEnemy(
              x,
              570,
              Phaser.Math.Between(0, 1) ? 1 : -1
            );
          }
        }
      });

      this.events.once('shutdown', () => {
        this.clearTouchInputs();

        this.input.off(
          'pointerup',
          this.releaseTouchPointer,
          this
        );

        this.input.off(
          'pointerupoutside',
          this.releaseTouchPointer,
          this
        );

        this.input.off(
          'gameout',
          this.clearTouchInputs,
          this
        );

        if (this.spawnTimer) {
          this.spawnTimer.remove(false);
        }
      });
    }

    createBackground() {
      const bg = this.add.graphics()
        .setScrollFactor(0)
        .setDepth(-30);

      bg.fillGradientStyle(
        0x0b1325,
        0x0b1325,
        0x17223a,
        0x080d18,
        1
      );

      bg.fillRect(0, 0, GAME_W, GAME_H);

      bg.fillStyle(0xb8cce9, 0.5);
      bg.fillCircle(1010, 145, 48);

      bg.fillStyle(0x111a2c, 1);
      bg.fillCircle(1032, 129, 48);

      for (let layer = 0; layer < 3; layer++) {
        const factor = [0.12, 0.25, 0.42][layer];
        const color = [0x1c2b43, 0x142138, 0x101a2c][layer];

        const skyline = this.add.graphics()
          .setScrollFactor(factor)
          .setDepth(-20 + layer);

        skyline.fillStyle(color, 1);

        for (
          let x = -100;
          x < WORLD_W + 250;
          x += 340
        ) {
          const h = 150 + ((x * 17 + layer * 53) % 130);
          const w = 95 + ((x * 7 + layer * 19) % 75);
          const y = 585 - h;

          skyline.fillRect(x, y, w, h);

          skyline.fillTriangle(
            x - 15,
            y,
            x + w / 2,
            y - 45,
            x + w + 15,
            y
          );
        }
      }

      const stars = this.add.graphics()
        .setScrollFactor(0)
        .setDepth(-10);

      for (let i = 0; i < 75; i++) {
        stars.fillStyle(
          0x9dbce8,
          0.15 + (i % 4) * 0.12
        );

        stars.fillCircle(
          (i * 173) % GAME_W,
          (i * 97) % 390,
          i % 7 === 0 ? 2 : 1
        );
      }
    }

    createPlatforms() {
      this.platforms = this.physics.add.staticGroup();

      const ledges = [
        [0, 640, 900],
        [1000, 640, 700],
        [1800, 640, 900],
        [2800, 640, 800],
        [3700, 640, 800],
        [4550, 640, 650],
        [520, 535, 180],
        [790, 465, 150],
        [1190, 530, 180],
        [1510, 455, 170],
        [1960, 530, 180],
        [2250, 465, 160],
        [2600, 535, 180],
        [3100, 500, 180],
        [3400, 430, 170],
        [3900, 520, 180],
        [4200, 455, 160],
        [4700, 520, 180]
      ];

      ledges.forEach(([x, y, width]) => {
        const platform = this.platforms.create(
          x + width / 2,
          y + 22,
          'platform'
        );

        platform.setDisplaySize(width, 44);
        platform.refreshBody();
      });
    }

    spawnEnemy(x, y, direction) {
      const enemy = this.enemies.create(
        x,
        y,
        'wraith'
      );

      enemy.setDepth(8);
      enemy.setBounce(0.02);
      enemy.setDragX(500);
      enemy.setMaxVelocity(130, 800);

      enemy.body.setSize(35, 48).setOffset(12, 10);

      enemy.setData('hp', 70);
      enemy.setData('lastHit', 0);
      enemy.setData('direction', direction);

      return enemy;
    }

    createHUD() {
      this.add.rectangle(
        145,
        42,
        230,
        54,
        0x080d18,
        0.84
      )
      .setStrokeStyle(1, 0x536b91, 0.7)
      .setScrollFactor(0)
      .setDepth(100);

      this.add.text(42, 20, 'VITALITY', {
        fontFamily: 'Arial',
        fontSize: '10px',
        color: '#9fb0cb',
        letterSpacing: 2
      })
      .setScrollFactor(0)
      .setDepth(101);

      this.add.rectangle(
        145,
        54,
        190,
        8,
        0x273349
      )
      .setScrollFactor(0)
      .setDepth(101);

      this.hpFill = this.add.rectangle(
        50,
        54,
        190,
        8,
        0x83dce8
      )
      .setOrigin(0, 0.5)
      .setScrollFactor(0)
      .setDepth(102);

      this.scoreText = this.add.text(
        GAME_W - 35,
        30,
        'SOULS  0000',
        {
          fontFamily: 'Arial',
          fontSize: '15px',
          color: '#e6c27a',
          letterSpacing: 2
        }
      )
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(101);

      this.add.text(
        GAME_W / 2,
        24,
        'SHADOW REBORN',
        {
          fontFamily: 'Georgia',
          fontSize: '14px',
          color: '#a7bad8',
          letterSpacing: 5
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(101)
      .setAlpha(0.7);
    }

    createTouchControls() {
      const makeButton = (
        x,
        y,
        label,
        action,
        hold
      ) => {
        const circle = this.add.circle(
          x,
          y,
          39,
          0x17243a,
          0.82
        )
        .setStrokeStyle(2, 0x8da8d0, 0.72)
        .setScrollFactor(0)
        .setDepth(120)
        .setInteractive({ useHandCursor: false });

        this.add.text(x, y, label, {
          fontFamily: 'Arial',
          fontSize: '21px',
          color: '#e3edff'
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(121);

        circle.on('pointerdown', (pointer) => {
          if (hold) {
            this.touch[action].add(pointer.id);
          } else {
            this.touch[action] = true;
          }
        });

        return circle;
      };

      makeButton(
        65,
        GAME_H - 76,
        '◀',
        'left',
        true
      );

      makeButton(
        158,
        GAME_H - 76,
        '▶',
        'right',
        true
      );

      makeButton(
        GAME_W - 190,
        GAME_H - 76,
        'J',
        'attackPressed',
        false
      );

      makeButton(
        GAME_W - 94,
        GAME_H - 76,
        '↑',
        'jumpPressed',
        false
      );

      makeButton(
        GAME_W - 94,
        GAME_H - 168,
        'K',
        'burstPressed',
        false
      );
    }

    bindGlobalTouchRelease() {
      this.input.on(
        'pointerup',
        this.releaseTouchPointer,
        this
      );

      this.input.on(
        'pointerupoutside',
        this.releaseTouchPointer,
        this
      );

      this.input.on(
        'gameout',
        this.clearTouchInputs,
        this
      );

      if (typeof window !== 'undefined') {
        this.onWindowBlur = () => {
          this.clearTouchInputs();
        };

        window.addEventListener(
          'blur',
          this.onWindowBlur
        );

        this.events.once('shutdown', () => {
          window.removeEventListener(
            'blur',
            this.onWindowBlur
          );
        });
      }
    }

    releaseTouchPointer(pointer) {
      this.touch.left.delete(pointer.id);
      this.touch.right.delete(pointer.id);
    }

    clearTouchInputs() {
      if (!this.touch) return;

      this.touch.left.clear();
      this.touch.right.clear();

      this.touch.jumpPressed = false;
      this.touch.attackPressed = false;
      this.touch.burstPressed = false;
    }

    showToast(message, duration = 1300) {
      const toast = this.add.text(
        GAME_W / 2,
        145,
        message,
        {
          fontFamily: 'Georgia',
          fontSize: '18px',
          color: '#d9e8ff',
          letterSpacing: 4,
          stroke: '#0b1220',
          strokeThickness: 4
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(150)
      .setAlpha(0);

      this.tweens.add({
        targets: toast,
        alpha: 1,
        y: 125,
        duration: 300,
        yoyo: true,
        hold: duration,
        onComplete: () => toast.destroy()
      });
    }

    update(time, delta) {
      if (
        this.dead ||
        !this.player ||
        !this.player.active
      ) {
        return;
      }

      const player = this.player;

      const grounded =
        player.body.blocked.down ||
        player.body.touching.down;

      const leftKey =
        this.cursors &&
        this.cursors.left.isDown;

      const rightKey =
        this.cursors &&
        this.cursors.right.isDown;

      const left =
        leftKey ||
        (this.keys.A && this.keys.A.isDown) ||
        this.touch.left.size > 0;

      const right =
        rightKey ||
        (this.keys.D && this.keys.D.isDown) ||
        this.touch.right.size > 0;

      const jumpKey =
        (
          this.cursors &&
          (
            Phaser.Input.Keyboard.JustDown(this.cursors.space) ||
            Phaser.Input.Keyboard.JustDown(this.cursors.up)
          )
        ) ||
        (
          this.keys.W &&
          Phaser.Input.Keyboard.JustDown(this.keys.W)
        );

      const attackKey =
        this.keys.J &&
        Phaser.Input.Keyboard.JustDown(this.keys.J);

      const burstKey =
        this.keys.K &&
        Phaser.Input.Keyboard.JustDown(this.keys.K);

      const jump =
        !!jumpKey ||
        this.touch.jumpPressed;

      const attack =
        !!attackKey ||
        this.touch.attackPressed;

      const burst =
        !!burstKey ||
        this.touch.burstPressed;

      // Consume one-shot touch actions.
      this.touch.jumpPressed = false;
      this.touch.attackPressed = false;
      this.touch.burstPressed = false;

      if (left && !right) {
        player.setVelocityX(-285);
        player.setFlipX(true);
      } else if (right && !left) {
        player.setVelocityX(285);
        player.setFlipX(false);
      } else if (left && right) {
        player.setVelocityX(0);
      }

      if (jump && grounded) {
        player.setVelocityY(-545);

        this.spawnBurstEffect(
          player.x,
          player.y + 24,
          COLORS.cyan,
          8
        );
      }

      if (attack && time - this.lastAttack >= 420) {
        this.lastAttack = time;
        this.meleeAttack();
      }

      if (burst && time - this.lastBurst >= 2600) {
        this.lastBurst = time;
        this.shadowBurst();
      }

      this.updateEnemies(time);

      if (time >= this.invulnerableUntil) {
        player.setAlpha(1);
      } else {
        player.setAlpha(
          Math.floor(time / 75) % 2 ? 0.35 : 1
        );
      }

      this.hpFill.setSize(
        Math.max(0, 190 * this.hp / 100),
        8
      );

      this.scoreText.setText(
        'SOULS  ' + String(this.score).padStart(4, '0')
      );

      // Keep player inside horizontal world bounds.
      if (player.x < 25) {
        player.setPosition(25, player.y);
      }

      if (player.x > WORLD_W - 25) {
        player.setPosition(WORLD_W - 25, player.y);
      }

      if (player.y > GAME_H + 100) {
        this.damagePlayer(30);
      }

      if (player.x >= WORLD_W - 130) {
        this.winGame();
      }
    }

    updateEnemies(time) {
      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active) return;

        const dx = this.player.x - enemy.x;
        const distance = Math.abs(dx);

        if (distance < 420) {
          enemy.setVelocityX(
            Math.sign(dx) *
            Math.min(95, 45 + distance * 0.08)
          );

          enemy.setFlipX(dx < 0);

          if (
            distance < 48 &&
            time - enemy.getData('lastHit') > 1100
          ) {
            enemy.setData('lastHit', time);
            this.hitPlayer();
          }
        } else {
          enemy.setVelocityX(
            Math.sin(time * 0.001 + enemy.x) * 22
          );
        }
      });
    }

    meleeAttack() {
      const direction = this.player.flipX ? -1 : 1;

      const slash = this.add.ellipse(
        this.player.x + direction * 38,
        this.player.y,
        55,
        25,
        COLORS.cyan,
        0.45
      )
      .setStrokeStyle(3, 0xdafcff, 0.9)
      .setDepth(20);

      slash.setRotation(
        direction < 0 ? -0.35 : 0.35
      );

      this.tweens.add({
        targets: slash,
        alpha: 0,
        scaleX: 1.8,
        scaleY: 1.4,
        duration: 180,
        onComplete: () => slash.destroy()
      });

      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active) return;

        const dx = enemy.x - this.player.x;

        if (
          Math.abs(dx) < 100 &&
          Math.abs(enemy.y - this.player.y) < 70 &&
          Math.sign(dx) === direction
        ) {
          this.damageEnemy(enemy, 42);
        }
      });
    }

    shadowBurst() {
      this.spawnBurstEffect(
        this.player.x,
        this.player.y,
        COLORS.violet,
        28
      );

      this.cameras.main.shake(180, 0.008);

      this.enemies.children.iterate((enemy) => {
        if (!enemy || !enemy.active) return;

        const distance = Phaser.Math.Distance.Between(
          enemy.x,
          enemy.y,
          this.player.x,
          this.player.y
        );

        if (distance < 185) {
          this.damageEnemy(enemy, 55);
        }
      });

      this.player.setVelocityX(
        this.player.flipX ? -560 : 560
      );

      this.player.setVelocityY(-100);
    }

    damageEnemy(enemy, amount) {
      if (!enemy || !enemy.active) return;

      const hp = enemy.getData('hp') - amount;
      enemy.setData('hp', hp);
      enemy.setTint(0xffffff);

      this.time.delayedCall(100, () => {
        if (enemy.active) {
          enemy.clearTint();
        }
      });

      this.tweens.add({
        targets: enemy,
        x: enemy.x + (this.player.flipX ? 24 : -24),
        duration: 90,
        yoyo: true
      });

      if (hp <= 0) {
        this.spawnBurstEffect(
          enemy.x,
          enemy.y,
          COLORS.violet,
          14
        );

        enemy.destroy();
        this.score += 100;
      }
    }

    hitPlayer() {
      const now = this.time.now;

      if (
        now < this.invulnerableUntil ||
        this.dead
      ) {
        return;
      }

      this.damagePlayer(14);
    }

    damagePlayer(amount) {
      if (
        this.dead ||
        this.time.now < this.invulnerableUntil
      ) {
        return;
      }

      this.hp = Math.max(0, this.hp - amount);
      this.invulnerableUntil = this.time.now + 900;

      this.cameras.main.shake(160, 0.01);

      this.spawnBurstEffect(
        this.player.x,
        this.player.y,
        COLORS.red,
        10
      );

      if (this.hp <= 0) {
        this.loseGame();
      }
    }

    spawnBurstEffect(x, y, tint, count) {
      for (let i = 0; i < count; i++) {
        const particle = this.add.image(
          x,
          y,
          'glow'
        )
        .setTint(tint)
        .setDepth(30)
        .setScale(
          Phaser.Math.FloatBetween(0.45, 1.1)
        );

        this.tweens.add({
          targets: particle,
          x: x + Phaser.Math.Between(-75, 75),
          y: y + Phaser.Math.Between(-65, 65),
          alpha: 0,
          scale: 0,
          duration: Phaser.Math.Between(220, 520),
          onComplete: () => particle.destroy()
        });
      }
    }

    showEndScreen(title, subtitle) {
      this.dead = true;
      this.clearTouchInputs();

      this.add.rectangle(
        GAME_W / 2,
        GAME_H / 2,
        GAME_W,
        GAME_H,
        0x05070d,
        0.88
      )
      .setScrollFactor(0)
      .setDepth(200);

      this.add.text(
        GAME_W / 2,
        260,
        title,
        {
          fontFamily: 'Georgia',
          fontSize: '40px',
          color: '#dceaff',
          align: 'center',
          wordWrap: { width: 1000 }
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(201);

      this.add.text(
        GAME_W / 2,
        350,
        subtitle,
        {
          fontFamily: 'Arial',
          fontSize: '17px',
          align: 'center',
          color: '#aebbd1',
          lineSpacing: 12
        }
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(201);

      if (this.input.keyboard) {
        this.input.keyboard.once(
          'keydown-ENTER',
          () => this.scene.restart()
        );
      }

      this.input.once('pointerdown', () => {
        this.scene.restart();
      });
    }

    loseGame() {
      this.showEndScreen(
        'YOUR LIGHT HAS FADED',
        'SOULS COLLECTED  ' + this.score +
        '\n\nTAP THE SCREEN OR PRESS ENTER TO RISE AGAIN'
      );
    }

    winGame() {
      if (this.dead) return;

      this.showEndScreen(
        'THE SHADOW ENDURES',
        'CHAPTER I COMPLETE\nSOULS  ' + this.score +
        '\n\nTAP THE SCREEN OR PRESS ENTER TO PLAY AGAIN'
      );
    }
  }

  const config = {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: '#080d18',
    width: GAME_W,
    height: GAME_H,

    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_W,
      height: GAME_H
    },

    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1050 },
        debug: false
      }
    },

    input: {
      activePointers: 5
    },

    scene: [
      BootScene,
      MenuScene,
      GameScene
    ],

    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false
    }
  };

  function startGame() {
    const loading = document.getElementById('loading');

    if (!window.Phaser) {
      if (loading) {
        loading.innerHTML =
          'PHASER FAILED TO LOAD<span>CHECK YOUR INTERNET CONNECTION</span>';
      }
      return;
    }

    try {
      const game = new Phaser.Game(config);

      game.events.once('ready', () => {
        if (!loading) return;

        loading.style.opacity = '0';

        window.setTimeout(() => {
          loading.remove();
        }, 900);
      });

    } catch (error) {
      console.error(
        'SHADOW REBORN failed to initialize:',
        error
      );

      if (loading) {
        loading.textContent =
          'GAME FAILED TO START — RELOAD THE PAGE';
      }
    }
  }

  
  if (document.readyState === 'loading') {
    window.addEventListener(
      'DOMContentLoaded',
      startGame,
      { once: true }
    );
  } else {
    startGame();
  }
})();
