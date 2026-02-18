// dailybible.uk - App Logic

let currentLang = localStorage.getItem('user_lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    // Basic UI Setup
    window.applyLanguage(currentLang);
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    loadDailyContent();
    
    // Firebase Dependent Logic
    const checkReady = setInterval(() => {
        if (window.db && window.SiteManager && window.SiteManager.isReady) {
            clearInterval(checkReady);
            watchGlobalPrayer();
        }
    }, 500);
});

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
    const fallback = {
        en: { text: "The Lord is my shepherd.", ref: "Psalm 23:1", prayer: "Bless our day.", mission: "Be kind." },
        ko: { text: "여호와는 나의 목자시니.", ref: "시편 23:1", prayer: "오늘을 축복하소서.", mission: "친절을 베푸세요." }
    };
    const item = fallback[currentLang] || fallback['en'];
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    const pText = document.getElementById('prayer-text');
    const mText = document.getElementById('mission-text');
    if (bText) bText.textContent = `"${item.text}"`;
    if (bRef) bRef.textContent = item.ref;
    if (pText) pText.textContent = item.prayer;
    if (mText) mText.textContent = item.mission;
}

window.lightGlobalCandle = async function() {
    if (!window.db) return;
    const statsRef = window.db.collection("stats").doc("global_prayer");
    try {
        await window.db.runTransaction(async (t) => {
            const doc = await t.get(statsRef);
            const newCount = (doc.exists ? (doc.data().totalCount || 0) : 0) + 1;
            t.update(statsRef, { totalCount: newCount });
        });
    } catch (e) { console.log("Offline mode: Prayer not synced"); }
};

function watchGlobalPrayer() {
    if (!window.db) return;
    window.db.collection("stats").doc("global_prayer").onSnapshot(doc => {
        if (doc.exists) {
            const counter = document.getElementById('prayer-counter');
            if (counter) counter.textContent = (doc.data().totalCount || 0).toLocaleString();
        }
    });
}

window.downloadVerseCard = function() { alert("Card Save Enabled"); };
window.getVerseByMood = function(m) { alert("Curation: " + m); };
window.askFaithCompanion = function() { alert("Simulated response"); };
