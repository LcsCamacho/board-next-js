import firebase from 'firebase/app'
import 'firebase/firestore'

let firebaseConfig = {
    apiKey: "AIzaSyD_690wZh04xdFYuj1FskkiOwPF9rxev2c",
    authDomain: "board-4add0.firebaseapp.com",
    projectId: "board-4add0",
    storageBucket: "board-4add0.appspot.com",
    messagingSenderId: "557175895956",
    appId: "1:557175895956:web:5593eb7fe40fcaba288181",
    measurementId: "G-9FJJ0P3CDC"
  };
  
  // Initialize Firebase
  if(!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);

  }
export default firebase