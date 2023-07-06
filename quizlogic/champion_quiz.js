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

      console.log(championEntries); // Log the processed entries to verify

      // Call displayQuestion() after the data is processed
      displayQuestion();
    })
    .catch(error => console.log('An error occurred while fetching champion data:', error));

    const answerInput = document.getElementById('answer');
    answerInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        checkAnswer();
      }
    });
}

function displayQuestion() {
}

initializeQuestions();
