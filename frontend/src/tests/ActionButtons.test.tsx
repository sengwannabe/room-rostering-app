import React from "react";
import ActionButtons from "../components/ActionButtons";
import { BrowserRouter } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from 'vitest';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Action Buttons Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  })

  test('Renders approve page', async () => {
    render(
      <BrowserRouter>
        <ActionButtons isMobile={false} isManager={true} />
      </BrowserRouter>
    );
    // Edit button is rendered
    expect(screen.getByRole('button', {name: 'Edit'})).toBeInTheDocument();
    // Request Room button is rendered
    expect(screen.getByRole('button', {name: 'Request Room'})).toBeInTheDocument();
    // Approve button is rendered
    expect(screen.getByRole('button', {name: 'Approve'})).toBeInTheDocument();
  });

  test('Edit button is clickable', async () => {
    render(
      <BrowserRouter>
        <ActionButtons isMobile={false} isManager={true} />
      </BrowserRouter>
    );
    // Edit button is rendered
    const editButton = screen.getByRole('button', {name: 'Edit'})
    // Click on edit button
    await userEvent.click(editButton!);
    // Expect to navigate to edit roster page
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/edit-roster');
  });

  test('Request Room button is clickable', async () => {
    render(
      <BrowserRouter>
        <ActionButtons isMobile={false} isManager={true} />
      </BrowserRouter>
    );
    // Request Room button is rendered
    const requestRoomButton = screen.getByRole('button', {name: 'Request Room'})
    // Click on Request Room button
    await userEvent.click(requestRoomButton!);
    // Expect to navigate to request room page
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/request-room');
  });

  test('Approve button is clickable', async () => {
    render(
      <BrowserRouter>
        <ActionButtons isMobile={false} isManager={true} />
      </BrowserRouter>
    );
    // Approve button is rendered
    const approveButton = screen.getByRole('button', {name: 'Approve'})
    // Click on Approve button
    await userEvent.click(approveButton!);
    // Expect to navigate to approve roster page
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/approve');
  });
});