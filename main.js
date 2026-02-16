const verses = [
    {
        text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.",
        reference: "요한복음 3:16",
        image: "https://images.unsplash.com/photo-1501854140801-50d01698950b"
    },
    {
        text: "여호와는 나의 목자시니 내게 부족함이 없으리로다.",
        reference: "시편 23:1",
        image: "https://images.unsplash.com/photo-1511193311914-3c6d7e0c9f1e"
    },
    {
        text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.",
        reference: "빌립보서 4:13",
        image: "https://images.unsplash.com/photo-1534440877909-5d4a0b3e6a43"
    },
    {
        text: "내가 네게 명령한 것이 아니냐 강하고 담대하라 두려워하지 말며 놀라지 말라 네가 어디로 가든지 네 하나님 여호와가 너와 함께 하느니라 하시니라",
        reference: "여호수아 1:9",
        image: "https://images.unsplash.com/photo-1506744038136-46273834b378"
    },
    {
        text: "태초에 하나님이 천지를 창조하시니라",
        reference: "창세기 1:1",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa"
    }
];

const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
const verseImage = document.getElementById('verse-image');
const newVerseBtn = document.getElementById('new-verse-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function getRandomVerse() {
    return verses[Math.floor(Math.random() * verses.length)];
}

function displayVerse() {
    const verse = getRandomVerse();
    verseText.textContent = `\"${verse.text}\"`;
    verseReference.textContent = verse.reference;
    verseImage.src = verse.image;
}

newVerseBtn.addEventListener('click', displayVerse);

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

displayVerse();