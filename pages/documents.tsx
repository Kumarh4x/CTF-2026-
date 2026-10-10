import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { verifySession, SessionUser } from '../lib/auth';
import { getPublicDocuments, getDocumentById, DocumentItem } from '../lib/documents';
import Navbar from '../components/Navbar';

type Props = {
  user: SessionUser;
  isDocumentView: boolean;
  documents?: {
    id: number;
    title: string;
    category: string;
    date: string;
    summary: string;
  }[];
  selectedDocument?: DocumentItem | null;
  documentId?: number;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = verifySession(context.req.headers.cookie);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const { id } = context.query;

  // Single document view (/documents?id=<id>)
  if (id !== undefined) {
    const rawId = Array.isArray(id) ? id[0] : id;
    const docId = parseInt(rawId, 10);

    // INTENTIONAL IDOR VULNERABILITY:
    // Missing authorization check!
    // The server retrieves document ID 4 (Restricted Vault Access Memo)
    // without verifying clearance.
    const doc = !isNaN(docId) ? getDocumentById(docId) : null;

    return {
      props: {
        user,
        isDocumentView: true,
        selectedDocument: doc ? { ...doc } : null,
        documentId: !isNaN(docId) ? docId : 0,
      },
    };
  }

  // Normal documents view: only documents 1-3 are public
  const publicDocs = getPublicDocuments().map(({ id, title, category, date, summary }) => ({
    id,
    title,
    category,
    date,
    summary,
  }));

  return {
    props: {
      user,
      isDocumentView: false,
      documents: publicDocs,
    },
  };
};

export default function Documents({
  user,
  isDocumentView,
  documents: docList,
  selectedDocument,
  documentId,
}: Props) {
  const isRestricted = selectedDocument && selectedDocument.id === 4;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200 flex flex-col">
      <Head>
        <title>
          {isDocumentView && selectedDocument
            ? `${selectedDocument.title} | BLACKVAULT`
            : 'Internal Documents | BLACKVAULT'}
        </title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        {/* Single Document View */}
        {isDocumentView ? (
          <div className="w-full max-w-xl mx-auto">
            {selectedDocument ? (
              isRestricted ? (
                /* Restricted Document (ID 4) - Subtle Warning Accent */
                <div className="border border-amber-500/40 bg-[#13110d] rounded-xl shadow-2xl p-6 sm:p-8 space-y-5">
                  <div className="flex items-center justify-between border-b border-amber-500/20 pb-4">
                    <div>
                      <span className="text-[11px] font-mono font-bold text-amber-400 tracking-wider uppercase">
                        RESTRICTED DOCUMENT
                      </span>
                      <p className="text-xs font-mono text-gray-400 mt-1">
                        Security Classification:{' '}
                        <span className="text-amber-300 font-semibold">HIGHLY RESTRICTED</span>
                      </p>
                      <h1 className="text-base sm:text-lg font-bold text-white mt-1">
                        Document: {selectedDocument.title}
                      </h1>
                    </div>
                  </div>

                  {/* Document Clue Body */}
                  <div className="p-4 bg-[#0a0907] border border-amber-500/20 rounded-lg">
                    <p className="text-xs sm:text-sm font-mono text-amber-100/90 whitespace-pre-line leading-relaxed">
                      {selectedDocument.content}
                    </p>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/documents"
                      className="inline-block px-5 py-2.5 rounded-lg bg-[#1c1813] hover:bg-[#252019] border border-amber-500/30 text-amber-400 hover:text-amber-300 font-mono text-xs font-semibold tracking-wider transition-colors"
                    >
                      [ BACK TO DOCUMENTS ]
                    </Link>
                  </div>
                </div>
              ) : (
                /* Normal Document View (IDs 1, 2, 3) */
                <div className="border border-gray-800 bg-[#11161d] rounded-xl shadow-2xl p-6 sm:p-8 space-y-5">
                  <div className="border-b border-gray-800 pb-4">
                    <span className="text-xs font-mono font-bold text-emerald-400 tracking-wider">
                      {`DOCUMENT 0${selectedDocument.id}`}
                    </span>
                    <h1 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      {selectedDocument.title}
                    </h1>
                    <p className="text-xs font-mono text-gray-400 mt-1">
                      Classification: <span className="text-gray-300">INTERNAL</span>
                    </p>
                  </div>

                  <div className="p-4 bg-[#0c1017] border border-gray-800/80 rounded-lg">
                    <p className="text-xs sm:text-sm font-mono text-gray-300 whitespace-pre-line leading-relaxed">
                      {selectedDocument.content}
                    </p>
                  </div>

                  <div className="pt-2 text-center">
                    <Link
                      href="/documents"
                      className="inline-block px-5 py-2.5 rounded-lg bg-[#161c24] hover:bg-[#1e2530] border border-gray-700 text-gray-300 hover:text-white font-mono text-xs font-semibold tracking-wider transition-colors"
                    >
                      [ BACK TO DOCUMENTS ]
                    </Link>
                  </div>
                </div>
              )
            ) : (
              /* Document Not Found */
              <div className="border border-gray-800 bg-[#11161d] rounded-xl p-8 text-center space-y-4">
                <p className="text-sm font-bold text-red-400 font-mono">
                  Document Not Found
                </p>
                <p className="text-xs text-gray-400 font-mono">
                  No internal document was found with ID #{documentId}.
                </p>
                <div>
                  <Link
                    href="/documents"
                    className="inline-block px-4 py-2 bg-[#161c24] border border-gray-700 text-xs font-mono text-gray-300 rounded-lg hover:text-white"
                  >
                    [ BACK TO DOCUMENTS ]
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Normal Documents List View */
          <div className="w-full max-w-xl mx-auto border border-gray-800 bg-[#11161d] rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
            {/* Header */}
            <div className="text-center">
              <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
                BLACKVAULT
              </span>
              <h1 className="text-xl font-bold tracking-wider text-white uppercase mt-1">
                INTERNAL DOCUMENTS
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                Authorized internal employee documents.
              </p>
            </div>

            <div className="border-t border-gray-800/80"></div>

            {/* Document Cards */}
            <div className="space-y-4">
              {docList &&
                docList.map((doc, idx) => (
                  <div
                    key={doc.id}
                    className="p-4 bg-[#161c24] border border-gray-800 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[11px] font-mono font-semibold text-emerald-400 block">
                        {`DOCUMENT 0${idx + 1}`}
                      </span>
                      <h2 className="text-sm font-semibold text-white mt-0.5">
                        {doc.title}
                      </h2>
                    </div>

                    <div>
                      <Link
                        href={`/documents?id=${doc.id}`}
                        className="inline-block w-full sm:w-auto text-center px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-all"
                      >
                        [ OPEN ]
                      </Link>
                    </div>
                  </div>
                ))}
            </div>

            <div className="border-t border-gray-800/80"></div>

            <div className="text-center">
              <Link
                href="/dashboard"
                className="text-xs font-medium text-gray-400 hover:text-gray-200 transition-colors"
              >
                ← Return to Dashboard
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
