import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
const firebaseConfig = {
  apiKey: "AIzaSyDUzR775eazsBRnzl5Ebdyb_CV9Buow2FQ",
  authDomain: "keep-clone-15667.firebaseapp.com",
  projectId: "keep-clone-15667",
  storageBucket: "keep-clone-15667.appspot.com",
  messagingSenderId: "82443575522",
  appId: "1:82443575522:web:1e3cc78c062f7d15d93ebb",
  measurementId: "G-503580SK4Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db ,auth};