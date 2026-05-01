/* eslint-disable no-unused-vars */
import { useMemo, useRef, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// New UI Components
import { PageWrapper, Header, HeaderContent, AppLogo, MainContent } from "../../components/designSystem/Layout.style";
import Button from "../../components/designSystem/Button";
import BackButton from "../../components/designSystem/BackButton";
import GiveUpButton from "../../components/designSystem/GiveUpButton";
import SettingsMenu from "../../components/designSystem/SettingsMenu";
import SidePanel from "../../components/designSystem/SidePanel";
import OnlineSettings from "../../components/designSystem/OnlineSettings";
import SoundSettings from "../../components/designSystem/SoundSettings";
import Scoreboard from "../../components/designSystem/Scoreboard";
import { GameStatus, MatchResultOverlay } from "../../components/designSystem/Status";
import Modal from "../../components/designSystem/Modal";
import Input from "../../components/designSystem/Input";
import { 
  GameLayout, 
  LobbyCard, 
  RoomBadge, 
  InviteSection, 
  SectionTitle 
} from "./index.style";

// Original Logic
import Board from "../../components/organisms/boardStyles";
import PoopBlockIndicator from "../../components/designSystem/Features/chaosChicken/PoopBlockIndicator";
import useSoundManager from "../../hooks/core/useSoundManager";
import useOnlineConnect4 from "../../hooks/core/useOnlineConnect4";
import { PLAYER1, PLAYER2 } from "../../helperFunction/helperFunction";

const OnlineV2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const soundManager = useSoundManager();
  const [activePanel, setActivePanel] = useState(null); // 'sound' or null

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

  const params = new URLSearchParams(location.search);
  const prefillRoom = params.get("room") || "";
  const [name, setName] = useState("");
  const codeRef = useRef(prefillRoom);
  const inRoom = status === "room";

  const inviteLink = useMemo(() => {
    if (!roomId) return "";
    const url = new URL(window.location.href);
    url.searchParams.set("room", roomId);
    url.pathname = "/play-online"; // Update path for primary routes
    return url.toString();
  }, [roomId]);

  useEffect(() => {
    if (gameState.winner) {
      if (gameState.winner === myDisc) {
        soundManager.playWinSound();
      } else {
        soundManager.playLoseSound();
      }
    } else if (gameState.isDraw) {
      soundManager.playDrawSound();
    }
  }, [gameState.winner, gameState.isDraw, myDisc, soundManager]);

  const handleSetName = () => {
    if (name.trim()) setDisplayName(name);
  };

  // Prepare data for Scoreboard
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

  return (
    <PageWrapper>
 
      
      {inRoom ? (
        <GiveUpButton 
          onGiveUp={() => {
            leaveRoom();
            navigate("/home");
          }} 
          soundManager={soundManager} 
        />
      ) : (
        <SettingsMenu
          soundManager={soundManager}
          activeOption={activePanel}
          onOptionClick={(id) => setActivePanel(activePanel === id ? null : id)}
          options={[
            { id: 'online', label: 'Online Settings', icon: <span>🌐</span> },
            { id: 'sound', label: 'Sound Settings', icon: <span>🔊</span> },
          ]}
        />
      )}

      <Header/>
        
   
      <BackButton soundManager={soundManager} />

      <SidePanel 
        isOpen={activePanel !== null} 
        onClose={() => setActivePanel(null)}
        title={activePanel === 'online' ? 'Online Settings' : 'Sound Settings'}
      >
        {activePanel === 'online' && <OnlineSettings soundManager={soundManager} />}
        {activePanel === 'sound' && <SoundSettings soundManager={soundManager} onClose={() => setActivePanel(null)} />}
      </SidePanel>

      <MainContent>
        {!connected && <GameStatus message="Connecting to server..." />}
        {error && <GameStatus message={`Error: ${error}`} />}

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
          <GameLayout>
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <RoomBadge>Room ID: {roomId}</RoomBadge>
              <Button variant="ghost" size="sm" onClick={leaveRoom} soundManager={soundManager}>
                Leave Room
              </Button>
            </div>

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

            {inviteLink && myDisc === PLAYER1 && !players.find(p => p.disc === PLAYER2) && (
              <InviteSection>
                <SectionTitle>Invite a Friend</SectionTitle>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Input 
                    readOnly 
                    value={inviteLink} 
                    onFocus={(e) => e.target.select()}
                    style={{ flex: 1 }}
                  />
                  <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(inviteLink)}>
                    Copy
                  </Button>
                </div>
              </InviteSection>
            )}
          </GameLayout>
        )}
      </MainContent>



      {(gameState.winner || gameState.isDraw) && (
        <MatchResultOverlay 
          title={gameState.winner ? (gameState.winner === myDisc ? "VICTORY" : "DEFEAT") : "DRAW"}
          subtitle={gameState.winner ? `${nameByDisc[gameState.winner]} dominated the board!` : "A perfect stalemate."}
          variant={gameState.winner ? (gameState.winner === myDisc ? "win" : "default") : "draw"}
          onPrimaryAction={resetRoom}
          primaryActionLabel="Rematch"
          onSecondaryAction={() => navigate("/home")}
          soundManager={soundManager}
        />
      )}
    </PageWrapper>
  );
};

export default OnlineV2;
