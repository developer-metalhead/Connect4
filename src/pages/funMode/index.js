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
import useFunModeSettings from "../../hooks/useFunModeSettings";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
  UpsideDownIndicator,
  FunModeBoard,
  MonkeyModeOverlay,
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
  } = useFunModeConnect4({ monkeyModeEnabled });

  const { board, currentPlayer, winner, isDraw, isMonkeyWinner } = gameState;
  const soundManager = useSoundManager();
  const [monkeyButtonTimer, setMonkeyButtonTimer] = useState(10);

  useEffect(() => {
    console.log("🎮 FUN MODE STATE UPDATE:", {
      showMonkeyButton,
      monkeyButtonPlayer,
      currentPlayer,
      isUpsideDown,
      upsideDownTurnsLeft,
      isMonkeyAnimating,
      monkeyMayhemState,
      isGravityFalling,
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
    monkeyMayhemState,
    isGravityFalling,
    winner,
    isDraw,
  ]);

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

  useEffect(() => {
    if (winner) {
      if (isMonkeyWinner) {
        soundManager.playWinSound();
        setTimeout(() => soundManager.playSound("click"), 500);
      } else {
        soundManager.playWinSound();
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, isMonkeyWinner, soundManager]);

  useEffect(() => {
    if (isMonkeyAnimating && monkeyVoiceLine) {
      soundManager.playSound("click");
    }
  }, [isMonkeyAnimating, monkeyVoiceLine, soundManager]);

  const handleMonkeyButtonClick = () => {
    console.log("🐒 MONKEY BUTTON CLICKED!");
    soundManager.playClickSound();
    triggerMonkeyMayhem();
  };

  const getPlayerNames = () => {
    const names = { "🔴": "Player 1", "🟡": "Player 2" };

    if (monkeyMayhemState.usedBy === "🔴") {
      names["🔴"] += " 🐒";
    }
    if (monkeyMayhemState.usedBy === "🟡") {
      names["🟡"] += " 🐒";
    }

    return names;
  };

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
    

      {/* Feature status */}
      <BodyContainer style={{ fontSize: "14px" }}>
        Features:{" "}
        <span style={{ color: monkeyModeEnabled ? "#4caf50" : "#ff6b6b", fontWeight: 700 }}>
          Monkey Mode: {monkeyModeEnabled ? "On" : "Off"}
        </span>
      </BodyContainer>

      {showMonkeyButton && <MonkeyModeOverlay />}

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

      <MonkeyFlipAnimation
        isAnimating={isMonkeyAnimating}
        voiceLine={monkeyVoiceLine}
        isFlippingBack={monkeyVoiceLine.includes("normal")}
      />

      {isGravityFalling && (
        <UpsideDownIndicator>
          🌊 GRAVITY RESTORED - Discs falling back! 🌊
        </UpsideDownIndicator>
      )}

      {isUpsideDown && !isGravityFalling && (
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
          canInteract={!isMonkeyAnimating && !showMonkeyButton && !isGravityFalling}
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