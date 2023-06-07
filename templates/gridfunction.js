/* CHECK ALL BUTTON / CLEAR BUTTON */

// Get the button elements and attach click event listeners
var checkAllButton = document.getElementById("checkAllButton");
var clearButton = document.getElementById("clearButton");

checkAllButton.addEventListener("click", function() {
  // Get all checkboxes within the content block
  var checkboxes = document.querySelectorAll(".contentblock input[type='checkbox']");
  
  // Loop through each checkbox and check the unchecked ones
  checkboxes.forEach(function(checkbox) {
    if (!checkbox.checked) {
      checkbox.checked = true; // Check the unchecked checkboxes
    }
  });
});

clearButton.addEventListener("click", function() {
  // Get all checkboxes within the content block
  var checkboxes = document.querySelectorAll(".contentblock input[type='checkbox']");
  
  // Loop through each checkbox and uncheck the checked ones
  checkboxes.forEach(function(checkbox) {
    if (checkbox.checked) {
      checkbox.checked = false; // Uncheck the checked checkboxes
    }
  });
});

/* GRIDITEM SELECTOR */

// Get all grid item elements
var gridItems = document.querySelectorAll(".contentblock .griditem");

// Attach click event listeners to the grid items
gridItems.forEach(function(gridItem) {
  var checkbox = gridItem.querySelector("input[type='checkbox']");
  checkbox.addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the click event from propagating to the grid item
  });
  
  gridItem.addEventListener("click", function() {
    checkbox.checked = !checkbox.checked; // Toggle checkbox state
  });
});
