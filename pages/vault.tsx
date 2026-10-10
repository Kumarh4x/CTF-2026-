import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { verifySession, SessionUser } from '../lib/auth';
import Navbar from '../components/Navbar';
import FlagSuccessModal from '../components/FlagSuccessModal';

type Props = {
  authenticated: boolean;
  user?: SessionUser;
  flag?: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {
  const user = verifySession(context.req.headers.cookie);

  if (!user) {
    context.res.statusCode = 403;
    return {
      props: {
        authenticated: false,
      },
    };
  }

  const flag = process.env.CTF_FLAG || 'CTF{sql_injection_master}';

  return {
    props: {
      authenticated: true,
      user,
      flag,
    },
  };
};

export default function Vault({ authenticated, user, flag }: Props) {
  const [showModal, setShowModal] = useState<boolean>(authenticated && !!flag);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    if (!flag) return;
    try {
      await navigator.clipboard.writeText(flag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Unauthenticated 403 Access Denied View
  if (!authenticated || !flag) {
    return (
      <div className="min-h-screen bg-[#0b0f14] text-gray-200 flex flex-col items-center justify-center p-4">
        <Head>
          <title>403 Forbidden | BLACKVAULT</title>
        </Head>

        <div className="w-full max-w-md mx-auto border border-red-900/60 bg-[#11161d] rounded-xl shadow-2xl p-8 text-center space-y-4">
          <div className="text-4xl font-black font-mono text-red-500">
            403
          </div>

          <div>
            <h1 className="text-base font-bold text-white tracking-widest uppercase">
              ACCESS DENIED
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Active employee session required to access the vault.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-block w-full py-2.5 px-4 bg-[#161c24] hover:bg-[#202937] border border-gray-700 text-xs font-semibold text-gray-200 hover:text-white rounded-lg uppercase tracking-wider transition-colors text-center"
            >
              [ GO TO LOGIN ]
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Secure Vault View
  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200 flex flex-col">
      <Head>
        <title>Security Vault | BLACKVAULT</title>
      </Head>

      <Navbar />

      {/* CTF Victory Celebration Modal (overlay only) */}
      <FlagSuccessModal
        flag={flag}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg mx-auto border border-gray-800 bg-[#11161d] rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-emerald-400 uppercase">
              BLACKVAULT
            </span>
            <h1 className="text-xl font-bold tracking-wider text-white uppercase mt-1">
              SECURITY VAULT
            </h1>
            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono font-semibold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              ACCESS GRANTED
            </div>
          </div>

          <div className="border-t border-gray-800/80"></div>

          {/* Flag Display Box */}
          <div className="p-4 bg-[#161c24] border border-gray-800 rounded-lg space-y-3">
            <div className="text-xs font-mono font-semibold text-gray-400 uppercase tracking-wider text-center sm:text-left">
              CTF FLAG
            </div>

            <div className="p-3.5 bg-[#0c1017] border border-gray-800/80 rounded-md">
              <p className="text-emerald-400 font-mono text-sm sm:text-base font-bold tracking-wide select-all break-all text-center">
                {flag}
              </p>
            </div>

            <div>
              <button
                type="button"
                onClick={handleCopy}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-all cursor-pointer font-mono"
              >
                {copied ? '✓ COPIED' : 'COPY FLAG'}
              </button>
            </div>
          </div>

          <div className="border-t border-gray-800/80"></div>

          {/* Challenge Completed & Actions */}
          <div className="text-center space-y-4">
            <p className="text-xs text-gray-400">
              Challenge completed successfully.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
              <Link
                href="/dashboard"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#161c24] hover:bg-[#202937] border border-gray-700 hover:border-gray-600 text-xs font-semibold text-gray-300 hover:text-white rounded-lg uppercase tracking-wider transition-colors text-center"
              >
                RETURN TO DASHBOARD
              </Link>

              <a
                href="/api/logout"
                className="w-full sm:w-auto px-5 py-2.5 bg-[#161c24] hover:bg-red-950/40 border border-gray-700 hover:border-red-900 text-xs font-semibold text-gray-400 hover:text-red-300 rounded-lg uppercase tracking-wider transition-colors text-center"
              >
                LOG OUT
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
