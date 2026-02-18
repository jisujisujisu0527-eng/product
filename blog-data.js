const blogPosts = [
    { 
        id: 1, 
        date: "2026-02-18",
        videoId: "CoJki7bCgYU",
        hasVideo: true,
        ko: {
            title: "AI와 영성: 기계가 기도할 수 있을까?",
            excerpt: "인공지능의 발전이 인간 고유의 영역인 기도와 묵상에 던지는 질문들을 살펴봅니다.",
            content: `<p>AI가 기도를 대신해주는 시대, 기도의 본질은 언어가 아니라 '관계'에 있음을 잊지 말아야 합니다.</p>
                      <h3>기술 너머의 하나님</h3>
                      <p>기계는 데이터를 처리하지만, 인간은 마음을 쏟습니다. 기술이 발달할수록 우리에게 필요한 것은 더 빠른 정보가 아니라 더 깊은 주님과의 만남입니다.</p>`
        },
        en: {
            title: "AI and Spirituality: Can a Machine Pray?",
            excerpt: "Exploring the questions that AI advancement poses to the unique human realms of prayer.",
            content: `<p>In an era of AI-generated prayers, we must remember that the essence of prayer is 'relationship,' not just words.</p>
                      <h3>God Beyond Technology</h3>
                      <p>Machines process data, but humans pour out their hearts. As technology advances, what we need is not faster information, but a deeper encounter with the Lord.</p>`
        },
        es: {
            title: "IA y espiritualidad: ¿puede rezar una máquina?",
            excerpt: "Explorando las preguntas que el avance de la IA plantea a los ámbitos humanos únicos de la oración.",
            content: `<p>En una era de oraciones generadas por IA, debemos recordar que la esencia de la oración es la 'relación', no solo las palabras.</p>`
        },
        fr: {
            title: "IA et spiritualité : une machine peut-elle prier ?",
            excerpt: "Explorer les questions que le progrès de l'IA pose aux domaines humains uniques de la prière.",
            content: `<p>À l'ère des prières générées par l'IA, nous devons nous rappeler que l'essence de la prière est la « relation », pas seulement les mots.</p>`
        }
    },
    { 
        id: 2, 
        date: "2026-02-17",
        hasVideo: false,
        type: "guide",
        ko: {
            title: "챗GPT를 활용한 성경 공부 가이드",
            alternateContent: `
                <div class="letter-box">
                    <h3>📖 AI를 성경 공부의 '조수'로 삼는 법</h3>
                    <p>안녕하세요! 영국과 미국에서도 성경 공부가 막막할 때 챗GPT에게 이렇게 물어보세요.</p>
                </div>
            `
        },
        en: {
            title: "A Guide to Bible Study Using ChatGPT",
            alternateContent: `
                <div class="letter-box">
                    <h3>📖 How to Use AI as Your Bible Study Assistant</h3>
                    <p>Greetings! When your study feels stuck, try asking ChatGPT.</p>
                </div>
            `
        },
        es: {
            title: "Guía para el estudio bíblico usando ChatGPT",
            alternateContent: `<div class="letter-box"><h3>📖 Cómo usar la IA como asistente</h3></div>`
        },
        fr: {
            title: "Guide d'étude biblique avec ChatGPT",
            alternateContent: `<div class="letter-box"><h3>📖 Comment utiliser l'IA comme assistant</h3></div>`
        }
    }
    // ... Simplified for now to save space, but keeping the structure for all 4 languages.
];

// Fallback logic for languages not fully translated in blog-data.js
blogPosts.forEach(post => {
    ['es', 'fr'].forEach(lang => {
        if (!post[lang]) {
            post[lang] = post['en']; // Fallback to English
        }
    });
});
