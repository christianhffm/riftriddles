const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
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
            const question = `"${champion[abilityKey]}"`;
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
  championListElement.innerHTML = '';
  attemptedChampionsListElement.innerHTML = '';
}

function checkAnswer() {
  const userAnswer = answerElement.value.trim().toLowerCase();
  const correctAnswer = questions[currentQuestionIndex].answer.toLowerCase();

  if (!championNames.includes(userAnswer)) {
    return; // Stop further processing
  }

  if (userAnswer === correctAnswer) {
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
    attemptedChampions.push(userAnswer);
    displayAttemptedChampions();
  }

  answerElement.value = '';
  showFilteredChampions();
}

function capitalizeChampionName(champion) {
  if (champion.toLowerCase() === "jarvan iv") {
    return "Jarvan IV";
  }
  if (champion.includes("'")) {
    const championNameParts = champion.split("'");
    const capitalizedParts = championNameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return capitalizedParts.join("'");
  } else {
    const championNameParts = champion.split(" ");
    const capitalizedParts = championNameParts.map(part => part.charAt(0).toUpperCase() + part.slice(1));
    return capitalizedParts.join(" ");
  }
}

function displayAttemptedChampions() {
  attemptedChampionsListElement.innerHTML = '';

  for (const champion of attemptedChampions) {
    const capitalizedChampion = capitalizeChampionName(champion);

    const championItem = document.createElement('li');
    championItem.textContent = capitalizedChampion;
    attemptedChampionsListElement.appendChild(championItem);
  }
}

function showFilteredChampions() {
  championListElement.innerHTML = ''; // Clear the champion list

  const enteredText = answerElement.value.trim().toLowerCase();

  if (enteredText === '') {
    return; // Stop further processing if no text entered
  }

  for (const champion of championNames) {
    if (!attemptedChampions.includes(champion)) {
      const capitalizedChampionName = capitalizeChampionName(champion);

      if (capitalizedChampionName.toLowerCase().startsWith(enteredText) || champion.toLowerCase().includes(` ${enteredText}`)) {
        const championItem = document.createElement('li');
        championItem.textContent = capitalizedChampionName;
        championItem.addEventListener('click', () => {
          answerElement.value = capitalizeChampionName(champion);
          championListElement.innerHTML = '';
        });
        championListElement.appendChild(championItem);
      }
    }
  }
}


answerElement.addEventListener('input', () => {
  const enteredText = answerElement.value.trim().toLowerCase();
  const filteredChampions = championNames.filter(champion => champion.includes(enteredText));

  showFilteredChampions(filteredChampions);
});


answerElement.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    checkAnswer();
  }
});

initializeQuestions();
displayQuestion();

const submitButton = document.getElementById('submit');
submitButton.onclick = checkAnswer;
