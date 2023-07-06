let championEntries = []
let currentCounter = 0;

function initializeQuestions() {
    initialize();
    // Fetch championData.json
    fetch('../data/championData.json')
        .then(response => response.json())
        .then(championData => {

            championEntries = championData.map(champion => {
                return {
                    name: champion.Champion,
                    species: champion.Species,
                    gender: champion.Gender,
                    position: champion.Position,
                    resource: champion.Resource,
                    rangeType: champion['Range Type'],
                    region: champion.Region
                };
            });

            selectRandomChampion();

        })
        .catch(error => console.log('An error occurred while fetching champion data:', error));
}

function displayQuestion() {
}

function selectRandomChampion() {
    const randomIndex = Math.floor(Math.random() * championEntries.length);
    currentChampionName = championEntries[randomIndex].name;
    console.log(currentChampionName);
}

function check() {
  const guess = answerElement.value.trim().toLowerCase();
  const answer = currentChampionName.trim().toLowerCase();

  console.log("checking ...");

  if (guess === answer) {
    console.log("correct");

    const imageContainer = document.querySelector('.imagecontainer');
    imageContainer.innerHTML = '';

    currentCounter++;
    if (currentCounter < championEntries.length) {
      selectRandomChampion();
    } else {
      shuffleQuestions();
      currentCounter = 0;
      displayQuestion();
    }

    playCorrectSound();

  } else {
    console.log("wrong");

    const imageContainer = document.querySelector('.imagecontainer');

    // Create a new row element
    const row = document.createElement('div');
    row.classList.add('row');

    const guessedChampionEntry = championEntries.find(champion => champion.name.toLowerCase() === guess);

    if (guessedChampionEntry) {
      // Create and append the champion data boxes
      for (const category of Object.keys(guessedChampionEntry)) {
        const box = document.createElement('div');
        box.classList.add('box');
        box.textContent = guessedChampionEntry[category];
        row.appendChild(box);
      }
    }

    // Insert the new row at the beginning of the image container (reversed order)
    imageContainer.insertBefore(row, imageContainer.firstChild);

    if (!attemptedChampions.includes(guess)) { // Check if the champion guess is not already in the attempted list
      attemptedChampions.push(guess);
    }
  }
  answerElement.value = '';
  showFilteredChampions();
}


answerElement.addEventListener('keydown', (event) => {
    const filteredChampions = championListElement.getElementsByTagName('li');
    const selectedChampion = filteredChampions[selectedChampionIndex]?.textContent;

    if (event.key === 'Enter') {
        if (selectedChampion) {
            answerElement.value = selectedChampion;
        } else if (filteredChampions.length > 0) {
            answerElement.value = filteredChampions[0].textContent;
        }

        check();
    }
});

initializeQuestions();
