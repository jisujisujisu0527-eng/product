// dailybible.uk - Integrated Master Logic

const SiteManager = {
    modules: { i18n: false, dailyContent: false, streaks: false, theme: false, firebase: false },
    hideLoader: function() {
        const loader = document.getElementById('main-loader');
        if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 500); }
    }
};

let currentLang = localStorage.getItem('user_lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initial UI
    window.applyLanguage(currentLang);
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    // 2. Load Contents
    loadDailyContent();
    updateFaithStreak();
    
    // 3. Firebase Connect
    const checkFirebase = setInterval(() => {
        if (window.db) {
            clearInterval(checkFirebase);
            SiteManager.modules.firebase = true;
            watchGlobalPrayer();
            SiteManager.hideLoader();
        }
    }, 500);

    // Fallback: Max load time 3s
    setTimeout(() => SiteManager.hideLoader(), 3000);
});

// --- Core Logic ---

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
    const storedDate = localStorage.getItem('daily_date');
    
    if (storedDate === today && localStorage.getItem('daily_bible_text')) {
        renderStoredData();
    } else {
        const fallback = {
            en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1", prayer: "May His peace be with you.", mission: "Share love today." },
            ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1", prayer: "주님의 평강이 함께하시길.", mission: "오늘 사랑을 전하세요." }
        };
        const item = fallback[currentLang] || fallback['en'];
        localStorage.setItem('daily_date', today);
        localStorage.setItem('daily_bible_text', item.text);
        localStorage.setItem('daily_bible_ref', item.ref);
        localStorage.setItem('daily_prayer', item.prayer);
        localStorage.setItem('daily_mission', item.mission);
        renderStoredData();
    }
}

function renderStoredData() {
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    const pText = document.getElementById('prayer-text');
    const mText = document.getElementById('mission-text');
    if (bText) bText.textContent = `"${localStorage.getItem('daily_bible_text')}"`;
    if (bRef) bRef.textContent = localStorage.getItem('daily_bible_ref');
    if (pText) pText.textContent = localStorage.getItem('daily_prayer');
    if (mText) mText.textContent = localStorage.getItem('daily_mission');
}

window.getVerseByMood = function(mood) {
    const moodVerses = {
        anxious: { ko: ["아무것도 염려하지 말고 기도하십시오.", "빌 4:6"], en: ["Do not be anxious about anything.", "Phil 4:6"] },
        lonely: { ko: ["내가 세상 끝날까지 너희와 함께 하리라.", "마 28:20"], en: ["I am with you always.", "Matt 28:20"] },
        grateful: { ko: ["범사에 감사하십시오.", "살전 5:18"], en: ["Give thanks in all circumstances.", "1 Thess 5:18"] },
        joyful: { ko: ["주 안에서 항상 기뻐하십시오.", "빌 4:4"], en: ["Rejoice in the Lord always.", "Phil 4:4"] }
    };
    const data = moodVerses[mood][currentLang] || moodVerses[mood]['en'];
    localStorage.setItem('daily_bible_text', data[0]);
    localStorage.setItem('daily_bible_ref', data[1]);
    renderStoredData();
};

window.downloadVerseCard = function() {
    const verse = localStorage.getItem('daily_bible_text');
    const ref = localStorage.getItem('daily_bible_ref');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1080;
    ctx.fillStyle = "#FDFAF5"; ctx.fillRect(0, 0, 1080, 1080);
    ctx.strokeStyle = "#B08968"; ctx.lineWidth = 20; ctx.strokeRect(40, 40, 1000, 1000);
    ctx.fillStyle = "#34495E"; ctx.textAlign = "center"; ctx.font = "italic 50px serif";
    ctx.fillText(verse, 540, 540);
    ctx.font = "bold 40px serif"; ctx.fillText(ref, 540, 640);
    const link = document.createElement('a'); link.download = 'bible-card.png'; link.href = canvas.toDataURL(); link.click();
};

window.askFaithCompanion = function() {
    const worry = document.getElementById('user-worry').value;
    const resEl = document.getElementById('ai-response');
    if(!worry) return;
    const res = currentLang === 'ko' ? `"${worry}"에 대해 주님께 지혜를 구합니다. 오늘의 말씀을 묵상해보세요.` : `Seeking guidance for "${worry}". Meditate on today's Word.`;
    resEl.textContent = res;
};

// --- Firebase Features ---

window.lightGlobalCandle = async function() {
    if (!window.db || SiteManager.isMockMode) return;
    const statsRef = window.db.collection("stats").doc("global_prayer");
    try {
        await window.db.runTransaction(async (t) => {
            const doc = await t.get(statsRef);
            const newCount = (doc.data().totalCount || 0) + 1;
            t.update(statsRef, { totalCount: newCount, lastCountry: currentLang.toUpperCase() });
        });
    } catch (e) { console.error(e); }
};

function watchGlobalPrayer() {
    if (!window.db) return;
    window.db.collection("stats").doc("global_prayer").onSnapshot(doc => {
        if (doc.exists) {
            const data = doc.data();
            document.getElementById('prayer-counter').textContent = (data.totalCount || 0).toLocaleString();
        }
    });
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
    if (document.getElementById('streak-badge')) document.getElementById('streak-badge').style.display = 'inline-flex';
}
