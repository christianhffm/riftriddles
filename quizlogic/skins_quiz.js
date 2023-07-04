// Function to fetch champion data from JSON file
function fetchChampionData() {
  return fetch('../data/championFull.json')
    .then(response => response.json())
    .then(data => Object.values(data.data))
    .catch(error => {
      console.log('Error:', error);
      return [];
    });
}

// Function to filter skins based on user input
function filterSkins(champions, inputValue) {
  const lowercaseInput = inputValue.toLowerCase();
  return champions.reduce((matches, champion) => {
    const matchingSkins = champion.skins.filter(skin =>
      skin.name.toLowerCase().includes(lowercaseInput) && skin.name.toLowerCase() !== 'default'
    );
    return matches.concat(matchingSkins.map(skin => ({ ...skin, championName: champion.name })));
  }, []);
}


// Function to generate the autocomplete dropdown list
function generateDropdownList(skins) {
  const championList = document.getElementById('champion-list');
  championList.innerHTML = '';

  skins.forEach(skin => {
    const listItem = document.createElement('li');
    const image = document.createElement('img');
    image.src = `../splashes/${skin.championName}_${skin.num}.jpg`;

    const skinName = skin.name.toLowerCase() === 'default' ? skin.championName : skin.name;
    listItem.textContent = `${skinName}`;
    listItem.insertBefore(image, listItem.firstChild);

    listItem.addEventListener('click', () => {
      const answerInput = document.getElementById('answer');
      answerInput.value = `${skinName}`;
      championList.innerHTML = '';
    });
    championList.appendChild(listItem);
  });
}



// Function to handle the submit button click event
function handleSubmit() {
  const answerInput = document.getElementById('answer');
  const userAnswer = answerInput.value.trim().toLowerCase();

  const skinDiv = document.getElementById('skin');
  const championName = skinDiv.dataset.championName.toLowerCase();
  const skinName = skinDiv.dataset.skinName.toLowerCase();

  if (userAnswer === `${skinName} (${championName})`) {
    console.log('Correct answer!');
  } else {
    console.log('Incorrect answer!');
  }

  // Clear the answer input
  answerInput.value = '';
}

// Function to handle user input and trigger autocomplete
function handleInput() {
  const answerInput = document.getElementById('answer');
  const inputValue = answerInput.value;
  
  fetchChampionData()
    .then(champions => filterSkins(champions, inputValue))
    .then(filteredSkins => generateDropdownList(filteredSkins));
}

// Function to hide the dropdown list on blur
function handleBlur() {
  const championList = document.getElementById('champion-list');
  setTimeout(() => (championList.innerHTML = ''), 0);
}

// Function to handle showing the dropdown list when clicking back into the text box
function handleInputFocus() {
  const answerInput = document.getElementById('answer');
  const inputValue = answerInput.value.trim().toLowerCase();

  if (inputValue) {
    fetchChampionData()
      .then(champions => filterSkins(champions, inputValue))
      .then(filteredSkins => generateDropdownList(filteredSkins));
  }
}

// Event listeners
document.getElementById('answer').addEventListener('input', handleInput);
document.getElementById('answer').addEventListener('blur', handleBlur);
document.getElementById('answer').addEventListener('focus', handleInputFocus);
document.getElementById('submit').addEventListener('click', handleSubmit);