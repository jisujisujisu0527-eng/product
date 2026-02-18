// dailybible.uk - Master Control System (SiteManager)

const SiteManager = {
    modules: {
        i18n: false,
        dailyContent: false,
        streaks: false,
        theme: false
    },
    // 시스템 준비 완료 체크
    checkReady: function() {
        const loadedModules = Object.keys(this.modules).filter(m => this.modules[m]);
        const totalModules = Object.keys(this.modules).length;
        
        console.log(`[System] Loading Progress: ${loadedModules.length}/${totalModules}`);
        
        if (loadedModules.length === totalModules) {
            const loader = document.getElementById('main-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => loader.style.display = 'none', 500);
            }
            console.log("✅ dailybible.uk: All systems fully loaded.");
        }
    },
    // 오류 로깅 및 피드백
    logError: function(moduleName, error) {
        console.error(`❌ Error in [${moduleName}]:`, error);
        const statusEl = document.getElementById(`${moduleName}-status`);
        if (statusEl) {
            statusEl.textContent = translations[currentLang]?.error || "Service temporarily unavailable.";
            statusEl.style.color = "#e74c3c";
        }
    }
};

// 안전한 비동기 실행 래퍼
async function safeExecute(moduleName, func) {
    try {
        await func();
        SiteManager.modules[moduleName] = true;
    } catch (error) {
        SiteManager.logError(moduleName, error);
    } finally {
        SiteManager.checkReady();
    }
}

let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

// 초기화 시퀀스
document.addEventListener('DOMContentLoaded', async () => {
    // 1. 테마 적용 (동기 방식)
    safeExecute('theme', () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') document.body.classList.add('dark-mode');
    });

    // 2. 번역 적용
    safeExecute('i18n', () => {
        applyTranslations();
    });

    // 3. 데일리 콘텐츠 로드 (비동기)
    safeExecute('dailyContent', async () => {
        await loadDailyContent();
    });

    // 4. 출석 스트릭 체크
    safeExecute('streaks', () => {
        updateFaithStreak();
    });

    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('share-verse-btn')?.addEventListener('click', shareDailyContent);
}

// --- 핵심 기능들 ---

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

async function loadDailyContent(forceRefresh = false) {
    const today = new Date().toDateString();
    const storedDate = localStorage.getItem('daily_date');
    
    if (!forceRefresh && storedDate === today) {
        renderStoredData();
    } else {
        // 실제 운영 시에는 여기서 API 호출
        const fallback = {
            ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
            en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" }
        };
        const item = fallback[currentLang] || fallback['en'];
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

function updateFaithStreak() {
    const today = new Date().toDateString();
    const lastLogin = localStorage.getItem('last_visit');
    let streak = parseInt(localStorage.getItem('faith_streak')) || 0;

    if (lastLogin !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        streak = (lastLogin === yesterday.toDateString()) ? streak + 1 : 1;
        localStorage.setItem('last_visit', today);
        localStorage.setItem('faith_streak', streak);
    }
    
    const countEl = document.getElementById('streak-count');
    const badge = document.getElementById('streak-badge');
    if (countEl && badge) {
        countEl.textContent = streak;
        badge.style.display = 'inline-block';
    }
}

// --- 유틸리티 ---

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    loadDailyContent(true);
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

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
