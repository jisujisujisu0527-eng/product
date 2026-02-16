// WARNING: Do not expose this key in a public repository.
// For this exercise, we are storing it here for simplicity.
const UNSPLASH_API_KEY = '875932';

const bibleBooks = {
    "창세기": 50, "출애굽기": 40, "레위기": 27, "민수기": 36, "신명기": 34,
    "여호수아": 24, "사사기": 21, "룻기": 4, "사무엘상": 31, "사무엘하": 24,
    "열왕기상": 22, "열왕기하": 25, "역대상": 29, "역대하": 36, "에스라": 10,
    "느헤미야": 13, "에스더": 10, "욥기": 42, "시편": 150, "잠언": 31,
    "전도서": 12, "아가": 8, "이사야": 66, "예레미야": 52, "예레미야애가": 5,
    "에스겔": 48, "다니엘": 12, "호세아": 14, "요엘": 3, "아모스": 9,
    "오바댜": 1, "요나": 4, "미가": 7, "나훔": 3, "하박국": 3, "스바냐": 3,
    "학개": 2, "스가랴": 14, "말라기": 4,
    "마태복음": 28, "마가복음": 16, "누가복음": 24, "요한복음": 21, "사도행전": 28,
    "로마서": 16, "고린도전서": 16, "고린도후서": 13, "갈라디아서": 6, "에베소서": 6,
    "빌립보서": 4, "골로새서": 4, "데살로니가전서": 5, "데살로니가후서": 3, "디모데전서": 6,
    "디모데후서": 4, "디도서": 3, "빌레몬서": 1, "히브리서": 13, "야고보서": 5,
    "베드로전서": 5, "베드로후서": 3, "요한1서": 5, "요한2서": 1, "요한3서": 1,
    "유다서": 1, "요한계시록": 22
};

const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
const verseImage = document.getElementById('verse-image');
const newVerseBtn = document.getElementById('new-verse-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');

function getRandomBook() {
    const books = Object.keys(bibleBooks);
    return books[Math.floor(Math.random() * books.length)];
}

async function getVerseImage(query) {
    const url = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.results.length > 0) {
            return data.results[0].urls.regular;
        }
    } catch (error) {
        console.error("Error fetching image from Unsplash:", error);
    }
    return "https://images.unsplash.com/photo-1451187580459-43490279c0fa"; // Default image
}

async function getRandomVerse() {
    const book = getRandomBook();
    const chapter = Math.floor(Math.random() * bibleBooks[book]) + 1;
    const url = `https://bible-api.com/${book}+${chapter}?translation=ko`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        const verse = data.verses[Math.floor(Math.random() * data.verses.length)];
        displayVerse(verse.text, data.reference);
    } catch (error) {
        console.error("Error fetching verse:", error);
        verseText.textContent = "구절을 불러오는 데 실패했습니다.";
        verseReference.textContent = "";
    }
}

async function displayVerse(text, reference) {
    verseText.textContent = `\"${text}\"`;
    verseReference.textContent = reference;
    const imageUrl = await getVerseImage(reference);
    verseImage.src = imageUrl;
}

newVerseBtn.addEventListener('click', getRandomVerse);

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

getRandomVerse();