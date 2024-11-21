import React from "react";
import { DayScheduleCard } from "../components/DayScheduleCard";
import { BrowserRouter } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from 'vitest';
import sampleTimetable from '../mocks/testData/timetableTest.json';

const expectedTimetable = sampleTimetable[0]!;
const userAllocation = expectedTimetable.timetable.Wednesday[0]!;

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

describe('Day Schedule Card Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  })

  test('Renders day card with user being unavailable', async () => {
    render(
      <BrowserRouter>
        <DayScheduleCard
          date={new Date()}
          isMobile={false}
          isUnavailable={true}
          timeTable={undefined}
        />
      </BrowserRouter>
    );
    // 'Unavailable' text is rendered
    expect(screen.getByText('Unavailable')).toBeInTheDocument();
  });

  test('Renders day card with user being available but no room', async () => {
    render(
      <BrowserRouter>
        <DayScheduleCard
          date={new Date()}
          isMobile={false}
          isUnavailable={false}
          timeTable={undefined}
        />
      </BrowserRouter>
    );
    // 'Full Day Shift' text is rendered
    expect(screen.getByText('Full Day Shift')).toBeInTheDocument();
  });

  test('Renders approve page with user allocation', async () => {
    render(
      <BrowserRouter>
        <DayScheduleCard
          date={new Date()}
          isMobile={false}
          isUnavailable={false}
          timeTable={userAllocation}
        />
      </BrowserRouter>
    );
    // 'Room: Clancy' is rendered
    expect(screen.getByText(`Room: ` + userAllocation.room_name)).toBeInTheDocument();
  });

  test('Available and doom day card can be clicked', async () => {
    render(
      <BrowserRouter>
        <DayScheduleCard
          date={new Date()}
          isMobile={false}
          isUnavailable={false}
          timeTable={userAllocation}
        />
      </BrowserRouter>
    );
    const cardButton = screen.getByText('Room: Clancy');
    // User clicks on day card
    await userEvent.click(cardButton);
    // Expect user to be navigated to room information page
    expect(mockNavigate).toHaveBeenCalledWith(`/dashboard/room/${userAllocation.room_id}`)
  });
});