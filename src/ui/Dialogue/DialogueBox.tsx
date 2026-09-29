// DialogueBox.tsx - Retro RPG dialogue overlay with character portraits and typewriter progression

import React, { useState, useEffect } from 'react';
import { eventBridge, GameEvents, DialoguePayload } from '../../game/systems/EventBridge';
import { audioSystem } from '../../game/systems/AudioSystem';
import { MessageSquare, ChevronRight } from 'lucide-react';

export const DialogueBox: React.FC = () => {
  const [dialogue, setDialogue] = useState<DialoguePayload | null>(null);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);

  useEffect(() => {
    const handleStart = (payload: DialoguePayload) => {
      setDialogue(payload);
      setCurrentLineIndex(0);
      eventBridge.emit(GameEvents.SET_PLAYER_CONTROLS_ENABLED, false);
    };

    const unsub = eventBridge.on(GameEvents.START_DIALOGUE, handleStart);
    return unsub;
  }, []);

  useEffect(() => {
    if (!dialogue) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
        e.preventDefault();
        advance();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dialogue, currentLineIndex]);

  if (!dialogue) return null;

  const currentLine = dialogue.lines[currentLineIndex];
  const isLastLine = currentLineIndex >= dialogue.lines.length - 1;

  const advance = () => {
    if (!isLastLine) {
      audioSystem.play('dialogue');
      setCurrentLineIndex((prev) => prev + 1);
    } else {
      audioSystem.play('interaction');
      const callback = dialogue.onComplete;
      setDialogue(null);
      eventBridge.emit(GameEvents.SET_PLAYER_CONTROLS_ENABLED, true);
      eventBridge.emit(GameEvents.END_DIALOGUE);
      if (callback) callback();
    }
  };

  return (
    <div
      onClick={advance}
      style={{
        position: 'absolute',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '90%',
        maxWidth: '840px',
        zIndex: 1500,
        cursor: 'pointer'
      }}
    >
      <div
        className="cyber-panel"
        style={{
          padding: '18px 24px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          background: 'rgba(10, 16, 26, 0.95)',
          border: '2px solid var(--cyan-dark)'
        }}
      >
        {/* Character Portrait */}
        <div
          style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#162235',
            border: '2px solid var(--cyan-bright)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            overflow: 'hidden'
          }}
        >
          {dialogue.speaker.avatar ? (
            <img
              src={dialogue.speaker.avatar}
              alt={dialogue.speaker.name}
              style={{
                width: '64px',
                height: '64px',
                objectFit: 'contain',
                imageRendering: 'pixelated'
              }}
            />
          ) : (
            <MessageSquare size={28} color="var(--cyan-bright)" />
          )}
        </div>

        {/* Text Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <span
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '12px',
                color: 'var(--cyan-bright)',
                letterSpacing: '1px'
              }}
            >
              {dialogue.speaker.name}
            </span>
            <span
              style={{
                fontSize: '11px',
                color: 'var(--text-muted)'
              }}
            >
              // {dialogue.speaker.title}
            </span>
          </div>

          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '15px',
              lineHeight: '1.5',
              color: '#ffffff',
              minHeight: '44px'
            }}
          >
            {currentLine}
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: '4px',
              marginTop: '4px'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '8px',
                color: 'var(--cyan-bright)'
              }}
              className="animate-blink"
            >
              {isLastLine ? '[E] CLOSE' : '[SPACE] NEXT'}
            </span>
            <ChevronRight size={14} color="var(--cyan-bright)" className="animate-blink" />
          </div>
        </div>
      </div>
    </div>
  );
};
