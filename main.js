// dailybible.uk - Integrated Logic (Global Window Version)

let currentLang = localStorage.getItem('user_lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI
    window.applyLanguage(currentLang);
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    // 2. Initial Content
    loadDailyContent();
    updateFaithStreak();
    
    // 3. Monitor Firebase Connection
    const checkFirebase = setInterval(() => {
        if (window.db && window.SiteManager) {
            clearInterval(checkFirebase);
            window.SiteManager.modules.store = true;
            watchGlobalPrayer();
            window.SiteManager.hideLoader();
        }
    }, 500);
});

// --- Core functions (Card, Language, Daily) ---

window.applyLanguage = function(lang) {
    currentLang = lang; localStorage.setItem('user_lang', lang);
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
};

function loadDailyContent() {
    const today = new Date().toDateString();
    const fallback = {
        en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
        ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" }
    };
    const item = fallback[currentLang] || fallback['en'];
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    if (bText) bText.textContent = `"${item.text}"`;
    if (bRef) bRef.textContent = item.ref;
}

window.getVerseByMood = function(mood) {
    alert("Mood selected: " + mood);
};

window.downloadVerseCard = function() {
    alert("Card generation ready.");
};

window.askFaithCompanion = function() {
    const worry = document.getElementById('user-worry').value;
    const resEl = document.getElementById('ai-response');
    if(resEl) resEl.textContent = "Seeking wisdom for: " + worry;
};

// --- Firebase Features ---

window.lightGlobalCandle = async function() {
    if (!window.db || window.SiteManager.isMockMode) return;
    const statsRef = window.db.collection("stats").doc("global_prayer");
    try {
        await window.db.runTransaction(async (t) => {
            const doc = await t.get(statsRef);
            const newCount = (doc.exists ? (doc.data().totalCount || 0) : 0) + 1;
            t.update(statsRef, { totalCount: newCount, lastCountry: currentLang.toUpperCase() });
        });
    } catch (e) { console.error("Prayer Transaction Error", e); }
};

function watchGlobalPrayer() {
    if (!window.db) return;
    window.db.collection("stats").doc("global_prayer").onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            const counter = document.getElementById('prayer-counter');
            if (counter) counter.textContent = (data.totalCount || 0).toLocaleString();
        }
    });
}

function updateFaithStreak() {
    const countEl = document.getElementById('streak-count');
    const badge = document.getElementById('streak-badge');
    if (countEl && badge) {
        countEl.textContent = localStorage.getItem('faith_streak') || "1";
        badge.style.display = 'inline-flex';
    }
}

window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};
