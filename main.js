const verses = [
    {
        text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.",
        reference: "요한복음 3:16"
    },
    {
        text: "여호와는 나의 목자시니 내게 부족함이 없으리로다.",
        reference: "시편 23:1"
    },
    {
        text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.",
        reference: "빌립보서 4:13"
    }
];

const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
const newVerseBtn = document.getElementById('new-verse-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function getRandomVerse() {
    return verses[Math.floor(Math.random() * verses.length)];
}

function displayVerse() {
    const verse = getRandomVerse();
    verseText.textContent = `\"${verse.text}\"`;
    verseReference.textContent = verse.reference;
}

newVerseBtn.addEventListener('click', displayVerse);

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

displayVerse();