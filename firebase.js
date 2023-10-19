// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import { getAnalytics } from "firebase/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCETwuZUtYQH09W-klkmW4vqpbni4BOgT4",
  authDomain: "innstantaid.firebaseapp.com",
  projectId: "innstantaid",
  storageBucket: "innstantaid.appspot.com",
  messagingSenderId: "637670043250",
  appId: "1:637670043250:web:75cd16bc814716ed021ceb",
  measurementId: "G-Z4LCBHEN3Y",
};

firebase.initializeApp(firebaseConfig);
export default firebase.firestore();
// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
