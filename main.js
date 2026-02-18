// Global Daily Bible - Comprehensive JS (i18n, Daily Content, Utilities)

let currentLang = localStorage.getItem('lang') || (navigator.language.startsWith('ko') ? 'ko' : 'en');

// Fallback pools for Prayer and Mission (since APIs for these are not common)
const prayerPool = {
    ko: [
        "오늘 하루도 주님의 은혜 안에서 평강을 누리게 하소서.",
        "우리 삶의 모든 순간이 하나님의 영광을 드러내는 예배가 되게 하소서.",
        "어려움 속에서도 주님의 선하심을 신뢰하는 믿음을 주소서.",
        "이웃을 내 몸과 같이 사랑하며 주님의 사랑을 실천하게 하소서."
    ],
    en: [
        "May the grace of the Lord bring you peace throughout this day.",
        "Let every moment of our lives be worship that reveals God's glory.",
        "Give us faith to trust in your goodness even in difficulties.",
        "Help us love our neighbors as ourselves and practice Your love."
    ],
    es: [
        "Que la gracia del Señor te traiga paz durante este día.",
        "Que cada momento sea adoración para la gloria de Dios.",
        "Danos fe para confiar en Tu bondad."
    ],
    fr: [
        "Que la grâce du Seigneur vous apporte la paix aujourd'hui.",
        "Que chaque instant soit une louange à la gloire de Dieu.",
        "Donne-nous la foi pour avoir confiance en Ta bonté."
    ]
};

const missionPool = {
    ko: [
        "오늘 만나는 사람에게 따뜻한 미소와 함께 주님의 사랑을 전해보세요.",
        "삶의 현장에서 정직과 성실로 그리스도의 향기를 드러내세요.",
        "가까운 친구나 가족에게 감사의 마음을 담은 성경 구절을 공유해보세요.",
        "어려움을 겪는 이웃에게 먼저 다가가 위로의 말을 건네보세요."
    ],
    en: [
        "Share the Lord's love with a warm smile to those you meet today.",
        "Reveal the fragrance of Christ through honesty and integrity in your life.",
        "Share a Bible verse with gratitude to a close friend or family member.",
        "Reach out to a neighbor in need with words of comfort first."
    ],
    es: [
        "Comparte el amor del Señor con una sonrisa hoy.",
        "Muestra la fragancia de Cristo a través de tu integridad.",
        "Comparte un versículo bíblico con un amigo cercano."
    ],
    fr: [
        "Partagez l'amour du Seigneur avec un sourire aujourd'hui.",
        "Révélez le parfum du Christ par votre intégrité.",
        "Partagez un verset biblique avec un ami proche."
    ]
};

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    loadDailyContent();
    setupEventListeners();
    checkSystemTheme();
});

function setupEventListeners() {
    document.getElementById('theme-toggle-btn')?.addEventListener('click', toggleTheme);
    document.getElementById('share-verse-btn')?.addEventListener('click', shareDailyContent);
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
}

window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    loadDailyContent(true); // Re-fetch or re-render for new language
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
};

// Logic for "Once a Day" update based on local timezone midnight
async function loadDailyContent(forceRefresh = false) {
    const today = new Date().toDateString(); // User's local date
    const storedDate = localStorage.getItem('daily_date');
    const storedLang = localStorage.getItem('daily_lang');

    if (!forceRefresh && storedDate === today && storedLang === currentLang) {
        renderStoredData();
    } else {
        await fetchNewDailyData(today);
    }
}

async function fetchNewDailyData(today) {
    // 1. Fetch Bible Verse (API)
    // For demo/stability, we use a seed based on date to pick from a list or use a stable API
    // bible-api.com is good but has limited translations.
    try {
        let bibleData = { text: "", ref: "" };
        
        // For English, we can use the API
        if (currentLang === 'en') {
            const res = await fetch('https://bible-api.com/john+3:16');
            const data = await res.json();
            bibleData.text = data.text.trim();
            bibleData.ref = data.reference;
        } else {
            // For other languages, use internal rotation to ensure quality
            const fallbackVerses = {
                ko: [
                    { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
                    { text: "너희는 먼저 그의 나라와 그의 의를 구하라", ref: "마태복음 6:33" }
                ],
                es: [
                    { text: "El Señor es mi pastor, nada me falta.", ref: "Salmo 23:1" },
                    { text: "Busquen primero el reino de Dios.", ref: "Mateo 6:33" }
                ],
                fr: [
                    { text: "L'Éternel est mon berger: je ne manquerai de rien.", ref: "Psaume 23:1" },
                    { text: "Cherchez premièrement le royaume de Dieu.", ref: "Matthieu 6:33" }
                ]
            };
            const list = fallbackVerses[currentLang] || fallbackVerses['ko'];
            const seed = new Date().getDate() % list.length;
            bibleData = list[seed];
        }

        // 2. Get Prayer and Mission based on date seed
        const dayOfMonth = new Date().getDate();
        const prayerList = prayerPool[currentLang] || prayerPool['en'];
        const missionList = missionPool[currentLang] || missionPool['en'];
        
        const prayer = prayerList[dayOfMonth % prayerList.length];
        const mission = missionList[dayOfMonth % missionList.length];

        // Store
        localStorage.setItem('daily_date', today);
        localStorage.setItem('daily_lang', currentLang);
        localStorage.setItem('daily_bible_text', bibleData.text);
        localStorage.setItem('daily_bible_ref', bibleData.ref);
        localStorage.setItem('daily_prayer', prayer);
        localStorage.setItem('daily_mission', mission);

        renderStoredData();
    } catch (e) {
        console.error("Failed to fetch daily data", e);
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

function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function checkSystemTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') document.body.classList.add('dark-mode');
}

async function shareDailyContent() {
    const bText = localStorage.getItem('daily_bible_text');
    const bRef = localStorage.getItem('daily_bible_ref');
    const shareText = `[Today's Word]\n${bText}\n- ${bRef}\n\nShared via British Daily Bible`;

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Daily Spiritual Food',
                text: shareText,
                url: window.location.href
            });
        } catch (err) {
            console.log('Share failed', err);
        }
    } else {
        navigator.clipboard.writeText(shareText);
        alert(currentLang === 'ko' ? '클립보드에 복사되었습니다!' : 'Copied to clipboard!');
    }
}
