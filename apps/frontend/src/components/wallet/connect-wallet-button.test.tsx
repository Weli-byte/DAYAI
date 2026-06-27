import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectWalletButton } from './connect-wallet-button';
import { useWalletStore } from '@/store/wallet.store';

// Mock the store
jest.mock('@/store/wallet.store');
// Mock wallet lib
jest.mock('@/lib/wallet', () => ({
  isMetaMaskInstalled: jest.fn().mockReturnValue(true),
  connectWallet: jest.fn(),
  getConnectedAccounts: jest.fn().mockResolvedValue([]),
  onAccountsChanged: jest.fn().mockReturnValue(() => {}),
  onChainChanged: jest.fn().mockReturnValue(() => {}),
}));
// Mock sonner
jest.mock('sonner', () => ({ toast: { success: jest.fn(), error: jest.fn(), info: jest.fn() } }));

const mockStore = useWalletStore as unknown as jest.Mock;

describe('ConnectWalletButton', () => {
  const baseState = {
    address: null,
    isConnected: false,
    isConnecting: false,
    connect: jest.fn(),
    disconnect: jest.fn(),
    error: null,
  };

  it('shows "Connect Wallet" when not connected', () => {
    mockStore.mockReturnValue(baseState);
    render(<ConnectWalletButton />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows spinner while connecting', () => {
    mockStore.mockReturnValue({ ...baseState, isConnecting: true });
    render(<ConnectWalletButton />);
    expect(screen.getByText('Connecting…')).toBeInTheDocument();
  });

  it('shows shortened address when connected', () => {
    mockStore.mockReturnValue({
      ...baseState,
      address: '0xabcdef1234567890abcdef1234567890abcdef12',
      isConnected: true,
    });
    render(<ConnectWalletButton />);
    expect(screen.getByText(/0xabcd/)).toBeInTheDocument();
  });

  it('calls connect on button click', () => {
    const connect = jest.fn().mockResolvedValue(undefined);
    mockStore.mockReturnValue({ ...baseState, connect });
    render(<ConnectWalletButton />);
    fireEvent.click(screen.getByText('Connect Wallet'));
    expect(connect).toHaveBeenCalled();
  });
});
