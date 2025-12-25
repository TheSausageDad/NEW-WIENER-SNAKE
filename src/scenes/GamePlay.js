import Phaser from 'phaser';
import { supabase } from '../supabaseClient';

export default class GamePlay extends Phaser.Scene {
  constructor() {
    super('GamePlay');
  }

  init() {
    // Grid settings - optimized to fill screen
    this.gridSize = 46;
    this.gridWidth = 15;
    this.gridHeight = 15;

    // Mobile detection for grid offset
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone;
    this.gridOffsetY = isMobile ? 180 : 120; // Offset for score area
    this.gridOffsetX = 0; // Will be set in createGrid()

    // Snake settings
    this.snake = [];
    this.snakeDirection = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.moveDelayHorizontal = 150; // milliseconds for left/right
    this.moveDelayVertical = 120; // milliseconds for up/down (faster)
    this.moveTimer = 0; // Accumulator for delta time

    // Game state
    this.score = 0;
    this.food = null;
    this.gameOver = false;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Score text with retro styling - centered above grid, adjusted for mobile
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone;
    const scoreY = isMobile ? 40 : 30;
    this.scoreText = this.add.text(width / 2, scoreY, 'SCORE: 0', {
      fontSize: isMobile ? '28px' : '20px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#754938',
      padding: { x: 12, y: 8 }
    }).setOrigin(0.5);

    // Create grid background (offset down by 40px)
    this.createGrid();

    // Initialize snake in the middle
    const startX = Math.floor(this.gridWidth / 2);
    const startY = Math.floor(this.gridHeight / 2);

    for (let i = 0; i < 3; i++) {
      this.snake.push({
        x: startX - i,
        y: startY
      });
    }

    // Create graphics for snake and food
    this.snakeGraphics = this.add.graphics();
    this.foodGraphics = this.add.graphics();

    // Spawn first food
    this.spawnFood();

    // Setup controls
    this.setupControls();

    // Setup mobile controls
    this.setupMobileControls();

    // Draw initial state
    this.drawSnake();
    this.drawFood();

    // Show How to Play popup
    this.showHowToPlay();
  }

  showHowToPlay() {
    const { width, height } = this.cameras.main;

    // Pause the game
    this.gameOver = true; // Temporarily set to prevent snake movement

    // Mobile detection
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone;

    // Semi-transparent overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, width, height);

    // Popup background - bigger on mobile
    const popupWidth = isMobile ? 600 : 500;
    const popupHeight = isMobile ? 500 : 300;
    const popupBg = this.add.graphics();
    popupBg.fillStyle(0x754938, 1);
    popupBg.fillRoundedRect(width / 2 - popupWidth / 2, height / 2 - popupHeight / 2, popupWidth, popupHeight, 8);
    popupBg.lineStyle(4, 0xfaca79, 1);
    popupBg.strokeRoundedRect(width / 2 - popupWidth / 2, height / 2 - popupHeight / 2, popupWidth, popupHeight, 8);

    // Title - bigger on mobile
    const title = this.add.text(width / 2, height / 2 - (isMobile ? 180 : 110), 'HOW TO PLAY', {
      fontSize: isMobile ? '32px' : '20px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // Instructions for desktop
    const desktopLabel = this.add.text(width / 2, height / 2 - (isMobile ? 100 : 60), 'DESKTOP:', {
      fontSize: isMobile ? '24px' : '14px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#f47d59'
    }).setOrigin(0.5);

    const desktopText = this.add.text(width / 2, height / 2 - (isMobile ? 50 : 30), 'Arrow Keys or WASD', {
      fontSize: isMobile ? '20px' : '12px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // Instructions for mobile
    const mobileLabel = this.add.text(width / 2, height / 2 + (isMobile ? 20 : 10), 'MOBILE:', {
      fontSize: isMobile ? '24px' : '14px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#f47d59'
    }).setOrigin(0.5);

    const mobileText = this.add.text(width / 2, height / 2 + (isMobile ? 70 : 40), 'Swipe to Control', {
      fontSize: isMobile ? '20px' : '12px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // Start button - bigger on mobile
    const startButton = this.add.text(width / 2, height / 2 + (isMobile ? 170 : 100), 'START', {
      fontSize: isMobile ? '28px' : '18px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: isMobile ? { x: 40, y: 22 } : { x: 24, y: 14 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        // Remove popup elements
        overlay.destroy();
        popupBg.destroy();
        title.destroy();
        desktopLabel.destroy();
        desktopText.destroy();
        mobileLabel.destroy();
        mobileText.destroy();
        startButton.destroy();
        // Resume game
        this.gameOver = false;
      });

    // Hover effect
    startButton.on('pointerover', () => {
      startButton.setStyle({ backgroundColor: '#f47d59' });
    });
    startButton.on('pointerout', () => {
      startButton.setStyle({ backgroundColor: '#dd5342' });
    });
  }

  createGrid() {
    const { width, height } = this.cameras.main;
    const graphics = this.add.graphics();
    const gridOffsetX = (width - this.gridWidth * this.gridSize) / 2; // Center grid horizontally
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone;

    // Yellow grid lines for emphasis - more visible on desktop
    const gridOpacity = isMobile ? 0.25 : 0.4;
    const gridLineWidth = isMobile ? 1 : 2;
    graphics.lineStyle(gridLineWidth, 0xfaca79, gridOpacity);

    for (let x = 0; x <= this.gridWidth; x++) {
      graphics.moveTo(gridOffsetX + x * this.gridSize, this.gridOffsetY);
      graphics.lineTo(gridOffsetX + x * this.gridSize, this.gridHeight * this.gridSize + this.gridOffsetY);
    }

    for (let y = 0; y <= this.gridHeight; y++) {
      graphics.moveTo(gridOffsetX, y * this.gridSize + this.gridOffsetY);
      graphics.lineTo(gridOffsetX + this.gridWidth * this.gridSize, y * this.gridSize + this.gridOffsetY);
    }

    graphics.strokePath();

    // Add yellow border around grid - not on mobile
    if (!isMobile) {
      const borderThickness = 8;
      graphics.lineStyle(borderThickness, 0xfaca79, 1);
      graphics.strokeRect(gridOffsetX, this.gridOffsetY, this.gridWidth * this.gridSize, this.gridHeight * this.gridSize);
    }

    // Store grid offset for use in other methods
    this.gridOffsetX = gridOffsetX;
  }

  setupControls() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD keys
    this.keys = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D
    });
  }

  setupMobileControls() {
    // Add swipe gesture detection
    this.input.on('pointerdown', (pointer) => {
      this.swipeStart = { x: pointer.x, y: pointer.y };
    });

    this.input.on('pointerup', (pointer) => {
      if (!this.swipeStart) return;

      const swipeEnd = { x: pointer.x, y: pointer.y };
      const dx = swipeEnd.x - this.swipeStart.x;
      const dy = swipeEnd.y - this.swipeStart.y;
      const minSwipeDistance = 50;

      // Check if swipe was significant enough
      if (Math.abs(dx) > minSwipeDistance || Math.abs(dy) > minSwipeDistance) {
        // Determine swipe direction
        if (Math.abs(dx) > Math.abs(dy)) {
          // Horizontal swipe
          if (dx > 0 && this.snakeDirection.x !== -1) {
            this.nextDirection = { x: 1, y: 0 }; // Right
          } else if (dx < 0 && this.snakeDirection.x !== 1) {
            this.nextDirection = { x: -1, y: 0 }; // Left
          }
        } else {
          // Vertical swipe
          if (dy > 0 && this.snakeDirection.y !== -1) {
            this.nextDirection = { x: 0, y: 1 }; // Down
          } else if (dy < 0 && this.snakeDirection.y !== 1) {
            this.nextDirection = { x: 0, y: -1 }; // Up
          }
        }
      }

      this.swipeStart = null;
    });
  }

  update(time, delta) {
    if (this.gameOver) return;

    // Handle input
    this.handleInput();

    // Move snake at intervals using delta time accumulator
    // Use different speeds for vertical vs horizontal movement
    this.moveTimer += delta;

    // Choose delay based on current direction
    const currentDelay = this.snakeDirection.y !== 0 ? this.moveDelayVertical : this.moveDelayHorizontal;

    if (this.moveTimer >= currentDelay) {
      this.moveTimer -= currentDelay;
      this.moveSnake();
    }
  }

  handleInput() {
    // Prevent reversing into yourself
    if ((this.cursors.up.isDown || this.keys.w.isDown) && this.snakeDirection.y !== 1) {
      this.nextDirection = { x: 0, y: -1 };
    } else if ((this.cursors.down.isDown || this.keys.s.isDown) && this.snakeDirection.y !== -1) {
      this.nextDirection = { x: 0, y: 1 };
    } else if ((this.cursors.left.isDown || this.keys.a.isDown) && this.snakeDirection.x !== 1) {
      this.nextDirection = { x: -1, y: 0 };
    } else if ((this.cursors.right.isDown || this.keys.d.isDown) && this.snakeDirection.x !== -1) {
      this.nextDirection = { x: 1, y: 0 };
    }
  }

  moveSnake() {
    // Update direction
    this.snakeDirection = { ...this.nextDirection };

    // Calculate new head position
    const head = this.snake[0];
    const newHead = {
      x: head.x + this.snakeDirection.x,
      y: head.y + this.snakeDirection.y
    };

    // Check wall collision
    if (newHead.x < 0 || newHead.x >= this.gridWidth ||
        newHead.y < 0 || newHead.y >= this.gridHeight) {
      this.endGame();
      return;
    }

    // Check self collision
    for (let segment of this.snake) {
      if (segment.x === newHead.x && segment.y === newHead.y) {
        this.endGame();
        return;
      }
    }

    // Add new head
    this.snake.unshift(newHead);

    // Check food collision
    if (newHead.x === this.food.x && newHead.y === this.food.y) {
      this.score += 10;
      this.scoreText.setText('SCORE: ' + this.score);
      this.spawnFood();

      // Flash effect when eating (retro colors)
      this.cameras.main.flash(100, 250, 202, 121);
    } else {
      // Remove tail if no food eaten
      this.snake.pop();
    }

    this.drawSnake();
    this.drawFood();
  }

  spawnFood() {
    let validPosition = false;
    let newFood;

    while (!validPosition) {
      newFood = {
        x: Phaser.Math.Between(0, this.gridWidth - 1),
        y: Phaser.Math.Between(0, this.gridHeight - 1)
      };

      // Check if food spawns on snake
      validPosition = true;
      for (let segment of this.snake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          validPosition = false;
          break;
        }
      }
    }

    this.food = newFood;
  }

  drawSnake() {
    this.snakeGraphics.clear();

    // Draw each segment
    this.snake.forEach((segment, index) => {
      if (index === 0) {
        // Head - retro sausage with eyes
        this.snakeGraphics.fillStyle(0xf47d59, 1);
        this.snakeGraphics.fillRoundedRect(
          this.gridOffsetX + segment.x * this.gridSize + 2,
          segment.y * this.gridSize + 2 + this.gridOffsetY,
          this.gridSize - 4,
          this.gridSize - 4,
          6
        );

        // Head outline
        this.snakeGraphics.lineStyle(2, 0xdd5342, 1);
        this.snakeGraphics.strokeRoundedRect(
          this.gridOffsetX + segment.x * this.gridSize + 2,
          segment.y * this.gridSize + 2 + this.gridOffsetY,
          this.gridSize - 4,
          this.gridSize - 4,
          6
        );

        // Eyes - scaled to grid size
        this.snakeGraphics.fillStyle(0x754938, 1);
        const eyeSize = Math.floor(this.gridSize / 8);
        const eyeOffset1 = Math.floor(this.gridSize / 3);
        const eyeOffset2 = Math.floor(this.gridSize * 2 / 3);

        // Draw eyes based on direction
        if (this.snakeDirection.x !== 0) {
          // Horizontal movement - eyes on the side (vertically spaced)
          this.snakeGraphics.fillCircle(
            this.gridOffsetX + segment.x * this.gridSize + eyeOffset1,
            segment.y * this.gridSize + eyeOffset1 + this.gridOffsetY,
            eyeSize
          );
          this.snakeGraphics.fillCircle(
            this.gridOffsetX + segment.x * this.gridSize + eyeOffset1,
            segment.y * this.gridSize + eyeOffset2 + this.gridOffsetY,
            eyeSize
          );
        } else {
          // Vertical movement - eyes on top (horizontally spaced)
          this.snakeGraphics.fillCircle(
            this.gridOffsetX + segment.x * this.gridSize + eyeOffset1,
            segment.y * this.gridSize + eyeOffset1 + this.gridOffsetY,
            eyeSize
          );
          this.snakeGraphics.fillCircle(
            this.gridOffsetX + segment.x * this.gridSize + eyeOffset2,
            segment.y * this.gridSize + eyeOffset1 + this.gridOffsetY,
            eyeSize
          );
        }
      } else {
        // Body - alternating retro sausage segments
        const color = index % 2 === 0 ? 0xdd5342 : 0xf47d59;
        this.snakeGraphics.fillStyle(color, 1);
        this.snakeGraphics.fillRoundedRect(
          this.gridOffsetX + segment.x * this.gridSize + 2,
          segment.y * this.gridSize + 2 + this.gridOffsetY,
          this.gridSize - 4,
          this.gridSize - 4,
          6
        );

        // Add yellow highlight stripe
        this.snakeGraphics.fillStyle(0xfaca79, 0.4);
        this.snakeGraphics.fillRect(
          this.gridOffsetX + segment.x * this.gridSize + 6,
          segment.y * this.gridSize + this.gridSize / 2 - 1 + this.gridOffsetY,
          this.gridSize - 12,
          3
        );

        // Add sausage link lines with yellow accent
        this.snakeGraphics.lineStyle(2, 0xfaca79, 0.7);
        this.snakeGraphics.strokeRoundedRect(
          this.gridOffsetX + segment.x * this.gridSize + 2,
          segment.y * this.gridSize + 2 + this.gridOffsetY,
          this.gridSize - 4,
          this.gridSize - 4,
          6
        );
      }
    });
  }

  drawFood() {
    this.foodGraphics.clear();

    // Draw retro pellet
    this.foodGraphics.fillStyle(0xfaca79, 1);
    this.foodGraphics.fillCircle(
      this.gridOffsetX + this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2 + this.gridOffsetY,
      this.gridSize / 3
    );

    // Retro outline
    this.foodGraphics.lineStyle(2, 0x6ac6be, 1);
    this.foodGraphics.strokeCircle(
      this.gridOffsetX + this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2 + this.gridOffsetY,
      this.gridSize / 3
    );
  }

  endGame() {
    if (this.gameOver) return; // Prevent multiple calls
    this.gameOver = true;

    console.log('Game Over! Score:', this.score);

    // Shake camera immediately for fluid feel
    this.cameras.main.shake(200, 0.01);

    // Update high score
    const highScore = parseInt(localStorage.getItem('wienerSnakeHighScore') || 0);
    if (this.score > highScore) {
      localStorage.setItem('wienerSnakeHighScore', this.score.toString());
    }

    // Submit score to leaderboard in background (non-blocking)
    if (this.score > 0) {
      // Get player name from localStorage or generate one
      let playerName = localStorage.getItem('wienerSnakePlayerName');

      if (!playerName) {
        // Generate a random player name
        const adjectives = ['Hot', 'Cool', 'Super', 'Mega', 'Ultra', 'Epic', 'Wild', 'Crazy'];
        const nouns = ['Dog', 'Sausage', 'Wiener', 'Link', 'Frank', 'Brat'];
        playerName = `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${Math.floor(Math.random() * 999)}`;
        localStorage.setItem('wienerSnakePlayerName', playerName);
      }

      // Submit without awaiting (fire and forget)
      supabase
        .from('leaderboard')
        .insert([
          {
            player_name: playerName,
            score: this.score,
            created_at: new Date().toISOString()
          }
        ])
        .then(() => {
          console.log('Score submitted successfully');
        })
        .catch(error => {
          console.error('Error submitting score:', error);
          // Continue even if submission fails
        });
    }

    // Transition to game over after a delay
    const finalScore = this.score;
    this.time.delayedCall(600, () => {
      console.log('Transitioning to GameOver scene with score:', finalScore);
      this.scene.stop('GamePlay');
      this.scene.start('GameOver', { score: finalScore });
    });
  }
}
