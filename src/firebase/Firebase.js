import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const app = initializeApp({
  apiKey: "AIzaSyAhfz_szy4zdxPHQW_ejW3Y-C_UphhdLJc",
  authDomain: "farm-developmet.firebaseapp.com",
  projectId: "farm-developmet",
  storageBucket: "farm-developmet.appspot.com",
  messagingSenderId: "11899910164",
  appId: "1:11899910164:web:21dffe61c5f489913c4f01",
});

export const db = getFirestore(app);

export const auth = getAuth(app);

export default app;
