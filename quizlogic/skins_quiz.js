const championImage = document.getElementById('champion-image');

let championInfoList = []; // Declare championInfoList as a global variable
let currentChampionInfo = null; // Variable to store the current champion information
let currentChampionName = ''; // Variable to store the current champion name
let currentSkinName = ''; // Variable to store the current skin name
let currentSkinNumber = ''; // Variable to store the current skin number

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
    })
    .catch(error => {
      console.log('An error occurred while fetching champions data:', error);
    });

  // Fetch championFull.json
  fetch('../data/championFull.json')
    .then(response => response.json())
    .then(championData => {
      const championEntries = Object.values(championData.data);

      // Iterate over each champion entry
      championEntries.forEach(championEntry => {
        const championInfo = {
          name: championEntry.name,
          skins: []
        };

        const skins = championEntry.skins;

        // Iterate over each skin and add it to the champion's skins list
        skins.forEach(skin => {
          championInfo.skins.push({
            number: skin.num,
            name: skin.name
          });
        });

        championInfoList.push(championInfo);
      });

      // Call displayQuestion() after the data has been fetched and the championInfoList is populated
      displayQuestion();
    })
    .catch(error => console.log('An error occurred while fetching champion data:', error));

}

function displayQuestion() {
  const randomChampionIndex = Math.floor(Math.random() * championInfoList.length);
  currentChampionInfo = championInfoList[randomChampionIndex];

  // Check if championInfo is available
  if (!currentChampionInfo) {
    return;
  }

  wrongTries = 1;
  currentChampionName = currentChampionInfo.name;
  const skins = currentChampionInfo.skins;

  console.log(currentChampionName);

  // Check if skins are available
  if (!skins || skins.length === 0) {
    console.log(`No skins available for ${currentChampionName}.`);
    return;
  }

  const randomSkinIndex = Math.floor(Math.random() * skins.length);
  const randomSkin = skins[randomSkinIndex];

  currentSkinName = randomSkin.name;
  currentSkinNumber = randomSkin.number;

  const imageName = `${currentChampionName.replace(/[\s'\\.&]/g, '')}_${randomSkin.number}`;
  const imageUrl = `../gfx/centered/${imageName}.jpg`;

  const imageElement = document.createElement('img');
  imageElement.src = imageUrl;
  imageElement.alt = `${currentChampionName} - ${currentSkinName}`;
  imageElement.classList.add('custom-image'); // Add a class to the image element 
  imageElement.id = 'my-image'; // Set the id of the image element to 'my-image'


  const imageContainer = document.querySelector('.imagecontainer');
  imageContainer.innerHTML = '';
  imageContainer.appendChild(imageElement);

  answerElement.value = '';
  championListElement.innerHTML = '';
  attemptedChampionsListElement.innerHTML = '';

  imageElement.style.transform = 'scale(500%)';

  function zoomOutImage() {
    if (wrongTries >= 11) {
      attemptedChampionsListElement.removeEventListener('DOMNodeInserted', zoomOutImage); // Remove the DOMNodeInserted event listener after 5 wrong tries
      return;
    }
    const zoomLevel = 500 - wrongTries * 40; // Calculate zoom level based on wrong tries

    imageElement.style.transform = `scale(${zoomLevel}%)`;
  }
  attemptedChampionsListElement.addEventListener('DOMNodeInserted', zoomOutImage);

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

}

function checkAnswer() {
  const userAnswer = answerElement.value.trim().toLowerCase();
  const correctAnswer = currentChampionName.toLowerCase();

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

function findChampionByName(championName) {
  const normalizedChampionName = championName.toLowerCase();
  for (const championInfo of championInfoList) {
    if (championInfo.name.toLowerCase() === normalizedChampionName) {
      return championInfo;
    }
  }
  return null;
}

const easyButton = document.getElementById('easy-button');
const mediumButton = document.getElementById('medium-button');
const hardButton = document.getElementById('hard-button');
const imageContainer = document.querySelector('.imagecontainer');

let difficultyLevel = 'easy'; // Set the default difficulty level
let selectedButton = easyButton; // Set the default selected button

easyButton.addEventListener('click', () => {
  selectButton(easyButton, 'easy');
});

mediumButton.addEventListener('click', () => {
  selectButton(mediumButton, 'medium');
});

hardButton.addEventListener('click', () => {
  selectButton(hardButton, 'hard');
});

applyDifficulty();

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
  var element = document.getElementById('champion-image');
  var image = document.getElementById('my-image');
  imageContainer.classList.remove('gray-filter');
  element.style.transform = ''; // Reset the transformation

  if (difficultyLevel === 'easy') {
  }
  else if (difficultyLevel === 'medium') {
    imageContainer.classList.add('gray-filter');
  }
  else if (difficultyLevel === 'hard') {
    imageContainer.classList.add('gray-filter');

    let flipValueX = 1;
    let flipValueY = 1;

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

    if (randomValueX === 0 && randomValueY === 0) {
      flipValueX = -1; // Flip along the x-axis
      flipValueY = -1; // Flip along the y-axis
    }

    // Apply the flip transformations using the randomly generated values
    element.style.transform = `scaleX(${flipValueX}) scaleY(${flipValueY})`;
  }
}

initializeQuestions();
console.clear();