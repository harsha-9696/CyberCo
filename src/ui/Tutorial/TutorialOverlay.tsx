// TutorialOverlay.tsx - First-launch controls tutorial overlay

import React, { useState } from 'react';
import { gameState } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { Shield, ArrowRight } from 'lucide-react';

interface TutorialOverlayProps {
  onDismiss: () => void;
}

const STEPS = [
  {
    icon: '🎮',
    title: 'MOVEMENT',
    body: 'Use WASD or Arrow Keys to move your analyst through the office. Explore every room — the building has a Reception Lobby, Main Office, Manager\'s Office, and an IT/Server Room.',
    tip: 'Diagonal movement is supported!'
  },
  {
    icon: '⚡',
    title: 'INTERACT',
    body: 'Walk near people, computers, whiteboards, or servers and press E to interact. A glowing prompt will appear above interactable objects when you are in range.',
    tip: 'Talk to Marcus Vance (Manager) first to receive your mission briefing.'
  },
  {
    icon: '💻',
    title: 'WORKSTATION',
    body: 'Your glowing analyst desk is in the Main Office (center-left). Press E at your desk to open the in-game NEXA-OS. You will investigate incidents using the Email client, IAM Console, and Web Browser apps.',
    tip: 'The blinking red dot on a desktop icon means that app has an active incident.'
  },
  {
    icon: '🔍',
    title: 'INVESTIGATE FIRST',
    body: 'Before making a security decision, always inspect all available clues. Click every suspicious element in the apps. The HUD objective bar updates as you find evidence.',
    tip: 'Finding all clues before deciding earns bonus XP!'
  },
  {
    icon: '🛡️',
    title: 'YOUR MISSION',
    body: 'You are a junior cybersecurity analyst on Day 1 at CYBER CO. Real attacks are targeting the company RIGHT NOW. Your decisions affect awareness, system risk, and XP scores — choose wisely.',
    tip: 'SECURE THE SYSTEM. TRUST NOTHING.'
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ onDismiss }) => {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  const handleNext = () => {
    audioSystem.play('menu_select');
    if (isLast) {
      gameState.markTutorialSeen();
      onDismiss();
    } else {
      setStep(s => s + 1);
    }
  };

  const handleSkip = () => {
    audioSystem.play('computer_click');
    gameState.markTutorialSeen();
    onDismiss();
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(4, 8, 18, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '24px'
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '580px',
          padding: '32px',
          backgroundColor: '#090f1e',
          border: '2px solid var(--cyan-bright)',
          boxShadow: '0 0 40px rgba(0, 210, 230, 0.25)'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={20} color="var(--cyan-bright)" />
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--cyan-bright)', letterSpacing: '2px' }}>
              OPERATIVE ONBOARDING
            </span>
          </div>
          <button
            onClick={handleSkip}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '11px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              textDecoration: 'underline'
            }}
          >
            skip tutorial
          </button>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: '3px',
                backgroundColor: i <= step ? 'var(--cyan-bright)' : '#1c2a3e',
                borderRadius: '2px',
                transition: 'background-color 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* Icon + Title */}
        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{ fontSize: '40px', marginBottom: '10px' }}>{current.icon}</div>
          <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '16px', color: '#fff', margin: 0, letterSpacing: '2px' }}>
            {current.title}
          </h2>
        </div>

        {/* Body */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            lineHeight: '1.7',
            color: '#c5d8ec',
            textAlign: 'center',
            marginBottom: '16px'
          }}
        >
          {current.body}
        </p>

        {/* Tip box */}
        <div
          style={{
            background: 'rgba(0, 210, 230, 0.07)',
            border: '1px solid rgba(0, 210, 230, 0.3)',
            borderRadius: '4px',
            padding: '10px 14px',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ fontSize: '14px' }}>💡</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--cyan-bright)' }}>
            {current.tip}
          </span>
        </div>

        {/* Next Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleNext}
            className="cyber-button"
            style={{ padding: '12px 24px', fontSize: '11px' }}
          >
            {isLast ? 'BEGIN MISSION' : 'NEXT'}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
