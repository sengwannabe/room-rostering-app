import React from "react";
import ApprovePage from "../components/ApprovePage";
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

describe('Approve Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  })

  test('Renders approve page', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    // Title is rendered
    expect(screen.getByRole('heading', {name: 'Pending Approvals'})).toBeInTheDocument();
    await waitFor(() => {
      // John Johnson to be rendered from mock data
      expect(screen.getByText(expectedUser1.name)).toBeInTheDocument();
      // McLovin to be rendered from mock data
      expect(screen.getByText(expectedUser2.name)).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // 3 user checkboxes is rendered and not checked
    const userSelectBox = screen.getAllByRole('checkbox');
    expect(userSelectBox.length).toStrictEqual(3);
    // Working days is 1 for John Johnson
    expect(screen.getByText('Working Days: 1')).toBeInTheDocument();
    // Working days is 2 for McLovin
    expect(screen.getByText('Working Days: 2')).toBeInTheDocument();
    // 2 view details button is rendered
    const detailButtons = screen.getAllByRole('button', {name: 'Details'})
    expect(detailButtons.length).toStrictEqual(2);
    // Cancel button is rendered
    expect(screen.getByRole('button', {name: 'Cancel'})).toBeInTheDocument();
  });

  test('Select user is clickable', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    let userSelectBox: HTMLElement | null = null;
    await waitFor(() => {
      // User checkbox is rendered
      userSelectBox = screen.getAllByRole('checkbox')[1]!;
      expect(userSelectBox).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Initially specific user box is not checked
    expect(userSelectBox).not.toBeChecked();
    // Click user select box
    await userEvent.click(userSelectBox!);
    // User is selected
    expect(userSelectBox).toBeChecked();
  });

  test('Selecting user renders approve button, then deselecting closes approve button', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    let userSelectBox: HTMLElement | null = null;
    await waitFor(() => {
      // User checkbox is rendered
      userSelectBox = screen.getAllByRole('checkbox')[1]!;
      expect(userSelectBox).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Approve button initially not rendered
    expect(screen.queryByRole('button', {name: 'Approve Selected'})).not.toBeInTheDocument();
    // Click user select box
    await userEvent.click(userSelectBox!);
    // User is selected
    expect(userSelectBox).toBeChecked();
    // Approve button is rendered
    const approveButton = screen.getByRole('button', {name: 'Approve Selected'});
    expect(approveButton).toBeInTheDocument();
    // Deselect user
    await userEvent.click(userSelectBox!);
    // Approve button becomes not rendered
    expect(screen.queryByRole('button', {name: 'Approve Selected'})).not.toBeInTheDocument();
  });

  test('All select checkbox selects all users', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    // Select all checkbox is rendered
    const allSelectBox = screen.getAllByRole('checkbox')[0]!;
    expect(allSelectBox).toBeInTheDocument();
    let userSelectBox: HTMLElement | null = null;
    await waitFor(() => {
      // User checkbox is rendered
      userSelectBox = screen.getAllByRole('checkbox')[1]!;
      expect(userSelectBox).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Initially all select and specific user box is not checked
    expect(allSelectBox).not.toBeChecked();
    expect(userSelectBox).not.toBeChecked();
    // Click all select box
    await userEvent.click(allSelectBox);
    // All select user boxes are checked
    expect(allSelectBox).toBeChecked();
    expect(userSelectBox).toBeChecked();
  });

  test('Selecting all users checkbox renders approve button, then deselecting closes approve button', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    // Select all checkbox is rendered
    const allSelectBox = screen.getAllByRole('checkbox')[0]!;
    expect(allSelectBox).toBeInTheDocument();
    let userSelectBox: HTMLElement | null = null;
    await waitFor(() => {
      // User checkbox is rendered
      userSelectBox = screen.getAllByRole('checkbox')[1]!;
      expect(userSelectBox).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Approve button initially not rendered
    expect(screen.queryByRole('button', {name: 'Approve Selected'})).not.toBeInTheDocument();
    // Initially all select and specific user box is not checked
    expect(allSelectBox).not.toBeChecked();
    expect(userSelectBox).not.toBeChecked();
    // Click all select box
    await userEvent.click(allSelectBox);
    // All select user boxes are checked
    expect(allSelectBox).toBeChecked();
    expect(userSelectBox).toBeChecked();
    // Approve button is rendered
    const approveButton = screen.getByRole('button', {name: 'Approve Selected'});
    expect(approveButton).toBeInTheDocument();
    // Deselect all user checkbox
    await userEvent.click(allSelectBox);
    // Approve button becomes not rendered
    expect(screen.queryByRole('button', {name: 'Approve Selected'})).not.toBeInTheDocument();
  });

  test('User details button is clickable', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    let detailsButton: HTMLElement | null = null;
    await waitFor(() => {
      // Details button is rendered
      detailsButton = screen.getAllByRole('button', {name: 'Details'})[0]!;
      expect(detailsButton).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    // Click on details button
    await userEvent.click(detailsButton!);
    // Expected to navigate to approve details page of user id
    expect(mockNavigate).toHaveBeenCalledWith(`/dashboard/approve/${expectedUser1._id}`);
  });

  test('Approve button render for submission', async () => {
    render(
      <BrowserRouter>
        <ApprovePage />
      </BrowserRouter>
    );
    let userSelectBox: HTMLElement | null = null;
    await waitFor(() => {
      // User checkbox is rendered
      userSelectBox = screen.getAllByRole('checkbox')[1]!;
      expect(userSelectBox).toBeInTheDocument();
    }, {
      timeout: 2000
    });
    expect(screen.queryByRole('button', {name: 'Approve Selected'})).not.toBeInTheDocument();
    // Click user select box
    await userEvent.click(userSelectBox!);
    // User is selected
    expect(userSelectBox).toBeChecked();
    // Approve button is rendered
    const approveButton = screen.getByRole('button', {name: 'Approve Selected'});
    expect(approveButton).toBeInTheDocument();
    // Submit approval by clicking on Approve Selected
    await userEvent.click(approveButton);
    // Expected to navigate to timetable page when approved
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard/timetable');
  });
});