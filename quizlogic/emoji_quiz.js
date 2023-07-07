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
                    emoji1: champion.Emoji1,
                    emoji2: champion.Emoji2,
                    emoji3: champion.Emoji3,
                    emoji4: champion.Emoji4,
                };
            });
            selectRandomChampion();
            display();
        })
        .catch(error => console.log('An error occurred while fetching champion data:', error));
}

function displayQuestion(){

}

function display() {
    const imageContainer = document.querySelector('.imagecontainer');
    imageContainer.innerHTML = ''; // Clear existing content
   
    const currentChampion = championEntries.find(champion => champion.name.toLowerCase() === currentChampionName.trim().toLowerCase());
  
    console.log('currentChampion:', currentChampion);
    for (let i = 1; i <= 4; i++) {
      const emoji = currentChampion[`emoji${i}`];
  
      const box = document.createElement('div');
      box.classList.add('box');
      box.textContent = emoji;
  
      imageContainer.appendChild(box);
    }
  }
  
function selectRandomChampion() {
    const randomIndex = Math.floor(Math.random() * championEntries.length);
    currentChampionName = championEntries[randomIndex].name;
}

function check() {
    if (answerElement.value !== '') {
        const guess = answerElement.value.trim().toLowerCase();
        const answer = currentChampionName.trim().toLowerCase();

        if (guess === answer) {
            currentCounter++;
            if (currentCounter < championEntries.length) {
                console.clear();
                selectRandomChampion();
            } else {
                shuffleQuestions();
                currentCounter = 0;
            }
            playCorrectSound();
            display();

            attemptedChampions = [];

        } else {
            if(championNames.includes(guess)){
                if (!attemptedChampions.includes(guess)){ // Check if the champion guess is not already in the attempted list
                    attemptedChampions.push(guess);
                    displayAttemptedChampions();
                }
            }
        }
        answerElement.value = '';
        showFilteredChampions();
    }
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
        else {
            answerElement.value = '';
        }
        check();
    }
});

initializeQuestions();
