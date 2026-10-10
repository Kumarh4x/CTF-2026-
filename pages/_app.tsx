import '../styles/globals.css';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-300 font-sans flex flex-col">
      <Component {...pageProps} />
    </div>
  );
}
