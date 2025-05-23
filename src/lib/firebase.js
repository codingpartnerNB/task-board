// Firebase configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA7pW26pwKXcQVQRzmXK7ifVpbMwIKdYek",
  authDomain: "task-board-e2c1d.firebaseapp.com",
  projectId: "task-board-e2c1d",
  storageBucket: "task-board-e2c1d.firebasestorage.app",
  messagingSenderId: "211210338431",
  appId: "1:211210338431:web:01067931ab93e1f8c43f4a",
  measurementId: "G-EMHFTR0F1Q",
  databaseURL: "https://task-board-e2c1d-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const database = getDatabase(app);
const analytics = getAnalytics(app);

export { app, auth, firestore, database, analytics };