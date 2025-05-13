// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1vR_HDcD5_waCguASHtGjNG8vdpIw9_M",
  authDomain: "clubbix-97f8e.firebaseapp.com",
  projectId: "clubbix-97f8e",
  storageBucket: "clubbix-97f8e.firebasestorage.app",
  messagingSenderId: "990009264237",
  appId: "1:990009264237:web:a5688a8b342f077dded764",
  measurementId: "G-9DBQ3V1Q1V",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
