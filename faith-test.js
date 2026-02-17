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

    // 간단한 유형 분석
    const maxScore = Math.max(...scores);
    const maxIdx = scores.indexOf(maxScore);
    const types = ["민감한 동행자", "충성된 일꾼", "말씀의 사람", "행동하는 제자", "교회의 기둥", "사랑의 통로"];
    document.getElementById('typeDescription').innerText = `성도님은 현재 [${types[maxIdx]}] 유형에 가깝습니다!`;
    
    // 추가: 대시보드 링크 추가
    const resultButtons = document.querySelector('#resultArea button');
    resultButtons.insertAdjacentHTML('afterend', `
        <button onclick="window.location.href='faith-dashboard.html'" style="margin-top:10px; background:#B07C6F;">전체 결과 보기</button>
    `);
}