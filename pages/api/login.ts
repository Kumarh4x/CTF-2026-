import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { createSessionToken } from '../../lib/auth';

let dbInstance: Database | null = null;
let dbInitPromise: Promise<Database> | null = null;

async function getDb(): Promise<Database> {
  if (dbInstance) {
    return dbInstance;
  }
  if (!dbInitPromise) {
    dbInitPromise = (async () => {
      const db = await open({
        filename: ':memory:',
        driver: sqlite3.Database,
      });

      await db.exec(`
        CREATE TABLE IF NOT EXISTS employees (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          role TEXT NOT NULL
        );

        INSERT INTO employees (username, password, role) VALUES 
          ('admin', 'v@uLt_M@st3r_992!#xK', 'administrator'),
          ('j.doe', 'P@ssw0rd2024!', 'security_officer'),
          ('m.smith', 'Summer2023!#', 'engineer');
      `);

      dbInstance = db;
      return db;
    })();
  }
  return dbInitPromise;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { username, password } = req.body || {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const db = await getDb();

    // INTENTIONAL CTF VULNERABILITY: Raw unescaped SQL query
    // Vulnerable to authentication bypass: e.g. admin' -- or ' OR 1=1 --
    const query = `SELECT * FROM employees WHERE username = '${username}' AND password = '${password}'`;

    const user = await db.get(query);

    if (user) {
      const token = createSessionToken({
        id: user.id,
        username: user.username,
        role: user.role,
      });

      const cookieHeader = `session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=7200`;
      res.setHeader('Set-Cookie', cookieHeader);

      return res.status(200).json({
        success: true,
        message: 'Authentication successful',
        user: {
          username: user.username,
        },
      });
    } else {
      return res.status(401).json({ error: 'Authentication failed. Please check your credentials.' });
    }
  } catch (err: any) {
    console.error('SQL Execution Error:', err.message);
    return res.status(500).json({
      error: `Database query error: ${err.message}`,
    });
  }
}
