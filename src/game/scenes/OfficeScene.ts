// OfficeScene.ts - Interior of the CYBER CO Headquarters

import Phaser from 'phaser';
import { Player } from '../entities/Player';
import { NPC } from '../entities/NPC';
import { gameState } from '../systems/GameState';
import { eventBridge, GameEvents } from '../systems/EventBridge';
import { audioSystem } from '../systems/AudioSystem';
import { SPEAKERS, DIALOGUES } from '../data/gameContent';

interface InteractableObject {
  id: string;
  name: string;
  x: number;
  y: number;
  radius: number;
  actionText: string;
  onInteract: () => void;
}

export class OfficeScene extends Phaser.Scene {
  private player!: Player;
  private obstacles!: Phaser.Physics.Arcade.StaticGroup;
  private interactables: InteractableObject[] = [];
  private currentInteractable: InteractableObject | null = null;
  private promptSprite!: Phaser.GameObjects.Sprite;
  private keyE!: Phaser.Input.Keyboard.Key;

  // NPCs
  private managerNPC!: NPC;
  private receptionistNPC!: NPC;
  private itTechNPC!: NPC;

  constructor() {
    super('OfficeScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, 1280, 720);
    this.obstacles = this.physics.add.staticGroup();
    this.interactables = [];
    this.currentInteractable = null;

    // 1. Render Office Flooring (1280 x 720)
    for (let x = 0; x < 1280; x += 32) {
      for (let y = 0; y < 720; y += 32) {
        let floorTile = 'floor_office';
        // IT / Server room has dark cyber floor
        if (x >= 768 && y <= 512) {
          floorTile = 'floor_dark';
        }
        // Manager's office has executive carpet
        else if (x <= 736 && y <= 224) {
          floorTile = 'floor_carpet';
        }
        const f = this.add.image(x + 16, y + 16, floorTile);
        f.setDepth(-10);
      }
    }

    // 2. Build Perimeter and Interior Partition Walls
    this.buildWalls();

    // 3. Build Props and Furniture
    this.buildFurniture();

    // 4. Spawn NPCs
    this.spawnNPCs();

    // 5. Spawn Player
    const savedState = gameState.getState();
    const spawnX = savedState.currentScene === 'Office' && savedState.playerCoords.x ? savedState.playerCoords.x : 640;
    const spawnY = savedState.currentScene === 'Office' && savedState.playerCoords.y ? savedState.playerCoords.y : 620;

    this.player = new Player(this, spawnX, spawnY);
    this.physics.add.collider(this.player, this.obstacles);

    // Camera follow with boundaries
    this.cameras.main.setBounds(0, 0, 1280, 720);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.fadeIn(500, 0, 0, 0);

    // Floating Interaction Prompt
    this.promptSprite = this.add.sprite(0, 0, 'prompt_e');
    this.promptSprite.setVisible(false);
    this.promptSprite.setDepth(1000);

    this.tweens.add({
      targets: this.promptSprite,
      y: '+=4',
      yoyo: true,
      repeat: -1,
      duration: 600,
      ease: 'Sine.easeInOut'
    });

    if (this.input.keyboard) {
      this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    // Setup Interactable Targets
    this.setupInteractables();

    eventBridge.emit(GameEvents.SCENE_READY, 'OfficeScene');
  }

  private buildWalls() {
    // Outer perimeter walls
    // Top wall
    for (let x = 0; x < 1280; x += 32) {
      const isWindow = x % 96 === 32 || x % 96 === 64;
      const w = this.add.image(x + 16, 16, isWindow ? 'wall_window' : 'wall_office');
      w.setDepth(-5);
    }
    const topCollision = this.add.rectangle(640, 24, 1280, 32, 0x000000, 0);
    this.physics.add.existing(topCollision, true);
    this.obstacles.add(topCollision);

    // Bottom wall (with exit opening at 608 to 672)
    for (let x = 0; x < 1280; x += 32) {
      if (x < 608 || x > 672) {
        const w = this.add.image(x + 16, 704, 'wall_office');
        w.setDepth(704);
      } else {
        const d = this.add.image(x + 16, 704, 'door_office');
        d.setDepth(704);
      }
    }
    const botLeft = this.add.rectangle(300, 704, 608, 32, 0x000000, 0);
    this.physics.add.existing(botLeft, true);
    this.obstacles.add(botLeft);

    const botRight = this.add.rectangle(980, 704, 608, 32, 0x000000, 0);
    this.physics.add.existing(botRight, true);
    this.obstacles.add(botRight);

    // Left outer wall
    for (let y = 32; y < 704; y += 32) {
      const w = this.add.image(16, y + 16, 'wall_office');
      w.setDepth(-5);
    }
    const leftCol = this.add.rectangle(16, 360, 32, 720, 0x000000, 0);
    this.physics.add.existing(leftCol, true);
    this.obstacles.add(leftCol);

    // Right outer wall
    for (let y = 32; y < 704; y += 32) {
      const w = this.add.image(1264, y + 16, 'wall_office');
      w.setDepth(-5);
    }
    const rightCol = this.add.rectangle(1264, 360, 32, 720, 0x000000, 0);
    this.physics.add.existing(rightCol, true);
    this.obstacles.add(rightCol);

    // Interior Divider 1: Horizontal wall separating Manager Office from Main Office (Y = 224, from X = 32 to 736)
    // Doorway opening at X: 416 to 480
    for (let x = 32; x < 736; x += 32) {
      if (x < 416 || x > 480) {
        const w = this.add.image(x + 16, 224, 'wall_office');
        w.setDepth(224);
      }
    }
    const mgrWallLeft = this.add.rectangle(224, 224, 384, 24, 0x000000, 0);
    this.physics.add.existing(mgrWallLeft, true);
    this.obstacles.add(mgrWallLeft);

    const mgrWallRight = this.add.rectangle(608, 224, 256, 24, 0x000000, 0);
    this.physics.add.existing(mgrWallRight, true);
    this.obstacles.add(mgrWallRight);

    // Interior Divider 2: Vertical wall separating Main Office from IT Room (X = 736, Y = 32 to 512)
    // Doorway opening at Y: 320 to 384
    for (let y = 32; y < 512; y += 32) {
      if (y < 320 || y > 384) {
        const w = this.add.image(736, y + 16, 'wall_office');
        w.setDepth(y + 16);
      }
    }
    const itWallTop = this.add.rectangle(736, 176, 24, 288, 0x000000, 0);
    this.physics.add.existing(itWallTop, true);
    this.obstacles.add(itWallTop);

    const itWallBot = this.add.rectangle(736, 448, 24, 128, 0x000000, 0);
    this.physics.add.existing(itWallBot, true);
    this.obstacles.add(itWallBot);

    // Horizontal partition separating Main Office from Reception Lobby (Y = 512, X = 32 to 736)
    // Wide opening in center for corridor
    for (let x = 32; x < 736; x += 32) {
      if (x < 288 || x > 544) {
        const w = this.add.image(x + 16, 512, 'wall_office');
        w.setDepth(512);
      }
    }
    const recWallLeft = this.add.rectangle(160, 512, 256, 24, 0x000000, 0);
    this.physics.add.existing(recWallLeft, true);
    this.obstacles.add(recWallLeft);

    const recWallRight = this.add.rectangle(640, 512, 192, 24, 0x000000, 0);
    this.physics.add.existing(recWallRight, true);
    this.obstacles.add(recWallRight);
  }

  private buildFurniture() {
    const addObstacleProp = (x: number, y: number, key: string, w: number, h: number, offY = 0) => {
      const sprite = this.add.image(x, y, key);
      sprite.setDepth(y);
      const col = this.add.rectangle(x, y + offY, w, h, 0x000000, 0);
      this.physics.add.existing(col, true);
      this.obstacles.add(col);
      return sprite;
    };

    // 1. Reception Lobby
    // Reception Desk (64x32)
    addObstacleProp(640, 580, 'desk', 60, 24, 4);
    // Receptionist Chair
    this.add.image(640, 555, 'chair').setDepth(555);
    // Decorative Plants
    addObstacleProp(520, 580, 'plant', 20, 20, 10);
    addObstacleProp(760, 580, 'plant', 20, 20, 10);
    // Waiting Lounge Chairs
    this.add.image(420, 660, 'chair').setDepth(660);
    this.add.image(470, 660, 'chair').setDepth(660);

    // 2. Main Office Area
    // PLAYER WORKSTATION (X: 360, Y: 360) -> Special glowing workstation desk!
    const playerDesk = addObstacleProp(360, 360, 'desk_with_pc', 60, 26, 4);
    this.add.image(360, 395, 'chair').setDepth(395);

    // Highlight beacon over player workstation
    const beacon = this.add.circle(360, 360, 34, 0x00d2e6, 0.15);
    beacon.setDepth(359);
    this.tweens.add({
      targets: beacon,
      scale: { from: 0.9, to: 1.15 },
      alpha: { from: 0.1, to: 0.3 },
      yoyo: true,
      repeat: -1,
      duration: 1200
    });

    // Other Colleague Desks
    addObstacleProp(560, 360, 'desk_with_pc', 60, 26, 4);
    this.add.image(560, 395, 'chair').setDepth(395);

    addObstacleProp(360, 460, 'desk', 60, 24, 4);
    this.add.image(360, 495, 'chair').setDepth(495);

    addObstacleProp(560, 460, 'desk', 60, 24, 4);
    this.add.image(560, 495, 'chair').setDepth(495);

    // Water Dispenser
    addObstacleProp(120, 470, 'water_dispenser', 20, 24, 10);
    // Filing Cabinets
    addObstacleProp(100, 270, 'filing_cabinet', 24, 24, 10);
    addObstacleProp(140, 270, 'filing_cabinet', 24, 24, 10);
    // Plants
    addObstacleProp(80, 470, 'plant', 20, 20, 10);

    // 3. Manager's Office
    // Executive Desk
    addObstacleProp(380, 140, 'desk_with_pc', 60, 26, 4);
    this.add.image(380, 110, 'chair').setDepth(110);
    // Incident Briefing Whiteboard (64x32)
    addObstacleProp(540, 60, 'whiteboard', 60, 20, 0);
    // Executive filing & plant
    addObstacleProp(120, 90, 'filing_cabinet', 24, 24, 10);
    addObstacleProp(160, 90, 'plant', 20, 20, 10);

    // 4. IT & Server Room
    // IT Tech Workstation
    addObstacleProp(880, 340, 'desk_with_pc', 60, 26, 4);
    this.add.image(880, 375, 'chair').setDepth(375);

    // Enterprise Server Racks
    addObstacleProp(1080, 120, 'server_rack', 28, 48, 8);
    addObstacleProp(1130, 120, 'server_rack', 28, 48, 8);
    addObstacleProp(1080, 220, 'server_rack', 28, 48, 8);
    addObstacleProp(1130, 220, 'server_rack', 28, 48, 8);
    addObstacleProp(1080, 320, 'server_rack', 28, 48, 8);
    addObstacleProp(1130, 320, 'server_rack', 28, 48, 8);

    // Security Dome Camera
    this.add.image(1200, 60, 'security_camera').setDepth(200);
  }

  private spawnNPCs() {
    // 1. Manager Marcus Vance (in Manager's Office, facing down/front)
    this.managerNPC = new NPC(this, 380, 110, 'manager', 'manager', 'Marcus Vance', 'down');
    this.obstacles.add(this.managerNPC);

    // 2. Receptionist Elena (at Reception Desk, facing down)
    this.receptionistNPC = new NPC(this, 640, 555, 'receptionist', 'receptionist', 'Elena Rostova', 'down');
    this.obstacles.add(this.receptionistNPC);

    // 3. IT Technician Devon Reed (in IT room, facing left)
    this.itTechNPC = new NPC(this, 880, 375, 'it_tech', 'itTech', 'Devon Reed', 'up');
    this.obstacles.add(this.itTechNPC);
  }

  private setupInteractables() {
    // 1. Manager Marcus Vance
    this.interactables.push({
      id: 'npc_manager',
      name: 'Manager Marcus Vance',
      x: 380,
      y: 130,
      radius: 64,
      actionText: 'TALK TO MARCUS VANCE',
      onInteract: () => this.handleManagerDialogue()
    });

    // 2. Receptionist Elena
    this.interactables.push({
      id: 'npc_receptionist',
      name: 'Elena Rostova',
      x: 640,
      y: 575,
      radius: 56,
      actionText: 'TALK TO RECEPTIONIST',
      onInteract: () => {
        this.receptionistNPC.facePlayer(this.player.x, this.player.y);
        audioSystem.play('dialogue');
        eventBridge.emit(GameEvents.START_DIALOGUE, {
          speaker: SPEAKERS.receptionist,
          lines: DIALOGUES.receptionistGreeting
        });
      }
    });

    // 3. IT Tech Devon Reed
    this.interactables.push({
      id: 'npc_it_tech',
      name: 'Devon Reed',
      x: 880,
      y: 350,
      radius: 56,
      actionText: 'TALK TO IT SPECIALIST',
      onInteract: () => {
        this.itTechNPC.facePlayer(this.player.x, this.player.y);
        audioSystem.play('dialogue');

        const state = gameState.getState();
        const mission1Done = state.completedMissions.includes('MISSION-001');
        const mission2Done = state.completedMissions.includes('MISSION-002');

        if (mission2Done) {
          eventBridge.emit(GameEvents.START_DIALOGUE, {
            speaker: SPEAKERS.itTech,
            lines: DIALOGUES.itTechMission2Complete
          });
        } else if (mission1Done) {
          eventBridge.emit(GameEvents.START_DIALOGUE, {
            speaker: SPEAKERS.itTech,
            lines: DIALOGUES.itTechMission2Briefing,
            onComplete: () => {
              gameState.startMission2();
              audioSystem.play('warning');
            }
          });
        } else {
          eventBridge.emit(GameEvents.START_DIALOGUE, {
            speaker: SPEAKERS.itTech,
            lines: DIALOGUES.itTechGreeting
          });
        }
      }
    });

    // 4. PLAYER WORKSTATION COMPUTER
    this.interactables.push({
      id: 'player_computer',
      name: 'Cyber Analyst Workstation',
      x: 360,
      y: 360,
      radius: 52,
      actionText: 'USE WORKSTATION',
      onInteract: () => {
        audioSystem.play('computer_click');
        audioSystem.play('interaction');
        this.player.setMovementLocked(true);
        this.promptSprite.setVisible(false);
        eventBridge.emit(GameEvents.HIDE_INTERACTION);
        eventBridge.emit(GameEvents.OPEN_COMPUTER);
      }
    });

    // 5. Cybersecurity Whiteboard
    this.interactables.push({
      id: 'whiteboard',
      name: 'Incident Topology Board',
      x: 540,
      y: 80,
      radius: 50,
      actionText: 'INSPECT INCIDENT BOARD',
      onInteract: () => {
        audioSystem.play('interaction');
        eventBridge.emit(GameEvents.START_DIALOGUE, {
          speaker: {
            id: 'whiteboard',
            name: 'Incident Whiteboard',
            title: 'Active SOC Threat Board',
            avatar: '/assets/objects/whiteboard.png'
          },
          lines: [
            '[SOC INCIDENT BRIEFING]: Threat Actors active in region.',
            'Warning: Phishing campaigns masquerading as Internal Payroll and Benefits support.',
            'Indicator of Compromise (IoC): External domain spoofing nexatech-payroll-support.'
          ]
        });
      }
    });

    // 6. Server Rack
    this.interactables.push({
      id: 'server_rack',
      name: 'Enterprise Server Rack',
      x: 1080,
      y: 220,
      radius: 60,
      actionText: 'INSPECT SERVERS',
      onInteract: () => {
        audioSystem.play('interaction');
        eventBridge.emit(GameEvents.START_DIALOGUE, {
          speaker: {
            id: 'servers',
            name: 'Datacenter Node 01',
            title: 'Core Switch & IDS Array',
            avatar: '/assets/objects/server_rack.png'
          },
          lines: [
            '[SERVER TELEMETRY]: All corporate cluster services operating nominal.',
            'Intrusion Detection System (IDS): 1,420 external probes blocked in last 24h.',
            'Firewall rule 443/80: Monitoring egress traffic from workstations.'
          ]
        });
      }
    });

    // 7. Exit Door to Street
    this.interactables.push({
      id: 'exit_door',
      name: 'Building Exit',
      x: 640,
      y: 690,
      radius: 48,
      actionText: 'EXIT TO STREET',
      onInteract: () => {
        this.player.setMovementLocked(true);
        audioSystem.play('door');
        this.promptSprite.setVisible(false);
        eventBridge.emit(GameEvents.HIDE_INTERACTION);

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          gameState.updateState({
            currentScene: 'Exterior',
            playerCoords: { x: 640, y: 320 },
            currentObjective: 'Outside CYBER CO Headquarters'
          });
          this.scene.start('ExteriorScene');
        });
      }
    });
  }

  private handleManagerDialogue() {
    this.managerNPC.facePlayer(this.player.x, this.player.y);
    audioSystem.play('dialogue');

    const state = gameState.getState();
    const mission1Done = state.completedMissions.includes('MISSION-001');
    const mission2Done = state.completedMissions.includes('MISSION-002');

    if (mission2Done) {
      eventBridge.emit(GameEvents.START_DIALOGUE, {
        speaker: SPEAKERS.manager,
        lines: DIALOGUES.managerMission2Complete
      });
    } else if (mission1Done) {
      const reported = state.caseFiles['MISSION-001']?.decision === 'REPORT';
      const lines = reported
        ? DIALOGUES.managerPostMissionReported
        : DIALOGUES.managerPostMissionMissed;

      eventBridge.emit(GameEvents.START_DIALOGUE, {
        speaker: SPEAKERS.manager,
        lines
      });
    } else {
      eventBridge.emit(GameEvents.START_DIALOGUE, {
        speaker: SPEAKERS.manager,
        lines: DIALOGUES.managerIntro,
        onComplete: () => {
          gameState.updateState({
            missionStatus: 'active',
            currentObjective: 'Check your workstation computer for suspicious emails'
          });
          audioSystem.play('notification');
        }
      });
    }
  }

  update(time: number, delta: number) {
    this.player.update(time, delta);

    // Check nearest interactable
    let nearest: InteractableObject | null = null;
    let minDist = Infinity;

    for (const item of this.interactables) {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, item.x, item.y);
      if (dist < item.radius && dist < minDist) {
        minDist = dist;
        nearest = item;
      }
    }

    if (nearest) {
      if (this.currentInteractable !== nearest) {
        this.currentInteractable = nearest;
        this.promptSprite.setPosition(nearest.x, nearest.y - 32);
        this.promptSprite.setVisible(true);
        eventBridge.emit(GameEvents.SHOW_INTERACTION, {
          visible: true,
          text: nearest.actionText,
          actionKey: 'E'
        });
      }

      if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
        nearest.onInteract();
      }
    } else {
      if (this.currentInteractable) {
        this.currentInteractable = null;
        this.promptSprite.setVisible(false);
        eventBridge.emit(GameEvents.HIDE_INTERACTION);
      }
    }
  }
}
