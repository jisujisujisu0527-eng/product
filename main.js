// dailybible.uk - Enhanced i18n & Master Control System

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

// 고도화된 다국어 처리 함수
function applyTranslations() {
    const langData = translations[currentLang] || translations['en'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = langData[key];
        
        if (translation) {
            // 1. Placeholder 처리 (input, textarea)
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } 
            // 2. 일반 텍스트 처리
            else {
                // 내부에 아이콘(<i>)이 있는 경우 텍스트 노드만 교체
                if (el.querySelector('i')) {
                    const icon = el.querySelector('i').outerHTML;
                    el.innerHTML = `${icon} ${translation}`;
                } else {
                    el.textContent = translation;
                }
            }
        }
    });

    // 3. 페이지 <title> 자동 변경 (nav_home, nav_community 등 활용)
    const pageTitleKey = document.querySelector('title')?.getAttribute('data-i18n');
    if (pageTitleKey && langData[pageTitleKey]) {
        document.title = `${langData[pageTitleKey]} | ${langData.site_logo}`;
    }

    document.documentElement.lang = currentLang;
}

window.changeLanguage = function(lang) {
    currentLang = lang; 
    localStorage.setItem('lang', lang);
    applyTranslations(); 
    loadDailyContent(true);
    // 다른 스크립트(게시판 등)에 언어 변경 알림
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

// --- Daily Content & Card Generation ---

async function loadDailyContent(force = false) {
    const today = new Date().toDateString();
    if (!force && localStorage.getItem('daily_date') === today && localStorage.getItem('daily_lang') === currentLang) {
        renderStoredData();
    } else {
        const fallbackVerses = {
            ko: [{ text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" }],
            en: [{ text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" }]
        };
        const list = fallbackVerses[currentLang] || fallbackVerses['en'];
        const item = list[0];
        
        localStorage.setItem('daily_date', today);
        localStorage.setItem('daily_lang', currentLang);
        localStorage.setItem('daily_bible_text', item.text);
        localStorage.setItem('daily_bible_ref', item.ref);
        localStorage.setItem('daily_prayer', translations[currentLang]?.daily_prayer_default || "...");
        localStorage.setItem('daily_mission', translations[currentLang]?.daily_mission_default || "...");
        renderStoredData();
    }
}

function renderStoredData() {
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    if (bText) bText.textContent = `"${localStorage.getItem('daily_bible_text')}"`;
    if (bRef) bRef.textContent = localStorage.getItem('daily_bible_ref');
}

window.downloadVerseCard = function() {
    const verse = localStorage.getItem('daily_bible_text');
    const ref = localStorage.getItem('daily_bible_ref');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080; canvas.height = 1080;
    ctx.fillStyle = "#FDFAF5"; ctx.fillRect(0, 0, 1080, 1080);
    ctx.strokeStyle = "#4A3B2A"; ctx.lineWidth = 20; ctx.strokeRect(40, 40, 1000, 1000);
    ctx.fillStyle = "#4A3B2A"; ctx.textAlign = "center"; ctx.font = "italic 50px 'EB Garamond'";
    
    const words = verse.split(' ');
    let line = ''; let y = 500;
    words.forEach(w => {
        let test = line + w + ' ';
        if (ctx.measureText(test).width > 800) { ctx.fillText(line, 540, y); line = w + ' '; y += 70; }
        else { line = test; }
    });
    ctx.fillText(line, 540, y);
    ctx.font = "bold 40px 'EB Garamond'"; ctx.fillText(ref, 540, y + 100);
    const link = document.createElement('a'); link.download = 'verse.png'; link.href = canvas.toDataURL(); link.click();
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
