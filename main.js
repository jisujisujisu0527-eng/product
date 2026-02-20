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

    // 기도 버튼 이벤트 바인딩 (addEventListener 방식)
    const prayerBtn = document.getElementById('prayer-btn');
    if (prayerBtn) {
        prayerBtn.addEventListener('click', handleJoinPrayer);
    }

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
 * 일일 콘텐츠 로드 (Firestore 연동 및 폴백 처리)
 */
async function loadDailyContent() {
    // 1. 사용자 현지 시간 기준 'YYYY-MM-DD' 생성 (sv-SE 로케일은 YYYY-MM-DD 형식을 반환함)
    const now = new Date();
    const dateKey = now.toLocaleDateString('sv-SE');

    // 2. 기본 폴백 데이터 정의
    const fallback = {
        en: { word: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1", prayer: "Bless our day with your grace.", mission: "Be kind to everyone you meet today." },
        ko: { word: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", ref: "시편 23:1", prayer: "오늘 하루를 당신의 은혜로 축복하소서.", mission: "오늘 만나는 모든 이에게 친절을 베푸세요." }
    };

    const elements = { 
        bText: document.getElementById('bible-text'), 
        bRef: document.getElementById('bible-ref'), 
        pText: document.getElementById('prayer-text'), 
        mText: document.getElementById('mission-text') 
    };

    const cardElements = {
        date: document.getElementById('card-date'),
        word: document.getElementById('card-word'),
        ref: document.getElementById('card-ref')
    };

    // UI 요소가 없으면 중단
    if (!elements.bText) return;

    let finalData = fallback[currentLang] || fallback['en'];

    // 3. Firestore에서 데이터 가져오기 시도
    if (window.db) {
        try {
            const docRef = window.db.collection("daily_content").doc(dateKey);
            const docSnap = await docRef.get();

            if (docSnap.exists) {
                const data = docSnap.data();
                const lang = currentLang || 'en';
                
                const wordObj = data.word || {};
                const prayerObj = data.prayer || {};
                const missionObj = data.mission || {};
                const refObj = data.ref || {};

                finalData = {
                    word: wordObj[lang] || wordObj['en'] || fallback[lang].word,
                    ref: refObj[lang] || refObj['en'] || fallback[lang].ref,
                    prayer: prayerObj[lang] || prayerObj['en'] || fallback[lang].prayer,
                    mission: missionObj[lang] || missionObj['en'] || fallback[lang].mission
                };
            }
        } catch (error) {
            console.error("Firestore daily_content fetch error:", error);
        }
    }

    // 4. 화면 UI 업데이트
    elements.bText.textContent = `"${finalData.word}"`;
    elements.bRef.textContent = finalData.ref;
    elements.pText.textContent = finalData.prayer;
    elements.mText.textContent = finalData.mission;

    // 5. 숨겨진 카드(이미지 저장용) 업데이트
    if (cardElements.word) {
        cardElements.date.textContent = dateKey.replace(/-/g, '.');
        cardElements.word.textContent = `"${finalData.word}"`;
        cardElements.ref.textContent = `- ${finalData.ref} -`;
    }
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
        const dateKey = new Date().toLocaleDateString('sv-SE');
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

    // 2. 오늘 참여자 카운트 감시 (요청하신 ID 'prayer-count-display' 사용)
    const todayStr = new Date().toLocaleDateString('sv-SE');
    window.db.collection("prayer_stats").doc(todayStr).onSnapshot(doc => {
        const todayCounter = document.getElementById('prayer-count-display');
        if (todayCounter) {
            const count = doc.exists ? (doc.data().count || 0) : 0;
            todayCounter.textContent = count.toLocaleString();
        }
    }, err => console.error("Today Snapshot error:", err));
}

/**
 * 글로벌 기도 참여 로직 (addEventListener 방식 적용)
 */
async function handleJoinPrayer(event) {
    if (!window.db) {
        document.getElementById("prayer-board").scrollIntoView({ behavior: 'smooth' });
        return;
    }
    
    const prayerBtn = document.getElementById('prayer-btn');
    if (!prayerBtn || prayerBtn.disabled) return;

    const todayStr = new Date().toLocaleDateString('sv-SE');
    const globalRef = window.db.collection("stats").doc("prayer-chain");
    const todayRef = window.db.collection("prayer_stats").doc(todayStr);

    // 버튼 시각적 피드백 (Snippet 참고)
    const originalContent = prayerBtn.innerHTML;
    prayerBtn.disabled = true;
    prayerBtn.style.opacity = "0.6";
    prayerBtn.style.cursor = "not-allowed";
    
    // 한국어/영어에 따른 텍스트 피드백
    const processingText = currentLang === 'ko' ? "참여 중..." : "Joining...";
    const originalBtnSpan = prayerBtn.querySelector('span[data-i18n]');
    if (originalBtnSpan) originalBtnSpan.innerText = processingText;

    try {
        // Firestore Batch 사용
        const batch = window.db.batch();
        batch.set(globalRef, { totalPrayers: firebase.firestore.FieldValue.increment(1) }, { merge: true });
        batch.set(todayRef, { count: firebase.firestore.FieldValue.increment(1) }, { merge: true });

        await batch.commit();

        // 성공 시 이동
        document.getElementById("prayer-board").scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error("기도 참여 실패:", error);
    } finally {
        // 2초 후 버튼 복구 (도배 방지)
        setTimeout(() => {
            if (prayerBtn) {
                prayerBtn.disabled = false;
                prayerBtn.style.opacity = "1";
                prayerBtn.style.cursor = "pointer";
                prayerBtn.innerHTML = originalContent;
                // 다시 번역 적용 (HTML을 갈아끼웠으므로)
                window.applyLanguage(currentLang);
            }
        }, 2000);
    }
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
window.getVerseByMood = function(mood) { 
    const msg = window.translate('loading');
    alert(`${mood}: ${msg}`); 
};
