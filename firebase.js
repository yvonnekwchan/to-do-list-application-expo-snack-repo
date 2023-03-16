import * as firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDUfwwYvUYx3B_NaUX_xRpAImJoypxRlzI",
  authDomain: "todo-list-application-9e112.firebaseapp.com",
  projectId: "todo-list-application-9e112",
  storageBucket: "todo-list-application-9e112.appspot.com",
  messagingSenderId: "1022773035166",
  appId: "1:1022773035166:web:43c59fb374a63594747b8f",
  measurementId: "G-SZ4RPHYHST"
};

export const app = firebase.initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = firebase.firestore();