// MetaMask / EIP-1193 wallet utilities — no external wallet library required.
// Supports MetaMask (window.ethereum) and any EIP-1193 compatible provider.

export const MONAD_TESTNET = {
  chainId: '0x279F', // 10143 in hex
  chainName: 'Monad Testnet',
  nativeCurrency: { name: 'MON', symbol: 'MON', decimals: 18 },
  rpcUrls: ['https://10143.rpc.thirdweb.com'],
  blockExplorerUrls: ['https://monad-testnet.socialscan.io'],
};

interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener: (event: string, handler: (...args: unknown[]) => void) => void;
  isMetaMask?: boolean;
}

function getProvider(): EthereumProvider | null {
  if (typeof window === 'undefined') return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).ethereum as EthereumProvider | null;
}

export function isMetaMaskInstalled(): boolean {
  const p = getProvider();
  return p !== null && !!p.isMetaMask;
}

/** Request wallet connection. Returns the connected address. */
export async function connectWallet(): Promise<string> {
  const provider = getProvider();
  if (!provider) throw new Error('MetaMask is not installed. Please install MetaMask to continue.');

  const accounts = (await provider.request({ method: 'eth_requestAccounts' })) as string[];
  if (!accounts.length) throw new Error('No accounts found. Please unlock MetaMask.');

  // Switch/add Monad Testnet
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: MONAD_TESTNET.chainId }],
    });
  } catch (switchErr: unknown) {
    // 4902 = chain not added yet
    const code = (switchErr as { code?: number }).code;
    if (code === 4902) {
      await provider.request({
        method: 'wallet_addEthereumChain',
        params: [MONAD_TESTNET],
      });
    } else {
      throw switchErr;
    }
  }

  return accounts[0];
}

/** Get already-connected accounts (no popup). */
export async function getConnectedAccounts(): Promise<string[]> {
  const provider = getProvider();
  if (!provider) return [];
  try {
    return (await provider.request({ method: 'eth_accounts' })) as string[];
  } catch {
    return [];
  }
}

/** Sign an arbitrary message with the connected wallet. */
export async function signMessage(address: string, message: string): Promise<string> {
  const provider = getProvider();
  if (!provider) throw new Error('No wallet connected.');

  const hex = `0x${Buffer.from(message, 'utf-8').toString('hex')}`;
  const sig = await provider.request({
    method: 'personal_sign',
    params: [hex, address],
  });
  return sig as string;
}

/** Subscribe to account changes. Returns an unsubscribe function. */
export function onAccountsChanged(handler: (accounts: string[]) => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const wrapped = (...args: unknown[]) => handler(args[0] as string[]);
  provider.on('accountsChanged', wrapped);
  return () => provider.removeListener('accountsChanged', wrapped);
}

/** Subscribe to chain changes. Returns an unsubscribe function. */
export function onChainChanged(handler: (chainId: string) => void): () => void {
  const provider = getProvider();
  if (!provider) return () => {};

  const wrapped = (...args: unknown[]) => handler(args[0] as string);
  provider.on('chainChanged', wrapped);
  return () => provider.removeListener('chainChanged', wrapped);
}
