import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import { pool, initDb } from './db.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(
  cors({
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  })
);
app.use(express.json());

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Database health check endpoint
app.get('/api/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as current_time, current_database() as database');
    res.json({
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0].current_time,
      db_name: result.rows[0].database,
    });
  } catch (err) {
    console.error('[DB] Health check query failed:', err.message);
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      message: 'Failed to connect to database',
    });
  }
});

// GET /api/messages - Returns recent messages ordered from oldest to newest
app.get('/api/messages', async (req, res) => {
  try {
    const channel = req.query.channel || 'general';
    const result = await pool.query(
      `SELECT id, sender_name, channel, content, created_at 
       FROM messages 
       WHERE channel = $1 
       ORDER BY created_at ASC 
       LIMIT 100`,
      [channel]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('[DB] Error fetching messages:', err.message);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Socket.IO configuration
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log(`[Socket.IO] Client connected: ${socket.id}`);

  // Automatically join default 'general' room
  socket.join('general');
  console.log(`[Socket.IO] Client ${socket.id} joined room: general`);

  // Allow explicit join_room event
  socket.on('join_room', (room) => {
    const targetRoom = room || 'general';
    socket.join(targetRoom);
    console.log(`[Socket.IO] Client ${socket.id} explicitly joined room: ${targetRoom}`);
  });

  // Handle send_message event
  socket.on('send_message', async (data, callback) => {
    try {
      const content = typeof data === 'string' ? data.trim() : data?.content?.trim();
      const username = data?.username?.trim() || 'Anonymous';
      const channel = data?.channel || 'general';

      // Validate message content is not empty
      if (!content) {
        if (typeof callback === 'function') {
          callback({ error: 'Message cannot be empty' });
        }
        return;
      }

      // Save to PostgreSQL messages table
      const insertQuery = `
        INSERT INTO messages (sender_name, channel, content, created_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING id, sender_name, channel, content, created_at;
      `;
      const result = await pool.query(insertQuery, [username, channel, content]);
      const savedMessage = result.rows[0];

      // Broadcast saved message to all clients in the room
      io.to(channel).emit('new_message', savedMessage);

      if (typeof callback === 'function') {
        callback({ status: 'ok', message: savedMessage });
      }
    } catch (err) {
      console.error('[Socket.IO] Error processing send_message:', err.message);
      if (typeof callback === 'function') {
        callback({ error: 'Failed to send message' });
      }
    }
  });

  // Clean disconnect handling
  socket.on('disconnect', (reason) => {
    console.log(`[Socket.IO] Client disconnected: ${socket.id} (reason: ${reason})`);
  });
});

// Start HTTP server and initialize DB tables
server.listen(PORT, async () => {
  console.log(`[Server] ChatFlow backend running on port ${PORT}`);
  console.log(`[Server] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[Server] DB Health check: http://localhost:${PORT}/api/health/db`);
  console.log(`[Server] Messages endpoint: http://localhost:${PORT}/api/messages`);

  try {
    await initDb();
  } catch (err) {
    console.error('[DB] Initialization skipped or failed on startup:', err.message);
  }
});
