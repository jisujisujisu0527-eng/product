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
                    <ul>
                        <li><strong>배경 질문:</strong> "빌립보서가 기록될 당시 상황은 어땠나요?"</li>
                        <li><strong>단어 탐구:</strong> "'아가페'의 의미를 설명해줘."</li>
                    </ul>
                </div>
            `
        },
        en: {
            title: "A Guide to Bible Study Using ChatGPT",
            alternateContent: `
                <div class="letter-box">
                    <h3>📖 How to Use AI as Your Bible Study Assistant</h3>
                    <p>Greetings! When your study feels stuck, try asking ChatGPT these questions:</p>
                    <ul>
                        <li><strong>Context:</strong> "What was the historical context of the Philippians?"</li>
                        <li><strong>Word Study:</strong> "Explain the deep meaning of 'Agape' in Greek."</li>
                    </ul>
                </div>
            `
        }
    },
    { 
        id: 3, 
        date: "2026-02-16",
        hasVideo: false,
        type: "comic",
        ko: {
            title: "AI 시대, 인간의 고유성은 어디에 있는가?",
            alternateContent: `
                <div class="comic-strip">
                    <div class="comic-panel">AI는 정답을 말하지만, 사람은 사랑을 말합니다.</div>
                    <p class="message">우리는 하나님의 형상(Imago Dei)으로 창조되었습니다.</p>
                </div>
            `
        },
        en: {
            title: "Where is Human Uniqueness in the AI Era?",
            alternateContent: `
                <div class="comic-strip">
                    <div class="comic-panel">AI speaks answers, but humans speak love.</div>
                    <p class="message">We are created in the Image of God (Imago Dei).</p>
                </div>
            `
        }
    },
    { 
        id: 4, 
        date: "2026-02-15",
        hasVideo: false,
        type: "letter",
        ko: {
            title: "디지털 사막에서 만나는 하나님",
            alternateContent: `<div class="meditation-card"><p>"스마트폰을 잠시 내려놓고 주님의 음성에 귀 기울이세요."</p></div>`
        },
        en: {
            title: "Meeting God in the Digital Wilderness",
            alternateContent: `<div class="meditation-card"><p>"Put down your smartphone for a moment and listen to the voice of the Lord."</p></div>`
        }
    },
    { 
        id: 5, 
        date: "2026-02-14", 
        hasVideo: false,
        ko: { title: "예배의 본질과 온라인 환경", alternateContent: "<div class='letter-box'><p>예배는 관람이 아니라 참여입니다.</p></div>" },
        en: { title: "The Essence of Worship and the Online Environment", alternateContent: "<div class='letter-box'><p>Worship is not a spectacle, but participation.</p></div>" }
    },
    { 
        id: 6, 
        date: "2026-02-13", 
        hasVideo: false,
        ko: { title: "메타버스와 선교의 새로운 지평", alternateContent: "<div class='letter-box'><p>가상 세계도 복음이 필요한 곳입니다.</p></div>" },
        en: { title: "Metaverse and the New Horizon of Mission", alternateContent: "<div class='letter-box'><p>The virtual world also needs the Gospel.</p></div>" }
    },
    { 
        id: 7, 
        date: "2026-02-12", 
        hasVideo: false,
        ko: { title: "알고리즘과 영적 형성", alternateContent: "<div class='letter-box'><p>알고리즘이 주는 편식에서 벗어나세요.</p></div>" },
        en: { title: "Algorithms and Spiritual Formation", alternateContent: "<div class='letter-box'><p>Break free from the selective feeding of algorithms.</p></div>" }
    },
    { 
        id: 8, 
        date: "2026-02-11", 
        hasVideo: false,
        ko: { title: "AI 시대의 기독교 윤리관", alternateContent: "<div class='letter-box'><p>사람을 세우는 기술이 되어야 합니다.</p></div>" },
        en: { title: "Christian Ethics in the AI Era", alternateContent: "<div class='letter-box'><p>Technology must serve to build people up.</p></div>" }
    },
    { 
        id: 9, 
        date: "2026-02-10", 
        hasVideo: false,
        ko: { title: "디지털 디톡스와 참된 안식", alternateContent: "<div class='letter-box'><p>로그아웃이 안식의 시작입니다.</p></div>" },
        en: { title: "Digital Detox and True Sabbath", alternateContent: "<div class='letter-box'><p>Logging out is the beginning of the Sabbath.</p></div>" }
    },
    { 
        id: 10, 
        date: "2026-02-09", 
        hasVideo: false,
        ko: { title: "온라인 공동체의 성경적 모델", alternateContent: "<div class='letter-box'><p>어디서든 주님의 이름으로 모이세요.</p></div>" },
        en: { title: "Biblical Model of Online Community", alternateContent: "<div class='letter-box'><p>Gather in the Lord's name, wherever you are.</p></div>" }
    }
];
