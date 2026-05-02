/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import useSoundManager from "../../hooks/core/useSoundManager";
import { PLAYER1, PLAYER2 } from "../../helperFunction/helperFunction";

// New UI Components
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

// Original Fun Mode Logic & Components
import { useMonkeyMode } from "../../hooks/funMode/useMonkeyMode";
import { useChaosChicken } from "../../hooks/funMode/useChaosChicken";
import { MonkeyModeContainer } from "../../components/designSystem/Features/monkeyMayhem/MonkeyMode";
import MonkeyAnimation from "../../components/designSystem/Features/monkeyMayhem/MonkeyAnimation";
import ChickenAnimation from "../../components/designSystem/Features/chaosChicken/ChickenAnimation";
import ChickenIndicators from "../../components/designSystem/Features/chaosChicken/ChickenIndicators";
import PoopBlockIndicator from "../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import RemovalOverlay from "../../components/designSystem/Features/core/RemovalOverlay";
import useFunModeSettings from "../../hooks/funMode/useFunModeSettings";
import { useFunModeEffects } from "../../hooks/funMode/useFunModeEffects";
import { getPlayerNames, createMonkeyButtonHandler, canInteractWithBoard } from "../../helperFunction/funMode/monkeyModeFeatures";
import Board from "../../components/organisms/boardStyles";
import BackButton from "../../components/designSystem/BackButton";
import GiveUpButton from "../../components/designSystem/GiveUpButton";

const FunModeV2 = () => {
  const navigate = useNavigate();
  const [removalOverlay, setRemovalOverlay] = useState(null);
  const { monkeyModeEnabled, chaosChickenEnabled } = useFunModeSettings();
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'fun', 'sound' or null

  const {
    chaosChickenState,
    blockedColumns,
    isChickenAnimating,
    chickenVoiceLine,
    isRoosterMode,
    targetColumn,
    checkChaosChickenTrigger,
    triggerChaosChicken,
    updateTurnBasedBlocks,
    handleBlockedColumnDrop,
    isColumnBlocked,
    reset: resetChaosChicken,
  } = useChaosChicken({ 
    chaosChickenEnabled, 
    onOverlayShow: setRemovalOverlay 
  });

  const {
    gameState,
    makeMove,
    reset,
    showMonkeyButton,
    monkeyButtonPlayer,
    triggerMonkeyMayhem,
    isUpsideDown,
    upsideDownTurnsLeft,
    isMonkeyAnimating,
    monkeyVoiceLine,
    monkeyMayhemState,
    isGravityFalling,
    updateBoard,
  } = useMonkeyMode({ 
    monkeyModeEnabled,
    soundManager,
    onOverlayShow: setRemovalOverlay,
    useRotation: true,
    onPiecePlaced: (newBoard, row, col, player, extensionData) => {
      if (chaosChickenEnabled && checkChaosChickenTrigger(newBoard, row, col, player)) {
        triggerChaosChicken(newBoard, player, soundManager, (updatedBoard) => {
          updateBoard(updatedBoard);
        }, extensionData?.isUpsideDown || false);
      }
    }
  });

  const { board, currentPlayer, winner, isDraw, isMonkeyWinner } = gameState;

  const { monkeyButtonTimer } = useFunModeEffects({
    showMonkeyButton,
    winner,
    isDraw,
    isMonkeyWinner,
    isMonkeyAnimating,
    monkeyVoiceLine,
    soundManager
  });

  const playerNames = useMemo(() => getPlayerNames(monkeyMayhemState), [monkeyMayhemState]);
  const handleMonkeyButtonClick = useMemo(() => createMonkeyButtonHandler(soundManager, triggerMonkeyMayhem), [soundManager, triggerMonkeyMayhem]);
  const canInteract = useMemo(() => canInteractWithBoard(isMonkeyAnimating, showMonkeyButton, isGravityFalling), [isMonkeyAnimating, showMonkeyButton, isGravityFalling]);

  const enhancedMakeMove = (col) => {
    if (chaosChickenEnabled) {
      // Logic uses normal gravity because the board rotation handles visual anti-gravity
      const redirectedCol = handleBlockedColumnDrop(board, col, currentPlayer, false);
      if (redirectedCol === -1) return false;
      col = redirectedCol;
    }

    const success = makeMove(col);
    if (!success) return false;

    if (chaosChickenEnabled && !winner && !isDraw) {
      updateTurnBasedBlocks();
    }
    return true;
  };

  const enhancedReset = () => {
    soundManager?.playSound('coinsfalling');
    reset();
    if (chaosChickenEnabled) {
      resetChaosChicken();
    }
  };

  // Scoreboard Data
  const p1Data = useMemo(() => ({
    name: playerNames[PLAYER1] || "Player 1",
    score: gameState.scores?.[PLAYER1] || 0,
    active: currentPlayer === PLAYER1 && !winner && !isDraw,
    emoji: PLAYER1
  }), [gameState.scores, currentPlayer, winner, isDraw, playerNames]);

  const p2Data = useMemo(() => ({
    name: playerNames[PLAYER2] || "Player 2",
    score: gameState.scores?.[PLAYER2] || 0,
    active: currentPlayer === PLAYER2 && !winner && !isDraw,
    emoji: PLAYER2
  }), [gameState.scores, currentPlayer, winner, isDraw, playerNames]);

  return (
    <PageWrapper>
      <GiveUpButton onGiveUp={() => navigate("/play-offline")} soundManager={soundManager} />
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

          <MonkeyModeContainer
            monkeyModeEnabled={monkeyModeEnabled}
            showMonkeyButton={showMonkeyButton}
            monkeyButtonTimer={monkeyButtonTimer}
            handleMonkeyButtonClick={handleMonkeyButtonClick}
            isGravityFalling={isGravityFalling}
            isUpsideDown={isUpsideDown}
            upsideDownTurnsLeft={upsideDownTurnsLeft}
          />

          <MonkeyAnimation
            isAnimating={isMonkeyAnimating}
            voiceLine={monkeyVoiceLine}
            isFlippingBack={monkeyVoiceLine.includes("normal")}
          />

          {chaosChickenEnabled && (
            <>
              <ChickenIndicators chaosChickenState={chaosChickenState} currentPlayer={currentPlayer} />
              <ChickenAnimation
                isAnimating={isChickenAnimating}
                voiceLine={chickenVoiceLine}
                isRooster={isRoosterMode}
                targetColumn={targetColumn}
              />
            </>
          )}

          <FunModeBoardWrapper isUpsideDown={isUpsideDown}>
            <Board
              board={board}
              currentPlayer={currentPlayer}
              winner={winner}
              isDraw={isDraw}
              onDrop={enhancedMakeMove}
              canInteract={canInteract && !isChickenAnimating}
              soundManager={soundManager}
              isUpsideDown={false}
              blockedColumns={chaosChickenEnabled ? blockedColumns : []}
              onBlockedColumnAttempt={chaosChickenEnabled ? handleBlockedColumnDrop : undefined}
              winningLine={gameState.winningLine}
              PoopBlockIndicatorComponent={PoopBlockIndicator}
            />
          </FunModeBoardWrapper>

          <GameStatus 
            message={
              winner 
                ? `${playerNames[winner]} Wins!` 
                : isDraw 
                ? "It's a Draw!" 
                : isUpsideDown 
                ? `Gravity Inverted! (${upsideDownTurnsLeft} turns)` 
                : `${playerNames[currentPlayer]}'s Turn`
            }
            currentPlayerColor={currentPlayer === PLAYER1 ? "red" : "yellow"}
          />

          <ControlGroup>
            <Button variant="secondary" fullWidth onClick={enhancedReset} soundManager={soundManager}>
          Reset
            </Button>
          </ControlGroup>

          <InstructionCard>
            {monkeyModeEnabled && (
              <InstructionSection>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>🐒 MONKEY MAYHEM</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Form 2 separate 3-in-a-row to unleash chaos. Flip the board, shuffle gravity, and scramble the game!
                </div>
              </InstructionSection>
            )}
            {chaosChickenEnabled && (
              <InstructionSection>
                <div style={{ fontWeight: 800, color: '#fff', fontSize: '14px' }}>🐔 CHAOS CHICKEN</div>
                <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                  Form a 2x2 square. 1st time blocks a column with poop. 2nd time triggers the 
                  <span style={{ color: '#ef4444' }}> Rooster of Rage</span> to clear an entire row!
                </div>
              </InstructionSection>
            )}
          </InstructionCard>
        </GameLayout>
      </MainContent>

      {(winner || isDraw) && (
        <MatchResultOverlay 
          title={winner ? "VICTORY" : "DRAW"}
          subtitle={winner ? `${playerNames[winner]} has conquered the chaos!` : "Even mayhem ends in a stalemate."}
          variant={winner ? "win" : "draw"}
          onPrimaryAction={enhancedReset}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/home")}
          soundManager={soundManager}
          isNaturalEnding={true}
        />
      )}
    </PageWrapper>
  );
};

export default FunModeV2;