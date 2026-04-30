/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomButton from "../../components/buttonComponent";
import Status from "../../components/status";
import Board from "../../components/boardStyles";
import MonkeyMayhemButton from "../../components/MonkeyButton";
import MonkeyFlipAnimation from "../../components/MonkeyAnimation";
import useSoundManager from "../../hooks/useSoundManager";
import { useFunModeConnect4 } from "../../hooks/useFunModeConnect4";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
  UpsideDownIndicator,
  FunModeBoard,
} from "./index.style";

const FunMode = () => {
  const navigate = useNavigate();
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
    usedMonkeyMayhem,
  } = useFunModeConnect4();

  const { board, currentPlayer, winner, isDraw, isMonkeyWinner } = gameState;
  const soundManager = useSoundManager();
  const [monkeyButtonTimer, setMonkeyButtonTimer] = useState(10);

  // CHANGE: Add logging for component state changes
  useEffect(() => {
    console.log("🎮 FUN MODE STATE UPDATE:", {
      showMonkeyButton,
      monkeyButtonPlayer,
      currentPlayer,
      isUpsideDown,
      upsideDownTurnsLeft,
      isMonkeyAnimating,
      usedMonkeyMayhem: Array.from(usedMonkeyMayhem),
      winner,
      isDraw,
    });
  }, [
    showMonkeyButton,
    monkeyButtonPlayer,
    currentPlayer,
    isUpsideDown,
    upsideDownTurnsLeft,
    isMonkeyAnimating,
    usedMonkeyMayhem,
    winner,
    isDraw,
  ]);

  // Handle monkey button timer
  useEffect(() => {
    if (showMonkeyButton) {
      console.log("⏰ STARTING MONKEY BUTTON TIMER");
      setMonkeyButtonTimer(10);
      const interval = setInterval(() => {
        setMonkeyButtonTimer((prev) => {
          const newTime = prev - 1;
          console.log("⏰ MONKEY BUTTON TIMER:", newTime);
          if (newTime <= 0) {
            console.log("⏰ MONKEY BUTTON TIMER EXPIRED");
            clearInterval(interval);
            return 0;
          }
          return newTime;
        });
      }, 1000);

      return () => {
        console.log("⏰ CLEANING UP MONKEY BUTTON TIMER");
        clearInterval(interval);
      };
    }
  }, [showMonkeyButton]);

  // Play win/lose/draw sounds when game ends
  useEffect(() => {
    if (winner) {
      if (isMonkeyWinner) {
        // Special monkey winner sound (could be a custom sound)
        soundManager.playWinSound();
        setTimeout(() => soundManager.playSound("click"), 500); // Extra celebration
      } else {
        soundManager.playWinSound();
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, isMonkeyWinner, soundManager]);

  // Play monkey sounds during animation
  useEffect(() => {
    if (isMonkeyAnimating && monkeyVoiceLine) {
      // Play monkey scream sound
      soundManager.playSound("click"); // Using click as placeholder for monkey sound
    }
  }, [isMonkeyAnimating, monkeyVoiceLine, soundManager]);

  const handleMonkeyButtonClick = () => {
    console.log("🐒 MONKEY BUTTON CLICKED!");
    soundManager.playClickSound();
    triggerMonkeyMayhem();
  };

  const getPlayerNames = () => {
    const names = { "🔴": "Player 1", "🟡": "Player 2" };

    // Add monkey mayhem indicators
    if (usedMonkeyMayhem.has("🔴")) {
      names["🔴"] += " 🐒";
    }
    if (usedMonkeyMayhem.has("🟡")) {
      names["🟡"] += " 🐒";
    }

    return names;
  };

  // CHANGE: Add logging for render conditions
  console.log("🎨 RENDER CONDITIONS:", {
    shouldShowMonkeyButton:
      showMonkeyButton && monkeyButtonPlayer === currentPlayer,
    showMonkeyButton,
    monkeyButtonPlayer,
    currentPlayer,
    buttonPlayerMatch: monkeyButtonPlayer === currentPlayer,
  });

  return (
    <PageContainer>
      <HeaderContainer>Connect 4 - Fun Mode</HeaderContainer>
      <BodyContainer>Monkey Mayhem Enabled! 🐒</BodyContainer>

      {/* CHANGE: Simplified monkey button condition and added debug info */}
      {showMonkeyButton && (
        <div>
          <div
            style={{
              color: "white",
              fontSize: "12px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            DEBUG: Button for {monkeyButtonPlayer}, Current: {currentPlayer}
          </div>
          <MonkeyMayhemButton
            onTrigger={handleMonkeyButtonClick}
            timeLeft={monkeyButtonTimer}
          />
        </div>
      )}

      {/* Monkey Flip Animation */}
      <MonkeyFlipAnimation
        isAnimating={isMonkeyAnimating}
        voiceLine={monkeyVoiceLine}
        isFlippingBack={monkeyVoiceLine.includes("normal")}
      />

      {/* Upside Down Mode Indicator */}
      {isUpsideDown && (
        <UpsideDownIndicator>
          🙃 UPSIDE DOWN MODE - {Math.ceil(upsideDownTurnsLeft / 2)} turns left
          🙃
        </UpsideDownIndicator>
      )}

      <Status
        winner={winner}
        isDraw={isDraw}
        currentPlayer={currentPlayer}
        playerNames={getPlayerNames()}
      />

      <FunModeBoard isUpsideDown={isUpsideDown}>
        <Board
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          isDraw={isDraw}
          onDrop={makeMove}
          canInteract={!isMonkeyAnimating}
          soundManager={soundManager}
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

      {/* CHANGE: Updated instructions to reflect new trigger requirement */}
      <BodyContainer
        style={{ fontSize: "16px", marginTop: "20px", textAlign: "center" }}
      >
        Get 1 separate 3-in-a-row to trigger Monkey Mayhem! 🐒
        <br />
        The monkey will flip the board upside down for 3 turns!
      </BodyContainer>
    </PageContainer>
  );
};

export default FunMode;
