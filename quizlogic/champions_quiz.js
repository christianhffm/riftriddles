var zoomLevel = 500; // Initial zoom level

function initializeQuestions() {
  fetch('../data/championFull.json')
    .then(response => response.json())
    .then(data => {
      var championData = {};

      for (var championKey in data.data) {
        if (data.data.hasOwnProperty(championKey)) {
          var champion = data.data[championKey];
          var championId = champion.id;
          var skins = champion.skins;

          if (skins && Array.isArray(skins) && skins.length > 0) {
            var firstSkin = skins[0];
            var skinData = {
              num: firstSkin.num,
              name: firstSkin.name
            };

            championData[championId] = {
              championName: champion.name,
              skin: skinData
            };
          }
        }
      }

      console.log("Champion Data:", championData);

      const randomChampionSkin = getRandomChampionSkin(championData);

      // Create the image path using champion name and skin ID
      const imagePath = `../splashes/${randomChampionSkin.championName}_${randomChampionSkin.skinNumber}.jpg`;

      // Set the background image of the skinDiv container
      var skinDiv = document.getElementById('skinDiv');
      skinDiv.style.backgroundImage = `url('${imagePath}')`;
      skinDiv.style.backgroundPosition = 'center'; // Set the zoomed-in position
      skinDiv.style.backgroundSize = `${zoomLevel}%`; // Set the initial zoom level

      console.log("Random Champion Name:", randomChampionSkin.championName);
      console.log("Random Skin Number:", randomChampionSkin.skinNumber);
      console.log("Random Skin Name:", randomChampionSkin.skinName);
    })
    .catch(error => {
      console.log("Error fetching JSON:", error);
    });
}

function getRandomChampionSkin(championData) {
  const championIds = Object.keys(championData);
  const randomChampionId = championIds[Math.floor(Math.random() * championIds.length)];
  const champion = championData[randomChampionId];
  const championName = champion.championName;
  const skinData = champion.skin;
  const skinNumber = skinData.num;
  const skinName = skinData.name;

  return {
    championName: championName,
    skinNumber: skinNumber,
    skinName: skinName
  };
}

function decreaseZoomLevel() {
  if (zoomLevel > 100) {
    zoomLevel -= 50;
    var skinDiv = document.getElementById('skinDiv');
    skinDiv.style.backgroundSize = `${zoomLevel}%`;
  }
}

initializeQuestions();

var zoomButton = document.getElementById('zoomButton');
zoomButton.addEventListener('click', decreaseZoomLevel);
