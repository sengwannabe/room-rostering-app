import React from 'react';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import EditPage from '../components/EditPage';
import { vi } from 'vitest';
import sampleUser from '../mocks/testData/usersTest.json';
import { getUserData, saveUserData } from '../utils/storage';
import { submitUnavailability } from '../api/room';

vi.mock('../utils/storage', () => ({
  getUserData: vi.fn(),
  saveUserData: vi.fn()
}));

vi.mock('../api/room', () => ({
  submitUnavailability: vi.fn()
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const expectedUser = sampleUser[1]!;

describe('EditPage component', () => {
  beforeEach(() => {
    // Set up mock date for test consistency
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-11-11'));

    // Set up getUserData mock to return expectedUser
    vi.mocked(getUserData).mockReturnValue(expectedUser);
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  const renderEditPage = () => {
    return render(
      <BrowserRouter>
        <EditPage />
      </BrowserRouter>
    );
  };

  test('renders edit page with title', () => {
    renderEditPage();
    expect(screen.getByText('Edit Future Unavailability')).toBeInTheDocument();
  });

  test('displays all weekdays', () => {
    renderEditPage();
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    weekdays.forEach(day => {
      expect(screen.getByText(new RegExp(day))).toBeInTheDocument();
    });
  });

  test('renders edit page with initial unavailabilities from user data', () => {
    renderEditPage();
    // Tuesday and Thursday should be available based on mock user data.
    const availableButtons = screen.getAllByTestId('availability-button');
    expect(availableButtons[0]).toHaveTextContent('Unavailable');
    expect(availableButtons[1]).toHaveTextContent('Available');
    expect(availableButtons[2]).toHaveTextContent('Unavailable');
    expect(availableButtons[3]).toHaveTextContent('Available');
    expect(availableButtons[4]).toHaveTextContent('Unavailable');
  });

  test('allows selecting and deselecting dates', () => {
    renderEditPage();
    const availableButtons = screen.getAllByTestId('availability-button');
    const testButton = availableButtons[1];
    // Clicking button for Tuesday should turn from available to unavailable
    if (testButton) {
      expect(testButton).toHaveTextContent('Available');
      fireEvent.click(testButton);
      expect(testButton).toHaveTextContent('Unavailable');
    } else {
      throw new Error('Test button not found');
    }
  });

  test('submit button saves updated unavailability data', async () => {
      renderEditPage();

      // Change Tuesday's availability
      const availableButtons = screen.getAllByTestId('availability-button');
      fireEvent.click(availableButtons[1]!);

      // Submit the changes
      const submitButton = screen.getByText('Submit');
      await fireEvent.click(submitButton);

      // Expected new unavailability state
      const expectedUnavailability = {
        Monday: true,
          Tuesday: true,
          Wednesday: true,
          Thursday: false,
          Friday: true
      };

      // Verify the API call and local storage update
      expect(submitUnavailability).toHaveBeenCalled();
      expect(saveUserData).toHaveBeenCalledWith({
          ...expectedUser,
          unavailability: expectedUnavailability
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('cancel button preserves original unavailability data', () => {
    renderEditPage();

    // Change Tuesday from Available to Unavailable
    const availableButtons = screen.getAllByTestId('availability-button');
    fireEvent.click(availableButtons[1]!);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Verify no data saved and navigation
    expect(saveUserData).not.toHaveBeenCalled();
    expect(submitUnavailability).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});