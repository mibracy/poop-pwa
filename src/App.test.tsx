import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders start! link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Start!/i);
  expect(linkElement).toBeInTheDocument();
});
