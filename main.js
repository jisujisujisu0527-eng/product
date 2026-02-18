// Global Daily Bible - Comprehensive JS (i18n, Verses, Utilities)

// The 'translations' object is now loaded from translations.js
let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

const versesData = {
    ko: [
        { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1", version: "KRV" },
        { text: "너희는 먼저 그의 나라와 그의 의를 구하라", ref: "마태복음 6:33", version: "KRV" },
        { text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라", ref: "살전 5:16-18", version: "KRV" },
        { text: "두려워하지 말라 내가 너와 함께 함이라", ref: "이사야 41:10", version: "KRV" }
    ],
    en: [
        { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1", version: "NIV" },
        { text: "But seek first the kingdom of God and his righteousness.", ref: "Matthew 6:33", version: "NIV" },
        { text: "Rejoice always, pray without ceasing, give thanks in all circumstances.", ref: "1 Thess 5:16-18", version: "ESV" },
        { text: "Fear not, for I am with you; be not dismayed, for I am your God.", ref: "Isaiah 41:10", version: "ESV" }
    ],
    es: [
        { text: "El Señor es mi pastor, nada me falta.", ref: "Salmo 23:1", version: "NVI" },
        { text: "Busquen primero el reino de Dios y su justicia.", ref: "Mateo 6:33", version: "NVI" }
    ],
    fr: [
        { text: "L'Éternel est mon berger: je ne manquerai de rien.", ref: "Psaume 23:1", version: "LSG" },
        { text: "Cherchez premièrement le royaume et la justice de Dieu.", ref: "Matthieu 6:33", version: "LSG" }
    ]
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    refreshVerses();
    setupEventListeners();
    checkSystemTheme();
});

function setupEventListeners() {
    document.getElementById('new-verse-btn')?.addEventListener('click', () => refreshVerses(true));
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('share-verse-btn')?.addEventListener('click', shareVerse);
}

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
    
    // Update active state in nav
    document.querySelectorAll('.nav-links a').forEach(link => {
        if (link.getAttribute('href') === window.location.pathname.split('/').pop()) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    refreshVerses();
    // Dispatch event for other scripts to listen
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

function refreshVerses(isRandom = false) {
    const list = versesData[currentLang] || versesData['en'];
    const seed = isRandom ? Math.floor(Math.random() * list.length) : (new Date().getDate() % list.length);
    const item = list[seed];

    const textEl = document.getElementById('verse-text');
    const refEl = document.getElementById('verse-reference');

    if (textEl) textEl.textContent = `"${item.text}"`;
    if (refEl) {
        const versionLabel = (currentLang === 'ko' || currentLang === 'en') ? ` (${item.version})` : "";
        refEl.innerHTML = `${item.ref}${versionLabel}`;
    }
}

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function checkSystemTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
}

async function shareVerse() {
    const textEl = document.getElementById('verse-text');
    if (!textEl) return;
    const text = textEl.textContent;
    const ref = document.getElementById('verse-reference')?.textContent || '';
    const siteTitle = translations[currentLang]?.site_logo || 'British Daily Bible';
    const shareText = `${text}\n- ${ref}\n\nShared via ${siteTitle}`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: currentLang === 'ko' ? '오늘의 성경 구절' : 'Daily Bible Verse',
                text: shareText,
                url: window.location.href
            });
        } catch (err) {
            console.log('Share failed', err);
        }
    } else {
        // Fallback: Copy to clipboard
        navigator.clipboard.writeText(shareText);
        alert(currentLang === 'ko' ? '클립보드에 복사되었습니다!' : 'Copied to clipboard!');
    }
}
