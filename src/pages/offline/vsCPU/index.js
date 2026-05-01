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
  // CHANGE: Destructure PostVideoOverlay state from the CPU hook
  const { 
    gameState, 
    makeHumanMove, 
    reset, 
    isCpuTurn, 
    isCpuDropping, 
    cpuDroppingCol,
    shouldShowPostVideoOverlay,
    closePostVideoOverlay
  } = useConnect4CPU();
  const { board, currentPlayer, winner, isDraw } = gameState;
  const soundManager = useSoundManager();

  // CHANGE: Modified to only play win sound for human wins, CPU wins are handled by overlay
  useEffect(() => {
    if (winner) {
      if (winner === PLAYER1) {
        soundManager.playWinSound(); // Human wins
      }
      // CHANGE: Removed CPU win sound handling - now handled by PostVideoOverlay
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

  // Play drop sound when CPU is dropping
  useEffect(() => {
    if (isCpuDropping && soundManager) {
      // Delay sound to match animation timing
      setTimeout(() => {
        soundManager.playDropSound();
      }, 100);
    }
  }, [isCpuDropping, soundManager]);

  // CHANGE: Handle PostVideoOverlay close and reset game
  const handleClosePostVideoOverlay = () => {
    closePostVideoOverlay();
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
        isCpuDropping={isCpuDropping}
        cpuDroppingCol={cpuDroppingCol}
        winningLine={gameState.winningLine}
      />

      <ButtonContainer>
        <BoredVideoButton onGameReset={reset}>
        Give Up!
        </BoredVideoButton>
      
        <CustomButton
          onClick={() => navigate("/legacy/play-offline")}
          soundManager={soundManager}
        >
          Main Menu
        </CustomButton>
        
      </ButtonContainer>

      {/* CHANGE: Use PostVideoOverlay state from CPU hook instead of local state */}
      <PostVideoOverlay
        isVisible={shouldShowPostVideoOverlay}
        onClose={handleClosePostVideoOverlay}
        soundManager={soundManager}
      />
    </PageContainer>
  );
};

export default PlayCPU;