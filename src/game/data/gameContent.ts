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
  ],

  // Mission 4 Dialogues
  itTechMission4Briefing: [
    "CODE RED! This is not a drill! Our Endpoint Detection system just triggered a critical severity alert on FILE-SRV-04 in the datacenter!",
    "A weaponized macro document slipped through and executed an active ransomware payload. Disk I/O is spiking at 140 MB/s!",
    "The malware is terminating volume shadow copies and establishing an outbound Command & Control (C2) beacon.",
    "Open NEXA-EDR on your workstation immediately. Trace the process tree, inspect network sockets, and isolate the threat before our corporate storage is encrypted!"
  ],
  itTechMission4Complete: [
    "UNBELIEVABLE SAVE! That was textbook incident response under extreme pressure!",
    "Your immediate host isolation severed the C2 channel before the encryption key was finalized, and the immutable snapshot rollback saved all shared volumes.",
    "Not a single byte of company data was lost, and zero ransom was paid. You're an absolute legend, Analyst!"
  ],
  managerMission4Complete: [
    "Analyst, words cannot express how proud the entire executive board is of your actions today.",
    "You successfully detected and neutralized every stage of an advanced persistent cyber offensive: phishing, credential theft, typosquatting, and a live ransomware outbreak.",
    "By unanimous executive consensus, I hereby promote you to Senior Cyber Incident Commander at CYBER CO! Outstanding service!"
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

// ==========================================
// MISSION 4: ENDPOINT DETECTION & RANSOMWARE CLUES
// ==========================================
export interface EDRClue {
  id: string;
  name: string;
  category: 'process' | 'backup' | 'c2' | 'lateral';
  finding: string;
  explanation: string;
  scoreBonus: number;
}

export const EDR_CLUES: EDRClue[] = [
  {
    id: 'CLUE-EDR-01',
    name: 'Suspicious Process Lineage (LOLBins)',
    category: 'process',
    finding: 'WINWORD.EXE spawned hidden powershell.exe -enc ...',
    explanation:
      'Legitimate word processors should never launch command shells. Threat actors weaponize macro-enabled office documents to execute obfuscated Base64 PowerShell commands (Living Off the Land / LOLBins).',
    scoreBonus: 25
  },
  {
    id: 'CLUE-EDR-02',
    name: 'Shadow Copy Destruction Command',
    category: 'backup',
    finding: 'Child process running "vssadmin.exe delete shadows /all /quiet"',
    explanation:
      'Ransomware strains almost universally execute vssadmin commands to purge Volume Shadow Copies. This deliberately deprives system administrators of local restore points prior to starting bulk file encryption.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-EDR-03',
    name: 'Active C2 Beaconing Heartbeat',
    category: 'c2',
    finding: 'Outbound TLS traffic on port 8443 to 194.26.29.112 (Offshore C2)',
    explanation:
      'The infected endpoint sends regular 45-second heartbeat beacons to an external command-and-control server. C2 servers deliver cryptographic encryption keys and receive exfiltrated sensitive directory listings.',
    scoreBonus: 25
  },
  {
    id: 'CLUE-EDR-04',
    name: 'Lateral Movement Probe (Port 445)',
    category: 'lateral',
    finding: 'High-frequency SMB sweep targeting BACKUP-VAULT-01 (10.0.4.50)',
    explanation:
      'Before triggering broad local encryption, modern ransomware conducts network sweeps over SMB (Port 445) to discover network storage arrays, shared folders, and backup appliances to maximize extortion leverage.',
    scoreBonus: 25
  }
];

export const EDR_INCIDENT_DATA = {
  incidentId: 'INCIDENT-004-RANSOMWARE',
  hostname: 'FILE-SRV-04.corp.nexatech.internal',
  ipAddress: '10.0.4.15',
  operatingSystem: 'Windows Server 2022 Datacenter (Build 20348)',
  threatFamily: 'Ransom.Win32.LockBit3.Variant (High-Speed Encryptor)',
  status: 'ACTIVE OUTBREAK - ENCRYPTION THREAT IN PROGRESS',
  cpuUsage: '94% (4 Cores Maxed)',
  diskIoRate: '142.8 MB/s (High-Frequency Overwrite)',
  c2Server: '194.26.29.112:8443 [ASN 44925 - Bulletproof Hosting]',
  targetedVault: 'BACKUP-VAULT-01 (10.0.4.50:445)',
  filesEncryptedCount: 18,
  activeProcesses: [
    {
      pid: 4120,
      name: 'explorer.exe',
      user: 'SYSTEM\\LocalAdmin',
      status: 'Normal',
      cmd: 'C:\\Windows\\explorer.exe'
    },
    {
      pid: 7892,
      name: 'WINWORD.EXE',
      parentPid: 4120,
      user: 'FINANCE\\sjenkins',
      status: 'Suspicious Macro Executed',
      cmd: '"C:\\Program Files\\Microsoft Office\\root\\Office16\\WINWORD.EXE" /n "Q4_Invoice_Audit.docm"'
    },
    {
      pid: 8840,
      name: 'powershell.exe',
      parentPid: 7892,
      user: 'FINANCE\\sjenkins',
      status: 'CRITICAL THREAT (Unsigned Payload)',
      cmd: 'powershell.exe -WindowStyle Hidden -enc JAB3AGMAYwBsAGkAZQBuAHQAPQBOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFcAZQBiAEMAbABpAGUAbgB0ADs...'
    },
    {
      pid: 9104,
      name: 'vssadmin.exe',
      parentPid: 8840,
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'MALICIOUS (Shadow Copy Wipe)',
      cmd: 'vssadmin.exe delete shadows /all /quiet'
    }
  ],
  networkSockets: [
    {
      proto: 'TCP',
      localAddr: '10.0.4.15:52418',
      remoteAddr: '194.26.29.112:8443',
      state: 'ESTABLISHED (C2 Heartbeat Beacon - Interval 45s)',
      process: 'powershell.exe (PID 8840)',
      isMalicious: true
    },
    {
      proto: 'TCP',
      localAddr: '10.0.4.15:49822',
      remoteAddr: '10.0.4.50:445',
      state: 'SYN_SENT (SMB Rapid Lateral Probe - BACKUP-VAULT)',
      process: 'powershell.exe (PID 8840)',
      isMalicious: true
    },
    {
      proto: 'TCP',
      localAddr: '10.0.4.15:3389',
      remoteAddr: '10.0.1.20:51240',
      state: 'ESTABLISHED (Admin RDP Session - Devon Reed)',
      process: 'svchost.exe (PID 1044)',
      isMalicious: false
    },
    {
      proto: 'UDP',
      localAddr: '10.0.4.15:53',
      remoteAddr: '10.0.0.2:53',
      state: 'ACTIVE (Internal DNS Resolver)',
      process: 'dns.exe (PID 820)',
      isMalicious: false
    }
  ],
  fileActivity: [
    { time: '09:48:12', action: 'CREATED', path: 'C:\\Users\\sjenkins\\Desktop\\README_RESTORE_FILES.txt', tag: 'RANSOM_NOTE' },
    { time: '09:48:11', action: 'RENAMED', path: 'D:\\Shares\\Finance\\Q3_Revenue.xlsx.locked', tag: 'ENCRYPTED' },
    { time: '09:48:10', action: 'RENAMED', path: 'D:\\Shares\\Legal\\NDA_Templates.docx.locked', tag: 'ENCRYPTED' },
    { time: '09:48:09', action: 'DELETED', path: 'GLOBAL_SHADOW_SNAPSHOT_UUID_991823', tag: 'BACKUP_PURGE' },
    { time: '09:48:06', action: 'SPAWNED', path: 'C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe', tag: 'ANOMALY' }
  ],
  ransomNoteText: `====================================================================
!!! ALL YOUR CORPORATE FILES AND BACKUPS HAVE BEEN ENCRYPTED !!!
====================================================================
NexaTech Corporation Network has been compromised by LockBit Syndicate.
Your customer records, financial databases, and private intellectual
property are encrypted with military-grade AES-256 + RSA-4096.

TO RECOVER YOUR DATA:
1. Do NOT turn off, restart, or modify files. It will permanently corrupt keys.
2. Send 5.0 Bitcoin (BTC) to wallet: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
3. Contact our syndicate decrypter bot on Tor Onion at: http://lockbit3pay.onion

Failure to respond within 24 hours will result in public leak of all exfiltrated archives.
====================================================================`
};
