import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics } from "firebase/analytics";
import { Firestore, getFirestore, serverTimestamp } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore"; 

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


export class Firebase {
  // @ts-ignore
  private analytics: Analytics;
  private db: Firestore;
  private sessionId: string;

  constructor() {
    const app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(app);
    this.db = getFirestore(app);

    let cachedId = localStorage.getItem("session-id");
    if (cachedId) {
      this.sessionId = cachedId;
    } else {
      this.sessionId = Date.now().toString(36) + 
             Math.random().toString(36).substring(2);
    
      localStorage.setItem("session-id", this.sessionId);
    }
  }

  async recordResponse(clip: string, correct: boolean) {
    try {
      const docRef = await addDoc(collection(this.db, "responses"), {
        clip,
        correct,
        session: this.sessionId,
        timestamp: serverTimestamp(),
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    } 
  }
}


