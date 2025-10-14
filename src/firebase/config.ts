import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyA4hMECqEbU2Iuz5kRKXlUprIzkkfcG298",
  authDomain: "althaf-portfolio-website.firebaseapp.com",
  projectId: "althaf-portfolio-website",
  storageBucket: "althaf-portfolio-website.firebasestorage.app",
  messagingSenderId: "85830460535",
  appId: "1:85830460535:web:9c4b948cb6cbc71b151272"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const auth = getAuth(app);
auth.useDeviceLanguage(); // Add this line
export const db = getFirestore(app);
export const functions = getFunctions(app, 'asia-south2');