import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyBAXODC-deWCdkVDOerm7u4M40t8DkHpQQ",
  authDomain: "granja-alfonso-chaves.firebaseapp.com",
  projectId: "granja-alfonso-chaves",
  storageBucket: "granja-alfonso-chaves.appspot.com",
  messagingSenderId: "614187785088",
  appId: "1:614187785088:web:124a955cec157458d5ff65",
  measurementId: "G-481KPZDC4H"
});

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
