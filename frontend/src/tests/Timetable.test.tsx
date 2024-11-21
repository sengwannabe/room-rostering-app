import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import Timetable from '../components/Timetable';
import sampleTimetable from '../mocks/testData/timetableTest.json'

const expectedUserName = sampleTimetable[0]!.timetable.Wednesday[0]!.user_name;
const expectedRoomName = sampleTimetable[0]!.timetable.Wednesday[0]!.room_name;

describe('Timetable Component', () => {
  test('renders Weekly Schedule title', () => {
    render(<Timetable />);
    expect(screen.getByText('Weekly Schedule')).toBeInTheDocument();
  });

  test('renders all weekdays', () => {
    render(<Timetable />);
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    weekdays.forEach(day => {
      expect(screen.getByText(day)).toBeInTheDocument();
    });
  });

  test('displays allocation data when API call is successful', async () => {
    render(<Timetable />);
    
    await waitFor(() => {
      expect(screen.getByText(expectedUserName)).toBeInTheDocument();
      expect(screen.getByText(expectedRoomName)).toBeInTheDocument();
    }, {
        timeout: 2000
    });
  });

  test('displays "No allocations for this day" for empty days', async () => {
    render(<Timetable />);
    
    await waitFor(() => {
      const emptyDayMessages = screen.getAllByText('No allocations for this day');
      // Should have 4 empty days (all except Wednesday)
      expect(emptyDayMessages).toHaveLength(4);
    }, {
        timeout: 2000
    });
  });

  test('renders correct allocation structure', async () => {
    render(<Timetable />);
    
    await waitFor(() => {
      const userIcons = screen.getAllByTestId('PersonIcon');
      const roomIcons = screen.getAllByTestId('MeetingRoomIcon');
      
      // One allocation on Wednesday
      expect(userIcons.length).toBe(1);
      expect(roomIcons.length).toBe(1);
    }, {
        timeout: 2000
    });
  });
});