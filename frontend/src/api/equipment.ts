import { apiCallGet } from '../utils/apiHelpers';
import { Equipment } from '../utils/type';

/**
 * Fetches the list of available equipment from the server
 * @returns Promise<Equipment[]> List of equipment with their properties and dependencies
 * @throws {Error} If there's an issue with the API call
 */
export const fetchEquipment = async (): Promise<Equipment[]> => {
  try {
    const response = await apiCallGet('get_equipment');
    return JSON.parse(response);
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error; // Re-throw to allow handling by caller
  }
};
