/* eslint-disable no-unused-vars */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import socket from "../../services/wsClient";
import { 
  PLAYER1, 
  PLAYER2, 
  EMPTY, 
  resetGame as initialState,
  ROWS,
  COLS,
  checkWin
} from "../../helperFunction/helperFunction";

// Simple local UUID for anonymous players
const getOrCreatePlayerId = () => {
  // Per-tab identity so opening a new tab acts as a new player.
  const k = "c4_player_id_session";
  let v = sessionStorage.getItem(k);
  if (!v) {
    v =
      Math.random().toString(36).slice(2, 10) +
      Date.now().toString(36).slice(-4);
    sessionStorage.setItem(k, v);
  }
  return v;
};

const defaultName = () => {
  const k = "c4_display_name";
  const existing = sessionStorage.getItem(k);
  if (existing) return existing;
  const name = `Guest${Math.floor(1000 + Math.random() * 9000)}`;
  sessionStorage.setItem(k, name);
  return name;
};

const useOnlineConnect4 = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | lobby | searching | room | error
  const [error, setError] = useState(null);

  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]); // [{id, name, disc}]
  const [myDisc, setMyDisc] = useState(null);
  const [gameState, setGameState] = useState(initialState);
  const [rematchState, setRematchState] = useState({
    requestedBy: [],
    expiresAt: null,
    isAccepted: false,
    isDeclined: false,
    isExpired: false,
    declineReason: null
  });

  const playerIdRef = useRef(getOrCreatePlayerId());
  const nameRef = useRef(defaultName());
  const roomIdRef = useRef(null);
  const myDiscRef = useRef(null);
  const playersRef = useRef([]);

  // Clear rematch state helper
  const resetRematchState = useCallback(() => {
    setRematchState({
      requestedBy: [],
      expiresAt: null,
      isAccepted: false,
      isDeclined: false,
      isExpired: false,
      declineReason: null
    });
  }, []);

  // Derived flags
  const myTurn = useMemo(
    () =>
      !!myDisc &&
      !gameState.winner &&
      !gameState.isDraw &&
      myDisc === gameState.currentPlayer,
    [myDisc, gameState],
  );

  // Public API: allow UI to set name
  const setDisplayName = useCallback((n) => {
    const name = (n || "").trim().slice(0, 24) || defaultName();
    nameRef.current = name;
    sessionStorage.setItem("c4_display_name", name);
  }, []);

  // Socket lifecycle
  useEffect(() => {
    const pId = playerIdRef.current;

    const onConnect = () => {
      setConnected(true);
      setError(null);
      socket.emit("hello", { playerId: pId });
      
      // Auto-rejoin if we were in a room
      if (roomIdRef.current) {
        socket.emit("join_room", { 
          roomId: roomIdRef.current, 
          name: nameRef.current, 
          playerId: pId 
        });
      } else if (status === "idle" || status === "error") {
        setStatus("lobby");
      }
    };
    const onDisconnect = () => {
      setConnected(false);
      // We don't clear roomId here to allow for auto-rejoin on next connect
    };
    const onConnectError = (e) => {
      setConnected(false);
      setError(e?.message || "Connection error");
      setStatus("error");
    };

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("connect_error", onConnectError);

    // Room events
    socket.on("room_created", ({ roomId: rid, disc, players: ps, state }) => {
      setRoomId(rid);
      roomIdRef.current = rid;
      setMyDisc(disc);
      myDiscRef.current = disc;
      setPlayers(ps);
      playersRef.current = ps;
      setGameState(state);
      setStatus("room");
      resetRematchState();
    });

    socket.on("joined", ({ roomId: rid, disc, players: ps, state }) => {
      setRoomId(rid);
      roomIdRef.current = rid;
      setMyDisc(disc);
      myDiscRef.current = disc;
      setPlayers(ps);
      playersRef.current = ps;
      setGameState(state);
      setStatus("room");
      resetRematchState();
    });

    socket.on("room_state", ({ players: ps, state }) => {
      console.log("📡 Room state update received:", { 
        playerCount: ps?.length, 
        hasWinner: !!state?.winner, 
        isNatural: !!state?.winningLine 
      });

      if (ps) {
        // Only trigger forfeit if game was NOT already finished
        const wasInMatch = playersRef.current.length === 2 && ps.length === 1;
        const gameAlreadyFinished = gameState.winner || state?.winner;
        
        if (wasInMatch && !gameAlreadyFinished) {
          console.log("🏳️ Match interrupted: Opponent left during play. Awarding forfeit.");
          setGameState(prev => ({
            ...prev,
            winner: myDiscRef.current || ps[0]?.disc || PLAYER2,
            winningLine: null
          }));
        }
        setPlayers(ps);
        playersRef.current = ps;
      }
      if (state) {
        setGameState(prev => {
          // Sticky logic: Only protect the winner overlay if the opponent is STILL missing (forfeit)
          // If both players are present (ps.length === 2), allow the game to reset/clear.
          const isForfeit = prev.winner && !prev.winningLine;
          const stillAlone = ps?.length === 1;
          
          if (isForfeit && stillAlone && !state.winner) {
             console.log("🛡️ Protecting forfeit winner state from server reset.");
             return { ...state, winner: prev.winner, winningLine: prev.winningLine };
          }

          // If server says there's a winner but didn't send the line, calculate it locally
          if (state.winner && !state.winningLine && state.board) {
            for (let r = 0; r < ROWS; r++) {
              for (let c = 0; c < COLS; c++) {
                if (state.board[r][c] === state.winner) {
                  const line = checkWin(state.board, r, c, state.winner);
                  if (line) {
                    state.winningLine = line;
                    break;
                  }
                }
              }
              if (state.winningLine) break;
            }
          }
          return state;
        });
      }
    });

    socket.on("matched", ({ roomId: rid, disc }) => {
      console.log("🤝 Matched in room:", rid);
      setRoomId(rid);
      roomIdRef.current = rid;
      setMyDisc(disc);
      myDiscRef.current = disc;
      setStatus("room");
      resetRematchState();
    });

    socket.on("player_left", ({ playerId: leftId, name: leftName }) => {
      console.log(`👤 Opponent left: ${leftName} (${leftId}). Checking for forfeit...`);
      
      let wasInMatch = false;
      setPlayers(prev => {
        if (prev.length >= 2) wasInMatch = true;
        const next = prev.filter(p => p.id !== leftId);
        playersRef.current = next;
        return next;
      });
      
      // Force result overlay if they left during a match
      setGameState(prev => {
        if (prev.winner || prev.isDraw) return prev;
        
        const myDiscLocal = myDiscRef.current;
        console.log("🏳️ Match active. Awarding win to local player:", myDiscLocal);
        
        return {
          ...prev,
          winner: myDiscLocal || (playersRef.current?.[0]?.disc) || PLAYER2,
          winningLine: null // Forfeit signal
        };
      });
    });

    socket.on("surrendered", ({ playerId: surrenderingId, winnerDisc }) => {
      console.log("🏁 Surrender event received:", { surrenderingId, winnerDisc });
      setGameState(prev => {
        if (prev.winner) return prev;
        
        // If server didn't provide winnerDisc, calculate it from surrenderingId
        let finalWinner = winnerDisc;
        if (!finalWinner && surrenderingId) {
          const surrenderingPlayer = playersRef.current?.find(p => p.id === surrenderingId);
          if (surrenderingPlayer) {
            finalWinner = surrenderingPlayer.disc === PLAYER1 ? PLAYER2 : PLAYER1;
          }
        }

        // Fallback: if we still don't have a winner but we received the event, 
        // assume the person who didn't surrender (us) won, if the surrenderingId isn't us.
        if (!finalWinner && surrenderingId !== playerIdRef.current) {
          finalWinner = myDiscRef.current;
        }

        return {
          ...prev,
          winner: finalWinner || prev.winner,
          winningLine: null
        };
      });
    });

    socket.on("rematch_requested", ({ playerId: rid_pid }) => {
      console.log(`🔄 Rematch requested by ${rid_pid}`);
      setRematchState(prev => ({
        ...prev,
        requestedBy: [...new Set([...prev.requestedBy, rid_pid])]
      }));
    });

    socket.on("rematch_timer_started", ({ expiresAt }) => {
      console.log(`⏲️ Rematch timer started, expires at: ${expiresAt}`);
      setRematchState(prev => ({ ...prev, expiresAt }));
    });

    socket.on("rematch_accepted", () => {
      console.log("✅ Rematch accepted by both! Preparing new game...");
      resetRematchState();
      // Clear game winner immediately so overlay disappears
      setGameState(prev => ({ ...prev, winner: null, isDraw: false, winningLine: null }));
    });

    socket.on("rematch_declined", ({ playerId: d_pid, reason }) => {
      console.log(`❌ Rematch declined by ${d_pid}, reason: ${reason || "none"}`);
      setRematchState(prev => ({ 
        ...prev, 
        isDeclined: true, 
        declineReason: reason || (d_pid !== playerIdRef.current ? "Opponent declined" : null)
      }));
    });

    socket.on("rematch_expired", () => {
      console.log("⏰ Rematch request expired.");
      setRematchState({
        requestedBy: [],
        expiresAt: null,
        isAccepted: false,
        isDeclined: false,
        isExpired: true,
        declineReason: "Time expired"
      });
    });

    socket.on("error_msg", ({ message }) => {
      setError(message || "Unknown error");
      // If room not found on rejoin, clear local room state
      if (message?.toLowerCase().includes("not found")) {
        setRoomId(null);
        roomIdRef.current = null;
        setStatus("lobby");
      }
    });

    // Connect now
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("connect_error", onConnectError);
      socket.off("room_created");
      socket.off("joined");
      socket.off("room_state");
      socket.off("matched");
      socket.off("error_msg");
      // Do not disconnect automatically to allow back/forward navigation reuse
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Public actions
  const createRoom = useCallback(() => {
    // optimistic UI; server will confirm with room_created
    setStatus("room");

    const emitCreate = () =>
      socket.emit("create_room", {
        name: nameRef.current,
        playerId: playerIdRef.current,
      });

    if (socket.connected) {
      emitCreate();
    } else {
      // Ensure we connect and then create the room once ready
      socket.once("connect", emitCreate);
      socket.connect();
    }
  }, []);

  const joinRoomByCode = useCallback((code) => {
    const roomCode = (code || "").trim().toUpperCase();
    if (!roomCode) return;
    const emitJoin = () =>
      socket.emit("join_room", {
        roomId: roomCode,
        name: nameRef.current,
        playerId: playerIdRef.current,
      });
    if (socket.connected) {
      emitJoin();
    } else {
      socket.once("connect", emitJoin);
      socket.connect();
    }
  }, []);

  const startQueue = useCallback(() => {
    setStatus("searching");
    const emitEnqueue = () =>
      socket.emit("enqueue", {
        name: nameRef.current,
        playerId: playerIdRef.current,
      });
    if (socket.connected) {
      emitEnqueue();
    } else {
      socket.once("connect", emitEnqueue);
      socket.connect();
    }
  }, []);

  const stopQueue = useCallback(() => {
    if (!connected) return;
    socket.emit("dequeue", { playerId: playerIdRef.current });
    setStatus("lobby");
  }, [connected]);

  const leaveRoom = useCallback(() => {
    if (!connected || !roomId) return;
    socket.emit("leave_room", { roomId, playerId: playerIdRef.current });
    setRoomId(null);
    roomIdRef.current = null;
    setPlayers([]);
    setMyDisc(null);
    setGameState(initialState());
    setStatus("lobby");
    resetRematchState();
  }, [connected, roomId, resetRematchState]);

  const resetRoom = useCallback(() => {
    if (!connected || !roomId) return;
    socket.emit("reset_room", { roomId });
  }, [connected, roomId]);

  const surrender = useCallback(() => {
    if (!connected || !roomId) return;
    console.log("🏳️ Surrendering (via leave_room) for room:", roomId);
    
    // Emit leave_room so the server notifies the opponent via 'player_left'
    socket.emit("leave_room", { roomId, playerId: playerIdRef.current });
    
    // Local update for the player who clicked "Quit" to show the FORFEIT overlay
    setGameState(prev => {
      if (prev.winner) return prev;
      const myDiscLocal = myDiscRef.current;
      const opponentDisc = myDiscLocal === PLAYER1 ? PLAYER2 : PLAYER1;
      return {
        ...prev,
        winner: opponentDisc,
        winningLine: null
      };
    });

    // We DON'T call setRoomId(null) here yet, because we want the UI 
    // to stay in the room view to show the result overlay.
    // The full cleanup happens when they click "Main Menu" in OnlineV2.
  }, [connected, roomId]);

  const makeMove = useCallback(
    (col) => {
      if (!roomId || !myTurn) return;
      const emitMove = () =>
        socket.emit("make_move", {
          roomId,
          col,
          playerId: playerIdRef.current,
        });
      if (socket.connected) {
        emitMove();
      } else {
        socket.once("connect", emitMove);
        socket.connect();
      }
    },
    [roomId, myTurn],
  );

  return {
    // connection/state
    connected,
    status,
    error,
    roomId,
    playerId: playerIdRef.current,
    players,
    gameState,
    myDisc,
    myTurn,

    // actions
    setDisplayName,
    createRoom,
    joinRoomByCode,
    startQueue,
    stopQueue,
    leaveRoom,
    resetRoom,
    surrender,
    makeMove,

    // rematch
    rematchState,
    requestRematch: () => {
      if (!roomId) return;
      console.log("📤 Sending rematch request for room:", roomId);
      socket.emit("request_rematch", { roomId, playerId: playerIdRef.current });
    },
    declineRematch: () => {
      if (!roomId) return;
      console.log("📤 Sending rematch decline for room:", roomId);
      socket.emit("decline_rematch", { roomId, playerId: playerIdRef.current });
    }
  };
};

export default useOnlineConnect4;
