'use client';

import { useEffect } from 'react';
import { useWalletStore } from '@/store/wallet.store';

/** Mounts once in the layout to restore wallet state and register event listeners. */
export function WalletInitializer() {
  const init = useWalletStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return null;
}
