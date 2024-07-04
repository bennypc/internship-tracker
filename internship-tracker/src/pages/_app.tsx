import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider } from '../../authContext'; // Adjust the import path as necessary

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
