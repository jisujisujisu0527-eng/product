// dailybible.uk - Firebase & Site Manager (Robust Version)

// 1. 전역 관리 객체 선언
window.SiteManager = {
    isMockMode: false,
    modules: { firebase: false, store: false },
    // 로딩 화면 제거 함수
    hideLoader: function() {
        const loader = document.getElementById('main-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                console.log("✅ Loader hidden.");
            }, 500);
        }
    }
};

// 2. 파이어베이스 설정 (사용자 키 입력 필요)
const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY_HERE",
    authDomain: "dailybible-uk.firebaseapp.com",
    projectId: "dailybible-uk",
    storageBucket: "dailybible-uk.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

// 3. 파이어베이스 초기화 및 안전 장치
try {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_REAL")) {
        throw new Error("API Key is missing or default.");
    }
    // 초기화 (CDN에서 로드된 firebase 객체 사용)
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.SiteManager.modules.firebase = true;
    console.log("✅ Firebase Initialized");
} catch (error) {
    window.SiteManager.isMockMode = true;
    console.warn("🚀 Starting in Mock Mode:", error.message);
    
    // 가짜 DB 객체 (에러 방지용)
    window.db = {
        collection: function() {
            return {
                doc: () => ({ 
                    onSnapshot: (cb) => cb({ data: () => ({ totalCount: 0 }), exists: false }),
                    get: () => Promise.resolve({ exists: false, data: () => ({}) }),
                    update: () => Promise.resolve(),
                    set: () => Promise.resolve()
                }),
                add: () => Promise.resolve({ id: "mock" }),
                orderBy: () => ({ limit: () => ({ onSnapshot: () => {} }) }),
                where: () => ({ limit: () => ({ get: () => Promise.resolve({ empty: true, docs: [] }) }) })
            };
        },
        runTransaction: async () => {}
    };
}

// **중요**: 2.5초 후에는 성공 여부와 관계없이 무조건 로딩 화면을 걷어냅니다.
setTimeout(() => window.SiteManager.hideLoader(), 2500);
