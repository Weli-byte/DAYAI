import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { InferenceHistory } from './inference-history';

// Mock hook
const mockUseInferenceHistory = jest.fn();
jest.mock('@/hooks/use-inference', () => ({
  useInferenceHistory: (params: any) => mockUseInferenceHistory(params),
}));

describe('InferenceHistory', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading skeleton', () => {
    mockUseInferenceHistory.mockReturnValue({
      isLoading: true,
    });
    render(<InferenceHistory walletAddress="0x123" />);
    expect(screen.getByText('Recent Activity')).toBeInTheDocument();
  });

  it('renders empty state when no logs found', () => {
    mockUseInferenceHistory.mockReturnValue({
      isLoading: false,
      data: {
        items: [],
        total: 0,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    });
    render(<InferenceHistory walletAddress="0x123" />);
    expect(screen.getByText('No recent activity')).toBeInTheDocument();
  });

  it('renders history list with completed logs', () => {
    mockUseInferenceHistory.mockReturnValue({
      isLoading: false,
      data: {
        items: [
          {
            id: 'log_1',
            modelId: 'm1',
            modelTitle: 'GPT-2',
            prompt: 'Hello model',
            output: 'Hello human output',
            status: 'COMPLETED',
            tokensUsed: 10,
            inferenceTimeMs: 150,
            createdAt: new Date().toISOString(),
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    });
    render(<InferenceHistory walletAddress="0x123" />);
    expect(screen.getByText('Recent Activity (1)')).toBeInTheDocument();
    expect(screen.getByText('GPT-2')).toBeInTheDocument();
    expect(screen.getByText('"Hello model"')).toBeInTheDocument();
    expect(screen.getByText('Hello human output')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('150ms')).toBeInTheDocument();
  });

  it('renders failed status correctly', () => {
    mockUseInferenceHistory.mockReturnValue({
      isLoading: false,
      data: {
        items: [
          {
            id: 'log_2',
            modelId: 'm1',
            modelTitle: 'GPT-2',
            prompt: 'Hi',
            output: null,
            status: 'FAILED',
            tokensUsed: null,
            inferenceTimeMs: null,
            createdAt: new Date().toISOString(),
          },
        ],
        total: 1,
        page: 1,
        limit: 5,
        totalPages: 1,
      },
    });
    render(<InferenceHistory walletAddress="0x123" />);
    expect(screen.getByText('FAILED')).toBeInTheDocument();
    expect(screen.queryByText('Tokens:')).not.toBeInTheDocument();
  });
});
