// BrowserApp.tsx - Interactive Web Browser investigation for Mission 3 (Scams & Fake Websites)

import React, { useState } from 'react';
import { gameState, SecurityDecision } from '../../game/systems/GameState';
import { WEB_FORENSIC_CLUES, CLONE_WEBSITE_DATA, WebForensicClue } from '../../game/data/gameContent';
import { audioSystem } from '../../game/systems/AudioSystem';
import {
  Globe,
  Lock,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Search,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ExternalLink,
  Code,
  FileWarning,
  HelpCircle,
  X,
  Bookmark
} from 'lucide-react';

interface BrowserAppProps {
  onDecisionMade: (decision: SecurityDecision) => void;
}

export const BrowserApp: React.FC<BrowserAppProps> = ({ onDecisionMade }) => {
  const [currentTab, setCurrentTab] = useState<'fake' | 'official'>('fake');
  const [selectedClue, setSelectedClue] = useState<WebForensicClue | null>(null);
  const [showCertModal, setShowCertModal] = useState(false);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<SecurityDecision | null>(null);

  const state = gameState.getState();
  const discoveredClues = state.discoveredClues;
  const investigationScore = state.investigationScore;

  const handleInspect = (clueId: string) => {
    const clue = WEB_FORENSIC_CLUES.find((c) => c.id === clueId);
    if (!clue) return;

    audioSystem.play('interaction');
    setSelectedClue(clue);
    gameState.addClue(clue.id, clue.scoreBonus);
  };

  const handleChooseDecision = (choice: SecurityDecision) => {
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
        fontFamily: 'var(--font-mono)',
        overflow: 'hidden'
      }}
    >
      {/* Main Browser Viewport */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Browser Top Tabs */}
        <div
          style={{
            height: '34px',
            backgroundColor: '#070b13',
            borderBottom: '1px solid #1c2a3d',
            display: 'flex',
            alignItems: 'center',
            padding: '0 8px',
            gap: '6px'
          }}
        >
          <button
            onClick={() => {
              audioSystem.play('computer_click');
              setCurrentTab('fake');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: currentTab === 'fake' ? '#141d2c' : '#0a101b',
              border: 'none',
              borderTop: currentTab === 'fake' ? '2px solid var(--neon-red)' : '2px solid transparent',
              color: currentTab === 'fake' ? '#fff' : '#7288a3',
              padding: '6px 14px',
              fontSize: '11px',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0'
            }}
          >
            <AlertTriangle size={13} color="var(--neon-red)" />
            <span>NexaTech SSO Gateway [REPORTED]</span>
          </button>

          <button
            onClick={() => {
              audioSystem.play('computer_click');
              setCurrentTab('official');
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: currentTab === 'official' ? '#141d2c' : '#0a101b',
              border: 'none',
              borderTop: currentTab === 'official' ? '2px solid var(--neon-green)' : '2px solid transparent',
              color: currentTab === 'official' ? '#fff' : '#7288a3',
              padding: '6px 14px',
              fontSize: '11px',
              cursor: 'pointer',
              borderRadius: '4px 4px 0 0'
            }}
          >
            <ShieldCheck size={13} color="var(--neon-green)" />
            <span>NexaTech Official Intranet</span>
          </button>
        </div>

        {/* Browser Navigation & Address Bar */}
        <div
          style={{
            height: '42px',
            backgroundColor: '#101726',
            borderBottom: '1px solid #1c2a3d',
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '10px'
          }}
        >
          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button style={{ background: 'none', border: 'none', color: '#5a7391', cursor: 'pointer' }}>
              <ArrowLeft size={16} />
            </button>
            <button style={{ background: 'none', border: 'none', color: '#5a7391', cursor: 'pointer' }}>
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => audioSystem.play('computer_click')}
              style={{ background: 'none', border: 'none', color: '#8fa4be', cursor: 'pointer' }}
            >
              <RotateCw size={14} />
            </button>
          </div>

          {/* URL Bar */}
          <div
            style={{
              flex: 1,
              backgroundColor: '#090e18',
              border: `1px solid ${currentTab === 'fake' ? 'var(--neon-red)' : 'var(--neon-green)'}`,
              borderRadius: '4px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              gap: '8px',
              overflow: 'hidden'
            }}
          >
            {/* Clickable SSL Padlock */}
            <div
              onClick={() => {
                audioSystem.play('menu_select');
                setShowCertModal(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                backgroundColor: currentTab === 'fake' ? '#1c2838' : 'rgba(40, 230, 120, 0.15)',
                padding: '2px 6px',
                borderRadius: '2px'
              }}
              title="Click to inspect SSL/TLS Certificate"
            >
              <Lock size={12} color={currentTab === 'fake' ? 'var(--neon-green)' : 'var(--neon-green)'} />
              <span style={{ fontSize: '10px', color: '#9bc4e2' }}>HTTPS (Secure)</span>
            </div>

            {/* URL String */}
            <span style={{ fontSize: '12px', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentTab === 'fake' ? (
                <>
                  <span style={{ color: '#8fa4be' }}>https://</span>
                  <span style={{ color: 'var(--neon-amber)', fontWeight: 'bold' }}>portal-nexatech-login.com</span>
                  <span style={{ color: '#8fa4be' }}>/sso/auth</span>
                </>
              ) : (
                <>
                  <span style={{ color: '#8fa4be' }}>https://</span>
                  <span style={{ color: 'var(--neon-green)', fontWeight: 'bold' }}>login.nexatech.internal</span>
                  <span style={{ color: '#8fa4be' }}>/dashboard</span>
                </>
              )}
            </span>

            {/* Inspect Domain Button (Fake tab only) */}
            {currentTab === 'fake' && (
              <button
                onClick={() => handleInspect('CLUE-WEB-01')}
                className={`cyber-button ${
                  discoveredClues.includes('CLUE-WEB-01') ? 'cyber-button-success' : 'cyber-button-amber'
                }`}
                style={{ padding: '2px 8px', fontSize: '9px', height: '22px' }}
              >
                <Search size={11} />
                {discoveredClues.includes('CLUE-WEB-01') ? 'DOMAIN AUDITED' : 'INSPECT DOMAIN'}
              </button>
            )}
          </div>

          {/* Quick SSL Audit Button */}
          {currentTab === 'fake' && (
            <button
              onClick={() => handleInspect('CLUE-WEB-02')}
              className={`cyber-button ${
                discoveredClues.includes('CLUE-WEB-02') ? 'cyber-button-success' : 'cyber-button-amber'
              }`}
              style={{ padding: '4px 10px', fontSize: '9px' }}
            >
              <Lock size={12} />
              {discoveredClues.includes('CLUE-WEB-02') ? 'SSL AUDITED' : 'AUDIT SSL CERT'}
            </button>
          )}
        </div>

        {/* Webpage Content Render Container */}
        <div style={{ flex: 1, overflowY: 'auto', backgroundColor: '#070b14', padding: '24px' }}>
          {currentTab === 'fake' ? (
            /* FAKE CLONE PORTAL VIEW */
            <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Deceptive Urgency Lure Banner */}
              <div
                style={{
                  backgroundColor: 'rgba(255, 51, 85, 0.15)',
                  border: '1px solid var(--neon-red)',
                  padding: '12px 16px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileWarning size={20} color="var(--neon-red)" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '11px', color: '#ffb3c0', lineHeight: '1.4' }}>
                    {CLONE_WEBSITE_DATA.bannerUrgency}
                  </span>
                </div>

                <button
                  onClick={() => handleInspect('CLUE-WEB-04')}
                  className={`cyber-button ${
                    discoveredClues.includes('CLUE-WEB-04') ? 'cyber-button-success' : 'cyber-button-amber'
                  }`}
                  style={{ padding: '4px 8px', fontSize: '9px', flexShrink: 0 }}
                >
                  <Search size={11} />
                  {discoveredClues.includes('CLUE-WEB-04') ? 'LURE CHECKED' : 'INSPECT LURE'}
                </button>
              </div>

              {/* Login Portal Replica Box */}
              <div
                style={{
                  backgroundColor: '#0f1726',
                  border: '1px solid #23344d',
                  borderRadius: '6px',
                  padding: '32px',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.6)'
                }}
              >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-pixel)',
                      fontSize: '16px',
                      color: 'var(--cyan-bright)',
                      letterSpacing: '2px',
                      marginBottom: '6px'
                    }}
                  >
                    NEXATECH
                  </div>
                  <div style={{ fontSize: '12px', color: '#8fa4be' }}>
                    Single Sign-On (SSO) Corporate Gateway
                  </div>
                </div>

                {/* Form Inputs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '11px', color: '#8fa4be', display: 'block', marginBottom: '4px' }}>
                      Corporate Email Address
                    </label>
                    <input
                      type="text"
                      readOnly
                      value="sjenkins@nexatech.internal"
                      style={{
                        width: '100%',
                        backgroundColor: '#080d16',
                        border: '1px solid #24354c',
                        padding: '10px 12px',
                        color: '#d0e2f4',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        borderRadius: '3px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', color: '#8fa4be', display: 'block', marginBottom: '4px' }}>
                      Corporate SSO Password
                    </label>
                    <input
                      type="password"
                      readOnly
                      value="••••••••••••"
                      style={{
                        width: '100%',
                        backgroundColor: '#080d16',
                        border: '1px solid #24354c',
                        padding: '10px 12px',
                        color: '#d0e2f4',
                        fontSize: '13px',
                        fontFamily: 'inherit',
                        borderRadius: '3px'
                      }}
                    />
                  </div>

                  <button
                    disabled
                    className="cyber-button"
                    style={{ width: '100%', padding: '10px', fontSize: '11px', marginTop: '6px', opacity: 0.7 }}
                  >
                    SIGN IN TO NEXATECH SSO
                  </button>
                </div>

                {/* Form Action / Source Code Inspection Area */}
                <div
                  style={{
                    backgroundColor: '#090e18',
                    border: '1px dashed #283a52',
                    padding: '12px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <Code size={16} color="var(--neon-amber)" style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>FORM POST DESTINATION:</div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--neon-amber)',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {CLONE_WEBSITE_DATA.formAction}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleInspect('CLUE-WEB-03')}
                    className={`cyber-button ${
                      discoveredClues.includes('CLUE-WEB-03') ? 'cyber-button-success' : 'cyber-button-amber'
                    }`}
                    style={{ padding: '4px 8px', fontSize: '9px', flexShrink: 0 }}
                  >
                    <Search size={11} />
                    {discoveredClues.includes('CLUE-WEB-03') ? 'ACTION ANALYZED' : 'INSPECT FORM ACTION'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* OFFICIAL INTRANET VIEW (For comparison) */
            <div style={{ maxWidth: '620px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div
                style={{
                  backgroundColor: 'rgba(40, 230, 120, 0.1)',
                  border: '1px solid var(--neon-green)',
                  padding: '16px',
                  borderRadius: '4px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--neon-green)', marginBottom: '6px' }}>
                  <ShieldCheck size={18} />
                  <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px' }}>VERIFIED OFFICIAL INTRANET</span>
                </div>
                <div style={{ fontSize: '12px', color: '#c5e2d1', lineHeight: '1.5' }}>
                  This is the genuine internal enterprise portal on verified domain <code>login.nexatech.internal</code>.
                  Protected by DigiTrust Global Organization-Validated (OV) certificate.
                </div>
              </div>

              <div style={{ backgroundColor: '#0f1726', border: '1px solid #1e2c40', padding: '24px', borderRadius: '4px' }}>
                <h4 style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: 'var(--cyan-bright)', marginBottom: '8px' }}>
                  SECURITY NOTICE TO ALL EMPLOYEES:
                </h4>
                <p style={{ fontSize: '12px', color: '#9ab1cb', lineHeight: '1.6' }}>
                  NexaTech Security will NEVER send chat or SMS links requiring urgent password renewal. Always access company tools through your managed bookmark bar or official SSO launchpad.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Web Forensics Dossier */}
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
            WEB FORENSICS DOSSIER
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

            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
              WHAT YOU FOUND:
            </div>
            <div style={{ fontSize: '12px', color: '#fff', marginBottom: '12px', fontWeight: 'bold' }}>
              {selectedClue.finding}
            </div>

            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: '4px' }}>
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
            Click any <strong>INSPECT</strong> button on the URL bar, SSL padlock, lure banner, or form action to gather forensic evidence.
          </div>
        )}

        {/* Evidence Checklist */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
            PORTAL CLUES ({discoveredClues.length}/4) • SCORE: {investigationScore} PTS
          </div>
          {WEB_FORENSIC_CLUES.map((clue) => {
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

        {/* Execute Mitigation Button */}
        <div style={{ marginTop: 'auto' }}>
          <button
            onClick={() => {
              audioSystem.play('menu_select');
              setShowDecisionModal(true);
            }}
            className="cyber-button cyber-button-success"
            style={{ width: '100%', padding: '12px', fontSize: '10px' }}
          >
            <ShieldCheck size={16} />
            EXECUTE ROGUE SITE MITIGATION
          </button>
        </div>
      </div>

      {/* SSL/TLS Certificate Inspector Modal */}
      {showCertModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 14, 0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2000,
            padding: '20px'
          }}
        >
          <div
            className="cyber-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              backgroundColor: '#0a101b'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--neon-green)" />
                <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#fff', margin: 0 }}>
                  SSL/TLS CERTIFICATE VIEWER
                </h3>
              </div>
              <button
                onClick={() => setShowCertModal(false)}
                style={{ background: 'none', border: 'none', color: '#7a8fa8', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', marginBottom: '20px' }}>
              <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '3px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>ISSUED TO (SUBJECT):</span>
                <div style={{ color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>
                  {CLONE_WEBSITE_DATA.sslSubject}
                </div>
              </div>

              <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '3px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>ISSUER (CERTIFICATE AUTHORITY):</span>
                <div style={{ color: 'var(--neon-amber)', fontWeight: 'bold', marginTop: '2px' }}>
                  {CLONE_WEBSITE_DATA.sslIssuer}
                </div>
              </div>

              <div style={{ backgroundColor: '#0f1726', padding: '10px', borderRadius: '3px' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>VALIDITY:</span>
                <div style={{ color: '#fff', marginTop: '2px' }}>
                  {CLONE_WEBSITE_DATA.sslValidUntil}
                </div>
              </div>

              <div style={{ backgroundColor: '#141e2e', padding: '10px', borderRadius: '3px', border: '1px solid #23344d' }}>
                <span style={{ color: 'var(--cyan-bright)', fontSize: '10px' }}>GENUINE NEXATECH CA:</span>
                <div style={{ color: 'var(--neon-green)', marginTop: '2px' }}>
                  {CLONE_WEBSITE_DATA.officialSslIssuer}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  handleInspect('CLUE-WEB-02');
                  setShowCertModal(false);
                }}
                className="cyber-button cyber-button-success"
                style={{ padding: '8px 16px', fontSize: '10px' }}
              >
                LOG SSL DISCREPANCY & CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incident Mitigation Decision Modal */}
      {showDecisionModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(4, 7, 12, 0.92)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2200,
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
                fontSize: '13px',
                color: 'var(--cyan-bright)',
                marginBottom: '8px'
              }}
            >
              INCIDENT RESPONSE: ROGUE PORTAL
            </h3>
            <p style={{ fontSize: '12px', color: '#abbfd6', lineHeight: '1.5', marginBottom: '18px' }}>
              Choose your mitigation strategy to protect staff from credential harvesting on <code>portal-nexatech-login.com</code>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('SINKHOLE_AND_ADVISE'); }}
                className="cyber-button cyber-button-success"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <ShieldCheck size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>DNS SINKHOLE + PERIMETER FIREWALL BLOCK + BROADCAST ALL-HANDS ADVISORY</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Reroute internal DNS queries to training page, drop outbound traffic, and warn staff</span>
                </span>
              </button>

              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('WARN_USERS_ONLY'); }}
                className="cyber-button"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <Globe size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>SEND AN ALL-EMPLOYEE WARNING EMAIL ONLY (NO DNS/FIREWALL BLOCKING)</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Warns employees but leaves the malicious URL resolving and accessible</span>
                </span>
              </button>

              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('FLOOD_CREDENTIALS'); }}
                className="cyber-button cyber-button-amber"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <Code size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>SUBMIT FAKE BOGUS CREDENTIALS TO FLOOD ATTACKER HARVEST DATABASE</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Spams bogus credentials; ineffective countermeasure that alerts attacker</span>
                </span>
              </button>

              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('TRUST_HTTPS_PADLOCK'); }}
                className="cyber-button cyber-button-danger"
                style={{ padding: '12px', fontSize: '10px', justifyContent: 'flex-start', textAlign: 'left' }}
              >
                <Lock size={18} style={{ flexShrink: 0 }} />
                <span>
                  <strong>ASSUME HTTPS PADLOCK MEANS SITE IS SAFE & DISMISS INCIDENT</strong>
                  <br />
                  <span style={{ fontSize: '9px', opacity: 0.85 }}>Treat portal as legitimate because it has a valid SSL certificate</span>
                </span>
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

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
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
