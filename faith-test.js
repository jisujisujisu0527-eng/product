// firebase-test.js

import { db, collection, addDoc, serverTimestamp } from "./firebase-firestore-service.js"; // Import from our service file

const form = document.getElementById('faithForm');
const surveyArea = document.getElementById('surveyArea');
const resultArea = document.getElementById('resultArea');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const q = Object.fromEntries(formData.entries());

    // 모든 질문에 답변했는지 확인
    for (let i = 1; i <= 9; i++) {
        if (!q[`q${i}`]) {
            alert(`${i}번 질문에 답변해주세요.`);
            return;
        }
    }

    // 6가지 지표 점수 계산 (각 항목 5점 만점)
    const scores = [
        (parseInt(q.q1) + parseInt(q.q2)) / 2, // 영적 민감성
        (parseInt(q.q3) + parseInt(q.q6)) / 2, // 우선순위
        parseInt(q.q4),                        // 말씀 수용성
        parseInt(q.q5),                        // 실천적 순종
        (parseInt(q.q7) + parseInt(q.q9)) / 2, // 공동체 의식
        parseInt(q.q8)                         // 사랑의 나눔
    ];

    // 1. Firebase에 데이터 저장
    try {
        await addDoc(collection(db, "faithResults"), {
            scores: scores,
            rawAnswers: q,
            timestamp: serverTimestamp()
        });
        console.log("저장 성공!");
        alert("신앙 점검 결과가 저장되었습니다.");
    } catch (error) {
        console.error("저장 실패: ", error);
        alert("데이터 저장에 실패했습니다. Firebase 설정을 확인해주세요.");
    }

    // 2. 차트 표시
    showResult(scores);
});

function showResult(scores) {
    surveyArea.style.display = 'none';
    resultArea.style.display = 'block';

    const ctx = document.getElementById('faithChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['영적 민감성', '우선순위', '말씀 수용성', '실천적 순종', '공동체 의식', '사랑의 나눔'],
            datasets: [{
                label: '나의 신앙 밸런스',
                data: scores,
                backgroundColor: 'rgba(255, 171, 64, 0.4)', /* Warm Orange */
                borderColor: '#FFAB40', /* Warm Orange */
                borderWidth: 2,
                pointBackgroundColor: '#FFAB40'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                r: {
                    beginAtZero: true,
                    max: 5,
                    ticks: { 
                        stepSize: 1,
                        color: '#4E342E' /* Dark Brown for ticks */
                    },
                    pointLabels: {
                        color: '#4E342E' /* Dark Brown for labels */
                    },
                    grid: {
                        color: 'rgba(78, 52, 46, 0.2)' /* Light brown grid */
                    },
                    angleLines: {
                        color: 'rgba(78, 52, 46, 0.3)' /* Darker brown angle lines */
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#4E342E' /* Dark Brown for legend */
                    }
                }
            }
        }
    });

    // 간단한 유형 분석 및 결론 도출
    const maxScore = Math.max(...scores);
    const maxIdx = scores.indexOf(maxScore);
    const minScore = Math.min(...scores);
    const minIdx = scores.indexOf(minScore);

    const types = {
        ko: ["민감한 동행자", "충성된 일꾼", "말씀의 사람", "행동하는 제자", "교회의 기둥", "사랑의 통로"],
        en: ["Sensitive Companion", "Faithful Worker", "Person of the Word", "Acting Disciple", "Pillar of the Church", "Channel of Love"]
    };

    const feedbacks = {
        ko: [
            "주님의 세밀한 음성에 귀 기울이는 모습이 아름답습니다. 그 평안을 주변에 흘려보내 보세요.",
            "하나님 나라를 위해 헌신하는 당신의 손길이 귀합니다. 때로는 주님 안에서 참된 안식을 누리시기 바랍니다.",
            "말씀을 사랑하는 당신, 깊은 묵상이 삶의 능력이 될 것입니다. 읽은 말씀을 하나씩 실천해 보세요.",
            "행함이 있는 믿음을 가진 당신은 세상의 빛입니다. 그 열정이 식지 않도록 기도로 기둥을 세우세요.",
            "공동체를 아끼는 당신의 마음이 교회를 든든히 세웁니다. 소외된 지체에게 먼저 다가가 주세요.",
            "그리스도의 사랑을 실천하는 당신을 통해 주님이 기뻐하십니다. 더 넓은 세상을 향해 나아가세요."
        ],
        en: [
            "Your attentiveness to God's still small voice is beautiful. Share that peace with those around you.",
            "Your dedication to God's kingdom is precious. Remember to find true rest in the Lord as well.",
            "As a lover of the Word, deep meditation will be your strength. Try practicing what you read one by one.",
            "You are the light of the world with faith that acts. Build a pillar of prayer so your passion stays bright.",
            "Your love for the community strengthens the church. Reach out to those who might feel left out.",
            "The Lord rejoices through you as you practice Christ's love. Step out towards a wider world."
        ]
    };

    const currentLang = localStorage.getItem('lang') || 'ko';
    const typeTitle = types[currentLang][maxIdx];
    const feedbackMsg = feedbacks[currentLang][maxIdx];
    const weakArea = currentLang === 'ko' ? 
        ['영적 민감성', '우선순위', '말씀 수용성', '실천적 순종', '공동체 의식', '사랑의 나눔'][minIdx] :
        ['Spiritual Sensitivity', 'Priority', 'Word Receptivity', 'Practical Obedience', 'Community Awareness', 'Channel of Love'][minIdx];

    document.getElementById('typeDescription').innerHTML = `
        <div style="font-size:1.4rem; color:#D84315; margin-bottom:10px;">[${typeTitle}]</div>
        <p style="font-weight:normal; color:#333;">${feedbackMsg}</p>
        <p style="margin-top:15px; font-size:0.9rem; color:#666;">
            ${currentLang === 'ko' ? '집중 보완 필요 영역:' : 'Area for Growth:'} <span style="color:#D84315; font-weight:bold;">${weakArea}</span>
        </p>
    `;
    
    // 추가: 대시보드 링크 추가
    const resultButtons = document.querySelector('#resultArea button');
    resultButtons.insertAdjacentHTML('afterend', `
        <button onclick="window.location.href='faith-dashboard.html'" style="margin-top:10px; background:#B07C6F;">전체 결과 보기</button>
    `);
}