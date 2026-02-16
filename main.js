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

async function getRandomVerse(retryCount = 0) {
    if (retryCount >= 5) {
        verseText.textContent = "구절을 불러오는 데 실패했습니다.";
        verseReference.textContent = "";
        return;
    }

    const koreanBook = getRandomBook();
    const englishBook = koreanToEnglish[koreanBook];
    const chapter = Math.floor(Math.random() * bibleBooks[koreanBook]) + 1;
    const url = `https://corsproxy.io/?https://bible-api.com/${englishBook}+${chapter}?translation=ko`;
    console.log("Fetching verse from URL:", url);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.verses && data.verses.length > 0) {
            const verse = data.verses[Math.floor(Math.random() * data.verses.length)];
            displayVerse(verse.text, data.reference);
        } else {
            console.warn("Invalid verse data, retrying...", data);
            getRandomVerse(retryCount + 1);
        }
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