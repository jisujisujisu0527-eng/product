// Firebase SDK 직접 로드 (가장 최신 안정화 버전)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// [중요] 이 부분을 Firebase 콘솔에서 복사한 값으로 반드시 교체하세요!
const firebaseConfig = {
  apiKey: "AIzaSy...", // 여기에 실제 API Key 입력
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};

// 초기화
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 상태 관리 변수
let currentStep = 1;
const testData = {
  userName: "",
  step1_daily: { mood: "" },
  step2_sermon: { keyword: "" },
  step3_community: { needs: "" }
};

// 1. 단계 전환 함수 (HTML 버튼에서 호출)
window.nextStep = (step) => {
  // 현재 단계 데이터 임시 저장
  if (currentStep === 1) {
    testData.userName = document.getElementById('userName').value;
    testData.step1_daily.mood = document.querySelector('input[name="mood"]:checked')?.value;
    if(!testData.userName) return alert("이름을 입력해주세요.");
  } else if (currentStep === 2) {
    testData.step2_sermon.keyword = document.getElementById('sermonKeyword').value;
  }

  // 화면 전환
  document.getElementById(`step-${currentStep}`).classList.add('hidden');
  document.getElementById(`step-${step}`).classList.remove('hidden');
  currentStep = step;
};

// 2. 최종 제출 및 Firebase 저장
window.submitTest = async () => {
  testData.step3_community.needs = document.getElementById('spiritualNeeds').value;

  try {
    // Firestore에 저장
    const docRef = await addDoc(collection(db, "faith_checkups"), {
      ...testData,
      createdAt: serverTimestamp()
    });

    // 결과 표시
    showFinalResult(docRef.id);
  } catch (error) {
    console.error("저장 실패:", error);
    alert("데이터 저장에 실패했습니다. 설정을 확인해주세요.");
  }
};

// 3. 결과 요약 및 나눔 텍스트 생성
function showFinalResult(docId) {
  const summaryText = `
[${testData.userName} 성도님의 신앙 고백]
🌱 이번 주 일상: ${testData.step1_daily.mood}
📖 기억나는 말씀: ${testData.step2_sermon.keyword}
⛪ 필요한 영적양식: ${testData.step3_community.needs}
함께 생명을 나누길 원합니다!
  `.trim();

  document.getElementById('test-container').innerHTML = `
    <div class="result-box">
      <h3>테스트 완료! 🙏</h3>
      <p style="white-space: pre-wrap; background: #FFF8E1; padding: 15px; border-radius: 8px; border: 1px solid #E0DEDC;">${summaryText}</p>
      <button onclick="navigator.clipboard.writeText(`${summaryText}`).then(()=>alert('복사되었습니다! 카톡에 공유해보세요.'))">
        나눔 문구 복사하기
      </button>
    </div>
  `;
}

// 초기 로딩 시 Firebase 초기화 및 첫 번째 단계 표시
document.addEventListener('DOMContentLoaded', () => {
  // nextStep(1); // Already visible by default
});