// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDzVy5Uo4d-OAeC_UD-ibA1g3yoIfPgwV0",
    authDomain: "blocky-4eca9.firebaseapp.com",
    projectId: "blocky-4eca9",
    storageBucket: "blocky-4eca9.appspot.com",
    messagingSenderId: "1036479291639",
    appId: "1:1036479291639:web:dc23795cdcb9eff31e33f2"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
