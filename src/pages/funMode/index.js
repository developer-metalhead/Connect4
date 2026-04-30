/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomButton from "../../components/organisms/buttonComponent";
import Status from "../../components/organisms/status";
import Board from "../../components/organisms/boardStyles";
import useSoundManager from "../../hooks/core/useSoundManager";
import { useMonkeyMode } from "../../hooks/funMode/useMonkeyMode";
import { useChaosChicken } from "../../hooks/funMode/useChaosChicken"; // CHANGE: Added chaos chicken hook
import useFunModeSettings from "../../hooks/funMode/useFunModeSettings";
import { MonkeyModeContainer } from "../../components/features/MayhemMonkey/MonkeyModeComponent";
import { ChaosChickenContainer } from "../../components/features/ChaosChicken/ChickenModeComponents"; // CHANGE: Added chaos chicken components
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
  // CHANGE: Added chaos chicken enabled setting
  const { monkeyModeEnabled, chaosChickenEnabled } = useFunModeSettings();

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
  } = useMonkeyMode({ monkeyModeEnabled });

  // CHANGE: Added chaos chicken hook
  const {
    chaosChickenState,
    blockedColumns,
    isChickenAnimating,
    chickenVoiceLine,
    chickenAction,
    checkChaosChickenTrigger,
    triggerChaosChicken,
    endTurn: endChickenTurn,
    isValidMove: isValidChickenMove,
    getAlternativeColumn,
    reset: resetChicken,
  } = useChaosChicken({ chaosChickenEnabled });

  const { board, currentPlayer, winner, isDraw, isMonkeyWinner } = gameState;
  const soundManager = useSoundManager();

  // CHANGE: Updated effects to include chicken animations
  const { monkeyButtonTimer } = useFunModeEffects({
    showMonkeyButton,
    winner,
    isDraw,
    isMonkeyWinner,
    isMonkeyAnimating: isMonkeyAnimating || isChickenAnimating, // Include chicken animation
    monkeyVoiceLine: monkeyVoiceLine || chickenVoiceLine, // Include chicken voice
    soundManager
  });


  // CHANGE: Enhanced move function to handle chaos chicken
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

      // Make the move
      const moveResult = makeMove(col);
      if (!moveResult) return false;

      // Check for chaos chicken trigger after successful move
      if (checkChaosChickenTrigger(board, currentPlayer)) {
        setTimeout(() => {
          const { newBoard } = triggerChaosChicken(board, currentPlayer);
          // Note: In a real implementation, you'd need to update the game state with newBoard
        }, 500);
      }

      // End turn for chicken (decrease blocked column timers)
      endChickenTurn();

      return true;
    };
  }, [makeMove, isValidChickenMove, getAlternativeColumn, board, currentPlayer, isUpsideDown, checkChaosChickenTrigger, triggerChaosChicken, endChickenTurn]);

  // CHANGE: Enhanced reset function
  const enhancedReset = useMemo(() => {
    return () => {
      reset();
      resetChicken();
    };
  }, [reset, resetChicken]);

  // Memoized computed values to avoid recalculation
  const playerNames = useMemo(() => getPlayerNames(monkeyMayhemState), [monkeyMayhemState]);
  const handleMonkeyButtonClick = useMemo(() => createMonkeyButtonHandler(soundManager, triggerMonkeyMayhem), [soundManager, triggerMonkeyMayhem]);
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
        {/* CHANGE: Added chaos chicken status */}
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

      {/* CHANGE: Added Chaos Chicken Components */}
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
          onDrop={enhancedMakeMove} // CHANGE: Use enhanced move function
          canInteract={canInteract}
          soundManager={soundManager}
          isUpsideDown={isUpsideDown}
          blockedColumns={blockedColumns} // CHANGE: Pass blocked columns to board
        />

      </FunModeBoard>

      <ButtonContainer>
        <CustomButton onClick={enhancedReset} soundManager={soundManager}> {/* CHANGE: Use enhanced reset */}

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
        
        {/* CHANGE: Added chaos chicken instructions */}
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