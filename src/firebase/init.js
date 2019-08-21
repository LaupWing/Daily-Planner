import firebase from 'firebase'

var firebaseConfig = {
    apiKey: "AIzaSyDTf5mLqKAd04TT_EtTM244aWkXkjgIQFU",
    authDomain: "daily-planner-40cbf.firebaseapp.com",
    databaseURL: "https://daily-planner-40cbf.firebaseio.com",
    projectId: "daily-planner-40cbf",
    storageBucket: "daily-planner-40cbf.appspot.com",
    messagingSenderId: "307529607050",
    appId: "1:307529607050:web:bb6a48978d7f0e11"
  };
  // Initialize Firebase
const firebaseApp =  firebase.initializeApp(firebaseConfig);

// To use auth = firebaseApp.auth()
// To use database = firebaseApp.firestore()
export default firebaseApp.firestore()