// MainMenu.tsx - Main Menu screen with cyberpunk aesthetic

import React, { useState, useEffect } from 'react';
import { gameState } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { Play, RotateCcw, Settings, Terminal, ShieldAlert } from 'lucide-react';

interface MainMenuProps {
  onStartNewGame: () => void;
  onContinueGame: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNewGame,
  onContinueGame,
  onOpenSettings
}) => {
  const [hasSave, setHasSave] = useState(false);

  useEffect(() => {
    setHasSave(gameState.hasSaveGame());
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at 50% 55%, rgba(242, 134, 40, 0.45) 0%, rgba(122, 34, 91, 0.45) 40%, rgba(42, 24, 68, 0.95) 75%, #0f0b18 100%)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Radiant Golden Hour Sun Disc in Background */}
      <div
        style={{
          position: 'absolute',
          width: '260px',
          height: '260px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #fff5b8 0%, #f8b839 40%, #f28526 70%, transparent 100%)',
          boxShadow: '0 0 80px rgba(248, 184, 57, 0.6), 0 0 140px rgba(242, 134, 40, 0.3)',
          opacity: 0.85,
          top: '20%',
          pointerEvents: 'none'
        }}
      />

      {/* Cyber Grid Floor Perspective */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(248, 184, 57, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(248, 184, 57, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          opacity: 0.7,
          pointerEvents: 'none'
        }}
      />

      {/* Cyber Corner Decals */}
      <div style={{ position: 'absolute', top: 20, left: 24, fontSize: '11px', color: 'var(--sunset-gold)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Terminal size={14} color="var(--sunset-gold)" />
        <span>NEO-TOKYO HQ // SOC NODE 01</span>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 24, fontSize: '11px', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="animate-blink">●</span>
        <span>DEFENSIVE OPS // ACTIVE</span>
      </div>

      {/* Main Title Container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          marginBottom: '40px',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '8px' }}>
          <ShieldAlert size={40} color="var(--sunset-gold)" className="animate-pulse-glow" />
          <h1
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '46px',
              letterSpacing: '6px',
              background: 'linear-gradient(180deg, #fff5b8 0%, #f8b839 50%, #f28526 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 25px rgba(248, 184, 57, 0.7))',
              margin: 0
            }}
          >
            CYBER CO
          </h1>
        </div>

        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            letterSpacing: '5px',
            color: '#fff',
            textTransform: 'uppercase',
            textShadow: '0 0 10px rgba(248, 184, 57, 0.8)',
            marginTop: '4px'
          }}
        >
          SECURE THE SYSTEM. TRUST NOTHING.
        </div>
      </div>

      {/* Menu Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          width: '280px',
          zIndex: 10
        }}
      >
        <button
          onClick={() => {
            audioSystem.play('menu_select');
            onStartNewGame();
          }}
          className="cyber-button cyber-button-success"
          style={{ padding: '14px 20px', fontSize: '12px' }}
        >
          <Play size={16} />
          NEW GAME
        </button>

        <button
          onClick={() => {
            if (hasSave) {
              audioSystem.play('menu_select');
              onContinueGame();
            }
          }}
          disabled={!hasSave}
          className="cyber-button"
          style={{ padding: '14px 20px', fontSize: '12px' }}
        >
          <RotateCcw size={16} />
          CONTINUE
        </button>

        <button
          onClick={() => {
            audioSystem.play('menu_select');
            onOpenSettings();
          }}
          className="cyber-button"
          style={{ padding: '14px 20px', fontSize: '12px' }}
        >
          <Settings size={16} />
          SETTINGS
        </button>
      </div>

      {/* Footer Info */}
      <div
        style={{
          position: 'absolute',
          bottom: 24,
          fontSize: '11px',
          color: 'var(--text-muted)',
          textAlign: 'center',
          letterSpacing: '1px'
        }}
      >
        <span>CYBERSECURITY AWARENESS TRAINING ENGINE</span>
        <div style={{ marginTop: '4px', fontSize: '10px', color: '#4a5d78' }}>
          CONTROLS: WASD / ARROW KEYS TO MOVE • [E] INTERACT • [SPACE] DIALOGUE
        </div>
      </div>
    </div>
  );
};
