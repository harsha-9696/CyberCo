# CYBER CO
> **SECURE THE SYSTEM. TRUST NOTHING.**

A 2D top-down retro pixel-art cybersecurity awareness and digital investigation game built with **TypeScript**, **React**, **Phaser 3**, and **Vite**.

---

## 🏢 PROJECT OVERVIEW

**CYBER CO** places you in the shoes of a junior cybersecurity analyst reporting for Day 1 at corporate headquarters. When the Security Operations Center (SOC) detects suspicious anomalies and targeted social engineering attacks against employees, you must physically explore the office, interrogate staff, operate your cyber analyst workstation, inspect technical clues, and make high-stakes defensive decisions.

### 🎮 Gameplay Loop
```
MAIN MENU 
  ↓
START GAME (DAY 1 CUTSCENE)
  ↓
STAND OUTSIDE CYBER CO HEADQUARTERS
  ↓
WALK INTO BUILDING
  ↓
EXPLORE OFFICE ENVIRONMENT
  ↓
TALK TO NPC (MANAGER MARCUS VANCE)
  ↓
RECEIVE MISSION: "CHECK YOUR WORKSTATION"
  ↓
WALK TO PLAYER WORKSTATION DESK
  ↓
INTERACT [E] → BOOT IN-GAME OPERATING SYSTEM
  ↓
OPEN EMAIL CLIENT
  ↓
INVESTIGATE TARGETED PHISHING ATTACK
  ↓
INSPECT CLUES (SENDER DOMAIN, URGENCY, DESTINATION URL, MALICIOUS ATTACHMENT)
  ↓
MAKE SECURITY DECISION (REPORT / DELETE / REPLY / OPEN LINK)
  ↓
EXPERIENCE OPERATIONAL CONSEQUENCES & STAT IMPACTS (AWARENESS, RISK, XP)
  ↓
LEARN DEFENSIVE CYBERSECURITY TAKEAWAYS
  ↓
COMPLETE MISSION & UPDATE CASE DOSSIER
  ↓
RETURN TO OFFICE FLOOR
  ↓
AUTO-SAVE & CONTINUE CAPABILITY
```

---

## 💻 TECHNOLOGY STACK

- **Language:** TypeScript 5.7
- **UI & Menus:** React 18
- **Game Engine & World:** Phaser 3.88 (Arcade Physics, Tilemap rendering, Sprite animations, Dynamic depth sorting)
- **Bundler:** Vite 6
- **Styling:** Custom 16-bit Cyberpunk CSS with CRT scanline simulation & retro pixel typography
- **Audio:** Web Audio API synthesized procedural 8-bit sound effects (zero external audio files required)
- **Asset Generation:** Custom reproducible pure Node.js PNG procedural pixel-art asset generation pipeline (`scripts/generate-assets.js`)
- **Persistence:** Strongly typed `localStorage` save system

---

## 🚀 GETTING STARTED

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation
```bash
npm install
```

### Asset Generation
All 16-bit pixel-art tilesets, character spritesheets, office furniture, computers, and UI icons are generated programmatically:
```bash
npm run generate-assets
```

### Run Development Server
```bash
npm run dev
```
Open your browser and navigate to: `http://localhost:5173/`

### Production Build
```bash
npm run build
```
To preview the production build locally:
```bash
npm run preview
```

---

## 🕹️ CONTROLS

| Key | Action |
| --- | --- |
| **W / A / S / D** or **Arrow Keys** | 4-Directional Player Movement |
| **E** | Interact (Enter doors, talk to NPCs, use computer, inspect items) |
| **SPACE** or **ENTER** | Advance dialogue / Continue narrative cutscene |
| **ESC** | Exit in-game computer desktop / Close modal windows |

---

## 🎯 CURRENT PLAYABLE CONTENT (VERTICAL SLICE)

- **Main Menu:** Cyberpunk title screen with glowing neon branding, atmospheric city backdrop, audio feedback, New Game, Continue (loads saved progress), and Settings.
- **Intro Sequence:** Day 1 09:02 AM briefing setting up the company incident context.
- **Exterior Scene:** Nighttime city exterior with building facade, illuminated windows, ambient street lamps, trees, sidewalk, and interactive headquarters double entrance doors.
- **Office Interior:**
  - Reception lobby with Receptionist NPC (Elena Rostova), waiting area, and corporate logo.
  - Manager's office with executive desk, cybersecurity incident whiteboard, and Manager NPC (Marcus Vance).
  - Main office floor with workstations, filing cabinets, water dispenser, and colleague desks.
  - Player's designated workstation with highlighted glowing dual monitors.
  - IT / Server room with IT Specialist NPC (Devon Reed) and enterprise server racks.
- **In-Game Operating System (NEXA-OS):**
  - Working desktop with taskbar, start menu, system clock, and application launchers.
- **Mission 001 — Phishing Investigation Challenge:**
  - Deceptive email disguised as HR Payroll Support (`hr@nexatech-payroll-support.example`).
  - Interactive inspection of 4 red flag indicators (Sender Domain, Coercive Urgency, Spoofed Link Destination, and Camouflaged `.exe` Attachment).
  - Live Clue Evidence Register & Investigation Score calculation.
  - Decision Matrix: Report to SOC, Delete Email, Reply to Sender, or Open Link.
  - Immediate operational consequences, stat deltas (Awareness, System Risk, XP), and educational security takeaways.
- **Mission 002 — Password Security & MFA Hardening Challenge:**
  - Live brute-force & credential stuffing alert targeting the Single Sign-On (SSO) gateway.
  - Target account: `sjenkins@nexatech.internal` (Senior Financial Analyst, Finance).
  - Interactive audit of 4 vulnerability indicators:
    1. Weak seasonal password pattern (`Summer2024!` entropy analysis).
    2. Cross-platform password reuse from 3rd-party vendor leaks.
    3. SSO gateway allowing single-factor authentication (MFA optional).
    4. Account lockout thresholds and IP rate-limiting disabled (840 attempts in 3 min).
  - Mitigation Decision Matrix:
    1. Enforce App/Hardware MFA + Forced Password Reset + 5-Attempt Lockout.
    2. Reset Password Only (Partial Mitigation).
    3. Enable SMS MFA Only (Suboptimal Method).
    4. Dismiss as False Positive (Compromise).
  - Live Case #002 dossier update, stat calculations, and incident debriefing.
- **Mission 003 — Scams & Fake Look-Alike Websites (Typosquatting & Rogue Portals):**
  - High-priority security incident triggered across Marketing & Operations via smishing/chat links.
  - Working **NEXA-BROWSER** web application with interactive tab navigation, address bar, and SSL inspector.
  - Reported Rogue Clone Portal: `https://portal-nexatech-login.com/sso/auth`.
  - Official Reference Intranet: `https://login.nexatech.internal/auth`.
  - In-depth forensic investigation of 4 deceptive elements:
    1. **Typosquatted Look-Alike Domain:** Hyphenated brand domain deceiving hurried employees.
    2. **Deceptive HTTPS Padlock & CA Discrepancy:** Proves that an SSL padlock alone does NOT guarantee safety (free automated Domain-Validated cert issued to anonymous registrants vs corporate EV wildcard cert).
    3. **Exfiltration Action URL:** Form `POST` payload routed to an offshore data harvesting endpoint (`194.26.29.112/collect.php`).
    4. **Manipulated Visual Clones & Urgency Banners:** Faked corporate theme with artificial expiration warnings to compel immediate credential entry.
  - Interactive forensic tabs: Live Website View, Deep Forensic Inspector, and Evidence Register.
  - Defensive Incident Mitigation Matrix:
    1. **DNS Sinkhole + Security Advisory:** Blacklist rogue domain on corporate DNS resolvers, reroute visitors to awareness portal, and revoke leaked sessions (+100 XP, -15% Risk, +15% Awareness, Web Sentinel Badge).
    2. **Issue User Warning Only:** Send email warning without active DNS/firewall block (+40 XP, +10% Risk).
    3. **Counter-Attack / Flood Rogue Server:** Run unauthorized credential flooding (illegal vigilante action, +15 XP, +25% Risk).
    4. **Trust HTTPS Padlock & Whitelist:** False negative decision causing full credential harvesting (-20 XP, +35% Risk).
- **Save & Load:** Complete state persistence in `localStorage` preserving scene location, awareness, risk, XP, discovered clues, and completed missions across browser refreshes.

---

## 🔮 FUTURE MISSION ARCHITECTURE

The centralized state and mission engine is pre-architected to accommodate future cybersecurity training modules:

1. **Mission 4: Malware & Ransomware Incident Response**
   - Malicious macros, host quarantine, network segmentation, and digital forensics containment.
2. **Mission 5: Social Engineering & Physical Security (Tailgating / USB Drop)**
   - Badge cloning, rogue USB drops in the parking lot, and social engineering confrontation.

---

## 🛡️ EDUCATIONAL ETHICS & SAFETY NOTICE

All attacks, corporate names, domains, and IP addresses simulated in this game are entirely fictional (`.example` and `.internal` pseudo-domains). The game is designed strictly for defensive cybersecurity awareness and educational best practices. No real credentials or offensive exploitation techniques are ever used.
