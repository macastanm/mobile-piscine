import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENV } from './env';

// Firebase configuration from environment
const firebaseConfig = {
  apiKey: ENV.FIREBASE.API_KEY,
  authDomain: ENV.FIREBASE.AUTH_DOMAIN,
  projectId: ENV.FIREBASE.PROJECT_ID,
  storageBucket: ENV.FIREBASE.STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE.MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE.APP_ID,
};

console.log(firebaseConfig);

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
export default app;

// apiKey: "AIzaSyCpXyXlYAPTOZtND9QXUGmFX921XG9VHU8",

//   authDomain: "diary-app-5849d.firebaseapp.com",

//   projectId: "diary-app-5849d",

//   storageBucket: "diary-app-5849d.firebasestorage.app",

//   messagingSenderId: "272317801765",

//   appId: "1:272317801765:web:792534935f9528f05fa6cc",

//   measurementId: "G-3LFRJ1BW73"
