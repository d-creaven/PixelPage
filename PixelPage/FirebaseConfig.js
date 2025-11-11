import { initializeApp, getApps } from "firebase/app";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 
import { getStorage } from "firebase/storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Get Firebase config from environment variables
// Falls back to hardcoded values for development if .env is not set
const getFirebaseConfig = () => {
  const extra = Constants.expoConfig?.extra || {};
  
  // Use environment variables if available, otherwise fall back to defaults
  // In production, these should always come from .env
  return {
    apiKey: extra.firebaseApiKey || process.env.EXPO_PUBLIC_FIREBASE_API_KEY || "AIzaSyDBQ4bjlTkPWcQyqkmL59lUIiv1u90H9BQ",
    authDomain: extra.firebaseAuthDomain || process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || "pixelpage-2114e.firebaseapp.com",
    projectId: extra.firebaseProjectId || process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || "pixelpage-2114e",
    storageBucket: extra.firebaseStorageBucket || process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || "pixelpage-2114e.appspot.com",
    messagingSenderId: extra.firebaseMessagingSenderId || process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "1048396866280",
    appId: extra.firebaseAppId || process.env.EXPO_PUBLIC_FIREBASE_APP_ID || "1:1048396866280:web:270c50ad2303bb43ffdf5d"
  };
};

const firebaseConfig = getFirebaseConfig();

// Initialize app only if it doesn't exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize auth with AsyncStorage persistence for React Native
let auth;
if (Platform.OS !== 'web') {
  try {
    // Only import React Native-specific modules on native platforms
    // Using dynamic require to avoid webpack bundling on web
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    // Check if getReactNativePersistence exists (it won't on web)
    const authModule = require("firebase/auth");
    if (authModule.getReactNativePersistence) {
      auth = initializeAuth(app, {
        persistence: authModule.getReactNativePersistence(AsyncStorage)
      });
    } else {
      auth = getAuth(app);
    }
  } catch (error) {
    // If auth is already initialized or import fails, get the existing instance
    auth = getAuth(app);
  }
} else {
  // On web, use default auth (browser persistence)
  auth = getAuth(app);
}

const db = getFirestore(app);
const storage = getStorage(app)

export { auth, db, storage };