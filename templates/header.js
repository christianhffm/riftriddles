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

      // Once the content is inserted, you can access and modify the mute button elements
      const muteMusicButton = document.getElementById('muteMusicButton');
      const muteEffectsButton = document.getElementById('muteEffectsButton');
      const muteMusicImage = document.getElementById('muteMusicImage');
      const muteEffectsImage = document.getElementById('muteEffectsImage');
      const audioElements = document.getElementsByTagName('audio');

      // Initialize the state and images for the buttons
      let isMusicMuted = false; // Set the initial state for music to unmuted
      let isEffectsMuted = false; // Set the initial state for effects to unmuted
      const unmuteMusicImagePath = '../icons/header-icons/music.png';
      const muteMusicImagePath = '../icons/header-icons/slash.png';
      const unmuteEffectsImagePath = '../icons/header-icons/sound.png'; // Specify the actual path to unmute effects image
      const muteEffectsImagePath = '../icons/header-icons/mute.png'; // Specify the actual path to mute effects image

      // Set the initial images for the buttons
      muteMusicImage.setAttribute('src', isMusicMuted ? muteMusicImagePath : unmuteMusicImagePath);
      muteEffectsImage.setAttribute('src', isEffectsMuted ? muteEffectsImagePath : unmuteEffectsImagePath);

      // Function to update the mute state and images for music
      const updateMusicMuteState = () => {
        isMusicMuted = !isMusicMuted;
        muteMusicImage.setAttribute('src', isMusicMuted ? muteMusicImagePath : unmuteMusicImagePath);
        localStorage.setItem('musicMuteState', isMusicMuted.toString());

        // Mute or unmute music audio elements
        for (let i = 0; i < audioElements.length; i++) {
          if (audioElements[i].classList.contains('music')) {
            audioElements[i].muted = isMusicMuted;

            // Play the audio element if it is not muted
            if (!isMusicMuted) {
              audioElements[i].play().catch(error => {
                console.log('Error playing audio:', error);
              });
            }
          }
        }
      };

      // Function to update the mute state and images for effects
      const updateEffectsMuteState = () => {
        isEffectsMuted = !isEffectsMuted;
        muteEffectsImage.setAttribute('src', isEffectsMuted ? muteEffectsImagePath : unmuteEffectsImagePath);
        localStorage.setItem('effectsMuteState', isEffectsMuted.toString());
      
        // Mute or unmute effects audio elements
        for (let i = 0; i < audioElements.length; i++) {
          if (audioElements[i].classList.contains('effects')) {
            audioElements[i].muted = isEffectsMuted;
          }
        }
      };
      

      // Set initial mute state and add click event listeners to the buttons
      updateMusicMuteState();
      updateEffectsMuteState();
      muteMusicButton.addEventListener('click', updateMusicMuteState);
      muteEffectsButton.addEventListener('click', updateEffectsMuteState);
    })
    .catch(error => {
      console.log('Error fetching header.html:', error);
    });
}
