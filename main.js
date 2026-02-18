// dailybible.uk - Main Application Logic (Compat Mode)

let currentLang = localStorage.getItem('user_lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    // 1. 테마 및 초기화
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    // 2. 다국어 및 콘텐츠 로드
    window.applyLanguage(currentLang);
    loadDailyContent();
    updateFaithStreak();
    watchGlobalPrayer();
    
    // 3. 로딩 체크 (Firebase 로드 완료 신호)
    if (window.db) {
        window.SiteManager.modules.store = true;
        window.SiteManager.hideLoader(); // 수동 호출
    }
});

// --- 1. Global Prayer Chain ---
window.lightGlobalCandle = async function() {
    if (!window.db) return;
    const country = currentLang.toUpperCase();
    const statsRef = window.db.collection("stats").doc("global_prayer");

    try {
        if (window.SiteManager.isMockMode) {
            console.log("Mock Prayer recorded from:", country);
            return;
        }
        await window.db.runTransaction(async (transaction) => {
            const sfDoc = await transaction.get(statsRef);
            if (!sfDoc.exists) {
                transaction.set(statsRef, { totalCount: 1, lastCountry: country });
            } else {
                const newCount = sfDoc.data().totalCount + 1;
                transaction.update(statsRef, { totalCount: newCount, lastCountry: country });
            }
        });
    } catch (e) { console.error(e); }
};

function watchGlobalPrayer() {
    if (!window.db) return;
    window.db.collection("stats").doc("global_prayer").onSnapshot((doc) => {
        if (doc.exists) {
            const data = doc.data();
            const counterEl = document.getElementById('prayer-counter');
            if (counterEl) counterEl.textContent = (data.totalCount || 0).toLocaleString();
            const countryEl = document.getElementById('recent-country');
            if (countryEl) countryEl.textContent = data.lastCountry || "...";
        }
    });
}

// --- 2. 다국어 적용 ---
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
};

// --- 3. 오늘의 양식 ---
function loadDailyContent() {
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
}

// --- 4. 기타 유틸리티 ---
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

window.toggleTheme = function() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

window.downloadVerseCard = function() { alert("Card generation ready!"); };
window.getVerseByMood = function(mood) { 
    alert(currentLang === 'ko' ? `${mood}에 맞는 말씀을 찾았습니다.` : `Found verse for ${mood}`);
};
window.askFaithCompanion = function() { alert("Coming Soon!"); };
