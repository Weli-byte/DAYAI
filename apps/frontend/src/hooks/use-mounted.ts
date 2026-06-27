'use client';

import { useEffect, useState } from 'react';

// Prevents hydration mismatches by returning false on the server
// and true after the component mounts on the client.
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
