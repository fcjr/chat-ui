import '@/styles/globals.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';

import { useEffect } from 'react';
import { ClerkProvider } from '@clerk/nextjs';
import type { AppProps } from 'next/app'
import { neobrutalism } from '@clerk/themes';
import Prism from 'prismjs';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Prism.highlightAll();
  });
  return (
    <ClerkProvider
      appearance={{
        baseTheme: neobrutalism
      }}
    >
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default App;
