const questionElement = document.getElementById('question');

function initializeQuestions() {
  fetch('../data/abilities.json')
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

function displayQuestion() {
  const question = questions[currentQuestionIndex].question;
  questionElement.textContent = question;

  const abilityName = question.replace(/"/g, ''); // Remove the double quotes from the ability name
  findChampionByAbility(abilityName)
    .then(result => {
      const championName = result.championName;
      const abilityTag = result.abilityTag;

      const imageName = `${championName}${abilityTag}.png`; // Combine the champion name and ability tag
      const imageUrl = `../gfx/icons/ability-icons/${imageName}`; // Update image URL based on the champion's name and ability tag

      const imageElement = document.createElement('img');
      imageElement.src = imageUrl;
      imageElement.alt = abilityName;

      const imageContainer = document.querySelector('.imagecontainer');
      imageContainer.innerHTML = ''; // Clear the image container
      imageContainer.appendChild(imageElement);

      // Add event listener to deny left click holds on the image
      imageElement.addEventListener('mousedown', (event) => {
        if (event.button === 0) { // Check for left mouse button
          event.preventDefault();
        }
      });

      // Disable right-click on the image
      imageElement.addEventListener('contextmenu', (event) => {
        event.preventDefault();
      });

    })
    .catch(error => {
      console.log(error);
    });

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
    playCorrectSound();
  } else {
    if (!attemptedChampions.includes(userAnswer)) { // Check if the champion guess is not already in the attempted list
      attemptedChampions.push(userAnswer);
      displayAttemptedChampions();
    }
  }

  answerElement.value = '';
  showFilteredChampions();
}


const submitButton = document.getElementById('submit');
submitButton.onclick = checkAnswer;

function findChampionByAbility(ability) {
  return new Promise((resolve, reject) => {
    fetch('../data/abilities.json')
      .then(response => response.json())
      .then(data => {
        let championName = null;
        let abilityTag = null;

        for (const champion of data) {
          for (const abilityKey in champion) {
            if (champion[abilityKey] === ability) {
              championName = champion.Champion;
              abilityTag = abilityKey;
              break; // Found the ability, exit the loop
            }
          }
          if (championName !== null && abilityTag !== null) {
            break; // Found the ability and champion, exit the loop
          }
        }

        if (championName !== null && abilityTag !== null) {
          console.log(`${championName}`);
          console.log(`${abilityTag}`);
          const result = {
            championName: championName,
            abilityTag: abilityTag
          };
          resolve(result);
        } else {
          reject(new Error(`Unable to find the champion for ability "${ability}".`));
        }
      })
      .catch(error => {
        reject(new Error('An error occurred while fetching champions data:', error));
      });
  });
}

const veryeasyButton = document.getElementById('very-easy-button');
const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');
const imageContainer = document.querySelector('.imagecontainer');

let difficultyLevel = 'veryeasy'; // Set the default difficulty level
let selectedButton = veryeasyButton; // Set the default selected button

// Add event listeners to the buttons
veryeasyButton.addEventListener('click', () => {
  selectButton(veryeasyButton, 'veryeasy');
});

easyButton.addEventListener('click', () => {
  selectButton(easyButton, 'easy');
});

mediumButton.addEventListener('click', () => {
  selectButton(mediumButton, 'medium');
});

hardButton.addEventListener('click', () => {
  selectButton(hardButton, 'hard');
});

function selectButton(button, level) {
  if (button === selectedButton) {
    return; // Ignore the click if the button is already selected
  }

  if (selectedButton) {
    selectedButton.classList.remove('selected');
    selectedButton.disabled = false;
  }

  button.classList.add('selected');
  button.disabled = true;
  selectedButton = button;
  difficultyLevel = level;

  applyDifficulty();
}

function applyDifficulty() {
  var element = document.getElementById('question');
  imageContainer.classList.remove('gray-filter', 'rotate');
  imageContainer.style.transform = ''; // Reset the rotation
  element.classList.remove('hidden-element');

  if (difficultyLevel === 'easy'){
    element.classList.add('hidden-element');
  }
  
  else if(difficultyLevel === 'medium') {
    element.classList.add('hidden-element');
    imageContainer.classList.add('gray-filter');
  }
  else if (difficultyLevel === 'hard') {
    element.classList.add('hidden-element');
    imageContainer.classList.add('gray-filter');

    let flipValueX = 1;
    let flipValueY = 1;
    let rotationValue = 0;

    // Generate random values from 0 to 1 (0 or 1)
    const randomValueX = Math.floor(Math.random() * 2);
    const randomValueY = Math.floor(Math.random() * 2);

    // Apply the flip transformations based on the random values
    if (randomValueX === 1) {
      flipValueX = -1; // Flip along the x-axis
    }
    if (randomValueY === 1) {
      flipValueY = -1; // Flip along the y-axis
    }

    // Generate a random rotation value of 0, 90, 180 or 270 degrees
    rotationValue = Math.floor(Math.random() * 4) * 90;

    if (flipValueX === 1 && flipValueY === 1 && rotationValue === 0){
      rotationValue = 90;
    }

    if (flipValueX === -1 && flipValueY === -1 && rotationValue === 180){
      rotationValue = 90;
    }

    // Apply the transformations using the randomly generated values
    imageContainer.style.transform = `scaleX(${flipValueX}) scaleY(${flipValueY}) rotate(${rotationValue}deg)`;
  }
}

function hideElement() {
  var element = document.getElementById('question');
  element.classList.add('hidden-element');
}

initializeQuestions();
console.clear();