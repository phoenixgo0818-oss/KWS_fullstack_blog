/** Smoke test — App mounts and shows the site title. */
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders site title', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /KWS Phoenix Blog/i })).toBeInTheDocument();
});
