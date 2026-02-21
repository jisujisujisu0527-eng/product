// app-features.js - Global Prayer Network, Daily Routine, Stats, and Streak (Firebase v9 Modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, query, orderBy, limit, 
    updateDoc, increment, doc, serverTimestamp, setDoc, getDoc
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

// Firebase Config
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
const auth = getAuth(app);

/**
 * 🔥 Streak (연속 동행) Logic
 */

const getDateStr = (date) => date.toISOString().split('T')[0];
const getTodayStr = () => getDateStr(new Date());
const getYesterdayStr = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return getDateStr(d);
};

export async function updateDailyStreak(userId) {
    if (!userId) return;

    const userRef = doc(db, "users", userId);
    const today = getTodayStr();
    const yesterday = getYesterdayStr();
    const streakEl = document.getElementById('streak-counter');

    try {
        const userDoc = await getDoc(userRef);
        let streak = 0;

        if (userDoc.exists()) {
            const data = userDoc.data();
            const lastVisitDate = data.lastVisitDate || "";
            streak = data.streakCount || 0;

            if (lastVisitDate === today) {
                // 오늘 이미 방문함 (기존 데이터 유지)
                console.log("Streak: Already updated today.");
            } else if (lastVisitDate === yesterday) {
                // 어제 방문함 (연속 성공)
                streak += 1;
                await updateDoc(userRef, {
                    streakCount: streak,
                    lastVisitDate: today
                });
                console.log("Streak: Increased! Current:", streak);
            } else {
                // 연속이 끊김 (초기화)
                streak = 1;
                await updateDoc(userRef, {
                    streakCount: streak,
                    lastVisitDate: today
                });
                console.log("Streak: Reset to 1.");
            }
        } else {
            // 첫 방문 (문서 생성)
            streak = 1;
            await setDoc(userRef, {
                streakCount: 1,
                lastVisitDate: today,
                createdAt: serverTimestamp()
            });
            console.log("Streak: New user initialized.");
        }

        // 안전한 UI 업데이트
        if (streakEl) {
            streakEl.innerText = `🔥 ${streak}일 연속 동행`;
        }

    } catch (e) {
        console.error("Streak Update Error:", e);
        if (streakEl) streakEl.innerText = "🔥 동행 기록 확인 중...";
    }
}

// Auth 상태 관찰 및 익명 로그인
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("Authenticated User UID:", user.uid);
        updateDailyStreak(user.uid);
    } else {
        console.log("No user found. Signing in anonymously...");
        signInAnonymously(auth).catch(err => console.error("Anonymous Sign-in Error:", err));
    }
});

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

// Fetch latest 20 prayers
export async function getLatestPrayers() {
    try {
        const q = query(collection(db, "prayers"), orderBy("createdAt", "desc"), limit(20));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Error fetching prayers:", e);
        return [];
    }
}

// Increment Amen count
export async function incrementAmen(prayerId) {
    const prayerRef = doc(db, "prayers", prayerId);
    try {
        await updateDoc(prayerRef, { amenCount: increment(1) });
    } catch (e) {
        console.error("Error updating amen count:", e);
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
export async function incrementReadingCount(countryCode) {
    if (!countryCode) return;
    const statsRef = doc(db, "statistics", countryCode.toUpperCase());
    try {
        await setDoc(statsRef, { 
            readCount: increment(1),
            lastUpdated: serverTimestamp()
        }, { merge: true });
    } catch (e) {
        console.error("Error incrementing reading count:", e);
    }
}

// Expose to window
window.PrayerNetwork = { addPrayer, getLatestPrayers, incrementAmen };
window.StatsService = { incrementReadingCount };
window.updateDailyStreak = updateDailyStreak;

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    updateDailyRoutine();
});
