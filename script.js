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
    backgroundContainer.style.filter = "brightness(60%)";
    localStorage.setItem("mode", "dark");
  } else {
    icon.setAttribute("src", "gfx/moon.png");
    icon.setAttribute("alt", "Dark Mode");
    body.style.backgroundColor = "";
    rowContainer.style.background = "";
    backgroundContainer.style.filter = "brightness(80%)";
    localStorage.setItem("mode", "light");
  }
}

// Set the initial mode based on the user's preference
var savedMode = localStorage.getItem("mode");
if (savedMode === "dark") {
  document.body.classList.add("dark-mode");
  document.getElementById("mode-icon").setAttribute("src", "gfx/sun.png");
  document.getElementById("mode-icon").setAttribute("alt", "Light Mode");
  document.body.style.backgroundColor = "rgb(0, 10, 20)";
  document.querySelector(".rowcontainer").style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
  document.querySelector(".backgroundcontainer").style.filter = "brightness(60%)";
}
