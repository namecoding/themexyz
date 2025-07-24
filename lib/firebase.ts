import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_KEY,
//     authDomain: "themexyz.firebaseapp.com",
//     projectId: "themexyz",
//     storageBucket: "themexyz.appspot.com",
//     messagingSenderId: "554835925408",
//     appId: "1:554835925408:web:6851d524093858c7a82cc5",
//     measurementId: "G-PY7B6WHN3N",
// };
const firebaseConfig = {
    apiKey: "AIzaSyA_maiDaNNWdIyE4WdF2BZFGxoRTw7Sgd4",
    authDomain: "unity-exness.firebaseapp.com",
    databaseURL: "https://unity-exness-default-rtdb.firebaseio.com",
    projectId: "unity-exness",
    storageBucket: "unity-exness.appspot.com",
    messagingSenderId: "601380265415",
    appId: "1:601380265415:web:94fb6adab13dc74c9ecde2",
    measurementId: "G-VT0XZ47SJG"
};

// Prevent duplicate app initialization
const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const storage = getStorage(app);
