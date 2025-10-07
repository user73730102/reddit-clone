import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeSwitcher from '../src/app/components/ThemeSwitcher';
import { ThemeProvider } from 'next-themes';

// We mock the useTheme hook from next-themes
jest.mock('next-themes', () => ({
  ...jest.requireActual('next-themes'),
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

describe('ThemeSwitcher', () => {
  it('renders the moon icon when in light mode', () => {
    // Wrap the component in the ThemeProvider for context
    render(
      <ThemeProvider>
        <ThemeSwitcher />
      </ThemeProvider>
    );

    // Look for the button by its accessible name (aria-label)
    const button = screen.getByRole('button', { name: /toggle theme/i });
    
    // Assert that the button is in the document
    expect(button).toBeInTheDocument();
    
    // Since the SVG isn't easily queryable by text, we can check for its presence.
    // A more advanced test could check for the specific SVG path data.
    expect(button.querySelector('svg')).toBeInTheDocument();
  });
});