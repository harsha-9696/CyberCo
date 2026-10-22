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
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(180deg, rgba(18, 16, 26, 0.96) 0%, rgba(18, 16, 26, 0.8) 80%, rgba(18, 16, 26, 0) 100%)',
        borderBottom: '2px solid transparent',
        borderImage: 'linear-gradient(90deg, #f8b839, #00d2e6, #f28526) 1',
        zIndex: 500,
        pointerEvents: 'none'
      }}
    >
      {/* Left: Player Badge & Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '22px', pointerEvents: 'auto' }}>
        {/* Role ID */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '10px', color: 'var(--sunset-gold)', letterSpacing: '1.5px', fontWeight: 'bold' }}>
            OPERATOR
          </span>
          <span
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '11px',
              color: state.completedMissions?.includes('MISSION-004')
                ? 'var(--sunset-gold)'
                : state.completedMissions?.includes('MISSION-002')
                ? 'var(--cyan-bright)'
                : '#fff',
              textShadow: state.completedMissions?.includes('MISSION-004')
                ? '0 0 12px rgba(248, 184, 57, 0.9)'
                : '0 0 10px rgba(248, 184, 57, 0.6)'
            }}
          >
            {state.completedMissions?.includes('MISSION-004')
              ? 'SR. COMMANDER'
              : state.completedMissions?.includes('MISSION-002')
              ? 'SEC. ANALYST'
              : 'JR. ANALYST'}
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
          <AlertTriangle size={16} color={risk > 40 ? 'var(--neon-red)' : 'var(--sunset-gold)'} />
          <div style={{ display: 'flex', flexDirection: 'column', width: '90px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', marginBottom: '2px' }}>
              <span style={{ color: 'var(--text-muted)' }}>SYSTEM RISK</span>
              <span
                style={{
                  color: risk > 40 ? 'var(--neon-red)' : 'var(--sunset-gold)',
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
                  background: risk > 40 ? 'linear-gradient(90deg, #991a2e, #ff3355)' : 'linear-gradient(90deg, #99661a, #f8b839)'
                }}
              />
            </div>
          </div>
        </div>

        {/* XP */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Award size={16} color="var(--sunset-gold)" />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--sunset-gold)', textShadow: '0 0 8px rgba(248, 184, 57, 0.5)' }}>
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
          background: 'rgba(28, 22, 38, 0.88)',
          border: '1px solid var(--sunset-gold)',
          boxShadow: '0 0 12px rgba(248, 184, 57, 0.25)',
          padding: '6px 16px',
          borderRadius: '4px',
          maxWidth: '500px'
        }}
      >
        <Compass size={14} color="var(--sunset-gold)" className="animate-blink" />
        <span style={{ fontSize: '11px', color: 'var(--sunset-gold)', fontWeight: 'bold' }}>OBJECTIVE:</span>
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
