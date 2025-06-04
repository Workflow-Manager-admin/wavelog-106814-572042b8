/**
 * Jest test setup.
 * - Provides custom matchers from jest-dom.
 * - Add global mocks or extend expect as needed for accessibility and storage.
 */
import '@testing-library/jest-dom';

// If ReminderModal uses sessionStorage, provide a global sessionStorage mock for tests.
beforeAll(() => {
  // Only polyfill if not present (jsdom should supply it).
  if (!window.sessionStorage) {
    let store = {};
    window.sessionStorage = {
      getItem: key => store[key] ?? null,
      setItem: (key, value) => { store[key] = value; },
      removeItem: key => { delete store[key]; },
      clear: () => { store = {}; }
    };
  }
});
