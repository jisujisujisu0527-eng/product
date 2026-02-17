// faith-dashboard.js
import { getRecentFaithCheckups } from "./firebase-firestore-service.js";

document.addEventListener('DOMContentLoaded', async () => {
    const tableBody = document.querySelector('#faithResultsTable tbody');
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');

    loadingMessage.style.display = 'block';
    errorMessage.style.display = 'none';

    try {
        const checkups = await getRecentFaithCheckups();
        
        loadingMessage.style.display = 'none';

        if (checkups.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8">아직 등록된 신앙 점검 결과가 없습니다.</td></tr>';
            return;
        }

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
        });

    } catch (error) {
        console.error("대시보드 데이터 로드 실패:", error);
        loadingMessage.style.display = 'none';
        errorMessage.style.display = 'block';
        tableBody.innerHTML = '<tr><td colspan="8">데이터를 불러오는 중 오류가 발생했습니다.</td></tr>';
    }
});