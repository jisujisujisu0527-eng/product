// dailybible.uk - App Logic

// 1. 언어 설정 초기화 (Gemini 조언 적용: 로컬 스토리지 -> 브라우저 설정 -> 기본값 'ko')
let currentLang = localStorage.getItem('user-lang') || 
                  (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    // UI 로딩 화면 처리
    const loader = document.getElementById('main-loader');
    if (loader) {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                const appContent = document.getElementById('app-content');
                if (appContent) appContent.style.display = 'block';
            }, 500);
        }, 1000);
    }

    // 기본 언어 적용
    window.applyLanguage(currentLang);
    
    // 테마 설정 (선택 사항)
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    // 일일 콘텐츠 로드
    loadDailyContent();
    
    // Firebase 데이터 동기화 감시
    const checkReady = setInterval(() => {
        if (window.db) {
            clearInterval(checkReady);
            watchGlobalPrayer();
        }
    }, 500);
});

/**
 * 전역 언어 적용 함수
 */
window.applyLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('user-lang', lang); // 일관된 키 사용
    document.documentElement.lang = lang;
    
    const select = document.getElementById('lang-select');
    if (select) select.value = lang;

    // 모든 [data-i18n] 요소에 번역 적용
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        // translate 함수를 사용하여 Fallback(영어) 자동 지원
        const translatedText = window.translate(key, lang);
        
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translatedText;
        } else {
            el.textContent = translatedText;
        }
    });

    // 콘텐츠 재로드 (언어 변경 시 필요)
    loadDailyContent();
};

/**
 * 일일 콘텐츠 로드 (번역 누락 방지 로직 포함)
 */
function loadDailyContent() {
    const fallback = {
        en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1", prayer: "Bless our day with your grace.", mission: "Be kind to everyone you meet today." },
        ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", ref: "시편 23:1", prayer: "오늘 하루를 당신의 은혜로 축복하소서.", mission: "오늘 만나는 모든 이에게 친절을 베푸세요." }
    };
    
    // 지원하지 않는 언어일 경우 영어를 기본값으로 사용
    const item = fallback[currentLang] || fallback['en'];
    
    const bText = document.getElementById('bible-text');
    const bRef = document.getElementById('bible-ref');
    const pText = document.getElementById('prayer-text');
    const mText = document.getElementById('mission-text');
    
    if (bText) bText.textContent = `"${item.text}"`;
    if (bRef) bRef.textContent = item.ref;
    if (pText) pText.textContent = item.prayer;
    if (mText) mText.textContent = item.mission;
}

/**
 * 글로벌 기도 카운터 업데이트
 */
window.lightGlobalCandle = async function() {
    if (!window.db) return;
    const statsRef = window.db.collection("stats").doc("global_prayer");
    try {
        await window.db.runTransaction(async (t) => {
            const doc = await t.get(statsRef);
            const currentTotal = doc.exists ? (doc.data().totalCount || 0) : 0;
            t.set(statsRef, { totalCount: currentTotal + 1 }, { merge: true });
        });
        // 성공 시 로컬 카운터 즉시 업데이트 (사용자 경험 개선)
        const counter = document.getElementById('prayer-counter');
        if (counter) {
            const currentVal = parseInt(counter.textContent.replace(/,/g, '')) || 0;
            counter.textContent = (currentVal + 1).toLocaleString();
        }
    } catch (e) { 
        console.error("Sync failed:", e);
        alert(window.translate('save_success') || "Prayed!");
    }
};

/**
 * 실시간 기도 카운터 감시
 */
function watchGlobalPrayer() {
    if (!window.db) return;
    window.db.collection("stats").doc("global_prayer").onSnapshot(doc => {
        if (doc.exists) {
            const counter = document.getElementById('prayer-counter');
            if (counter) {
                const total = doc.data().totalCount || 0;
                counter.textContent = total.toLocaleString();
            }
        }
    }, err => console.error("Snapshot error:", err));
}

// 나머지 헬퍼 함수들
window.downloadVerseCard = function() { alert(window.translate('save_success')); };
window.getVerseByMood = function(mood) { 
    const msg = window.translate('loading');
    alert(`${mood}: ${msg}`); 
};
