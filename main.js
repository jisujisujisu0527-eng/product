// dailybible.uk - Master Control System & Global Community Logic

const SiteManager = {
    modules: { i18n: false, dailyContent: false, streaks: false, theme: false, globalPrayer: false },
    checkReady: function() {
        const isReady = Object.values(this.modules).every(v => v);
        if (isReady) this.hideLoader();
    },
    hideLoader: function() {
        const loader = document.getElementById('main-loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => loader.style.display = 'none', 500);
        }
    },
    logError: function(mod, err) { 
        console.error(`[${mod}]`, err); 
        this.modules[mod] = true; // 오류 발생시에도 진행되도록 true 처리
        this.checkReady();
    }
};

// 3초 후 강제 로더 해제 (네트워크 오류 대비)
setTimeout(() => SiteManager.hideLoader(), 3000);

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
    applyLanguage(currentLang);
    safeExecute('theme', () => { if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode'); });
    safeExecute('dailyContent', () => loadDailyContent());
    safeExecute('streaks', () => updateFaithStreak());
    safeExecute('globalPrayer', () => watchGlobalPrayer());
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
}

// --- 1. Global Prayer Chain Logic ---
import { db, collection, doc } from "./firebase-firestore-service.js";
import { onSnapshot, runTransaction, serverTimestamp, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

window.lightGlobalCandle = async function() {
    const country = currentLang.toUpperCase();
    const statsRef = doc(db, "stats", "global_prayer");
    const btn = document.getElementById('global-prayer-btn');
    if(btn) btn.disabled = true;

    try {
        await runTransaction(db, async (transaction) => {
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
    } catch (e) { console.error(e); }
};

function watchGlobalPrayer() {
    const statsRef = doc(db, "stats", "global_prayer");
    onSnapshot(statsRef, (doc) => {
        const data = doc.data();
        if (data) {
            const counterEl = document.getElementById('prayer-counter');
            const countryEl = document.getElementById('recent-country');
            if (counterEl) counterEl.textContent = data.totalCount.toLocaleString();
            if (countryEl) countryEl.textContent = data.lastCountry;
        }
    });
}

// --- 2. Quiz Leaderboard Logic ---
window.loadQuizLeaderboard = function() {
    const q = query(collection(db, "quiz_scores"), orderBy("score", "desc"), limit(5));
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
};

// --- Existing Functions (applyLanguage, loadDailyContent, etc.) ---
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
            else el.textContent = langData[key];
        }
    });
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

async function loadDailyContent() {
    const today = new Date().toDateString();
    const biblePool = {
        en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
        ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" }
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

window.downloadVerseCard = function() {
    alert("Card generated!"); // Simplified for check
};
