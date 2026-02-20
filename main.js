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

    // 기도 버튼 이벤트 바인딩 (갤럭시 & 아이폰 통합 최적화)
    const prayerBtn = document.getElementById('prayer-btn');
    if (prayerBtn) {
        // 데스크탑/아이폰 클릭
        prayerBtn.onclick = handleJoinPrayer;
        // 갤럭시 터치 (click보다 먼저 반응)
        prayerBtn.addEventListener('touchend', (e) => {
            if (prayerBtn.disabled) return;
            handleJoinPrayer(e);
        }, { passive: false });
    }

    // Disqus 초기화
    initDisqus();
});

// 자정이 지날 경우를 대비해 1시간마다 자동 갱신 체크
setInterval(() => {
    console.log("Checking for daily content update...");
    loadDailyContent();
}, 1000 * 60 * 60);

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
 * 일일 콘텐츠 로드 (한글+영어 통합 출력 버전)
 */
async function loadDailyContent() {
    // 1. 오늘 날짜를 'YYYY-MM-DD' 형식으로 생성
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const todayId = `${y}-${m}-${d}`; 

    // 2. UI 요소 참조
    const elements = { 
        word: document.getElementById('today-word'), 
        ref: document.getElementById('today-ref'), 
        prayer: document.getElementById('today-prayer'), 
        mission: document.getElementById('today-mission') 
    };

    const cardElements = {
        date: document.getElementById('card-date'),
        word: document.getElementById('card-word'),
        ref: document.getElementById('card-ref')
    };

    if (!elements.word) return;

    // 3. Firestore에서 오늘 날짜 문서 가져오기
    if (window.db) {
        try {
            const docRef = window.db.collection("daily_content").doc(todayId);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                const data = docSnap.data();
                
                // 한국어와 영어를 통합하여 표시
                const wordKo = data.word?.ko || "";
                const wordEn = data.word?.en || "";
                const refKo = data.ref?.ko || "";
                const refEn = data.ref?.en || "";
                const prayerKo = data.prayer?.ko || "";
                const prayerEn = data.prayer?.en || "";
                const missionKo = data.mission?.ko || "";
                const missionEn = data.mission?.en || "";

                // 메인 화면 업데이트 (한글 + 영어)
                elements.word.innerHTML = `"${wordKo}"<br><small style="color:gray; font-style:italic;">"${wordEn}"</small>`;
                if (elements.ref) {
                    elements.ref.innerHTML = `${refKo} / ${refEn}`;
                }
                elements.prayer.innerHTML = `${prayerKo}<br><small style="color:gray;">${prayerEn}</small>`;
                elements.mission.innerHTML = `${missionKo}<br><small style="color:gray;">${missionEn}</small>`;

                // 말씀 카드 동기화 (이미지 저장용)
                if (cardElements.word) {
                    cardElements.date.textContent = todayId.replace(/-/g, '.');
                    cardElements.word.innerHTML = `"${wordKo}"<br><span style="font-size:0.8em; opacity:0.8;">"${wordEn}"</span>`;
                    cardElements.ref.innerHTML = `- ${refKo || refEn} -`;
                }
                
                console.log("✅ Bilingual content loaded for", todayId);
                return;
            } else {
                console.warn("⚠️ Firestore Document NOT FOUND for:", todayId);
                elements.word.innerHTML = `<span style='color:#888;'>오늘의 말씀을 준비 중입니다... (${todayId})</span>`;
            }
        } catch (error) {
            console.error("❌ Firestore fetch error:", error);
        }
    }

    // 4. 폴백 (데이터 없을 때)
    const fallback = {
        ko: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라 (빌 4:13)",
        en: "I can do all things through Christ who strengthens me. (Phil 4:13)"
    };
    elements.word.innerHTML = `${fallback.ko}<br><small style="color:gray;">${fallback.en}</small>`;
}

/**
 * 오늘의 말씀 카드 다운로드 (html2canvas)
 */
window.downloadVerseCard = function(event) {
    const card = document.getElementById('wordCard');
    if (!card) return;

    // 이벤트 객체에서 버튼 요소 가져오기
    const btn = event ? event.currentTarget : null;
    let originalText = "";
    
    if (btn) {
        originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    }

    html2canvas(card, {
        useCORS: true,
        allowTaint: false,
        scale: 2, // 고해상도 출력
        backgroundColor: '#000000'
    }).then(canvas => {
        const now = new Date();
        const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const fileName = `DailyBible-${dateKey}.jpg`;

        // 모바일 공유 API 지원 여부 확인
        if (navigator.share && navigator.canShare) {
            canvas.toBlob(blob => {
                const file = new File([blob], fileName, { type: 'image/jpeg' });
                if (navigator.canShare({ files: [file] })) {
                    navigator.share({
                        files: [file],
                        title: 'Daily Bible Word',
                        text: 'Sharing today\'s grace with you.'
                    }).catch(err => {
                        console.error("Share failed, falling back to download:", err);
                        saveFallback(canvas, fileName);
                    });
                } else {
                    saveFallback(canvas, fileName);
                }
            }, 'image/jpeg', 0.9);
        } else {
            saveFallback(canvas, fileName);
        }

        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }).catch(err => {
        console.error("Canvas generation failed:", err);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
        alert("Failed to generate image. Please try again.");
    });
};

function saveFallback(canvas, fileName) {
    const imageData = canvas.toDataURL("image/jpeg", 0.9);
    const link = document.createElement('a');
    link.href = imageData;
    link.download = fileName;
    document.body.appendChild(link); // 일부 브라우저 호환성을 위해 추가
    link.click();
    document.body.removeChild(link);
}

/**
 * 실시간 기도 카운터 감시 (전체 및 오늘 날짜별)
 */
function watchGlobalPrayer() {
    if (!window.db) return;

    // 1. 전체 누적 카운트 감시
    window.db.collection("stats").doc("prayer-chain").onSnapshot(doc => {
        if (doc.exists) {
            const counter = document.getElementById('prayer-counter');
            if (counter) {
                const total = doc.data().totalPrayers || 0;
                counter.textContent = total.toLocaleString();
            }
        }
    }, err => console.error("Global Snapshot error:", err));

    // 2. 오늘 참여자 카운트 감시 (범용 날짜 형식 사용)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    window.db.collection("prayer_stats").doc(todayStr).onSnapshot(doc => {
        const todayCounter = document.getElementById('prayer-count-display');
        if (todayCounter) {
            const count = doc.exists ? (doc.data().count || 0) : 0;
            todayCounter.textContent = count.toLocaleString();
        }
    }, err => console.error("Today Snapshot error:", err));
}

/**
 * 글로벌 기도 참여 로직 (갤럭시 & 아이폰 통합 최적화)
 */
async function handleJoinPrayer(event) {
    // 갤럭시/아이폰 기본 동작 및 버블링 방지
    if (event) {
        if (event.cancelable) event.preventDefault();
        event.stopPropagation();
    }

    if (!window.db) return;
    
    const prayerBtn = document.getElementById('prayer-btn');
    if (!prayerBtn || prayerBtn.disabled) return;

    // 범용 날짜 형식
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    const globalRef = window.db.collection("stats").doc("prayer-chain");
    const todayRef = window.db.collection("prayer_stats").doc(todayStr);

    // 버튼 시각적 피드백
    const originalContent = prayerBtn.innerHTML;
    prayerBtn.disabled = true;
    prayerBtn.style.opacity = "0.6";
    
    const processingText = currentLang === 'ko' ? "참여 중..." : "Joining...";
    const btnSpan = prayerBtn.querySelector('span[data-i18n]');
    if (btnSpan) btnSpan.innerText = processingText;

    try {
        // Firestore Batch 사용 (원자적 업데이트)
        const batch = window.db.batch();
        batch.set(globalRef, { totalPrayers: firebase.firestore.FieldValue.increment(1) }, { merge: true });
        batch.set(todayRef, { count: firebase.firestore.FieldValue.increment(1) }, { merge: true });

        await batch.commit();

        // 게시판으로 부드럽게 이동
        const board = document.getElementById("prayer-board");
        if (board) board.scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("Prayer batch update failed:", error);
    } finally {
        // 1.5초 후 버튼 복구 (갤럭시 지연 대응)
        setTimeout(() => {
            if (prayerBtn) {
                prayerBtn.disabled = false;
                prayerBtn.style.opacity = "1";
                prayerBtn.style.cursor = "pointer";
                prayerBtn.innerHTML = originalContent;
                if (window.applyLanguage) window.applyLanguage(currentLang);
            }
        }, 1500);
    }
}

// 전역 스코프 노출 (갤럭시 브라우저 대응)
window.joinPrayer = handleJoinPrayer;

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
window.getVerseByMood = function(mood) { 
    const msg = window.translate('loading');
    alert(`${mood}: ${msg}`); 
};
