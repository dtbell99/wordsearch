const sleep = ms => new Promise(r => setTimeout(r, ms));
const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];
const flippedPositions = new Set();

let theme = (localStorage.getItem("theme")) ? localStorage.getItem("theme") : "dark";
localStorage.setItem("theme", theme);

document.getElementById("theme").innerHTML = (theme === "light") ? "Light Theme" : "Dark Theme";

const changeTheme = () => {
    if (theme === "light") {
        theme = "dark";
    } else {
        theme = "light";
    }
    localStorage.setItem("theme", theme);
    location.reload();
}

const buildLettersTable = () => {
    const table = document.getElementById("tableBodyLetters");
    for (let r = 0; r < rows.length; r++) {
        const row = rows[r];
        const tableRow = table.insertRow(r);
        for (let i = 0; i < row.length; i++) {
            const tableCell = tableRow.insertCell(i);
            tableCell.id = `pos-${r}-${i}`;
            tableCell.innerHTML = row[i];
        }
    }
}

const buildWordsTable = (words) => {
    const ul = document.getElementById("wordsUl");
    for (const word of words) {
        var li = document.createElement('li');
        li.id = `${word}-li`;
        li.innerHTML = word;
        ul.appendChild(li);
    }
}

const updateFoundCell = (pos, color) => {
    const cell = document.getElementById(pos);
    cell.style.color = color;
    cell.style.fontWeight = "bold";
    flippedPositions.add(pos);
}

const getRandomColor = () => {
    let hex = '#';
    for (let i = 0; i < 6; i++) {
        const index = Math.floor(Math.random() * hexValues.length)
        hex += hexValues[index];
    }
    return hex;
}

const getLeftWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let p = colPos; p > colPos - word.length; p--) {
        foundWord = foundWord + rows[rowPos][p];
    }
    if (word === foundWord) {
        for (let p = colPos; p > colPos - word.length; p--) {
            updateFoundCell(`pos-${rowPos}-${p}`, color)
        }
    }
    return foundWord;
}

const getRightWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let p = colPos; p < colPos + word.length; p++) {
        foundWord = foundWord + rows[rowPos][p];
    }
    if (word === foundWord) {
        for (let p = colPos; p < colPos + word.length; p++) {
            updateFoundCell(`pos-${rowPos}-${p}`, color);
        }
    }
    return foundWord
}

const getTopWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let p = rowPos; p > rowPos - word.length; p--) {
        foundWord = foundWord + rows[p][colPos];
    }
    if (word === foundWord) {
        for (let p = rowPos; p > rowPos - word.length; p--) {
            updateFoundCell(`pos-${p}-${colPos}`, color)
        }
    }
    return foundWord;
}

const getBottomWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let p = rowPos; p < rowPos + word.length; p++) {
        foundWord = foundWord + rows[p][colPos];
    }
    if (word === foundWord) {
        for (let p = rowPos; p < rowPos + word.length; p++) {
            updateFoundCell(`pos-${p}-${colPos}`, color);
        }
    }
    return foundWord;
}

const getBottomRightWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let i = 0; i < word.length; i++) {
        foundWord = foundWord + rows[rowPos + i][colPos + i];
    }
    if (word === foundWord) {
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos + i}-${colPos + i}`, color);
        }
    }
    return foundWord;
}

const getBottomLeftWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let i = 0; i < word.length; i++) {
        foundWord = foundWord + rows[rowPos + i][colPos - i];
    }
    if (word === foundWord) {
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos + i}-${colPos - i}`, color);
        }
    }
    return foundWord;
}

const getTopRightWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let i = 0; i < word.length; i++) {
        foundWord = foundWord + rows[rowPos - i][colPos + i];
    }
    if (word === foundWord) {
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos - i}-${colPos + i}`, color);
        }
    }
    return foundWord;
}

const getTopLeftWord = (word, rowPos, colPos, color) => {
    let foundWord = "";
    for (let i = 0; i < word.length; i++) {
        foundWord = foundWord + rows[rowPos - i][colPos - i];
    }
    if (word === foundWord) {
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos - i}-${colPos - i}`, color);
        }
    }
    return foundWord;
}

const processDirections = (word, rowPos, colPos, color) => {
    const leftWord = (colPos - (word.length - 1) >= 0) ? getLeftWord(word, rowPos, colPos, color) : undefined;
    const rightWord = (colPos + word.length <= rows[0].length) ? getRightWord(word, rowPos, colPos, color) : undefined;
    const topWord = ((rowPos + 1) - word.length >= 0) ? getTopWord(word, rowPos, colPos, color) : undefined;
    const bottomWord = (rowPos + word.length <= rows.length) ? getBottomWord(word, rowPos, colPos, color) : undefined;
    const bottomRightWord = (rowPos + word.length <= rows.length && colPos + word.length <= rows[0].length) ? getBottomRightWord(word, rowPos, colPos, color) : undefined;
    const bottomLeftWord = (rowPos + word.length <= rows.length && colPos - word.length >= 0) ? getBottomLeftWord(word, rowPos, colPos, color) : undefined;
    const topRightWord = ((rowPos + 1) - word.length >= 0 && colPos + word.length <= rows[0].length) ? getTopRightWord(word, rowPos, colPos, color) : undefined;
    const topLeftWord = ((rowPos + 1) - word.length >= 0 && (colPos + 1) - word.length >= 0) ? getTopLeftWord(word, rowPos, colPos, color) : undefined;
    return (leftWord === word || rightWord === word || topWord === word || bottomWord === word || bottomRightWord === word || bottomLeftWord === word || topRightWord === word || topLeftWord === word);
}

const findWord = async (rows, word) => {
    const firstLetter = word.split('')[0];
    firstloop:
    for (let rowPos = 0; rowPos < rows.length; rowPos++) {
        for (let colPos = 0; colPos < rows[rowPos].length; colPos++) {
            const cell = document.getElementById(`pos-${rowPos}-${colPos}`);
            cell.style.backgroundColor = (theme === "light") ? "black" : "white";
            const testLetter = rows[rowPos][colPos];
            const color = getRandomColor();
            await sleep(10);
            if (testLetter === firstLetter) {
                const found = processDirections(word, rowPos, colPos, color);
                if (found) {
                    const sideWord = document.getElementById(`${word}-li`);
                    sideWord.style.textDecoration = "line-through";
                    sideWord.style.color = color;
                    cell.style.backgroundColor = (theme === "light") ? "white" : "black";
                    break firstloop;
                }
            }
            cell.style.backgroundColor = (theme === "light") ? "white" : "black";
        }
    }
}

const dimLetters = () => {
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[0].length; j++) {
            if (!flippedPositions.has(`pos-${i}-${j}`)) {
                const cell = document.getElementById(`pos-${i}-${j}`);
                cell.style.color = (theme === "light") ? "#eeeeee" : "#222222";
            }
        }
    }
}

let started = false;

const start = async () => {
    if (started) {
        location.reload();
        return;
    }
    started = true;
    dimLetters();
    const btn = document.getElementById('startId');
    btn.style.backgroundColor = "#f1f1f1";
    btn.style.color = "black";
    btn.innerHTML = "Reload";
    for (const word of words) {
        document.getElementById(`${word}-li`).className = 'selectedLi';
        await findWord(rows, word);
        document.getElementById(`${word}-li`).className = 'unselectedLi';
    }
}

let lettersDta = [
    "BWIHBNXBSMSBUGYA",
    "AECDBUYMARKETING",
    "LBRCTUAALREVENUE",
    "LSNOITAREPOSELAS",
    "EIORCDPBSSWHTSPV",
    "BTHCRAESERTEKRAM",
    "DEWLMCQRXOVQDXAP",
    "CWOPTNEMELBANEIA",
    "BCOMMUNICATIONSR",
    "ATNETNOCUWWFGGPT",
    "DKUMARKETINGOPSN",
    "IQQUCMGNIDNARBFE",
    "VFCREATIVEWJYXHR",
    "APUBLICRELATIONS",
    "DRMJCDBCSSYOUEDR"
];
// Convert the strings into arrays so you can reference each letter easily
const rows = [];
lettersDta.forEach(rowString => {
    rows.push(rowString.split(''));
});

const words = [
    "COMMUNICATIONS",
    "CREATIVE",
    "MARKETRESEARCH",
    "PUBLICRELATIONS",
    "MARKETINGOPS",
    "MARKETING",
    "SALESOPERATIONS",
    "BRANDING",
    "CRO",
    "PARTNERS",
    "REVENUE",
    "ENABLEMENT",
    "CONTENT",
    "WEBSITE",
    "BDR",
    "SALESEXECUTIVES",
    "DAVID",
    "BELL"
]

//const words = ["HENNA", "COREB", "YIES", "BUARS", "RJAS", "VPM", "CEEN", "BIEU", "NERSR", "CLEC", "RYIU", "OTJA", "SLED", "SALE", "TUUN", "DCEA", "BBTI"];
const words2 = ["BBTI", "KRAM", "CHTB", "DEWL", "ELAS", "NEIA", "RSNO", "DIVAD"]

buildWordsTable(words);
words.sort((a, b) => b.length - a.length)
document.getElementById("title").innerHTML = "WordSearch"; ``
buildLettersTable();
if (theme === 'dark') {
    document.body.style.backgroundColor = "black";
    document.body.style.color = "#f1f1f1";
}