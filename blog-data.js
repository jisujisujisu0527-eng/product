const blogPosts = [
    { 
        id: 1, 
        date: "2026-02-18",
        videoId: "CoJki7bCgYU",
        hasVideo: true,
        ko: {
            title: "AI와 영성: 기계가 기도할 수 있을까?",
            excerpt: "인공지능의 발전이 인간 고유의 영역인 기도와 묵상에 던지는 질문들을 살펴봅니다.",
            content: `<p>AI가 기도를 대신해주는 시대, 기도의 본질은 언어가 아니라 '관계'에 있음을 잊지 말아야 합니다.</p>`
        },
        en: {
            title: "AI and Spirituality: Can a Machine Pray?",
            excerpt: "Exploring the questions that AI advancement poses to the unique human realms of prayer.",
            content: `<p>In an era of AI-generated prayers, we must remember that the essence of prayer is 'relationship,' not just words.</p>`
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
                    <p>안녕하세요! 성경 공부가 막막할 때 챗GPT에게 이렇게 물어보세요.</p>
                    <ul>
                        <li><strong>배경 질문:</strong> "빌립보서가 기록될 당시 사도 바울의 상황은 어땠나요?"</li>
                        <li><strong>단어 탐구:</strong> "이 구절에서 '사랑'이라는 단어의 헬라어 원형 '아가페'의 의미를 설명해줘."</li>
                        <li><strong>적용 돕기:</strong> "이 말씀을 오늘날 직장인들이 어떻게 실천할 수 있을까?"</li>
                    </ul>
                    <p class="tip">주의: AI는 훌륭한 조수이지만, 최종 판단은 항상 성경과 기도 속에 하셔야 합니다!</p>
                </div>
            `
        },
        en: {
            title: "A Guide to Bible Study Using ChatGPT",
            alternateContent: `
                <div class="letter-box">
                    <h3>📖 How to use AI as your Bible Study Assistant</h3>
                    <p>Stuck in your study? Try asking ChatGPT these questions:</p>
                    <ul>
                        <li><strong>Context:</strong> "What was Paul's situation when he wrote Philippians?"</li>
                        <li><strong>Word Study:</strong> "Explain the Greek word 'Agape' used in this verse."</li>
                        <li><strong>Application:</strong> "How can young professionals apply this teaching today?"</li>
                    </ul>
                    <p class="tip">Note: AI is an assistant; the Holy Spirit is your Teacher!</p>
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
                    <div class="comic-panel"><strong>[장면 1]</strong> AI가 완벽한 설교를 작성함. "와, 정말 논리적이야!"</div>
                    <div class="comic-panel"><strong>[장면 2]</strong> 하지만 한 성도가 슬픔에 잠겼을 때, AI는 차가운 텍스트만 보냄.</div>
                    <div class="comic-panel"><strong>[장면 3]</strong> 곁에서 함께 울어주는 친구. "이게 바로 하나님의 형상(Imago Dei)이야."</div>
                    <p class="message">AI는 지능을 가졌지만, 우리는 '심장'과 '하나님의 영'을 가졌습니다.</p>
                </div>
            `
        },
        en: {
            title: "Where is Human Uniqueness in the AI Era?",
            alternateContent: `
                <div class="comic-strip">
                    <div class="comic-panel"><strong>[Panel 1]</strong> AI writes a perfect sermon. "So logical!"</div>
                    <div class="comic-panel"><strong>[Panel 2]</strong> A member is crying. AI sends a structured text.</div>
                    <div class="comic-panel"><strong>[Panel 3]</strong> A friend sits and cries with them. "This is Imago Dei."</div>
                    <p class="message">AI has Intelligence; we have the Breath of Life.</p>
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
            alternateContent: `
                <div class="meditation-card">
                    <p>"스마트폰 소리를 잠재우고, 영혼의 귀를 여십시오."</p>
                    <p>오늘의 영적 훈련: <strong>'기술적 금식'</strong></p>
                    <ol>
                        <li>오전 9시까지 스마트폰을 켜지 않습니다.</li>
                        <li>식사 중에는 기기를 멀리합니다.</li>
                        <li>침실에는 성경책만 둡니다.</li>
                    </ol>
                    <p>사막은 고독한 곳이 아니라, 하나님과 단둘이 만나는 지성소입니다.</p>
                </div>
            `
        },
        en: {
            title: "Meeting God in the Digital Wilderness",
            alternateContent: `
                <div class="meditation-card">
                    <p>"Silence the notifications, open the ears of your soul."</p>
                    <p>Spiritual Discipline: <strong>'Tech Fasting'</strong></p>
                    <ol>
                        <li>No phone until 9:00 AM.</li>
                        <li>No devices at the table.</li>
                        <li>Only the Bible in the bedroom.</li>
                    </ol>
                    <p>The wilderness is not a lonely place; it is a sanctuary for you and God.</p>
                </div>
            `
        }
    },
    { 
        id: 5, 
        date: "2026-02-14", 
        hasVideo: false,
        type: "guide",
        ko: {
            title: "예배의 본질과 온라인 환경",
            alternateContent: `
                <div class="letter-box">
                    <h3>💌 성도님께 드리는 편지</h3>
                    <p>스크린 앞에서 예배를 드릴 때, 우리는 종종 관람자가 되곤 합니다. 하지만 주님은 우리의 '참여'를 원하십니다.</p>
                    <p>온라인 예배 팁: 옷을 갖춰 입고, 성경책을 펼치고, 소리 내어 찬양하세요. 주님은 거실 한가운데에도 계십니다.</p>
                </div>
            `
        },
        en: {
            title: "The Essence of Worship and the Online Environment",
            alternateContent: `
                <div class="letter-box">
                    <h3>💌 A Letter to You</h3>
                    <p>In front of a screen, we often become spectators. But God wants our 'participation'.</p>
                    <p>Tip: Dress up, open your Bible, and sing out loud. The Lord is in your living room too.</p>
                </div>
            `
        }
    },
    { 
        id: 6, 
        date: "2026-02-13", 
        hasVideo: false,
        type: "guide",
        ko: { title: "메타버스와 선교의 새로운 지평", alternateContent: "<div class='letter-box'><p>가상 세계도 하나님이 통치하시는 영역입니다. 아바타 뒤에 숨겨진 영혼을 향해 복음의 빛을 비춰야 합니다.</p></div>" },
        en: { title: "Metaverse and the New Horizon of Mission", alternateContent: "<div class='letter-box'><p>The virtual world is also under God's sovereignty. Shine the light of Christ on the souls behind the avatars.</p></div>" }
    },
    { 
        id: 7, 
        date: "2026-02-12", 
        hasVideo: false,
        type: "guide",
        ko: { title: "알고리즘과 영적 형성", alternateContent: "<div class='letter-box'><p>알고리즘이 주는 편안함에 안주하지 마세요. 쓴 소리도 달게 받는 영적 분별력이 필요한 때입니다.</p></div>" },
        en: { title: "Algorithms and Spiritual Formation", alternateContent: "<div class='letter-box'><p>Don't settle for the comfort of algorithms. We need spiritual discernment to embrace challenging truths.</p></div>" }
    },
    { 
        id: 8, 
        date: "2026-02-11", 
        hasVideo: false,
        type: "guide",
        ko: { title: "AI 시대의 기독교 윤리관", alternateContent: "<div class='letter-box'><p>효율성보다 중요한 것은 '이웃 사랑'입니다. 기술이 사람을 소외시키지 않도록 감시하는 것이 우리의 소명입니다.</p></div>" },
        en: { title: "Christian Ethics in the AI Era", alternateContent: "<div class='letter-box'><p>Neighborly love is more important than efficiency. It is our calling to ensure technology doesn't isolate humanity.</p></div>" }
    },
    { 
        id: 9, 
        date: "2026-02-10", 
        hasVideo: false,
        type: "guide",
        ko: { title: "디지털 디톡스와 참된 안식", alternateContent: "<div class='letter-box'><p>진정한 안식은 로그아웃에서 시작됩니다. 기기를 내려놓고 하나님의 창조 세계를 바라보세요.</p></div>" },
        en: { title: "Digital Detox and True Sabbath", alternateContent: "<div class='letter-box'><p>True Sabbath starts with logging out. Put down your device and behold God's creation.</p></div>" }
    },
    { 
        id: 10, 
        date: "2026-02-09", 
        hasVideo: false,
        type: "guide",
        ko: { title: "온라인 공동체의 성경적 모델", alternateContent: "<div class='letter-box'><p>교회는 장소가 아니라 부르심을 받은 사람들의 모임입니다. 디지털 공간에서도 거룩한 연대가 가능합니다.</p></div>" },
        en: { title: "Biblical Model of Online Community", alternateContent: "<div class='letter-box'><p>The Church is not a place, but a gathering of the called. Holy solidarity is possible even in digital spaces.</p></div>" }
    }
];
