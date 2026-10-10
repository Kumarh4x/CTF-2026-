import { useState } from 'react';

type Props = {
  flag: string;
  isOpen: boolean;
  onClose: () => void;
};

const CONFETTI_PIECES = [
  { left: '8%', delay: '0s', duration: '2.2s', color: '#10b981', rotate: '15deg', width: '8px', height: '14px' },
  { left: '15%', delay: '0.12s', duration: '2.4s', color: '#06b6d4', rotate: '-25deg', width: '10px', height: '10px' },
  { left: '22%', delay: '0.05s', duration: '2.1s', color: '#a855f7', rotate: '45deg', width: '7px', height: '12px' },
  { left: '30%', delay: '0.2s', duration: '2.5s', color: '#3b82f6', rotate: '-15deg', width: '9px', height: '13px' },
  { left: '38%', delay: '0.02s', duration: '2.3s', color: '#f59e0b', rotate: '60deg', width: '8px', height: '10px' },
  { left: '46%', delay: '0.15s', duration: '2.2s', color: '#10b981', rotate: '-40deg', width: '11px', height: '8px' },
  { left: '54%', delay: '0.08s', duration: '2.4s', color: '#06b6d4', rotate: '30deg', width: '7px', height: '14px' },
  { left: '62%', delay: '0.25s', duration: '2.0s', color: '#ec4899', rotate: '-50deg', width: '9px', height: '11px' },
  { left: '70%', delay: '0.1s', duration: '2.3s', color: '#8b5cf6', rotate: '20deg', width: '8px', height: '12px' },
  { left: '78%', delay: '0.18s', duration: '2.5s', color: '#3b82f6', rotate: '-35deg', width: '10px', height: '9px' },
  { left: '86%', delay: '0.04s', duration: '2.1s', color: '#10b981', rotate: '55deg', width: '8px', height: '13px' },
  { left: '93%', delay: '0.22s', duration: '2.4s', color: '#06b6d4', rotate: '-20deg', width: '9px', height: '10px' },
  { left: '12%', delay: '0.35s', duration: '2.3s', color: '#8b5cf6', rotate: '35deg', width: '8px', height: '11px' },
  { left: '26%', delay: '0.4s', duration: '2.2s', color: '#10b981', rotate: '-15deg', width: '9px', height: '13px' },
  { left: '42%', delay: '0.45s', duration: '2.4s', color: '#06b6d4', rotate: '70deg', width: '7px', height: '10px' },
  { left: '58%', delay: '0.38s', duration: '2.1s', color: '#f59e0b', rotate: '-30deg', width: '10px', height: '8px' },
  { left: '74%', delay: '0.48s', duration: '2.5s', color: '#3b82f6', rotate: '40deg', width: '8px', height: '12px' },
  { left: '88%', delay: '0.32s', duration: '2.3s', color: '#a855f7', rotate: '-45deg', width: '9px', height: '11px' },
];

export default function FlagSuccessModal({ flag, isOpen, onClose }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(flag);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ctf-congratulations-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden"
    >
      {/* Confetti Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
        {CONFETTI_PIECES.map((piece, i) => (
          <div
            key={i}
            className="confetti-particle"
            style={{
              left: piece.left,
              backgroundColor: piece.color,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              width: piece.width,
              height: piece.height,
              transform: `rotate(${piece.rotate})`,
            }}
          />
        ))}
      </div>

      {/* Vibrant Ambient Glow behind modal */}
      <div
        className="absolute w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-emerald-500/25 via-cyan-500/25 to-purple-600/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Modal Dialog Card Container */}
      <div className="relative z-20 w-full max-w-lg p-[2px] rounded-2xl bg-gradient-to-r from-emerald-500 via-cyan-500 via-blue-500 to-purple-600 animate-gradient-border shadow-[0_0_50px_rgba(16,185,129,0.35),0_0_90px_rgba(6,182,212,0.2)] animate-modal-pop">
        <div className="bg-[#0e131b] rounded-[14px] p-6 sm:p-8 text-center space-y-6 relative overflow-hidden">
          {/* Header */}
          <div className="space-y-2">
            <h1
              id="ctf-congratulations-title"
              className="text-2xl sm:text-3xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-purple-400 drop-shadow-sm"
            >
              🎉 CONGRATULATIONS!
            </h1>

            <div className="pt-1">
              <span className="inline-block px-3.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-xs sm:text-sm font-mono font-bold text-emerald-400 tracking-wider">
                CTF CHALLENGE SOLVED
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-300 pt-1 font-medium leading-relaxed">
              You successfully infiltrated <span className="text-emerald-400 font-semibold">BLACKVAULT</span> and captured the flag!
            </p>
          </div>

          {/* Flag Reveal Box */}
          <div className="space-y-2">
            <div className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>FLAG CAPTURED</span>
            </div>

            <div className="p-4 bg-[#080c12] border-2 border-emerald-500/60 rounded-xl animate-flag-glow shadow-inner">
              <p className="text-emerald-300 font-mono text-sm sm:text-base font-bold tracking-wide select-all break-all text-center">
                {flag}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={handleCopy}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
            >
              {copied ? '✓ COPIED' : 'COPY FLAG'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-1/2 py-2.5 px-4 rounded-lg bg-[#161f2c] hover:bg-[#1e2a3c] border border-gray-700 hover:border-cyan-500/50 text-gray-200 hover:text-white font-mono font-bold text-xs uppercase tracking-wider active:scale-[0.98] transition-all cursor-pointer"
            >
              CONTINUE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
