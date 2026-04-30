/* eslint-disable no-unused-vars */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import socket from "../services/wsClient";

// Same emojis as your helper to keep rendering consistent
const PLAYER1 = "🔴";
const PLAYER2 = "🟡";
const EMPTY = "⚪";

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

const initialState = () => ({
  board: Array(6)
    .fill(null)
    .map(() => Array(7).fill(EMPTY)),
  currentPlayer: PLAYER1,
  winner: null,
  isDraw: false,
});

const useOnlineConnect4 = () => {
  const [connected, setConnected] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | lobby | searching | room | error
  const [error, setError] = useState(null);

  const [roomId, setRoomId] = useState(null);
  const [players, setPlayers] = useState([]); // [{id, name, disc}]
  const [myDisc, setMyDisc] = useState(null);
  const [gameState, setGameState] = useState(initialState);

  const playerIdRef = useRef(getOrCreatePlayerId());
  const nameRef = useRef(defaultName());

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
      if (!roomId) setStatus("lobby");
    };
    const onDisconnect = () => setConnected(false);
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
      setMyDisc(disc);
      setPlayers(ps);
      setGameState(state);
      setStatus("room");
    });

    socket.on("joined", ({ roomId: rid, disc, players: ps, state }) => {
      setRoomId(rid);
      setMyDisc(disc);
      setPlayers(ps);
      setGameState(state);
      setStatus("room");
    });

    socket.on("room_state", ({ players: ps, state }) => {
      if (ps) setPlayers(ps);
      if (state) setGameState(state);
    });

    socket.on("matched", ({ roomId: rid, disc }) => {
      // Server will also send room_state after it sets up; ensure we reflect matched state
      setRoomId(rid);
      setMyDisc(disc);
      setStatus("room");
    });

    socket.on("error_msg", ({ message }) => {
      setError(message || "Unknown error");
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
    setPlayers([]);
    setMyDisc(null);
    setGameState(initialState());
    setStatus("lobby");
  }, [connected, roomId]);

  const resetRoom = useCallback(() => {
    if (!connected || !roomId) return;
    socket.emit("reset_room", { roomId });
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
    makeMove,
  };
};

export default useOnlineConnect4;
