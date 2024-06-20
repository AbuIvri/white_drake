let character;
let platforms = [];
let transparentPlatforms = [];
let hamburgers = [];
let characterImg;
let characterCrouchImg;
let platformImg;
let transparentPlatformImg;
let endPlatformImg;
let hamburgerImg;
let backgroundImg;
let themeMusic;
let deathSound;
let openingImage;
let startButton;
let hamburgerDeathBanner;
let fallingDeathBanner;
let goldenPlatformImg;
let scrollOffset = 0;
let score = 0;
let level = 1;
let levelLength = 800;
let lives = 3;
let gameState = 'opening';
let buttonVisible = false;
let backgroundX = 0;
let deathCause = '';
let lastGoldenPlatform;

function preload() {
  // Load your own textures and sounds here
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

function setup() {
  createCanvas(800, 600);
  themeMusic.loop();
  setTimeout(() => buttonVisible = true, 3000);  // Show start button after 3 seconds
  backgroundX = 0;
}

function draw() {
  if (gameState === 'opening') {
    drawOpeningScreen();
  } else if (gameState === 'gameOver') {
    drawGameOverScreen();
  } else {
    playGame();
  }
}

function drawOpeningScreen() {
  background(openingImage);
  if (buttonVisible) {
    image(startButton, width / 2 - 75, height / 2 + 100, 150, 150); // Updated button dimensions
  }
}

function drawGameOverScreen() {
  background(openingImage);
  if (deathCause === 'hamburger') {
    image(hamburgerDeathBanner, width / 2 - 150, height / 2 - 75, 300, 150);
  } else if (deathCause === 'falling') {
    image(fallingDeathBanner, width / 2 - 150, height / 2 - 75, 300, 150);
  }
}

function mousePressed() {
  if (gameState === 'opening' && buttonVisible) {
    if (mouseX > width / 2 - 75 && mouseX < width / 2 + 75 && mouseY > height / 2 + 100 && mouseY < height / 2 + 250) {
      gameState = 'playing';
      startLevel();
    }
  } else if (gameState === 'gameOver') {
    resetGame();
    gameState = 'playing';
    startLevel();
  }
}

function playGame() {
  background(0);

  // Scroll the background
  if (character.position.x > width / 2) {
    backgroundX -= character.velocity.x; // Adjust the speed of the background scrolling
  }
  if (backgroundX <= -backgroundImg.width) {
    backgroundX += backgroundImg.width;
  }
  image(backgroundImg, backgroundX, 0, backgroundImg.width, height);
  image(backgroundImg, backgroundX + backgroundImg.width, 0, backgroundImg.width, height);

  translate(-scrollOffset, 0);
  
  character.update();
  character.show();
  
  for (let platform of platforms) {
    platform.update();
    platform.show();
  }
  
  for (let platform of transparentPlatforms) {
    platform.show();
  }
  
  for (let i = hamburgers.length - 1; i >= 0; i--) {
    let hamburger = hamburgers[i];
    if (hamburger) {
      hamburger.update();
      hamburger.show();
      if (hamburger.checkCollision(character)) {
        if (character.position.y < hamburger.position.y) {
          character.velocity.y = -15;  // Bounce off the hamburger
          score += 10; // Gain points for jumping on hamburger
          hamburgers.splice(i, 1);    // Remove the hamburger
        } else {
          lives--;
          if (lives > 0) {
            deathCause = 'hamburger';
            restartFromLastGoldenPlatform();
          } else {
            deathSound.play();
            gameState = 'gameOver';
          }
        }
      }
    }
  }
  
  // Scroll the screen
  if (character.position.x > width / 2) {
    scrollOffset = character.position.x - width / 2;
  }
  
  // Update score
  textSize(32);
  fill(255);
  text('Score: ' + score, scrollOffset + 20, 40);
  text('Lives: ' + lives, scrollOffset + 20, 80);
  
  // Add new platforms and hamburgers as we scroll
  if (platforms[platforms.length - 1].x < character.position.x + width) {
    addPlatform();
  }
  
  if (random() < 0.01) {
    hamburgers.push(new Hamburger(scrollOffset + width, random(100, 500)));
  }
}

class Character {
  constructor() {
    this.position = createVector(125, 0); // Start above the first platform
    this.velocity = createVector(0, 0);
    this.gravity = createVector(0, 0.8);
    this.onGround = false;
    this.standingPlatform = null;
    this.standingTime = 0;
    this.crouching = false;
  }
  
  update() {
    this.velocity.add(this.gravity);
    this.position.add(this.velocity);
    
    if (this.position.y > height) {
      lives--;
      if (lives > 0) {
        deathCause = 'falling';
        restartFromLastGoldenPlatform();
      } else {
        deathSound.play();
        gameState = 'gameOver';
      }
    }
    
    if (keyIsDown(LEFT_ARROW)) {
      this.position.x -= 5;
    }
    
    if (keyIsDown(RIGHT_ARROW)) {
      this.position.x += 5;
    }
    
    this.onGround = false;
    let isStanding = false;
    
    for (let platform of platforms) {
      if (platform.checkCollision(this)) {
        if (platform.transparent) {
          continue;  // Skip transparent platforms
        }
        this.velocity.y = 0;
        this.onGround = true;
        this.position.y = platform.y - (this.crouching ? 30 : 45); // Adjust for the character's height
        isStanding = true;
        platform.shake(); // Make the platform shake when the character lands on it
        if (platform.isEndPlatform) {
          score += 50; // Bonus points for landing on the final platform
          level++;
          levelLength *= 2;
          platform.isEndPlatform = false; // Mark this end platform as used
          lastGoldenPlatform = platform;
          createNextLevel();
        }
        if (this.standingPlatform === platform && !platform.isEndPlatform) {
          this.standingTime += deltaTime;
          if (this.standingTime > 5000) { // 5 seconds
            platform.makeTransparent();
            this.standingPlatform = null;
            this.standingTime = 0;
          }
        } else {
          this.standingPlatform = platform;
          this.standingTime = 0;
        }
      }
    }
    
    if (!isStanding) {
      this.standingPlatform = null;
      this.standingTime = 0;
    }
    
    if (this.onGround && keyIsPressed && key === ' ') {
      this.velocity.y = -15;
      this.onGround = false;
    }
    
    if (keyIsDown(DOWN_ARROW)) {
      this.crouching = true;
    } else {
      this.crouching = false;
    }
  }
  
  show() {
    if (this.crouching) {
      image(characterCrouchImg, this.position.x, this.position.y, 50, 50);
    } else {
      image(characterImg, this.position.x, this.position.y, 50, 50);
    }
  }
  
  getHitbox() {
    if (this.crouching) {
      return {
        x: this.position.x + 10,
        y: this.position.y + 10,
        w: 30,
        h: 30
      };
    } else {
      return {
        x: this.position.x + 5,
        y: this.position.y + 5,
        w: 40,
        h: 40
      };
    }
  }
}

class Platform {
  constructor(x, y, img, isEndPlatform = false) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.originalY = y; // Store the original y position for shaking effect
    this.transparent = false;
    this.isEndPlatform = isEndPlatform;
    this.shakeOffset = 0; // Initial shake offset
  }
  
  update() {
    if (this.transparent) {
      this.img = transparentPlatformImg;
    }
    // Update the shaking effect
    if (this.shakeOffset > 0) {
      this.shakeOffset -= 0.1;
    } else {
      this.shakeOffset = 0;
    }
  }
  
  show() {
    image(this.img, this.x, this.y + this.shakeOffset, 100, 44); // Apply the shake offset
  }
  
  checkCollision(character) {
    let hitbox = character.getHitbox();
    if (hitbox.x + hitbox.w > this.x && hitbox.x < this.x + 100 &&
        hitbox.y + hitbox.h > this.y && hitbox.y < this.y + 44) {
      return true;
    }
    return false;
  }
  
  makeTransparent() {
    if (!this.isEndPlatform) {
      this.transparent = true;
    }
  }
  
  shake() {
    this.shakeOffset = 10; // Start shaking
  }
}

class Hamburger {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(-5, 0);
  }
  
  update() {
    this.position.add(this.velocity);
  }
  
  show() {
    image(hamburgerImg, this.position.x, this.position.y, 50, 50);
  }
  
  checkCollision(character) {
    let hitbox = character.getHitbox();
    if (hitbox.x + hitbox.w > this.position.x + 5 && hitbox.x < this.position.x + 45 &&
        hitbox.y + hitbox.h > this.position.y + 5 && hitbox.y < this.position.y + 45) {
      return true;
    }
    return false;
  }
}

function startLevel(lvl = level, retry = false) {
  if (!retry) {
    platforms = [];
    transparentPlatforms = [];
    hamburgers = [];
    scrollOffset = 0;
    character = new Character();
  }
  
  // Create platforms with gaps for the level
  let x = platforms.length ? platforms[platforms.length - 1].x + 100 : 100;
  while (x < lvl * levelLength) {
    let y = random(200, 500);
    platforms.push(new Platform(x, y, platformImg));
    x += random(100, 200);
  }
  
  // Add end platform
  let endPlatform = new Platform(lvl * levelLength, random(200, 500), goldenPlatformImg, true);
  platforms.push(endPlatform);
  lastGoldenPlatform = endPlatform;
}

function addPlatform() {
  let x = platforms[platforms.length - 1].x + random(100, 200);
  let y = random(200, 500);
  platforms.push(new Platform(x, y, platformImg));
  
  // Ensure there's always a normal platform within jump range
  let normalPlatformFound = false;
  for (let i = platforms.length - 1; i >= 0 && platforms[i].x > x - 200; i--) {
    if (!platforms[i].transparent) {
      normalPlatformFound = true;
      break;
    }
  }
  if (!normalPlatformFound) {
    platforms.push(new Platform(x + random(100, 200), random(200, 500), platformImg));
  }
}

function createNextLevel() {
  // Add new platforms and a new end platform for the next level
  let x = platforms[platforms.length - 1].x + 100;
  let y;
  for (let i = 0; i < level * 10; i++) {
    y = random(200, 500);
    platforms.push(new Platform(x, y, platformImg));
    x += random(100, 200);
  }
  
  // Add end platform
  let endPlatform = new Platform(x, random(200, 500), goldenPlatformImg, true);
  platforms.push(endPlatform);
  lastGoldenPlatform = endPlatform;
}

function restartFromLastGoldenPlatform() {
  character.position.x = lastGoldenPlatform.x;
  character.position.y = lastGoldenPlatform.y - 45;
  scrollOffset = character.position.x - width / 2;
}

function resetGame() {
  score = 0;
  level = 1;
  levelLength = 800;
  lives = 3;
  scrollOffset = 0;
  lastGoldenPlatform = null;
  startLevel();
}
