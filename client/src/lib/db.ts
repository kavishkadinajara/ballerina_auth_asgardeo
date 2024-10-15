// lib/db.ts
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,  // or the port where your PostgreSQL instance is running
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query = (text: string, params: any[]) => pool.query(text, params);
