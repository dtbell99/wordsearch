const sleep = ms => new Promise(r => setTimeout(r, ms));
const hexValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

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

const getLeftWord = (word, rowPos, colPos) => {
    let foundWord = "";
    for (let p = colPos; p > colPos - word.length; p--) {
        foundWord = foundWord + rows[rowPos][p];
    }
    if (word === foundWord) {
        const color = getRandomColor();
        for (let p = colPos; p > colPos - word.length; p--) {
            updateFoundCell(`pos-${rowPos}-${p}`, color)
        }
    }
    return foundWord;
}

const getRightWord = (word, rowPos, colPos) => {
    let foundWord = "";
    for (let p = colPos; p < colPos + word.length; p++) {
        foundWord = foundWord + rows[rowPos][p];
    }
    if (word === foundWord) {
        const color = getRandomColor();
        for (let p = colPos; p < colPos + word.length; p++) {
            updateFoundCell(`pos-${rowPos}-${p}`, color);
        }
    }
    return foundWord
}

const getTopWord = (word, rowPos, colPos) => {
    let foundWord = "";
    //if (rowPos - word.length >= 0) {
    for (let p = rowPos; p > rowPos - word.length; p--) {
        foundWord = foundWord + rows[p][colPos];
    }
    //}
    if (word === foundWord) {
        const color = getRandomColor();
        for (let p = rowPos; p > rowPos - word.length; p--) {
            updateFoundCell(`pos-${p}-${colPos}`, color)
        }
    }
    return foundWord;
}

const getBottomWord = (word, rowPos, colPos) => {
    let foundWord = "";
    if (rowPos + word.length <= rows.length) {
        for (let p = rowPos; p < rowPos + word.length; p++) {
            foundWord = foundWord + rows[p][colPos];
        }
    }
    if (word === foundWord) {
        const color = getRandomColor();
        for (let p = rowPos; p < rowPos + word.length; p++) {
            updateFoundCell(`pos-${p}-${colPos}`, color);
        }
    }
    return foundWord;
}

const getBottomRightWord = (word, rowPos, colPos) => {
    let foundWord = "";
    if (rowPos + word.length <= rows.length && colPos + word.length <= rows[0].length) {
        for (let i = 0; i < word.length; i++) {
            foundWord = foundWord + rows[rowPos + i][colPos + i];
        }
    }
    if (word === foundWord) {
        const color = getRandomColor();
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos + i}-${colPos + i}`, color);
        }
    }
    return foundWord;
}

const getBottomLeftWord = (word, rowPos, colPos) => {
    let foundWord = "";
    if (rowPos + word.length <= rows.length && colPos - word.length >= 0) {
        for (let i = 0; i < word.length; i++) {
            foundWord = foundWord + rows[rowPos + i][colPos - i];
        }
    }
    if (word === foundWord) {
        const color = getRandomColor();
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos + i}-${colPos - i}`, color);
        }
    }
    return foundWord;
}

const getTopRightWord = (word, rowPos, colPos) => {
    let foundWord = "";
    //if (rowPos - word.length >= 0 && colPos + word.length <= rows[0].length) {
    for (let i = 0; i < word.length; i++) {
        foundWord = foundWord + rows[rowPos - i][colPos + i];
    }
    //}
    if (word === foundWord) {
        const color = getRandomColor();
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos - i}-${colPos + i}`, color);
        }
    }
    return foundWord;
}

const getTopLeftWord = (word, rowPos, colPos) => {
    let foundWord = "";
    for (let i = 0; i < word.length; i++) {
        foundWord = foundWord + rows[rowPos - i][colPos - i];
    }
    if (word === foundWord) {
        const color = getRandomColor();
        for (let i = 0; i < word.length; i++) {
            updateFoundCell(`pos-${rowPos - i}-${colPos - i}`, color);
        }
    }
    return foundWord;
}

const processDirections = (word, rowPos, colPos) => {
    const leftWord = (colPos - (word.length - 1) >= 0) ? getLeftWord(word, rowPos, colPos) : undefined;
    const rightWord = (colPos + word.length <= rows[0].length) ? getRightWord(word, rowPos, colPos) : undefined;
    const topWord = (rowPos - word.length >= 0) ? getTopWord(word, rowPos, colPos) : undefined;
    const bottomWord = getBottomWord(word, rowPos, colPos);
    const bottomRightWord = getBottomRightWord(word, rowPos, colPos);
    const bottomLeftWord = getBottomLeftWord(word, rowPos, colPos);
    const topRightWord = (rowPos - word.length >= 0 && colPos + word.length <= rows[0].length) ? getTopRightWord(word, rowPos, colPos) : undefined;
    const topLeftWord = (rowPos - word.length >= 0 && colPos - word.length >= 0) ? getTopLeftWord(word, rowPos, colPos) : undefined;
    return (leftWord === word || rightWord === word || topWord === word || bottomWord === word || bottomRightWord === word || bottomLeftWord === word || topRightWord === word || topLeftWord === word);
}

const findWord = async (rows, word) => {
    const firstLetter = word.split('')[0];
    firstloop:
    for (let rowPos = 0; rowPos < rows.length; rowPos++) {
        for (let colPos = 0; colPos < rows[rowPos].length; colPos++) {
            const cell = document.getElementById(`pos-${rowPos}-${colPos}`);
            cell.style.backgroundColor = '#f1f1f1';
            const testLetter = rows[rowPos][colPos];
            await sleep(5);
            if (testLetter === firstLetter) {
                const found = processDirections(word, rowPos, colPos);
                if (found) {
                    document.getElementById(`${word}-li`).style.textDecoration = "line-through";
                    cell.style.backgroundColor = "black"
                    break firstloop;
                }
            }
            cell.style.backgroundColor = "black"
        }
    }
}

const dimOtherLetters = () => {
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[0].length; j++) {
            if (!flippedPositions.has(`pos-${i}-${j}`)) {
                const cell = document.getElementById(`pos-${i}-${j}`);
                cell.style.color = "black";
            }
        }
    }
}

const findWords = async () => {
    document.getElementById('startId').disabled = true;
    for (const word of words) {
        document.getElementById(`${word}-li`).className = 'selectedLi';
        await findWord(rows, word);
        document.getElementById(`${word}-li`).className = 'unselectedLi';
    }
    dimOtherLetters();
}

const flippedPositions = new Set();

let lettersDta = [
    "WIHBNXBSMSBUGYA",
    "ECDBUYMARKETING",
    "BRCTUAALREVENUE",
    "SNOITAREPOSELAS",
    "IORCDPBSSWHTSPV",
    "THCRAESERTEKRAM",
    "EWLMCQRXOVQDXAP",
    "WOPTNEMELBANEIA",
    "COMMUNICATIONSR",
    "TNETNOCUWWFGGPT",
    "KUMARKETINGOPSN",
    "QQUCMGNIDNARBFE",
    "FCREATIVEWJYXHR",
    "PUBLICRELATIONS",
    "RMJCDBCSSYOUEDR"
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

buildWordsTable(words);
words.sort((a, b) => b.length - a.length)
document.getElementById("title").innerHTML = "Wordsearch Example"; ``
buildLettersTable();
