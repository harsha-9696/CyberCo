// PreloadScene.ts - Loads pixel art assets and registers sprite animations

import Phaser from 'phaser';
import { gameState } from '../systems/GameState';
import { eventBridge, GameEvents } from '../systems/EventBridge';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Environment
    this.load.image('floor_office', '/assets/environment/floor_office.png');
    this.load.image('floor_marble', '/assets/environment/floor_marble.png');
    this.load.image('floor_dark', '/assets/environment/floor_dark.png');
    this.load.image('floor_carpet', '/assets/environment/floor_carpet.png');
    this.load.image('wall_office', '/assets/environment/wall_office.png');
    this.load.image('wall_window', '/assets/environment/wall_window.png');
    this.load.image('door_office', '/assets/environment/door_office.png');
    this.load.image('exterior_sidewalk', '/assets/environment/exterior_sidewalk.png');
    this.load.image('exterior_road', '/assets/environment/exterior_road.png');
    this.load.image('exterior_road_line', '/assets/environment/exterior_road_line.png');
    this.load.image('exterior_grass', '/assets/environment/exterior_grass.png');
    this.load.image('exterior_wall', '/assets/environment/exterior_wall.png');
    this.load.image('exterior_sign', '/assets/environment/exterior_sign.png');
    this.load.image('exterior_lamp', '/assets/environment/exterior_lamp.png');
    this.load.image('exterior_tree', '/assets/environment/exterior_tree.png');
    this.load.image('building_entrance', '/assets/environment/building_entrance.png');
    this.load.image('cyber_cab', '/assets/environment/cyber_cab.png');
    this.load.image('shadow_contact', '/assets/environment/shadow_contact.png');

    // Objects
    this.load.image('desk', '/assets/objects/desk.png');
    this.load.image('desk_with_pc', '/assets/objects/desk_with_pc.png');
    this.load.image('chair', '/assets/objects/chair.png');
    this.load.image('server_rack', '/assets/objects/server_rack.png');
    this.load.image('plant', '/assets/objects/plant.png');
    this.load.image('water_dispenser', '/assets/objects/water_dispenser.png');
    this.load.image('whiteboard', '/assets/objects/whiteboard.png');
    this.load.image('filing_cabinet', '/assets/objects/filing_cabinet.png');
    this.load.image('security_camera', '/assets/objects/security_camera.png');

    // UI
    this.load.image('prompt_e', '/assets/ui/prompt_e.png');
    this.load.image('badge_risk', '/assets/ui/badge_risk.png');
    this.load.image('badge_awareness', '/assets/ui/badge_awareness.png');
    this.load.image('badge_clue', '/assets/ui/badge_clue.png');
    this.load.image('badge_mfa', '/assets/ui/badge_mfa.png');
    this.load.image('badge_password', '/assets/ui/badge_password.png');
    this.load.image('badge_website', '/assets/ui/badge_website.png');

    // Spritesheets (32x48 per frame)
    this.load.spritesheet('player', '/assets/characters/player.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('manager', '/assets/characters/manager.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('receptionist', '/assets/characters/receptionist.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.spritesheet('it_tech', '/assets/characters/it_tech.png', {
      frameWidth: 32,
      frameHeight: 48
    });
  }

  create() {
    this.createCharacterAnimations('player');
    this.createCharacterAnimations('manager');
    this.createCharacterAnimations('receptionist');
    this.createCharacterAnimations('it_tech');

    const state = gameState.getState();
    const nextScene = state.currentScene === 'Office' ? 'OfficeScene' : 'ExteriorScene';

    eventBridge.emit(GameEvents.SCENE_READY, nextScene);
    this.scene.start(nextScene);
  }

  private createCharacterAnimations(key: string) {
    this.anims.create({
      key: `${key}_walk_down`,
      frames: this.anims.generateFrameNumbers(key, { frames: [0, 1, 0, 2] }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: `${key}_walk_left`,
      frames: this.anims.generateFrameNumbers(key, { frames: [3, 4, 3, 5] }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: `${key}_walk_right`,
      frames: this.anims.generateFrameNumbers(key, { frames: [6, 7, 6, 8] }),
      frameRate: 7,
      repeat: -1
    });

    this.anims.create({
      key: `${key}_walk_up`,
      frames: this.anims.generateFrameNumbers(key, { frames: [9, 10, 9, 11] }),
      frameRate: 7,
      repeat: -1
    });
  }
}
