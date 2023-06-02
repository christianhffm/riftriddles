/* LANGUAGE SELECT */

document.addEventListener("DOMContentLoaded", function () {
  var dropdownButton = document.querySelector(".dropdown-button");
  var dropdownContent = document.querySelector(".dropdown-content");

  dropdownButton.addEventListener("click", function (event) {
    event.stopPropagation(); // Prevent click event from propagating to document
    dropdownContent.style.display = dropdownContent.style.display === "none" ? "flex" : "none";
  });

  document.addEventListener("click", function (event) {
    if (!dropdownButton.contains(event.target)) {
      dropdownContent.style.display = "none";
    }
  });
});


/* DARK MDOE */

function toggleDarkMode() {
  var body = document.body;
  var icon = document.getElementById("mode-icon");
  var rowContainer = document.querySelector(".rowcontainer");

  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    icon.setAttribute("src", "gfx/sun.png");
    icon.setAttribute("alt", "Light Mode");
    body.style.backgroundColor = "rgb(0, 10, 20)";
    rowContainer.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
    localStorage.setItem("darkMode", "true");
  } else {
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    rowContainer.style.background = "";
    localStorage.setItem("darkMode", "false");
  }
}

document.addEventListener("DOMContentLoaded", function () {
  var darkMode = localStorage.getItem("darkMode");
  var body = document.body;
  var icon = document.getElementById("mode-icon");
  var rowContainer = document.querySelector(".rowcontainer");

  if (darkMode === "true") {
    body.classList.add("dark-mode");
    icon.setAttribute("src", "gfx/sun.png");
    icon.setAttribute("alt", "Light Mode");
    body.style.backgroundColor = "rgb(0, 10, 20)";
    rowContainer.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
  } else if (darkMode === "false") {
    body.classList.remove("dark-mode");
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    rowContainer.style.background = "";
  }
});