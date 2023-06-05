const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const resultElement = document.getElementById('result');
const championListElement = document.getElementById('champion-list');
const attemptedChampionsListElement = document.getElementById('attempted-champions-list');

let questions = [];
let currentQuestionIndex = 0;
let championNames = [];
let attemptedChampions = [];

function initializeQuestions() {
  fetch('champions.json')
    .then(response => response.json())
    .then(data => {
      for (const champion of data) {
        const championName = champion.Champion.toLowerCase();
        championNames.push(championName);
        for (const abilityKey in champion) {
          if (abilityKey !== "Champion") {
            const question = `Guess the champion for the ability: ${champion[abilityKey]}`;
            questions.push({ question, answer: championName });
          }
        }
      }
      shuffleQuestions();
      displayQuestion();
    })
    .catch(error => {
      console.log('An error occurred while fetching champions data:', error);
    });
}

function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
}

function displayQuestion() {
  questionElement.textContent = questions[currentQuestionIndex].question;
  answerElement.value = '';
  resultElement.textContent = '';
  championListElement.innerHTML = '';
  attemptedChampionsListElement.innerHTML = '';
}

function checkAnswer() {
  const userAnswer = answerElement.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

  if (userAnswer === correctAnswer) {
    resultElement.textContent = 'Correct answer!';
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
      displayQuestion();
    } else {
      shuffleQuestions();
      currentQuestionIndex = 0;
      displayQuestion();
    }
    attemptedChampions = [];
  } else {
    resultElement.textContent = 'Wrong answer! Try again.';
    attemptedChampions.push(userAnswer);
    displayAttemptedChampions();
  }

  answerElement.value = '';
}

function displayAttemptedChampions() {
  attemptedChampionsListElement.innerHTML = '';

  for (const champion of attemptedChampions) {
    const championItem = document.createElement('li');
    championItem.textContent = champion;
    attemptedChampionsListElement.appendChild(championItem);
  }
}

function showFilteredChampions(champions) {
  championListElement.innerHTML = '';

  for (const champion of champions) {
    const championItem = document.createElement('li');
    championItem.textContent = champion;
    championItem.addEventListener('click', () => {
      answerElement.value = champion;
      championListElement.innerHTML = '';
    });
    championListElement.appendChild(championItem);
  }
}

answerElement.addEventListener('input', () => {
  const enteredText = answerElement.value.trim().toLowerCase();
  const filteredChampions = championNames.filter(champion => champion.includes(enteredText));

  showFilteredChampions(filteredChampions);
});

initializeQuestions();
displayQuestion();

const submitButton = document.getElementById('submit');
submitButton.onclick = checkAnswer;
