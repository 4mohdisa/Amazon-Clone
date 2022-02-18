import firebase from "./firebase";
// import firebase from "firebase";

const firebaseConfig = {
    apiKey: "AIzaSyAct4u0lkkrGUXPhOxC0wI_3cpglUeMG_s",
    authDomain: "amzn-3-7289d.firebaseapp.com",
    projectId: "amzn-3-7289d",
    storageBucket: "amzn-3-7289d.appspot.com",
    messagingSenderId: "583205027514",
    appId: "1:583205027514:web:a05fad8cece1b8c3520c83"
  };

  const app = !firebase.apps.length ? 
  firebase.initializeApp(firebaseConfig) 
  : firebase.app();
  

  const db = app.firestore();
  export default db;