// InteractionPrompt.tsx - On-screen HUD prompt when in range of interactable objects

import React, { useState, useEffect } from 'react';
import { eventBridge, GameEvents, InteractionPromptPayload } from '../../game/systems/EventBridge';

export const InteractionPrompt: React.FC = () => {
  const [prompt, setPrompt] = useState<InteractionPromptPayload>({ visible: false });

  useEffect(() => {
    const handleShow = (payload: InteractionPromptPayload) => setPrompt(payload);
    const handleHide = () => setPrompt({ visible: false });

    const unsub1 = eventBridge.on(GameEvents.SHOW_INTERACTION, handleShow);
    const unsub2 = eventBridge.on(GameEvents.HIDE_INTERACTION, handleHide);

    return () => {
      unsub1();
      unsub2();
    };
  }, []);

  if (!prompt.visible || !prompt.text) return null;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 30,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 600,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        background: 'rgba(10, 16, 26, 0.92)',
        border: '1px solid var(--cyan-bright)',
        padding: '8px 16px',
        boxShadow: '0 0 14px rgba(0, 210, 230, 0.4)'
      }}
    >
      <span
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '11px',
          color: '#0a0e16',
          backgroundColor: 'var(--cyan-bright)',
          padding: '3px 6px',
          borderRadius: '2px',
          fontWeight: 'bold'
        }}
      >
        {prompt.actionKey || 'E'}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-pixel)',
          fontSize: '10px',
          color: '#ffffff',
          letterSpacing: '1px'
        }}
      >
        {prompt.text}
      </span>
    </div>
  );
};
