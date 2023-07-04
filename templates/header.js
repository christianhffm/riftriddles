// Get the placeholder element
var headerPlaceholder = document.getElementById('header-placeholder');

// Check if the header content already exists in the placeholder
if (!headerPlaceholder.innerHTML) {
  // Fetch the header.html file
  fetch('../templates/header.html')
    .then(response => response.text())
    .then(data => {
      // Set the fetched HTML as the content of the placeholder element
      headerPlaceholder.innerHTML = data;

      // Once the content is inserted, you can access and modify the mute button element
      const muteButton = document.getElementById('muteButton');
      const muteImage = document.getElementById('muteImage');
      const audioElements = document.getElementsByTagName('audio');

      // Initialize the state and images for the button
      let isMuted = false; // Set the initial state to muted
      const unmuteImagePath = '../icons/header-icons/mute.png';
      const muteImagePath = '../icons/header-icons/sound.png';

      // Set the initial image
      muteImage.setAttribute('src', isMuted ? muteImagePath : unmuteImagePath);

      // Function to update the mute state and image
      const updateMuteState = () => {
        isMuted = !isMuted;
        muteImage.setAttribute('src', isMuted ? muteImagePath : unmuteImagePath);
        localStorage.setItem('muteState', isMuted.toString());

        // Mute or unmute all audio elements
        for (let i = 0; i < audioElements.length; i++) {
          audioElements[i].muted = isMuted;

          // Play the audio element if it is not muted
          if (!isMuted) {
            audioElements[i].play().catch(error => {
              console.log('Error playing audio:', error);
            });
          }
        }
      };

      // Set initial mute state and add click event listener
      updateMuteState();
      muteButton.addEventListener('click', updateMuteState);
    })
    .catch(error => {
      console.log('Error fetching header.html:', error);
    });
}
