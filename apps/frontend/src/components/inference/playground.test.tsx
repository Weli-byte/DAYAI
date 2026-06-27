import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Playground } from './playground';

// Mock the wallet store
const mockWalletStore = {
  address: '0x1234567890123456789012345678901234567890',
  isConnected: true,
};

jest.mock('@/store/wallet.store', () => ({
  useWalletStore: () => mockWalletStore,
}));

// Mock the useRunInference hook
const mockMutateAsync = jest.fn();
const mockRunInferenceHook = {
  mutateAsync: mockMutateAsync,
  isPending: false,
  isError: false,
  error: null,
  data: null,
};

jest.mock('@/hooks/use-inference', () => ({
  useRunInference: () => mockRunInferenceHook,
}));

describe('Playground', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletStore.isConnected = true;
    mockWalletStore.address = '0x1234567890123456789012345678901234567890';
    mockRunInferenceHook.isPending = false;
    mockRunInferenceHook.isError = false;
    mockRunInferenceHook.data = null;
  });

  it('renders title and description', () => {
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    expect(screen.getByText('AI Playground')).toBeInTheDocument();
    expect(screen.getByText(/GPT-2/)).toBeInTheDocument();
  });

  it('shows wallet connection warning when disconnected', () => {
    mockWalletStore.isConnected = false;
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    expect(screen.getByText('Wallet Connection Required')).toBeInTheDocument();
  });

  it('renders prompt input and run button when wallet connected', () => {
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    expect(screen.getByLabelText('Prompt')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Run Model/i })).toBeInTheDocument();
  });

  it('disables run button when prompt is empty', () => {
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    const runBtn = screen.getByRole('button', { name: /Run Model/i });
    expect(runBtn).toBeDisabled();
  });

  it('submits prompt and calls runInference on submit', () => {
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    const textarea = screen.getByLabelText('Prompt');
    fireEvent.change(textarea, { target: { value: 'Translate hello to French' } });

    const runBtn = screen.getByRole('button', { name: /Run Model/i });
    expect(runBtn).not.toBeDisabled();

    const form = screen.getByRole('textbox').closest('form');
    fireEvent.submit(form!);

    expect(mockMutateAsync).toHaveBeenCalledWith({
      modelId: 'm1',
      prompt: 'Translate hello to French',
      maxTokens: 200,
      temperature: 0.7,
      walletAddress: mockWalletStore.address,
    });
  });

  it('shows loading state when inference is running', () => {
    mockRunInferenceHook.isPending = true;
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    expect(screen.getByText('Generating response...')).toBeInTheDocument();
  });

  it('shows result when data is returned', () => {
    mockRunInferenceHook.data = {
      id: 'log_1',
      output: 'Bonjour',
      modelId: 'm1',
      modelTitle: 'GPT-2',
      tokensUsed: 2,
      inferenceTimeMs: 120,
      status: 'COMPLETED' as const,
      createdAt: new Date().toISOString(),
    };
    render(<Playground modelId="m1" modelTitle="GPT-2" />);
    expect(screen.getByText('Generation result')).toBeInTheDocument();
    expect(screen.getByText('Bonjour')).toBeInTheDocument();
  });
});
