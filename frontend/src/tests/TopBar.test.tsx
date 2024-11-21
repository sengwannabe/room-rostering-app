import { describe, expect, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TopBar from '../components/TopBar';
import * as React from 'react';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('TopBar Component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderMemoryRouter = (route: string) => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <TopBar />
      </MemoryRouter>
    );
  };

  test('renders on home page', () => {
    renderMemoryRouter('/');
    
    const title = screen.queryByText('Laboratory Management');
    expect(title).not.toBeInTheDocument();
  });

  test('renders title and tabs on dashboard page', () => {
    renderMemoryRouter('/dashboard');
    
    expect(screen.getByText('Laboratory Management')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Timetable')).toBeInTheDocument();
  });

  test('navigates to home when clicking title', () => {
    renderMemoryRouter('/dashboard');
    
    fireEvent.click(screen.getByText('Laboratory Management'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('navigates to dashboard when clicking dashboard tab', () => {
    renderMemoryRouter('/dashboard/timetable');
    
    fireEvent.click(screen.getByText('Dashboard'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('navigates to timetable when clicking timetable tab', () => {
    renderMemoryRouter('/dashboard');
    
    fireEvent.click(screen.getByText('Timetable'));
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/timetable');
  });

  test('highlights the correct tab based on current route', () => {
    renderMemoryRouter('/dashboard/timetable');
    
    const timetableTab = screen.getByRole('tab', { name: 'Timetable' });
    expect(timetableTab).toHaveAttribute('aria-selected', 'true');
  });
});