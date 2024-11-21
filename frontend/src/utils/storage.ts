import { User } from '../utils/type';

export const saveUserData = (userData: User): void => {
  localStorage.setItem('userData', JSON.stringify(userData));
};

export const getUserData = (): User | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

export const getUserRole = (): boolean => {
  const userData = getUserData();
  return userData ? userData.isManager : false;
};

export const getUserId = (): Number => {
  const userData = getUserData();
  return userData ? userData._id : 0;
};

export const clearUserData = (): void => {
  localStorage.removeItem('userData');
};