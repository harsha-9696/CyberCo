// gameContent.ts - Dialogue, storylines, and cybersecurity challenge content

import { DialogueSpeaker } from '../systems/EventBridge';

export const SPEAKERS: Record<string, DialogueSpeaker> = {
  manager: {
    id: 'manager',
    name: 'Marcus Vance',
    title: 'Head of Cybersecurity',
    avatar: '/assets/characters/manager.png'
  },
  receptionist: {
    id: 'receptionist',
    name: 'Elena Rostova',
    title: 'Front Desk Coordinator',
    avatar: '/assets/characters/receptionist.png'
  },
  itTech: {
    id: 'itTech',
    name: 'Devon Reed',
    title: 'Lead Systems Engineer',
    avatar: '/assets/characters/it_tech.png'
  }
};

export const DIALOGUES = {
  // Mission 1 Dialogues
  managerIntro: [
    "You're the new junior cybersecurity analyst. Good timing.",
    "Our network perimeter flags have been spiking all morning, and employees are receiving suspicious communications.",
    "Before we investigate anything else, head to your workstation in the main office.",
    "There's an urgent message waiting in your inbox that needs immediate analysis. Trust nothing."
  ],
  managerPostMissionReported: [
    "Outstanding work on that payroll phishing email!",
    "Your swift report allowed our SOC to blacklist the attacker domain before anyone surrendered their credentials.",
    "Now we have an urgent situation: our Intrusion Detection System is alarming in the datacenter. Speak with Devon in the IT room!"
  ],
  managerPostMissionMissed: [
    "I saw your log on that payroll message.",
    "Make sure to review the post-incident breakdown on your screen. In cybersecurity, spotting the red flags early is what keeps everyone safe.",
    "Now we have an active identity incident: our IDS is alarming in the datacenter. Speak with Devon in the IT room!"
  ],
  receptionistGreeting: [
    "Good morning and welcome to CYBER CO HQ!",
    "Manager Marcus Vance is waiting to brief you in the main office area just past the security turnstiles."
  ],
  itTechGreeting: [
    "Hey! Devon from IT. Glad you're here.",
    "Word of advice: attackers love spoofing HR and payroll around the first of the month. Never trust a link without inspecting the actual domain!"
  ],

  // Mission 2 Dialogues
  itTechMission2Briefing: [
    "Analyst, quick! Our Single Sign-On (SSO) authentication gateway is getting hammered!",
    "A botnet is executing an automated credential-stuffing and password-spraying attack against our employees.",
    "The attacker just compromised the account of Sarah Jenkins in Finance (sjenkins@nexatech.internal).",
    "Open the IDENTITY & ACCESS MANAGEMENT (IAM) console on your workstation right now to investigate her credentials and lock down our MFA policy!"
  ],
  itTechMission2Complete: [
    "Incredible work! That app-based TOTP mandate and 5-attempt lockout policy completely shut down the botnet.",
    "Sarah Jenkins' account is secured with a clean high-entropy secret, and the attacker's sessions were terminated.",
    "You're turning into one of our finest defense operators!"
  ],
  managerMission2Complete: [
    "Top-tier incident response on that credential attack.",
    "Enforcing robust multi-factor authentication and account lockout is the bedrock of Zero Trust architecture.",
    "Take a breath and review the case logs. You've safeguarded the entire company's financial core today."
  ]
};

// ==========================================
// MISSION 1: PHISHING CLUES
// ==========================================
export interface PhishingClue {
  id: string;
  name: string;
  element: 'sender' | 'subject' | 'message' | 'link' | 'attachment';
  finding: string;
  explanation: string;
  scoreBonus: number;
}

export const PHISHING_CLUES: PhishingClue[] = [
  {
    id: 'PHISHING-01',
    name: 'Suspicious Sender Domain',
    element: 'sender',
    finding: 'Fake look-alike domain',
    explanation:
      'The sender address is "hr@nexatech-payroll-support.example". The legitimate company domain is "nexatech.internal". Attackers frequently register look-alike domains to deceive busy employees.',
    scoreBonus: 25
  },
  {
    id: 'PHISHING-02',
    name: 'Artificial Urgency & Coercion',
    element: 'message',
    finding: 'Coercive language and pressure tactics',
    explanation:
      'The email claims your payroll account will be "suspended today" unless verified immediately. Creating fear, urgency, and panic is the most common psychological trigger used in social engineering.',
    scoreBonus: 15
  },
  {
    id: 'PHISHING-03',
    name: 'Deceptive Destination URL',
    element: 'link',
    finding: 'External credential-harvesting destination',
    explanation:
      'The hyperlink text displays "VERIFY PAYROLL ACCOUNT", but the actual link destination points to "nexatech-payroll-security.example/verify". This destination is an external, non-corporate domain set up to steal login passwords.',
    scoreBonus: 25
  },
  {
    id: 'PHISHING-04',
    name: 'Dangerous Executable Attachment',
    element: 'attachment',
    finding: 'Double-extension camouflage executable',
    explanation:
      'The attached document is named "payroll_update_guidelines.pdf.exe". Attackers use double extensions to disguise executable malware as innocent PDF reading material.',
    scoreBonus: 15
  }
];

export const EMAIL_DATA = {
  id: 'EMAIL-001',
  fromName: 'NexaTech HR Payroll Support',
  fromAddress: 'hr@nexatech-payroll-support.example',
  to: 'junior.analyst@nexatech.internal',
  date: 'Today, 09:12 AM',
  subject: 'URGENT: Payroll Account Verification Required',
  bodyText:
    'Dear Employee,\n\nOur system detected an inconsistency during the routine monthly payroll reconciliation audit. Your payroll disbursement profile requires immediate verification.\n\nFailure to verify your account today will result in temporary suspension of direct deposit privileges until the next billing quarter.\n\nPlease verify your account credentials immediately using the secure portal below:',
  buttonText: 'VERIFY PAYROLL ACCOUNT',
  destinationUrl: 'http://nexatech-payroll-security.example/verify',
  attachmentName: 'payroll_update_guidelines.pdf.exe',
  attachmentSize: '412 KB'
};

// ==========================================
// MISSION 2: PASSWORD SECURITY & MFA CLUES
// ==========================================
export interface IAMClue {
  id: string;
  name: string;
  category: 'password' | 'breach' | 'mfa' | 'lockout';
  finding: string;
  explanation: string;
  scoreBonus: number;
}

export const IAM_CLUES: IAMClue[] = [
  {
    id: 'CLUE-PWD-01',
    name: 'Predictable Password Pattern',
    category: 'password',
    finding: 'Weak seasonal pattern ("Summer2024!")',
    explanation:
      'The compromised password uses the classic "Season + 4-digit Year + Special Char" formula. Attackers test these top dictionary combinations within seconds using automated hybrid mask attacks.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-PWD-02',
    name: 'External Breach Credential Reuse',
    category: 'breach',
    finding: 'Identical password leaked in 3rd-party breach',
    explanation:
      'Threat intelligence databases reveal this exact password was exposed in a breach of an external wellness platform. Password reuse across accounts enables effortless "credential stuffing".',
    scoreBonus: 25
  },
  {
    id: 'CLUE-PWD-03',
    name: 'MFA Policy Configured As Optional',
    category: 'mfa',
    finding: 'SSO gateway allows single-factor authentication',
    explanation:
      'The user was never mandated to register a multi-factor authenticator app. With single-factor authentication, a cracked or stolen password grants direct and unrestricted network access.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-PWD-04',
    name: 'Account Lockout & Rate-Limiting Disabled',
    category: 'lockout',
    finding: '840 failed attempts permitted without throttle',
    explanation:
      'The authentication endpoint lacked rate-limiting and account lockout thresholds, allowing an automated script to attempt hundreds of dictionary passwords without raising immediate barriers.',
    scoreBonus: 25
  }
];

export const IAM_INCIDENT_DATA = {
  incidentId: 'INCIDENT-002-IAM',
  timestamp: 'Today, 09:34 AM',
  targetUser: 'Sarah Jenkins',
  targetEmail: 'sjenkins@nexatech.internal',
  role: 'Senior Financial Analyst',
  department: 'Finance & Treasury',
  detectedPassword: 'Summer2024!',
  passwordEntropy: '38.4 bits (POOR - Predictable Pattern)',
  failedAttempts: 840,
  attackerOrigin: 'Distributed Proxy Network (Tor Exit Nodes & Bulletproof VPNs)',
  currentMfaStatus: 'OPTIONAL (NOT ENROLLED)',
  currentLockoutPolicy: 'DISABLED (Unlimited Attempts)',
  activeSession: 'ALERT: Unauthorized login established from IP 185.220.101.44'
};
