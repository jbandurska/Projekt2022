const setWebSocket = (server) => {
  const io = require("socket.io")(server, {
    cors: {
      origin: process.env.APP_URL,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("message", (message) => {
      socket.broadcast.to(socket.room).emit("message", message);
    });

    socket.on("dots", (isTyping) => {
      socket.broadcast.to(socket.room).emit("dots", isTyping);
    });

    socket.on("joinRoom", (newRoom, oldRoom) => {
      if (oldRoom) socket.leave(oldRoom);
      socket.join(newRoom);

      socket.room = newRoom;
    });
  });
};

module.exports = setWebSocket;
