import React from "react";
import Dashboard from "../components/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { vi } from 'vitest';

describe('Dashboard Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  }

  test('renders dashboard and buttons', () => {
    renderDashboard();

    expect(screen.getByText('Current Roster')).toBeInTheDocument();
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Request Room')).toBeInTheDocument();
  });

  test('renders week navigation controls', () => {
    renderDashboard();

    expect(screen.getByTestId('ArrowLeftIcon')).toBeInTheDocument();
    expect(screen.getByTestId('ArrowRightIcon')).toBeInTheDocument();
  });

  test('navigates weeks correctly', () => {
    renderDashboard();

    const previousButton = screen.getByTestId('ArrowLeftIcon');
    const nextButton = screen.getByTestId('ArrowRightIcon');
    const initialDate = screen.getAllByRole('heading', { level: 6 })[0]!.textContent;

    fireEvent.click(nextButton);
    // Check date is changed to a week later
    const nextWeekDate = screen.getAllByRole('heading', { level: 6 })[0]!.textContent;
    expect(nextWeekDate).not.toBe(initialDate);

    fireEvent.click(previousButton);
    // Check date returned to initial
    const previousWeekDate = screen.getAllByRole('heading', { level: 6 })[0]!.textContent;
    expect(previousWeekDate).toBe(initialDate);
  });
});