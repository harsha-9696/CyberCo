// ComputerDesktop.tsx - In-game retro operating system interface supporting Email, IAM Console, and Browser

import React, { useState } from 'react';
import { EmailApp } from '../Email/EmailApp';
import { IAMConsoleApp } from '../IAMConsole/IAMConsoleApp';
import { BrowserApp } from '../Browser/BrowserApp';
import { gameState, SecurityDecision } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { eventBridge, GameEvents } from '../../game/systems/EventBridge';
import {
  Monitor,
  Mail,
  Globe,
  FolderLock,
  KeyRound,
  X,
  Minus,
  Square,
  Wifi
} from 'lucide-react';

interface ComputerDesktopProps {
  onClose: () => void;
  onDecisionMade: (decision: SecurityDecision) => void;
}

export const ComputerDesktop: React.FC<ComputerDesktopProps> = ({ onClose, onDecisionMade }) => {
  const currentMission = gameState.getState().activeMissionId || 'MISSION-001';
  const [activeWindow, setActiveWindow] = useState<'email' | 'iam' | 'browser' | null>(
    currentMission === 'MISSION-003' ? 'browser' : currentMission === 'MISSION-002' ? 'iam' : 'email'
  );
  const [systemAlert, setSystemAlert] = useState<string | null>(null);

  const handleLaunchApp = (appName: string) => {
    audioSystem.play('computer_click');
    if (appName === 'email') {
      setActiveWindow('email');
    } else if (appName === 'iam') {
      setActiveWindow('iam');
    } else if (appName === 'browser') {
      setActiveWindow('browser');
    } else {
      audioSystem.play('warning');
      setSystemAlert(`Access to ${appName.toUpperCase()} is restricted. Clearance Level 2 required.`);
      setTimeout(() => setSystemAlert(null), 3200);
    }
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#070c14',
        backgroundImage: 'radial-gradient(circle at 50% 50%, #111a2c 0%, #060a12 100%)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1200,
        overflow: 'hidden'
      }}
    >
      {/* Desktop Space */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '24px'
        }}
      >
        {/* 1. App Icon: Mail Client */}
        <div
          onClick={() => handleLaunchApp('email')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '88px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            background: activeWindow === 'email' ? 'rgba(0, 210, 230, 0.15)' : 'transparent',
            border: activeWindow === 'email' ? '1px solid var(--cyan-dark)' : '1px solid transparent'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#131e30',
                border: '2px solid var(--cyan-bright)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0, 210, 230, 0.3)'
              }}
            >
              <Mail size={24} color="var(--cyan-bright)" />
            </div>
            {currentMission === 'MISSION-001' && (
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'var(--neon-red)',
                  borderRadius: '50%',
                  border: '2px solid #070c14',
                  boxShadow: '0 0 6px var(--neon-red)'
                }}
                className="animate-blink"
              />
            )}
          </div>
          <span style={{ fontSize: '11px', color: '#fff', textAlign: 'center', textShadow: '0 1px 2px #000' }}>
            Mail Client
          </span>
        </div>

        {/* 2. App Icon: IAM Console */}
        <div
          onClick={() => handleLaunchApp('iam')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '88px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            background: activeWindow === 'iam' ? 'rgba(245, 170, 40, 0.2)' : 'transparent',
            border: activeWindow === 'iam' ? '1px solid var(--neon-amber)' : '1px solid transparent'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#161c28',
                border: '2px solid var(--neon-amber)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(245, 170, 40, 0.4)'
              }}
            >
              <KeyRound size={24} color="var(--neon-amber)" />
            </div>
            {currentMission === 'MISSION-002' && (
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'var(--neon-red)',
                  borderRadius: '50%',
                  border: '2px solid #070c14',
                  boxShadow: '0 0 6px var(--neon-red)'
                }}
                className="animate-blink"
              />
            )}
          </div>
          <span style={{ fontSize: '11px', color: 'var(--neon-amber)', textAlign: 'center', fontWeight: 'bold' }}>
            IAM Console
          </span>
        </div>

        {/* 3. App Icon: Web Browser (Active in Mission 3) */}
        <div
          onClick={() => handleLaunchApp('browser')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '88px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px',
            background: activeWindow === 'browser' ? 'rgba(0, 210, 230, 0.2)' : 'transparent',
            border: activeWindow === 'browser' ? '1px solid var(--cyan-bright)' : '1px solid transparent'
          }}
        >
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: '#131e30',
                border: '2px solid var(--cyan-bright)',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 10px rgba(0, 210, 230, 0.3)'
              }}
            >
              <Globe size={24} color="var(--cyan-bright)" />
            </div>
            {currentMission === 'MISSION-003' && (
              <div
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -4,
                  width: '14px',
                  height: '14px',
                  backgroundColor: 'var(--neon-red)',
                  borderRadius: '50%',
                  border: '2px solid #070c14',
                  boxShadow: '0 0 6px var(--neon-red)'
                }}
                className="animate-blink"
              />
            )}
          </div>
          <span style={{ fontSize: '11px', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
            Web Browser
          </span>
        </div>

        {/* 4. App Icon: Files */}
        <div
          onClick={() => handleLaunchApp('files')}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            width: '88px',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '4px'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#131e30',
              border: '2px solid #334460',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FolderLock size={24} color="#7890b0" />
          </div>
          <span style={{ fontSize: '11px', color: '#8fa4be', textAlign: 'center' }}>
            Secure Files
          </span>
        </div>

        {/* System Alert Overlay if restricted app clicked */}
        {systemAlert && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(20, 28, 44, 0.95)',
              border: '1px solid var(--neon-amber)',
              color: 'var(--neon-amber)',
              padding: '10px 20px',
              borderRadius: '4px',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              boxShadow: '0 0 15px rgba(245, 170, 40, 0.3)',
              zIndex: 2000
            }}
          >
            {systemAlert}
          </div>
        )}

        {/* Active Application Window */}
        {activeWindow && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              bottom: '16px',
              left: '120px',
              right: '24px',
              backgroundColor: '#0c121e',
              border: `2px solid ${
                activeWindow === 'iam'
                  ? 'var(--neon-amber)'
                  : activeWindow === 'browser'
                  ? 'var(--cyan-bright)'
                  : 'var(--cyan-dark)'
              }`,
              boxShadow: '0 0 30px rgba(0, 0, 0, 0.8), 0 0 15px rgba(0, 210, 230, 0.2)',
              borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 50
            }}
          >
            {/* Window Titlebar */}
            <div
              style={{
                height: '34px',
                backgroundColor:
                  activeWindow === 'iam'
                    ? '#181f2b'
                    : activeWindow === 'browser'
                    ? '#111e2f'
                    : '#141e30',
                borderBottom: '1px solid #23344d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {activeWindow === 'email' ? (
                  <Mail size={16} color="var(--cyan-bright)" />
                ) : activeWindow === 'iam' ? (
                  <KeyRound size={16} color="var(--neon-amber)" />
                ) : (
                  <Globe size={16} color="var(--cyan-bright)" />
                )}
                <span
                  style={{
                    fontFamily: 'var(--font-pixel)',
                    fontSize: '10px',
                    color: activeWindow === 'iam' ? 'var(--neon-amber)' : '#fff',
                    letterSpacing: '1px'
                  }}
                >
                  {activeWindow === 'email'
                    ? 'NEXA-MAIL // CORPORATE INBOX (OFFICIAL)'
                    : activeWindow === 'iam'
                    ? 'NEXA-IAM // IDENTITY & ACCESS MANAGEMENT SECURITY CONSOLE'
                    : 'NEXA-BROWSER // ENTERPRISE WEB NAVIGATOR'}
                </span>
              </div>

              {/* Window Controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setActiveWindow(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8fa4be',
                    cursor: 'pointer'
                  }}
                >
                  <Minus size={14} />
                </button>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8fa4be',
                    cursor: 'pointer'
                  }}
                >
                  <Square size={12} />
                </button>
                <button
                  onClick={() => {
                    audioSystem.play('computer_click');
                    onClose();
                  }}
                  style={{
                    background: 'rgba(255, 51, 85, 0.2)',
                    border: '1px solid var(--neon-red)',
                    color: 'var(--neon-red)',
                    cursor: 'pointer',
                    borderRadius: '2px',
                    padding: '2px 4px'
                  }}
                  title="Close Computer & Return to Office"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Window Body: EmailApp, IAMConsoleApp, or BrowserApp */}
            <div style={{ flex: 1, minHeight: 0 }}>
              {activeWindow === 'email' ? (
                <EmailApp onDecisionMade={onDecisionMade} />
              ) : activeWindow === 'iam' ? (
                <IAMConsoleApp onDecisionMade={onDecisionMade} />
              ) : (
                <BrowserApp onDecisionMade={onDecisionMade} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Taskbar at Bottom */}
      <div
        style={{
          height: '42px',
          backgroundColor: '#0a0f19',
          borderTop: '2px solid #1c2738',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 16px',
          zIndex: 100
        }}
      >
        {/* Start Menu Button & Active Windows */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() =>
              handleLaunchApp(
                currentMission === 'MISSION-003'
                  ? 'browser'
                  : currentMission === 'MISSION-002'
                  ? 'iam'
                  : 'email'
              )
            }
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#152236',
              border: '1px solid var(--cyan-bright)',
              color: 'var(--cyan-bright)',
              padding: '6px 14px',
              borderRadius: '3px',
              fontFamily: 'var(--font-pixel)',
              fontSize: '10px',
              cursor: 'pointer'
            }}
          >
            <Monitor size={14} />
            NEXA-OS
          </button>

          {activeWindow && (
            <div
              style={{
                backgroundColor: '#1b2c45',
                border: '1px solid var(--cyan-dark)',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '3px',
                fontSize: '11px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {activeWindow === 'email' ? (
                <>
                  <Mail size={12} color="var(--cyan-bright)" />
                  Mail Client
                </>
              ) : activeWindow === 'iam' ? (
                <>
                  <KeyRound size={12} color="var(--neon-amber)" />
                  IAM Console
                </>
              ) : (
                <>
                  <Globe size={12} color="var(--cyan-bright)" />
                  Browser
                </>
              )}
            </div>
          )}
        </div>

        {/* Taskbar Right Tray: Time, Status, Close Desktop */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#6fa0cc' }}>
            <Wifi size={13} color="var(--neon-green)" />
            <span>INTRANET: ONLINE</span>
          </div>

          <span style={{ fontSize: '12px', color: '#d0e2f2', fontFamily: 'var(--font-mono)' }}>
            09:48 AM
          </span>

          <button
            onClick={() => {
              audioSystem.play('computer_click');
              onClose();
            }}
            className="cyber-button"
            style={{ padding: '6px 12px', fontSize: '9px' }}
          >
            LEAVE WORKSTATION [ESC]
          </button>
        </div>
      </div>
    </div>
  );
};
