// firebase-firestore-service.js (Emergency Start Version)

// 1. 설정값 (실제 키로 교체 필요)
const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY_HERE",
    authDomain: "dailybible-uk.firebaseapp.com",
    projectId: "dailybible-uk",
    storageBucket: "dailybible-uk.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
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
                console.log("🚀 App Started (Mode: " + (window.db ? "Online" : "Offline") + ")");
            }, 500);
        } else {
            if (content) content.style.display = 'block';
        }
    }
};

// 2. 2.5초 강제 실행 타이머 (접속 장애 최종 방어선)
setTimeout(() => window.SiteManager.startApp(), 2500);

// 3. Firebase 초기화 시도
try {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_REAL")) {
        throw new Error("Missing API Key");
    }
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    
    // DB 연결 확인 후 앱 실행
    window.db.collection("stats").doc("global_prayer").get()
        .then(() => { window.SiteManager.startApp(); })
        .catch(() => { window.SiteManager.startApp(); });
} catch (error) {
    console.warn("🚀 Firebase Init Error (Entering Offline Mode):", error.message);
    // Mock DB to prevent main.js crashes
    window.db = {
        collection: () => ({
            doc: () => ({
                onSnapshot: () => {}, get: () => Promise.resolve({ exists: false }),
                update: () => Promise.resolve(), set: () => Promise.resolve()
            }),
            orderBy: () => ({ limit: () => ({ onSnapshot: () => {} }) })
        }),
        runTransaction: async () => {}
    };
    window.SiteManager.startApp();
}
