import { GoogleGenerativeAI } from "@google/generative-ai";

export async function onRequestPost(context) {
  try {
    const { verse, lang = "en" } = await context.request.json();

    if (!verse) {
      return new Response(JSON.stringify({ error: "성경 구절을 입력해주세요." }), { 
        status: 400, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    // 🚨 [체크 포인트 1] API 키가 서버에 잘 들어왔는지 확인
    const apiKey = context.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: "🚨 에러: Cloudflare 환경 변수에 API 키가 없습니다! 설정을 다시 확인해주세요. (Production 환경 변수 확인 필수)" 
      }), { 
        status: 500, 
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = lang === "ko" 
      ? `당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 성경 해설가 'Paul AI'입니다. 다음 구절의 역사적 배경과 핵심 의미를 3~4문장으로 알기 쉽게 한국어로 설명해주세요: "${verse}"`
      : `You are 'Paul AI', a friendly Bible commentator with deep knowledge of theology and church history. Please explain the historical background and core meaning of the following verse in 3-4 sentences in English: "${verse}"`;

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
    // 🚨 [체크 포인트 2] 서버 내부에서 터진 진짜 에러 메시지를 화면에 보냄
    return new Response(JSON.stringify({ 
      error: `🚨 서버 에러 상세 원인: ${error.message}` 
    }), { 
      status: 500, 
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } 
    });
  }
}
