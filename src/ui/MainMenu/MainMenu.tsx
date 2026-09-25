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
        background: 'radial-gradient(circle at 50% 40%, #162238 0%, #080d16 100%)',
        zIndex: 1000,
        overflow: 'hidden'
      }}
    >
      {/* Background Pixel City Skyline Silhouette & Animated Rain */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 210, 230, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 210, 230, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px',
          opacity: 0.8,
          pointerEvents: 'none'
        }}
      />

      {/* Cyber Corner Decals */}
      <div style={{ position: 'absolute', top: 20, left: 24, fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Terminal size={14} color="var(--cyan-bright)" />
        <span>SECURE TERMINAL // NODE 01</span>
      </div>

      <div style={{ position: 'absolute', top: 20, right: 24, fontSize: '11px', color: 'var(--neon-green)', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span className="animate-blink">●</span>
        <span>DEFENSIVE OPS ACTIVE</span>
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
          <ShieldAlert size={36} color="var(--cyan-bright)" className="animate-pulse-glow" />
          <h1
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '44px',
              letterSpacing: '6px',
              color: 'var(--cyan-bright)',
              textShadow: '0 0 20px rgba(0, 210, 230, 0.8), 0 0 40px rgba(0, 210, 230, 0.4)',
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
            color: 'var(--text-white)',
            textTransform: 'uppercase',
            opacity: 0.9,
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
