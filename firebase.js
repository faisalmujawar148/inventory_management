// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAnEwrmTqyzU1v36Bmv8UDx4EtTgagxUCE",
  authDomain: "inventory-management-e5a2d.firebaseapp.com",
  projectId: "inventory-management-e5a2d",
  storageBucket: "inventory-management-e5a2d.appspot.com",
  messagingSenderId: "473541466010",
  appId: "1:473541466010:web:a620f277e7fd7166710c23",
  measurementId: "G-BS1PPLDBFC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};