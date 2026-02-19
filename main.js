// dailybible.uk - App Logic

// 1. 언어 설정 초기화 (Gemini 조언 적용)
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
    
    // 테마 설정
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    // 일일 콘텐츠 로드
    loadDailyContent();
    
    // Firebase 데이터 동기화 감시 및 스트릭 업데이트
    const checkReady = setInterval(async () => {
        if (window.db) {
            clearInterval(checkReady);
            watchGlobalPrayer();
            
            // 스트릭 업데이트 및 표시
            try {
                const count = await window.updateStreak();
                const container = document.getElementById('streak-container');
                const countEl = document.getElementById('streak-count');
                if (container && countEl && count > 0) {
                    countEl.textContent = count;
                    container.style.display = 'inline-flex';
                }
            } catch (e) { console.error("Streak sync failed"); }
        }
    }, 500);

    // Disqus 초기화
    initDisqus();
});

/**
 * 전역 언어 적용 함수
 */
window.applyLanguage = function(lang) {
    currentLang = lang;
    localStorage.setItem('user-lang', lang);
    document.documentElement.lang = lang;
    
    const select = document.getElementById('lang-select');
    if (select) select.value = lang;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const translatedText = window.translate(key, lang);
        
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translatedText;
        } else {
            el.textContent = translatedText;
        }
    });

    loadDailyContent();
};

/**
 * 일일 콘텐츠 로드
 */
function loadDailyContent() {
    const fallback = {
        en: { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1", prayer: "Bless our day with your grace.", mission: "Be kind to everyone you meet today." },
        ko: { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", ref: "시편 23:1", prayer: "오늘 하루를 당신의 은혜로 축복하소서.", mission: "오늘 만나는 모든 이에게 친절을 베푸세요." }
    };
    const item = fallback[currentLang] || fallback['en'];
    const elements = { bText: 'bible-text', bRef: 'bible-ref', pText: 'prayer-text', mText: 'mission-text' };
    
    if (document.getElementById(elements.bText)) document.getElementById(elements.bText).textContent = `"${item.text}"`;
    if (document.getElementById(elements.bRef)) document.getElementById(elements.bRef).textContent = item.ref;
    if (document.getElementById(elements.pText)) document.getElementById(elements.pText).textContent = item.prayer;
    if (document.getElementById(elements.mText)) document.getElementById(elements.mText).textContent = item.mission;
}

/**
 * 글로벌 기도 참여 로직 (Gemini 정교화 조언 적용)
 */
window.handlePrayerClick = async function(event) {
    if (!window.db) {
        document.getElementById("prayer-board").scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const btn = event.currentTarget;
    const prayerDocRef = window.db.collection("stats").doc("prayer-chain");
    
    try {
        // 1. 버튼 비활성화 (광클 방지)
        btn.disabled = true;
        btn.style.opacity = "0.7";
        btn.style.cursor = "not-allowed";

        // 2. 파이어베이스 내부 함수로 숫자 +1 증가 (원자적 연산)
        await prayerDocRef.update({
            totalPrayers: firebase.firestore.FieldValue.increment(1)
        });

        // 3. 업데이트 완료 후 게시판으로 부드럽게 이동
        document.getElementById("prayer-board").scrollIntoView({ behavior: 'smooth' });
        
        // 4. 버튼 다시 활성화 (2초 후)
        setTimeout(() => { 
            btn.disabled = false; 
            btn.style.opacity = "1";
            btn.style.cursor = "pointer";
        }, 2000);

    } catch (error) {
        console.error("카운트 업데이트 실패:", error);
        // 문서가 없는 경우 초기 생성 시도
        try {
            await prayerDocRef.set({ totalPrayers: 1 }, { merge: true });
            document.getElementById("prayer-board").scrollIntoView({ behavior: 'smooth' });
        } catch(e) {
            alert("연결이 원활하지 않습니다. 다시 시도해주세요!");
        }
        btn.disabled = false;
        btn.style.opacity = "1";
    }
};

/**
 * 실시간 기도 카운터 감시 (onSnapshot 사용)
 */
function watchGlobalPrayer() {
    if (!window.db) return;
    window.db.collection("stats").doc("prayer-chain").onSnapshot(doc => {
        if (doc.exists) {
            const counter = document.getElementById('prayer-counter');
            if (counter) {
                const total = doc.data().totalPrayers || 0;
                // 세 자리마다 콤마 추가
                counter.textContent = total.toLocaleString();
            }
        }
    }, err => console.error("Snapshot error:", err));
}

/**
 * Disqus 익명 게시판 초기화
 */
function initDisqus() {
    const d = document, s = d.createElement('script');
    s.src = 'https://bible-sound2.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

// 헬퍼 함수
window.downloadVerseCard = function() { alert(window.translate('save_success')); };
window.getVerseByMood = function(mood) { 
    const msg = window.translate('loading');
    alert(`${mood}: ${msg}`); 
};
