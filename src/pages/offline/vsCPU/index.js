/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CustomButton from "../../../components/organisms/buttonComponent";
import Status from "../../../components/organisms/status";
import Board from "../../../components/organisms/boardStyles";
import { PLAYER1 } from "../../../helperFunction/helperFunction";
import useSoundManager from "../../../hooks/core/useSoundManager";
// CHANGE: Import PostVideoOverlay component
import PostVideoOverlay from "../../../components/organisms/postVideoOverlay";

import useConnect4CPU from "../../../hooks/core/useConnect4CPU";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";
import BoredVideoButton from "../../../components/organisms/VideoButton";

const PlayCPU = () => {
  const navigate = useNavigate();
  // CHANGE: Destructure CPU dropping state from the hook
  const { gameState, makeHumanMove, reset, isCpuTurn, isCpuDropping, cpuDroppingCol } = useConnect4CPU();
  const { board, currentPlayer, winner, isDraw } = gameState;
  const soundManager = useSoundManager();
  
  // CHANGE: Add state to control PostVideoOverlay visibility
  const [showPostVideoOverlay, setShowPostVideoOverlay] = useState(false);

  // Play appropriate sounds when game ends
  useEffect(() => {
    if (winner) {
      if (winner === PLAYER1) {
        soundManager.playWinSound(); // Human wins
      } else {
        handleGiveUp() // CPU wins
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

  // CHANGE: Play drop sound when CPU is dropping
  useEffect(() => {
    if (isCpuDropping && soundManager) {
      // Delay sound to match animation timing
      setTimeout(() => {
        soundManager.playDropSound();
      }, 100);
    }
  }, [isCpuDropping, soundManager]);

  // CHANGE: Handle Give Up button click to show PostVideoOverlay
  const handleGiveUp = () => {
    setShowPostVideoOverlay(true);
  };

  // CHANGE: Handle PostVideoOverlay close and reset game
  const handleClosePostVideoOverlay = () => {
    setShowPostVideoOverlay(false);
    reset(); // Reset the game after overlay closes
  };

  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>VS CPU</BodyContainer>
      <Status
        winner={winner}
        isDraw={isDraw}
        currentPlayer={currentPlayer}
        playerNames={{ "🔴": "Player", "🟡": "CPU" }}
      />
      <Board
        board={board}
        currentPlayer={PLAYER1}
        winner={winner}
        isDraw={isDraw}
        onDrop={makeHumanMove}
        canInteract={!isCpuTurn}
        soundManager={soundManager}
        // CHANGE: Pass CPU dropping state to Board component
        isCpuDropping={isCpuDropping}
        cpuDroppingCol={cpuDroppingCol}
      />

      <ButtonContainer>
        {/* CHANGE: Update Give Up button to show PostVideoOverlay instead of direct reset */}
        <BoredVideoButton onGameReset={reset}>
        Give Up!
        </BoredVideoButton>
      
        <CustomButton
          onClick={() => navigate("/play-offline")}
          soundManager={soundManager}
        >
          Main Menu
        </CustomButton>
        
      </ButtonContainer>

      {/* CHANGE: Add PostVideoOverlay component */}
      <PostVideoOverlay
        isVisible={showPostVideoOverlay}
        onClose={handleClosePostVideoOverlay}
        soundManager={soundManager}
      />
    </PageContainer>
  );
};

export default PlayCPU;