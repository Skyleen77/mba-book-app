import type { Metadata } from 'next';

import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import Provider from './provider';

export const metadata: Metadata = {
  title: 'Book App',
  description: 'La meilleure application de prêt de livre.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
