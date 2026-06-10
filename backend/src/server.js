require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const setupSockets = require('./sockets');

const PORT = process.env.PORT || 5000;
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const start = async () => {
  await connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ['GET', 'POST', 'PATCH'],
    },
  });

  app.locals.io = io;
  setupSockets(io);

  server.listen(PORT, () => {
    console.log(`GIIT Portal API running on port ${PORT}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
