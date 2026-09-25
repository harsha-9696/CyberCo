// BootScene.ts - Sets up renderer settings and starts preloading

import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Basic setup if any
  }

  create() {
    // Ensure nearest-neighbor pixel art rendering
    this.game.canvas.style.imageRendering = 'pixelated';
    this.scene.start('PreloadScene');
  }
}
