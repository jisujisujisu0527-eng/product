// 한국 시간(KST)을 구하는 도우미 함수
const getKSTDate = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 3600000)); // UTC+9
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  return { year: `${year}`, date: `${year}-${month}-${day}` };
};

// 1. [조회] 페이지 접속 시 현재 숫자 가져오기
export async function onRequestGet(context) {
  const { year, date } = getKSTDate();
  const db = context.env.PRAYER_DB;

  if (!db) {
    return new Response(JSON.stringify({ daily: 0, yearly: 0, error: "KV DB not bound" }), {
      headers: { "Content-Type": "application/json" }
    });
  }

  // DB에서 오늘의 숫자와 올해의 숫자 가져오기 (없으면 0)
  let dailyCount = await db.get(`daily_${date}`) || 0;
  let yearlyCount = await db.get(`yearly_${year}`) || 0;

  return new Response(JSON.stringify({ daily: parseInt(dailyCount), yearly: parseInt(yearlyCount) }), {
    headers: { "Content-Type": "application/json" }
  });
}

// 2. [저장] 버튼 누를 때 숫자 1씩 더하기
export async function onRequestPost(context) {
  const { year, date } = getKSTDate();
  const db = context.env.PRAYER_DB;

  if (!db) {
    return new Response(JSON.stringify({ error: "KV DB not bound" }), { status: 500 });
  }

  let dailyCount = await db.get(`daily_${date}`);
  let yearlyCount = await db.get(`yearly_${year}`);

  // 숫자가 있으면 +1, 없으면 1로 시작
  dailyCount = dailyCount ? parseInt(dailyCount) + 1 : 1;
  yearlyCount = yearlyCount ? parseInt(yearlyCount) + 1 : 1;

  // 더한 숫자를 다시 DB에 저장
  await db.put(`daily_${date}`, dailyCount.toString());
  await db.put(`yearly_${year}`, yearlyCount.toString());

  return new Response(JSON.stringify({ daily: dailyCount, yearly: yearlyCount }), {
    headers: { "Content-Type": "application/json" }
  });
}
