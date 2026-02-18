// faith-test.js
import { db, collection, addDoc, serverTimestamp } from "./firebase-firestore-service.js";

const form = document.getElementById('faithForm');
const surveyArea = document.getElementById('surveyArea');
const resultArea = document.getElementById('resultArea');

let lastScores = null;

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const q = Object.fromEntries(formData.entries());

    // Validation
    for (let i = 1; i <= 9; i++) {
        if (!q[`q${i}`]) {
            const msg = currentLang === 'ko' ? `${i}번 질문에 답변해주세요.` : `Please answer question ${i}.`;
            alert(msg);
            return;
        }
    }

    const scores = [
        (parseInt(q.q1) + parseInt(q.q2)) / 2, // 영적 민감성
        (parseInt(q.q3) + parseInt(q.q6)) / 2, // 우선순위
        parseInt(q.q4),                        // 말씀 수용성
        parseInt(q.q5),                        // 실천적 순종
        (parseInt(q.q7) + parseInt(q.q9)) / 2, // 공동체 의식
        parseInt(q.q8)                         // 사랑의 나눔
    ];

    lastScores = scores;

    // Save to Firebase
    try {
        await addDoc(collection(db, "faithResults"), {
            name: q.userName || "Anonymous",
            scores: scores,
            rawAnswers: q,
            timestamp: serverTimestamp(),
            lang: currentLang
        });
        alert(translations[currentLang].save_success || "Saved!");
    } catch (error) {
        console.error("Save failed: ", error);
        alert(translations[currentLang].save_fail || "Save failed.");
    }

    showResult(scores);
});

function showResult(scores) {
    if (!scores) return;
    surveyArea.style.display = 'none';
    resultArea.style.display = 'block';

    const labels = [
        translations[currentLang].col_sensitivity,
        translations[currentLang].col_priority,
        translations[currentLang].col_receptivity,
        translations[currentLang].col_obedience,
        translations[currentLang].col_community,
        translations[currentLang].col_sharing
    ];

    const ctx = document.getElementById('faithChart').getContext('2d');
    
    // Destroy existing chart if it exists to avoid overlap on re-render
    if (window.myFaithChart) {
        window.myFaithChart.destroy();
    }

    window.myFaithChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                label: translations[currentLang].chart_label,
                data: scores,
                backgroundColor: 'rgba(255, 171, 64, 0.4)',
                borderColor: '#FFAB40',
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
                    ticks: { stepSize: 1, color: '#4E342E' },
                    pointLabels: { color: '#4E342E' },
                    grid: { color: 'rgba(78, 52, 46, 0.2)' },
                    angleLines: { color: 'rgba(78, 52, 46, 0.3)' }
                }
            },
            plugins: {
                legend: { labels: { color: '#4E342E' } }
            }
        }
    });

    const maxScore = Math.max(...scores);
    const maxIdx = scores.indexOf(maxScore);
    const minScore = Math.min(...scores);
    const minIdx = scores.indexOf(minScore);

    const typeTitle = translations[currentLang][`faith_type_${maxIdx + 1}`];
    const feedbackMsg = translations[currentLang][`faith_type_${maxIdx + 1}_desc`];
    const weakArea = labels[minIdx];

    document.getElementById('typeDescription').innerHTML = `
        <div style="font-size:1.4rem; color:#D84315; margin-bottom:10px;">[${typeTitle}]</div>
        <p style="font-weight:normal; color:#333;">${feedbackMsg}</p>
        <p style="margin-top:15px; font-size:0.9rem; color:#666;">
            ${translations[currentLang].growth_area}: <span style="color:#D84315; font-weight:bold;">${weakArea}</span>
        </p>
    `;
    
    // Add Dashboard Link
    if (!document.getElementById('dashLink')) {
        const btn = document.createElement('button');
        btn.id = 'dashLink';
        btn.textContent = translations[currentLang].nav_dashboard;
        btn.style.cssText = "margin-top:10px; background:#B07C6F; width: 100%;";
        btn.onclick = () => window.location.href = 'faith-dashboard.html';
        resultArea.appendChild(btn);
    }
}

// Re-render chart and text if language changes
window.addEventListener('languageChanged', () => {
    if (resultArea.style.display === 'block') {
        showResult(lastScores);
        // Update dashboard link text
        const dashBtn = document.getElementById('dashLink');
        if (dashBtn) dashBtn.textContent = translations[currentLang].nav_dashboard;
    }
});
