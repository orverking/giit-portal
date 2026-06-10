const setupSockets = (io) => {
  io.on('connection', (socket) => {
    socket.on('register-user', (userId) => {
      if (userId) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on('join-conversation', (conversationKey) => {
      if (conversationKey) socket.join(`conversation:${conversationKey}`);
    });

    socket.on('typing', ({ conversationKey, user }) => {
      socket.to(`conversation:${conversationKey}`).emit('typing', { conversationKey, user });
    });

    socket.on('stop-typing', ({ conversationKey }) => {
      socket.to(`conversation:${conversationKey}`).emit('stop-typing', { conversationKey });
    });
  });
};

module.exports = setupSockets;
