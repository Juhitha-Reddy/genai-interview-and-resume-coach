import React from 'react';
import { render } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const heading = screen.getByText(/Resume & Interview Coach/i);
  expect(heading).toBeInTheDocument();
});
