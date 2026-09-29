// NPC.ts - NPC entity for non-player characters in the office

import Phaser from 'phaser';

export class NPC extends Phaser.Physics.Arcade.Sprite {
  public npcId: string;
  public npcName: string;
  private defaultFacing: 'down' | 'left' | 'right' | 'up';

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    npcId: string,
    npcName: string,
    defaultFacing: 'down' | 'left' | 'right' | 'up' = 'down'
  ) {
    super(scene, x, y, texture);
    this.npcId = npcId;
    this.npcName = npcName;
    this.defaultFacing = defaultFacing;

    scene.add.existing(this);
    scene.physics.add.existing(this, true); // Static body

    // Contact drop shadow
    const shadow = scene.add.image(x, y + 20, 'shadow_contact');
    shadow.setScale(0.65, 0.45);
    shadow.setAlpha(0.6);
    shadow.setDepth(y - 1);

    this.setSize(20, 16);
    this.setOffset(6, 32);
    this.setDepth(y);

    this.faceDirection(defaultFacing);
  }

  public faceDirection(dir: 'down' | 'left' | 'right' | 'up') {
    switch (dir) {
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
  }

  public facePlayer(playerX: number, playerY: number) {
    const dx = playerX - this.x;
    const dy = playerY - this.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      this.faceDirection(dx < 0 ? 'left' : 'right');
    } else {
      this.faceDirection(dy < 0 ? 'up' : 'down');
    }
  }

  public resetFacing() {
    this.faceDirection(this.defaultFacing);
  }
}
