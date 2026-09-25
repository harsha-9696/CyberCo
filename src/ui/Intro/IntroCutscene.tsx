// IntroCutscene.tsx - Day 1 intro narrative typewriter sequence

import React, { useState, useEffect } from 'react';
import { audioSystem } from '../../game/systems/AudioSystem';

interface IntroCutsceneProps {
  onComplete: () => void;
}

export const IntroCutscene: React.FC<IntroCutsceneProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const lines = [
    { title: 'DAY 1', sub: '09:02 AM' },
    { title: 'REPORTING FOR DUTY', sub: 'Your first day as a junior cybersecurity analyst at CYBER CO.' },
    { title: 'ACTIVE INCIDENTS', sub: 'The company has recently experienced several suspicious digital incidents.' },
    { title: 'YOUR MISSION', sub: 'Investigate reports. Inspect clues. Secure the system. Trust nothing.' }
  ];

  useEffect(() => {
    audioSystem.play('notification');
    const handleKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
        advance();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [step]);

  const advance = () => {
    if (step < lines.length - 1) {
      audioSystem.play('dialogue');
      setStep((prev) => prev + 1);
    } else {
      audioSystem.play('door');
      onComplete();
    }
  };

  return (
    <div
      onClick={advance}
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#070a10',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        cursor: 'pointer',
        padding: '24px'
      }}
    >
      <div
        style={{
          maxWidth: '640px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '28px',
            color: 'var(--cyan-bright)',
            marginBottom: '16px',
            letterSpacing: '3px',
            textShadow: '0 0 15px rgba(0, 210, 230, 0.6)'
          }}
        >
          {lines[step].title}
        </h2>

        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '18px',
            lineHeight: '1.6',
            color: '#d0e4f5',
            marginBottom: '40px'
          }}
        >
          {lines[step].sub}
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px' }}>
          {lines.map((_, idx) => (
            <div
              key={idx}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: idx === step ? 'var(--cyan-bright)' : '#233247',
                boxShadow: idx === step ? '0 0 8px var(--cyan-bright)' : 'none'
              }}
            />
          ))}
        </div>

        <div
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '10px',
            color: 'var(--text-muted)',
            letterSpacing: '1px'
          }}
          className="animate-blink"
        >
          [ PRESS SPACE OR CLICK TO CONTINUE ]
        </div>
      </div>
    </div>
  );
};
