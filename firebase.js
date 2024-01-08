import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

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

console.log("Initialisierung der Firebase-App");
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  console.log("Firebase-App initialisiert");
} else {
  app = getApps()[0];
  console.log("Verwende vorhandene Firebase-App");
}

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, signInWithEmailAndPassword, createUserWithEmailAndPassword };
