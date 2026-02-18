const blogPosts = [
    { 
        id: 1, 
        date: "2026-02-18",
        videoId: "CoJki7bCgYU",
        ko: {
            title: "AI와 영성: 기계가 기도할 수 있을까?",
            excerpt: "인공지능의 발전이 인간 고유의 영역인 기도와 묵상에 던지는 질문들을 살펴봅니다.",
            content: `
                <p>인공지능(AI)이 설교문을 쓰고 기도를 대신해주는 시대, 우리는 '영성'의 본질이 무엇인지 다시 묻게 됩니다.</p>
                <h3>영혼 없는 지능의 한계</h3>
                <p>AI는 수억 개의 문장을 학습하여 완벽한 문법의 기도문을 낼 수 있지만, 하나님과의 '인격적 관계'는 모방할 수 없습니다. 성경은 우리가 '마음을 다해' 기도하라고 가르칩니다.</p>
            `
        },
        en: {
            title: "AI and Spirituality: Can a Machine Pray?",
            excerpt: "Exploring the questions that AI advancement poses to the unique human realms of prayer and meditation.",
            content: `
                <p>In an era where AI writes sermons and prayers, we must ask: What is the essence of spirituality?</p>
                <h3>Limitations of Soulless Intelligence</h3>
                <p>AI can learn millions of sentences to produce grammatically perfect prayers, but it cannot mimic a "personal relationship" with God. The Bible teaches us to pray with all our hearts.</p>
                <p>Technology cannot cry out to God as "Father". The guidance of the Holy Spirit is a blessing reserved only for humanity.</p>
            `
        }
    },
    { 
        id: 2, 
        date: "2026-02-17",
        videoId: "vP_6-8WI9os",
        ko: {
            title: "챗GPT를 활용한 성경 공부 가이드",
            excerpt: "대규모 언어 모델을 활용하여 성경의 역사적 배경을 깊이 있게 연구하는 방법을 소개합니다.",
            content: `<p>챗GPT는 성경의 복잡한 역사적 배경이나 원어의 의미를 빠르게 찾아주는 훌륭한 조수가 될 수 있습니다.</p>`
        },
        en: {
            title: "A Guide to Bible Study Using ChatGPT",
            excerpt: "Introducing ways to use Large Language Models for in-depth research into the historical background of the Bible.",
            content: `
                <p>ChatGPT can be an excellent assistant for quickly finding the complex historical context of the Bible or the meanings of original Greek and Hebrew words.</p>
                <h3>Wise Usage</h3>
                <p>Instead of just looking for answers, ask questions. "How did the Jewish purity laws of the time affect this passage?" Such questions add depth to your meditation.</p>
            `
        }
    },
    { 
        id: 3, 
        date: "2026-02-16",
        videoId: "Ka9Xbt6AtkY",
        ko: {
            title: "AI 시대, 인간의 고유성은 어디에 있는가?",
            excerpt: "하나님의 형상(Imago Dei)으로 창조된 인간이 기계와 구별되는 지점을 탐구합니다.",
            content: `<p>우리는 지능이 뛰어난 생물로서가 아니라, 하나님의 형상으로서 창조되었습니다.</p>`
        },
        en: {
            title: "Where is Human Uniqueness in the AI Era?",
            excerpt: "Exploring how humans, created in the Image of God (Imago Dei), are distinguished from machines.",
            content: `
                <p>We were created not just as highly intelligent biological beings, but in the Image of God (Imago Dei).</p>
                <p>No matter how sophisticated an AI's ethical judgment may be, it is merely the result of processed data. Humans have received a special calling to participate in God's rule and care for creation.</p>
            `
        }
    },
    { 
        id: 4, 
        date: "2026-02-15",
        videoId: "v7bcY_f_ExA",
        ko: {
            title: "디지털 사막에서 만나는 하나님",
            excerpt: "침묵의 영성을 회복하고 하나님께 집중하는 기술적 금식 방법을 나눕니다.",
            content: `<p>현대인의 스마트폰은 새로운 우상이 되기 쉽습니다. 디지털 금식은 결단입니다.</p>`
        },
        en: {
            title: "Meeting God in the Digital Wilderness",
            excerpt: "Sharing methods of 'technical fasting' to restore the spirituality of silence and focus on God.",
            content: `
                <p>The modern smartphone easily becomes a new idol. Digital fasting is not a simple rejection of technology, but a decision to make space for God.</p>
                <p>Try setting a specific time of day as your 'digital wilderness'. In that silence, you will finally begin to hear the still, small voice of God.</p>
            `
        }
    },
    { 
        id: 5, 
        date: "2026-02-14", 
        videoId: "1pX9Z_L2Xsc",
        ko: { title: "예배의 본질과 온라인 환경", excerpt: "온라인 환경에서의 참된 예배를 고민합니다.", content: "<p>예배는 참여하는 것입니다.</p>" },
        en: { title: "The Essence of Worship and the Online Environment", excerpt: "Contemplating true worship in a digital setting.", content: "<p>Worship is not just watching; it is participating. The anointing of the Holy Spirit happens in our hearts, beyond the screen.</p>" }
    },
    { 
        id: 6, 
        date: "2026-02-13", 
        videoId: "X_K6Z9XOnXY",
        ko: { title: "메타버스와 선교의 새로운 지평", excerpt: "가상 현실 공간에서의 복음 전파 가능성.", content: "<p>온라인 공간도 주님의 영역입니다.</p>" },
        en: { title: "Metaverse and the New Horizon of Mission", excerpt: "Possibilities of proclaiming the Gospel in virtual reality spaces.", content: "<p>The online space is also a realm ruled by the Lord. We need a perspective that sees the Metaverse as a fertile ground for missions.</p>" }
    },
    { 
        id: 7, 
        date: "2026-02-12", 
        videoId: "v8WdBZ6fy68",
        ko: { title: "알고리즘과 영적 형성", excerpt: "편향된 신앙관의 위험성을 경계합니다.", content: "<p>말씀을 골고루 섭취해야 합니다.</p>" },
        en: { title: "Algorithms and Spiritual Formation", excerpt: "Guarding against the danger of a biased faith perspective.", content: "<p>We must beware of algorithms that only let us hear what we want to hear, and instead, consume the entirety of God's Word.</p>" }
    },
    { 
        id: 8, 
        date: "2026-02-11", 
        videoId: "kb_IdZOf9iw",
        ko: { title: "AI 시대의 기독교 윤리관", excerpt: "기술 발전 속에서 지켜야 할 가치.", content: "<p>생명 존중과 정의가 중요합니다.</p>" },
        en: { title: "Christian Ethics in the AI Era", excerpt: "Values to uphold amidst technological advancement.", content: "<p>What is more important than the convenience of technology is the respect for life and the realization of justice.</p>" }
    },
    { 
        id: 9, 
        date: "2026-02-10", 
        videoId: "PZ4VzhIuKCQ",
        ko: { title: "디지털 디톡스와 참된 안식", excerpt: "안식일 계명을 통한 쉼의 재해석.", content: "<p>진정한 안식은 로그아웃에서 시작됩니다.</p>" },
        en: { title: "Digital Detox and True Sabbath", excerpt: "Reinterpreting rest through the Sabbath commandment.", content: "<p>True rest begins with logging out. Practice enjoying true peace within the Lord, away from your devices.</p>" }
    },
    { 
        id: 10, 
        date: "2026-02-09", 
        videoId: "Z2X5Scaq7TY",
        ko: { title: "온라인 공동체의 성경적 모델", excerpt: "디지털 시대의 에클레시아 정의.", content: "<p>교회는 사람들의 모임입니다.</p>" },
        en: { title: "Biblical Model of Online Community", excerpt: "Defining 'Ecclesia' in the digital age.", content: "<p>The Church is not a place, but a gathering of people. If there is sincere love and care online, that is the Body of Christ.</p>" }
    }
];
