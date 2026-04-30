/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import CustomButton from "../../../components/organisms/buttonComponent";
import Status from "../../../components/organisms/status";
import Board from "../../../components/organisms/boardStyles";
import { PLAYER1 } from "../../../helperFunction/helperFunction";
import useSoundManager from "../../../hooks/core/useSoundManager";

import useConnect4CPU from "../../../hooks/core/useConnect4CPU";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";

const PlayCPU = () => {
  const navigate = useNavigate();
  const { gameState, makeHumanMove, reset, isCpuTurn } = useConnect4CPU();
  const { board, currentPlayer, winner, isDraw } = gameState;
  const soundManager = useSoundManager();

  // Play appropriate sounds when game ends
  useEffect(() => {
    if (winner) {
      if (winner === PLAYER1) {
        soundManager.playWinSound(); // Human wins
      } else {
        soundManager.playLoseSound(); // CPU wins
      }
    } else if (isDraw) {
      soundManager.playDrawSound();
    }
  }, [winner, isDraw, soundManager]);

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
      />

      <ButtonContainer>
        <CustomButton onClick={reset} soundManager={soundManager}>
          New Game
        </CustomButton>
        <CustomButton
          onClick={() => navigate("/play-offline")}
          soundManager={soundManager}
        >
          Main Menu
        </CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default PlayCPU;
