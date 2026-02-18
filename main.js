// Global Daily Bible - Comprehensive JS (i18n, Verses, Utilities)

const translations = {
    ko: {
        nav_home: "홈", nav_blog: "블로그", nav_about: "소개", nav_test: "AI 제자상", nav_checkup: "신앙 점검", nav_dashboard: "대시보드",
        main_title: "오늘의 성경 구절", loading: "말씀을 불러오고 있습니다...",
        btn_new_verse: "새로운 구절", btn_theme: "테마 변경", btn_share: "말씀 공유",
        guide_title: "영적 성장을 위한 가이드",
        prayer_title: "오늘의 기도구절", evangelism_title: "오늘의 전도구절",
        footer_rights: "© 2026 영국 데일리 바이블. All rights reserved.",
        guide_1_title: "아침 묵상",
        guide_1_desc: "준비된 묵상 플랜과 함께 하나님의 임재 안에서 하루를 시작하세요.",
        guide_2_title: "글로벌 공동체",
        guide_2_desc: "한국과 영국의 수만 명의 성도들과 함께 매일 기도와 말씀에 동참하세요.",
        site_logo: "영국 데일리 바이블",
        btn_start_test: "테스트 시작하기",
        checkup_promo_desc: "인공지능이 분석하는 나의 영적 특성, 8가지 성경적 유형으로 확인해보세요."
    },
    en: {
        nav_home: "Home", nav_blog: "Blog", nav_about: "About", nav_test: "AI Disciple", nav_checkup: "Faith Check", nav_dashboard: "Dashboard",
        main_title: "Daily Bible Verse", loading: "Loading Holy Word...",
        btn_new_verse: "New Verse", btn_theme: "Switch Appearance", btn_share: "Share Verse",
        guide_title: "Guides for Spiritual Growth",
        prayer_title: "Prayer Verse", evangelism_title: "Evangelism Verse",
        footer_rights: "© 2026 British Daily Bible. All rights reserved.",
        guide_1_title: "Morning Reflection",
        guide_1_desc: "Start your day in the presence of God with our curated meditation plan.",
        guide_2_title: "Global Community",
        guide_2_desc: "Join thousands of believers across the UK and Korea in daily prayer and study.",
        site_logo: "British Daily Bible",
        btn_start_test: "Start AI Test",
        checkup_promo_desc: "Let AI analyze your spiritual traits through 8 biblical archetypes."
    }
};

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
    ]
};

let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

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
        if (translations[currentLang][key]) el.textContent = translations[currentLang][key];
    });
    document.documentElement.lang = currentLang;
}

window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    refreshVerses();
};

function refreshVerses(isRandom = false) {
    const list = versesData[currentLang];
    const seed = isRandom ? Math.floor(Math.random() * list.length) : (new Date().getDate() % list.length);
    const item = list[seed];

    const textEl = document.getElementById('verse-text');
    const refEl = document.getElementById('verse-reference');

    if (textEl) textEl.textContent = `"${item.text}"`;
    if (refEl) {
        const versionLabel = currentLang === 'ko' ? "" : ` (${item.version})`;
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
    const text = document.getElementById('verse-text').textContent;
    const ref = document.getElementById('verse-reference').textContent;
    const siteTitle = currentLang === 'ko' ? '영국 데일리 바이블' : 'British Daily Bible';
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
