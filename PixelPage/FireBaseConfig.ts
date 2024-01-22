import { initializeApp } from "firebase/app";
import { getAuth}  from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBQ4bjlTkPWcQyqkmL59lUIiv1u90H9BQ",
  authDomain: "pixelpage-2114e.firebaseapp.com",
  projectId: "pixelpage-2114e",
  storageBucket: "pixelpage-2114e.appspot.com",
  messagingSenderId: "1048396866280",
  appId: "1:1048396866280:web:270c50ad2303bb43ffdf5d"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);