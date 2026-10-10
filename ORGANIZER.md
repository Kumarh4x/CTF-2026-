# BLACKVAULT - CTF Organizer Documentation

## 1. Challenge Description
BLACKVAULT is an internal corporate security portal designed as a beginner/intermediate web security challenge. Participants authenticate through an employee portal to access internal company documentation. The Security Vault contains sensitive CTF flag data and is guarded behind the internal authentication barrier, discoverable through an IDOR vulnerability on the document repository.

## 2. Intended Vulnerabilities

### Vulnerability 1: SQL Injection (Authentication Bypass)
- **Location**: `POST /api/login` (`pages/api/login.ts`)
- **Type**: Unparameterized SQL query execution against SQLite:
  ```sql
  SELECT * FROM employees WHERE username = '${username}' AND password = '${password}'
  ```
- **Exploitation**: An attacker injects SQL syntax into the username field (e.g. `admin' --` or `' OR 1=1 --`) to authenticate without knowing legitimate credentials.
- **Result**: Server issues a cryptographically signed HTTP-only `session` cookie.

### Vulnerability 2: Insecure Direct Object Reference (IDOR)
- **Location**: `/documents?id=<id>` (`pages/documents.tsx`)
- **Type**: Missing server-side authorization check on document ID.
- **Exploitation**: Authenticated employees see only documents 1, 2, and 3 (`/documents?id=1`, `/documents?id=2`, `/documents?id=3`). Document 4 (`Restricted Vault Access Memo`) is restricted and not listed on the portal. Changing the query parameter to `/documents?id=4` retrieves the restricted memo due to the missing access control check on document retrieval.
- **Result**: The memo reveals the clue allowing the participant to infer the internal security vault endpoint (`/vault`).

## 3. Intended Solve Path
1. **Portal Login**:
   - Navigate to `/login` (or visit `/`, which redirects to `/login`).
   - Submit SQL injection payload:
     - **Username**: `admin' --`
     - **Password**: `anything`
   - Server authenticates user as `admin` and redirects to `/dashboard`.
2. **Access Documents**:
   - From `/dashboard`, click **OPEN DOCUMENTS** to navigate to `/documents`.
   - Notice that public documents 1, 2, and 3 are displayed with visible URLs like `/documents?id=1`.
3. **IDOR Discovery & Exploitation**:
   - Change the URL parameter to `/documents?id=4`.
   - Server returns the restricted document: **Restricted Vault Access Memo**.
   - Read the notice clue:
     ```
     Internal Security Notice
     The Security Vault is not accessible through the normal employee portal.
     Access is available only through the organization's internal security vault.
     The interface follows the naming convention used for other internal services.
     Remember: when a resource is hidden, its name is often the first thing worth checking.
     ```
4. **Infer Vault Endpoint**:
   - Infer the endpoint `/vault` from the clue.
5. **Vault Access & Flag Retrieval**:
   - Navigate to `/vault`.
   - Because the session was already established via the SQL injection, the vault confirms `ACCESS GRANTED`.
   - A CTF completion victory overlay reveals `CTF SOLVED`, `FLAG CAPTURED`, and the flag:
     ```
     CTF{sql_injection_master}
     ```
   - Player can click **COPY FLAG** or **CONTINUE** to view the vault.

## 4. API & Route Structure
- `/` - Redirects to `/login`.
- `/login` - Employee security login portal (vulnerable to SQLi).
- `POST /api/login` - SQL injection login endpoint.
- `api/logout` - Session invalidation handler.
- `/dashboard` - Authenticated employee portal (links to `/documents`).
- `/documents` - Document list displaying public documents 1–3.
- `/documents?id=<id>` - Document viewer vulnerable to IDOR (ID 4 contains vault clue).
- `/vault` - Restricted vault (requires authenticated session; returns 403 when unauthenticated).

## 5. Database Structure
- SQLite in-memory instance initialized on startup.
- Table: `employees (id, username, password, role)`
- Seeded records:
  - `admin` (Role: `administrator`)
  - `j.doe` (Role: `security_officer`)
  - `m.smith` (Role: `engineer`)

## 6. Flag Configuration
- Defined in server-side environment variable `CTF_FLAG`.
- Default: `CTF{sql_injection_master}`
- Configured in `.env.local` for local development and `.env.example` for deployment.
