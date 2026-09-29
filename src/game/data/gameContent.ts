// gameContent.ts - Dialogue, storylines, and cybersecurity challenge content

import { DialogueSpeaker } from '../systems/EventBridge';

export const SPEAKERS: Record<string, DialogueSpeaker> = {
  manager: {
    id: 'manager',
    name: 'Marcus Vance',
    title: 'Head of Cybersecurity',
    avatar: '/assets/portraits/manager.png'
  },
  receptionist: {
    id: 'receptionist',
    name: 'Elena Rostova',
    title: 'Front Desk Coordinator',
    avatar: '/assets/portraits/receptionist.png'
  },
  itTech: {
    id: 'itTech',
    name: 'Devon Reed',
    title: 'Lead Systems Engineer',
    avatar: '/assets/portraits/it_tech.png'
  },
  player: {
    id: 'player',
    name: 'Junior Analyst',
    title: 'Security Operations Center',
    avatar: '/assets/portraits/player.png'
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
    "Now we have a report from Employee Relations: someone registered a clone website of our portal! Head to your workstation browser immediately!"
  ],
  managerMission2Complete: [
    "Top-tier incident response on that credential attack.",
    "Enforcing robust multi-factor authentication and account lockout is the bedrock of Zero Trust architecture.",
    "Take a breath and review the case logs. You've safeguarded the entire company's financial core today."
  ],

  // Mission 3 Dialogues
  itTechMission3Briefing: [
    "Analyst, emergency alert! Staff across Marketing and Operations are receiving chat messages with an urgent link.",
    "The link directs them to a website at 'portal-nexatech-login.com'. It looks identical to our corporate SSO portal!",
    "Employees are being tricked into thinking our certificate expired. Open NEXA-BROWSER on your workstation.",
    "Inspect the URL, check the SSL certificate, dissect the form action, and execute our DNS/firewall mitigation!"
  ],
  itTechMission3Complete: [
    "Outstanding technical forensics! Your DNS sinkhole caught 42 employee redirects and redirected them to our training portal.",
    "You completely dismantled that rogue portal before a single credential was exfiltrated.",
    "You're proving to be one of the best incident responders we've ever hired!"
  ],
  managerMission3Complete: [
    "Outstanding technical forensics on that fake portal. Most people blindly trust the HTTPS padlock icon without verifying the root domain.",
    "Our perimeter firewalls and corporate DNS resolvers have blacklisted the rogue harvest server.",
    "Review your case register. You've neutralized phishing, credential stuffing, and fake web portals!"
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

// ==========================================
// MISSION 3: SCAMS & FAKE WEBSITES CLUES
// ==========================================
export interface WebForensicClue {
  id: string;
  name: string;
  category: 'domain' | 'ssl' | 'form' | 'social';
  finding: string;
  explanation: string;
  scoreBonus: number;
}

export const WEB_FORENSIC_CLUES: WebForensicClue[] = [
  {
    id: 'CLUE-WEB-01',
    name: 'Typosquatted Look-Alike Domain',
    category: 'domain',
    finding: 'portal-nexatech-login.com (Hyphenated deceptive domain)',
    explanation:
      'The address uses hyphenated keywords ("portal-nexatech-login.com") instead of our official domain ("nexatech.internal" or "login.nexatech.com"). Attackers register look-alike domains to exploit visual familiarity and hurried inspection.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-WEB-02',
    name: 'Deceptive HTTPS Padlock & CA Discrepancy',
    category: 'ssl',
    finding: 'Free Automated DV Certificate (Anonymous Organization)',
    explanation:
      'The green padlock only proves data transmission is encrypted—it does NOT verify the site is genuine! Anyone can obtain a free SSL certificate for a phishing domain. NexaTech uses Organization-Validated (OV) certificates registered to NexaTech Corporation.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-WEB-03',
    name: 'External Exfiltration Form Action',
    category: 'form',
    finding: 'POSTs to "api-harvest.darkproxy.net/v1/capture"',
    explanation:
      'Inspecting the login form action reveals entered usernames and passwords are sent to an external harvesting server. The user is then silently redirected to the real homepage so they believe their login attempt simply lagged.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-WEB-04',
    name: 'Urgent Certificate Expiration Lure',
    category: 'social',
    finding: 'Deceptive Administrative Urgency Banner ("SSO Expiring in 60m")',
    explanation:
      'The rogue webpage displays an urgent warning demanding re-authentication within 60 minutes. High administrative urgency creates panic and blinds employees from noticing blatant address-bar discrepancies.',
    scoreBonus: 25
  }
];

export const CLONE_WEBSITE_DATA = {
  reportedUrl: 'https://portal-nexatech-login.com/sso/auth',
  officialUrl: 'https://login.nexatech.internal',
  sslIssuer: 'FreeSSL Automated Domain Authority (DV)',
  sslSubject: 'CN=portal-nexatech-login.com',
  sslValidUntil: 'Expires in 88 days (Issued 2 days ago)',
  officialSslIssuer: 'DigiTrust Global Organization Authority (OV - NexaTech Corp)',
  formAction: 'https://api-harvest.darkproxy.net/v1/capture',
  exfiltrationServer: 'darkproxy.net [IP: 198.51.100.89]',
  bannerUrgency: 'CRITICAL ALERT: NexaTech SSO Certificate Refresh Required within 60 minutes. Re-authenticate credentials below to retain active session privileges.',
  reportedBy: 'Marketing & HR Department Slack Channel'
};
