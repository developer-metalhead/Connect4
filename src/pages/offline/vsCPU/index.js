/* eslint-disable no-unused-vars */
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/buttonComponent";
import Status from "../../../components/status";
import Board from "../../../components/boardStyles";
import { PLAYER1 } from "../../../helperFunction/helperFunction"; // For preview icon

import useConnect4CPU from "../../../hooks/useConnect4CPU";

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

  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>VS CPU</BodyContainer>

      <Status winner={winner} isDraw={isDraw} currentPlayer={currentPlayer} />

      {/* Pass human disc for preview to avoid confusing CPU preview */}
      <Board
        board={board}
        currentPlayer={PLAYER1}
        winner={winner}
        isDraw={isDraw}
        onDrop={makeHumanMove}
      />

      <ButtonContainer>
        <CustomButton onClick={reset}>New Game</CustomButton>
        <CustomButton onClick={() => navigate("/play-offline")}>
          Back to Menu
        </CustomButton>
      </ButtonContainer>
    </PageContainer>
  );
};

export default PlayCPU;
