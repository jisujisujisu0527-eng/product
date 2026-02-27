// 완벽하게 번역된 다국어 사전
const translations = {
  ko: {
    site_logo: "영국 데일리 바이블",
    nav_home: "홈",
    nav_test: "AI 제자상",
    nav_checkup: "신앙 점검",
    nav_community: "커뮤니티",
    nav_chat: "바울 AI",
    nav_blog: "블로그",
    mainTitle: "영적 동반자 바울 AI",
    mainSubtitle: "성경에 기반한 대화를 통해 지혜와 위로를 구하세요. 바울 AI는 당신이 말씀을 묵상하고 어떤 상황에서도 용기를 얻도록 돕습니다.",
    aiTitle: "AI 성경 해설",
    aiPlaceholder: "예: 요한복음 3장 16절",
    aiBtn: "해설 보기",
    prayerChainTitle: "🙏 현재 함께하는 기도 체인",
    prayerToday: "오늘 함께한 성도",
    prayerTotal: "누적 기도 향연",
    prayBtn: "지금 기도 올리기 & 참여하기",
    prayBtnDone: "참여 완료 (내일 다시 참여 가능)",
    spiritualRestTitle: "오늘의 영적 안식",
    moodPrompt: "오늘의 감정 상태를 선택해 주세요.",
    dailyVerseTitle: "📖 오늘의 말씀",
    daily_bible: "📜 오늘의 말씀",
    dailyPrayerTitle: "🙏 오늘의 기도",
    daily_prayer: "🙏 오늘의 기도",
    dailyMissionTitle: "📢 오늘의 전도",
    daily_mission: "📢 오늘의 전도",
    saveCardBtn: "📸 말씀 카드 저장",
    streakPrefix: "🔥 ",
    streakSuffix: "일째 동행 중",
    footer_rights: "© 2026 영국 데일리 바이블. Shared Faith for a Better World.",
    prayer_board_title: "🙏 최신 기도 제목"
  },
  en: {
    site_logo: "British Daily Bible",
    nav_home: "Home",
    nav_test: "AI Test",
    nav_checkup: "Check",
    nav_community: "Community",
    nav_chat: "Paul AI",
    nav_blog: "Blog",
    mainTitle: "Spiritual Companion Paul AI",
    mainSubtitle: "Seek wisdom and comfort through a bible-based conversation. Paul AI is here to help you reflect on scripture and find encouragement in every situation.",
    aiTitle: "AI Bible Verse Commentary",
    aiPlaceholder: "e.g., John 3:16",
    aiBtn: "Get Insight",
    prayerChainTitle: "🙏 United Prayer Chain",
    prayerToday: "Praying Together Today",
    prayerTotal: "Total Prayers Offered",
    prayBtn: "Offer Prayer & Join",
    prayBtnDone: "Joined (Come back tomorrow)",
    spiritualRestTitle: "Today's Spiritual Rest",
    moodPrompt: "Please select your mood.",
    dailyVerseTitle: "📖 Today's Verse",
    daily_bible: "📜 Today's Verse",
    dailyPrayerTitle: "🙏 Today's Prayer",
    daily_prayer: "🙏 Today's Prayer",
    dailyMissionTitle: "📢 Today's Mission",
    daily_mission: "📢 Today's Mission",
    saveCardBtn: "📸 SAVE CARD",
    streakPrefix: "🔥 Day ",
    streakSuffix: " of your spiritual journey",
    footer_rights: "© 2026 British Daily Bible. Shared Faith for a Better World.",
    prayer_board_title: "🙏 Recent Prayer Requests"
  }
};

// 2. 매일 바뀌는 콘텐츠도 다국어로 분리!
const dailyContents = [
  {
    verseHtml: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라<br>I can do all things through Christ who strengthens me.<br><br><b>빌립보서 4:13 / Philippians 4:13</b>",
    prayer: {
      ko: "주님, 오늘 하루도 나의 지혜가 아닌 주님의 능력을 의지하게 하소서. 불안한 마음을 평안으로 채워주시길 기도합니다. 아멘.",
      en: "Lord, help me to rely on Your power today, not my own wisdom. I pray that You fill my anxious heart with peace. Amen."
    },
    evangelism: {
      ko: "💡 오늘의 미션: 오늘 만나는 첫 사람에게 먼저 밝게 웃으며 인사하고, 따뜻한 칭찬을 건네보세요.",
      en: "💡 Today's Mission: Smile brightly and greet the first person you meet today, offering them a warm compliment."
    }
  },
  {
    verseHtml: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라<br>So do not fear, for I am with you; do not be dismayed, for I am your God.<br><br><b>이사야 41:10 / Isaiah 41:10</b>",
    prayer: {
      ko: "사랑의 하나님, 어떤 상황 속에서도 주님이 함께하심을 믿고 담대하게 나아가게 하소서. 아멘.",
      en: "Loving God, help me to move forward boldly, believing that You are with me in any situation. Amen."
    },
    evangelism: {
      ko: "💡 오늘의 미션: 힘들어하는 지인이나 가족에게 따뜻한 안부 메시지와 함께 응원을 전해보세요.",
      en: "💡 Today's Mission: Send a warm message of support and encouragement to a friend or family member who is struggling."
    }
  }
];

const routineData = {
  anxious: {
    ko: "걱정하지 마세요. 주님께서 당신의 우편에서 그늘이 되십니다. 깊은 호흡을 세 번 하고, 시편 121편을 묵상해 보세요.",
    en: "Do not be anxious. The Lord is your shade at your right hand. Take three deep breaths and meditate on Psalm 121."
  },
  grateful: {
    ko: "감사는 기적을 낳습니다! 오늘 당신이 감사한 일 3가지를 노트에 적어보며 기쁨을 만끽하세요.",
    en: "Gratitude creates miracles! Write down 3 things you are thankful for today and soak in the joy."
  },
  joyful: {
    ko: "주님 안에서 기뻐하는 것이 우리의 힘입니다! 이 기쁨을 이웃에게 미소로 흘려보내는 하루를 보내세요.",
    en: "The joy of the Lord is our strength! Share this joy with your neighbors today with a warm smile."
  }
};

// 현재 언어 가져오기
let currentLang = localStorage.getItem('user-lang') || 'ko';

function updateLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('user-lang', lang);
  document.documentElement.lang = lang;

  // 1. 일반 HTML 텍스트 변경
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerText = translations[lang][key];
    }
  });

  // 2. input placeholder 변경
  const verseInput = document.getElementById('verseInput');
  if (verseInput && translations[lang].aiPlaceholder) {
    verseInput.placeholder = translations[lang].aiPlaceholder;
  }

  // 3. 데일리 콘텐츠 다국어 렌더링
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 3600000));
  const todayIndex = kst.getDate() % dailyContents.length;

  const verseElement = document.getElementById('dailyVerseText');
  const prayerElement = document.getElementById('dailyPrayer');
  const evangelismElement = document.getElementById('dailyEvangelism');
  
  if (verseElement) verseElement.innerHTML = dailyContents[todayIndex].verseHtml;
  if (prayerElement) prayerElement.innerText = dailyContents[todayIndex].prayer[lang];
  if (evangelismElement) evangelismElement.innerText = dailyContents[todayIndex].evangelism[lang];

  // 4. 동행일수 (Streak) 다국어 렌더링
  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    let streakCount = parseInt(localStorage.getItem('streakCount')) || 1;
    streakBadge.innerText = (translations[lang].streakPrefix || "") + streakCount + (translations[lang].streakSuffix || "");
  }

  // 5. 기도 버튼
  const prayBtn = document.getElementById('prayBtn');
  if (prayBtn) {
    const todayStr = `${kst.getFullYear()}-${kst.getMonth() + 1}-${kst.getDate()}`;
    const lastClicked = localStorage.getItem('lastPrayerDate');
    if (lastClicked === todayStr) {
      prayBtn.innerText = translations[lang].prayBtnDone;
    } else {
      prayBtn.innerText = translations[lang].prayBtn;
    }
  }
  
  // select 박스 동기화
  const langSelect = document.getElementById('langSelect');
  if (langSelect) langSelect.value = lang;
  const langSelectNav = document.getElementById('lang-select');
  if (langSelectNav) langSelectNav.value = lang;
}

// 호환성을 위한 별칭
window.applyLanguage = updateLanguage;
window.translate = (key, lang = currentLang) => translations[lang][key] || key;
window.translations = translations;

// 초기화 로직
window.addEventListener('DOMContentLoaded', () => {
  updateLanguage(currentLang);
  
  const langSelect = document.getElementById('langSelect');
  if (langSelect) {
    langSelect.addEventListener('change', (e) => updateLanguage(e.target.value));
  }
  const langSelectNav = document.getElementById('lang-select');
  if (langSelectNav) {
    langSelectNav.addEventListener('change', (e) => updateLanguage(e.target.value));
  }

  const routineElement = document.getElementById('dailyRoutine');
  document.getElementById('btnAnxious')?.addEventListener('click', () => {
    if(routineElement) routineElement.innerText = routineData.anxious[currentLang];
  });
  document.getElementById('btnGrateful')?.addEventListener('click', () => {
    if(routineElement) routineElement.innerText = routineData.grateful[currentLang];
  });
  document.getElementById('btnJoyful')?.addEventListener('click', () => {
    if(routineElement) routineElement.innerText = routineData.joyful[currentLang];
  });
});
