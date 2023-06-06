// Get the placeholder element
var headerPlaceholder = document.getElementById('header-placeholder');

// Check if the header content already exists in the placeholder
if (!headerPlaceholder.innerHTML) {
  // Fetch the header.html file
  fetch('templates/header.html')
    .then(response => response.text())
    .then(data => {
      // Set the fetched HTML as the content of the placeholder element
      headerPlaceholder.innerHTML = data;
    })
    .catch(error => {
      console.log('Error fetching header.html:', error);
    });
}
