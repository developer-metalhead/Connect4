/* eslint-disable no-unused-vars */
import { useMemo, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CustomButton from "../../components/buttonComponent";
import Status from "../../components/status";
import Board from "../../components/boardStyles";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
} from "./index.style";
import useOnlineConnect4 from "../../hooks/useOnlineConnect4";
import { PLAYER1 } from "../../helperFunction/helperFunction"; // only for emoji parity if needed

const Online = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    connected,
    status,
    error,
    roomId,
    players,
    gameState,
    myDisc,
    myTurn,
    setDisplayName,
    createRoom,
    joinRoomByCode,
    startQueue,
    stopQueue,
    leaveRoom,
    resetRoom,
    makeMove,
  } = useOnlineConnect4();

  // Prefill from query ?room=ABCD
  const params = new URLSearchParams(location.search);
  const prefillRoom = params.get("room") || "";

  const [name, setName] = useState("");
  const codeRef = useRef(prefillRoom);

  const inRoom = status === "room";

  const inviteLink = useMemo(() => {
    if (!roomId) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    url.pathname = "/play-online";
    return url.toString();
  }, [roomId]);

  const handleSetName = () => {
    setDisplayName(name);
  };

  return (
    <PageContainer>
      <HeaderContainer>Connect 4</HeaderContainer>
      <BodyContainer>Online Play</BodyContainer>

      {!connected && <BodyContainer>Connecting...</BodyContainer>}
      {error && (
        <BodyContainer style={{ color: "#ff6b6b" }}>{error}</BodyContainer>
      )}

      {!inRoom && (
        <>
          <div
            style={{
              display: "flex",
              gap: 12,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <input
              aria-label="Your display name"
              placeholder="Your name (optional)"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                border: "1px solid #444",
                width: 260,
              }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSetName}
            />

            <ButtonContainer>
              <CustomButton aria-label="Create a new room" onClick={createRoom}>
                Create Room (code/link)
              </CustomButton>

              <div
                style={{
                  display: "flex",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <input
                  aria-label="Enter room code"
                  placeholder="Enter code (e.g., ABC123)"
                  defaultValue={prefillRoom}
                  ref={codeRef}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 12,
                    border: "1px solid #444",
                    width: 260,
                  }}
                />
                <CustomButton
                  aria-label="Join room by code"
                  onClick={() => joinRoomByCode(codeRef.current?.value)}
                >
                  Join
                </CustomButton>
              </div>

              {status !== "searching" ? (
                <CustomButton aria-label="Find a match" onClick={startQueue}>
                  Find Match (Queue)
                </CustomButton>
              ) : (
                <CustomButton
                  aria-label="Cancel matchmaking"
                  onClick={stopQueue}
                >
                  Cancel Search…
                </CustomButton>
              )}

              <CustomButton
                aria-label="Back to Main Menu"
                onClick={() => navigate("/")}
              >
                Back
              </CustomButton>
            </ButtonContainer>
          </div>
        </>
      )}

      {inRoom && (
        <>
          <BodyContainer>
            Room: <strong>{roomId}</strong>
          </BodyContainer>

          {inviteLink && (
            <div
              style={{
                display: "flex",
                gap: 8,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <input
                aria-label="Invite link"
                readOnly
                value={inviteLink}
                style={{
                  padding: "8px 12px",
                  borderRadius: 10,
                  border: "1px solid #444",
                  width: "min(88vw, 520px)",
                  background: "#111",
                  color: "#ddd",
                }}
                onFocus={(e) => e.target.select()}
              />
              <CustomButton
                aria-label="Copy invite link"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(inviteLink);
                  } catch {
                    // ignore
                  }
                }}
              >
                Copy
              </CustomButton>
            </div>
          )}

          <div style={{ fontSize: 16, opacity: 0.8, marginTop: 6 }}>
            Players:{" "}
            {(players || [])
              .map((p) => `${p.name || "Guest"} ${p.disc || ""}`)
              .join(" vs ")}
          </div>

          <Status
            winner={gameState.winner}
            isDraw={gameState.isDraw}
            currentPlayer={gameState.currentPlayer}
          />

          {/* For preview: show my own disc so hover does not reveal opponent */}
          <Board
            board={gameState.board}
            currentPlayer={myDisc || PLAYER1}
            winner={gameState.winner}
            isDraw={gameState.isDraw}
            onDrop={makeMove}
          />

          <ButtonContainer>
            <CustomButton aria-label="Start a new game" onClick={resetRoom}>
              New Game
            </CustomButton>
            <CustomButton aria-label="Leave this room" onClick={leaveRoom}>
              Leave Room
            </CustomButton>
            <CustomButton
              aria-label="Back to menu"
              onClick={() => navigate("/")}
            >
              Main Menu
            </CustomButton>
          </ButtonContainer>

          {!myTurn && !gameState.winner && !gameState.isDraw && (
            <div style={{ marginTop: 8, opacity: 0.8 }}>
              Waiting for opponent…
            </div>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default Online;
