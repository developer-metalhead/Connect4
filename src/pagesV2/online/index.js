/* eslint-disable no-unused-vars */
import { useMemo, useRef, useState, useEffect } from "react";

import { useNavigate, useLocation } from "react-router-dom";
import CustomButton from "../../components/organisms/buttonComponent";
import Status from "../../components/organisms/status";
import Board from "../../components/organisms/boardStyles";
import SoundSettings from "../../components/organisms/SoundSettings";
import useSoundManager from "../../hooks/core/useSoundManager";

import {
  PageContainer,
  HeaderContainer,
  ButtonContainer,
  BodyContainer,
  HeaderContainerNotInRoom,
  BodyContainerNotInRoom,
} from "./index.style";
import useOnlineConnect4 from "../../hooks/core/useOnlineConnect4";
import { PLAYER1 } from "../../helperFunction/helperFunction";

const Online = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const soundManager = useSoundManager();
  const [showSoundSettings, setShowSoundSettings] = useState(false);

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

  const nameByDisc = useMemo(
    () =>
      (players || []).reduce((acc, p) => {
        if (p?.disc) acc[p.disc] = p?.name || "Guest";
        return acc;
      }, {}),
    [players],
  );

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

  // Play appropriate sounds when game ends
  useEffect(() => {
    if (gameState.winner) {
      if (gameState.winner === myDisc) {
        soundManager.playWinSound(); // I win
      } else {
        soundManager.playLoseSound(); // Opponent wins
      }
    } else if (gameState.isDraw) {
      soundManager.playDrawSound();
    }
  }, [gameState.winner, gameState.isDraw, myDisc, soundManager]);

  const handleSetName = () => {
    setDisplayName(name);
  };

  return (
    <PageContainer>
      

      {!connected && <BodyContainer>Connecting...</BodyContainer>}
      {error && (
        <BodyContainer style={{ color: "#ff6b6b" }}>{error}</BodyContainer>
      )}

      {/* Sound Settings Modal */}
      {showSoundSettings && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <SoundSettings
            soundManager={soundManager}
            onClose={() => setShowSoundSettings(false)}
          />
        </div>
      )}

      {!inRoom && (
        <div>
        <HeaderContainerNotInRoom>Connect 4</HeaderContainerNotInRoom>
        <BodyContainerNotInRoom>Online Play</BodyContainerNotInRoom>
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
              <CustomButton
                aria-label="Create a new room"
                onClick={createRoom}
                soundManager={soundManager}
              >
                Create Room
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
                  soundManager={soundManager}
                >
                  Join
                </CustomButton>
              </div>

              {status !== "searching" ? (
                <CustomButton
                  aria-label="Find a match"
                  onClick={startQueue}
                  soundManager={soundManager}
                >
                  Find Match (Queue)
                </CustomButton>
              ) : (
                <CustomButton
                  aria-label="Cancel matchmaking"
                  onClick={stopQueue}
                  soundManager={soundManager}
                >
                  Cancel Search…
                </CustomButton>
              )}

              <CustomButton
                aria-label="Sound Settings"
                onClick={() => setShowSoundSettings(true)}
                soundManager={soundManager}
              >
                🔊 Sound Settings
              </CustomButton>

              <CustomButton
                aria-label="Back to Main Menu"
                onClick={() => navigate("/")}
                soundManager={soundManager}

              >
                Back
              </CustomButton>
            </ButtonContainer>
          </div>
        </div>
      )}

      {inRoom && (
        <>
        <HeaderContainerNotInRoom>Connect 4</HeaderContainerNotInRoom>
        <BodyContainerNotInRoom>Online Play</BodyContainerNotInRoom>
          <BodyContainer>
            Room: <strong>{roomId}</strong>
          </BodyContainer>

          {inviteLink && myDisc === PLAYER1 && (
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
                soundManager={soundManager}
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
            playerNames={nameByDisc}
          />

          <Board
            board={gameState.board}
            currentPlayer={myDisc || PLAYER1}
            winner={gameState.winner}
            isDraw={gameState.isDraw}
            onDrop={makeMove}
            canInteract={myTurn}
            soundManager={soundManager}
            winningLine={gameState.winningLine}
          />

          <ButtonContainer>
            {/* <CustomButton
              aria-label="Start a new game"
              onClick={resetRoom}
              soundManager={soundManager}
            >
              New Game
            </CustomButton> */}
            {/* <CustomButton
              aria-label="Sound Settings"
              onClick={() => setShowSoundSettings(true)}
              soundManager={soundManager}
            >
              🔊 Settings
            </CustomButton> */}
            <CustomButton
              aria-label="Leave this room"
              onClick={leaveRoom}
              soundManager={soundManager}
            >
              Leave Room
            </CustomButton>
            {/* <CustomButton
              aria-label="Back to menu"
              onClick={() => navigate("/")}
              soundManager={soundManager}
            >
              Main Menu
            </CustomButton> */}
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
