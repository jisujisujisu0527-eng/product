import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
  try {
    // 1. 프론트엔드에서 보낸 구절 데이터 수신
    const { verse } = await context.request.json();

    if (!verse) {
      return new Response(JSON.stringify({ error: "성경 구절을 입력해주세요." }), { 
        status: 400, 
        headers: { "Content-Type": "application/json" } 
      });
    }

    // 2. 환경 변수에서 Gemini API 키 로드
    const genAI = new GoogleGenerativeAI(context.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. AI 페르소나 및 프롬프트 설정
    const prompt = `당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 성경 해설가입니다. 
    다음 구절의 역사적 배경과 핵심 의미를 3~4문장으로 알기 속에 설명해주세요: "${verse}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. 성공 응답 반환
    return new Response(JSON.stringify({ explanation: text }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" // 다른 도메인 호출 허용
      },
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    return new Response(JSON.stringify({ error: "AI 해설 생성 중 오류가 발생했습니다." }), { 
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
