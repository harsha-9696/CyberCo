// CaseFilesModal.tsx - Investigation dossier and security incidents archive

import React from 'react';
import { gameState } from '../../game/systems/GameState';
import { audioSystem } from '../../game/systems/AudioSystem';
import { FileText, CheckCircle2, Lock, X } from 'lucide-react';

interface CaseFilesModalProps {
  onClose: () => void;
}

export const CaseFilesModal: React.FC<CaseFilesModalProps> = ({ onClose }) => {
  const state = gameState.getState();
  const caseFilesList = Object.values(state.caseFiles || {});

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(5, 8, 15, 0.9)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2500,
        padding: '20px'
      }}
    >
      <div
        className="cyber-panel"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          padding: '28px',
          backgroundColor: '#0a101c',
          overflow: 'hidden'
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FileText size={20} color="var(--cyan-bright)" />
            <h3
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '13px',
                color: 'var(--cyan-bright)',
                margin: 0
              }}
            >
              SOC INCIDENT REGISTER & CASE DOSSIERS
            </h3>
          </div>

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

        {/* Case List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px', overflowY: 'auto', paddingRight: '6px' }}>
          {caseFilesList.map((caseFile) => (
            <div
              key={caseFile.id}
              style={{
                backgroundColor: '#101a2b',
                border: `1px solid ${caseFile.status === 'COMPLETED' ? 'var(--neon-green)' : caseFile.status === 'ACTIVE' ? 'var(--neon-amber)' : 'var(--cyan-dark)'}`,
                padding: '16px',
                borderRadius: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '11px',
                      color: caseFile.status === 'COMPLETED' ? 'var(--neon-green)' : caseFile.status === 'ACTIVE' ? 'var(--neon-amber)' : 'var(--cyan-bright)'
                    }}
                  >
                    {caseFile.id}: {caseFile.title}
                  </span>
                </div>

                <span
                  style={{
                    fontSize: '10px',
                    fontFamily: 'var(--font-pixel)',
                    padding: '3px 8px',
                    borderRadius: '2px',
                    backgroundColor:
                      caseFile.status === 'COMPLETED'
                        ? 'rgba(40, 230, 120, 0.2)'
                        : caseFile.status === 'ACTIVE'
                        ? 'rgba(245, 170, 40, 0.2)'
                        : 'rgba(0, 210, 230, 0.2)',
                    color:
                      caseFile.status === 'COMPLETED'
                        ? 'var(--neon-green)'
                        : caseFile.status === 'ACTIVE'
                        ? 'var(--neon-amber)'
                        : 'var(--cyan-bright)'
                  }}
                >
                  {caseFile.status}
                </span>
              </div>

              <div style={{ fontSize: '12px', color: '#abbfd6', marginBottom: '8px' }}>
                Evidence logged: <strong>{caseFile.cluesFound.length} of {caseFile.totalClues}</strong> indicators recorded.
              </div>

              {caseFile.decision && (
                <div style={{ fontSize: '12px', color: '#fff', marginBottom: '8px' }}>
                  Defensive Action: <strong style={{ color: 'var(--cyan-bright)' }}>{caseFile.decision.replace(/_/g, ' ')}</strong>
                </div>
              )}

              {caseFile.status === 'COMPLETED' && (
                <div style={{ backgroundColor: '#090e18', padding: '10px', borderRadius: '3px', border: '1px solid #1c2b40' }}>
                  <div style={{ fontSize: '10px', color: 'var(--neon-green)', fontFamily: 'var(--font-pixel)', marginBottom: '4px' }}>
                    KEY TAKEAWAYS
                  </div>
                  <ul style={{ paddingLeft: '18px', fontSize: '12px', color: '#8fa4be', lineHeight: '1.4' }}>
                    {caseFile.learningPoints.map((lp, i) => (
                      <li key={i}>{lp}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Future Cases Preview */}
          <div
            style={{
              backgroundColor: '#0c121e',
              border: '1px dashed #1e2c40',
              padding: '14px',
              borderRadius: '4px',
              opacity: 0.6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#7a8fa8' }}>
                CASE #003: Typosquatting & Rogue Portals
              </div>
              <div style={{ fontSize: '11px', color: '#566980', marginTop: '2px' }}>
                Focus: DNS spoofing and deceptive SSL certificates.
              </div>
            </div>
            <Lock size={16} color="#566980" />
          </div>

          <div
            style={{
              backgroundColor: '#0c121e',
              border: '1px dashed #1e2c40',
              padding: '14px',
              borderRadius: '4px',
              opacity: 0.6,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: '#7a8fa8' }}>
                CASE #004: Ransomware Containment & Endpoint Isolation
              </div>
              <div style={{ fontSize: '11px', color: '#566980', marginTop: '2px' }}>
                Focus: Malicious processes, egress blocking, and network segmentation.
              </div>
            </div>
            <Lock size={16} color="#566980" />
          </div>
        </div>

        {/* Close Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'auto' }}>
          <button
            onClick={() => {
              audioSystem.play('menu_select');
              onClose();
            }}
            className="cyber-button"
            style={{ padding: '8px 24px', fontSize: '10px' }}
          >
            CLOSE REGISTER
          </button>
        </div>
      </div>
    </div>
  );
};
