import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const rawConnectionString = process.env.DATABASE_URL;

if (!rawConnectionString) {
  console.warn('[DB] Warning: DATABASE_URL environment variable is not defined.');
}

// Determine if SSL is required (e.g. cloud providers like Aiven or production)
const requiresSsl = Boolean(
  rawConnectionString &&
    (rawConnectionString.includes('sslmode=') ||
      rawConnectionString.includes('aivencloud.com') ||
      process.env.NODE_ENV === 'production')
);

// Strip sslmode from URL so pg-connection-string doesn't override rejectUnauthorized
const connectionString = rawConnectionString
  ? rawConnectionString.replace(/[?&]sslmode=[^&]+/, '')
  : undefined;

export const pool = new Pool({
  connectionString,
  ssl: requiresSsl ? { rejectUnauthorized: false } : false,
});

// Create tables if they do not exist
export const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        avatar_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        sender_name VARCHAR(100),
        channel VARCHAR(50) DEFAULT 'general',
        content TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel);
      CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
    `);
    console.log('[DB] Database tables initialized successfully (users, messages)');
  } catch (err) {
    console.error('[DB] Error initializing database tables:', err.message);
    throw err;
  } finally {
    client.release();
  }
};
