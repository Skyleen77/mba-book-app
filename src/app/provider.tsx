'use client';

import { ToastContainer } from 'react-toastify';
import { SessionProvider } from 'next-auth/react';

const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider>
      {children}
      <ToastContainer />
    </SessionProvider>
  );
};

export default Provider;
