import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
  try {
    // 1. 프론트엔드에서 보낸 구절 데이터 받기
    const { verse } = await context.request.json();

    if (!verse) {
      return new Response(JSON.stringify({ error: "성경 구절을 입력해주세요." }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. 환경 변수에서 Gemini API 키 가져오기
    const apiKey = context.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API 키가 설정되지 않았습니다." }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. AI 해설가 페르소나 설정 및 질문 전송
    const prompt = `당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 해설가입니다. 
    다음 성경 구절의 역사적 배경과 핵심 의미를 3~4문장으로 알기 쉽게 설명해주세요: "${verse}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. 결과 반환 (CORS 허용 포함)
    return new Response(JSON.stringify({ explanation: text }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ error: "AI 해설을 가져오는 데 실패했습니다." }), { 
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
