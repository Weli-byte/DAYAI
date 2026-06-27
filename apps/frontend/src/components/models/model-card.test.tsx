/**
 * ModelCard component — unit tests.
 * Uses React Testing Library in the Next.js app-router environment.
 *
 * Run: pnpm test (from apps/frontend)
 */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ModelCard } from './model-card';
import type { ModelDto } from '@/types/model';

// Minimal model fixture
const model: ModelDto = {
  id: 'model_test_1',
  title: 'Test ResNet',
  description: 'A test classification model.',
  framework: 'PYTORCH',
  status: 'PUBLISHED',
  license: 'MIT',
  owner: { id: 'user_1', username: 'alice' },
  category: { id: 'cat_1', name: 'Classification', slug: 'classification' },
  tags: [
    { id: 'tag_1', name: 'pytorch', slug: 'pytorch' },
    { id: 'tag_2', name: 'resnet', slug: 'resnet' },
  ],
  latestVersion: {
    id: 'v1',
    version: '1.0.0',
    changelog: 'Init',
    isLatest: true,
    createdAt: new Date().toISOString(),
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ModelCard', () => {
  it('renders the model title', () => {
    render(<ModelCard model={model} />);
    expect(screen.getByText('Test ResNet')).toBeInTheDocument();
  });

  it('renders the model description', () => {
    render(<ModelCard model={model} />);
    expect(screen.getByText(/A test classification model/)).toBeInTheDocument();
  });

  it('renders the framework badge', () => {
    render(<ModelCard model={model} />);
    expect(screen.getByText('PyTorch')).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    render(<ModelCard model={model} />);
    expect(screen.getByText('Classification')).toBeInTheDocument();
  });

  it('renders tag chips', () => {
    render(<ModelCard model={model} />);
    expect(screen.getByText('pytorch')).toBeInTheDocument();
    expect(screen.getByText('resnet')).toBeInTheDocument();
  });

  it('renders the version', () => {
    render(<ModelCard model={model} />);
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
  });

  it('links to the model detail page', () => {
    render(<ModelCard model={model} />);
    const link = screen.getByRole('link', { name: /Test ResNet/i });
    expect(link).toHaveAttribute('href', '/models/model_test_1');
  });

  it('shows overflow tag count when more than 4 tags', () => {
    const manyTags = Array.from({ length: 6 }, (_, i) => ({
      id: `t${i}`,
      name: `tag${i}`,
      slug: `tag${i}`,
    }));
    render(<ModelCard model={{ ...model, tags: manyTags }} />);
    expect(screen.getByText('+2')).toBeInTheDocument();
  });
});
