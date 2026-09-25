// MissionResultsModal.tsx - Case debrief, educational takeaways, and return to office

import React from 'react';
import { gameState } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { Award, CheckCircle, BookOpen, ArrowRight } from 'lucide-react';

interface MissionResultsModalProps {
  onReturnToOffice: () => void;
}

export const MissionResultsModal: React.FC<MissionResultsModalProps> = ({ onReturnToOffice }) => {
  const state = gameState.getState();
  const caseFile = state.caseFile;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.94)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2600,
        padding: '24px'
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '680px',
          padding: '32px',
          backgroundColor: '#0a101d',
          border: '2px solid var(--cyan-bright)',
          boxShadow: '0 0 30px rgba(0, 210, 230, 0.35)'
        }}
      >
        {/* Banner */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1f2f47',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={32} color="var(--neon-green)" />
            <div>
              <span style={{ fontSize: '10px', color: 'var(--neon-green)', letterSpacing: '2px', fontFamily: 'var(--font-pixel)' }}>
                INCIDENT RESOLVED
              </span>
              <h2 style={{ fontFamily: 'var(--font-pixel)', fontSize: '15px', color: '#fff', margin: '4px 0 0' }}>
                {caseFile.title.toUpperCase()}
              </h2>
            </div>
          </div>

          <div
            style={{
              padding: '6px 12px',
              backgroundColor: '#122238',
              border: '1px solid var(--cyan-dark)',
              borderRadius: '3px',
              fontFamily: 'var(--font-pixel)',
              fontSize: '10px',
              color: 'var(--cyan-bright)'
            }}
          >
            {caseFile.id}
          </div>
        </div>

        {/* Case Stats Summary */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '10px',
            marginBottom: '24px'
          }}
        >
          <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '4px', border: '1px solid #1a283e' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CLUES FOUND</span>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#fff', marginTop: '4px' }}>
              {state.discoveredClues.length} / {caseFile.totalClues}
            </div>
          </div>

          <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '4px', border: '1px solid #1a283e' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>INVESTIGATION</span>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--cyan-bright)', marginTop: '4px' }}>
              {state.discoveredClues.length >= 3 ? 'EXCELLENT' : 'ADEQUATE'}
            </div>
          </div>

          <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '4px', border: '1px solid #1a283e' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DECISION</span>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--neon-green)', marginTop: '4px' }}>
              {caseFile.decision?.replace(/_/g, ' ') || 'RESOLVED'}
            </div>
          </div>

          <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '4px', border: '1px solid #1a283e' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>XP TOTAL</span>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--neon-green)', marginTop: '4px' }}>
              {state.stats.xp} XP
            </div>
          </div>
        </div>

        {/* What You Learned Educational Section */}
        <div
          style={{
            backgroundColor: '#0c1524',
            border: '1px solid #23354f',
            padding: '18px',
            borderRadius: '4px',
            marginBottom: '28px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <BookOpen size={16} color="var(--cyan-bright)" />
            <h4
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '11px',
                color: 'var(--cyan-bright)',
                margin: 0
              }}
            >
              KEY CYBERSECURITY TAKEAWAYS
            </h4>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {caseFile.learningPoints.map((point, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <CheckCircle size={15} color="var(--neon-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: '#c5d8ec', lineHeight: '1.4' }}>
                  {point}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button: Return to Office */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => {
              audioSystem.play('interaction');
              onReturnToOffice();
            }}
            className="cyber-button cyber-button-success"
            style={{ padding: '14px 28px', fontSize: '11px' }}
          >
            RETURN TO OFFICE
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
