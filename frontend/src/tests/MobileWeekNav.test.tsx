import React from "react";
import { MobileWeekNav } from "../components/MobileWeekNav";
import { BrowserRouter } from "react-router-dom";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from 'vitest';
import { getMonday, getWeekDates, formatDate } from "../utils/dateUtils";

// Mock navigation
const onClick = vi.fn();

// Current week Monday and dates mocks
const currentMonday = getMonday(new Date());
const currentWeekDates = getWeekDates(currentMonday);

describe('Mobile Week Navbar Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  })

  test('Renders Mobile week navbar component', async () => {
    render(
      <BrowserRouter>
        <MobileWeekNav
          weekDates={currentWeekDates}
          monday={currentMonday}
          onNextWeek={onClick}
          onPreviousWeek={onClick}
        />
      </BrowserRouter>
    );
    // Left and right arrow buttons are rendered
    expect(screen.getAllByRole('button').length).toStrictEqual(2);

    const allHeadings = screen.getAllByRole('heading');

    // Current month year is rendered and correct date
    const currentMonthYear = allHeadings[0];
    expect(currentMonthYear).toBeInTheDocument();
    expect(currentMonthYear?.textContent).toStrictEqual(`${formatDate(currentMonday).month} ${currentMonday.getFullYear().toString()}`);

    // All week dates in navbar is rendered and has correct dates
    for (let i = 1; i < allHeadings.length; i++) {
      const currentDate = allHeadings[i];
      expect(currentDate).toBeInTheDocument();
      expect(currentDate?.textContent).toStrictEqual(currentWeekDates[i - 1]?.getDate().toString());
    }
  });

  test('Left arrow is clickable', async () => {
    render(
      <BrowserRouter>
        <MobileWeekNav
          weekDates={currentWeekDates}
          monday={currentMonday}
          onNextWeek={onClick}
          onPreviousWeek={onClick}
        />
      </BrowserRouter>
    );
    // Left arrow button is rendered
    const leftButton = screen.getAllByRole('button')[0]!;
    expect(leftButton).toBeInTheDocument();
    // Left button is clicked
    await userEvent.click(leftButton);
    // onClick expected to be called
    expect(onClick).toHaveBeenCalled();
  });

  test('Right arrow is clickable', async () => {
    render(
      <BrowserRouter>
        <MobileWeekNav
          weekDates={currentWeekDates}
          monday={currentMonday}
          onNextWeek={onClick}
          onPreviousWeek={onClick}
        />
      </BrowserRouter>
    );
    // Left arrow button is rendered
    const rightButton = screen.getAllByRole('button')[1]!;
    expect(rightButton).toBeInTheDocument();
    // Left button is clicked
    await userEvent.click(rightButton);
    // onClick expected to be called
    expect(onClick).toHaveBeenCalled();
  });
});