const championListElement = document.getElementById('champion-list');
const attemptedChampionsListElement = document.getElementById('attempted-list');
const answerElement = document.getElementById('answer');
const submitButton = document.getElementById('submit');

let wrongTries = 1; // Counter for wrong tries
let questions = [];
let currentQuestionIndex = 0;
let currentChampionName = ''; // Variable to store the current champion name
let championNames = [];
let attemptedChampions = [];
let selectedChampionIndex = 0;

function initialize() {
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

function checkAnswer() {
  const userAnswer = answerElement.value.trim().toLowerCase();
  const correctSkin = currentChampionName.toLowerCase();
  const correctAbility = questions[currentQuestionIndex].answer.toLowerCase();

  if (!championNames.includes(userAnswer)) {
    return; // Stop further processing
  }

  if (userAnswer === correctAbility || userAnswer === correctSkin) {
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


function shuffleQuestions() {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
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

  const reversedChampions = attemptedChampions.slice().reverse();

  let columnCount = Math.ceil(reversedChampions.length / 5); // Calculate the number of columns based on the number of items

  columnCount = 6; // Limit the number of columns to 5 if it exceeds that value

  let championIndex = 0;

  for (let i = 0; i < columnCount; i++) {
    const column = document.createElement('ul');
    column.classList.add('column');

    const itemsPerColumn = (columnCount > 6) ? 10 : 5; // Set the number of items per column based on the column count

    const startIndex = i * itemsPerColumn;
    const endIndex = startIndex + itemsPerColumn;

    const championsSlice = reversedChampions.slice(startIndex, endIndex);

    for (const champion of championsSlice) {
      const capitalizedChampion = capitalizeChampionName(champion);

      const championItem = document.createElement('li');
      const championImage = document.createElement('img');

      const imageName = champion.toLowerCase();
      const imageUrl = `../gfx/icons/champion-icons/${imageName}.png`;
      championImage.src = imageUrl;
      championImage.alt = capitalizedChampion;
      championItem.appendChild(championImage);
      championItem.appendChild(document.createTextNode(capitalizedChampion));
      column.appendChild(championItem);

      championIndex++;
    }

    attemptedChampionsListElement.appendChild(column);
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

        const imageName = champion.toLowerCase(); // Convert champion name to lowercase
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

function findChampionByName(championName) {
  const normalizedChampionName = championName.toLowerCase();
  for (const championInfo of championInfoList) {
    if (championInfo.name.toLowerCase() === normalizedChampionName) {
      return championInfo;
    }
  }
  return null;
}

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

answerElement.addEventListener('input', () => {
  const enteredText = answerElement.value.trim().toLowerCase();
  const filteredChampions = championNames.filter(champion => champion.includes(enteredText));

  showFilteredChampions(filteredChampions);
});

answerElement.addEventListener('keydown', (event) => {
  const enteredText = answerElement.value.trim().toLowerCase();

  if (event.key === 'Tab' && enteredText !== '') {
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