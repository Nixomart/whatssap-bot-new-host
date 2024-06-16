import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyBgKmv5Jk1ppJ_E9ReGTZ1E1VC8Gxf578M",
  authDomain: "calendar-dashboard-df06c.firebaseapp.com",
  projectId: "calendar-dashboard-df06c",
  storageBucket: "calendar-dashboard-df06c.appspot.com",
  messagingSenderId: "38923944301",
  appId: "1:38923944301:web:2d53a5ee57624b43c85a64",
  measurementId: "G-HC117KMTGS"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp) 

export default firebaseApp;