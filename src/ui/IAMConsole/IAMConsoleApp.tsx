// IAMConsoleApp.tsx - Interactive Credential Stuffing & MFA Hardening Challenge (Mission 2)

import React, { useState } from 'react';
import { gameState, SecurityDecision } from '../../game/systems/GameState';
import { IAM_CLUES, IAM_INCIDENT_DATA, IAMClue } from '../../game/data/gameContent';
import { audioSystem } from '../../game/systems/AudioSystem';
import {
  ShieldAlert,
  KeyRound,
  Lock,
  Smartphone,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ShieldCheck,
  Server,
  UserX,
  History,
  HelpCircle
} from 'lucide-react';

interface IAMConsoleAppProps {
  onDecisionMade: (decision: SecurityDecision) => void;
}

export const IAMConsoleApp: React.FC<IAMConsoleAppProps> = ({ onDecisionMade }) => {
  const [selectedClue, setSelectedClue] = useState<IAMClue | null>(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);

  const state = gameState.getState();
  const discoveredClues = state.discoveredClues;
  const investigationScore = state.investigationScore;

  const handleInspect = (clueId: string) => {
    const clue = IAM_CLUES.find((c) => c.id === clueId);
    if (!clue) return;

    audioSystem.play('interaction');
    setSelectedClue(clue);
    gameState.addClue(clue.id, clue.scoreBonus);
  };

  const handleChooseDecision = (choice: SecurityDecision) => {
    audioSystem.play('computer_click');
    onDecisionMade(choice);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: '#090e17',
        color: '#e0ecf8',
        fontFamily: 'var(--font-mono)'
      }}
    >
      {/* 1. Left Telemetry & Account Dossier */}
      <div
        style={{
          width: '260px',
          backgroundColor: '#070b12',
          borderRight: '1px solid #1a273b',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
          <KeyRound size={20} color="var(--neon-amber)" />
          <div>
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-amber)' }}>
              NEXA-IAM
            </span>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>IDENTITY & ACCESS CONSOLE</div>
          </div>
        </div>

        {/* Target Profile Card */}
        <div
          style={{
            backgroundColor: '#0d1522',
            border: '1px solid #23344d',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}
        >
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
            TARGET USER ACCOUNT
          </div>
          <div style={{ fontSize: '13px', color: '#fff', fontWeight: 'bold' }}>
            {IAM_INCIDENT_DATA.targetUser}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--cyan-bright)' }}>
            {IAM_INCIDENT_DATA.targetEmail}
          </div>
          <div style={{ fontSize: '11px', color: '#8fa4be', marginTop: '4px' }}>
            {IAM_INCIDENT_DATA.role}
          </div>
          <div style={{ fontSize: '10px', color: '#5b7391' }}>
            Dept: {IAM_INCIDENT_DATA.department}
          </div>
        </div>

        {/* Attack Telemetry Metric */}
        <div
          style={{
            backgroundColor: 'rgba(255, 51, 85, 0.1)',
            border: '1px solid var(--neon-red)',
            padding: '12px',
            borderRadius: '4px',
            marginBottom: '16px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--neon-red)' }}>
            <Flame size={15} />
            <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '9px' }}>ACTIVE ATTACK DETECTED</span>
          </div>
          <div style={{ fontSize: '11px', color: '#fff', marginTop: '6px' }}>
            <strong>{IAM_INCIDENT_DATA.failedAttempts}</strong> failed logins recorded in 3 minutes.
          </div>
          <div style={{ fontSize: '10px', color: '#ff8899', marginTop: '4px' }}>
            {IAM_INCIDENT_DATA.activeSession}
          </div>
        </div>

        {/* Clue Progress Box */}
        <div
          style={{
            marginTop: 'auto',
            padding: '12px',
            backgroundColor: '#0b121e',
            border: '1px solid #1a273b',
            borderRadius: '4px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>CLUES FOUND</span>
            <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>
              {discoveredClues.length} / 4
            </span>
          </div>
          <div className="stat-bar-container" style={{ height: '8px', marginBottom: '8px' }}>
            <div
              className="stat-bar-fill stat-bar-green"
              style={{ width: `${(discoveredClues.length / 4) * 100}%` }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--cyan-bright)' }}>
            INVESTIGATION: {investigationScore} PTS
          </div>
        </div>
      </div>

      {/* 2. Middle: Incident Investigation Workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto', padding: '20px' }}>
        {/* Header Alert Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#131e30',
            border: '1px solid var(--neon-amber)',
            padding: '12px 18px',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <ShieldAlert size={22} color="var(--neon-amber)" />
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: '#fff' }}>
                INCIDENT #002: DISTRIBUTED CREDENTIAL STUFFING ATTACK
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Targeting Single Sign-On (SSO) Endpoint • Timestamp: {IAM_INCIDENT_DATA.timestamp}
              </div>
            </div>
          </div>

          <span
            style={{
              padding: '4px 10px',
              backgroundColor: 'rgba(245, 170, 40, 0.2)',
              color: 'var(--neon-amber)',
              fontFamily: 'var(--font-pixel)',
              fontSize: '9px',
              borderRadius: '2px'
            }}
          >
            CRITICAL SEVERITY
          </span>
        </div>

        {/* 4 Interactive Audit Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {/* Audit Panel 1: Password Entropy & Pattern */}
          <div
            style={{
              backgroundColor: '#101726',
              border: '1px solid #1e2c40',
              padding: '16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Lock size={16} color="var(--cyan-bright)" />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                  Compromised Account Password: <code style={{ color: 'var(--neon-amber)' }}>Summer2024!</code>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Entropy Metric: {IAM_INCIDENT_DATA.passwordEntropy}
              </div>
            </div>

            <button
              onClick={() => handleInspect('CLUE-PWD-01')}
              className={`cyber-button ${
                discoveredClues.includes('CLUE-PWD-01') ? 'cyber-button-success' : 'cyber-button-amber'
              }`}
              style={{ padding: '6px 12px', fontSize: '10px' }}
            >
              <Search size={13} />
              {discoveredClues.includes('CLUE-PWD-01') ? 'ENTROPY ANALYZED' : 'ANALYZE PASSWORD PATTERN'}
            </button>
          </div>

          {/* Audit Panel 2: Breach Correlation */}
          <div
            style={{
              backgroundColor: '#101726',
              border: '1px solid #1e2c40',
              padding: '16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Server size={16} color="var(--cyan-bright)" />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                  Threat Intelligence & Breach Correlation
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Check if user password was compromised in external 3rd-party vendor leaks.
              </div>
            </div>

            <button
              onClick={() => handleInspect('CLUE-PWD-02')}
              className={`cyber-button ${
                discoveredClues.includes('CLUE-PWD-02') ? 'cyber-button-success' : 'cyber-button-amber'
              }`}
              style={{ padding: '6px 12px', fontSize: '10px' }}
            >
              <Search size={13} />
              {discoveredClues.includes('CLUE-PWD-02') ? 'BREACH CORRELATED' : 'AUDIT BREACH REUSE'}
            </button>
          </div>

          {/* Audit Panel 3: MFA Policy */}
          <div
            style={{
              backgroundColor: '#101726',
              border: '1px solid #1e2c40',
              padding: '16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Smartphone size={16} color="var(--cyan-bright)" />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                  Multi-Factor Authentication (MFA) Policy: <span style={{ color: 'var(--neon-red)' }}>{IAM_INCIDENT_DATA.currentMfaStatus}</span>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Examines second-factor requirements and authenticator token mandates.
              </div>
            </div>

            <button
              onClick={() => handleInspect('CLUE-PWD-03')}
              className={`cyber-button ${
                discoveredClues.includes('CLUE-PWD-03') ? 'cyber-button-success' : 'cyber-button-amber'
              }`}
              style={{ padding: '6px 12px', fontSize: '10px' }}
            >
              <Search size={13} />
              {discoveredClues.includes('CLUE-PWD-03') ? 'MFA AUDITED' : 'INSPECT MFA CONFIG'}
            </button>
          </div>

          {/* Audit Panel 4: Gateway Lockout & Rate-Limiting */}
          <div
            style={{
              backgroundColor: '#101726',
              border: '1px solid #1e2c40',
              padding: '16px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <History size={16} color="var(--cyan-bright)" />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>
                  SSO Lockout & Brute-Force Rate Limiting: <span style={{ color: 'var(--neon-red)' }}>{IAM_INCIDENT_DATA.currentLockoutPolicy}</span>
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Examines automatic lockout thresholds after repeated authentication failures.
              </div>
            </div>

            <button
              onClick={() => handleInspect('CLUE-PWD-04')}
              className={`cyber-button ${
                discoveredClues.includes('CLUE-PWD-04') ? 'cyber-button-success' : 'cyber-button-amber'
              }`}
              style={{ padding: '6px 12px', fontSize: '10px' }}
            >
              <Search size={13} />
              {discoveredClues.includes('CLUE-PWD-04') ? 'LOCKOUT INSPECTED' : 'AUDIT RATE LIMITS'}
            </button>
          </div>
        </div>

        {/* Action Trigger Banner */}
        <div
          style={{
            marginTop: 'auto',
            borderTop: '2px solid #1c2738',
            paddingTop: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0c1322',
            padding: '16px',
            borderRadius: '4px'
          }}
        >
          <div>
            <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: '#fff', margin: '0 0 4px' }}>
              INCIDENT RESPONSE READY
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
              Formulate your identity mitigation policy to evict the intruder and harden the SSO gateway.
            </p>
          </div>

          <button
            onClick={() => {
              audioSystem.play('menu_select');
              setShowDecisionModal(true);
            }}
            className="cyber-button cyber-button-success"
            style={{ padding: '12px 20px', fontSize: '11px' }}
          >
            <ShieldCheck size={16} />
            EXECUTE DEFENSE POLICY
          </button>
        </div>
      </div>

      {/* 3. Right: Investigation Dossier / Finding Detail */}
      <div
        style={{
          width: '320px',
          backgroundColor: '#070b14',
          borderLeft: '1px solid #1a273b',
          display: 'flex',
          flexDirection: 'column',
          padding: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
          <Search size={16} color="var(--cyan-bright)" />
          <h4
            style={{
              fontFamily: 'var(--font-pixel)',
              fontSize: '11px',
              color: 'var(--cyan-bright)',
              margin: 0
            }}
          >
            IAM FORENSICS
          </h4>
        </div>

        {selectedClue ? (
          <div
            style={{
              backgroundColor: '#0f1726',
              border: '1px solid var(--cyan-dark)',
              padding: '14px',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <CheckCircle2 size={16} color="var(--neon-green)" />
              <span style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--neon-green)' }}>
                {selectedClue.name}
              </span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              WHAT YOU FOUND:
            </div>
            <div style={{ fontSize: '13px', color: '#fff', marginBottom: '12px', fontWeight: 'bold' }}>
              {selectedClue.finding}
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              WHY IT MATTERS:
            </div>
            <div style={{ fontSize: '12px', color: '#a6bcd4', lineHeight: '1.5' }}>
              {selectedClue.explanation}
            </div>
          </div>
        ) : (
          <div
            style={{
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-muted)',
              fontSize: '12px',
              border: '1px dashed #1a273b',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          >
            <HelpCircle size={28} color="#354966" style={{ margin: '0 auto 8px', display: 'block' }} />
            Click any <strong>AUDIT / ANALYZE</strong> button to uncover vulnerabilities in the authentication posture.
          </div>
        )}

        {/* Evidence Checklist */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
            IDENTITY VULNERABILITIES ({discoveredClues.length}/4)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {IAM_CLUES.map((clue) => {
              const found = discoveredClues.includes(clue.id);
              return (
                <div
                  key={clue.id}
                  onClick={() => found && setSelectedClue(clue)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 10px',
                    backgroundColor: found ? '#101a2b' : '#080d16',
                    border: `1px solid ${found ? 'var(--cyan-dark)' : '#162235'}`,
                    borderRadius: '3px',
                    cursor: found ? 'pointer' : 'default',
                    opacity: found ? 1 : 0.45
                  }}
                >
                  <CheckCircle2 size={13} color={found ? 'var(--neon-green)' : '#495d78'} />
                  <span style={{ fontSize: '11px', color: found ? '#fff' : '#6b829e' }}>
                    {clue.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 4. Decision Selection Modal */}
      {showDecisionModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(4, 7, 12, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div
            className="cyber-panel"
            style={{
              width: '100%',
              maxWidth: '580px',
              padding: '24px',
              background: '#0a101b'
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '14px',
                color: 'var(--cyan-bright)',
                marginBottom: '10px'
              }}
            >
              IDENTITY INCIDENT RESPONSE
            </h3>
            <p style={{ fontSize: '13px', color: '#abbfd6', lineHeight: '1.5', marginBottom: '20px' }}>
              Choose your defensive policy to evict the unauthorized session and prevent automated credential attacks.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => handleChooseDecision('ENFORCE_MFA_LOCKOUT')}
                className="cyber-button cyber-button-success"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>ENFORCE APP/FIDO2 MFA + PASSWORD RESET + 5-ATTEMPT LOCKOUT</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Mandate phishing-resistant TOTP, invalidate session, and throttle botnets</span>
                </span>
              </button>

              <button
                onClick={() => handleChooseDecision('RESET_PASSWORD_ONLY')}
                className="cyber-button"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <KeyRound size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>RESET EMPLOYEE PASSWORD ONLY (NO MFA ENFORCEMENT)</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Forces a new password string but leaves the SSO gateway on single-factor auth</span>
                </span>
              </button>

              <button
                onClick={() => handleChooseDecision('SMS_MFA_ONLY')}
                className="cyber-button cyber-button-amber"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <Smartphone size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>ENABLE SMS-BASED 2FA WITHOUT ACCOUNT LOCKOUT</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Adds SMS verification codes; vulnerable to SIM swap and bypass proxies</span>
                </span>
              </button>

              <button
                onClick={() => handleChooseDecision('IGNORE_INCIDENT')}
                className="cyber-button cyber-button-danger"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>DISMISS TELEMETRY AS A FALSE POSITIVE ALARM</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Take no mitigation action; assume employee logged in legitimately</span>
                </span>
              </button>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowDecisionModal(false)}
                className="cyber-button"
                style={{ padding: '6px 14px', fontSize: '10px' }}
              >
                CANCEL & AUDIT MORE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
