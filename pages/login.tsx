import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push('/dashboard');
      } else {
        setError(data.error || 'Authentication failed. Please check your credentials.');
      }
    } catch {
      setError('Connection failure. Please check your network and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-[#0b0f14] text-gray-200">
      <Head>
        <title>Login | BLACKVAULT</title>
      </Head>

      <div className="w-full max-w-md mx-auto border border-gray-800 bg-[#11161d] rounded-xl shadow-2xl p-7 sm:p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-xs text-gray-400 mb-3 font-mono">
            Your input speaks directly to the database. Can you make it reveal its <span className="text-cyan-400">secrets?</span> 🔍
          </p>
          <div className="inline-flex items-center space-x-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]"></span>
            <h1 className="text-xl font-bold tracking-widest text-white uppercase">
              BLACKVAULT
            </h1>
          </div>
          <p className="text-xs text-gray-400">
            Internal Security Portal
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-900/60 rounded-lg text-center">
            <p className="text-xs text-red-400 font-mono leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-xs font-medium text-gray-400 mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#161c24] border border-gray-700/80 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs transition-colors font-mono"
              autoComplete="off"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-gray-400 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#161c24] border border-gray-700/80 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs transition-colors font-mono"
              autoComplete="off"
              required
              disabled={loading}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-black font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors cursor-pointer font-mono active:scale-[0.99]"
            >
              {loading ? 'Authenticating...' : 'LOGIN'}
            </button>
          </div>
        </form>

        {/* Small Status Indicator */}
        <div className="pt-4 border-t border-gray-800/80 text-center">
          <span className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500/80"></span>
            <span>Secure connection</span>
          </span>
        </div>
      </div>
    </div>
  );
}
