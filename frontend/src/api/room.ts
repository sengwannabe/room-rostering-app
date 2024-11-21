import { apiCallGet, apiCallPut } from '../utils/apiHelpers';
import { UnavailabilityPayload } from '../utils/type';

/**
 * Fetches room request data for a specific user
 * @param userId - The unique identifier of the user
 * @returns Promise containing the user's room request data
 */
export const fetchUserRequestRoom = async (userId: number) => {
  try {
    const response = await apiCallGet(`get_user_requestroom/${userId}`);
    return response;
  } catch (error) {
    console.error('Error fetching equipment:', error);
  }
};

/**
 * Fetches details for a specific room
 * @param room_id - The unique identifier of the room
 * @returns Promise containing the room details
 */
export const fetchRequestRoom = async (room_id: string | undefined) => {
  try {
    const response = await apiCallGet(`get_room/${room_id}`);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error fetching equipment:', error);
  }
};

/**
 * Submits a new timetable allocation for selected users
 * @param selectedUsers - Array of user objects to be allocated in the timetable
 * @returns Promise containing the response from the server
 */
export const submitTimetable = async (selectedUsers: any[]) => {
  try {
    const response = await apiCallPut('put_timetable', selectedUsers);
    return response;
  } catch (error) {
    console.error('Error submitting timetable:', error);
    throw error;
  }
};

/**
 * Updates a user's unavailability schedule
 * @param payload - Object containing userId and unavailability schedule
 * @returns Promise containing the updated unavailability data
 */
export const submitUnavailability = async (payload: UnavailabilityPayload) => {
  try {
    const response = await apiCallPut('put_unavailability', payload);
    return response;
  } catch (error) {
    console.error('Error submitting unavailability:', error);
    throw error;
  }
};
