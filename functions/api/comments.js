// /functions/api/comments.js

// 1. [조회] 페이지 접속 시 댓글 목록 가져오기
export async function onRequestGet(context) {
  const db = context.env.PRAYER_DB;
  // DB에서 'site_comments'라는 이름의 데이터를 배열 형태로 가져옴 (없으면 빈 배열 [])
  const comments = await db.get("site_comments", "json") || [];
  
  return new Response(JSON.stringify(comments), {
    headers: { "Content-Type": "application/json" }
  });
}

// 2. [저장] 댓글 등록 버튼 누를 때 실행
export async function onRequestPost(context) {
  try {
    const db = context.env.PRAYER_DB;
    const { nickname, text } = await context.request.json();

    if (!text) {
      return new Response(JSON.stringify({ error: "내용이 없습니다." }), { status: 400 });
    }

    // 한국 시간(KST) 구하기
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kst = new Date(utc + (9 * 3600000));
    const dateStr = `${kst.getFullYear()}.${String(kst.getMonth() + 1).padStart(2, '0')}.${String(kst.getDate()).padStart(2, '0')} ${String(kst.getHours()).padStart(2, '0')}:${String(kst.getMinutes()).padStart(2, '0')}`;

    // 새 댓글 객체 생성
    const newComment = {
      id: Date.now().toString(),
      nickname: nickname || "익명의 성도", // 닉네임을 안 쓰면 자동 부여
      text: text,
      date: dateStr
    };

    // 기존 댓글 목록 가져와서 맨 위에 새 댓글 추가 (최신순)
    const existingComments = await db.get("site_comments", "json") || [];
    existingComments.unshift(newComment);

    // 💡 안전장치: 데이터베이스 용량이 터지지 않도록 최신 댓글 100개만 유지
    if (existingComments.length > 100) {
      existingComments.pop(); // 가장 오래된 댓글 삭제
    }

    // DB에 덮어쓰기
    await db.put("site_comments", JSON.stringify(existingComments));

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "댓글 저장 실패" }), { status: 500 });
  }
}
