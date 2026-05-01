/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomButton from "../../components/organisms/buttonComponent";
import Status from "../../components/organisms/status";
import Board from "../../components/organisms/boardStyles";
import useSoundManager from "../../hooks/core/useSoundManager";
import { useMonkeyMode } from "../../hooks/funMode/useMonkeyMode";
import { useChaosChicken } from "../../hooks/funMode/useChaosChicken";
import useFunModeSettings from "../../hooks/funMode/useFunModeSettings";
import { MonkeyModeContainer } from "../../components/features/MayhemMonkey/MonkeyModeComponent";
import ChickenAnimation from "../../components/features/ChaosChicken/ChickenAnimation";
import ChickenIndicators from "../../components/features/ChaosChicken/ChickenIndicators";
import { useFunModeEffects } from "../../hooks/funMode/useFunModeEffects";
import { getPlayerNames,createMonkeyButtonHandler,canInteractWithBoard } from "../../helperFunction/funMode/monkeyModeFeatures";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
  FunModeBoard,
} from "./index.style";

const FunMode = () => {
  const navigate = useNavigate();
  const { monkeyModeEnabled, chaosChickenEnabled } = useFunModeSettings();
  const {
    gameState,
    makeMove,
    reset,
    showMonkeyButton,
    monkeyButtonPlayer,
    triggerMonkeyMayhem, // CHANGE: This is now triggerMonkeyMode internally but kept for compatibility
    isUpsideDown,
    upsideDownTurnsLeft,
    isMonkeyAnimating,
    monkeyVoiceLine,
    monkeyMayhemState, // CHANGE: This is now monkeyState internally but kept for compatibility
    isGravityFalling,
  } = useMonkeyMode({ monkeyModeEnabled });

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
  } = useChaosChicken({ chaosChickenEnabled });

  const { board, currentPlayer, winner, isDraw, isMonkeyWinner } = gameState;
  const soundManager = useSoundManager();

  // CHANGE: Moved all effects to custom hook
  const { monkeyButtonTimer } = useFunModeEffects({
    showMonkeyButton,
    winner,
    isDraw,
    isMonkeyWinner,
    isMonkeyAnimating,
    monkeyVoiceLine,
    soundManager
  });

  // CHANGE: Memoized computed values to avoid recalculation
  const playerNames = useMemo(() => getPlayerNames(monkeyMayhemState), [monkeyMayhemState]);
  const handleMonkeyButtonClick = useMemo(() => createMonkeyButtonHandler(soundManager, triggerMonkeyMayhem), [soundManager, triggerMonkeyMayhem]);
  const canInteract = useMemo(() => canInteractWithBoard(isMonkeyAnimating, showMonkeyButton, isGravityFalling), [isMonkeyAnimating, showMonkeyButton, isGravityFalling]);

  // Enhanced makeMove with Chaos Chicken integration
  const enhancedMakeMove = (col) => {
    // Handle blocked column redirection if Chaos Chicken is enabled
    if (chaosChickenEnabled) {
      const redirectedCol = handleBlockedColumnDrop(board, col, currentPlayer, isUpsideDown);
      if (redirectedCol === -1) return false; // No available columns
      col = redirectedCol;
    }

    const success = makeMove(col);
    if (!success) return false;

    // Check for Chaos Chicken trigger after successful move
    if (chaosChickenEnabled && !winner && !isDraw) {
      // Find the row where the piece was placed
      let placedRow = -1;
      if (isUpsideDown) {
        for (let row = 0; row < board.length; row++) {
          if (board[row][col] !== "⚪") {
            placedRow = row;
            break;
          }
        }
      } else {
        for (let row = board.length - 1; row >= 0; row--) {
          if (board[row][col] !== "⚪") {
            placedRow = row;
            break;
          }
        }
      }

      if (placedRow !== -1 && checkChaosChickenTrigger(board, placedRow, col, currentPlayer)) {
        triggerChaosChicken(board, currentPlayer, soundManager, (newBoard) => {
          // Update board after Rooster of Rage
          // This would need to be integrated with the monkey mode state management
        });
      }

      // Update turn-based blocks
      updateTurnBasedBlocks();
    }

    return true;
  };

  // Enhanced reset function
  const enhancedReset = () => {
    reset();
    if (chaosChickenEnabled) {
      resetChaosChicken();
    }
  };

  return (
    <PageContainer>
      <HeaderContainer>Connect 4 - Fun Mode</HeaderContainer>
    
      {/* Feature status */}
      <BodyContainer style={{ fontSize: "14px" }}>
        Features:{" "}
        <span style={{ color: monkeyModeEnabled ? "#4caf50" : "#ff6b6b", fontWeight: 700 }}>
          Monkey Mode: {monkeyModeEnabled ? "On" : "Off"}
        </span>
        {" | "}
        <span style={{ color: chaosChickenEnabled ? "#4caf50" : "#ff6b6b", fontWeight: 700 }}>
          Chaos Chicken: {chaosChickenEnabled ? "On" : "Off"}
        </span>
      </BodyContainer>

      {/* Chaos Chicken Indicators - Show when enabled */}
      {chaosChickenEnabled && (
        <ChickenIndicators 
          chaosChickenState={chaosChickenState}
          currentPlayer={currentPlayer}
        />
      )}

      {/* Monkey Mode Components - Conditionally rendered based on settings */}
      <MonkeyModeContainer
        monkeyModeEnabled={monkeyModeEnabled}
        showMonkeyButton={showMonkeyButton}
        monkeyButtonPlayer={monkeyButtonPlayer}
        currentPlayer={currentPlayer}
        monkeyButtonTimer={monkeyButtonTimer}
        handleMonkeyButtonClick={handleMonkeyButtonClick}
        isMonkeyAnimating={isMonkeyAnimating}
        monkeyVoiceLine={monkeyVoiceLine}
        isGravityFalling={isGravityFalling}
        isUpsideDown={isUpsideDown}
        upsideDownTurnsLeft={upsideDownTurnsLeft}
      />

      {/* Chaos Chicken Animation - Show when enabled and animating */}
      {chaosChickenEnabled && (
        <ChickenAnimation
          isAnimating={isChickenAnimating}
          voiceLine={chickenVoiceLine}
          isRooster={isRoosterMode}
          targetColumn={targetColumn}
          onAnimationComplete={() => {
            // Animation completion is handled by the hook
          }}
        />
      )}

      <Status
        winner={winner}
        isDraw={isDraw}
        currentPlayer={currentPlayer}
        playerNames={playerNames}
      />

      <FunModeBoard isUpsideDown={isUpsideDown}>
        <Board
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
          onDrop={enhancedMakeMove}
          canInteract={canInteract && !isChickenAnimating}
          soundManager={soundManager}
          isUpsideDown={isUpsideDown}
          blockedColumns={chaosChickenEnabled ? blockedColumns : []}
          onBlockedColumnAttempt={chaosChickenEnabled ? handleBlockedColumnDrop : undefined}
        />
      </FunModeBoard>

      <ButtonContainer>
        <CustomButton onClick={enhancedReset} soundManager={soundManager}>
          New Game
        </CustomButton>
        <CustomButton
          onClick={() => navigate("/play-offline")}
          soundManager={soundManager}
        >
          Back to Menu
        </CustomButton>
      </ButtonContainer>

      <BodyContainer
        style={{ fontSize: "16px", marginTop: "20px", textAlign: "center" }}
      >
        {/* Monkey Mode Instructions */}
        {monkeyModeEnabled ? (
          <>
            Get 2 separate 3-in-a-row to trigger Monkey Mayhem! 🐒
            <br />
            {monkeyMayhemState.wasUsed ? (
              <span style={{ color: "#ff6b6b" }}>
                Monkey Mayhem was used by{" "}
                {monkeyMayhemState.usedBy === "🔴" ? "Player 1" : "Player 2"}!
              </span>
            ) : monkeyMayhemState.wasOffered ? (
              <span style={{ color: "#ffa500" }}>
                Monkey Mayhem opportunity expired!
              </span>
            ) : (
              <span style={{ color: "#4caf50" }}>
                First player to get 2 separate 3-in-a-row can trigger it once!
              </span>
            )}
          </>
        ) : (
          <span style={{ color: "#666" }}>
            Monkey Mode is disabled in Settings.
          </span>
        )}

        <br /><br />

        {/* Chaos Chicken Instructions */}
        {chaosChickenEnabled ? (
          <>
            Form a 2x2 square to trigger Chaos Chicken! 🐔
            <br />
            <span style={{ color: "#4caf50" }}>
              • 1st activation: Chicken blocks a column with poop for 2 turns
            </span>
            <br />
            <span style={{ color: "#ff6b6b" }}>
              • 2nd activation: Rooster of Rage clears opponent's row!
            </span>
            <br />
            <span style={{ color: "#ffa500" }}>
              Each player can only use their Rooster once per game.
            </span>
          </>
        ) : (
          <span style={{ color: "#666" }}>
            Chaos Chicken is disabled in Settings.
          </span>
        )}

        {!monkeyModeEnabled && !chaosChickenEnabled && (
          <>
            <br />
            <span style={{ color: "#888", fontSize: "14px" }}>
              Enable features in Fun Mode Settings to unlock special abilities!
            </span>
          </>
        )}
      </BodyContainer>
    </PageContainer>
  );
};

export default FunMode;