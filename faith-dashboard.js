// faith-dashboard.js
import { getRecentFaithCheckups } from "./firebase-firestore-service.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#faithResultsTable tbody');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const totalCountEl = document.getElementById('totalCount');

    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        const checkups = await getRecentFaithCheckups();
        
        loadingMessage.style.display = 'none';

        if (checkups.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8">아직 등록된 신앙 점검 결과가 없습니다.</td></tr>';
            return;
        }

        totalCountEl.textContent = `총 ${checkups.length}건의 응답이 집계되었습니다.`;

        let totalScores = [0, 0, 0, 0, 0, 0];
        
        checkups.forEach(checkup => {
            const row = tableBody.insertRow();
            const scores = checkup.scores || [0, 0, 0, 0, 0, 0];
            const timestamp = checkup.timestamp ? new Date(checkup.timestamp.toDate()).toLocaleDateString() : 'N/A';

            row.insertCell().textContent = checkup.rawAnswers?.userName || '익명';
            row.insertCell().textContent = scores[0]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[1]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[2]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[3]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[4]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[5]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = timestamp;

            // 평균 계산을 위한 누적
            for(let i=0; i<6; i++) totalScores[i] += (scores[i] || 0);
        });

        const avgScores = totalScores.map(s => s / checkups.length);
        drawAverageChart(avgScores);

    } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        tableBody.innerHTML = '<tr><td colspan="8">데이터를 불러오는 중 오류가 발생했습니다.</td></tr>';
    }
});

function drawAverageChart(avgScores) {
    const ctx = document.getElementById('averageFaithChart').getContext('2d');
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['영적 민감성', '우선순위', '말씀 수용성', '실천적 순종', '공동체 의식', '사랑의 나눔'],
            datasets: [{
                label: '공동체 평균 밸런스',
                data: avgScores,
                backgroundColor: 'rgba(40, 167, 69, 0.4)',
                borderColor: '#28a745',
                borderWidth: 2,
                pointBackgroundColor: '#28a745'
            }]
        },
        options: {
            scales: {
                r: { beginAtZero: true, max: 5 }
            }
        }
    });
}