// firebase-firestore-service.js

// Firebase SDK 로드 (CDN 방식)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// [중요] 이 부분을 Firebase 콘솔에서 복사한 값으로 반드시 교체하세요!
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 초기화
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Firestore 관련 함수들을 export
export { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs };

/**
 * 최신 성도들의 신앙 점검 결과 불러오기
 * @returns {Array} 최근 점검 결과 배열
 */
export const getRecentFaithCheckups = async () => {
    try {
        // faithResults 컬렉션에서 최신 100개 문서 조회
        const q = query(collection(db, "faithResults"), orderBy("timestamp", "desc"), limit(100));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("최신 신앙 점검 결과 불러오기 실패:", error);
        return [];
    }
};