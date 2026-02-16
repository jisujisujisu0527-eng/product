console.log("Running version 1.2");

// WARNING: Do not expose this key in a public repository.
// For this exercise, we are storing it here for simplicity.
const UNSPLASH_API_KEY = '875932';

const popularVerses = [
    { text: "태초에 하나님이 천지를 창조하시니라", reference: "창세기 1:1" },
    { text: "네 시작은 미약하였으나 네 나중은 심히 창대하리라", reference: "욥기 8:7" },
    { text: "항상 기뻐하라 쉬지 말고 기도하라 범사에 감사하라 이것이 그리스도 예수 안에서 너희를 향하신 하나님의 뜻이니라", reference: "데살로니가전서 5:16-18" },
    { text: "수고하고 무거운 짐 진 자들아 다 내게로 오라 내가 너희를 쉬게 하리라", reference: "마태복음 11:28" },
    { text: "그런즉 믿음, 소망, 사랑, 이 세 가지는 항상 있을 것인데 그 중의 제일은 사랑이라", reference: "고린도전서 13:13" },
    { text: "두려워하지 말라 내가 너와 함께 함이라 놀라지 말라 나는 네 하나님이 됨이라 내가 너를 굳세게 하리라 참으로 너를 도와 주리라 참으로 나의 의로운 오른손으로 너를 붙들리라", reference: "이사야 41:10" },
    { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다", reference: "시편 23:1" },
    { text: "내가 그리스도와 함께 십자가에 못 박혔나니 그런즉 이제는 내가 사는 것이 아니요 오직 내 안에 그리스도께서 사시는 것이라 이제 내가 육체 가운데 사는 것은 나를 사랑하사 나를 위하여 자기 자신을 버리신 하나님의 아들을 믿는 믿음 안에서 사는 것이라", reference: "갈라디아서 2:20" },
    { text: "너희는 먼저 그의 나라와 그의 의를 구하라 그리하면 이 모든 것을 너희에게 더하시리라", reference: "마태복음 6:33" },
    { text: "아무 것도 염려하지 말고 다만 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라", reference: "빌립보서 4:6" }
];

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

const koreanToEnglish = {
    "창세기": "Genesis", "출애굽기": "Exodus", "레위기": "Leviticus", "민수기": "Numbers",
    "신명기": "Deuteronomy", "여호수아": "Joshua", "사사기": "Judges", "룻기": "Ruth",
    "사무엘상": "1 Samuel", "사무엘하": "2 Samuel", "열왕기상": "1 Kings", "열왕기하": "2 Kings",
    "역대상": "1 Chronicles", "역대하": "2 Chronicles", "에스라": "Ezra", "느헤미야": "Nehemiah",
    "에스더": "Esther", "욥기": "Job", "시편": "Psalms", "잠언": "Proverbs",
    "전도서": "Ecclesiastes", "아가": "Song of Songs", "이사야": "Isaiah",
    "예레미야": "Jeremiah", "예레미야애가": "Lamentations", "에스겔": "Ezekiel",
    "다니엘": "Daniel", "호세아": "Hosea", "요엘": "Joel", "아모스": "Amos",
    "오바댜": "Obadiah", "요나": "Jonah", "미가": "Micah", "나훔": "Nahum",
    "하박국": "Habakkuk", "스바냐": "Zephaniah", "학개": "Haggai", "스가랴": "Zechariah",
    "말라기": "Malachi",
    "마태복음": "Matthew", "마가복음": "Mark", "누가복음": "Luke", "요한복음": "John",
    "사도행전": "Acts", "로마서": "Romans", "고린도전서": "1 Corinthians",
    "고린도후서": "2 Corinthians", "갈라디아서": "Galatians", "에베소서": "Ephesians",
    "빌립보서": "Philippians", "골로새서": "Colossians", "데살로니가전서": "1 Thessalonians",
    "데살로니가후서": "2 Thessalonians", "디모데전서": "1 Timothy", "디모데후서": "2 Timothy",
    "디도서": "Titus", "빌레몬서": "Philemon", "히브리서": "Hebrews", "야고보서": "James",
    "베드로전서": "1 Peter", "베드로후서": "2 Peter", "요한1서": "1 John",
    "요한2서": "2 John", "요한3서": "3 John", "유다서": "Jude", "요한계시록": "Revelation"
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
    console.log("Fetching image from URL:", url);
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
    // 50% chance to display a popular verse
    if (Math.random() < 0.5) {
        const verse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
        displayVerse(verse.text, verse.reference);
        return;
    }

    // Fetch a random verse from the API
    const koreanBook = getRandomBook();
    const englishBook = koreanToEnglish[koreanBook];
    const chapter = Math.floor(Math.random() * bibleBooks[koreanBook]) + 1;
    const url = `https://bible-api.com/${englishBook}+${chapter}?translation=ko`;
    console.log("Fetching verse from URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.verses && data.verses.length > 0) {
            const verse = data.verses[Math.floor(Math.random() * data.verses.length)];
            displayVerse(verse.text, data.reference);
        } else {
            console.warn("Invalid verse data, falling back to popular verses.", data);
            const verse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
            displayVerse(verse.text, verse.reference);
        }
    } catch (error) {
        console.error("Error fetching verse, falling back to popular verses:", error);
        const verse = popularVerses[Math.floor(Math.random() * popularVerses.length)];
        displayVerse(verse.text, verse.reference);
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