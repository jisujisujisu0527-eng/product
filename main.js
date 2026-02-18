// i18n Translations & Content Data
const translations = {
    ko: {
        nav_home: "홈", nav_about: "소개", nav_test: "제자상 테스트", nav_checkup: "신앙 점검", nav_dashboard: "대시보드",
        nav_privacy: "개인정보처리방침", nav_terms: "이용약관",
        main_title: "오늘의 성경 구절", loading: "말씀을 불러오고 있습니다...",
        btn_new_verse: "새로운 구절", btn_theme: "테마 변경", btn_refresh: "새로고침", btn_send: "보내기",
        guide_title: "신앙 성장을 위한 유용한 가이드",
        guide_1_title: "성경 통독 입문", guide_1_desc: "창세기부터 요한계시록까지, 체계적인 읽기 플랜으로 하나님의 구속사를 파악해 보세요.",
        guide_2_title: "효과적인 기도 방법", guide_2_desc: "ACTS 기법(찬양, 고백, 감사, 간구)을 통해 더 깊은 주님과의 대화를 시작하세요.",
        guide_3_title: "묵상의 시간(QT)", guide_3_desc: "매일 15분, 조용한 장소에서 말씀을 되새기며 삶의 방향을 정립하세요.",
        insight_title: "오늘의 영적 인사이트: 묵상의 힘",
        insight_p1: "우리는 매일 수많은 정보의 홍수 속에서 살아갑니다. 분주함 속에서 '성경 묵상'은 우리 영혼이 숨을 쉴 수 있는 생명줄과 같습니다.",
        insight_p2: "묵상의 히브리어 어원 '하가'는 '작은 소리로 읊조리다'라는 뜻입니다. 이는 말씀을 반복적으로 되새기며 삶에 녹여내는 과정을 의미합니다.",
        prayer_title: "오늘의 기도구절", evangelism_title: "오늘의 전도구절",
        contact_title: "제휴 및 기도요청"
    },
    en: {
        nav_home: "Home", nav_about: "About", nav_test: "Disciple Test", nav_checkup: "Faith Check", nav_dashboard: "Dashboard",
        nav_privacy: "Privacy Policy", nav_terms: "Terms of Use",
        main_title: "Daily Bible Verse", loading: "Loading Word of God...",
        btn_new_verse: "New Verse", btn_theme: "Switch Theme", btn_refresh: "Refresh", btn_send: "Send",
        guide_title: "Useful Guides for Faith Growth",
        guide_1_title: "Intro to Bible Reading", guide_1_desc: "Understand God's redemptive history through a systematic reading plan.",
        guide_2_title: "Effective Prayer", guide_2_desc: "Start a deeper conversation with the Lord using the ACTS method.",
        guide_3_title: "Meditation Time (QT)", guide_3_desc: "Spend 15 mins daily reflecting on the Word to set your life's direction.",
        insight_title: "Spiritual Insight: Power of Meditation",
        insight_p1: "We live in a flood of information. Amidst the busyness, 'Bible Meditation' is a lifeline for our souls to breathe.",
        insight_p2: "The Hebrew root of meditation, 'Hagah', means 'to mutter'. It means repeating the Word and melting it into your life.",
        prayer_title: "Prayer Verse", evangelism_title: "Evangelism Verse",
        contact_title: "Partnership & Prayer Request"
    }
};

const versesData = {
    ko: {
        popular: [
            { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", ref: "시편 23:1" },
            { text: "너희는 먼저 그의 나라와 그의 의를 구하라", ref: "마태복음 6:33" },
            { text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라", ref: "살전 5:16-18" },
            { text: "두려워하지 말라 내가 너와 함께 함이라", ref: "이사야 41:10" },
            { text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", ref: "빌립보서 4:13" }
        ],
        prayer: [
            { text: "구하라 그러면 너희에게 주실 것이요 찾으라 그러면 찾을 것이요", ref: "마태복음 7:7" },
            { text: "너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라", ref: "요한복음 14:1" },
            { text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로 아뢰라", ref: "빌립보서 4:6" },
            { text: "부르짖으라 내가 네게 응답하겠고 네가 알지 못하는 크고 은밀한 일을 보이리라", ref: "예레미야 33:3" },
            { text: "너희 중에 누구든지 지혜가 부족하거든 모든 사람에게 후히 주시고 꾸짖지 아니하시는 하나님께 구하라", ref: "야고보서 1:5" }
        ],
        evangelism: [
            { text: "오직 성령이 너희에게 임하시면 너희가 권능을 받고... 내 증인이 되리라", ref: "사도행전 1:8" },
            { text: "너희는 온 천하에 다니며 모든 피조물에게 복음을 전파하라", ref: "마가복음 16:15" },
            { text: "주 예수를 믿으라 그리하면 너와 네 집이 구원을 받으리라", ref: "사도행전 16:31" },
            { text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니", ref: "요한복음 3:16" },
            { text: "내가 복음을 부끄러워하지 아니하노니 이 복음은 모든 믿는 자에게 구원을 주시는 하나님의 능력이 됨이라", ref: "로마서 1:16" }
        ]
    },
    en: {
        popular: [
            { text: "The LORD is my shepherd; I shall not want.", ref: "Psalm 23:1" },
            { text: "But seek first the kingdom of God and his righteousness.", ref: "Matthew 6:33" },
            { text: "Rejoice always, pray without ceasing, give thanks in all circumstances.", ref: "1 Thess 5:16-18" },
            { text: "Fear not, for I am with you.", ref: "Isaiah 41:10" },
            { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" }
        ],
        prayer: [
            { text: "Ask, and it will be given to you; seek, and you will find.", ref: "Matthew 7:7" },
            { text: "Do not let your hearts be troubled. Trust in God; trust also in me.", ref: "John 14:1" },
            { text: "Do not be anxious about anything, but in everything by prayer and supplication.", ref: "Philippians 4:6" },
            { text: "Call to me and I will answer you.", ref: "Jeremiah 33:3" },
            { text: "If any of you lacks wisdom, let him ask God.", ref: "James 1:5" }
        ],
        evangelism: [
            { text: "But you will receive power when the Holy Spirit has come upon you... you will be my witnesses.", ref: "Acts 1:8" },
            { text: "Go into all the world and proclaim the gospel to the whole creation.", ref: "Mark 16:15" },
            { text: "Believe in the Lord Jesus, and you will be saved, you and your household.", ref: "Acts 16:31" },
            { text: "For God so loved the world, that he gave his only Son.", ref: "John 3:16" },
            { text: "For I am not ashamed of the gospel, for it is the power of God for salvation.", ref: "Romans 1:16" }
        ]
    }
};

// State
let currentLang = localStorage.getItem('lang') || 'ko';

// Elements
const verseTextEl = document.getElementById('verse-text');
const verseRefEl = document.getElementById('verse-reference');
const prayerTextEl = document.getElementById('prayer-verse-text');
const prayerRefEl = document.getElementById('prayer-verse-reference');
const evanTextEl = document.getElementById('evangelism-verse-text');
const evanRefEl = document.getElementById('evangelism-verse-reference');

// Functions
window.changeLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    applyTranslations();
    refreshAllVerses();
};

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.documentElement.lang = currentLang;
}

function refreshAllVerses() {
    displayRandomVerse('popular', verseTextEl, verseRefEl);
    displayRandomVerse('prayer', prayerTextEl, prayerRefEl);
    displayRandomVerse('evangelism', evanTextEl, evanRefEl);
}

function displayRandomVerse(type, textEl, refEl) {
    const list = versesData[currentLang][type];
    const random = list[Math.floor(Math.random() * list.length)];
    if (textEl) textEl.textContent = `\"${random.text}\"`;
    if (refEl) refEl.textContent = random.ref;
}

// Theme Toggle
document.getElementById('theme-toggle-btn').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

// Sync Event Listeners for New Verses
document.getElementById('new-verse-btn').addEventListener('click', () => displayRandomVerse('popular', verseTextEl, verseRefEl));
document.getElementById('new-prayer-verse-btn')?.addEventListener('click', () => displayRandomVerse('prayer', prayerTextEl, prayerRefEl));
document.getElementById('new-evangelism-verse-btn')?.addEventListener('click', () => displayRandomVerse('evangelism', evanTextEl, evanRefEl));

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyTranslations();
    refreshAllVerses();
});
