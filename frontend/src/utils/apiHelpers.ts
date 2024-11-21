import config from '../config.json';

/**
 * Common function to handle API responses
 */
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || response.statusText);
  }
  return response.json();
};

/**
 * GET request to API
 */
export const apiCallGet = async (path: string) => {
  try {
    const response = await fetch(`http://localhost:${config.BACKEND_PORT}/${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const responseData = await handleResponse(response);
    return responseData;
  } catch (error) {
    console.error('API Get Error:', error);
    throw error;
  }
};

/**
 * POST request to API
 */
export const apiCallPost = async (path: string, body: object) => {
  try {
    const response = await fetch(`http://localhost:${config.BACKEND_PORT}/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Post Error:', error);
    throw error;
  }
};

/**
 * PUT request to API
 */
export const apiCallPut = async (path: string, body: object) => {
  try {
    const response = await fetch(`http://localhost:${config.BACKEND_PORT}/${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Put Error:', error);
    throw error;
  }
};

/**
 * DELETE request to API
 */
export const apiCallDelete = async (path: string) => {
  try {
    const response = await fetch(`http://localhost:${config.BACKEND_PORT}/${path}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return handleResponse(response);
  } catch (error) {
    console.error('API Delete Error:', error);
    throw error;
  }
};
