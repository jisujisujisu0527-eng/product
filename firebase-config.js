// firebase-config.js - Centralized Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDCuBvNfOKXIvQuOtGYrvSHQYyZcpt9LT0",
  authDomain: "kims-88433.firebaseapp.com",
  projectId: "kims-88433",
  storageBucket: "kims-88433.firebasestorage.app",
  messagingSenderId: "842717872672",
  appId: "1:842717872672:web:f37e14c7c1fb024c0f3245",
  measurementId: "G-8YPXQN7Z3M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "main"); // "main" 인스턴스 사용
const auth = getAuth(app);

// Export for other modules
export { app, db, auth };
