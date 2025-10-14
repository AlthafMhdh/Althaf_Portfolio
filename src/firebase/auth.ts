import { signOut } from 'firebase/auth';
import { auth as configuredAuth } from './config'; 

export const logout = () => {
  return signOut(configuredAuth);
};

export const getCurrentUser = () => configuredAuth.currentUser;
