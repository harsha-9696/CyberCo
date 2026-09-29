// EmailApp.tsx - Interactive Phishing Investigation and Security Decision challenge

import React, { useState } from 'react';
import { gameState } from '../../game/systems/GameState';
import { PHISHING_CLUES, EMAIL_DATA, PhishingClue } from '../../game/data/gameContent';
import { audioSystem } from '../../game/systems/AudioSystem';
import { eventBridge, GameEvents } from '../../game/systems/EventBridge';
import {
  Mail,
  Inbox,
  Send,
  Trash2,
  FileText,
  AlertOctagon,
  Search,
  ExternalLink,
  Paperclip,
  CheckCircle2,
  HelpCircle,
  ShieldCheck
} from 'lucide-react';

interface EmailAppProps {
  onDecisionMade: (decision: 'REPORT' | 'DELETE' | 'REPLY' | 'OPEN_LINK') => void;
}

export const EmailApp: React.FC<EmailAppProps> = ({ onDecisionMade }) => {
  const [activeFolder, setActiveFolder] = useState<'inbox' | 'sent' | 'drafts' | 'trash'>('inbox');
  const [selectedClue, setSelectedClue] = useState<PhishingClue | null>(null);
  const [hoveredLink, setHoveredLink] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<'REPORT' | 'DELETE' | 'REPLY' | 'OPEN_LINK' | null>(null);

  const state = gameState.getState();
  const discoveredClues = state.discoveredClues;
  const investigationScore = state.investigationScore;

  const handleInspect = (clueId: string) => {
    const clue = PHISHING_CLUES.find((c) => c.id === clueId);
    if (!clue) return;

    audioSystem.play('interaction');
    setSelectedClue(clue);
    gameState.addClue(clue.id, clue.scoreBonus);
  };

  const handleChooseDecision = (choice: 'REPORT' | 'DELETE' | 'REPLY' | 'OPEN_LINK') => {
    audioSystem.play('computer_click');
    setPendingDecision(null);
    onDecisionMade(choice);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        backgroundColor: '#0c121e',
        color: '#e0ecf8',
        fontFamily: 'var(--font-mono)'
      }}
    >
      {/* 1. Left Email Folders Sidebar */}
      <div
        style={{
          width: '200px',
          backgroundColor: '#090e17',
          borderRight: '1px solid #1c2738',
          display: 'flex',
          flexDirection: 'column',
          padding: '12px 0'
        }}
      >
        <div style={{ padding: '0 16px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Mail size={18} color="var(--cyan-bright)" />
          <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '10px', color: 'var(--cyan-bright)' }}>
            NEXA-MAIL
          </span>
        </div>

        <button
          onClick={() => {
            audioSystem.play('computer_click');
            setActiveFolder('inbox');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
            background: activeFolder === 'inbox' ? '#162338' : 'transparent',
            border: 'none',
            borderLeft: activeFolder === 'inbox' ? '3px solid var(--cyan-bright)' : '3px solid transparent',
            color: activeFolder === 'inbox' ? '#fff' : '#8fa4be',
            cursor: 'pointer',
            textAlign: 'left',
            fontFamily: 'inherit'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
            <Inbox size={15} />
            Inbox
          </div>
          <span
            style={{
              fontSize: '10px',
              backgroundColor: 'var(--neon-red)',
              color: '#fff',
              padding: '1px 6px',
              borderRadius: '8px',
              fontWeight: 'bold'
            }}
          >
            1
          </span>
        </button>

        <button
          onClick={() => {
            audioSystem.play('computer_click');
            setActiveFolder('sent');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: activeFolder === 'sent' ? '#162338' : 'transparent',
            border: 'none',
            borderLeft: activeFolder === 'sent' ? '3px solid var(--cyan-bright)' : '3px solid transparent',
            color: activeFolder === 'sent' ? '#fff' : '#8fa4be',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          <Send size={15} />
          Sent Items
        </button>

        <button
          onClick={() => {
            audioSystem.play('computer_click');
            setActiveFolder('drafts');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: activeFolder === 'drafts' ? '#162338' : 'transparent',
            border: 'none',
            borderLeft: activeFolder === 'drafts' ? '3px solid var(--cyan-bright)' : '3px solid transparent',
            color: activeFolder === 'drafts' ? '#fff' : '#8fa4be',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          <FileText size={15} />
          Drafts
        </button>

        <button
          onClick={() => {
            audioSystem.play('computer_click');
            setActiveFolder('trash');
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: activeFolder === 'trash' ? '#162338' : 'transparent',
            border: 'none',
            borderLeft: activeFolder === 'trash' ? '3px solid var(--cyan-bright)' : '3px solid transparent',
            color: activeFolder === 'trash' ? '#fff' : '#8fa4be',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          <Trash2 size={15} />
          Trash
        </button>

        {/* Evidence Status Widget */}
        <div
          style={{
            marginTop: 'auto',
            padding: '14px',
            margin: '12px',
            backgroundColor: '#0f1724',
            border: '1px solid #24354c',
            borderRadius: '4px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <Search size={14} color="var(--neon-amber)" />
            <span style={{ fontSize: '10px', fontFamily: 'var(--font-pixel)', color: 'var(--neon-amber)' }}>
              INVESTIGATION
            </span>
          </div>
          <div style={{ fontSize: '11px', color: '#8fa4be', marginBottom: '4px' }}>
            CLUES FOUND: {discoveredClues.length} / 4
          </div>
          <div className="stat-bar-container" style={{ height: '8px', marginBottom: '8px' }}>
            <div
              className="stat-bar-fill stat-bar-green"
              style={{ width: `${(discoveredClues.length / 4) * 100}%` }}
            />
          </div>
          <div style={{ fontSize: '10px', color: 'var(--cyan-bright)' }}>
            INTEL SCORE: {investigationScore} PTS
          </div>
        </div>
      </div>

      {/* 2. Middle: Email Reading Pane */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {activeFolder !== 'inbox' ? (
          <div
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)'
            }}
          >
            Folder is empty.
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            {/* Email Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #1c2738',
                backgroundColor: '#101826'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ fontSize: '17px', color: '#fff', margin: 0, fontWeight: 600 }}>
                  {EMAIL_DATA.subject}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{EMAIL_DATA.date}</span>
              </div>

              {/* Sender Details & Inspection Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginTop: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '13px', color: '#d2e2f2' }}>
                    <strong>From:</strong> {EMAIL_DATA.fromName} &lt;{EMAIL_DATA.fromAddress}&gt;
                  </div>
                  <div style={{ fontSize: '12px', color: '#7a91ad' }}>
                    <strong>To:</strong> {EMAIL_DATA.to}
                  </div>
                </div>

                <button
                  onClick={() => handleInspect('PHISHING-01')}
                  className={`cyber-button ${
                    discoveredClues.includes('PHISHING-01') ? 'cyber-button-success' : 'cyber-button-amber'
                  }`}
                  style={{ padding: '6px 12px', fontSize: '10px' }}
                >
                  <Search size={13} />
                  {discoveredClues.includes('PHISHING-01') ? 'SENDER INSPECTED' : 'INSPECT SENDER'}
                </button>
              </div>
            </div>

            {/* Email Body Content */}
            <div style={{ padding: '24px 20px', flex: 1 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '14px'
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>MESSAGE BODY</span>
                <button
                  onClick={() => handleInspect('PHISHING-02')}
                  className={`cyber-button ${
                    discoveredClues.includes('PHISHING-02') ? 'cyber-button-success' : 'cyber-button-amber'
                  }`}
                  style={{ padding: '4px 10px', fontSize: '9px' }}
                >
                  <AlertOctagon size={12} />
                  {discoveredClues.includes('PHISHING-02') ? 'URGENCY ANALYZED' : 'INSPECT TONE & URGENCY'}
                </button>
              </div>

              <div
                style={{
                  whiteSpace: 'pre-line',
                  lineHeight: '1.7',
                  fontSize: '14px',
                  color: '#cad9ea',
                  marginBottom: '24px',
                  backgroundColor: '#0e1624',
                  padding: '16px',
                  border: '1px solid #1a2538',
                  borderRadius: '4px'
                }}
              >
                {EMAIL_DATA.bodyText}
              </div>

              {/* Suspicious Action Link */}
              <div
                style={{
                  backgroundColor: '#121c2e',
                  border: '1px dashed #2d4263',
                  padding: '16px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div
                    onMouseEnter={() => setHoveredLink(true)}
                    onMouseLeave={() => setHoveredLink(false)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--cyan-bright)',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: 'bold'
                    }}
                  >
                    <ExternalLink size={14} />
                    {EMAIL_DATA.buttonText}
                  </div>
                  {hoveredLink && (
                    <span style={{ fontSize: '11px', color: 'var(--neon-amber)' }}>
                      Target Destination: {EMAIL_DATA.destinationUrl}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => handleInspect('PHISHING-03')}
                  className={`cyber-button ${
                    discoveredClues.includes('PHISHING-03') ? 'cyber-button-success' : 'cyber-button-amber'
                  }`}
                  style={{ padding: '6px 12px', fontSize: '10px' }}
                >
                  <Search size={13} />
                  {discoveredClues.includes('PHISHING-03') ? 'LINK ANALYZED' : 'INSPECT LINK DESTINATION'}
                </button>
              </div>

              {/* Attachment */}
              <div
                style={{
                  backgroundColor: '#101826',
                  border: '1px solid #1c2738',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '28px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Paperclip size={18} color="var(--neon-amber)" />
                  <div>
                    <div style={{ fontSize: '13px', color: '#fff' }}>{EMAIL_DATA.attachmentName}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                      {EMAIL_DATA.attachmentSize} // Attachment
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleInspect('PHISHING-04')}
                  className={`cyber-button ${
                    discoveredClues.includes('PHISHING-04') ? 'cyber-button-success' : 'cyber-button-amber'
                  }`}
                  style={{ padding: '6px 12px', fontSize: '10px' }}
                >
                  <Search size={13} />
                  {discoveredClues.includes('PHISHING-04') ? 'ATTACHMENT CHECKED' : 'INSPECT ATTACHMENT'}
                </button>
              </div>

              {/* Final Decision Action Banner */}
              <div
                style={{
                  borderTop: '2px solid #23334d',
                  paddingTop: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(16, 26, 42, 0.6)',
                  padding: '16px',
                  borderRadius: '4px'
                }}
              >
                <div>
                  <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#fff', margin: '0 0 4px' }}>
                    READY TO TAKE ACTION?
                  </h4>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>
                    Evaluate your discovered clues and execute your response policy.
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
                  MAKE SECURITY DECISION
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Right: Investigation Inspector Panel */}
      <div
        style={{
          width: '320px',
          backgroundColor: '#0a0f19',
          borderLeft: '1px solid #1c2738',
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
            INVESTIGATION DOSSIER
          </h4>
        </div>

        {selectedClue ? (
          <div
            style={{
              backgroundColor: '#121a28',
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
              border: '1px dashed #1e2c40',
              borderRadius: '4px',
              marginBottom: '16px'
            }}
          >
            <HelpCircle size={28} color="#354966" style={{ margin: '0 auto 8px', display: 'block' }} />
            Click any <strong>INSPECT</strong> button on the email elements to analyze security red flags.
          </div>
        )}

        {/* Clues Discovered Checklist */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', letterSpacing: '1px' }}>
            EVIDENCE REGISTER ({discoveredClues.length}/4)
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {PHISHING_CLUES.map((clue) => {
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
                    backgroundColor: found ? '#142032' : '#0d131f',
                    border: `1px solid ${found ? 'var(--cyan-dark)' : '#1a2436'}`,
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
            backgroundColor: 'rgba(5, 8, 14, 0.88)',
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
              maxWidth: '540px',
              padding: '24px',
              background: '#0d1422'
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '15px',
                color: 'var(--cyan-bright)',
                marginBottom: '10px'
              }}
            >
              FINAL SECURITY ACTION
            </h3>
            <p style={{ fontSize: '13px', color: '#abbfd6', lineHeight: '1.5', marginBottom: '20px' }}>
              How will you respond to this email? Remember your training: every decision carries operational consequences.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('REPORT'); }}
                className="cyber-button cyber-button-success"
                style={{ padding: '12px', fontSize: '11px', justifyContent: 'flex-start' }}
              >
                <ShieldCheck size={16} />
                REPORT EMAIL TO SOC (SECURITY OPERATIONS)
              </button>

              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('DELETE'); }}
                className="cyber-button"
                style={{ padding: '12px', fontSize: '11px', justifyContent: 'flex-start' }}
              >
                <Trash2 size={16} />
                DELETE EMAIL IMMEDIATELY
              </button>

              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('REPLY'); }}
                className="cyber-button cyber-button-amber"
                style={{ padding: '12px', fontSize: '11px', justifyContent: 'flex-start' }}
              >
                <Send size={16} />
                REPLY TO SENDER ASKING FOR PROOF
              </button>

              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('OPEN_LINK'); }}
                className="cyber-button cyber-button-danger"
                style={{ padding: '12px', fontSize: '11px', justifyContent: 'flex-start' }}
              >
                <ExternalLink size={16} />
                CLICK LINK TO VERIFY PAYROLL DIRECTLY
              </button>
            </div>

            {pendingDecision && (
              <div style={{
                marginTop: '12px',
                padding: '10px 14px',
                background: 'rgba(245, 170, 40, 0.12)',
                border: '1px solid var(--neon-amber)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}>
                <span style={{ fontSize: '12px', color: 'var(--neon-amber)', fontFamily: 'var(--font-mono)' }}>
                  ⚠ CONFIRM: <strong>{pendingDecision.replace(/_/g, ' ')}</strong> — This action is irreversible.
                </span>
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => { audioSystem.play('computer_click'); setPendingDecision(null); }}
                    className="cyber-button"
                    style={{ padding: '6px 12px', fontSize: '10px', borderColor: 'var(--text-muted)', color: 'var(--text-muted)' }}
                  >
                    CANCEL
                  </button>
                  <button
                    onClick={() => handleChooseDecision(pendingDecision)}
                    className="cyber-button"
                    style={{ padding: '6px 12px', fontSize: '10px', borderColor: 'var(--neon-amber)', color: 'var(--neon-amber)' }}
                  >
                    EXECUTE
                  </button>
                </div>
              </div>
            )}

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowDecisionModal(false); setPendingDecision(null); }}
                className="cyber-button"
                style={{ padding: '6px 14px', fontSize: '10px' }}
              >
                CANCEL & INSPECT MORE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
