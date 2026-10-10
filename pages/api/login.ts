import { NextApiRequest, NextApiResponse } from 'next';
import { createSessionToken } from '../../lib/auth';

interface Employee {
  id: number;
  username: string;
  password: string;
  role: string;
}

const SEED_EMPLOYEES: Employee[] = [
  { id: 1, username: 'admin', password: 'v@uLt_M@st3r_992!#xK', role: 'administrator' },
  { id: 2, username: 'j.doe', password: 'P@ssw0rd2024!', role: 'security_officer' },
  { id: 3, username: 'm.smith', password: 'Summer2023!#', role: 'engineer' },
];

let nativeDb: any = null;
let nativeDbInitAttempted = false;

async function getNativeDb() {
  if (nativeDbInitAttempted) return nativeDb;
  nativeDbInitAttempted = true;
  try {
    const sqlite3 = require('sqlite3');
    const { open } = require('sqlite');
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
    nativeDb = db;
    return db;
  } catch (err: any) {
    console.warn('Native SQLite unavailable in serverless environment, using embedded SQL engine:', err.message);
    return null;
  }
}

function evaluateSqliteQuery(rawQuery: string): Employee | null {
  let cleanQuery = rawQuery.trim();

  // Handle block comments /* ... */
  cleanQuery = cleanQuery.replace(/\/\*[\s\S]*?\*\//g, '');

  // Handle inline comments --
  const commentIdx = cleanQuery.indexOf('--');
  if (commentIdx !== -1) {
    cleanQuery = cleanQuery.substring(0, commentIdx).trim();
  }

  // Syntax check: unmatched quotes
  let quoteCount = 0;
  for (let i = 0; i < cleanQuery.length; i++) {
    if (cleanQuery[i] === "'") {
      if (i + 1 < cleanQuery.length && cleanQuery[i + 1] === "'") {
        i++;
      } else {
        quoteCount++;
      }
    }
  }

  if (quoteCount % 2 !== 0) {
    throw new Error('syntax error: unmatched quotation mark');
  }

  const whereMatch = cleanQuery.match(/WHERE\s+([\s\S]+)$/i);
  if (!whereMatch) {
    return SEED_EMPLOYEES[0] || null;
  }

  const whereClause = whereMatch[1].trim();

  for (const emp of SEED_EMPLOYEES) {
    if (evaluateWhere(whereClause, emp)) {
      return emp;
    }
  }

  return null;
}

function evaluateWhere(clause: string, emp: Employee): boolean {
  const orParts = splitByOperator(clause, 'OR');
  for (const orPart of orParts) {
    const andParts = splitByOperator(orPart, 'AND');
    const allAndTrue = andParts.every((andPart) => evaluateCondition(andPart.trim(), emp));
    if (allAndTrue) return true;
  }
  return false;
}

function splitByOperator(str: string, op: string): string[] {
  const parts: string[] = [];
  let current = '';
  let inQuote = false;
  const regex = new RegExp(`^\\s+${op}\\s+`, 'i');

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === "'") {
      inQuote = !inQuote;
      current += char;
    } else if (!inQuote) {
      const remaining = str.slice(i);
      const match = remaining.match(regex);
      if (match) {
        parts.push(current.trim());
        current = '';
        i += match[0].length - 1;
        continue;
      }
      current += char;
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    parts.push(current.trim());
  }
  return parts;
}

function evaluateCondition(cond: string, emp: Employee): boolean {
  const trimmed = cond.trim();
  if (!trimmed) return false;

  if (trimmed === '1' || trimmed === '1=1' || trimmed === "'1'='1'" || trimmed === "''=''") {
    return true;
  }
  if (trimmed === '0' || trimmed === '1=0' || trimmed === "'1'='0'") {
    return false;
  }

  const eqIdx = findTopLevelEqual(trimmed);
  if (eqIdx !== -1) {
    const leftRaw = trimmed.substring(0, eqIdx).trim();
    const rightRaw = trimmed.substring(eqIdx + 1).trim();

    const leftVal = resolveValue(leftRaw, emp);
    const rightVal = resolveValue(rightRaw, emp);

    return leftVal === rightVal;
  }

  return false;
}

function findTopLevelEqual(str: string): number {
  let inQuote = false;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "'") inQuote = !inQuote;
    else if (!inQuote && str[i] === '=') return i;
  }
  return -1;
}

function resolveValue(val: string, emp: Employee): any {
  if (val.toLowerCase() === 'username') return emp.username;
  if (val.toLowerCase() === 'password') return emp.password;
  if (val.toLowerCase() === 'role') return emp.role;
  if (val.toLowerCase() === 'id') return emp.id;

  if (val.startsWith("'") && val.endsWith("'")) {
    return val.slice(1, -1).replace(/''/g, "'");
  }

  if (!isNaN(Number(val))) {
    return Number(val);
  }

  return val;
}

async function executeQuery(query: string): Promise<Employee | null> {
  const db = await getNativeDb();
  if (db) {
    return await db.get(query);
  }
  return evaluateSqliteQuery(query);
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
    // INTENTIONAL CTF VULNERABILITY: Raw unescaped SQL query
    // Vulnerable to authentication bypass: e.g. admin' -- or ' OR 1=1 --
    const query = `SELECT * FROM employees WHERE username = '${username}' AND password = '${password}'`;

    const user = await executeQuery(query);

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
