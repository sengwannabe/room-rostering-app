import { apiCallGet } from '../utils/apiHelpers';
import { TimetableDocument } from '../utils/type';

/**
 * Fetches the current timetable data from the server containing the weekly room allocation schedule
 * @returns Promise<TimetableData | undefined> Weekly schedule organized by days with user and room assignments
 * @throws {Error} If there's an issue with the API call
 */
export const fetchTimetable = async (): Promise<TimetableDocument[] | undefined> => {
  try {
    const response = await apiCallGet('get_timetable');
    return JSON.parse(response);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    throw error; // Re-throw to allow handling by caller
  }
};
