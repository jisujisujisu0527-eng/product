// dailybible.uk - App Logic (Stabilized Version)

// 1. 전역 에러 핸들러 (안정성 강화)
window.addEventListener('unhandledrejection', event => {
    console.warn('Unhandled promise rejection:', event.reason);
});

// 2. 언어 설정 초기화
let currentLang = localStorage.getItem('user-lang') || 
                  (navigator.language.startsWith('ko') ? 'ko' : 'en');

document.addEventListener('DOMContentLoaded', () => {
    // UI 로딩 화면 처리 (안전 타임아웃 포함)
    const loader = document.getElementById('main-loader');
    const appContent = document.getElementById('app-content');
    
    const hideLoader = () => {
        if (loader && loader.style.display !== 'none') {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
                if (appContent) appContent.style.display = 'block';
            }, 500);
        }
    };

    if (loader) {
        // 정상 로딩 (1초 후)
        setTimeout(hideLoader, 1000);
        // 비정상 로딩 대비 안전 장치 (5초 후 강제 실행)
        setTimeout(hideLoader, 5000);
    }

    // 기본 언어 적용
    if (window.applyLanguage) window.applyLanguage(currentLang);
    
    // 테마 설정
    if (localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');
    
    // 일일 콘텐츠 로드
    loadDailyContent();
    
    // Firebase 데이터 동기화 감시 및 스트릭 업데이트 (안전한 인터벌 처리)
    let checkAttempts = 0;
    const checkReady = setInterval(async () => {
        checkAttempts++;
        if (window.db) {
            clearInterval(checkReady);
            watchGlobalPrayer();
            
            // 스트릭 업데이트 및 표시 (app-features.js의 로직과 연동)
            try {
                if (window.updateStreak) {
                    const count = await window.updateStreak();
                    const container = document.getElementById('streak-container');
                    const countEl = document.getElementById('streak-count') || document.getElementById('streak-counter');
                    if (countEl && count > 0) {
                        countEl.textContent = count.toString().includes('🔥') ? count : `🔥 ${count}일 연속 동행`;
                        if (container) container.style.display = 'inline-flex';
                    }
                }
            } catch (e) { console.error("Streak sync failed:", e); }
        }
        
        // 20번 시도(10초) 후에도 DB가 없으면 중단
        if (checkAttempts > 20) clearInterval(checkReady);
    }, 500);

    // 기도 버튼 이벤트 바인딩 (안전 검사 강화)
    const prayerBtn = document.getElementById('prayer-btn');
    if (prayerBtn) {
        prayerBtn.onclick = handleJoinPrayer;
        prayerBtn.addEventListener('touchend', (e) => {
            if (prayerBtn.disabled) return;
            handleJoinPrayer(e);
        }, { passive: false });
    }

    // Disqus 초기화
    if (document.getElementById('disqus_thread')) initDisqus();
});

// 자정이 지날 경우를 대비해 1시간마다 자동 갱신 체크
setInterval(() => {
    if (window.updateLanguage) window.updateLanguage(localStorage.getItem('user-lang') || 'ko');
}, 1000 * 60 * 60);

/**
 * 일일 콘텐츠 로드 (방어적 프로그래밍 적용)
 */
async function loadDailyContent() {
    const now = new Date();
    const todayId = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; 

    const elements = { 
        word: document.getElementById('today-word'), 
        ref: document.getElementById('today-ref'), 
        prayer: document.getElementById('today-prayer'), 
        mission: document.getElementById('today-mission') 
    };

    if (!elements.word) return;

    let success = false;

    if (window.db) {
        try {
            // v8 compat와 v9 혼용 대응 (안전하게 체크)
            const docRef = typeof window.db.collection === 'function' 
                ? window.db.collection("daily_content").doc(todayId)
                : null;

            if (docRef) {
                const docSnap = await docRef.get();
                if (docSnap.exists) {
                    const data = docSnap.data();
                    const wordKo = data.word?.ko || "";
                    const wordEn = data.word?.en || "";
                    
                    if (wordKo || wordEn) {
                        elements.word.innerHTML = `${wordKo}<br><small style="color:gray; font-style:italic;">${wordEn}</small>`;
                        if (elements.ref) elements.ref.innerHTML = data.ref?.ko || data.ref?.en || "";
                        if (elements.prayer) elements.prayer.innerHTML = `${data.prayer?.ko || ""}<br><small style="color:gray;">${data.prayer?.en || ""}</small>`;
                        if (elements.mission) elements.mission.innerHTML = `${data.mission?.ko || ""}<br><small style="color:gray;">${data.mission?.en || ""}</small>`;
                        success = true;
                    }
                }
            }
        } catch (error) {
            console.error("Firestore fetch error:", error);
        }
    }

    if (!success) {
        // 로컬 폴백 (네트워크 에러 시)
        const fallback = {
            word: { ko: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", en: "I can do all things through Christ who strengthens me." },
            ref: { ko: "빌립보서 4:13", en: "Philippians 4:13" }
        };
        elements.word.innerHTML = `${fallback.word.ko}<br><small style="color:gray;">${fallback.word.en}</small>`;
        if (elements.ref) elements.ref.innerHTML = `${fallback.ref.ko} / ${fallback.ref.en}`;
    }
}

/**
 * 오늘의 말씀 카드 다운로드
 */
window.downloadVerseCard = function(event) {
    const card = document.getElementById('wordCard');
    if (!card || typeof html2canvas !== 'function') return;

    const btn = event ? event.currentTarget : null;
    let originalText = btn ? btn.innerHTML : "";
    
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    html2canvas(card, { useCORS: true, scale: 2, backgroundColor: '#000000' }).then(canvas => {
        const fileName = `DailyBible-${new Date().toISOString().split('T')[0]}.jpg`;
        if (navigator.share && navigator.canShare) {
            canvas.toBlob(blob => {
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                navigator.share({ files: [file], title: 'Daily Bible' }).catch(() => saveFallback(canvas, fileName));
            }, 'image/jpeg', 0.9);
        } else {
            saveFallback(canvas, fileName);
        }
    }).finally(() => {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
};

function saveFallback(canvas, fileName) {
    const link = document.createElement('a');
    link.href = canvas.toDataURL("image/jpeg", 0.9);
    link.download = fileName;
    link.click();
}

/**
 * 실시간 기도 카운터 감시 (안전 검사 포함)
 */
function watchGlobalPrayer() {
    if (!window.db || typeof window.db.collection !== 'function') return;

    try {
        window.db.collection("stats").doc("prayer-chain").onSnapshot(doc => {
            const counter = document.getElementById('prayer-counter');
            if (counter && doc.exists) {
                counter.textContent = (doc.data().totalPrayers || 0).toLocaleString();
            }
        }, err => console.warn("Prayer count sync paused."));
    } catch (e) { console.error("Snapshot error:", e); }
}

/**
 * 글로벌 기도 참여 로직
 */
async function handleJoinPrayer(event) {
    if (event && event.cancelable) event.preventDefault();

    if (!window.db || typeof window.db.batch !== 'function') return;
    
    const prayerBtn = document.getElementById('prayer-btn');
    if (!prayerBtn || prayerBtn.disabled) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const originalContent = prayerBtn.innerHTML;
    prayerBtn.disabled = true;
    
    try {
        const batch = window.db.batch();
        const globalRef = window.db.collection("stats").doc("prayer-chain");
        const todayRef = window.db.collection("prayer_stats").doc(todayStr);

        batch.set(globalRef, { totalPrayers: firebase.firestore.FieldValue.increment(1) }, { merge: true });
        batch.set(todayRef, { count: firebase.firestore.FieldValue.increment(1) }, { merge: true });

        await batch.commit();
        const board = document.getElementById("prayer-board");
        if (board) board.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error("Prayer failed:", error);
    } finally {
        setTimeout(() => {
            if (prayerBtn) {
                prayerBtn.disabled = false;
                prayerBtn.innerHTML = originalContent;
            }
        }, 1500);
    }
}

/**
 * AI 성경 구절 해설 호출 함수
 */
window.getExplanation = async function() {
    const verseInput = document.getElementById("verseInput");
    const resultBox = document.getElementById("resultBox");
    
    if (!verseInput || !verseInput.value.trim()) {
        if (resultBox) resultBox.innerText = "Please enter a Bible verse.";
        return;
    }

    const verse = verseInput.value;
    resultBox.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Paul AI is reflecting on the scripture... ⏳';

    try {
        // Firebase Functions 초기화 (이미 main.js 상단 로직에서 초기화되었을 것으로 가정하거나 여기서 직접 가져옴)
        // 만약 모듈 시스템이라면 import가 필요하지만, window 객체에 바인딩하여 HTML에서 호출 가능하게 함
        const { getFunctions, httpsCallable } = await import('https://www.gstatic.com/firebasejs/9.15.0/firebase-functions-compat.js');
        const functions = firebase.app().functions('us-central1');
        const explainVerseAI = httpsCallable(functions, 'explainBibleVerse');

        const result = await explainVerseAI({ verse: verse });
        
        if(result.data.error) {
            resultBox.innerText = result.data.error;
        } else {
            resultBox.innerHTML = `<div style="padding: 15px; background: white; border-radius: 8px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);">
                ${result.data.explanation.replace(/\n/g, '<br>')}
            </div>`;
        }
    } catch (error) {
        console.error("AI Function Error:", error);
        resultBox.innerText = "An error occurred while connecting to Paul AI. Please try again later.";
    }
}

function initDisqus() {
    if (window.DISQUS) return;
    const d = document, s = d.createElement('script');
    s.src = 'https://bible-sound2.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
}

window.getVerseByMood = function(mood) { 
    if (window.translate) alert(`${mood}: ${window.translate('loading')}`); 
};
// Deployment Trigger: Mon Feb 23 12:56:37 PM UTC 2026
// Forced Deployment Trigger: Mon Feb 23 01:25:38 PM UTC 2026
