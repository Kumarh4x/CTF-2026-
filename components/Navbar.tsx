import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Navbar() {
  const router = useRouter();

  const isActive = (path: string) => router.pathname === path;

  return (
    <header className="w-full border-b border-gray-800/80 bg-[#0e1319]/90 backdrop-blur sticky top-0 z-30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center space-x-2.5 group">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]"></span>
          <span className="text-sm font-bold tracking-widest text-white group-hover:text-emerald-400 transition-colors">
            BLACKVAULT
          </span>
        </Link>

        <nav className="flex items-center space-x-5 text-xs font-medium">
          <Link
            href="/dashboard"
            className={`transition-colors ${
              isActive('/dashboard')
                ? 'text-emerald-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Dashboard
          </Link>
          <span className="text-gray-700">|</span>
          <Link
            href="/documents"
            className={`transition-colors ${
              isActive('/documents')
                ? 'text-emerald-400 font-semibold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Documents
          </Link>
          <span className="text-gray-700">|</span>
          <a
            href="/api/logout"
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            Logout
          </a>
        </nav>
      </div>
    </header>
  );
}
