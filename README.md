# White Drake Can Jump

**White Drake Can Jump** is a 16-bit style platform jumping game set in a post-apocalyptic world where sentient hamburgers have taken over. You play as Drake, who must survive and save the world by jumping from platform to platform and defeating hamburgers by jumping on them.

## About the Game

In a world where sentient hamburgers have taken over, only one hero can save the day: Drake. Navigate through a treacherous landscape, jumping from platform to platform, avoiding or defeating the evil hamburgers, and striving to survive in this post-apocalyptic environment. The game's retro 16-bit graphics provide a nostalgic yet thrilling experience.

## Play the Game

You can play the game directly here:

<iframe src="https://openprocessing.org/sketch/2303149/embed/" width="400" height="400"></iframe>

Alternatively, you can run the game locally on your computer.

## Gameplay Instructions

1. **Start the Game**:
   - Open the game and wait for the opening screen.
   - Click the "Start" button to begin the game.

2. **Controls**:
   - **Move Left**: Press the `LEFT ARROW` key.
   - **Move Right**: Press the `RIGHT ARROW` key.
   - **Jump**: Press the `SPACE` key.
   - **Crouch**: Press the `DOWN ARROW` key.

3. **Objective**:
   - Jump from platform to platform to progress through the levels.
   - Defeat hamburgers by jumping on top of them.
   - Reach the golden platform to complete the level and move on to the next one.
   - Avoid falling off platforms or getting hit by hamburgers.

4. **Lives and Score**:
   - You start with 3 lives. If you fall or get hit by a hamburger, you lose a life.
   - If you lose all your lives, the game is over, and you can restart by clicking on the game over screen.
   - Gain points by landing on platforms and defeating hamburgers. Bonus points are awarded for reaching the golden platform.

## Development

This game is built using p5.js, a JavaScript library for creative coding. The graphics are designed in a retro 16-bit style, giving a nostalgic feel to the gameplay.

### Prerequisites

To run the game locally, you need:
- A web browser with JavaScript enabled.
- p5.js library included in your HTML file.

### Running the Game Locally

1. Download the game files and ensure all assets (images and sounds) are in the correct directory.
2. Open the `index.html` file in your web browser to start the game.

### Code Snippets

Here's a sample of the core gameplay code:

```javascript
function preload() {
  characterImg = loadImage('character.png'); 
  characterCrouchImg = loadImage('character_crouch.png');
  platformImg = loadImage('platform.png'); 
  transparentPlatformImg = loadImage('transparent_platform.png');
  endPlatformImg = loadImage('end_platform.png');
  hamburgerImg = loadImage('hamburger.png');
  backgroundImg = loadImage('background.png');
  themeMusic = loadSound('theme_music.mp3');
  deathSound = loadSound('death_sound.mp3');
  openingImage = loadImage('opening_image.png');
  startButton = loadImage('start_button.png');
  hamburgerDeathBanner = loadImage('hamburger_death.png');
  fallingDeathBanner = loadImage('falling_death.png');
  goldenPlatformImg = loadImage('golden_platform.png');
}
