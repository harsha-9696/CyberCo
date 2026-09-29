// Player.ts - Player entity with 4-direction movement, animations, and sound

import Phaser from 'phaser';
import { audioSystem } from '../systems/AudioSystem';
import { eventBridge, GameEvents } from '../systems/EventBridge';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasdKeys!: {
    W: Phaser.Input.Keyboard.Key;
    A: Phaser.Input.Keyboard.Key;
    S: Phaser.Input.Keyboard.Key;
    D: Phaser.Input.Keyboard.Key;
    E: Phaser.Input.Keyboard.Key;
  };
  private moveSpeed: number = 160;
  private isMovementLocked: boolean = false;
  private lastFacing: 'down' | 'left' | 'right' | 'up' = 'down';
  private footstepTimer: number = 0;
  private shadow!: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);

    // Contact drop shadow
    this.shadow = scene.add.image(x, y + 20, 'shadow_contact');
    this.shadow.setScale(0.65, 0.45);
    this.shadow.setAlpha(0.6);
    this.shadow.setDepth(y - 1);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Collision box tuning: 20x16 near feet for crisp isometric/top-down movement
    this.setSize(20, 16);
    this.setOffset(6, 32);
    this.setCollideWorldBounds(true);
    this.setDepth(y);

    if (scene.input.keyboard) {
      this.cursors = scene.input.keyboard.createCursorKeys();
      this.wasdKeys = {
        W: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
        E: scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
      };
    }

    eventBridge.on(GameEvents.SET_PLAYER_CONTROLS_ENABLED, (enabled: boolean) => {
      this.isMovementLocked = !enabled;
      if (this.isMovementLocked && this.body) {
        this.setVelocity(0, 0);
        this.playIdle();
      }
    });
  }

  public setMovementLocked(locked: boolean) {
    this.isMovementLocked = locked;
    if (locked && this.body) {
      this.setVelocity(0, 0);
      this.playIdle();
    }
  }

  public update(time: number, delta: number) {
    // Dynamic depth sorting by Y position
    this.setDepth(this.y);
    if (this.shadow) {
      this.shadow.setPosition(this.x, this.y + 20);
      this.shadow.setDepth(this.y - 1);
    }

    if (this.isMovementLocked || !this.body) {
      return;
    }

    const left = this.cursors?.left.isDown || this.wasdKeys?.A.isDown;
    const right = this.cursors?.right.isDown || this.wasdKeys?.D.isDown;
    const up = this.cursors?.up.isDown || this.wasdKeys?.W.isDown;
    const down = this.cursors?.down.isDown || this.wasdKeys?.S.isDown;

    let vx = 0;
    let vy = 0;

    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    if (vx !== 0 && vy !== 0) {
      // Normalize diagonal movement
      const diag = 0.7071;
      vx *= diag;
      vy *= diag;
    }

    this.setVelocity(vx * this.moveSpeed, vy * this.moveSpeed);

    if (vx !== 0 || vy !== 0) {
      // Determine dominant direction
      if (Math.abs(vy) > Math.abs(vx)) {
        if (vy > 0) {
          this.lastFacing = 'down';
          this.anims.play('player_walk_down', true);
        } else {
          this.lastFacing = 'up';
          this.anims.play('player_walk_up', true);
        }
      } else {
        if (vx < 0) {
          this.lastFacing = 'left';
          this.anims.play('player_walk_left', true);
        } else {
          this.lastFacing = 'right';
          this.anims.play('player_walk_right', true);
        }
      }

      // Footstep sound
      this.footstepTimer += delta;
      if (this.footstepTimer > 320) {
        audioSystem.play('footstep');
        this.footstepTimer = 0;
      }
    } else {
      this.playIdle();
    }
  }

  public playIdle() {
    switch (this.lastFacing) {
      case 'down':
        this.setFrame(0);
        break;
      case 'left':
        this.setFrame(3);
        break;
      case 'right':
        this.setFrame(6);
        break;
      case 'up':
        this.setFrame(9);
        break;
    }
    this.anims.stop();
  }

  public getFacing(): 'down' | 'left' | 'right' | 'up' {
    return this.lastFacing;
  }
}
