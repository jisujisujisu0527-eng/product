// app-features.js - Final Robust Version for Mobile Compatibility
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, limit, 
    updateDoc, increment, doc, serverTimestamp, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// 1. Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY_HERE",
    authDomain: "dailybible-uk.firebaseapp.com",
    projectId: "dailybible-uk",
    storageBucket: "dailybible-uk.appspot.com",
    messagingSenderId: "813854124317",
    appId: "1:813854124317:web:8662908a8a6be7b8c8d8e8"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, "main");
const auth = getAuth(app);

/**
 * 3. Helper: Date Formatter (Local Time YYYY-MM-DD)
 */
const getLocalDateString = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
};

/**
 * 4. Main Streak Logic
 */
export async function updateDailyStreak(userId) {
    if (!userId) return;

    const streakEl = document.getElementById('streak-counter');
    const userRef = doc(db, "users", userId);
    
    // Calculate Today and Yesterday in Local Time
    const now = new Date();
    const todayStr = getLocalDateString(now);
    
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = getLocalDateString(yesterday);

    try {
        const userDoc = await getDoc(userRef);
        let finalStreak = 0;

        if (userDoc.exists()) {
            const data = userDoc.data();
            const lastVisit = data.lastVisitDate || "";
            const currentCount = data.streakCount || 0;

            if (lastVisit === todayStr) {
                // Already visited today
                finalStreak = currentCount;
            } else if (lastVisit === yesterdayStr) {
                // Continuous visit
                finalStreak = currentCount + 1;
                await updateDoc(userRef, {
                    streakCount: finalStreak,
                    lastVisitDate: todayStr
                });
            } else {
                // Streak broken or first visit in a long time
                finalStreak = 1;
                await updateDoc(userRef, {
                    streakCount: 1,
                    lastVisitDate: todayStr
                });
            }
        } else {
            // First time user
            finalStreak = 1;
            await setDoc(userRef, {
                streakCount: 1,
                lastVisitDate: todayStr,
                createdAt: serverTimestamp()
            });
        }

        // UI Update
        if (streakEl) {
            streakEl.innerText = `🔥 ${finalStreak}일 연속 동행`;
        }

    } catch (error) {
        console.error("Firestore Streak Error:", error);
        if (streakEl) {
            streakEl.innerText = "에러: " + error.message;
        }
    }
}

/**
 * 5. Auth Listener & Anonymous Login
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User Authenticated:", user.uid);
        updateDailyStreak(user.uid);
    } else {
        console.log("Starting Anonymous Auth...");
        signInAnonymously(auth).catch(err => {
            console.error("Auth Error:", err);
            const streakEl = document.getElementById('streak-counter');
            if (streakEl) streakEl.innerText = "인증 에러: " + err.message;
        });
    }
});

/**
 * 6. Additional Features (Prayer, Stats)
 */
export async function addPrayer(userName, content) {
    try {
        await addDoc(collection(db, "prayers"), {
            userName: userName || "Anonymous",
            content: content,
            amenCount: 0,
            createdAt: serverTimestamp()
        });
    } catch (e) { console.error(e); }
}

export async function incrementReadingCount(countryCode) {
    if (!countryCode) return;
    const statsRef = doc(db, "statistics", countryCode.toUpperCase());
    try {
        await setDoc(statsRef, { 
            readCount: increment(1),
            lastUpdated: serverTimestamp()
        }, { merge: true });
    } catch (e) { console.error(e); }
}

// Global Exports
window.updateDailyStreak = updateDailyStreak;
window.StatsService = { incrementReadingCount };
