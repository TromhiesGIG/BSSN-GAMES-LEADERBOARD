// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAY14dmkuoxFTELurjBYNbvcRvgxeUF004",
  authDomain: "ifeoluwafaith-9e699.firebaseapp.com",
  databaseURL: "https://ifeoluwafaith-9e699-default-rtdb.firebaseio.com",
  projectId: "ifeoluwafaith-9e699",
  storageBucket: "ifeoluwafaith-9e699.appspot.com",
  messagingSenderId: "528006045058",
  appId: "1:528006045058:web:ea8473eccf408cace6839b",
  measurementId: "G-FK2WYLGZNF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the database service
const database = getDatabase(app);

export { database };
