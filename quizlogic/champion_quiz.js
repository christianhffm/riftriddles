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
                    region: champion.Region,
                    releaseDate: champion['Release Date']
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

function arraysEqual(arr1, arr2) {
    // Check if the arrays have the same length
    if (arr1.length !== arr2.length) {
        return false;
    }

    // Iterate over each element and compare
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }

    return true;
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
                displayQuestion();
            }

            playCorrectSound();

            const imageContainer = document.querySelector('.imagecontainer');

            // Remove all existing rows
            const rows = imageContainer.querySelectorAll('.row');
            rows.forEach(row => {
                row.remove();
            });
            attemptedChampions = [];

        } else {
            if (!attemptedChampions.includes(guess)) { // Check if the champion guess is not already in the attempted list
                const imageContainer = document.querySelector('.imagecontainer');

                // Create a new row element
                const row = document.createElement('div');
                row.classList.add('row');

                const guessedChampionEntry = championEntries.find(champion => champion.name.toLowerCase() === guess);
                const correctChampionEntry = championEntries.find(champion => champion.name.toLowerCase() === answer);


                // Create and append the champion data boxes
                const categories = Object.keys(guessedChampionEntry);
                for (let i = 0; i < categories.length; i++) {
                    const category = categories[i];
                    const categoryEntries = guessedChampionEntry[category];

                    // Check if the category has multiple entries
                    if (Array.isArray(categoryEntries)) {
                        const box = document.createElement('div');
                        box.classList.add('box');

                        // Check if the category value of the guessed champion matches the correct champion
                        if (
                            Array.isArray(correctChampionEntry[category]) &&
                            arraysEqual(categoryEntries, correctChampionEntry[category])
                        ) {
                            box.classList.add('right'); // Add right color class
                        }
                        else if (
                            Array.isArray(correctChampionEntry[category]) &&
                            categoryEntries.some(entry => correctChampionEntry[category].includes(entry))
                        ) {
                            box.classList.add('almostright'); // Add right color class
                        }
                        else if (
                            (Array.isArray(correctChampionEntry[category]) && correctChampionEntry[category].some(entry => categoryEntries.includes(entry))) ||
                            categoryEntries.includes(correctChampionEntry[category])
                        ) {
                            box.classList.add('almostright'); // Add right color class
                        }

                        else {
                            box.classList.add('wrong'); // Add wrong color class
                        }

                        if (i === 0) {
                            // Set the background image for the first box in the row
                            var fileName = answerElement.value.replace("'", "\\'");
                            var imageUrl = `url('../gfx/icons/champion-icons/${fileName}.png')`;
                            box.style.backgroundImage = imageUrl;

                        }

                        const paragraph = document.createElement('p');
                        paragraph.textContent = categoryEntries.join(', '); // Concatenate entries with a comma separator
                        box.appendChild(paragraph);
                        row.appendChild(box);
                    } else {
                        const box = document.createElement('div');
                        box.classList.add('box');

                        // Check if the category value of the guessed champion matches the correct champion
                        if (categoryEntries === correctChampionEntry[category]) {
                            box.classList.add('right');
                        } // Add right color class
                        else if (
                            Array.isArray(correctChampionEntry[category]) &&
                            correctChampionEntry[category].includes(categoryEntries)
                        ) {
                            box.classList.add('almostright'); // Add right color class
                        }
                        else {
                            box.classList.add('wrong'); // Add wrong color class
                        }

                        if (i === 0) {
                            // Set the background image for the first box in the row
                            var fileName = answerElement.value.replace("'", "\\'");
                            var imageUrl = `url('../gfx/icons/champion-icons/${fileName}.png')`;
                            box.style.backgroundImage = imageUrl;

                        }

                        const paragraph = document.createElement('p');
                        paragraph.textContent = categoryEntries;
                        box.appendChild(paragraph);
                        row.appendChild(box);
                    }
                }


                // Prepend the new row to the image container to maintain reversed order
                imageContainer.insertBefore(row, imageContainer.firstChild);

                if (!attemptedChampions.includes(guess)) { // Check if the champion guess is not already in the attempted list
                    attemptedChampions.push(guess);
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
            return;
        }

        check();
    }
});


initializeQuestions();
