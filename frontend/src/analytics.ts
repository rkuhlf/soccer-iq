import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAppIi8kMCqRkoQIAq_vEE21cBP_CH6pJE",
  authDomain: "football-iq-b7ef3.firebaseapp.com",
  projectId: "football-iq-b7ef3",
  storageBucket: "football-iq-b7ef3.firebasestorage.app",
  messagingSenderId: "315723919558",
  appId: "1:315723919558:web:4fdb500ce32c83782327c7",
  measurementId: "G-B5EM9R1ENY"
};


export function initializeAnalytics() {
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);
    return analytics;
}
