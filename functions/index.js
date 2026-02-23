const { onCall } = require("firebase-functions/v2/https");
const { OpenAI } = require("openai");

// OpenAI API 키 설정
const openai = new OpenAI({
  apiKey: "YOUR_OPENAI_API_KEY", // 여기에 실제 API 키를 넣으세요.
});

// 웹사이트에서 호출할 수 있는 AI 해설 함수
exports.explainBibleVerse = onCall({
    cors: true, // CORS 허용 (필요 시)
    region: "us-central1" // 리전 설정
}, async (request) => {
  const verse = request.data.verse;

  if (!verse) {
    return { error: "성경 구절을 입력해주세요." };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "당신은 깊이 있는 신학과 교회사 지식을 갖춘 친절한 해설가입니다. 주어진 성경 구절의 역사적 배경과 핵심 의미를 3~4문장으로 알기 쉽게 설명해주세요. 마지막에는 짧은 묵상 질문 하나를 던져주세요."
        },
        {
          role: "user",
          content: verse
        }
      ],
      temperature: 0.7,
    });

    return { 
      explanation: response.choices[0].message.content 
    };

  } catch (error) {
    console.error("AI 연산 중 오류 발생:", error);
    return { error: "해설을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요." };
  }
});
