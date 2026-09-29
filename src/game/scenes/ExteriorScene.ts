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

    // 1. Neo-Tokyo Golden Hour Sky Backdrop (Y: 0 to 180)
    // Multi-layer sunset gradient from twilight violet down to glowing gold horizon
    const skyLayers = [
      { y: 15, h: 30, color: 0x2a1744 }, // Twilight Violet
      { y: 45, h: 30, color: 0x5a1f4e }, // Sunset Plum
      { y: 75, h: 30, color: 0x932b4b }, // Magenta Rose
      { y: 105, h: 30, color: 0xcc4e34 }, // Coral Orange
      { y: 135, h: 30, color: 0xf28526 }, // Warm Amber Sunset
      { y: 165, h: 30, color: 0xf8b839 }  // Golden Horizon Glow
    ];
    skyLayers.forEach(layer => {
      const rect = this.add.rectangle(640, layer.y, 1280, layer.h, layer.color);
      rect.setDepth(-20);
    });

    // Radiant Setting Sun with Soft Glowing Halo (positioned at X: 860, Y: 70)
    const sunHalo = this.add.circle(860, 70, 68, 0xf28526, 0.25);
    sunHalo.setDepth(-19);
    const sunInnerHalo = this.add.circle(860, 70, 48, 0xf8b839, 0.45);
    sunInnerHalo.setDepth(-18);
    const sunOrb = this.add.circle(860, 70, 30, 0xfff2a8, 0.95);
    sunOrb.setDepth(-17);

    // Subtle sun pulsation tween
    this.tweens.add({
      targets: sunInnerHalo,
      scale: { from: 0.95, to: 1.08 },
      alpha: { from: 0.35, to: 0.55 },
      yoyo: true,
      repeat: -1,
      duration: 3200,
      ease: 'Sine.easeInOut'
    });

    // Distant Neo-Tokyo City Skyline Silhouette
    const skylineBuildings = [
      { x: 120, w: 90, h: 95 },
      { x: 260, w: 110, h: 125 },
      { x: 400, w: 75, h: 80 },
      { x: 530, w: 95, h: 140 },
      { x: 720, w: 105, h: 110 },
      { x: 1010, w: 120, h: 130 },
      { x: 1180, w: 90, h: 90 }
    ];
    skylineBuildings.forEach(b => {
      const building = this.add.rectangle(b.x, 150 - b.h / 2, b.w, b.h, 0x1d1428);
      building.setDepth(-16);

      // Glowing golden office windows
      const cols = Math.floor(b.w / 14);
      const rows = Math.floor(b.h / 16);
      for (let r = 1; r < rows; r++) {
        for (let c = 1; c < cols; c++) {
          if ((r + c) % 2 === 0) {
            const winX = b.x - b.w / 2 + c * 14;
            const winY = 150 - b.h + r * 16;
            const winColor = (r + c) % 3 === 0 ? 0xffea88 : (r + c) % 5 === 0 ? 0x00d2e6 : 0xf28526;
            const win = this.add.rectangle(winX, winY, 6, 8, winColor, 0.7);
            win.setDepth(-15);
          }
        }
      }

      // Spire antenna on tallest towers
      if (b.h > 115) {
        const spire = this.add.rectangle(b.x, 150 - b.h - 12, 3, 24, 0x3d2b4e);
        spire.setDepth(-16);
        const beacon = this.add.circle(b.x, 150 - b.h - 24, 2.5, 0xff3355);
        beacon.setDepth(-14);
        this.tweens.add({
          targets: beacon,
          alpha: { from: 0.2, to: 1 },
          yoyo: true,
          repeat: -1,
          duration: 900
        });
      }
    });

    // Building Wall Facade (Y: 100 to 280)
    // Architecturally designed: Solid bronze panels with two grand 2-story glass window bays
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 100; y < 280; y += 32) {
        // Grand window bays on left and right wings
        const isWindowBay = ((x >= 224 && x <= 416) || (x >= 864 && x <= 1056)) && y < 240;
        const tileKey = isWindowBay ? 'wall_window' : 'exterior_wall';
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
      alpha: { from: 0.88, to: 1.0 },
      yoyo: true,
      repeat: -1,
      duration: 1800,
      ease: 'Sine.easeInOut'
    });

    // Building Entrance Arch & Doors (Center: 640, 256)
    const entranceDoors = this.add.image(640, 256, 'building_entrance');
    entranceDoors.setDepth(-1);

    // Welcoming warm light spill onto sidewalk in front of entrance
    const entranceGlow = this.add.ellipse(640, 280, 140, 48, 0xffd060, 0.22);
    entranceGlow.setDepth(-7);

    // Sidewalk (Y: 280 to 520)
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 280; y < 520; y += 32) {
        const isGrass = (x < 192 || x > 1088) && y > 340 && y < 480;
        const tileKey = isGrass ? 'exterior_grass' : 'exterior_sidewalk';
        const tile = this.add.image(x + 16, y + 16, tileKey);
        tile.setDepth(-8);
      }
    }

    // Asphalt Road (Y: 520 to 720) — ONE SINGLE CLEAN GOLDEN CENTERLINE at Y = 608!
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 520; y < 720; y += 32) {
        const tileKey = (y === 608) ? 'exterior_road_line' : 'exterior_road';
        const tile = this.add.image(x + 16, y + 16, tileKey);
        tile.setDepth(-8);
      }
    }

    // Road Guard Curb / Collision at bottom
    const roadCurb = this.add.rectangle(640, 715, 1280, 10, 0x000000, 0);
    this.physics.add.existing(roadCurb, true);
    this.obstacles.add(roadCurb);

    // Parked Futuristic Cyber-Cab at curb with Contact Drop Shadow
    const cabShadow = this.add.image(860, 574, 'shadow_contact');
    cabShadow.setScale(1.4, 0.8);
    cabShadow.setAlpha(0.7);
    cabShadow.setDepth(559);

    const cab = this.add.image(860, 560, 'cyber_cab');
    cab.setDepth(560);
    const cabCollision = this.add.rectangle(860, 564, 60, 20, 0x000000, 0);
    this.physics.add.existing(cabCollision, true);
    this.obstacles.add(cabCollision);

    // Street Lamps with Warm Amber Glow Halos and Contact Shadows
    const lampPositions = [
      { x: 340, y: 350 },
      { x: 940, y: 350 }
    ];
    lampPositions.forEach((pos) => {
      // Base shadow
      const lampShadow = this.add.image(pos.x, pos.y + 28, 'shadow_contact');
      lampShadow.setScale(0.6, 0.4);
      lampShadow.setAlpha(0.6);
      lampShadow.setDepth(pos.y - 1);

      const lamp = this.add.image(pos.x, pos.y, 'exterior_lamp');
      lamp.setDepth(pos.y);
      const base = this.add.rectangle(pos.x, pos.y + 26, 12, 10, 0x000000, 0);
      this.physics.add.existing(base, true);
      this.obstacles.add(base);

      // Warm sodium light halo illuminating sidewalk
      const lampLight = this.add.circle(pos.x, pos.y + 24, 64, 0xffba30, 0.16);
      lampLight.setDepth(-7);
      this.tweens.add({
        targets: lampLight,
        alpha: { from: 0.12, to: 0.22 },
        yoyo: true,
        repeat: -1,
        duration: 2200,
        ease: 'Sine.easeInOut'
      });
    });

    // Golden Autumn / Ginkgo Trees along sidewalk with Contact Shadows
    const treePositions = [
      { x: 230, y: 380 },
      { x: 450, y: 320 },
      { x: 830, y: 320 },
      { x: 1050, y: 380 }
    ];
    treePositions.forEach((pos) => {
      // Tree shadow
      const treeShadow = this.add.image(pos.x, pos.y + 20, 'shadow_contact');
      treeShadow.setScale(0.8, 0.5);
      treeShadow.setAlpha(0.65);
      treeShadow.setDepth(pos.y - 1);

      const tree = this.add.image(pos.x, pos.y, 'exterior_tree');
      tree.setDepth(pos.y);
      const base = this.add.rectangle(pos.x, pos.y + 16, 16, 12, 0x000000, 0);
      this.physics.add.existing(base, true);
      this.obstacles.add(base);
    });

    // Drifting Golden Autumn Leaves in the twilight breeze
    for (let i = 0; i < 18; i++) {
      const lx = Phaser.Math.Between(100, 1180);
      const ly = Phaser.Math.Between(260, 620);
      const leafColor = i % 2 === 0 ? 0xf28526 : 0xf8b839;
      const leaf = this.add.rectangle(lx, ly, 3, 2, leafColor, 0.85);
      leaf.setDepth(ly);
      this.tweens.add({
        targets: leaf,
        x: `+=${Phaser.Math.Between(40, 100)}`,
        y: `+=${Phaser.Math.Between(20, 60)}`,
        rotation: 3.14 * 2,
        duration: Phaser.Math.Between(4000, 7500),
        repeat: -1,
        yoyo: true,
        ease: 'Sine.easeInOut'
      });
    }

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

    // 🌟 Camera: 2.2x Zoom with smooth cinematic lerp tracking!
    this.cameras.main.setBounds(0, 0, 1280, 720);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
    this.cameras.main.setZoom(2.2);

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
