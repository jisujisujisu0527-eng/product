// dailybible.uk & product-cgy.pages.dev - Master Script (Fail-safe Edition)

const SiteManager = {
    modules: { i18n: false, dailyContent: false, streaks: false, theme: false, globalPrayer: false },
    checkReady: function() {
        // 하나라도 완료되면 로더를 없애기 시작 (너무 엄격한 검사는 무한 로딩 유발)
        const readyCount = Object.values(this.modules).filter(v => v).length;
        if (readyCount >= 3) this.hideLoader(); 
    },
    hideLoader: function() {
        const loader = document.getElementById('main-loader');
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    },
    logError: function(mod, err) { 
        console.warn(`[${mod}] skipped:`, err); 
        this.modules[mod] = true; // 에러가 나도 완료된 것으로 처리하여 로딩 해제 유도
        this.checkReady();
    }
};

// **중요**: 2.5초가 지나면 무조건 로딩 화면을 없앱니다.
setTimeout(() => SiteManager.hideLoader(), 2500);

async function safeExecute(mod, func) {
    try { await func(); SiteManager.modules[mod] = true; } 
    catch (e) { SiteManager.logError(mod, e); } 
    finally { SiteManager.checkReady(); }
}

let currentLang = localStorage.getItem('user_lang');
if (!currentLang) {
    const browserLang = navigator.language.split('-')[0];
    currentLang = translations[browserLang] ? browserLang : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. 기본 UI 먼저 그리기 (동기)
    try {
        applyLanguage(currentLang);
        if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
        SiteManager.modules.theme = true;
        SiteManager.modules.i18n = true;
    } catch(e) { console.error(e); }

    // 2. 비동기 작업 시작
    safeExecute('dailyContent', () => loadDailyContent());
    safeExecute('streaks', () => updateFaithStreak());
    safeExecute('globalPrayer', () => watchGlobalPrayer());
    
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
}

// --- 1. Global Prayer Chain Logic ---
import { db, doc } from "./firebase-firestore-service.js";
import { onSnapshot, runTransaction, serverTimestamp, query, orderBy, limit, collection } from "./firebase-firestore-service.js"; // Import from safe wrapper

window.lightGlobalCandle = async function() {
    const country = currentLang.toUpperCase();
    const statsRef = doc(db, "stats", "global_prayer");
    const btn = document.getElementById('global-prayer-btn');
    if(btn) btn.disabled = true;

    try {
        await runTransaction(db, async (transaction) => {
            if (!transaction) return; // Mock mode guard
            const sfDoc = await transaction.get(statsRef);
            if (!sfDoc.exists()) {
                transaction.set(statsRef, { totalCount: 1, lastCountry: country });
            } else {
                const newCount = sfDoc.data().totalCount + 1;
                transaction.update(statsRef, { 
                    totalCount: newCount, 
                    lastCountry: country,
                    lastTimestamp: serverTimestamp() 
                });
            }
        });
    } catch (e) { console.log("Prayer update skipped (Offline)"); }
};

function watchGlobalPrayer() {
    if (!db) return; // DB 미연결 시 중단
    try {
        const statsRef = doc(db, "stats", "global_prayer");
        if (!statsRef) return;
        
        onSnapshot(statsRef, (docSnap) => {
            if (docSnap && docSnap.data && docSnap.data()) {
                const data = docSnap.data();
                const counterEl = document.getElementById('prayer-counter');
                const countryEl = document.getElementById('recent-country');
                if (counterEl) counterEl.textContent = (data.totalCount || 0).toLocaleString();
                if (countryEl) countryEl.textContent = data.lastCountry || "...";
            }
        });
    } catch(e) { console.log("Prayer watch skipped"); }
}

// --- 2. Quiz Leaderboard Logic ---
window.loadQuizLeaderboard = function() {
    if (!db) return;
    try {
        const q = query(collection(db, "quiz_scores"), orderBy("score", "desc"), limit(5));
        if (!q) return;

        onSnapshot(q, (snapshot) => {
            const listEl = document.getElementById('leaderboard-list');
            if (!listEl) return;
            listEl.innerHTML = "";
            snapshot.forEach((doc, index) => {
                const data = doc.data();
                listEl.innerHTML += `
                    <div class="rank-item">
                        <span><strong>${index + 1}.</strong> ${data.username} (${data.country})</span>
                        <span class="score">${data.score}</span>
                    </div>
                `;
            });
        });
    } catch(e) { console.log("Leaderboard load skipped"); }
};

// --- Core Functions ---
window.applyLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('user_lang', lang);
    document.documentElement.lang = lang;
    const select = document.getElementById('lang-select');
    if (select) select.value = lang;

    const langData = translations[lang] || translations['en'];
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (langData[key]) {
            if (el.tagName === 'INPUT') el.placeholder = langData[key];
            else el.textContent = langData[key]; // Icons handled by innerHTML in previous ver if needed, simple text here for stability
        }
    });
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

async function loadDailyContent() {
    const today = new Date().toDateString();
    const biblePool = {
        en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
        ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
        es: { text: "El Señor es mi pastor, nada me falta.", ref: "Salmo 23:1" },
        fr: { text: "L'Éternel est mon berger: je ne manquerai de rien.", ref: "Psaume 23:1" }
    };
    const item = biblePool[currentLang] || biblePool['en'];
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    if (bText) bText.textContent = `"${item.text}"`;
    if (bRef) bRef.textContent = item.ref;
    
    // Also load Leaderboard if on Home page
    if (document.getElementById('leaderboard-list')) loadQuizLeaderboard();
}

function updateFaithStreak() {
    const today = new Date().toDateString();
    const last = localStorage.getItem('last_visit');
    let streak = parseInt(localStorage.getItem('faith_streak')) || 0;
    if (last !== today) {
        streak = (last === new Date(Date.now() - 86400000).toDateString()) ? streak + 1 : 1;
        localStorage.setItem('last_visit', today);
        localStorage.setItem('faith_streak', streak);
    }
    const countEl = document.getElementById('streak-count');
    if (countEl) countEl.textContent = streak;
    const badge = document.getElementById('streak-badge');
    if (badge) badge.style.display = 'inline-flex';
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Global functions for HTML access
window.downloadVerseCard = function() { alert("Card generated!"); };
window.getVerseByMood = function(mood) { alert("Finding verse for: " + mood); };
window.askFaithCompanion = function() { alert("Asking Paul..."); };
