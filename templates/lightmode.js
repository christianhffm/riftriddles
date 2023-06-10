/* LIGHT MODE */

function toggleLightMode() {
    var body = document.body;
    var icon = document.getElementById("mode-icon");
    var featureContent = document.querySelector(".featurecontent");
  
    body.classList.toggle("light-mode");
    if (body.classList.contains("light-mode")) {
      icon.setAttribute("src", "../icons/header-icons/moon.png");
      icon.setAttribute("alt", "Dark Mode");
      body.style.backgroundColor = "white";
      featureContent.style.background = "linear-gradient(rgb(230, 230, 230), white)";
      body.style.color = "black"; // Set text color to white
      localStorage.setItem("lightMode", "true");
      
    } else {
      icon.setAttribute("src", "../icons/header-icons/sun.png");
      icon.setAttribute("alt", "Light Mode");
      body.style.backgroundColor = "";
      featureContent.style.background = "linear-gradient(rgb(210, 210, 210), rgb(0, 10, 20))";
      body.style.color = "black"; // Set text color to black
      localStorage.setItem("lightMode", "false");
      checkCurrentMode()
    }
  }