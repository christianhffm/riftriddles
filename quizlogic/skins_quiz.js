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
  
            if (skins && Array.isArray(skins)) {
              var skinData = skins.map(skin => {
                return {
                  num: skin.num,
                  name: skin.name
                };
              });
  
              championData[championId] = {
                championName: champion.name,
                skins: skinData
              };
            }
          }
        }
  
        console.log("Champion Data:", championData);
  
        const randomChampionSkin = getRandomChampionSkin(championData);
  
        // Create the image path using champion name and skin ID
        const imagePath = `../splashes/${randomChampionSkin.championName}_${randomChampionSkin.skinNumber}.jpg`;
  
        // Create an <img> element and set its source attribute
        var skinImage = document.createElement('img');
        skinImage.src = imagePath;
  
        // Insert the image element into the <div> container
        var skinDiv = document.getElementById('skinDiv');
        skinDiv.innerHTML = ''; // Clear previous content
        skinDiv.appendChild(skinImage);
  
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
    const skins = champion.skins;
    const randomSkin = skins[Math.floor(Math.random() * skins.length)];
    const skinNumber = randomSkin.num;
    const skinName = randomSkin.name;
  
    return {
      championName: championName,
      skinNumber: skinNumber,
      skinName: skinName
    };
  }
  
  initializeQuestions();
  