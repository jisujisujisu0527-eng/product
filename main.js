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

const prayerVerses = [
    { text: "쉬지 말고 기도하라, 너희의 필요를 주께 아뢰고 감사함으로 간구하라. 그리하면 평강이 너희 마음을 지키리라.", reference: "빌립보서 4:6-7 변형" },
    { text: "주님을 찾으라, 그를 부를 때 그는 가까이 계시니, 의인의 기도는 역사하는 힘이 많으니라.", reference: "야고보서 5:16 변형" },
    { text: "너희 중에 고난당하는 자가 있느냐 그는 기도할 것이요 즐거워하는 자가 있느냐 그는 찬송할지니라.", reference: "야고보서 5:13 변형" },
    { text: "구하라 그러면 너희에게 주실 것이요 찾으라 그러면 찾을 것이요 문을 두드리라 그러면 너희에게 열릴 것이니.", reference: "마태복음 7:7 변형" },
    { text: "아무것도 염려하지 말고 오직 모든 일에 기도와 간구로, 너희 구할 것을 감사함으로 하나님께 아뢰라.", reference: "빌립보서 4:6-7" },
    { text: "너희는 마음에 근심하지 말라 하나님을 믿으니 또 나를 믿으라.", reference: "요한복음 14:1" },
    { text: "내게 능력 주시는 자 안에서 내가 모든 것을 할 수 있느니라.", reference: "빌립보서 4:13" },
    { text: "여호와는 나의 목자시니 내게 부족함이 없으리로다.", reference: "시편 23:1" }
];

const evangelismVerses = [
    { text: "온 천하에 다니며 모든 피조물에게 복음을 전파하라. 믿고 세례를 받는 자는 구원을 얻으리라.", reference: "마가복음 16:15-16 변형" },
    { text: "내가 곧 길이요 진리요 생명이니 나로 말미암지 않고는 아버지께 올 자가 없느느리라. 주 예수를 믿으라 그리하면 너와 네 집이 구원을 받으리라.", reference: "요한복음 14:6, 사도행전 16:31 변형" },
    { text: "너희는 세상의 빛이라 산 위에 있는 동네가 숨겨지지 못할 것이요.", reference: "마태복음 5:14 변형" },
    { text: "하나님이 세상을 이처럼 사랑하사 독생자를 주셨으니 이는 그를 믿는 자마다 멸망하지 않고 영생을 얻게 하려 하심이라.", reference: "요한복음 3:16 변형" },
    { text: "오직 성령이 너희에게 임하시면 너희가 권능을 받고 예루살렘과 온 유대와 사마리아와 땅 끝까지 이르러 내 증인이 되리라 하시니라.", reference: "사도행전 1:8" },
    { text: "내가 너희에게 분부한 모든 것을 가르쳐 지키게 하라 볼지어다 내가 세상 끝날까지 너희와 항상 함께 있으리라 하시니라.", reference: "마태복음 28:20" },
    { text: "그들이 평안하다, 안전하다 할 그 때에 임신한 여자에게 해산의 고통이 이름과 같이 멸망이 갑자기 그들에게 이르리니 결코 피하지 못하리라.", reference: "데살로니가전서 5:3" },
    { text: "그 후에 주께서 달리 칠십 인을 세우사 친히 가시려는 각 동네와 각 지역으로 둘씩 앞서 보내시며.", reference: "누가복음 10:1" }
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
const prayerVerseText = document.getElementById('prayer-verse-text');
const prayerVerseReference = document.getElementById('prayer-verse-reference');
const prayerVerseImage = document.getElementById('prayer-verse-image'); // NEW
const newPrayerVerseBtn = document.getElementById('new-prayer-verse-btn'); // NEW
const evangelismVerseText = document.getElementById('evangelism-verse-text');
const evangelismVerseReference = document.getElementById('evangelism-verse-reference');
const evangelismVerseImage = document.getElementById('evangelism-verse-image'); // NEW
const newEvangelismVerseBtn = document.getElementById('new-evangelism-verse-btn'); // NEW

function getRandomBook() {
    const books = Object.keys(bibleBooks);
    return books[Math.floor(Math.random() * books.length)];
}

async function getVerseImage(referenceQuery, category = '') {
    let query = category ? `${category} ${referenceQuery}` : referenceQuery;
    // Add Korean translation of categories to the query for better results
    if (category === 'bible') query = `성경 ${query}`;
    if (category === 'prayer') query = `기도 ${query}`;
    if (category === 'evangelism') query = `전도 ${query}`;
    
    // Fallback categories if initial query yields no results or is too specific
    const fallbackCategories = {
        'bible': ['bible verse', '성경', 'cross', 'faith'],
        'prayer': ['prayer', '기도', 'hope', 'meditation'],
        'evangelism': ['evangelism', '전도', 'outreach', 'community']
    };

    let imageUrl = "https://images.unsplash.com/photo-1451187580459-43490279c0fa"; // Default image

    for (const q of [query, ...(fallbackCategories[category] || [])]) {
        const url = `https://api.unsplash.com/search/photos?query=${q}&client_id=${UNSPLASH_API_KEY}`;
        console.log("Fetching image from URL:", url);
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.results.length > 0) {
                return data.results[0].urls.regular;
            }
        } catch (error) {
            console.error(`Error fetching image for query "${q}" from Unsplash:`, error);
        }
    }
    return imageUrl; // Return default image if no results found for any query
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
    const imageUrl = await getVerseImage(reference, 'bible'); // Pass 'bible' category
    verseImage.src = imageUrl;
}

async function displayRandomPrayerVerse() {
    const verse = prayerVerses[Math.floor(Math.random() * prayerVerses.length)];
    prayerVerseText.textContent = `\"${verse.text}\"`;
    prayerVerseReference.textContent = verse.reference;
    const imageUrl = await getVerseImage(verse.reference, 'prayer'); // Pass 'prayer' category
    prayerVerseImage.src = imageUrl;
}

async function displayRandomEvangelismVerse() {
    const verse = evangelismVerses[Math.floor(Math.random() * evangelismVerses.length)];
    evangelismVerseText.textContent = `\"${verse.text}\"`;
    evangelismVerseReference.textContent = verse.reference;
    const imageUrl = await getVerseImage(verse.reference, 'evangelism'); // Pass 'evangelism' category
    evangelismVerseImage.src = imageUrl;
}

newVerseBtn.addEventListener('click', getRandomVerse);

newPrayerVerseBtn.addEventListener('click', displayRandomPrayerVerse);
newEvangelismVerseBtn.addEventListener('click', displayRandomEvangelismVerse);

themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

getRandomVerse();
displayRandomPrayerVerse();
displayRandomEvangelismVerse();