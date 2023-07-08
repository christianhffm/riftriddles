const fs = require('fs');
const emojiRegex = require('emoji-regex');

// Read the JSON file
const championsData = fs.readFileSync('data/championData.json', 'utf8');

// Parse the JSON data
const champions = JSON.parse(championsData);

// Function to convert emojis to Unicode hex values
function convertEmojisToUnicodeHex(champion) {
  for (const key in champion) {
    if (champion.hasOwnProperty(key) && typeof champion[key] === 'string') {
      champion[key] = champion[key].replace(emojiRegex(), (match) =>
        Array.from(match)
          .map((char) => `\\u{${char.codePointAt(0).toString(16)}}`)
          .join('')
      );
    }
  }
  return champion;
}

// Convert emojis for each champion
const convertedChampions = champions.map(convertEmojisToUnicodeHex);

// Save the converted champions to a new JSON file
fs.writeFileSync('converted_champions.json', JSON.stringify(convertedChampions, null, 2));

console.log('Conversion complete!');
