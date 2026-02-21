// firebase-firestore-service.js (Stabilized Service Layer)
import { db } from './firebase-config.js';

/**
 * 1. Site Infrastructure Manager
 */
window.SiteManager = {
    isReady: false,
    startApp: function() {
        if (this.isReady) return;
        this.isReady = true;
        
        const loader = document.getElementById('main-loader');
        const content = document.getElementById('app-content');
        
        if (loader) {
            loader.style.transition = 'opacity 0.5s';
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

// Global DB mapping for legacy compatibility
window.db = db;

// Safety initialization
if (document.readyState === 'complete') {
    window.SiteManager.startApp();
} else {
    window.addEventListener('load', () => window.SiteManager.startApp());
}

/**
 * 2. Specialized Faith Checkup Services
 */
export async function getRecentFaithCheckups() {
    if (!db) return [];
    try {
        // v9 modular 방식으로 데이터 조회
        const { collection, query, orderBy, limit, getDocs } = await import("https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js");
        const q = query(collection(db, "faith_checkups"), orderBy("timestamp", "desc"), limit(50));
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
        console.error("Faith Checkup Service Error:", e);
        return [];
    }
}

// Global expose
window.getRecentFaithCheckups = getRecentFaithCheckups;
