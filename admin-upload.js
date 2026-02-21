// admin-upload.js - Bulk Upload Script for Daily Content
import { db } from './firebase-config.js';

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
