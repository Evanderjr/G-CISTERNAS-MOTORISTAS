import firebase from 'firebase/compat/app';
import 'firebase/compat/storage';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCsdZ07ePtMLh9_KlYdnzu8ithnbosFrrY",
    authDomain: "aprendendo-fbase.firebaseapp.com",
    projectId: "aprendendo-fbase",
    storageBucket: "aprendendo-fbase.appspot.com",
    messagingSenderId: "355579987550",
    appId: "1:355579987550:web:64fd48e9ae26864b7b56cf"
};

if (!firebase.apps.length) {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
}

export { firebase };
