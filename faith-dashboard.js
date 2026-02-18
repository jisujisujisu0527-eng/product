// faith-dashboard.js
import { getRecentFaithCheckups } from "./firebase-firestore-service.js";

let lastAvgScores = null;

async function loadDashboard() {
    const tableBody = document.querySelector('#faithResultsTable tbody');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    const totalCountEl = document.getElementById('totalCount');

    if (!tableBody) return;

    tableBody.innerHTML = '';
    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        const checkups = await getRecentFaithCheckups();
        loadingMessage.style.display = 'none';

        if (checkups.length === 0) {
            const noDataMsg = currentLang === 'ko' ? '아직 등록된 결과가 없습니다.' : 'No results found.';
            tableBody.innerHTML = `<tr><td colspan="8">${noDataMsg}</td></tr>`;
            return;
        }

        const countMsg = currentLang === 'ko' ? `총 ${checkups.length}건의 응답이 집계되었습니다.` : `Total ${checkups.length} responses collected.`;
        totalCountEl.textContent = countMsg;

        let totalScores = [0, 0, 0, 0, 0, 0];
        
        checkups.forEach(checkup => {
            const row = tableBody.insertRow();
            const scores = checkup.scores || [0, 0, 0, 0, 0, 0];
            const timestamp = checkup.timestamp ? new Date(checkup.timestamp.toDate()).toLocaleDateString(currentLang) : 'N/A';

            row.insertCell().textContent = checkup.name || checkup.rawAnswers?.userName || (currentLang === 'ko' ? '익명' : 'Anonymous');
            row.insertCell().textContent = scores[0]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[1]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[2]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[3]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[4]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = scores[5]?.toFixed(1) || 'N/A';
            row.insertCell().textContent = timestamp;

            for(let i=0; i<6; i++) totalScores[i] += (scores[i] || 0);
        });

        const avgScores = totalScores.map(s => s / checkups.length);
        lastAvgScores = avgScores;
        drawAverageChart(avgScores);

    } catch (error) {
        console.error("Dashboard data load failed:", error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
    }
}

function drawAverageChart(avgScores) {
    const canvas = document.getElementById('averageFaithChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const labels = [
        translations[currentLang].col_sensitivity,
        translations[currentLang].col_priority,
        translations[currentLang].col_receptivity,
        translations[currentLang].col_obedience,
        translations[currentLang].col_community,
        translations[currentLang].col_sharing
    ];

    if (window.avgChart) window.avgChart.destroy();

    window.avgChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: currentLang === 'ko' ? '공동체 평균 밸런스' : 'Community Average Balance',
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

document.addEventListener('DOMContentLoaded', loadDashboard);

window.addEventListener('languageChanged', () => {
    loadDashboard();
});
