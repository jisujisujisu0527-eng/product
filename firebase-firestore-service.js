// firebase-firestore-service.js (Enhanced with Streak)

const firebaseConfig = {
  apiKey: "AIzaSyDCuBvNfOKXIvQuOtGYrvSHQYyZcpt9LT0",
  authDomain: "kims-88433.firebaseapp.com",
  projectId: "kims-88433",
  storageBucket: "kims-88433.firebasestorage.app",
  messagingSenderId: "842717872672",
  appId: "1:842717872672:web:f37e14c7c1fb024c0f3245",
  measurementId: "G-8YPXQN7Z3M"
};

window.SiteManager = {
    isReady: false,
    startApp: function() {
        if (this.isReady) return;
        this.isReady = true;
        
        const loader = document.getElementById('main-loader');
        const content = document.getElementById('app-content');
        
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (content) content.style.display = 'block';
            }, 500);
        } else if (content) {
            content.style.display = 'block';
        }
    }
};

setTimeout(() => window.SiteManager.startApp(), 3000);

try {
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.SiteManager.startApp();
} catch (error) {
    console.warn("🚀 Entering Offline Mode:", error.message);
    window.db = null;
    window.SiteManager.startApp();
}

/**
 * 스트릭 업데이트 함수 (Gemini 조언 기반)
 */
window.updateStreak = async function() {
    // 1. 사용자 고유 ID (없으면 생성)
    let uid = localStorage.getItem('user_uid');
    if (!uid) {
        uid = 'guest_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('user_uid', uid);
    }

    if (!window.db) return 0;

    const userRef = window.db.collection("users").doc(uid);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    try {
        const doc = await userRef.get();
        let currentStreak = 0;

        if (doc.exists) {
            const data = doc.data();
            const lastLoginDate = data.lastLoginDate;
            currentStreak = data.streakCount || 0;

            if (lastLoginDate === todayStr) {
                // 이미 오늘 체크인함
            } else if (lastLoginDate === yesterdayStr) {
                // 연속 출석 성공
                currentStreak += 1;
                await userRef.update({ streakCount: currentStreak, lastLoginDate: todayStr });
            } else {
                // 하루 이상 건너뜀
                currentStreak = 1;
                await userRef.update({ streakCount: currentStreak, lastLoginDate: todayStr });
            }
        } else {
            // 신규 유저
            currentStreak = 1;
            await userRef.set({ streakCount: 1, lastLoginDate: todayStr, createdAt: todayStr });
        }
        return currentStreak;
    } catch (e) {
        console.error("Streak Update Error:", e);
        return 0;
    }
};
