import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCIS_WAg7_qnbX-8zl9DEVuTOVkYOOTa8w",
  authDomain: "social-app-e0445.firebaseapp.com",
  databaseURL: "https://social-app-e0445.firebaseio.com",
  projectId: "social-app-e0445",
  storageBucket: "social-app-e0445.appspot.com",
  messagingSenderId: "1056024043716",
  appId: "1:1056024043716:web:d1a276c168a9a32946a991",
  measurementId: "G-F3X7MRTMKS",
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
