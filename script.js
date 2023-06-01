function toggleDarkMode() {
  var body = document.body;
  var icon = document.getElementById("mode-icon");
  var rowContainer = document.querySelector(".rowcontainer");
  var backgroundContainer = document.querySelector(".backgroundcontainer");

  body.classList.toggle("dark-mode");
  if (body.classList.contains("dark-mode")) {
    icon.setAttribute("src", "gfx/sun.png");
    icon.setAttribute("alt", "Light Mode");
    body.style.backgroundColor = "rgb(0, 10, 20)";
    rowContainer.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
    backgroundContainer.style.filter = "brightness(40%)";
    localStorage.setItem("darkMode", "true");
  } else {
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    rowContainer.style.background = "";
    backgroundContainer.style.filter = "brightness(70%)";
    localStorage.setItem("darkMode", "false");
  }
}

// Check the dark mode preference on page load
document.addEventListener("DOMContentLoaded", function () {
  var darkMode = localStorage.getItem("darkMode");
  var body = document.body;
  var icon = document.getElementById("mode-icon");
  var rowContainer = document.querySelector(".rowcontainer");
  var backgroundContainer = document.querySelector(".backgroundcontainer");

  if (darkMode === "true") {
    body.classList.add("dark-mode");
    icon.setAttribute("src", "gfx/sun.png");
    icon.setAttribute("alt", "Light Mode");
    body.style.backgroundColor = "rgb(0, 10, 20)";
    rowContainer.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
    backgroundContainer.style.filter = "brightness(40%)";
  } else {
    body.classList.remove("dark-mode");
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    rowContainer.style.background = "";
    backgroundContainer.style.filter = "brightness(70%)";
  }
});