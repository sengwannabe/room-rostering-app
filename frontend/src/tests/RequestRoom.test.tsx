import React from "react";
import RequestRoom from "../components/RequestRoom";
import { BrowserRouter } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { getUserData } from "../utils/storage";
import sampleUser from '../mocks/testData/usersTest.json';

// Mocked user created in mocks/usersTest.json
const expectedUser = sampleUser[0]!;
const expectedInput = {
  capacity: '20'
}

// Mock getUserData function
vi.mock('../utils/storage', () => ({
  getUserData: vi.fn()
}));

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Request Room Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
    // Set up getUserData mock to return expectedUser
    vi.mocked(getUserData).mockReturnValue(expectedUser);
  });

  test('Renders request room page', () => {
    render(
      <BrowserRouter>
        <RequestRoom />
      </BrowserRouter>
    );
    // Title is rendered
    expect(screen.getByRole('heading', {name: 'Request Room'})).toBeInTheDocument();
    // Capacity input is rendered
    expect(screen.getByRole('textbox', {name: 'Room Capacity'})).toBeInTheDocument();
    // Add equipment button is rendered
    expect(screen.getByRole('button', {name: 'Add Equipment'})).toBeInTheDocument();
    // Chemical checkbox is rendered
    expect(screen.getByRole('checkbox', {name: 'Requires Access to Chemicals'})).toBeInTheDocument();
    // Cancel button is rendered
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    // Submit button is rendered
    expect(screen.getByRole('button', {name: 'Submit Request'})).toBeInTheDocument();
  });

  test('Expect user capacity input to be stored', async () => {
    render(
      <BrowserRouter>
        <RequestRoom />
      </BrowserRouter>
    );
    const capacityInput = screen.getByRole('textbox', {name: 'Room Capacity'});
    expect(capacityInput).toBeInTheDocument();
    // Input is initially empty
    expect(capacityInput).toHaveValue('');
    await userEvent.type(capacityInput, expectedInput.capacity);
    // Input when typed in value should have value of 20 from expected input
    expect(capacityInput).toHaveValue('20');
  });

  test('Expect submit button to be pressable and submits when capacity is entered', async () => {
    render(
      <BrowserRouter>
        <RequestRoom />
      </BrowserRouter>
    );
    // Submit button is rendered and disabled
    const submitButton = screen.getByRole('button', {name: 'Submit Request'});
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('disabled');
    // Capacity input is rendered
    const capacityInput = screen.getByRole('textbox', {name: 'Room Capacity'});
    expect(capacityInput).toBeInTheDocument();
    // Input is initially empty
    expect(capacityInput).toHaveValue('');
    await userEvent.type(capacityInput, expectedInput.capacity);
    // Input when typed in value should have value of 20 from expected input
    expect(capacityInput).toHaveValue('20');
    // Submit button pressable
    expect(submitButton).not.toHaveAttribute('disabled');
    // Submit room request
    await userEvent.click(submitButton);
    // Submission correctly navigates to dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  test('Expect add equipment button to be clickable', async () => {
    render(
      <BrowserRouter>
        <RequestRoom />
      </BrowserRouter>
    );
    const equipmentButton = screen.getByRole('button', {name: 'Add Equipment'});
    expect(equipmentButton).toBeInTheDocument();
    // Click add equipment button
    await userEvent.click(equipmentButton);
    // Ensure modal for equipment addition pops up
    // Equipment drop list is rendered
    const equipmentList = screen.getByRole('combobox', {name: 'Equipment'});
    expect(equipmentList).toBeInTheDocument();
    expect(equipmentList).toHaveAttribute('aria-autocomplete', 'list');
    // Quantity spinbutton is rendered
    expect(screen.getByRole('spinbutton', {name: 'Quantity'})).toBeInTheDocument();
    // Cancel button is rendered
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
    // Add button is rendered and disabled
    const addButton = screen.getByRole('button', {name: 'Add'});
    expect(addButton).toBeInTheDocument();
    expect(addButton).toHaveProperty('disabled');
  });

  test('Expect chemical access to be checked', async () => {
    render(
      <BrowserRouter>
        <RequestRoom />
      </BrowserRouter>
    );
    const chemicalCheck = screen.getByRole('checkbox', {name: 'Requires Access to Chemicals'});
    expect(chemicalCheck).toBeInTheDocument();
    // Chemical access is initially not checked
    expect(chemicalCheck).not.toBeChecked();
    await userEvent.click(chemicalCheck);
    // Chemical access is checked when user clicks box
    expect(chemicalCheck).toBeChecked();
  });

  test('Cancel button is rendered, clickable and navigates to dashboard', async () => {
    render(
      <BrowserRouter>
        <RequestRoom />
      </BrowserRouter>
    );
    // Cancel button is rendered
    const cancelButton = screen.getByRole('button', {name: 'Cancel'});
    expect(cancelButton).toBeInTheDocument();
    // Cancel button is clickable
    await userEvent.click(cancelButton);
    // Cancel button navigates to dashboard
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});