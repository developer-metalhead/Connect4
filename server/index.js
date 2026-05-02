/* eslint-disable no-console */
const http = require("http");
const express = require("express");
const { Server } = require("socket.io");
const cors = require("cors");
const {
  resetState, dropPiece, isValidMove, checkWin, isBoardFull, nextPlayer,
  PLAYER1, PLAYER2,
} = require("./connect4");

// In-memory rooms and queue
const rooms = new Map(); // roomId -> { players: [{id, name, disc, socketId}], state }
const queue = []; // array of { socketId, playerId, name }

const createCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
};

const app = express();
app.use(cors());
app.get("/", (_, res) => res.send("Connect4 Realtime Server OK"));
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const broadcastState = (roomId) => {
  const room = rooms.get(roomId);
  if (!room) return;
  io.to(roomId).emit("room_state", {
    players: room.players.map((p) => ({ id: p.id, name: p.name, disc: p.disc })),
    state: room.state,
  });
};

io.on("connection", (socket) => {
  let knownPlayerId = null;

  socket.on("hello", ({ playerId }) => {
    knownPlayerId = String(playerId || "");
  });

  socket.on("create_room", ({ name, playerId }) => {
    const pid = String(playerId || "");
    const roomId = createCode();
    const room = {
      players: [{ id: pid, name: String(name || "Guest"), disc: PLAYER1, socketId: socket.id }],
      state: resetState(),
    };
    rooms.set(roomId, room);
    socket.join(roomId);
    socket.emit("room_created", {
      roomId,
      disc: PLAYER1,
      players: room.players.map((p) => ({ id: p.id, name: p.name, disc: p.disc })),
      state: room.state,
    });
  });

  socket.on("join_room", ({ roomId, name, playerId }) => {
    const rid = String(roomId || "").toUpperCase();
    const pid = String(playerId || "");
    const room = rooms.get(rid);
    if (!room) return socket.emit("error_msg", { message: "Room not found" });

    if (room.players.find((p) => p.id === pid)) {
      // Rejoin same player
      const p = room.players.find((p) => p.id === pid);
      p.socketId = socket.id;
      socket.join(rid);
      socket.emit("joined", {
        roomId: rid,
        disc: p.disc,
        players: room.players.map((pp) => ({ id: pp.id, name: pp.name, disc: pp.disc })),
        state: room.state,
      });
      broadcastState(rid);
      return;
    }

    if (room.players.length >= 2) return socket.emit("error_msg", { message: "Room full" });

    const disc = room.players[0].disc === PLAYER1 ? PLAYER2 : PLAYER1;
    room.players.push({ id: pid, name: String(name || "Guest"), disc, socketId: socket.id });
    socket.join(rid);

    // Notify both
    room.players.forEach((p) => {
      const s = io.sockets.sockets.get(p.socketId);
      if (s) s.emit("joined", {
        roomId: rid,
        disc: p.disc,
        players: room.players.map((pp) => ({ id: pp.id, name: pp.name, disc: pp.disc })),
        state: room.state,
      });
    });
    broadcastState(rid);
  });

  socket.on("enqueue", ({ name, playerId }) => {
    const pid = String(playerId || "");
    // avoid duplicates
    if (!queue.find((q) => q.playerId === pid)) {
      queue.push({ socketId: socket.id, playerId: pid, name: String(name || "Guest") });
    }
    // Attempt match
    if (queue.length >= 2) {
      const a = queue.shift();
      const b = queue.shift();
      const roomId = createCode();
      const room = {
        players: [
          { id: a.playerId, name: a.name, disc: PLAYER1, socketId: a.socketId },
          { id: b.playerId, name: b.name, disc: PLAYER2, socketId: b.socketId },
        ],
        state: resetState(),
      };
      rooms.set(roomId, room);
      [a, b].forEach((x) => {
        const s = io.sockets.sockets.get(x.socketId);
        if (s) {
          s.join(roomId);
          s.emit("matched", { roomId, disc: room.players.find((p) => p.socketId === x.socketId).disc });
          s.emit("room_state", {
            players: room.players.map((p) => ({ id: p.id, name: p.name, disc: p.disc })),
            state: room.state,
          });
        }
      });
    }
  });

  socket.on("dequeue", ({ playerId }) => {
    const pid = String(playerId || "");
    const idx = queue.findIndex((q) => q.playerId === pid);
    if (idx >= 0) queue.splice(idx, 1);
  });

  socket.on("make_move", ({ roomId, col, playerId }) => {
    const rid = String(roomId || "").toUpperCase();
    const pid = String(playerId || "");
    const room = rooms.get(rid);
    if (!room) return;

    const me = room.players.find((p) => p.id === pid);
    if (!me) return;

    const state = room.state;
    if (state.winner || state.isDraw) return;
    if (me.disc !== state.currentPlayer) return;

    const c = Number(col);
    if (!Number.isInteger(c) || c < 0 || c > 6) return;
    if (!isValidMove(state.board, c)) return;

    const { newBoard, row } = dropPiece(state.board, c, me.disc);
    state.board = newBoard;

    if (checkWin(newBoard, row, c, me.disc)) {
      state.winner = me.disc;
    } else if (isBoardFull(newBoard)) {
      state.isDraw = true;
    } else {
      state.currentPlayer = nextPlayer(state.currentPlayer);
    }

    broadcastState(rid);
  });

  socket.on("reset_room", ({ roomId }) => {
    const rid = String(roomId || "").toUpperCase();
    const room = rooms.get(rid);
    if (!room) return;
    room.state = resetState();
    broadcastState(rid);
  });

  socket.on("leave_room", ({ roomId, playerId }) => {
    const rid = String(roomId || "").toUpperCase();
    const pid = String(playerId || "");
    const room = rooms.get(rid);
    if (!room) return;
    socket.leave(rid);
    room.players = room.players.filter((p) => p.id !== pid);
    // Optionally delete empty rooms
    if (room.players.length === 0) rooms.delete(rid);
    else broadcastState(rid);
  });

  socket.on("request_rematch", ({ roomId, playerId }) => {
    const rid = String(roomId || "").toUpperCase();
    const pid = String(playerId || "");
    const room = rooms.get(rid);
    if (!room) return;

    console.log(`🔄 Rematch requested by ${pid} in room ${rid}`);

    if (!room.rematch) {
      room.rematch = { requested: new Set(), timer: null };
    }

    room.rematch.requested.add(pid);
    
    // Broadcast who requested
    io.to(rid).emit("rematch_requested", { playerId: pid });

    // If first player to request, start timer
    if (room.rematch.requested.size === 1) {
      const expiresAt = Date.now() + 10000; // 10 second window
      console.log(`⏲️ Timer started for room ${rid}, expires at ${expiresAt}`);
      io.to(rid).emit("rematch_timer_started", { expiresAt });
      
      room.rematch.timer = setTimeout(() => {
        if (rooms.has(rid) && room.rematch && room.rematch.requested.size < 2) {
          console.log(`⏰ Rematch expired for room ${rid}`);
          io.to(rid).emit("rematch_expired");
          room.rematch = null;
        }
      }, 10000);
    }

    // If both players accepted, start new game
    if (room.rematch.requested.size >= 2) {
      console.log(`✅ Rematch accepted by both in room ${rid}. Resetting game...`);
      if (room.rematch.timer) clearTimeout(room.rematch.timer);
      room.rematch = null;
      room.state = resetState();
      io.to(rid).emit("rematch_accepted");
      broadcastState(rid);
    }
  });

  socket.on("decline_rematch", ({ roomId, playerId }) => {
    const rid = String(roomId || "").toUpperCase();
    const pid = String(playerId || "");
    const room = rooms.get(rid);
    if (!room) return;

    console.log(`❌ Rematch declined by ${pid} in room ${rid}`);

    if (room.rematch?.timer) clearTimeout(room.rematch.timer);
    room.rematch = null;
    io.to(rid).emit("rematch_declined", { playerId: pid });
  });

  socket.on("disconnect", () => {
    // Remove from queue if present
    const idx = queue.findIndex((q) => q.socketId === socket.id);
    if (idx >= 0) queue.splice(idx, 1);

    // Clear socketId from any room player; keep room for reconnection
    for (const [rid, room] of rooms.entries()) {
      const p = room.players.find((pp) => pp.socketId === socket.id);
      if (p) {
        p.socketId = ""; // mark offline
        // If someone disconnects, cancel any pending rematch
        if (room.rematch) {
          if (room.rematch.timer) clearTimeout(room.rematch.timer);
          room.rematch = null;
          io.to(rid).emit("rematch_declined", { playerId: p.id, reason: "disconnect" });
        }
        broadcastState(rid);
      }
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Realtime server on :${PORT}`));