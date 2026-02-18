// dailybible.uk & product-cgy.pages.dev - Master Script

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

// 1. Domain & Language Initialization
let currentLang = localStorage.getItem('user_lang');
if (!currentLang) {
    const browserLang = navigator.language.split('-')[0];
    currentLang = translations[browserLang] ? browserLang : 'en';
}

document.addEventListener('DOMContentLoaded', () => {
    // Domain Check (Canonical SEO)
    const host = window.location.hostname;
    console.log(`[System] Domain: ${host}`);

    applyLanguage(currentLang);
    safeExecute('theme', () => { if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode'); });
    safeExecute('dailyContent', () => loadDailyContent());
    safeExecute('streaks', () => updateFaithStreak());
});

async function safeExecute(mod, func) {
    try { await func(); SiteManager.modules[mod] = true; } 
    catch (e) { SiteManager.logError(mod, e); } 
    finally { SiteManager.checkReady(); }
}

// 2. Expert Feedback: Dynamic Language Application
window.applyLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('user_lang', lang);
    document.documentElement.lang = lang;

    const select = document.getElementById('lang-select');
    if (select) select.value = lang;

    const langData = translations[lang] || translations['en'];
    
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translation = langData[key];
        if (translation) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translation;
            } else {
                // Keep icons
                const icon = el.querySelector('i');
                if (icon) {
                    el.innerHTML = `${icon.outerHTML} ${translation}`;
                } else {
                    el.innerText = translation;
                }
            }
        }
    });

    // Re-fetch daily content with new language
    if (SiteManager.modules.dailyContent) loadDailyContent(true);
    
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

// 3. Dynamic API Call based on Language
async function loadDailyContent(force = false) {
    const today = new Date().toDateString();
    if (!force && localStorage.getItem('daily_date') === today && localStorage.getItem('daily_lang') === currentLang) {
        renderStoredData();
    } else {
        // Here you would add &translation=ko to your API calls
        // Simulated for this example
        const biblePool = {
            en: { text: "For God so loved the world...", ref: "John 3:16" },
            ko: { text: "하나님이 세상을 이처럼 사랑하사...", ref: "요한복음 3:16" },
            fr: { text: "Car Dieu a tant aimé le monde...", ref: "Jean 3:16" },
            es: { text: "Porque de tal manera amó Dios al mundo...", ref: "Juan 3:16" }
        };
        const item = biblePool[currentLang] || biblePool['en'];
        
        localStorage.setItem('daily_date', today);
        localStorage.setItem('daily_lang', currentLang);
        localStorage.setItem('daily_bible_text', item.text);
        localStorage.setItem('daily_bible_ref', item.ref);
        renderStoredData();
    }
}

function renderStoredData() {
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    if (bText) bText.textContent = `"${localStorage.getItem('daily_bible_text')}"`;
    if (bRef) bRef.textContent = localStorage.getItem('daily_bible_ref');
}

// 4. Expert Feedback: Layout Flexibility Logic
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
}
