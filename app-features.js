// app-features.js - Stabilized Version
import { db, auth } from './firebase-config.js';
import { 
    collection, addDoc, getDocs, query, orderBy, limit, 
    updateDoc, increment, doc, serverTimestamp, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

/**
 * 1. Helper: Date Formatter (Local Time YYYY-MM-DD)
 */
const getLocalDateString = (date) => {
    try {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    } catch (e) {
        return new Date().toISOString().split('T')[0];
    }
};

/**
 * 2. Main Streak Logic (Robust)
 */
export async function updateDailyStreak(userId) {
    if (!userId || !db) return;

    const streakEl = document.getElementById('streak-counter') || document.getElementById('streak-count');
    const userRef = doc(db, "users", userId);
    
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
                finalStreak = currentCount;
            } else if (lastVisit === yesterdayStr) {
                finalStreak = currentCount + 1;
                await updateDoc(userRef, { streakCount: finalStreak, lastVisitDate: todayStr });
            } else {
                finalStreak = 1;
                await updateDoc(userRef, { streakCount: 1, lastVisitDate: todayStr });
            }
        } else {
            finalStreak = 1;
            await setDoc(userRef, {
                streakCount: 1,
                lastVisitDate: todayStr,
                createdAt: serverTimestamp()
            });
        }

        if (streakEl) {
            streakEl.innerText = `🔥 ${finalStreak}일 연속 동행`;
            const container = document.getElementById('streak-container');
            if (container) container.style.display = 'inline-flex';
        }
        return finalStreak;

    } catch (error) {
        console.warn("Streak Logic Error (Safe Fail):", error.message);
        if (streakEl && streakEl.innerText.includes("로딩")) {
            streakEl.innerText = "🔥 동행을 시작하세요";
        }
    }
}

/**
 * 3. Auth Listener & Anonymous Login
 */
onAuthStateChanged(auth, (user) => {
    if (user) {
        updateDailyStreak(user.uid);
    } else {
        signInAnonymously(auth).catch(err => {
            console.error("Auth Error:", err);
        });
    }
});

/**
 * 4. Additional Features (Prayer, Stats)
 */
export async function addPrayer(userName, content) {
    if (!db) return;
    try {
        await addDoc(collection(db, "prayers"), {
            userName: userName || "Anonymous",
            content: content,
            amenCount: 0,
            createdAt: serverTimestamp()
        });
    } catch (e) { console.error("Add Prayer Error:", e); }
}

export async function incrementReadingCount(countryCode) {
    if (!db || !countryCode) return;
    const statsRef = doc(db, "statistics", countryCode.toUpperCase());
    try {
        await setDoc(statsRef, { 
            readCount: increment(1),
            lastUpdated: serverTimestamp()
        }, { merge: true });
    } catch (e) { console.error("Stats Error:", e); }
}

// Global Exports for main.js compatibility
window.updateStreak = updateDailyStreak;
window.StatsService = { incrementReadingCount };
window.PrayerNetwork = { addPrayer };
