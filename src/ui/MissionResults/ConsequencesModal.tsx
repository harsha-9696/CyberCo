// ConsequencesModal.tsx - Displays immediate feedback and stat consequences of decision

import React from 'react';
import { SecurityDecision } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { ShieldCheck, AlertTriangle, XCircle, Award, ArrowUp, ArrowDown } from 'lucide-react';

interface ConsequencesModalProps {
  decision: SecurityDecision;
  result: {
    awarenessDelta: number;
    riskDelta: number;
    xpDelta: number;
    feedbackTitle: string;
    feedbackDescription: string;
  };
  onContinue: () => void;
}

export const ConsequencesModal: React.FC<ConsequencesModalProps> = ({
  decision,
  result,
  onContinue
}) => {
  const isPositive = decision === 'REPORT';
  const isNeutral = decision === 'DELETE';
  const isDanger = decision === 'OPEN_LINK' || decision === 'REPLY';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        padding: '24px'
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '620px',
          padding: '32px',
          backgroundColor: '#0c1322',
          border: `2px solid ${isPositive ? 'var(--neon-green)' : isNeutral ? 'var(--neon-amber)' : 'var(--neon-red)'}`,
          boxShadow: `0 0 25px ${
            isPositive
              ? 'rgba(40, 230, 120, 0.3)'
              : isNeutral
              ? 'rgba(245, 170, 40, 0.3)'
              : 'rgba(255, 51, 85, 0.3)'
          }`
        }}
      >
        {/* Header with Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
          {isPositive ? (
            <ShieldCheck size={36} color="var(--neon-green)" />
          ) : isNeutral ? (
            <AlertTriangle size={36} color="var(--neon-amber)" />
          ) : (
            <XCircle size={36} color="var(--neon-red)" />
          )}

          <div>
            <span
              style={{
                fontSize: '11px',
                color: isPositive ? 'var(--neon-green)' : isNeutral ? 'var(--neon-amber)' : 'var(--neon-red)',
                letterSpacing: '2px',
                fontFamily: 'var(--font-pixel)'
              }}
            >
              DECISION OUTCOME
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '18px',
                color: '#fff',
                margin: '4px 0 0'
              }}
            >
              {result.feedbackTitle}
            </h2>
          </div>
        </div>

        {/* Action Taken Label */}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--text-muted)',
            marginBottom: '18px',
            backgroundColor: '#101a2c',
            padding: '8px 12px',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          ACTION EXECUTED: <strong style={{ color: '#fff' }}>{decision.replace('_', ' ')}</strong>
        </div>

        {/* Narrative Consequence */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '15px',
            lineHeight: '1.6',
            color: '#d6e4f2',
            marginBottom: '28px'
          }}
        >
          {result.feedbackDescription}
        </p>

        {/* Stat Changes Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginBottom: '32px'
          }}
        >
          {/* Awareness */}
          <div
            style={{
              backgroundColor: '#121c2e',
              border: '1px solid #23344d',
              padding: '12px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              AWARENESS
            </div>
            <div
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '14px',
                color: result.awarenessDelta >= 0 ? 'var(--neon-green)' : 'var(--neon-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              {result.awarenessDelta >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
              {result.awarenessDelta >= 0 ? `+${result.awarenessDelta}` : result.awarenessDelta}%
            </div>
          </div>

          {/* Risk */}
          <div
            style={{
              backgroundColor: '#121c2e',
              border: '1px solid #23344d',
              padding: '12px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              SYSTEM RISK
            </div>
            <div
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '14px',
                color: result.riskDelta <= 0 ? 'var(--neon-green)' : 'var(--neon-red)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              {result.riskDelta <= 0 ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
              {result.riskDelta > 0 ? `+${result.riskDelta}` : result.riskDelta}%
            </div>
          </div>

          {/* XP */}
          <div
            style={{
              backgroundColor: '#121c2e',
              border: '1px solid #23344d',
              padding: '12px',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              XP EARNED
            </div>
            <div
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '14px',
                color: 'var(--cyan-bright)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px'
              }}
            >
              <Award size={14} />
              +{result.xpDelta}
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              audioSystem.play('menu_select');
              onContinue();
            }}
            className="cyber-button cyber-button-success"
            style={{ padding: '12px 24px', fontSize: '11px' }}
          >
            PROCEED TO CASE DEBRIEF
          </button>
        </div>
      </div>
    </div>
  );
};
