import Head from 'next/head';
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { verifySession, SessionUser } from '../lib/auth';
import Navbar from '../components/Navbar';

type Props = {
  user: SessionUser;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const user = verifySession(context.req.headers.cookie);

  if (!user) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {
      user,
    },
  };
};

export default function Dashboard({ user }: Props) {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200 flex flex-col">
      <Head>
        <title>Dashboard | BLACKVAULT</title>
      </Head>

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <div className="w-full max-w-lg mx-auto border border-gray-800 bg-[#11161d] rounded-xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">
              BLACKVAULT
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Internal Employee Portal
            </p>
          </div>

          <div className="border-t border-gray-800/80"></div>

          {/* User info & Security status */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#161c24] p-4 rounded-lg border border-gray-800">
            <div>
              <p className="text-xs text-gray-400">Welcome,</p>
              <p className="text-base font-semibold text-white font-mono">{user.username}</p>
            </div>
            <div className="sm:text-right">
              <p className="text-[11px] text-gray-400">Security Status</p>
              <p className="text-xs font-mono font-semibold text-emerald-400">
                ● AUTHENTICATED
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800/80"></div>

          {/* Internal Documents Section */}
          <div className="p-4 bg-[#161c24] border border-gray-800 rounded-lg space-y-3">
            <h2 className="text-sm font-semibold text-white">
              Internal Documents
            </h2>
            <p className="text-xs text-gray-400 leading-relaxed">
              Access internal company documents and security records.
            </p>
            <div className="pt-1">
              <Link
                href="/documents"
                className="inline-block w-full text-center py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-all"
              >
                OPEN DOCUMENTS
              </Link>
            </div>
          </div>

          <div className="border-t border-gray-800/80"></div>

          {/* Recent Activity Section */}
          <div>
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2.5">
              Recent Activity
            </h3>
            <div className="space-y-2 text-xs font-mono text-gray-400 bg-[#0c1017] p-3.5 rounded-lg border border-gray-800/60">
              <div className="flex justify-between">
                <span className="text-gray-500">Last authentication:</span>
                <span className="text-gray-300">Active session verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">System status:</span>
                <span className="text-emerald-400">All systems online</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Session status:</span>
                <span className="text-gray-300">Encrypted token active</span>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800/80"></div>

          {/* Log out */}
          <div className="text-center pt-1">
            <a
              href="/api/logout"
              className="inline-block px-4 py-2 bg-[#161c24] hover:bg-red-950/40 border border-gray-700 hover:border-red-900 text-xs font-semibold text-gray-400 hover:text-red-300 rounded-lg uppercase tracking-wider transition-colors"
            >
              LOG OUT
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
