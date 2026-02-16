const verses = [
    {
        text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.",
        reference: "John 3:16"
    },
    {
        text: "The Lord is my shepherd; I shall not want.",
        reference: "Psalm 23:1"
    },
    {
        text: "I can do all things through him who strengthens me.",
        reference: "Philippians 4:13"
    }
];

const verseText = document.getElementById('verse-text');
const verseReference = document.getElementById('verse-reference');
const newVerseBtn = document.getElementById('new-verse-btn');

function getRandomVerse() {
    return verses[Math.floor(Math.random() * verses.length)];
}

function displayVerse() {
    const verse = getRandomVerse();
    verseText.textContent = `\"${verse.text}\"`;
    verseReference.textContent = verse.reference;
}

newVerseBtn.addEventListener('click', displayVerse);

displayVerse();