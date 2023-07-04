const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const championListElement = document.getElementById('champion-list');
const attemptedChampionsListElement = document.getElementById('attempted-list');
const championImage = document.getElementById('champion-image');

let questions = [];
let currentQuestionIndex = 0;
let attemptedChampions = [];
let selectedChampionIndex = 0;
let championInfoList = []; // Declare championInfoList as a global variable

function initializeQuestions() {
  // Fetch championFull.json
  fetch('../data/championFull.json')
    .then(response => response.json())
    .then(championData => {
      const championNames = Object.keys(championData.data);

      // Iterate over each champion name
      championNames.forEach(championName => {
        const championInfo = {
          name: championName,
          skins: []
        };

        const skins = championData.data[championName].skins;

        // Iterate over each skin and add it to the champion's skins list
        skins.forEach(skin => {
          championInfo.skins.push({
            number: skin.num,
            name: skin.name
          });
        });

        championInfoList.push(championInfo);
      });

      console.log(championInfoList); // Log the fetched champion data

      // Call displayQuestion() after the data has been fetched and the championInfoList is populated
      displayQuestion();
    })
    .catch(error => console.log('An error occurred while fetching champion data:', error));
}

function displayQuestion() {
  const championInfo = championInfoList[selectedChampionIndex];

  // Check if championInfo is available
  if (!championInfo) {
    console.log('Champion info not available.');
    return;
  }

  const championName = championInfo.name;
  const skins = championInfo.skins;

  // Check if skins are available
  if (!skins || skins.length === 0) {
    console.log(`No skins available for ${championName}.`);
    return;
  }

  const randomSkinIndex = Math.floor(Math.random() * skins.length);
  const randomSkin = skins[randomSkinIndex];

  const imageName = `${championName}_${randomSkin.number}`;
  const imageUrl = `url(../splashes/${imageName}.jpg)`;

  const imageContainer = document.querySelector('.imagecontainer');
  imageContainer.style.backgroundImage = imageUrl;

  answerElement.value = '';
  championListElement.innerHTML = '';
  attemptedChampionsListElement.innerHTML = '';
}


function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
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

  // Reverse the order of attemptedChampions array
  const reversedChampions = attemptedChampions.slice().reverse();

  for (const champion of reversedChampions) {
    const capitalizedChampion = capitalizeChampionName(champion);

    const championItem = document.createElement('li');
    const championImage = document.createElement('img');

    const imageName = champion.toLowerCase().replace(/\s/g, ''); // Convert champion name to lowercase and remove spaces
    const imageUrl = `../icons/champion-icons/${imageName}.png`; // Update image URL based on the champion's name
    championImage.src = imageUrl;
    championImage.alt = capitalizedChampion;
    championItem.appendChild(championImage);
    championItem.appendChild(document.createTextNode(capitalizedChampion));
    attemptedChampionsListElement.appendChild(championItem);
  }
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
        const imageUrl = `../icons/champion-icons/${imageName}.png`; // Update image URL based on the champion's name
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

document.addEventListener('click', function(event) {
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