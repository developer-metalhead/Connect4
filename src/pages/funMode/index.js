/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomButton from "../../components/organisms/buttonComponent";
import Status from "../../components/organisms/status";
import Board from "../../components/organisms/boardStyles";
import useSoundManager from "../../hooks/core/useSoundManager";
import { useFunMode } from "../../hooks/funMode/useFunMode"; // CHANGE: Use new core funMode hook
import { useMonkeyMode } from "../../hooks/funMode/useMonkeyMode";
import { useChaosChicken } from "../../hooks/funMode/useChaosChicken";
import useFunModeSettings from "../../hooks/funMode/useFunModeSettings";
import { MonkeyModeContainer } from "../../components/features/MayhemMonkey/MonkeyModeComponent";
import { ChaosChickenContainer } from "../../components/features/ChaosChicken/ChickenModeComponents";
import { useFunModeEffects } from "../../hooks/funMode/useFunModeEffects";
import { getPlayerNames, createMonkeyButtonHandler, canInteractWithBoard } from "../../helperFunction/funMode/monkeyModeFeatures";

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

  // CHANGE: Initialize feature hooks first
  const chaosChickenHook = useChaosChicken({ chaosChickenEnabled });
  const monkeyModeHook = useMonkeyMode({ monkeyModeEnabled });

  // CHANGE: Use new core funMode hook as primary game controller
  const {
    gameState,
    makeMove,
    reset,
    isGravityFalling,
    gravityAnimation,
  } = useFunMode({
    monkeyModeHook,
    chaosChickenHook,
  });

  // CHANGE: Destructure from individual hooks
  const {
    showMonkeyButton,
    monkeyButtonPlayer,
    isUpsideDown,
    upsideDownTurnsLeft,
    isMonkeyAnimating,
    monkeyVoiceLine,
    monkeyMayhemState,
    triggerMonkeyMayhem,
  } = monkeyModeHook;

  const {
    chaosChickenState,
    blockedColumns,
    isChickenAnimating,
    chickenVoiceLine,
    chickenAction,
    isValidMove: isValidChickenMove,
    getAlternativeColumn,
  } = chaosChickenHook;

  const { board, currentPlayer, winner, isDraw, isMonkeyWinner } = gameState;
  const soundManager = useSoundManager();

  const { monkeyButtonTimer } = useFunModeEffects({
    showMonkeyButton,
    winner,
    isDraw,
    isMonkeyWinner,
    isMonkeyAnimating: isMonkeyAnimating || isChickenAnimating,
    monkeyVoiceLine: monkeyVoiceLine || chickenVoiceLine,
    soundManager
  });

  // CHANGE: Enhanced move function handles column blocking only
  const enhancedMakeMove = useMemo(() => {
    return (col) => {
      // Check if column is blocked by chicken poop
      if (!isValidChickenMove(board, col, isUpsideDown)) {
        // Try to find alternative column
        const altCol = getAlternativeColumn(board, col, isUpsideDown);
        if (altCol === -1) {
          console.log("❌ NO AVAILABLE COLUMNS - ALL BLOCKED BY POOP");
          return false;
        }
        console.log(`💩 COLUMN ${col} BLOCKED, USING ALTERNATIVE ${altCol}`);
        col = altCol;
      }

      // CHANGE: Core game logic is now handled in useFunMode
      return makeMove(col);
    };
  }, [makeMove, isValidChickenMove, getAlternativeColumn, board, isUpsideDown]);

  // Memoized computed values to avoid recalculation
  const playerNames = useMemo(() => getPlayerNames(monkeyMayhemState), [monkeyMayhemState]);
  
  // CHANGE: Pass gameState setter to monkey mode for board updates
  const handleMonkeyButtonClick = useMemo(() => {
    return () => {
      console.log("🐒 MONKEY BUTTON CLICKED!");
      soundManager.playClickSound();
      triggerMonkeyMayhem((updateFn) => {
        // This will be handled by the core hook's state management
        console.log("🐒 MONKEY MAYHEM BOARD UPDATE REQUESTED");
      });
    };
  }, [soundManager, triggerMonkeyMayhem]);

  const canInteract = useMemo(() => canInteractWithBoard(isMonkeyAnimating || isChickenAnimating, showMonkeyButton, isGravityFalling), [isMonkeyAnimating, isChickenAnimating, showMonkeyButton, isGravityFalling]);

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

      {/* Monkey Mode Components */}
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

      {/* Chaos Chicken Components */}
      <ChaosChickenContainer
        chaosChickenEnabled={chaosChickenEnabled}
        isChickenAnimating={isChickenAnimating}
        chickenVoiceLine={chickenVoiceLine}
        chickenAction={chickenAction}
        chaosChickenState={chaosChickenState}
        blockedColumns={blockedColumns}
      />

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
          canInteract={canInteract}
          soundManager={soundManager}
          isUpsideDown={isUpsideDown}
          blockedColumns={blockedColumns}
          gravityAnimation={gravityAnimation} // CHANGE: Pass gravity animation from core hook
        />
      </FunModeBoard>

      <ButtonContainer>
        <CustomButton onClick={reset} soundManager={soundManager}>
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
        {monkeyModeEnabled
          ? "Get 2 separate 3-in-a-row to trigger Monkey Mayhem! 🐒"
          : "Monkey Mode is disabled in Settings."}
        
        {chaosChickenEnabled && (
          <>
            <br />
            Create a 2x2 square to trigger Chaos Chicken! 🐔
            {chaosChickenState.activations > 0 && (
              <span style={{ color: "#ff8c00" }}>
                {" "}(Activations: {chaosChickenState.activations}/2)
              </span>
            )}
          </>
        )}

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
          monkeyModeEnabled && (
            <span style={{ color: "#4caf50" }}>
              First player to get 3-in-a-row can trigger it once!
            </span>
          )
        )}
      </BodyContainer>
    </PageContainer>
  );
};

export default FunMode;