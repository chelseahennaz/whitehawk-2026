import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from '../src/pages/Index';
import { expect, test } from 'vitest';

test('renders Index without crashing', () => {
  const queryClient = new QueryClient();
  const { container } = render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Index />
      </BrowserRouter>
    </QueryClientProvider>
  );
  expect(container).toBeTruthy();
});
