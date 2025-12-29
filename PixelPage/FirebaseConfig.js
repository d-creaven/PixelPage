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

// Initialize auth - use platform-specific persistence
let auth;
if (Platform.OS === 'web') {
  // On web, use default auth (browser persistence)
  auth = getAuth(app);
} else {
  // On native platforms, try to use AsyncStorage persistence
  try {
    // Use dynamic require only on native platforms to avoid web bundling issues
    const AsyncStorage = require("@react-native-async-storage/async-storage").default;
    const { getReactNativePersistence } = require("firebase/auth");
    
    // Check if auth is already initialized
    try {
      auth = getAuth(app);
    } catch {
      // If not initialized, create with AsyncStorage persistence
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
    }
  } catch (error) {
    // Fallback to default auth if AsyncStorage setup fails
    auth = getAuth(app);
  }
}

const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };