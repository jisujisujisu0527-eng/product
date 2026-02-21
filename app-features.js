// app-features.js - Global Prayer Network, Daily Routine, and Stats (Firebase v9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, limit, 
    updateDoc, increment, doc, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

// Firebase Config (Should match existing config)
const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY_HERE",
    authDomain: "dailybible-uk.firebaseapp.com",
    projectId: "dailybible-uk",
    storageBucket: "dailybible-uk.appspot.com",
    messagingSenderId: "813854124317",
    appId: "1:813854124317:web:8662908a8a6be7b8c8d8e8"
};

// Initialize Firebase v9 Modular
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * 1. Global Prayer Network
 */

// Add a new prayer
export async function addPrayer(userName, content) {
    try {
        const docRef = await addDoc(collection(db, "prayers"), {
            userName: userName || "Anonymous",
            content: content,
            amenCount: 0,
            createdAt: serverTimestamp()
        });
        console.log("Prayer added with ID: ", docRef.id);
        return docRef.id;
    } catch (e) {
        console.error("Error adding prayer: ", e);
    }
}

// Fetch latest 20 prayers (Optimized for Spark Plan)
export async function getLatestPrayers() {
    const q = query(collection(db, "prayers"), orderBy("createdAt", "desc"), limit(20));
    const querySnapshot = await getDocs(q);
    const prayers = [];
    querySnapshot.forEach((doc) => {
        prayers.push({ id: doc.id, ...doc.data() });
    });
    return prayers;
}

// Increment Amen count
export async function incrementAmen(prayerId) {
    const prayerRef = doc(db, "prayers", prayerId);
    try {
        await updateDoc(prayerRef, {
            amenCount: increment(1)
        });
    } catch (e) {
        console.error("Error updating amen count: ", e);
    }
}

/**
 * 2. Client-side Time-based Daily Routine
 */
function updateDailyRoutine() {
    const dailyContentDiv = document.getElementById('daily-content');
    if (!dailyContentDiv) return;

    const hour = new Date().getHours();
    let message = "";
    let subMessage = "";

    // Time ranges: Morning (05-12), Evening (20-05)
    if (hour >= 5 && hour < 12) {
        message = "🌅 Good Morning! Start your day with the Word.";
        subMessage = "오늘의 말씀을 묵상하며 은혜로운 아침을 시작하세요.";
    } else if (hour >= 20 || hour < 5) {
        message = "🌙 Good Night. End your day in Prayer.";
        subMessage = "오늘 하루를 기도로 마무리하며 평안한 밤 되세요.";
    } else {
        message = "✨ Peace be with you throughout the day.";
        subMessage = "일상의 모든 순간에 주님의 평강이 가득하시길 소망합니다.";
    }

    dailyContentDiv.innerHTML = `
        <div style="font-weight: bold;">${message}</div>
        <div style="font-size: 0.9rem; opacity: 0.8; margin-top: 5px;">${subMessage}</div>
    `;
}

/**
 * 3. Country-wise Bible Reading Counter
 */
import { setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";

export async function incrementReadingCount(countryCode) {
    if (!countryCode) return;
    const statsRef = doc(db, "statistics", countryCode.toUpperCase());
    try {
        await setDoc(statsRef, { 
            readCount: increment(1),
            lastUpdated: serverTimestamp()
        }, { merge: true });
        console.log(`Reading count incremented for ${countryCode}`);
    } catch (e) {
        console.error("Error incrementing reading count: ", e);
    }
}

// Expose to window for access from other scripts or inline events
window.PrayerNetwork = { addPrayer, getLatestPrayers, incrementAmen };
window.StatsService = { incrementReadingCount };

// Initialize Routine on load
document.addEventListener('DOMContentLoaded', () => {
    updateDailyRoutine();
});
