// --- [1. 완벽하게 번역된 다국어 사전 (모든 페이지 통합)] ---
const translations = {
  ko: {
    // 1) 상단 메뉴바 공통
    navHome: "홈", navDisciples: "AI 제자상", navCheck: "신앙 점검", 
    navCommunity: "커뮤니티", navPaulAI: "바울 AI", navBlog: "블로그",
    site_logo: "영국 데일리 바이블",
    
    // 2) 메인 홈 페이지
    mainTitle: "영적 동반자 바울 AI",
    mainSubtitle: "성경에 기반한 대화를 통해 지혜와 위로를 구하세요. 바울 AI는 당신이 말씀을 묵상하고 어떤 상황에서도 용기를 얻도록 돕습니다.",
    prayerChainTitle: "🙏 현재 함께하는 기도 체인",
    prayerToday: "오늘 함께한 성도", prayerTotal: "누적 기도 향연",
    prayBtn: "지금 기도 올리기 & 참여하기", prayBtnDone: "참여 완료 (내일 다시 참여 가능)",
    spiritualRestTitle: "오늘의 영적 안식", moodPrompt: "오늘의 감정 상태를 선택해 주세요.",
    dailyVerseTitle: "📖 오늘의 말씀", dailyPrayerTitle: "🙏 오늘의 기도", dailyMissionTitle: "📢 오늘의 전도",
    saveCardBtn: "📸 SAVE CARD", streakPrefix: "🔥 ", streakSuffix: "일째 동행 중",
    
    // 3) AI 해설 & 바울 AI 챗봇 페이지
    aiTitle: "AI 성경 해설", aiPlaceholder: "예: 마태복음 1장 1절", aiBtn: "해설 보기",
    
    // 4) 커뮤니티 페이지 (Community)
    commTitle: "신앙 공동체", 
    commSub: "우리는 하나 됨과 기도의 능력을 믿습니다. 함께 나누고 기도하며 영적 성장을 이뤄가세요.",
    commVision: "우리의 비전", commVisionDesc: "기술과 신앙의 간극을 메우고, 전 세계 믿음의 동역자들이 성경을 통해 교제할 수 있는 공간을 제공합니다.",
    commGlobal: "글로벌 파트너십", commGlobalDesc: "전 세계의 교회, 사역자들과 협력하여 기도로 연결된 신앙 네트워크를 구축합니다.",
    contactTitle: "문의 및 동역하기", btnSubmit: "제출하기",
    
    // 5) 블로그 페이지 (Blog)
    blogTitle: "영적 블로그", 
    blogSub: "말씀 묵상, 성경 공부 가이드, 커뮤니티 소식으로 신앙의 깊이를 더하세요.",
    
    // 6) 신앙 점검 페이지 (Faith Check)
    checkTitle: "주간 신앙 자가진단", 
    checkSub: "매주 자신의 신앙 상태를 점검하고 하나님과의 관계를 돌아보세요.",
    checkBtn: "신앙 점검 시작하기",
    
    // 7) AI 제자상 페이지 (Disciples)
    discipleTitle: "AI 제자상 분석기", 
    discipleSub: "신앙 속 어떤 제자의 형상을 닮았는지 분석합니다.",
    uploadBtn: "클릭하여 얼굴 사진 업로드",

    // 8) 방명록 (Comments)
    cmtTitle: "💬 은혜 나누기 (익명 방명록)",
    cmtBtn: "등록",
    cmtLoading: "댓글을 불러오는 중입니다... ⏳",
    cmtEmpty: "첫 번째 은혜의 나눔을 적어주세요!",
    cmtNamePh: "닉네임 (선택)",
    cmtTextPh: "따뜻한 나눔을 남겨주세요."
  },
  en: {
    // 1) Navigation
    navHome: "Home", navDisciples: "AI Discipleship", navCheck: "Faith Check", 
    navCommunity: "Community", navPaulAI: "Paul AI", navBlog: "Blog",
    site_logo: "British Daily Bible",

    // 2) Main Home Page
    mainTitle: "Spiritual Companion Paul AI",
    mainSubtitle: "Seek wisdom and comfort through bible-based conversations. Paul AI helps you reflect on scripture and find encouragement in every situation.",
    prayerChainTitle: "🙏 United Prayer Chain",
    prayerToday: "Praying Together Today", prayerTotal: "Total Prayers Offered",
    prayBtn: "Offer Prayer & Join", prayBtnDone: "Joined (Come back tomorrow)",
    spiritualRestTitle: "Today's Spiritual Rest", moodPrompt: "Please select your mood.",
    dailyVerseTitle: "📖 Today's Verse", dailyPrayerTitle: "🙏 Today's Prayer", dailyMissionTitle: "📢 Today's Mission",
    saveCardBtn: "📸 SAVE CARD", streakPrefix: "🔥 Day ", streakSuffix: " of your spiritual journey",

    // 3) AI Commentary & Chatbot
    aiTitle: "AI Bible Verse Commentary", aiPlaceholder: "e.g., Matthew 1:1", aiBtn: "Get Insight",

    // 4) Community Page
    commTitle: "Community of Faith", 
    commSub: "We believe in the power of unity and shared prayer. Join us to share, pray, and grow spiritually together.",
    commVision: "Our Vision", commVisionDesc: "We aim to bridge the gap between technology and faith, providing a space where believers worldwide can fellowship through scripture.",
    commGlobal: "Global Partnership", commGlobalDesc: "We collaborate with churches and ministries globally to build a prayer-connected network of faith.",
    contactTitle: "Get in Touch", btnSubmit: "Send Message",

    // 5) Blog Page
    blogTitle: "Spiritual Blog", 
    blogSub: "Deepen your faith with our curated reflections, Bible study guides, and community testimonies.",

    // 6) Faith Check Page
    checkTitle: "Weekly Faith Self-Check", 
    checkSub: "Examine your spiritual state weekly and reflect on your relationship with God.",
    checkBtn: "Start Faith Check",

    // 7) AI Discipleship Page
    discipleTitle: "AI Discipleship Analyzer", 
    discipleSub: "Analyze which biblical disciple's image reflects your faith journey.",
    uploadBtn: "Click to upload face photo",

    // 8) Guestbook (Comments)
    cmtTitle: "💬 Fellowship (Anonymous Guestbook)",
    cmtBtn: "Post",
    cmtLoading: "Loading comments... ⏳",
    cmtEmpty: "Be the first to share your grace!",
    cmtNamePh: "Name (Optional)",
    cmtTextPh: "Leave a warm message here."
  }
};

// --- [2. 매일 바뀌는 콘텐츠 (말씀도 언어별로 분리!)] ---
const dailyContents = [
  {
    verse: {
      ko: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라<br><br><b>빌립보서 4:13</b>",
      en: "I can do all things through Christ who strengthens me.<br><br><b>Philippians 4:13</b>"
    },
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

// --- [3. 화면 적용 로직] ---
function applyLanguage(lang) {
  localStorage.setItem('userLang', lang); 

  // 1. 일반 텍스트 변경 (data-i18n 태그 찾아서 적용)
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      // innerHTML을 쓰면 글자 안에 <br> 등의 태그가 있어도 정상적으로 렌더링됩니다.
      el.innerHTML = translations[lang][key]; 
    }
  });

  // 2. Placeholder(입력창 힌트 글씨) 번역
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[lang][key]) el.placeholder = translations[lang][key];
  });

  // 3. 입력창 placeholder 변경 (기존 호환성 유지)
  const verseInput = document.getElementById('verseInput');
  if (verseInput) verseInput.placeholder = translations[lang].aiPlaceholder;

  // 4. 셀렉트 박스 동기화
  document.querySelectorAll('.lang-selector').forEach(select => {
    select.value = lang;
  });

  // 5. 오늘의 콘텐츠 적용
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 3600000));
  const todayIndex = kst.getDate() % dailyContents.length;

  const verseEl = document.getElementById('dailyVerseText');   // 오늘의 말씀
  const prayerEl = document.getElementById('dailyPrayer');     // 오늘의 기도
  const evangelismEl = document.getElementById('dailyEvangelism'); // 오늘의 전도
  
  if (verseEl) verseEl.innerHTML = dailyContents[todayIndex].verse[lang];
  if (prayerEl) prayerEl.innerText = dailyContents[todayIndex].prayer[lang];
  if (evangelismEl) evangelismEl.innerText = dailyContents[todayIndex].evangelism[lang];

  // 6. 동행일수
  const streakBadge = document.getElementById('streakBadge');
  if (streakBadge) {
    let streakCount = parseInt(localStorage.getItem('streakCount')) || 1;
    streakBadge.innerText = translations[lang].streakPrefix + streakCount + translations[lang].streakSuffix;
  }
}

// --- [4. 초기화] ---
document.addEventListener('DOMContentLoaded', () => {
  let savedLang = localStorage.getItem('userLang') || 'ko';
  applyLanguage(savedLang);

  document.querySelectorAll('.lang-selector').forEach(select => {
    select.addEventListener('change', (e) => applyLanguage(e.target.value));
  });

  // 감정 버튼 (해당 페이지에만 작동)
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
