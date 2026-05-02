/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import useSoundManager from "../../hooks/core/useSoundManager";

// --- UI COMPONENTS ---
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import Scoreboard from "../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../components/designSystem/Status";
import { 
  GameLayout, 
  FeatureRow, 
  FeatureBadge, 
  InstructionCard, 
  InstructionSection,
  FunModeBoardWrapper,
  ControlGroup
} from "./index.style";

// --- MODULAR FEATURE ENGINE (Phase 3) ---
import { useFunMode } from "../../hooks/funMode/useFunMode";
import FeatureDispatcher from "../../components/funMode/FeatureDispatcher";

// --- CHARACTER VISUALS ---
// MonkeyAnimation and ChickenAnimation are now handled by the Universal FeatureDispatcher!
import ChickenIndicators from "../../components/designSystem/Features/chaosChicken/ChickenIndicators";
import RemovalOverlay from "../../components/designSystem/Features/core/RemovalOverlay";
import useFunModeSettings from "../../hooks/funMode/useFunModeSettings";
import Board from "../../components/organisms/boardStyles";
import GiveUpButton from "../../components/designSystem/GiveUpButton";

/**
 * PAGE: FunModeV2 (PHASE 3: TOTAL MODULARITY)
 * Refactored to use the Universal Feature Engine.
 * Actors, Projectiles, and Actions are now completely data-driven.
 */
const FunModeV2 = () => {
  const navigate = useNavigate();
  const soundManager = useSoundManager();
  
  const [removalOverlay, setRemovalOverlay] = useState(null);
  const [surrendered, setSurrendered] = useState(null);
  
  // Settings
  const { monkeyModeEnabled, chaosChickenEnabled } = useFunModeSettings();

  /**
   * THE UNIFIED HOOK
   */
  const {
    gameState,
    isAnimating,
    gravity,
    blockedColumns,
    turnsLeft,
    makeMove,
    reset,
    setGameState,
    setGravity,
    setBlockedColumns,
    setTurnsLeft,
    startAnimation
  } = useFunMode({ 
    enableExtensions: true 
  });

  const { board, currentPlayer, winner, isDraw } = gameState;

  useEffect(() => {
    soundManager.pauseBackgroundMusic();
    return () => soundManager.resumeBackgroundMusic();
  }, [soundManager]);

  const handleReset = () => {
    soundManager?.playSound('coinsfalling');
    setSurrendered(null);
    reset();
  };

  const handleSurrender = () => {
    soundManager.playLoseSound({ isFunMode: true });
    setSurrendered(currentPlayer);
  };

  const p1Data = useMemo(() => ({
    name: "Player 1",
    score: gameState.scores?.["🔴"] || 0,
    active: currentPlayer === "🔴" && !winner && !isDraw,
    emoji: "🔴"
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  const p2Data = useMemo(() => ({
    name: "Player 2",
    score: gameState.scores?.["🟡"] || 0,
    active: currentPlayer === "🟡" && !winner && !isDraw,
    emoji: "🟡"
  }), [gameState.scores, currentPlayer, winner, isDraw]);

  return (
    <PageWrapper>
      {/* THE UNIVERSAL ENGINE & ANIMATOR */}
      <FeatureDispatcher 
        gameState={gameState}
        setGameState={setGameState}
        gravity={gravity}
        setGravity={setGravity}
        turnsLeft={turnsLeft}
        setTurnsLeft={setTurnsLeft}
        blockedColumns={blockedColumns}
        setBlockedColumns={setBlockedColumns}
        soundManager={soundManager}
        startAnimation={startAnimation}
        isAnimating={isAnimating}
        // No character-specific voice setters needed anymore, Dispatcher handles its own visuals!
      />

      <GiveUpButton onGiveUp={handleSurrender} soundManager={soundManager} />
      
      <Header>
        <HeaderContent>
          <AppLogo onClick={() => {
            soundManager?.playClickSound();
            navigate("/home");
          }}>
            Connect 4 <span style={{ opacity: 0.5, fontSize: '14px', fontWeight: 400 }}>Fun Mode</span>
          </AppLogo>
        </HeaderContent>
      </Header>

      <MainContent>
        <GameLayout>
          <FeatureRow>
            <FeatureBadge enabled={monkeyModeEnabled}>
              Monkey {monkeyModeEnabled ? "Active" : "Off"}
            </FeatureBadge>
            <FeatureBadge enabled={chaosChickenEnabled}>
              Chicken {chaosChickenEnabled ? "Active" : "Off"}
            </FeatureBadge>
          </FeatureRow>

          <Scoreboard p1={p1Data} p2={p2Data} />

          <RemovalOverlay 
            data={removalOverlay} 
            onComplete={() => setRemovalOverlay(null)} 
          />

          <FunModeBoardWrapper isUpsideDown={gravity === "inverted"}>
            <Board
              board={board}
              currentPlayer={currentPlayer}
              winner={winner}
              isDraw={isDraw}
              onDrop={makeMove}
              canInteract={!isAnimating}
              soundManager={soundManager}
              isUpsideDown={gravity === "inverted"}
              gravity={gravity}
              blockedColumns={blockedColumns}
              winningLine={gameState.winningLine}
              useRotation={true}
            />
          </FunModeBoardWrapper>

          <GameStatus 
            message={
              winner 
                ? `Winner: ${winner}` 
                : isDraw 
                ? "It's a Draw!" 
                : (gravity === "inverted" && turnsLeft.gravity > 0)
                ? `Gravity Inverted! (${turnsLeft.gravity} turns)` 
                : `${currentPlayer}'s Turn`
            }
            currentPlayerColor={currentPlayer === "🔴" ? "red" : "yellow"}
          />

          <ControlGroup>
            <Button variant="secondary" fullWidth onClick={handleReset} soundManager={soundManager}>
              Reset
            </Button>
          </ControlGroup>

          <InstructionCard>
            {monkeyModeEnabled && (
              <InstructionSection>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>🐒 MONKEY MAYHEM</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Form a 3-in-a-row to trigger gravity chaos and disc theft!
                </div>
              </InstructionSection>
            )}
            {chaosChickenEnabled && (
              <InstructionSection>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>🐔 CHAOS CHICKEN</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Form a 2x2 square to poop on a column and block it for 3 turns!
                </div>
              </InstructionSection>
            )}
          </InstructionCard>
        </GameLayout>
      </MainContent>

      {(winner || isDraw || surrendered) && (
        <MatchResultOverlay 
          title={surrendered ? "SURRENDER" : winner ? "VICTORY" : "DRAW"}
          subtitle={
            surrendered ? "Someone conceded. Chaos wins!" :
            winner ? `${winner} has conquered the chaos!` : 
            "Even mayhem ends in a stalemate."
          }
          variant={isDraw ? "draw" : "win"}
          icon={surrendered ? "🏳️" : winner ? "🏆" : "🤝"}
          onPrimaryAction={handleReset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/home")}
          soundManager={soundManager}
          isNaturalEnding={!surrendered}
        />
      )}
    </PageWrapper>
  );
};

export default FunModeV2;