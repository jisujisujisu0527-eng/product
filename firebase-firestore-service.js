// firebase-firestore-service.js (Master System Manager)

window.SiteManager = {
    isMockMode: false,
    modules: { firebase: false, store: false },
    hideLoader: function() {
        const loader = document.getElementById('main-loader');
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                console.log("✅ Main Loader Hidden Successfully.");
            }, 500);
        }
    }
};

const firebaseConfig = {
    apiKey: "YOUR_REAL_API_KEY", // 실제 키로 교체 필요
    authDomain: "dailybible-uk.firebaseapp.com",
    projectId: "dailybible-uk",
    storageBucket: "dailybible-uk.appspot.com",
    messagingSenderId: "SENDER_ID",
    appId: "APP_ID"
};

try {
    if (!firebaseConfig.apiKey || firebaseConfig.apiKey.includes("YOUR_REAL")) {
        throw new Error("API Key Missing");
    }
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
    window.SiteManager.modules.firebase = true;
    console.log("✅ Firebase Connected");
} catch (e) {
    window.SiteManager.isMockMode = true;
    console.warn("🚀 Running in Offline Mode:", e.message);
    // Mock DB structure to prevent crashes
    window.db = {
        collection: () => ({
            doc: () => ({
                onSnapshot: (cb) => cb({ exists: false, data: () => ({}) }),
                get: () => Promise.resolve({ exists: false, data: () => ({}) }),
                update: () => Promise.resolve(),
                set: () => Promise.resolve()
            }),
            add: () => Promise.resolve({ id: "mock" }),
            orderBy: () => ({ limit: () => ({ onSnapshot: () => {} }) }),
            where: () => ({ limit: () => ({ get: () => Promise.resolve({ empty: true, docs: [] }) }) })
        }),
        runTransaction: async () => {}
    };
}
