// ExteriorScene.ts - Outside the CYBER CO headquarters at night

import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { gameState } from '../systems/GameState';
import { eventBridge, GameEvents } from '../systems/EventBridge';
import { audioSystem } from '../systems/AudioSystem';

export class ExteriorScene extends Phaser.Scene {
  private player!: Player;
  private entranceZone!: Phaser.GameObjects.Zone;
  private isNearEntrance: boolean = false;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private promptSprite!: Phaser.GameObjects.Sprite;
  private keyE!: Phaser.Input.Keyboard.Key;

  constructor() {
    super('ExteriorScene');
  }

  create() {
    // 1. Build Background & Map (World bounds: 1280 x 720)
    this.physics.world.setBounds(0, 0, 1280, 720);
    this.obstacles = this.physics.add.staticGroup();

    // Night Sky / Top Backdrop
    const sky = this.add.rectangle(640, 80, 1280, 160, 0x0a0e16);
    sky.setDepth(-10);

    // Stars / City Lights in distant background
    for (let i = 0; i < 40; i++) {
      const rx = Phaser.Math.Between(20, 1260);
      const ry = Phaser.Math.Between(10, 110);
      const color = i % 3 === 0 ? 0x00d2e6 : i % 5 === 0 ? 0xf5aa28 : 0xffffff;
      const alpha = Phaser.Math.FloatBetween(0.3, 0.9);
      const star = this.add.rectangle(rx, ry, 2, 2, color, alpha);
      star.setDepth(-9);
    }

    // Building Wall Facade (Y: 100 to 280)
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 100; y < 280; y += 32) {
        // Windows scattered on facade
        const isWindow = (x % 96 === 32 || x % 96 === 64) && y < 220;
        const tileKey = isWindow ? 'wall_window' : 'exterior_wall';
        const tile = this.add.image(x + 16, y + 16, tileKey);
        tile.setDepth(-5);
      }
    }

    // Solid collision barrier across the building facade
    const facadeLeft = this.add.rectangle(290, 250, 580, 40, 0x000000, 0);
    this.physics.add.existing(facadeLeft, true);
    this.obstacles.add(facadeLeft);

    const facadeRight = this.add.rectangle(990, 250, 580, 40, 0x000000, 0);
    this.physics.add.existing(facadeRight, true);
    this.obstacles.add(facadeRight);

    // CYBER CO Neon Building Sign (Center: 640, 175)
    const sign = this.add.image(640, 175, 'exterior_sign');
    sign.setScale(1.25);
    sign.setDepth(-2);

    // Subtle neon pulse animation on sign
    this.tweens.add({
      targets: sign,
      alpha: { from: 0.85, to: 1.0 },
      yoyo: true,
      repeat: -1,
      duration: 1800,
      ease: 'Sine.easeInOut'
    });

    // Building Entrance Arch & Doors (Center: 640, 256)
    const entranceDoors = this.add.image(640, 256, 'building_entrance');
    entranceDoors.setDepth(-1);

    // Sidewalk (Y: 280 to 520)
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 280; y < 520; y += 32) {
        const isGrass = (x < 192 || x > 1088) && y > 340 && y < 480;
        const tileKey = isGrass ? 'exterior_grass' : 'exterior_sidewalk';
        const tile = this.add.image(x + 16, y + 16, tileKey);
        tile.setDepth(-8);
      }
    }

    // Asphalt Road (Y: 520 to 720)
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 520; y < 720; y += 32) {
        const tile = this.add.image(x + 16, y + 16, 'exterior_road');
        tile.setDepth(-8);
      }
    }

    // Road Guard Curb / Collision at bottom
    const roadCurb = this.add.rectangle(640, 715, 1280, 10, 0x000000, 0);
    this.physics.add.existing(roadCurb, true);
    this.obstacles.add(roadCurb);

    // Street Lamps with Warm Amber Glow
    const lampPositions = [
      { x: 340, y: 350 },
      { x: 940, y: 350 }
    ];
    lampPositions.forEach((pos) => {
      const lamp = this.add.image(pos.x, pos.y, 'exterior_lamp');
      lamp.setDepth(pos.y);
      const base = this.add.rectangle(pos.x, pos.y + 26, 12, 10, 0x000000, 0);
      this.physics.add.existing(base, true);
      this.obstacles.add(base);
    });

    // Potted / Decorative Trees along sidewalk
    const treePositions = [
      { x: 230, y: 380 },
      { x: 450, y: 320 },
      { x: 830, y: 320 },
      { x: 1050, y: 380 }
    ];
    treePositions.forEach((pos) => {
      const tree = this.add.image(pos.x, pos.y, 'exterior_tree');
      tree.setDepth(pos.y);
      const base = this.add.rectangle(pos.x, pos.y + 16, 16, 12, 0x000000, 0);
      this.physics.add.existing(base, true);
      this.obstacles.add(base);
    });

    // 2. Entrance Interaction Zone
    this.entranceZone = this.add.zone(640, 276, 72, 40);
    this.physics.add.existing(this.entranceZone, true);

    // Floating Interaction Prompt
    this.promptSprite = this.add.sprite(640, 230, 'prompt_e');
    this.promptSprite.setVisible(false);
    this.promptSprite.setDepth(1000);

    // Subtle bobbing animation on prompt
    this.tweens.add({
      targets: this.promptSprite,
      y: { from: 228, to: 234 },
      yoyo: true,
      repeat: -1,
      duration: 600,
      ease: 'Sine.easeInOut'
    });

    // 3. Player Spawn
    const savedState = gameState.getState();
    const spawnX = savedState.currentScene === 'Exterior' && savedState.playerCoords.x ? savedState.playerCoords.x : 640;
    const spawnY = savedState.currentScene === 'Exterior' && savedState.playerCoords.y ? savedState.playerCoords.y : 460;

    this.player = new Player(this, spawnX, spawnY);
    this.physics.add.collider(this.player, this.obstacles);

    // Camera follow with smooth pixel-perfect clamping
    this.cameras.main.setBounds(0, 0, 1280, 720);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1.0);

    // Keyboard 'E' for interaction
    if (this.input.keyboard) {
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    // Camera fade in from black
    this.cameras.main.fadeIn(800, 0, 0, 0);

    // Update GameState
    gameState.updateState({
      currentScene: 'Exterior',
      currentObjective: 'Walk up and enter the CYBER CO building'
    });

    eventBridge.emit(GameEvents.SCENE_READY, 'ExteriorScene');
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);

    // Check distance to entrance
    const distToEntrance = Phaser.Math.Distance.Between(
      this.player.x,
      this.player.y,
      this.entranceZone.x,
      this.entranceZone.y
    );

    if (distToEntrance < 64) {
      if (!this.isNearEntrance) {
        this.isNearEntrance = true;
        this.promptSprite.setPosition(this.entranceZone.x, this.entranceZone.y - 45);
        this.promptSprite.setVisible(true);
        eventBridge.emit(GameEvents.SHOW_INTERACTION, {
          visible: true,
          text: 'ENTER BUILDING',
          actionKey: 'E'
        });
      }

      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        this.enterBuilding();
      }
    } else {
      if (this.isNearEntrance) {
        this.isNearEntrance = false;
        this.promptSprite.setVisible(false);
        eventBridge.emit(GameEvents.HIDE_INTERACTION);
      }
    }
  }

  private enterBuilding() {
    this.player.setMovementLocked(true);
    audioSystem.play('door');
    audioSystem.play('interaction');

    this.promptSprite.setVisible(false);
    eventBridge.emit(GameEvents.HIDE_INTERACTION);

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      gameState.updateState({
        currentScene: 'Office',
        playerCoords: { x: 640, y: 640 },
        currentObjective: 'Report to Manager Marcus Vance in the main office'
      });
      this.scene.start('OfficeScene');
    });
  }
}
