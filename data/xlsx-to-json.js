const XLSX = require('xlsx');
const fs = require('fs');
const chokidar = require('chokidar');

// Function to convert XLSX to JSON
function convertXlsxToJson() {
  // Read the Excel file
  const workbook = XLSX.readFile('data/champions.xlsx');
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json(worksheet);

  // Write the JSON data to a file
  fs.writeFile('data/champions.json', JSON.stringify(jsonData, null, 4), (err) => {
    if (err) {
      console.error('Error writing JSON file:', err);
    } else {
      console.log('JSON file updated successfully.');
    }
  });
}

// Watch for changes in the XLSX file
const watcher = chokidar.watch('data/champions.xlsx');
watcher.on('change', () => {
  convertXlsxToJson();
});

// Initial conversion from XLSX to JSON
convertXlsxToJson();
