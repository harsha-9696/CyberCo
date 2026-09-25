// SettingsModal.tsx - Audio, display effects, and controls reference

import React, { useState } from 'react';
import { gameState } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { Volume2, VolumeX, Monitor, RotateCcw, X, KeyRound, Keyboard } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
  onResetGame?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onResetGame }) => {
  const [settings, setSettings] = useState(gameState.getState().settings);

  const toggleSfx = () => {
    const updated = !settings.sfx;
    setSettings((prev) => ({ ...prev, sfx: updated }));
    audioSystem.setMuted(!updated);
    if (updated) audioSystem.play('menu_select');
    gameState.updateState({ settings: { ...settings, sfx: updated } });
  };

  const toggleCrt = () => {
    const updated = !settings.crtEffect;
    setSettings((prev) => ({ ...prev, crtEffect: updated }));
    audioSystem.play('menu_select');
    gameState.updateState({ settings: { ...settings, crtEffect: updated } });
  };

  const handleReset = () => {
    if (window.confirm('Reset all progress and start fresh? This cannot be undone.')) {
      audioSystem.play('warning');
      gameState.resetGame();
      if (onResetGame) {
        onResetGame();
      }
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.88)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 3000,
        padding: '20px'
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '28px',
          backgroundColor: '#0a101c'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            borderBottom: '1px solid #1c2738',
            paddingBottom: '12px'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '13px',
              color: 'var(--cyan-bright)',
              margin: 0
            }}
          >
            TERMINAL SETTINGS
          </h3>

          <button
            onClick={() => {
              audioSystem.play('menu_select');
              onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#8fa4be',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* SFX */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#101726',
              padding: '12px 16px',
              borderRadius: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {settings.sfx ? <Volume2 size={18} color="var(--neon-green)" /> : <VolumeX size={18} color="var(--neon-red)" />}
              <div>
                <div style={{ fontSize: '13px', color: '#fff' }}>Synthesized Audio (SFX)</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>8-bit Web Audio feedback</div>
              </div>
            </div>

            <button
              onClick={toggleSfx}
              className={`cyber-button ${settings.sfx ? 'cyber-button-success' : ''}`}
              style={{ padding: '6px 14px', fontSize: '9px' }}
            >
              {settings.sfx ? 'ENABLED' : 'MUTED'}
            </button>
          </div>

          {/* CRT Scanline Shader */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#101726',
              padding: '12px 16px',
              borderRadius: '4px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Monitor size={18} color="var(--cyan-bright)" />
              <div>
                <div style={{ fontSize: '13px', color: '#fff' }}>CRT Scanline Simulation</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Retro monitor scanline effect</div>
              </div>
            </div>

            <button
              onClick={toggleCrt}
              className={`cyber-button ${settings.crtEffect ? 'cyber-button-success' : ''}`}
              style={{ padding: '6px 14px', fontSize: '9px' }}
            >
              {settings.crtEffect ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>

        {/* Controls Reference */}
        <div
          style={{
            backgroundColor: '#0c1322',
            border: '1px solid #1c2738',
            padding: '14px',
            borderRadius: '4px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Keyboard size={16} color="var(--cyan-bright)" />
            <span style={{ fontSize: '11px', fontFamily: 'var(--font-pixel)', color: 'var(--cyan-bright)' }}>
              CONTROL BINDINGS
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '12px' }}>
            <div>
              <strong style={{ color: 'var(--cyan-bright)' }}>WASD / ARROWS:</strong>{' '}
              <span style={{ color: '#8fa4be' }}>Move Character</span>
            </div>
            <div>
              <strong style={{ color: 'var(--cyan-bright)' }}>[E]:</strong>{' '}
              <span style={{ color: '#8fa4be' }}>Interact / Use</span>
            </div>
            <div>
              <strong style={{ color: 'var(--cyan-bright)' }}>[SPACE]:</strong>{' '}
              <span style={{ color: '#8fa4be' }}>Advance Dialogue</span>
            </div>
            <div>
              <strong style={{ color: 'var(--cyan-bright)' }}>[ESC]:</strong>{' '}
              <span style={{ color: '#8fa4be' }}>Exit Desktop / Close</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handleReset}
            className="cyber-button cyber-button-danger"
            style={{ padding: '8px 14px', fontSize: '10px' }}
          >
            <RotateCcw size={14} />
            RESET SAVE
          </button>

          <button
            onClick={() => {
              audioSystem.play('menu_select');
              onClose();
            }}
            className="cyber-button"
            style={{ padding: '8px 20px', fontSize: '10px' }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
