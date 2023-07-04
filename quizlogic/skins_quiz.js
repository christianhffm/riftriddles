const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const championListElement = document.getElementById('champion-list');
const attemptedChampionsListElement = document.getElementById('attempted-list');
const championImage = document.getElementById('champion-image');

let wrongTries = 1; // Counter for wrong tries
let questions = [];
let currentQuestionIndex = 0;
let attemptedChampions = [];
let championNames = [];
let selectedChampionIndex = 0;
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
      shuffleQuestions();
      displayQuestion();
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
    console.log('Champion info not available.');
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

function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
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

function playCorrectSound() {
  const correctSound = document.getElementById('correctSound');
  correctSound.play().catch(error => {
    console.log('Error playing correct sound:', error);
  });
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

  // Reverse the order of attemptedChampions array
  const reversedChampions = attemptedChampions.slice().reverse();

  for (const champion of reversedChampions) {
    const capitalizedChampion = capitalizeChampionName(champion);

    const championItem = document.createElement('li');
    const championImage = document.createElement('img');

    const imageName = champion.toLowerCase().replace(/\s/g, ''); // Convert champion name to lowercase and remove spaces
    const imageUrl = `../gfx/icons/champion-icons/${imageName}.png`; // Update image URL based on the champion's name
    championImage.src = imageUrl;
    championImage.alt = capitalizedChampion;
    championItem.appendChild(championImage);
    championItem.appendChild(document.createTextNode(capitalizedChampion));
    attemptedChampionsListElement.appendChild(championItem);
  }
  wrongTries++;
}

function showFilteredChampions() {
  championListElement.innerHTML = ''; // Clear the champion list
  selectedChampionIndex = -1; // Reset the selected champion index

  const enteredText = answerElement.value.trim().toLowerCase();

  if (enteredText === '') {
    return; // Stop further processing if no text entered
  }

  for (const champion of championNames) {
    if (!attemptedChampions.includes(champion)) {
      const capitalizedChampionName = capitalizeChampionName(champion);

      if (capitalizedChampionName.toLowerCase().startsWith(enteredText) || champion.toLowerCase().includes(` ${enteredText}`)) {
        const championItem = document.createElement('li');
        const championImage = document.createElement('img');

        const imageName = champion.toLowerCase().replace(/\s/g, ''); // Convert champion name to lowercase and remove spaces
        const imageUrl = `../gfx/icons/champion-icons/${imageName}.png`; // Update image URL based on the champion's name
        championImage.src = imageUrl;
        championImage.alt = capitalizedChampionName;
        championItem.appendChild(championImage);

        const championText = document.createElement('span');
        championText.textContent = capitalizedChampionName;
        championItem.appendChild(championText);

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

answerElement.addEventListener('keydown', (event) => {
  const enteredText = answerElement.value.trim().toLowerCase();

  if (event.key === 'Tab') {
    // Prevent default tab behavior
    event.preventDefault();

    if (event.shiftKey) {
      // Shift+Tab: Navigate backwards through the list
      if (selectedChampionIndex > 0) {
        selectedChampionIndex--;
      } else {
        selectedChampionIndex = championListElement.children.length - 1;
      }
    } else {
      // Tab: Navigate forward through the list
      if (selectedChampionIndex < championListElement.children.length - 1) {
        selectedChampionIndex++;
      } else {
        selectedChampionIndex = 0;
      }
    }

    highlightSelectedChampion();

    const selectedChampion = championListElement.children[selectedChampionIndex].textContent;
    answerElement.value = selectedChampion;
  }
});

answerElement.addEventListener('keydown', (event) => {
  const filteredChampions = championListElement.getElementsByTagName('li');
  const selectedChampion = filteredChampions[selectedChampionIndex]?.textContent;

  if (event.key === 'Enter') {
    if (selectedChampion) {
      answerElement.value = selectedChampion;
    } else if (filteredChampions.length > 0) {
      answerElement.value = filteredChampions[0].textContent;
    }

    checkAnswer();
  }
});

document.addEventListener('click', function (event) {
  const clickedElement = event.target;

  if (clickedElement === answerElement) {
    // Clicked inside the entry text field
    const enteredText = answerElement.value.trim().toLowerCase();

    if (enteredText !== '') {
      // Show the filtered champion list
      showFilteredChampions();
    }
  } else if (!championListElement.contains(clickedElement)) {
    // Clicked outside the entry text field and champion list
    championListElement.innerHTML = ''; // Hide the champion list
  }
});

function highlightSelectedChampion() {
  const championItems = championListElement.getElementsByTagName('li');

  for (let i = 0; i < championItems.length; i++) {
    if (i === selectedChampionIndex) {
      championItems[i].classList.add('selected');
    } else {
      championItems[i].classList.remove('selected');
    }
  }
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

initializeQuestions();