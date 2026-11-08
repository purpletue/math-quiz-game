const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const nameBox = document.getElementById("name-rec");
const nameBtn = document.getElementById("submit-btn");
const greeting = document.getElementById("greeting");
const title = document.getElementById("title");
const answerBox = document.getElementById("answer-rec");
const answerBtn = document.getElementById("submit-ans-btn");

answerBox.style.display = "none";
answerBtn.style.display = "none";

const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const operations = ["+", "-", "*", "/", "**"];

let correctAnswer;
let locked = false;

const problemTypes = [
    // basic stuff
    () => { const a = rand(10, 99), b = rand(10, 99);
            return { text: `${a} + ${b}`, answer: a + b }; },

    () => { const a = rand(10, 99), b = rand(10, 99);
            return { text: `${a} - ${b}`, answer: a - b }; },

    () => { const a = rand(6, 25), b = rand(6, 25);
            return { text: `${a} * ${b}`, answer: a * b }; },

    // division that always comes out even
    () => { const b = rand(2, 12), answer = rand(5, 30);
            return { text: `${b * answer} ÷ ${b}`, answer }; },

    // exponents
    () => { const a = rand(2, 10), b = rand(2, 4);
            return { text: `${a}^${b}`, answer: a ** b }; },

    // modulo (the remainder after dividing)
    () => { const a = rand(20, 99), b = rand(3, 12);
            return { text: `${a} mod ${b}`, answer: a % b }; },

    // square roots of perfect squares
    () => { const n = rand(2, 20);
            return { text: `√${n * n}`, answer: n }; },

    // order of operations (multiplication happens first)
    () => { const a = rand(2, 30), b = rand(2, 12), c = rand(2, 12);
            return { text: `${a} + ${b} * ${c}`, answer: a + b * c }; },

    // parentheses change the order
    () => { const a = rand(2, 30), b = rand(2, 30), c = rand(2, 12);
            return { text: `(${a} + ${b}) * ${c}`, answer: (a + b) * c }; },

    // percentages (these base/percent combos always give whole numbers)
    () => { const pct = [10, 20, 25, 50, 75][rand(0, 4)], base = rand(1, 10) * 20;
            return { text: `${pct}% of ${base}`, answer: pct / 100 * base }; },

    // solve for x
    () => { const x = rand(2, 12), a = rand(2, 9), b = rand(1, 30);
            return { text: `${a}x + ${b} = ${a * x + b}, x = ?`, answer: x }; },
];

function generateNewEquation() {
    const problem = problemTypes[rand(0, problemTypes.length - 1)]();
    correctAnswer = problem.answer;
    greeting.textContent = `Solve: ${problem.text}`;
}

async function startGame() {
    const name = nameBox.value.trim();
    if (!name) {
        greeting.textContent = "Come on, I need a name.";
        return;
    }

    greeting.textContent = `Hello, ${name}`;
    title.textContent = `Hey, ${name}`;
    nameBox.remove();
    nameBtn.remove();

    await sleep(5000);

    title.textContent = "Math game!";
    generateNewEquation();
    answerBox.style.display = "inline";
    answerBtn.style.display = "inline";
    answerBox.focus();
}

async function checkAnswer() {
    if (locked || answerBox.value.trim() === "") return;
    locked = true;
    answerBtn.disabled = true;

    if (Number(answerBox.value) === correctAnswer) {
        greeting.textContent = "Correct!";
        await sleep(2000);
    } else {
        greeting.textContent = `Wrong! The correct answer was ${correctAnswer}`;
        await sleep(3000);
    }

    answerBox.value = "";
    generateNewEquation();
    locked = false;
    answerBtn.disabled = false;
    answerBox.focus();
}

nameBtn.addEventListener("click", startGame);
nameBox.addEventListener("keydown", e => { if (e.key === "Enter") startGame(); });

answerBtn.addEventListener("click", checkAnswer);
answerBox.addEventListener("keydown", e => { if (e.key === "Enter") checkAnswer(); });