// firebase-firestore-service.js (Safe Mode)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection as fsCollection, addDoc as fsAddDoc, serverTimestamp as fsServerTimestamp, query as fsQuery, orderBy as fsOrderBy, limit as fsLimit, getDocs as fsGetDocs, doc as fsDoc, runTransaction as fsRunTransaction } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// [설정 필요] 실제 배포 시 아래 값을 Firebase 콘솔의 값으로 교체하세요.
// 현재는 사이트 접속 불가를 막기 위한 임시 설정입니다.
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

let dbInstance = null;
let isMockMode = false;

try {
    // 키가 설정되지 않았거나 잘못된 경우를 대비한 방어 코드
    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.warn("⚠️ Firebase Config is missing. App running in Offline/Demo Mode.");
        isMockMode = true;
    } else {
        const app = initializeApp(firebaseConfig);
        dbInstance = getFirestore(app);
    }
} catch (e) {
    console.error("Firebase Init Error:", e);
    isMockMode = true;
}

export const db = dbInstance;

// Mock Functions (DB 연결 실패 시에도 사이트가 멈추지 않게 함)
const mockOp = () => console.log("DB operation skipped (Offline Mode)");

export const collection = isMockMode ? () => {} : fsCollection;
export const addDoc = isMockMode ? async () => ({ id: "mock_id" }) : fsAddDoc;
export const serverTimestamp = isMockMode ? () => new Date() : fsServerTimestamp;
export const query = isMockMode ? () => {} : fsQuery;
export const orderBy = isMockMode ? () => {} : fsOrderBy;
export const limit = isMockMode ? () => {} : fsLimit;
export const getDocs = isMockMode ? async () => ({ docs: [] }) : fsGetDocs;
export const doc = isMockMode ? () => {} : fsDoc;
export const runTransaction = isMockMode ? async () => {} : fsRunTransaction;

export const getRecentFaithCheckups = async () => {
    if (isMockMode) return [];
    try {
        const q = fsQuery(fsCollection(db, "faithResults"), fsOrderBy("timestamp", "desc"), fsLimit(100));
        const querySnapshot = await fsGetDocs(q);
        return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error("Load failed:", error);
        return [];
    }
};
