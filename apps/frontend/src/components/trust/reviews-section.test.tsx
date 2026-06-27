import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReviewsSection } from './reviews-section';

// Mock the wallet store
const mockWalletStore = {
  address: '0x1234567890123456789012345678901234567890',
  isConnected: true,
};

jest.mock('@/store/wallet.store', () => ({
  useWalletStore: () => mockWalletStore,
}));

// Mock use-trust hooks
const mockCreateReviewMutate = jest.fn();
const mockRateModelMutate = jest.fn();
const mockDeleteReviewMutate = jest.fn();

const mockUseReviews = {
  data: {
    items: [
      {
        id: 'rev-1',
        modelId: 'm1',
        content: 'Excellent model, very fast inference!',
        user: {
          id: 'u1',
          username: 'ai_explorer',
          avatar: null,
          walletAddress: '0x1234567890123456789012345678901234567890',
        },
        createdAt: '2026-06-27T10:00:00Z',
        updatedAt: '2026-06-27T10:00:00Z',
      },
    ],
    total: 1,
    page: 1,
    limit: 5,
    totalPages: 1,
  },
  isLoading: false,
};

const mockUseRatingSummary = {
  data: {
    average: 4.5,
    count: 10,
  },
  isLoading: false,
};

const mockUseUserRating = {
  data: {
    value: 5,
  },
};

jest.mock('@/hooks/use-trust', () => ({
  useReviews: () => mockUseReviews,
  useCreateReview: () => ({
    mutateAsync: mockCreateReviewMutate,
    isPending: false,
  }),
  useUpdateReview: () => ({
    mutateAsync: jest.fn(),
    isPending: false,
  }),
  useDeleteReview: () => ({
    mutateAsync: mockDeleteReviewMutate,
    isPending: false,
  }),
  useRatingSummary: () => mockUseRatingSummary,
  useRateModel: () => ({
    mutateAsync: mockRateModelMutate,
    isPending: false,
  }),
  useUserRating: () => mockUseUserRating,
}));

describe('ReviewsSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockWalletStore.isConnected = true;
    mockWalletStore.address = '0x1234567890123456789012345678901234567890';
    mockUseReviews.isLoading = false;
    mockUseRatingSummary.isLoading = false;
  });

  it('renders ratings summary and average score', () => {
    render(<ReviewsSection modelId="m1" />);
    expect(screen.getByText('Average Rating')).toBeInTheDocument();
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Based on 10 reviews')).toBeInTheDocument();
  });

  it('shows wallet disconnected warning', () => {
    mockWalletStore.isConnected = false;
    render(<ReviewsSection modelId="m1" />);
    expect(screen.getByText('Wallet Connection Required')).toBeInTheDocument();
  });

  it('renders review textarea and publish button when connected', () => {
    render(<ReviewsSection modelId="m1" />);
    expect(screen.getByPlaceholderText(/Share your experience/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Publish Review/i })).toBeInTheDocument();
  });

  it('renders reviews list', () => {
    render(<ReviewsSection modelId="m1" />);
    expect(screen.getByText('Excellent model, very fast inference!')).toBeInTheDocument();
    expect(screen.getByText('ai_explorer')).toBeInTheDocument();
  });

  it('submits a review successfully', async () => {
    render(<ReviewsSection modelId="m1" />);
    const textarea = screen.getByPlaceholderText(/Share your experience/i);
    fireEvent.change(textarea, { target: { value: 'Great accuracy on JAX!' } });

    const publishBtn = screen.getByRole('button', { name: /Publish Review/i });
    fireEvent.click(publishBtn);

    expect(mockCreateReviewMutate).toHaveBeenCalledWith({
      modelId: 'm1',
      walletAddress: mockWalletStore.address,
      content: 'Great accuracy on JAX!',
    });
  });
});
