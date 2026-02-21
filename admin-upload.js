// admin-upload.js - Bulk Upload Script for Daily Content

// 1. Firebase 설정 (firebase-firestore-service.js의 값을 참조하거나 동일하게 설정)
const firebaseConfig = {
  apiKey: "AIzaSyDCuBvNfOKXIvQuOtGYrvSHQYyZcpt9LT0",
  authDomain: "kims-88433.firebaseapp.com",
  projectId: "kims-88433",
  storageBucket: "kims-88433.firebasestorage.app",
  messagingSenderId: "842717872672",
  appId: "1:842717872672:web:f37e14c7c1fb024c0f3245",
  measurementId: "G-8YPXQN7Z3M"
};

// Firebase 초기화 (CDN 방식 호환을 위해 compat 사용 가능성이 높으므로 체크)
// 여기서는 브라우저 환경에서 직접 실행될 것을 가정하여 모듈 방식 대신 compat 라이브러리가 로드되었다고 가정하거나 직접 로드함
let db;
try {
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    db = firebase.firestore();
} catch (e) {
    console.error("Firebase initialization failed. Make sure Firebase SDK is loaded.", e);
}

// 2. 30일치 데이터 (ChatGPT 생성 예시)
const dailyData = {
  "2026-02-21": {
    "word": { "ko": "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라", "en": "I can do all things through Christ who strengthens me." },
    "ref": { "ko": "빌립보서 4:13", "en": "Philippians 4:13" },
    "prayer": { "ko": "오늘 하루 주님의 능력을 의지하게 하소서.", "en": "Lord, help me rely on your strength today." },
    "mission": { "ko": "가족에게 사랑한다고 말하기", "en": "Tell your family you love them." }
  },
  "2026-02-22": {
    "word": { "ko": "여호와는 나의 목자시니 내게 부족함이 없으리로다", "en": "The Lord is my shepherd; I shall not want." },
    "ref": { "ko": "시편 23:1", "en": "Psalm 23:1" },
    "prayer": { "ko": "부족함 없는 주님의 인도하심을 따르게 하소서.", "en": "Guide me to follow your perfect lead." },
    "mission": { "ko": "어려운 이웃을 위해 기도하기", "en": "Pray for neighbors in need." }
  },
  "2026-02-23": {
    "word": { "ko": "너의 행사를 여호와께 맡기라 그리하면 네가 경영하는 것이 이루어지리라", "en": "Commit your work to the Lord, and your plans will be established." },
    "ref": { "ko": "잠언 16:3", "en": "Proverbs 16:3" },
    "prayer": { "ko": "나의 모든 계획을 주님께 맡깁니다.", "en": "I commit all my plans to You, Lord." },
    "mission": { "ko": "동료에게 칭찬 한마디 하기", "en": "Give a compliment to a colleague." }
  },
  "2026-02-24": {
    "word": { "ko": "구하라 그리하면 너희에게 주실 것이요 찾으라 그리하면 찾아낼 것이요", "en": "Ask, and it will be given to you; seek, and you will find." },
    "ref": { "ko": "마태복음 7:7", "en": "Matthew 7:7" },
    "prayer": { "ko": "간절히 찾는 마음을 주소서.", "en": "Give me a heart that earnestly seeks You." },
    "mission": { "ko": "성경 한 장 소리 내어 읽기", "en": "Read one chapter of the Bible aloud." }
  },
  "2026-02-25": {
    "word": { "ko": "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라", "en": "Rejoice always, pray without ceasing, give thanks in all circumstances." },
    "ref": { "ko": "데살로니가전서 5:16-18", "en": "1 Thessalonians 5:16-18" },
    "prayer": { "ko": "모든 상황 속에서 감사할 수 있는 믿음을 주소서.", "en": "Grant me faith to be thankful in all situations." },
    "mission": { "ko": "감사한 일 세 가지 적어보기", "en": "Write down three things you are grateful for." }
  },
  "2026-02-26": {
    "word": { "ko": "너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요", "en": "You are the light of the world. A city set on a hill cannot be hidden." },
    "ref": { "ko": "마태복음 5:14", "en": "Matthew 5:14" },
    "prayer": { "ko": "오늘 나의 삶이 주님의 빛을 비추게 하소서.", "en": "May my life reflect Your light today." },
    "mission": { "ko": "작은 선행 하나 실천하기", "en": "Perform one small act of kindness." }
  },
  "2026-02-27": {
    "word": { "ko": "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라", "en": "Fear not, for I am with you; be not dismayed, for I am your God." },
    "ref": { "ko": "이사야 41:10", "en": "Isaiah 41:10" },
    "prayer": { "ko": "두려움을 이기는 담대함을 주소서.", "en": "Give me courage to overcome fear." },
    "mission": { "ko": "걱정되는 친구에게 안부 문자 보내기", "en": "Send a supportive text to a friend." }
  },
  "2026-02-28": {
    "word": { "ko": "하나님은 사랑이심이라", "en": "God is love." },
    "ref": { "ko": "요한일서 4:8", "en": "1 John 4:8" },
    "prayer": { "ko": "주님의 사랑을 온전히 깨닫게 하소서.", "en": "Help me fully understand Your love." },
    "mission": { "ko": "누군가를 용서하기", "en": "Forgive someone today." }
  },
  "2026-03-01": {
    "word": { "ko": "너희는 먼저 그의 나라와 그의 의를 구하라", "en": "But seek first the kingdom of God and his righteousness." },
    "ref": { "ko": "마태복음 6:33", "en": "Matthew 6:33" },
    "prayer": { "ko": "나의 우선순위가 주님의 나라가 되게 하소서.", "en": "May Your kingdom be my first priority." },
    "mission": { "ko": "하루의 첫 시간을 기도로 시작하기", "en": "Start the first hour of the day with prayer." }
  }
  // 추가 데이터는 이와 같은 형식으로 계속 추가 가능
};

// 3. 업로드 실행 함수
async function uploadData() {
    if (!db) {
        alert("Firebase가 로드되지 않았습니다. 콘솔을 확인하세요.");
        return;
    }

    const btn = document.getElementById('uploadBtn');
    btn.disabled = true;
    btn.innerText = "업로드 중...";
    
    console.log("🚀 벌크 업로드 시작...");
    
    let successCount = 0;
    let failCount = 0;

    for (const [dateKey, content] of Object.entries(dailyData)) {
        try {
            // Firestore 컬렉션 "daily_content"에 날짜별로 저장
            await db.collection("daily_content").doc(dateKey).set(content);
            console.log(`✅ ${dateKey} 저장 완료`);
            successCount++;
        } catch (e) {
            console.error(`❌ ${dateKey} 저장 실패:`, e);
            failCount++;
        }
    }
    
    console.log(`📊 결과: 성공 ${successCount}, 실패 ${failCount}`);
    alert(`작업 완료!
성공: ${successCount}
실패: ${failCount}`);
    
    btn.disabled = false;
    btn.innerText = "데이터 업로드 시작 (다시 실행)";
}

// 버튼 클릭 시 실행
if (document.getElementById('uploadBtn')) {
    document.getElementById('uploadBtn').onclick = uploadData;
}
