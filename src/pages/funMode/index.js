/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import CustomButton from "../../components/organisms/buttonComponent";
import Status from "../../components/organisms/status";
import Board from "../../components/organisms/boardStyles";
import useSoundManager from "../../hooks/core/useSoundManager";
import { useMonkeyMode } from "../../hooks/funMode/useMonkeyMode";
import useFunModeSettings from "../../hooks/funMode/useFunModeSettings";
import { MonkeyModeContainer } from "../../components/features/MayhemMonkey/MonkeyModeComponent";
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
  const { monkeyModeEnabled } = useFunModeSettings();
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


  return (
    <PageContainer>
      <HeaderContainer>Connect 4 - Fun Mode</HeaderContainer>
    


      {/* Feature status */}
      <BodyContainer style={{ fontSize: "14px" }}>
        Features:{" "}
        <span style={{ color: monkeyModeEnabled ? "#4caf50" : "#ff6b6b", fontWeight: 700 }}>
          Monkey Mode: {monkeyModeEnabled ? "On" : "Off"}
        </span>
      </BodyContainer>


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
          onDrop={makeMove}
          canInteract={canInteract}

          soundManager={soundManager}
          isUpsideDown={isUpsideDown}
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