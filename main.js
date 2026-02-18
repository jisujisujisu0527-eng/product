// dailybible.uk - Integrated Core Logic (Card, Mood, Daily Food)

const SiteManager = {
    modules: { i18n: false, dailyContent: false, streaks: false, theme: false },
    checkReady: function() {
        if (Object.values(this.modules).every(v => v)) {
            const loader = document.getElementById('main-loader');
            if (loader) { loader.style.opacity = '0'; setTimeout(() => loader.style.display = 'none', 500); }
        }
    },
    logError: function(mod, err) { console.error(`[${mod}]`, err); }
};

async function safeExecute(mod, func) {
    try { await func(); SiteManager.modules[mod] = true; } 
    catch (e) { SiteManager.logError(mod, e); } 
    finally { SiteManager.checkReady(); }
}

let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    safeExecute('theme', () => { if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode'); });
    safeExecute('i18n', () => applyTranslations());
    safeExecute('dailyContent', () => loadDailyContent());
    safeExecute('streaks', () => updateFaithStreak());
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
}

// 1. Daily Content Logic (Bible, Prayer, Mission)
const prayerMissionPool = {
    ko: { 
        prayers: ["오늘 하루도 주님의 평강이 마음을 지키게 하소서.", "주의 손길이 머무는 곳마다 생명이 피어나게 하소서."],
        missions: ["만나는 이들에게 따뜻한 말 한마디로 그리스도의 사랑을 전하세요.", "정직한 삶의 모습으로 하나님께 영광을 돌리는 하루가 되세요."]
    },
    en: {
        prayers: ["May the peace of God guard your heart today.", "Let life bloom wherever Your hand rests."],
        missions: ["Share Christ's love with a kind word to those you meet.", "Be a light by living with integrity and faith today."]
    }
};

async function loadDailyContent(force = false) {
    const today = new Date().toDateString();
    if (!force && localStorage.getItem('daily_date') === today) {
        renderStoredData();
    } else {
        const fallback = {
            ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
            en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" }
        };
        const item = fallback[currentLang] || fallback['en'];
        const pool = prayerMissionPool[currentLang] || prayerMissionPool['en'];
        
        localStorage.setItem('daily_date', today);
        localStorage.setItem('daily_bible_text', item.text);
        localStorage.setItem('daily_bible_ref', item.ref);
        localStorage.setItem('daily_prayer', pool.prayers[new Date().getDate() % pool.prayers.length]);
        localStorage.setItem('daily_mission', pool.missions[new Date().getDate() % pool.missions.length]);
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

// 2. Mood-based Verse Selection (Simulated for stability)
window.getVerseByMood = function(mood) {
    const moodVerses = {
        anxious: { ko: ["아무것도 염려하지 말고 기도하십시오.", "빌 4:6"], en: ["Do not be anxious about anything.", "Phil 4:6"] },
        grateful: { ko: ["범사에 감사하십시오.", "살전 5:18"], en: ["Give thanks in all circumstances.", "1 Thess 5:18"] },
        lonely: { ko: ["내가 세상 끝날까지 너희와 함께 하리라.", "마 28:20"], en: ["I am with you always, to the end of the age.", "Matt 28:20"] },
        tired: { ko: ["수고하고 무거운 짐 진 자들아 다 내게로 오라.", "마 11:28"], en: ["Come to me, all who labor and are heavy laden.", "Matt 11:28"] },
        joyful: { ko: ["주 안에서 항상 기뻐하십시오.", "빌 4:4"], en: ["Rejoice in the Lord always.", "Phil 4:4"] }
    };
    const data = moodVerses[mood][currentLang] || moodVerses[mood]['en'];
    localStorage.setItem('daily_bible_text', data[0]);
    localStorage.setItem('daily_bible_ref', data[1]);
    renderStoredData();
};

// 3. Verse Card Generation (Canvas)
window.downloadVerseCard = function() {
    const verse = localStorage.getItem('daily_bible_text');
    const ref = localStorage.getItem('daily_bible_ref');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1080;

    // Elegant Background
    ctx.fillStyle = "#FDFAF5";
    ctx.fillRect(0, 0, 1080, 1080);
    ctx.strokeStyle = "#4A3B2A";
    ctx.lineWidth = 20;
    ctx.strokeRect(40, 40, 1000, 1000);

    ctx.fillStyle = "#4A3B2A";
    ctx.textAlign = "center";
    ctx.font = "italic 55px 'EB Garamond'";
    
    // Text Wrap
    const words = verse.split(' ');
    let line = ''; let y = 480;
    for(let n=0; n<words.length; n++) {
        let test = line + words[n] + ' ';
        if (ctx.measureText(test).width > 800) { ctx.fillText(line, 540, y); line = words[n] + ' '; y += 80; }
        else { line = test; }
    }
    ctx.fillText(line, 540, y);
    
    ctx.font = "bold 40px 'EB Garamond'";
    ctx.fillText(ref, 540, y + 120);
    ctx.font = "30px 'Inter'";
    ctx.fillText("dailybible.uk", 540, 1000);

    const link = document.createElement('a');
    link.download = `daily-verse.png`;
    link.href = canvas.toDataURL();
    link.click();
};

// ... Utility functions (applyTranslations, toggleTheme, updateFaithStreak)
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang]?.[key]) {
            if (el.tagName === 'INPUT') el.placeholder = translations[currentLang][key];
            else el.textContent = translations[currentLang][key];
        }
    });
    document.documentElement.lang = currentLang;
}

window.changeLanguage = function(lang) {
    currentLang = lang; localStorage.setItem('lang', lang);
    applyTranslations(); loadDailyContent(true);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
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
    if (document.getElementById('streak-badge')) document.getElementById('streak-badge').style.display = 'inline-block';
}
