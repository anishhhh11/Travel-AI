// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDG8XCPhYfDU249Hlts15RFouYgy3qtC7k",
  authDomain: "ai-trip-planner-4c8d9.firebaseapp.com",
  projectId: "ai-trip-planner-4c8d9",
  storageBucket: "ai-trip-planner-4c8d9.firebasestorage.app",
  messagingSenderId: "1002629535952",
  appId: "1:1002629535952:web:6eaa792919864e644326d5",
  measurementId: "G-GZW7ZR5E87",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db= getFirestore(app);
// const analytics = getAnalytics(app);
