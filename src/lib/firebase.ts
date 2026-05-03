import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA2PlAn9x1p8aisuHkOwbLvwPA6dZ3Ofdg",
  authDomain: "tour-mate-461ed.firebaseapp.com",
  projectId: "tour-mate-461ed",
  storageBucket: "tour-mate-461ed.firebasestorage.app",
  messagingSenderId: "825875185989",
  appId: "1:825875185989:web:2a30b1a6f7bcc35a6f3e2c",
  measurementId: "G-MN6P7XM9D9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
