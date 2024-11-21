import { apiCallGet } from '../utils/apiHelpers';
import { User } from '../utils/type';

/**
 * Fetches all users from the server including their roles and availability schedules
 * @returns List of users with their details and preferences
 * @throws {Error} If there's an issue with the API call
 */
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const response = await apiCallGet('get_users');
    return JSON.parse(response);
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};
