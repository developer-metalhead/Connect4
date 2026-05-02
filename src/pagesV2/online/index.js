/* eslint-disable no-unused-vars */
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent, RefreshIconButton } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import BackButton from "../../components/designSystem/BackButton";
import GiveUpButton from "../../components/designSystem/GiveUpButton";
import SettingsMenu from "../../components/designSystem/SettingsMenu";
import SidePanel from "../../components/designSystem/SidePanel";
import OnlineSettings from "../../components/designSystem/OnlineSettings";
import SoundSettings from "../../components/designSystem/SoundSettings";
import BoardSettings from "../../components/designSystem/BoardSettings";
import GameSettings from "../../components/designSystem/GameSettings";
import Scoreboard from "../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../components/designSystem/Status";
import Modal from "../../components/designSystem/Modal";
import Input from "../../components/designSystem/Input";
import ConfirmationModal from "../../components/designSystem/ConfirmationModal";
import { 
  GameLayout, 
  LobbyCard, 
  RoomBadge, 
  InviteSection, 
  SectionTitle, 
  RoomToolbar,
  RoomIdBadge,
  CopyButton,
  LeaveButton,
  LiveGroup,
  LiveDot,
  LiveText
} from "./index.style";

// Original Logic
import Board from "../../components/organisms/boardStyles";
import PoopBlockIndicator from "../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import useSoundManager from "../../hooks/core/useSoundManager";
import useOnlineConnect4 from "../../hooks/core/useOnlineConnect4";
import { useGameSettings } from "../../hooks/core/useGameSettings";
import { PLAYER1, PLAYER2 } from "../../helperFunction/helperFunction";

const OnlineV2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'sound' or null
  const [showSurrenderConfirm, setShowSurrenderConfirm] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Copy");

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
    surrender,
    makeMove,
    rematchState,
    requestRematch,
    declineRematch,
    playerId
  } = useOnlineConnect4();
  
  const {
    monkeyAnimationEnabled
  } = useGameSettings();

  const inRoom = status === "room";

  // Auto-exit if rematch expires
  useEffect(() => {
    if (rematchState.isExpired) {
      console.log("⏰ Rematch expired. Pushing to Main Menu.");
      leaveRoom();
      navigate("/home");
    }
  }, [rematchState.isExpired, leaveRoom, navigate]);

  // Background music management
  useEffect(() => {
    if (inRoom) {
      soundManager.pauseBackgroundMusic();
    } else {
      soundManager.resumeBackgroundMusic();
    }
  }, [inRoom, soundManager]);

  const handleCopyRoomId = () => {
    if (!roomId) return;
    navigator.clipboard.writeText(roomId);
    setCopyStatus("Copied!");
    soundManager?.playClickSound();
    setTimeout(() => setCopyStatus("Copy"), 2000);
  };

  const handleSurrenderClick = () => {
    if (gameState.winner || gameState.isDraw || players.length < 2) {
      console.log("🚶 Leaving room (No match active or already ended).");
      leaveRoom();
      navigate("/home");
      return;
    }
    soundManager?.playClickSound();
    setShowSurrenderConfirm(true);
  };

  const handleConfirmSurrender = () => {
    setShowSurrenderConfirm(false);
    soundManager.playSurrenderSound();
    surrender();
  };

  const handleCancelSurrender = () => {
    soundManager?.playClickSound();
    setShowSurrenderConfirm(false);
  };

  // Browser/Mobile back button should trigger confirmation
  useEffect(() => {
    const handlePopState = (e) => {
      if (status === "room" && !gameState.winner && !gameState.isDraw) {
        window.history.pushState(null, "", window.location.pathname);
        handleSurrenderClick();
      }
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [status, gameState.winner, gameState.isDraw]);

  const nameByDisc = useMemo(() => {
    const base = { [PLAYER1]: "Player 1", [PLAYER2]: "Player 2" };
    return (players || []).reduce((acc, p) => {
      if (p?.disc) acc[p.disc] = p?.name || "Guest";
      return acc;
    }, base);
  }, [players]);

  const params = new URLSearchParams(location.search);
  const prefillRoom = params.get("room") || "";
  const [name, setName] = useState("");
  const codeRef = useRef(prefillRoom);

  const inviteLink = useMemo(() => {
    if (!roomId) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    url.pathname = "/play-online";
    return url.toString();
  }, [roomId]);

  useEffect(() => {
    if (gameState.winner) {
      const isFunMode = false;
      if (gameState.winner === myDisc) {
        soundManager.playWinSound({ isFunMode });
      } else {
        soundManager.playLoseSound({ isFunMode });
      }
    } else if (gameState.isDraw) {
      soundManager.playDrawSound();
    }
  }, [gameState.winner, gameState.isDraw, myDisc, soundManager]);

  const handleSetName = () => {
    if (name.trim()) setDisplayName(name);
  };

  const p1Data = useMemo(() => {
    const p1 = players?.find(p => p.disc === PLAYER1) || { name: "Waiting...", score: 0 };
    return {
      name: p1.name || "Guest",
      score: gameState.scores?.[PLAYER1] || 0,
      active: gameState.currentPlayer === PLAYER1 && !gameState.winner && !gameState.isDraw,
      emoji: PLAYER1
    };
  }, [players, gameState]);

  const p2Data = useMemo(() => {
    const p2 = players?.find(p => p.disc === PLAYER2) || { name: "Waiting...", score: 0 };
    return {
      name: p2.name || "Guest",
      score: gameState.scores?.[PLAYER2] || 0,
      active: gameState.currentPlayer === PLAYER2 && !gameState.winner && !gameState.isDraw,
      emoji: PLAYER2
    };
  }, [players, gameState]);

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    soundManager?.playClickSound();
  };

  return (
    <PageWrapper>
      {!inRoom && !connected && (
      <RefreshIconButton 
        onClick={() => {
          soundManager?.playClickSound();
          window.location.reload();
        }} 
        style={{ position: 'fixed', top: '12px', right: '12px', zIndex: 1001 }}
      >
        <svg viewBox="0 0 24 24"><path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" /></svg>
      </RefreshIconButton>)}
 
      {inRoom && (
        <RoomToolbar>
          <LiveGroup>
            <LiveDot />
            <LiveText>Live</LiveText>
          </LiveGroup>
          
          <RoomIdBadge>
            <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', textTransform: 'uppercase' }}>ID:</span>
            {roomId}
            <CopyButton onClick={handleCopyRoomId} title={copyStatus}>
              {copyStatus === "Copied!" ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </CopyButton>
          </RoomIdBadge>

          <LeaveButton onClick={handleSurrenderClick}>
            Quit
          </LeaveButton>
        </RoomToolbar>
      )}

      {!inRoom && connected && (
        <SettingsMenu
          soundManager={soundManager}
          activeOption={activePanel}
          onOptionClick={(id) => setActivePanel(activePanel === id ? null : id)}
          options={[
            { id: 'game', label: 'Game Settings', icon: <span>🎮</span> },
            { id: 'sound', label: 'Sound Settings', icon: <span>🔊</span> },
            { id: 'board', label: 'Board Settings', icon: <span>⚙️</span> },
            { id: 'online', label: 'Online Settings', icon: <span>🌐</span> },
          ]}
        />
      )}

      {!inRoom && <Header />}

      {!inRoom && (
        <BackButton 
          soundManager={soundManager} 
          onClick={() => {
            stopQueue();
            navigate("/home");
          }} 
        />
      )}

      <SidePanel 
        isOpen={activePanel !== null} 
        onClose={() => setActivePanel(null)}
        title={
          activePanel === 'online' ? 'Online Settings' :
          activePanel === 'game' ? 'Game Settings' :
          activePanel === 'board' ? 'Board Settings' :
          'Sound Settings'
        }
      >
        {activePanel === 'online' && <OnlineSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'sound' && <SoundSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'game' && <GameSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
        {activePanel === 'board' && <BoardSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
      </SidePanel>

      <MainContent>
        {!connected && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <GameStatus message="Connecting... (Try Refreshing)" />
          </div>
        )}
        {error && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <GameStatus message={`Error: ${error}`} />
          </div>
        )}

        {!inRoom && connected && (
          <LobbyCard>
            <div style={{ textAlign: 'center' }}>
              <SectionTitle>Online Multiplayer</SectionTitle>
              <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: '8px' }}>
                Create a private room or find a quick match.
              </p>
            </div>

            <Input 
              label="Display Name"
              placeholder="Enter your name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSetName}
            />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Button variant="primary" fullWidth onClick={createRoom} soundManager={soundManager}>
                Create Private Room
              </Button>
              
              <div style={{ display: 'flex', gap: '8px' }}>
                <Input 
                  placeholder="Room Code"
                  defaultValue={prefillRoom}
                  ref={codeRef}
                  style={{ flex: 1 }}
                />
                <Button variant="secondary" onClick={() => joinRoomByCode(codeRef.current?.value)} soundManager={soundManager}>
                  Join
                </Button>
              </div>

              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '8px 0' }} />

              {status !== "searching" ? (
                <Button variant="outline" fullWidth onClick={startQueue} soundManager={soundManager}>
                  Find Quick Match
                </Button>
              ) : (
                <Button variant="danger" fullWidth onClick={stopQueue} soundManager={soundManager}>
                  Cancel Search...
                </Button>
              )}
            </div>
          </LobbyCard>
        )}

        {inRoom && (
          <GameLayout style={{ marginTop: '100px' }}>
            <Scoreboard p1={p1Data} p2={p2Data} />

            <Board
              board={gameState.board}
              currentPlayer={myDisc || PLAYER1}
              winner={gameState.winner}
              isDraw={gameState.isDraw}
              onDrop={makeMove}
              canInteract={myTurn}
              soundManager={soundManager}
              winningLine={gameState.winningLine}
              PoopBlockIndicatorComponent={PoopBlockIndicator}
            />

            <GameStatus 
              message={
                gameState.winner 
                  ? `${nameByDisc[gameState.winner]} Wins!` 
                  : gameState.isDraw 
                  ? "It's a Draw!" 
                  : myTurn 
                  ? "Your Turn" 
                  : `Waiting for ${nameByDisc[gameState.currentPlayer]}...`
              }
              currentPlayerColor={gameState.currentPlayer === PLAYER1 ? "red" : "yellow"}
            />
          </GameLayout>
        )}
      </MainContent>

      {(gameState.winner || gameState.isDraw) && (
        <MatchResultOverlay 
          title={
            gameState.winner 
              ? (gameState.winner === myDisc ? (gameState.winningLine ? "VICTORY" : "OPPONENT FORFEIT") : (gameState.winningLine ? "DEFEAT" : "FORFEIT")) 
              : "DRAW"
          }
          subtitle={
            gameState.winner 
              ? (gameState.winner === myDisc ? (gameState.winningLine ? "You dominated the board!" : "Your opponent surrendered. You win!") : (gameState.winningLine ? "Better luck next time." : "You've conceded. Victory goes to your opponent.")) 
              : "A perfect stalemate."
          }
          variant={gameState.winner ? (gameState.winner === myDisc ? "win" : "loss") : "draw"}
          icon={gameState.winner ? (gameState.winner === myDisc ? "🏆" : "🏳️") : "🤝"}
          
          onPrimaryAction={!!gameState.winningLine ? () => {
            soundManager?.playSound('click');
            requestRematch();
          } : null}
          primaryActionLabel={!!gameState.winningLine ? "Rematch" : null}
          
          onSecondaryAction={() => {
            declineRematch();
            leaveRoom();
            navigate("/home");
          }}
          secondaryActionLabel="Main Menu"
          soundManager={soundManager}
          isNaturalEnding={!!gameState.winningLine}
          rematchState={rematchState}
          myPlayerId={playerId}
        />
      )}

      <ConfirmationModal
        isOpen={showSurrenderConfirm}
        onAccept={handleConfirmSurrender}
        onDecline={handleCancelSurrender}
        onClose={handleCancelSurrender}
        title="Surrender Match?"
        message="Are you sure you want to give up? This will count as a loss."
        acceptLabel="Yes, Surrender"
        declineLabel="Keep Playing"
      />
    </PageWrapper>
  );
};

export default OnlineV2;
