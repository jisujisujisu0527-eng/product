import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
  try {
    // 1. 요청 데이터 받아오기
    const { verse } = await context.request.json();
    
    // 2. 환경 변수에서 API 키 가져오기 (대시보드 Settings > Environment variables에 설정 필요)
    const apiKey = context.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다." }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. AI에게 보낼 프롬프트 설정 (요청하신 페르소나 적용)
    const prompt = `당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 해설가입니다. 
    다음 성경 구절의 역사적 배경과 핵심 의미를 3~4문장으로 알기 쉽게 설명해주세요: "${verse}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. 결과 반환
    return new Response(JSON.stringify({ explanation: text }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Function Error:", error);
    return new Response(JSON.stringify({ error: "AI 해설 생성 중 오류가 발생했습니다." }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
