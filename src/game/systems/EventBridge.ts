// EventBridge.ts - Decoupled event communication between Phaser and React

export interface DialogueSpeaker {
  id: string;
  name: string;
  title: string;
  avatar: string;
}

export interface DialoguePayload {
  speaker: DialogueSpeaker;
  lines: string[];
  onComplete?: () => void;
}

export interface InteractionPromptPayload {
  visible: boolean;
  text?: string;
  actionKey?: string;
}

type EventCallback<T = any> = (data: T) => void;

class EventBridge {
  private static instance: EventBridge;
  private listeners: Map<string, Set<EventCallback>> = new Map();

  private constructor() {}

  public static getInstance(): EventBridge {
    if (!EventBridge.instance) {
      EventBridge.instance = new EventBridge();
    }
    return EventBridge.instance;
  }

  public on<T = any>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
    return () => this.off(event, callback);
  }

  public off<T = any>(event: string, callback: EventCallback<T>): void {
    const list = this.listeners.get(event);
    if (list) {
      list.delete(callback);
    }
  }

  public emit<T = any>(event: string, data?: T): void {
    const list = this.listeners.get(event);
    if (list) {
      list.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }
}

export const eventBridge = EventBridge.getInstance();

// Typed helper events
export const GameEvents = {
  // Navigation / Scenes
  START_GAME: 'START_GAME',
  CONTINUE_GAME: 'CONTINUE_GAME',
  CHANGE_SCENE: 'CHANGE_SCENE',
  SCENE_READY: 'SCENE_READY',

  // Player controls
  SET_PLAYER_CONTROLS_ENABLED: 'SET_PLAYER_CONTROLS_ENABLED',
  TELEPORT_PLAYER: 'TELEPORT_PLAYER',

  // Interaction prompt
  SHOW_INTERACTION: 'SHOW_INTERACTION',
  HIDE_INTERACTION: 'HIDE_INTERACTION',

  // Dialogue
  START_DIALOGUE: 'START_DIALOGUE',
  ADVANCE_DIALOGUE: 'ADVANCE_DIALOGUE',
  END_DIALOGUE: 'END_DIALOGUE',

  // Computer / Phishing
  OPEN_COMPUTER: 'OPEN_COMPUTER',
  CLOSE_COMPUTER: 'CLOSE_COMPUTER',

  // Results & Case Files
  SHOW_CONSEQUENCES: 'SHOW_CONSEQUENCES',
  CLOSE_CONSEQUENCES: 'CLOSE_CONSEQUENCES',
  SHOW_CASE_FILE: 'SHOW_CASE_FILE',
  CLOSE_CASE_FILE: 'CLOSE_CASE_FILE',

  // Notifications
  SHOW_ALERT: 'SHOW_ALERT'
} as const;
