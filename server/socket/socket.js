const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { allowedOrigins } = require("../config/cors");

let io;
// userId -> Set of socket ids (one user can have many tabs open)
const onlineUsers = new Map();

const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, credentials: true },
  });

  // Reject sockets that don't carry a valid JWT
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("No token"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;

    if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
    onlineUsers.get(userId).add(socket.id);
    socket.join(userId); // personal room, so we can emit to a user by id

    io.emit("onlineUsers", [...onlineUsers.keys()]);

    socket.on("disconnect", () => {
      const sockets = onlineUsers.get(userId);
      if (sockets) {
        sockets.delete(socket.id);
        if (sockets.size === 0) onlineUsers.delete(userId);
      }
      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });
  });

  return io;
};

// Send an event to every socket of one user
const emitToUser = (userId, event, data) => {
  if (io) io.to(userId.toString()).emit(event, data);
};

module.exports = { initSocket, emitToUser };
