import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "prepnexa-ai.firebaseapp.com",
  projectId: "prepnexa-ai",
  storageBucket: "prepnexa-ai.firebasestorage.app",
  messagingSenderId: "952526840044",
  appId: "1:952526840044:web:8ccd5199b1c1c44292c5c9"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider()

export{auth, provider}