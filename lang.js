// --- [1. 완벽하게 번역된 다국어 사전] ---
const translations = {
  ko: {
    // 상단 메뉴바 (모든 페이지 공통)
    navHome: "홈",
    navDisciples: "AI 제자상",
    navCheck: "신앙 점검",
    navCommunity: "커뮤니티",
    navPaulAI: "바울 AI",
    navBlog: "블로그",
    
    // 메인 페이지 & 기능들
    mainTitle: "영적 동반자 바울 AI",
    mainSubtitle: "성경에 기반한 대화를 통해 지혜와 위로를 구하세요. 바울 AI는 당신이 말씀을 묵상하고 어떤 상황에서도 용기를 얻도록 돕습니다.",
    aiTitle: "AI 성경 해설",
    aiPlaceholder: "예: 마태복음 1장 1절",
    aiBtn: "해설 보기",
    prayerChainTitle: "🙏 현재 함께하는 기도 체인",
    prayerToday: "오늘 함께한 성도",
    prayerTotal: "누적 기도 향연",
    prayBtn: "지금 기도 올리기 & 참여하기",
    prayBtnDone: "참여 완료 (내일 다시 참여 가능)",
    spiritualRestTitle: "오늘의 영적 안식",
    moodPrompt: "오늘의 감정 상태를 선택해 주세요.",
    dailyVerseTitle: "📖 오늘의 말씀",
    dailyPrayerTitle: "🙏 오늘의 기도",
    dailyMissionTitle: "📢 오늘의 전도",
    saveCardBtn: "📸 SAVE CARD",
    streakPrefix: "🔥 ",
    streakSuffix: "일째 동행 중"
  },
  en: {
    // Navigation Menu
    navHome: "Home",
    navDisciples: "AI Discipleship",
    navCheck: "Faith Check",
    navCommunity: "Community",
    navPaulAI: "Paul AI",
    navBlog: "Blog",

    // Main Page & Features
    mainTitle: "Spiritual Companion Paul AI",
    mainSubtitle: "Seek wisdom and comfort through a bible-based conversation. Paul AI is here to help you reflect on scripture and find encouragement in every situation.",
    aiTitle: "AI Bible Verse Commentary",
    aiPlaceholder: "e.g., Matthew 1:1",
    aiBtn: "Get Insight",
    prayerChainTitle: "🙏 United Prayer Chain",
    prayerToday: "Praying Together Today",
    prayerTotal: "Total Prayers Offered",
    prayBtn: "Offer Prayer & Join",
    prayBtnDone: "Joined (Come back tomorrow)",
    spiritualRestTitle: "Today's Spiritual Rest",
    moodPrompt: "Please select your mood.",
    dailyVerseTitle: "📖 Today's Verse",
    dailyPrayerTitle: "🙏 Today's Prayer",
    dailyMissionTitle: "📢 Today's Mission",
    saveCardBtn: "📸 SAVE CARD",
    streakPrefix: "🔥 Day ",
    streakSuffix: " of your spiritual journey"
  }
};

// --- [2. 매일 바뀌는 콘텐츠 (다국어 분리)] ---
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
  }
];

const routineData = {
  anxious: { ko: "걱정하지 마세요. 주님께서 당신의 우편에서 그늘이 되십니다.", en: "Do not be anxious. The Lord is your shade at your right hand." },
  grateful: { ko: "감사는 기적을 낳습니다! 오늘 감사한 일 3가지를 적어보세요.", en: "Gratitude creates miracles! Write down 3 things you are thankful for today." },
  joyful: { ko: "이 기쁨을 이웃에게 미소로 흘려보내는 하루를 보내세요.", en: "Share this joy with your neighbors today with a warm smile." }
};

// --- [3. 언어 변경 및 화면 적용 함수] ---
function applyLanguage(lang) {
  localStorage.setItem('userLang', lang); // 선택한 언어 저장

  // 1. 모든 페이지의 일반 텍스트 변경
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = translations[lang][key];
      } else {
        el.innerText = translations[lang][key];
      }
    }
  });

  // 2. 입력창(input) placeholder 변경
  const verseInput = document.getElementById('verseInput');
  if (verseInput) verseInput.placeholder = translations[lang].aiPlaceholder;

  // 3. 언어 선택 드롭다운(select) 상태 동기화 (모든 페이지의 셀렉트 박스를 똑같이 맞춤)
  document.querySelectorAll('.lang-selector').forEach(select => {
    select.value = lang;
  });

  // 4. 데일리 콘텐츠 적용 (해당 요소가 있는 페이지에서만 작동)
  const now = new Date();
  const kst = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + (9 * 3600000));
  const todayIndex = kst.getDate() % dailyContents.length;

  const prayerEl = document.getElementById('dailyPrayer');
  const evangelismEl = document.getElementById('dailyEvangelism');
  if (prayerEl) prayerEl.innerText = dailyContents[todayIndex].prayer[lang];
  if (evangelismEl) evangelismEl.innerText = dailyContents[todayIndex].evangelism[lang];

  // 5. 동행일수 (Streak)
  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    let streakCount = parseInt(localStorage.getItem('streakCount')) || 1;
    streakBadge.innerText = (translations[lang].streakPrefix || "") + streakCount + (translations[lang].streakSuffix || "");
  }
}

// --- [4. 페이지 로딩 시 자동 실행] ---
document.addEventListener('DOMContentLoaded', () => {
  // 브라우저에 저장된 언어 불러오기 (없으면 한국어 기본)
  let savedLang = localStorage.getItem('userLang') || 'ko';
  applyLanguage(savedLang);

  // 화면에 있는 모든 '언어 선택 박스'에 클릭 이벤트 연결
  document.querySelectorAll('.lang-selector').forEach(select => {
    select.addEventListener('change', (e) => {
      applyLanguage(e.target.value);
    });
  });

  // 감정 버튼 이벤트 (해당 페이지에만 작동)
  const routineElement = document.getElementById('dailyRoutine');
  document.getElementById('btnAnxious')?.addEventListener('click', () => {
    if(routineElement) routineElement.innerText = routineData.anxious[localStorage.getItem('userLang') || 'ko'];
  });
  document.getElementById('btnGrateful')?.addEventListener('click', () => {
    if(routineElement) routineElement.innerText = routineData.grateful[localStorage.getItem('userLang') || 'ko'];
  });
  document.getElementById('btnJoyful')?.addEventListener('click', () => {
    if(routineElement) routineElement.innerText = routineData.joyful[localStorage.getItem('userLang') || 'ko'];
  });
});
