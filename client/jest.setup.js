// This file is run before each test file.
import '@testing-library/jest-dom';

// --- START OF NEW CODE ---

// Mock window.matchMedia for Jest
// This is necessary for libraries like next-themes that use it.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// --- END OF NEW CODE ---