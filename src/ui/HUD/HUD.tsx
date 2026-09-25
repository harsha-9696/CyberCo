// HUD.tsx - Retro Top HUD with Player Awareness, Risk, XP, and Current Objective

import React, { useEffect, useState } from 'react';
import { gameState, GameSaveData } from '../../game/systems/GameState';
import { Shield, AlertTriangle, Award, Compass, FileText, Settings as SettingsIcon } from 'lucide-react';
import { audioSystem } from '../../game/systems/AudioSystem';

interface HUDProps {
  onOpenSettings: () => void;
  onOpenCaseFiles: () => void;
}

export const HUD: React.FC<HUDProps> = ({ onOpenSettings, onOpenCaseFiles }) => {
  const [state, setState] = useState<GameSaveData>(gameState.getState());

  useEffect(() => {
    return gameState.subscribe((s) => setState(s));
  }, []);

  if (state.currentScene === 'MainMenu') {
    return null;
  }

  const { awareness, risk, xp } = state.stats;

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(8, 12, 20, 0.95) 0%, rgba(8, 12, 20, 0.75) 80%, rgba(8, 12, 20, 0) 100%)',
        borderBottom: '1px solid rgba(0, 210, 230, 0.25)',
        zIndex: 500,
        pointerEvents: 'none'
      }}
    >
      {/* Left: Player Badge & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', pointerEvents: 'auto' }}>
        {/* Role ID */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
            OPERATOR
          </span>
          <span
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '11px',
              color: 'var(--cyan-bright)',
              textShadow: '0 0 8px var(--cyan-bright)'
            }}
          >
            JR. ANALYST
          </span>
        </div>

        {/* Awareness Metric */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Shield size={16} color="var(--cyan-bright)" />
          <div style={{ display: 'flex', flexDirection: 'column', width: '100px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
              <span style={{ color: 'var(--text-muted)' }}>AWARENESS</span>
              <span style={{ color: 'var(--cyan-bright)', fontFamily: 'var(--font-pixel)', fontSize: '8px' }}>
                {awareness}%
              </span>
            </div>
            <div className="stat-bar-container">
              <div className="stat-bar-fill stat-bar-cyan" style={{ width: `${awareness}%` }} />
            </div>
          </div>
        </div>

        {/* Risk Metric */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={16} color={risk > 40 ? 'var(--neon-red)' : 'var(--neon-amber)'} />
          <div style={{ display: 'flex', flexDirection: 'column', width: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
              <span style={{ color: 'var(--text-muted)' }}>SYSTEM RISK</span>
              <span
                style={{
                  color: risk > 40 ? 'var(--neon-red)' : 'var(--neon-amber)',
                  fontFamily: 'var(--font-pixel)',
                  fontSize: '8px'
                }}
              >
                {risk}%
              </span>
            </div>
            <div className="stat-bar-container">
              <div
                className="stat-bar-fill stat-bar-red"
                style={{
                  width: `${risk}%`,
                  background: risk > 40 ? 'linear-gradient(90deg, #991a2e, #ff3355)' : 'linear-gradient(90deg, #99661a, #f5aa28)'
                }}
              />
            </div>
          </div>
        </div>

        {/* XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={16} color="var(--neon-green)" />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-green)' }}>
            {xp} <span style={{ fontSize: '8px', color: 'var(--text-muted)' }}>XP</span>
          </span>
        </div>
      </div>

      {/* Center: Current Objective */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 24, 38, 0.85)',
          border: '1px solid var(--border-cyber)',
          padding: '6px 14px',
          borderRadius: '4px',
          maxWidth: '480px'
        }}
      >
        <Compass size={14} color="var(--neon-amber)" className="animate-blink" />
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>OBJECTIVE:</span>
        <span
          style={{
            fontSize: '12px',
            color: '#fff',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {state.currentObjective}
        </span>
      </div>

      {/* Right: Quick Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'auto' }}>
        <button
          onClick={() => {
            audioSystem.play('menu_select');
            onOpenCaseFiles();
          }}
          className="cyber-button"
          style={{ padding: '6px 10px', fontSize: '9px' }}
          title="Case Files & Security Logs"
        >
          <FileText size={12} />
          CASE FILES
        </button>

        <button
          onClick={() => {
            audioSystem.play('menu_select');
            onOpenSettings();
          }}
          className="cyber-button"
          style={{ padding: '6px 8px', fontSize: '9px' }}
          title="Game Settings"
        >
          <SettingsIcon size={13} />
        </button>
      </div>
    </div>
  );
};
