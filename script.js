function toggleDarkMode() {
  var body = document.body;
  var icon = document.getElementById("mode-icon");
  var featureContent = document.querySelector(".featurecontent");

  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    icon.setAttribute("src", "gfx/sun.png");
    icon.setAttribute("alt", "Light Mode");
    body.style.backgroundColor = "rgb(0, 10, 20)";
    featureContent.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
    localStorage.setItem("darkMode", "true");
  } else {
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    featureContent.style.background = "";
    localStorage.setItem("darkMode", "false");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var darkMode = localStorage.getItem("darkMode");
  var body = document.body;
  var icon = document.getElementById("mode-icon");
  var featureContent = document.querySelector(".featurecontent");

  if (darkMode === "true") {
    body.classList.add("dark-mode");
    icon.setAttribute("src", "gfx/sun.png");
    icon.setAttribute("alt", "Light Mode");
    body.style.backgroundColor = "rgb(0, 10, 20)";
    featureContent.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
  } else {
    body.classList.remove("dark-mode");
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    featureContent.style.background = "";
  }
});

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
