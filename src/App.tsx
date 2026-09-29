// App.tsx - Root component combining Phaser 3 canvas with React overlays

import React, { useEffect, useRef, useState } from 'react';
import Phaser from 'phaser';
import { createGameConfig } from './game/config/phaserConfig';
import { gameState, GameSaveData, SecurityDecision } from './game/systems/GameState';
import { eventBridge, GameEvents } from './game/systems/EventBridge';
import { audioSystem } from './game/systems/AudioSystem';

import { MainMenu } from './ui/MainMenu/MainMenu';
import { IntroCutscene } from './ui/Intro/IntroCutscene';
import { HUD } from './ui/HUD/HUD';
import { DialogueBox } from './ui/Dialogue/DialogueBox';
import { InteractionPrompt } from './ui/Interaction/InteractionPrompt';
import { ComputerDesktop } from './ui/Computer/ComputerDesktop';
import { ConsequencesModal } from './ui/MissionResults/ConsequencesModal';
import { MissionResultsModal } from './ui/MissionResults/MissionResultsModal';
import { SettingsModal } from './ui/Settings/SettingsModal';
import { CaseFilesModal } from './ui/CaseFile/CaseFilesModal';
import { TutorialOverlay } from './ui/Tutorial/TutorialOverlay';

export const App: React.FC = () => {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<GameSaveData>(gameState.getState());
  const [showMainMenu, setShowMainMenu] = useState(true);
  const [showIntro, setShowIntro] = useState(false);
  const [showComputer, setShowComputer] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showCaseFiles, setShowCaseFiles] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  // Decision & Results flow
  const [activeDecision, setActiveDecision] = useState<SecurityDecision | null>(null);
  const [decisionOutcome, setDecisionOutcome] = useState<{
    awarenessDelta: number;
    riskDelta: number;
    xpDelta: number;
    feedbackTitle: string;
    feedbackDescription: string;
  } | null>(null);
  const [showResults, setShowResults] = useState(false);

  // 1. Initialize Phaser on mount
  useEffect(() => {
    if (!gameRef.current && containerRef.current) {
      const config = createGameConfig(containerRef.current);
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  // 2. Subscribe to GameState changes
  useEffect(() => {
    return gameState.subscribe((s) => {
      setState(s);
    });
  }, []);

  // 3. Listen to EventBridge
  useEffect(() => {
    const unsubOpenComputer = eventBridge.on(GameEvents.OPEN_COMPUTER, () => {
      setShowComputer(true);
      eventBridge.emit(GameEvents.SET_PLAYER_CONTROLS_ENABLED, false);
    });

    const unsubCloseComputer = eventBridge.on(GameEvents.CLOSE_COMPUTER, () => {
      setShowComputer(false);
      eventBridge.emit(GameEvents.SET_PLAYER_CONTROLS_ENABLED, true);
    });

    return () => {
      unsubOpenComputer();
      unsubCloseComputer();
    };
  }, []);

  // Handle New Game
  const handleStartNewGame = () => {
    gameState.resetGame();
    setShowMainMenu(false);
    setShowIntro(true);
  };

  // Handle Continue Game
  const handleContinueGame = () => {
    const loaded = gameState.continueGame();
    setShowMainMenu(false);
    audioSystem.playAmbient();

    if (gameRef.current) {
      const sceneManager = gameRef.current.scene;
      const targetScene = loaded.currentScene === 'Office' ? 'OfficeScene' : 'ExteriorScene';
      sceneManager.stop('ExteriorScene');
      sceneManager.stop('OfficeScene');
      sceneManager.start(targetScene);
    }
  };

  // Finish Intro Cutscene
  const handleIntroComplete = () => {
    setShowIntro(false);
    gameState.updateState({ currentScene: 'Exterior' });

    if (gameRef.current) {
      const sceneManager = gameRef.current.scene;
      sceneManager.stop('OfficeScene');
      sceneManager.start('ExteriorScene');
    }

    audioSystem.playAmbient();

    // Show tutorial on first play
    if (!gameState.getState().tutorialSeen) {
      setShowTutorial(true);
    }
  };

  // Computer Closed
  const handleCloseComputer = () => {
    setShowComputer(false);
    eventBridge.emit(GameEvents.SET_PLAYER_CONTROLS_ENABLED, true);
  };

  // Decision Submitted in EmailApp
  const handleDecisionMade = (decision: SecurityDecision) => {
    const result = gameState.applyDecision(decision);
    setActiveDecision(decision);
    setDecisionOutcome(result);

    const goodDecisions = ['REPORT', 'ENFORCE_MFA_LOCKOUT', 'SINKHOLE_AND_ADVISE'];
    const badDecisions = ['OPEN_LINK', 'REPLY', 'IGNORE_INCIDENT', 'TRUST_HTTPS_PADLOCK'];
    if (goodDecisions.includes(decision)) {
      audioSystem.play('success');
    } else if (badDecisions.includes(decision)) {
      audioSystem.play('error');
    } else {
      audioSystem.play('warning');
    }
  };

  // Close Consequence Modal and show Full Mission Results
  const handleConsequenceContinue = () => {
    setDecisionOutcome(null);
    setShowResults(true);
    audioSystem.play('notification');
  };

  // Return to Office from Mission Complete
  const handleReturnToOffice = () => {
    setShowResults(false);
    setShowComputer(false);
    setActiveDecision(null);
    eventBridge.emit(GameEvents.SET_PLAYER_CONTROLS_ENABLED, true);
    gameState.save();
    audioSystem.play('interaction');
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        backgroundColor: '#05080e',
        overflow: 'hidden'
      }}
      className={state.settings.crtEffect ? 'crt-overlay' : ''}
    >
      {/* Phaser Canvas Container */}
      <div
        id="phaser-game-container"
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: showMainMenu || showIntro ? 0 : 1,
          transition: 'opacity 0.4s ease'
        }}
      />

      {/* React HUD Layer */}
      {!showMainMenu && !showIntro && !showComputer && (
        <>
          <HUD
            onOpenSettings={() => setShowSettings(true)}
            onOpenCaseFiles={() => setShowCaseFiles(true)}
          />
          <InteractionPrompt />
          <DialogueBox />
        </>
      )}

      {/* Main Menu Screen */}
      {showMainMenu && (
        <MainMenu
          onStartNewGame={handleStartNewGame}
          onContinueGame={handleContinueGame}
          onOpenSettings={() => setShowSettings(true)}
        />
      )}

      {/* Intro Cutscene */}
      {showIntro && <IntroCutscene onComplete={handleIntroComplete} />}

      {/* Tutorial Overlay — first-launch only */}
      {showTutorial && (
        <TutorialOverlay onDismiss={() => setShowTutorial(false)} />
      )}

      {/* In-Game OS Computer Desktop */}
      {showComputer && (
        <ComputerDesktop
          onClose={handleCloseComputer}
          onDecisionMade={handleDecisionMade}
        />
      )}

      {/* Immediate Decision Feedback Modal */}
      {decisionOutcome && activeDecision && (
        <ConsequencesModal
          decision={activeDecision}
          result={decisionOutcome}
          onContinue={handleConsequenceContinue}
        />
      )}

      {/* Full Mission 001 Results / Case File Screen */}
      {showResults && (
        <MissionResultsModal onReturnToOffice={handleReturnToOffice} />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          onResetGame={() => {
            setShowMainMenu(true);
            setShowComputer(false);
            setShowResults(false);
          }}
        />
      )}

      {/* Case Files Dossier Modal */}
      {showCaseFiles && (
        <CaseFilesModal onClose={() => setShowCaseFiles(false)} />
      )}
    </div>
  );
};
