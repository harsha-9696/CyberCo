// GameState.ts - Strongly typed centralized game state for CYBER CO

export type GameSceneName = 'MainMenu' | 'Exterior' | 'Office';

export type MissionStatus = 'not_started' | 'active' | 'investigating' | 'completed';

export type SecurityDecision =
  | 'REPORT'
  | 'DELETE'
  | 'REPLY'
  | 'OPEN_LINK'
  | 'ENFORCE_MFA_LOCKOUT'
  | 'RESET_PASSWORD_ONLY'
  | 'SMS_MFA_ONLY'
  | 'IGNORE_INCIDENT'
  | 'SINKHOLE_AND_ADVISE'
  | 'WARN_USERS_ONLY'
  | 'FLOOD_CREDENTIALS'
  | 'TRUST_HTTPS_PADLOCK'
  | 'ISOLATE_HOST_AND_RESTORE'
  | 'TERMINATE_POWERSHELL_ONLY'
  | 'REBOOT_SERVER'
  | 'PAY_RANSOM_DEMAND';

export interface GameSettings {
  music: boolean;
  sfx: boolean;
  crtEffect: boolean;
}

export interface PlayerStats {
  awareness: number; // 0 - 100
  risk: number;      // 0 - 100
  xp: number;
}

export interface CaseFile {
  id: string;
  title: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  decision: SecurityDecision | null;
  cluesFound: string[];
  totalClues: number;
  score: number;
  consequenceText: string;
  learningPoints: string[];
}

export interface GameSaveData {
  version: number;
  currentScene: GameSceneName;
  playerCoords: { x: number; y: number };
  stats: PlayerStats;
  currentObjective: string;
  missionStatus: MissionStatus;
  activeMissionId: 'MISSION-001' | 'MISSION-002' | 'MISSION-003' | 'MISSION-004';
  discoveredClues: string[];
  investigationScore: number;
  caseFile: CaseFile;
  caseFiles: Record<string, CaseFile>;
  completedMissions: string[];
  settings: GameSettings;
  tutorialSeen: boolean;
  timestamp: number;
}

const SAVE_STORAGE_KEY = 'CYBER_CO_SAVE_STATE_V1';

const INITIAL_CASE_FILE_1: CaseFile = {
  id: 'CASE #001',
  title: 'The Suspicious Email',
  status: 'PENDING',
  decision: null,
  cluesFound: [],
  totalClues: 4,
  score: 0,
  consequenceText: '',
  learningPoints: [
    'Always verify the domain name after the @ symbol',
    'Beware of artificial urgency and threats of account suspension',
    'Inspect URL destinations before clicking any links',
    'Report suspicious emails immediately to your security team'
  ]
};

const INITIAL_CASE_FILE_2: CaseFile = {
  id: 'CASE #002',
  title: 'Credential Stuffing & MFA Bypass',
  status: 'PENDING',
  decision: null,
  cluesFound: [],
  totalClues: 4,
  score: 0,
  consequenceText: '',
  learningPoints: [
    'Never use predictable seasonal or dictionary passwords (e.g. Summer2024!)',
    'Do not reuse corporate passwords across third-party personal services',
    'Enforce phishing-resistant multi-factor authentication (App TOTP or FIDO2 keys)',
    'Configure strict account lockout thresholds and IP rate-limiting against automated brute forcing'
  ]
};

const INITIAL_CASE_FILE_3: CaseFile = {
  id: 'CASE #003',
  title: 'Typosquatting & Rogue Portals',
  status: 'PENDING',
  decision: null,
  cluesFound: [],
  totalClues: 4,
  score: 0,
  consequenceText: '',
  learningPoints: [
    'The HTTPS padlock only encrypts traffic—it does not verify a website is genuine',
    'Carefully inspect the root domain before the slash for deceptive hyphenated brand names',
    'Verify SSL/TLS Certificate Authority issuer and organization validation details',
    'Implement automated DNS sinkholing and firewall blocks to protect all corporate endpoints'
  ]
};

const INITIAL_CASE_FILE_4: CaseFile = {
  id: 'CASE #004',
  title: 'Zero-Day Ransomware & C2 Outbreak',
  status: 'PENDING',
  decision: null,
  cluesFound: [],
  totalClues: 4,
  score: 0,
  consequenceText: '',
  learningPoints: [
    'Office documents and user applications should never spawn PowerShell or script shells (LOLBins)',
    'Ransomware attempts to delete Volume Shadow Copies to prevent restore without paying extortion',
    'Sever network interfaces (Host Isolation) immediately to prevent C2 communication and lateral spread',
    'Never pay ransom demands—restore verified clean data from immutable offline/air-gapped backups'
  ]
};

const DEFAULT_STATE: GameSaveData = {
  version: 4,
  currentScene: 'MainMenu',
  playerCoords: { x: 380, y: 520 },
  stats: {
    awareness: 80,
    risk: 20,
    xp: 100
  },
  currentObjective: 'Enter the CYBER CO building',
  missionStatus: 'not_started',
  activeMissionId: 'MISSION-001',
  discoveredClues: [],
  investigationScore: 0,
  caseFile: INITIAL_CASE_FILE_1,
  caseFiles: {
    'MISSION-001': INITIAL_CASE_FILE_1,
    'MISSION-002': INITIAL_CASE_FILE_2,
    'MISSION-003': INITIAL_CASE_FILE_3,
    'MISSION-004': INITIAL_CASE_FILE_4
  },
  completedMissions: [],
  settings: {
    music: true,
    sfx: true,
    crtEffect: true
  },
  tutorialSeen: false,
  timestamp: Date.now()
};

export class GameStateManager {
  private static instance: GameStateManager;
  private state: GameSaveData;
  private listeners: Set<(state: GameSaveData) => void> = new Set();

  private constructor() {
    this.state = this.loadFromStorage() || { ...DEFAULT_STATE };
    // Ensure caseFiles mapping exists for legacy saves
    if (!this.state.caseFiles) {
      this.state.caseFiles = {
        'MISSION-001': this.state.caseFile || INITIAL_CASE_FILE_1,
        'MISSION-002': INITIAL_CASE_FILE_2,
        'MISSION-003': INITIAL_CASE_FILE_3,
        'MISSION-004': INITIAL_CASE_FILE_4
      };
    }
    if (!this.state.caseFiles['MISSION-003']) {
      this.state.caseFiles['MISSION-003'] = INITIAL_CASE_FILE_3;
    }
    if (!this.state.caseFiles['MISSION-004']) {
      this.state.caseFiles['MISSION-004'] = INITIAL_CASE_FILE_4;
    }
  }

  public static getInstance(): GameStateManager {
    if (!GameStateManager.instance) {
      GameStateManager.instance = new GameStateManager();
    }
    return GameStateManager.instance;
  }

  public getState(): GameSaveData {
    return { ...this.state };
  }

  public hasSaveGame(): boolean {
    try {
      const raw = localStorage.getItem(SAVE_STORAGE_KEY);
      return !!raw;
    } catch {
      return false;
    }
  }

  public save(): void {
    try {
      this.state.timestamp = Date.now();
      localStorage.setItem(SAVE_STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }

  public loadFromStorage(): GameSaveData | null {
    try {
      const raw = localStorage.getItem(SAVE_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return parsed;
    } catch {
      return null;
    }
  }

  public resetGame(): GameSaveData {
    this.state = JSON.parse(JSON.stringify(DEFAULT_STATE));
    this.state.currentScene = 'Exterior';
    this.state.playerCoords = { x: 380, y: 520 };
    this.save();
    this.notify();
    return this.getState();
  }

  public continueGame(): GameSaveData {
    const saved = this.loadFromStorage();
    if (saved) {
      this.state = saved;
    } else {
      this.state = { ...DEFAULT_STATE, currentScene: 'Exterior' };
    }
    this.notify();
    return this.getState();
  }

  public markTutorialSeen(): void {
    this.state.tutorialSeen = true;
    this.save();
  }

  public updateState(partial: Partial<GameSaveData>): void {
    this.state = {
      ...this.state,
      ...partial,
      stats: partial.stats ? { ...this.state.stats, ...partial.stats } : this.state.stats,
      caseFile: partial.caseFile ? { ...this.state.caseFile, ...partial.caseFile } : this.state.caseFile,
      caseFiles: partial.caseFiles ? { ...this.state.caseFiles, ...partial.caseFiles } : this.state.caseFiles,
      settings: partial.settings ? { ...this.state.settings, ...partial.settings } : this.state.settings
    };
    this.save();
    this.notify();
  }

  public startMission2(): void {
    this.updateState({
      activeMissionId: 'MISSION-002',
      missionStatus: 'active',
      currentObjective: 'Investigate Credential Attack in IT room or on Workstation Security Console',
      discoveredClues: [],
      investigationScore: 0,
      caseFile: {
        ...this.state.caseFiles['MISSION-002'],
        status: 'ACTIVE'
      },
      caseFiles: {
        ...this.state.caseFiles,
        'MISSION-002': {
          ...this.state.caseFiles['MISSION-002'],
          status: 'ACTIVE'
        }
      }
    });
  }

  public startMission3(): void {
    this.updateState({
      activeMissionId: 'MISSION-003',
      missionStatus: 'active',
      currentObjective: 'Investigate Reported Fake SSO Portal in NEXA-BROWSER on your Workstation',
      discoveredClues: [],
      investigationScore: 0,
      caseFile: {
        ...this.state.caseFiles['MISSION-003'],
        status: 'ACTIVE'
      },
      caseFiles: {
        ...this.state.caseFiles,
        'MISSION-003': {
          ...this.state.caseFiles['MISSION-003'],
          status: 'ACTIVE'
        }
      }
    });
  }

  public startMission4(): void {
    this.updateState({
      activeMissionId: 'MISSION-004',
      missionStatus: 'active',
      currentObjective: 'Investigate Critical Ransomware Outbreak on NEXA-EDR SOC Console',
      discoveredClues: [],
      investigationScore: 0,
      caseFile: {
        ...this.state.caseFiles['MISSION-004'],
        status: 'ACTIVE'
      },
      caseFiles: {
        ...this.state.caseFiles,
        'MISSION-004': {
          ...this.state.caseFiles['MISSION-004'],
          status: 'ACTIVE'
        }
      }
    });
  }

  public addClue(clueId: string, scoreBonus: number): void {
    if (!this.state.discoveredClues.includes(clueId)) {
      const newClues = [...this.state.discoveredClues, clueId];
      const newScore = this.state.investigationScore + scoreBonus;
      const activeId = this.state.activeMissionId || 'MISSION-001';

      const updatedCase: CaseFile = {
        ...this.state.caseFile,
        cluesFound: newClues,
        score: newScore
      };

      const totalClues = this.state.caseFiles[activeId]?.totalClues || 4;
      const foundCount = newClues.length;
      let newObjective = this.state.currentObjective;
      if (foundCount < totalClues) {
        newObjective = `Clues Found: ${foundCount}/${totalClues} — Keep investigating before making your decision`;
      } else {
        newObjective = `All ${totalClues} clues found! Open the DECISION MATRIX and take action`;
      }

      this.updateState({
        discoveredClues: newClues,
        investigationScore: newScore,
        currentObjective: newObjective,
        caseFile: updatedCase,
        caseFiles: {
          ...this.state.caseFiles,
          [activeId]: updatedCase
        }
      });
    }
  }

  public applyDecision(decision: SecurityDecision): {
    awarenessDelta: number;
    riskDelta: number;
    xpDelta: number;
    feedbackTitle: string;
    feedbackDescription: string;
  } {
    let awarenessDelta = 0;
    let riskDelta = 0;
    let xpDelta = 0;
    let feedbackTitle = '';
    let feedbackDescription = '';

    const currentMissionId = this.state.activeMissionId || 'MISSION-001';

    if (currentMissionId === 'MISSION-001') {
      switch (decision) {
        case 'REPORT':
          awarenessDelta = +20;
          riskDelta = -10;
          xpDelta = +100;
          feedbackTitle = 'EXCELLENT SECURITY DECISION';
          feedbackDescription =
            'You identified multiple warning signs and reported the email before interacting with it. ' +
            'Security Operations has blocked the attacker domain network-wide, protecting the entire company!';
          break;
        case 'DELETE':
          awarenessDelta = +10;
          riskDelta = -5;
          xpDelta = +50;
          feedbackTitle = 'SAFE, BUT MISSED EVIDENCE';
          feedbackDescription =
            'Deleting the message prevented immediate infection, but because it was not reported, ' +
            'other employees remain vulnerable to the same phishing wave.';
          break;
        case 'REPLY':
          awarenessDelta = -5;
          riskDelta = +15;
          xpDelta = +0;
          feedbackTitle = 'RISKY DECISION';
          feedbackDescription =
            'Replying to a suspicious sender confirms that your email address is active and monitored, ' +
            'often inviting more targeted and sophisticated spear-phishing attacks.';
          break;
        case 'OPEN_LINK':
          awarenessDelta = -10;
          riskDelta = +30;
          xpDelta = +0;
          feedbackTitle = 'SECURITY THREAT COMPROMISE';
          feedbackDescription =
            'The link directed to a spoofed credential-harvesting site. ' +
            'In a real attack, your corporate credentials would have been captured by the attacker.';
          break;
      }
    } else if (currentMissionId === 'MISSION-002') {
      // MISSION-002: Password Security & MFA
      switch (decision) {
        case 'ENFORCE_MFA_LOCKOUT':
          awarenessDelta = +25;
          riskDelta = -20;
          xpDelta = +150;
          feedbackTitle = 'EXCELLENT IDENTITY HARDENING';
          feedbackDescription =
            'You enforced phishing-resistant app/hardware MFA, invalidated all active attacker sessions, triggered a mandatory high-entropy password reset, and activated automatic 5-attempt account lockout. The credential stuffing botnet was completely neutralized!';
          break;
        case 'RESET_PASSWORD_ONLY':
          awarenessDelta = +10;
          riskDelta = +5;
          xpDelta = +60;
          feedbackTitle = 'PARTIAL MITIGATION (INCOMPLETE)';
          feedbackDescription =
            'Resetting the user password stopped the current session, but without enforcing MFA or rate limiting, the account remains vulnerable to dictionary attacks and credential reuse.';
          break;
        case 'SMS_MFA_ONLY':
          awarenessDelta = +5;
          riskDelta = +10;
          xpDelta = +40;
          feedbackTitle = 'SUBOPTIMAL MFA METHOD';
          feedbackDescription =
            'SMS-based verification is vulnerable to SIM-swap fraud, SS7 interception, and real-time reverse proxies. Company policy mandates app-based TOTP or FIDO2 keys.';
          break;
        case 'IGNORE_INCIDENT':
          awarenessDelta = -15;
          riskDelta = +35;
          xpDelta = +0;
          feedbackTitle = 'CRITICAL IDENTITY COMPROMISE';
          feedbackDescription =
            'Treating the alert as a false alarm allowed the threat actor to establish persistent access using the cracked password, leading to unauthorized data exfiltration from the finance department.';
          break;
      }
    } else if (currentMissionId === 'MISSION-003') {
      // MISSION-003: Scams & Fake Look-Alike Websites
      switch (decision) {
        case 'SINKHOLE_AND_ADVISE':
          awarenessDelta = +25;
          riskDelta = -20;
          xpDelta = +150;
          feedbackTitle = 'EXCELLENT INCIDENT MITIGATION';
          feedbackDescription =
            'You deployed an immediate corporate DNS sinkhole redirecting all requests to an internal educational block page, blocked the domain at the perimeter firewall, and broadcast an emergency security advisory. Threat neutralized across all endpoints!';
          break;
        case 'WARN_USERS_ONLY':
          awarenessDelta = +10;
          riskDelta = +10;
          xpDelta = +50;
          feedbackTitle = 'PARTIAL MITIGATION (INSUFFICIENT)';
          feedbackDescription =
            'Sending an advisory alerted observant staff, but without technical DNS and firewall enforcement, several employees still clicked the lure message and submitted their credentials before reading the email.';
          break;
        case 'FLOOD_CREDENTIALS':
          awarenessDelta = +0;
          riskDelta = +15;
          xpDelta = +20;
          feedbackTitle = 'INEFFECTIVE COUNTERMEASURE';
          feedbackDescription =
            'Flooding the phishing server with garbage accounts did not protect legitimate employees from falling for the clone portal, and alerted the attacker to rotate to an unblocked secondary domain.';
          break;
        case 'TRUST_HTTPS_PADLOCK':
          awarenessDelta = -20;
          riskDelta = +40;
          xpDelta = +0;
          feedbackTitle = 'CRITICAL SECURITY MISCONCEPTION';
          feedbackDescription =
            'Assuming the padlock icon meant the portal was legitimate allowed the threat actor to harvest dozens of corporate Single Sign-On credentials. The padlock only proves encrypted transmission to the attacker server!';
          break;
      }
    } else {
      // MISSION-004: Zero-Day Ransomware & EDR Containment
      switch (decision) {
        case 'ISOLATE_HOST_AND_RESTORE':
          awarenessDelta = +25;
          riskDelta = -25;
          xpDelta = +200;
          feedbackTitle = 'HEROIC INCIDENT CONTAINMENT';
          feedbackDescription =
            'You severed network interfaces to contain the active C2 beacon, preserved volatile RAM telemetry for forensic attribution, terminated the malicious process tree, and initiated a clean rollback from immutable snapshots. Zero files lost, zero ransom paid!';
          break;
        case 'TERMINATE_POWERSHELL_ONLY':
          awarenessDelta = +5;
          riskDelta = +15;
          xpDelta = +40;
          feedbackTitle = 'INCOMPLETE THREAT REMEDIATION';
          feedbackDescription =
            'Terminating only the running PowerShell process left the scheduled persistence task and active C2 socket intact. The encryptor re-spawned 10 minutes later and locked shared storage.';
          break;
        case 'REBOOT_SERVER':
          awarenessDelta = -15;
          riskDelta = +35;
          xpDelta = +0;
          feedbackTitle = 'CATASTROPHIC INCIDENT RESPONSE';
          feedbackDescription =
            'Rebooting the server wiped volatile memory evidence needed for forensic attribution, and triggered the ransomware payload registry autorun on reboot, locking the entire server!';
          break;
        case 'PAY_RANSOM_DEMAND':
          awarenessDelta = -25;
          riskDelta = +50;
          xpDelta = +0;
          feedbackTitle = 'SURRENDER TO CYBER EXTORTION';
          feedbackDescription =
            'Paying the 5 BTC ransom drained company treasury funds, provided a corrupted decryption key, and permanently tagged CYBER CO on dark web broker forums as a compliant target for repeat attacks.';
          break;
      }
    }

    const newAwareness = Math.min(100, Math.max(0, this.state.stats.awareness + awarenessDelta));
    const newRisk = Math.min(100, Math.max(0, this.state.stats.risk + riskDelta));
    const newXP = this.state.stats.xp + xpDelta;

    const completedList = Array.from(new Set([...this.state.completedMissions, currentMissionId]));

    const updatedCase: CaseFile = {
      ...this.state.caseFile,
      status: 'COMPLETED',
      decision,
      consequenceText: feedbackDescription
    };

    let nextObjective = '';
    if (currentMissionId === 'MISSION-001') {
      nextObjective = 'Mission 001 Complete! Speak to Marcus Vance or Devon Reed in the IT room.';
    } else if (currentMissionId === 'MISSION-002') {
      nextObjective = 'Mission 002 Complete! Speak to Marcus Vance or Devon Reed about the reported fake website.';
    } else if (currentMissionId === 'MISSION-003') {
      nextObjective = 'Mission 003 Complete! Speak to Devon Reed in IT — emergency alarm triggered!';
    } else {
      nextObjective = 'OPERATION CIPHER SHIELD COMPLETE! Speak to Marcus Vance for your Senior Promotion Commendation!';
    }

    this.updateState({
      stats: {
        awareness: newAwareness,
        risk: newRisk,
        xp: newXP
      },
      missionStatus: 'completed',
      completedMissions: completedList,
      currentObjective: nextObjective,
      caseFile: updatedCase,
      caseFiles: {
        ...this.state.caseFiles,
        [currentMissionId]: updatedCase
      }
    });

    return {
      awarenessDelta,
      riskDelta,
      xpDelta,
      feedbackTitle,
      feedbackDescription
    };
  }

  public subscribe(listener: (state: GameSaveData) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const s = this.getState();
    for (const listener of this.listeners) {
      listener(s);
    }
  }
}

export const gameState = GameStateManager.getInstance();
