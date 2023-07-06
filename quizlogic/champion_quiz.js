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

        if (!attemptedChampions.includes(guess)) { // Check if the champion guess is not already in the attempted list
            attemptedChampions.push(guess);
            attemptedChampions = [];
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
