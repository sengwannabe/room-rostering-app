import React from "react";
import ApproveDetailPage from '../components/ApproveDetailPage';
import { BrowserRouter } from "react-router-dom";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import { vi } from 'vitest';
import sampleUser from '../mocks/testData/usersTest.json';
import * as userApi from "../api/user";

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      id: '11'
    })
  };
});

const expectedUser = sampleUser[1]!;
const expectedEquipment1 = expectedUser.roomPreference.equipment[0]!.quantity;
const expectedEquipment2 = expectedUser.roomPreference.equipment[1]!.quantity;

describe('ApproveDetailPage component', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderApproveDetailPage = () => {
    return render(
      <BrowserRouter>
        <ApproveDetailPage />
      </BrowserRouter>
    );
  };

  test('renders the title', async () => {
    renderApproveDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Review Request - ' + expectedUser.name)).toBeInTheDocument();
    }, {
      timeout: 2000
    });
  });

  test('displays working days when data is loaded', async () => {
    renderApproveDetailPage();

    await waitFor(() => {
      // Tuesday and Thursday should be rendered
      expect(screen.getByText('Working Dates')).toBeInTheDocument();
      expect(screen.getByText('Tuesday')).toBeInTheDocument();
      expect(screen.getByText('Thursday')).toBeInTheDocument();
    }, {
      timeout: 2000
    });
  });

  test('displays room requirements details when data is loaded', async () => {
    renderApproveDetailPage();

    await waitFor(() => {
      expect(screen.getByText('Room Requirements')).toBeInTheDocument();
      expect(screen.getByText('Capacity: ' + expectedUser.roomPreference.capacity + ' people')).toBeInTheDocument();
      expect(screen.getByText('Chair (' + expectedEquipment1 + ')')).toBeInTheDocument();
      expect(screen.getByText('Workbench (' + expectedEquipment2 + ')')).toBeInTheDocument();
    }, {
      timeout: 2000
    });
  });

  test('Fetch users api is called when rendered', async () => {
    const fetchUserSpy = vi.spyOn(userApi, 'fetchUsers');
    renderApproveDetailPage();
    
    // Fetch users is called
    await waitFor(() => {
      expect(fetchUserSpy).toHaveBeenCalled();
    });
  });
});