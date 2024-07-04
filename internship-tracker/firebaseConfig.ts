// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage'; // Add this import for Firebase Storage

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAMHaegTTGciZAAqI0x5q0XckNC12rxzM8',
  authDomain: 'internship-tracker-1.firebaseapp.com',
  projectId: 'internship-tracker-1',
  storageBucket: 'internship-tracker-1.appspot.com',
  messagingSenderId: '317592602782',
  appId: '1:317592602782:web:1a629d69e8560f30e2d38f',
  measurementId: 'G-7JYLM6Z0PW'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // Add this line to initialize Firebase Storage

export { app, auth, db, storage };
