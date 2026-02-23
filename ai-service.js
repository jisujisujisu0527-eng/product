import { initializeApp } from "firebase/app";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Firebase 설정 (기존 firebase-config.js와 연동하거나 환경변수 사용)
// 브라우저 환경에서는 process.env 대신 실제 값을 주입하거나 별도의 보안 처리가 필요합니다.
const firebaseConfig = {
  apiKey: window.FIREBASE_CONFIG?.apiKey || "",
  authDomain: window.FIREBASE_CONFIG?.authDomain || "",
  projectId: window.FIREBASE_CONFIG?.projectId || "",
  storageBucket: window.FIREBASE_CONFIG?.storageBucket || "",
  messagingSenderId: window.FIREBASE_CONFIG?.messagingSenderId || "",
  appId: window.FIREBASE_CONFIG?.appId || ""
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Gemini AI 초기화 (API 키는 보안을 위해 서버 측에서 처리하는 것이 좋으나, 프론트엔드 예시로 작성)
const GEN_AI_KEY = "AIzaSyACk-QSRSMNRgt6WAwMFMQRzfHDkD9cIPY"; 
const genAI = new GoogleGenerativeAI(GEN_AI_KEY);

/**
 * 성경 구절에 대한 해설을 생성합니다 (Gemini 모델 사용)
 */
export async function getBibleCommentary(verse) {
  try {
    if (!GEN_AI_KEY || GEN_AI_KEY === "YOUR_GOOGLE_AI_API_KEY") {
        throw new Error("Gemini API Key is missing.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 해설가입니다. ${verse}에 대한 역사적 배경과 영적 의미를 3~4문장으로 알기 쉽게 해설해주고, 마지막에 짧은 묵상 질문을 하나 추가해줘.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "해설을 가져오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
}

// 전역 객체에 등록하여 HTML에서 접근 가능하게 설정
window.getBibleCommentary = getBibleCommentary;
