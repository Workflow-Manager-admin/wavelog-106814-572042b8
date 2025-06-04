import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import App from './App';

// Helper to clear sessionStorage before each test.
beforeEach(() => {
  window.sessionStorage.clear();
  jest.useFakeTimers();
});
afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe('SurfSync Reminder Popup', () => {
  test('1. Later button is always visible and accessible', async () => {
    render(<App />);
    // Fast-forward timer for popup to appear (prompt delay = 1800ms)
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    // Check for "Did you surf today?" and the 'Later' button
    expect(screen.getByText(/Did you surf today\?/i)).toBeInTheDocument();
    const laterButton = screen.getByRole('button', { name: /Later/i });
    expect(laterButton).toBeInTheDocument();
    expect(laterButton).toBeVisible();
    expect(laterButton).toHaveClass('btn-reminder-later');
  });

  test('2. Clicking Later dismisses the popup and sets sessionStorage', async () => {
    render(<App />);
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    const laterButton = screen.getByRole('button', { name: /Later/i });
    fireEvent.click(laterButton);
    // Popup should be gone
    expect(screen.queryByText(/Did you surf today\?/i)).toBeNull();
    // Session storage is set
    expect(window.sessionStorage.getItem('surfReminderDismissed')).toBe('1');
  });

  test('3. Popup does not reappear on navigation or view change (within session)', async () => {
    render(<App />);
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    // Dismiss with Later
    fireEvent.click(screen.getByRole('button', { name: /Later/i }));
    // Simulate navigation to dashboard (Stats)
    fireEvent.click(screen.getByRole('button', { name: /Stats Dashboard/i }));
    expect(screen.queryByText(/Did you surf today\?/i)).toBeNull();
    // Simulate going back home
    fireEvent.click(screen.getByText(/SurfSync/i));
    expect(screen.queryByText(/Did you surf today\?/i)).toBeNull();
  });

  test('4. Rest of the app remains accessible after popup dismissed', async () => {
    render(<App />);
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    // Dismiss the popup
    fireEvent.click(screen.getByRole('button', { name: /Later/i }));
    // The "+ Log New Session" button should still be clickable
    const logNewBtn = screen.getByRole('button', { name: /\+ Log New Session/i });
    expect(logNewBtn).toBeInTheDocument();
    fireEvent.click(logNewBtn);
    // After clicking, the log session form should appear
    expect(screen.getByText(/Log New Session/i)).toBeInTheDocument();
  });

  test('5. Popup comes back only after page reload if sessionStorage is cleared', async () => {
    // Dismiss the first time
    render(<App />);
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    fireEvent.click(screen.getByRole('button', { name: /Later/i }));
    // Unmount and remount simulates reload AND storage cleared
    window.sessionStorage.clear();
    render(<App />);
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    expect(screen.getByText(/Did you surf today\?/i)).toBeInTheDocument();
  });
});

