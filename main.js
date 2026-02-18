// Global Daily Bible - Comprehensive JS (i18n, Daily Content, Streaks, AI, Card)
let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    loadDailyContent();
    setupEventListeners();
    checkSystemTheme();
    updateFaithStreak(); // Handle Streak
});

function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('share-verse-btn')?.addEventListener('click', shareDailyContent);
}

// 1. Faith Journey Streaks (Simple Storage-based for now)
function updateFaithStreak() {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('last_visit');
    let streak = parseInt(localStorage.getItem('faith_streak')) || 0;

    if (lastLogin === today) {
        showStreak(streak);
        return;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLogin === yesterday.toDateString()) {
        streak += 1;
    } else {
        streak = 1;
    }

    localStorage.setItem('last_visit', today);
    localStorage.setItem('faith_streak', streak);
    showStreak(streak);

    if (streak === 7) {
        alert("🎉 " + (translations[currentLang].faithful_witness || "Faithful Witness (7 Day Streak!)"));
    }
}

function showStreak(count) {
    const badge = document.getElementById('streak-badge');
    const countEl = document.getElementById('streak-count');
    if (badge && countEl) {
        badge.style.display = 'inline-block';
        countEl.textContent = count;
    }
}

// 2. AI Faith Companion (Simulation)
window.askFaithCompanion = function() {
    const input = document.getElementById('user-worry');
    const responseEl = document.getElementById('ai-response');
    const worry = input?.value.trim();
    if (!worry) return;

    const bibleText = localStorage.getItem('daily_bible_text') || "";
    const response = currentLang === 'ko' ? 
        `"주님께서 오늘의 말씀을 통해 당신의 '${worry}'에 대해 말씀하십니다: '${bibleText}'. 주님은 항상 당신과 함께 계십니다."` :
        `"Dear child, remember today's Word regarding your concern about '${worry}': '${bibleText}'. God is with you always."`;
    
    if (responseEl) {
        responseEl.style.opacity = 0;
        setTimeout(() => {
            responseEl.textContent = response;
            responseEl.style.transition = 'opacity 1s';
            responseEl.style.opacity = 1;
        }, 500);
    }
};

// 3. Shareable Verse Card (Canvas)
window.generateVerseCard = function() {
    const text = localStorage.getItem('daily_bible_text');
    const ref = localStorage.getItem('daily_bible_ref');
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1080;

    // Background Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, 1080);
    grad.addColorStop(0, '#2C3E50');
    grad.addColorStop(1, '#B08968');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1080);

    // Text Rendering
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "italic 48px 'Lora'";
    
    // Simple word wrapping for Canvas
    const words = text.split(' ');
    let line = '';
    let y = 450;
    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        if (ctx.measureText(testLine).width > 800 && n > 0) {
            ctx.fillText(line, 540, y);
            line = words[n] + ' ';
            y += 70;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, 540, y);
    
    ctx.font = "bold 36px 'Inter'";
    ctx.fillText(ref, 540, y + 100);
    
    ctx.font = "30px 'Inter'";
    ctx.fillText("dailybible.uk", 540, 1000);

    const link = document.createElement('a');
    link.download = 'daily-verse-card.png';
    link.href = canvas.toDataURL();
    link.click();
};

// ... (Existing applyTranslations, loadDailyContent, etc.)
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = translations[currentLang][key];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });
    document.documentElement.lang = currentLang;
}

window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    loadDailyContent(true);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

async function loadDailyContent(forceRefresh = false) {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('daily_date');
    if (!forceRefresh && storedDate === today) {
        renderStoredData();
    } else {
        // Simple Internal Rotation for stability
        const fallbackVerses = {
            ko: [{ text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" }],
            en: [{ text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" }]
        };
        const list = fallbackVerses[currentLang] || fallbackVerses['en'];
        const item = list[0];
        localStorage.setItem('daily_date', today);
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

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

function checkSystemTheme() {
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
}

async function shareDailyContent() {
    const text = localStorage.getItem('daily_bible_text');
    const ref = localStorage.getItem('daily_bible_ref');
    const shareText = `${text}\n- ${ref}\ndailybible.uk`;
    if (navigator.share) {
        await navigator.share({ title: 'Daily Bible', text: shareText, url: window.location.href });
    } else {
        navigator.clipboard.writeText(shareText);
        alert('Copied!');
    }
}
