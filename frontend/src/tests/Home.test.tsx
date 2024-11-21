import React from "react";
import Home from '../components/Home';
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from 'vitest';
import sampleUser from '../mocks/testData/usersTest.json';

// Mocked users created in mocks/usersTest.json
// John Johnson has working days = 1 since only Wednesday is made available
const expectedUser1 = sampleUser[0]!;
// McLovin has working days = 2 since only Tuesday and Thursday is made available
const expectedUser2 = sampleUser[1]!;

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Home Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  })

  test('Renders Home page', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    // Title is rendered
    expect(screen.getByText('Laboratory Portal')).toBeInTheDocument();
    // Subtitle is rendered
    expect(screen.getByText('Select your name to continue')).toBeInTheDocument();
    await waitFor(() => {
      // John Johnson to be rendered from mock data
      expect(screen.getByText(expectedUser1.name)).toBeInTheDocument();
      // McLoving to be rendered from mock data
      expect(screen.getByText(expectedUser2.name)).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Both users' Manager status to be rendered
    expect(screen.getAllByText('Manager').length).toStrictEqual(2);
    // Bottom tag to be rendered
    expect(screen.getByText('© 2024 Laboratory Management System')).toBeInTheDocument();
  });

  test('Pressing on user navigates', async () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );
    let user: HTMLElement | null = null;
    await waitFor(() => {
      // Only John Johnson to be rendered from mock data
      user = screen.getByText(expectedUser1.name)!;
      expect(user).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Click on user
    await userEvent.click(user!);
    // Expect navigate to be called when clicked
    expect(mockNavigate).toHaveBeenCalled();
  });
});