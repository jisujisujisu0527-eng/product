import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
  try {
    // 1. 구절과 언어 설정 받아오기 (기본값: 영어)
    const { verse, lang = "en" } = await context.request.json();

    if (!verse) {
      return new Response(JSON.stringify({ 
        error: "Please enter a bible verse. / 성경 구절을 입력해주세요." 
      }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    // 2. Gemini API 초기화
    const genAI = new GoogleGenerativeAI(context.env.GOOGLE_GENERATIVE_AI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. 다국어 프롬프트 분기 처리 (신학과 교회사적 배경 강조)
    let prompt = "";
    if (lang === "ko") {
      prompt = `당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 성경 해설가 'Paul AI'입니다. 
      다음 구절의 역사적 배경과 핵심 의미를 3~4문장으로 알기 쉽게 한국어로 설명해주세요: "${verse}"`;
    } else {
      prompt = `You are 'Paul AI', a friendly Bible commentator with deep knowledge of theology and church history. 
      Please explain the historical background and core meaning of the following verse in 3-4 sentences in English: "${verse}"`;
    }

    // 4. AI 답변 생성
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return new Response(JSON.stringify({ explanation: text }), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      },
    });
  } catch (error) {
    console.error("AI Error:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to connect to Paul AI. / AI 연결에 실패했습니다." 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
    });
  }
}
