export interface DocumentItem {
  id: number;
  title: string;
  category: string;
  date: string;
  summary: string;
  content: string;
  isRestricted?: boolean;
}

export const documents: DocumentItem[] = [
  {
    id: 1,
    title: 'Employee Access Policy',
    category: 'INTERNAL',
    date: '2026-09-15',
    summary: 'Standard employee access rules, authorization tiers, and authentication requirements.',
    content: `BLACKVAULT EMPLOYEE ACCESS POLICY
REF: EMP-POL-04 | CLASSIFICATION: INTERNAL

1. GENERAL PROVISIONS
All personnel must adhere to security protocols when accessing the BlackVault internal portal. Access is governed strictly by the verified employee session.

2. ACCESS TIERS
Standard employee credentials grant access only to general compliance policies and operational manuals. Access to critical infrastructure requires heightened administrative roles.

3. CREDENTIAL INTEGRITY
Never share session tokens or portal authentication states with unauthorized individuals. Any anomalous behavior or unauthorized access attempts are logged.`,
    isRestricted: false,
  },
  {
    id: 2,
    title: 'Security Operations Guide',
    category: 'INTERNAL',
    date: '2026-10-01',
    summary: 'Operational directives regarding internal database and network integrity.',
    content: `BLACKVAULT SECURITY OPERATIONS GUIDE
REF: SEC-OP-01 | CLASSIFICATION: INTERNAL

1. RELATIONAL DATABASE MANAGEMENT
User authentication is managed via our local relational employee registry. All queries against the employee table are executed directly.

2. AUDITING AND LOGGING
Unhandled query syntax errors are flagged by the operational monitoring layer. Developers must ensure internal query logic remains isolated from external input.

3. WORKSTATION USAGE
Workstations must remain locked when unattended to avoid unauthorized access to active session cookies.`,
    isRestricted: false,
  },
  {
    id: 3,
    title: 'General Security Procedures',
    category: 'INTERNAL',
    date: '2026-08-20',
    summary: 'Procedures for incident escalation, workstation security, and physical badges.',
    content: `BLACKVAULT GENERAL SECURITY PROCEDURES
REF: GEN-SEC-09 | CLASSIFICATION: INTERNAL

1. PHYSICAL SECURITY
Badges must be worn at all times within BlackVault facilities. Tailgating into restricted server rooms is strictly forbidden.

2. DATA STORAGE
Confidential internal files must not be copied onto external storage media. Always access documentation through the designated portal interface.

3. INCIDENT REPORTING
Any suspected compromise of internal systems must be escalated to the security operations center immediately.`,
    isRestricted: false,
  },
  {
    id: 4,
    title: 'Restricted Vault Access Memo',
    category: 'HIGHLY RESTRICTED',
    date: '2026-10-05',
    summary: 'Confidential security notice regarding vault authorization protocol.',
    content: `Internal Security Notice

The Security Vault is not accessible through the normal employee portal.

Access is available only through the organization's internal security vault.

The interface follows the naming convention used for other internal services.

Remember: when a resource is hidden, its name is often the first thing worth checking.`,
    isRestricted: true,
  },
];

// Returns only public documents (Documents 1–3)
export function getPublicDocuments(): DocumentItem[] {
  return documents.filter((doc) => !doc.isRestricted);
}

// INTENTIONAL IDOR VULNERABILITY:
// This function retrieves any document by ID without verifying if the user has authorization
// to view restricted documents (e.g., Document 4).
export function getDocumentById(id: number): DocumentItem | null {
  return documents.find((doc) => doc.id === id) || null;
}
