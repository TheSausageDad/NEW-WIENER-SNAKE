export default class GamePlay extends Phaser.Scene {
  constructor() {
    super('GamePlay');
  }

  init() {
    // Grid settings - fills 600x600 canvas
    this.gridSize = 40;
    this.gridWidth = 15;
    this.gridHeight = 15;

    this.gridOffsetY = 0;
    this.gridOffsetX = 0;

    // Snake settings
    this.snake = [];
    this.snakeDirection = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.moveDelayHorizontal = 150;
    this.moveDelayVertical = 120;
    this.moveTimer = 0;

    // Game state
    this.score = 0;
    this.food = null;
    this.gameOver = false;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Create grid background
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
    this.gameOver = true;

    // Semi-transparent overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.8);
    overlay.fillRect(0, 0, width, height);

    // Popup background
    const popupWidth = 400;
    const popupHeight = 250;
    const popupBg = this.add.graphics();
    popupBg.fillStyle(0x754938, 1);
    popupBg.fillRoundedRect(width / 2 - popupWidth / 2, height / 2 - popupHeight / 2, popupWidth, popupHeight, 8);
    popupBg.lineStyle(4, 0xfaca79, 1);
    popupBg.strokeRoundedRect(width / 2 - popupWidth / 2, height / 2 - popupHeight / 2, popupWidth, popupHeight, 8);

    // Title
    const title = this.add.text(width / 2, height / 2 - 90, 'HOW TO PLAY', {
      fontSize: '18px',
      fontFamily: 'Arial, sans-serif',
      color: '#faca79'
    }).setOrigin(0.5);

    // Instructions for desktop
    const desktopLabel = this.add.text(width / 2, height / 2 - 40, 'DESKTOP:', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#f47d59'
    }).setOrigin(0.5);

    const desktopText = this.add.text(width / 2, height / 2 - 15, 'Arrow Keys or WASD', {
      fontSize: '10px',
      fontFamily: 'Arial, sans-serif',
      color: '#faca79'
    }).setOrigin(0.5);

    // Instructions for mobile
    const mobileLabel = this.add.text(width / 2, height / 2 + 20, 'MOBILE:', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#f47d59'
    }).setOrigin(0.5);

    const mobileText = this.add.text(width / 2, height / 2 + 45, 'Swipe to Control', {
      fontSize: '10px',
      fontFamily: 'Arial, sans-serif',
      color: '#faca79'
    }).setOrigin(0.5);

    // Start button
    const startButton = this.add.text(width / 2, height / 2 + 90, 'START', {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 20, y: 12 }
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
    const gridOffsetX = (width - this.gridWidth * this.gridSize) / 2;

    // Grid lines
    graphics.lineStyle(1, 0xfaca79, 0.3);

    for (let x = 0; x <= this.gridWidth; x++) {
      graphics.moveTo(gridOffsetX + x * this.gridSize, this.gridOffsetY);
      graphics.lineTo(gridOffsetX + x * this.gridSize, this.gridHeight * this.gridSize + this.gridOffsetY);
    }

    for (let y = 0; y <= this.gridHeight; y++) {
      graphics.moveTo(gridOffsetX, y * this.gridSize + this.gridOffsetY);
      graphics.lineTo(gridOffsetX + this.gridWidth * this.gridSize, y * this.gridSize + this.gridOffsetY);
    }

    graphics.strokePath();

    // Border around grid
    const borderThickness = 4;
    graphics.lineStyle(borderThickness, 0xfaca79, 1);
    graphics.strokeRect(gridOffsetX, this.gridOffsetY, this.gridWidth * this.gridSize, this.gridHeight * this.gridSize);

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

    // Move snake at intervals
    this.moveTimer += delta;
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
      this.spawnFood();

      // Flash effect when eating
      this.cameras.main.flash(100, 250, 202, 121);

      // Haptic feedback via SDK
      if (window.FarcadeSDK) {
        window.FarcadeSDK.singlePlayer.actions.hapticFeedback();
      }
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
        // Head
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

        // Eyes
        this.snakeGraphics.fillStyle(0x754938, 1);
        const eyeSize = Math.floor(this.gridSize / 8);
        const eyeOffset1 = Math.floor(this.gridSize / 3);
        const eyeOffset2 = Math.floor(this.gridSize * 2 / 3);

        if (this.snakeDirection.x !== 0) {
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
        // Body - alternating colors
        const color = index % 2 === 0 ? 0xdd5342 : 0xf47d59;
        this.snakeGraphics.fillStyle(color, 1);
        this.snakeGraphics.fillRoundedRect(
          this.gridOffsetX + segment.x * this.gridSize + 2,
          segment.y * this.gridSize + 2 + this.gridOffsetY,
          this.gridSize - 4,
          this.gridSize - 4,
          6
        );

        // Highlight stripe
        this.snakeGraphics.fillStyle(0xfaca79, 0.4);
        this.snakeGraphics.fillRect(
          this.gridOffsetX + segment.x * this.gridSize + 6,
          segment.y * this.gridSize + this.gridSize / 2 - 1 + this.gridOffsetY,
          this.gridSize - 12,
          3
        );

        // Outline
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

    // Draw pellet
    this.foodGraphics.fillStyle(0xfaca79, 1);
    this.foodGraphics.fillCircle(
      this.gridOffsetX + this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2 + this.gridOffsetY,
      this.gridSize / 3
    );

    // Outline
    this.foodGraphics.lineStyle(2, 0x6ac6be, 1);
    this.foodGraphics.strokeCircle(
      this.gridOffsetX + this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2 + this.gridOffsetY,
      this.gridSize / 3
    );
  }

  endGame() {
    if (this.gameOver) return;
    this.gameOver = true;

    // Shake camera
    this.cameras.main.shake(200, 0.01);

    // Call Farcade SDK gameOver with score - Remix handles the rest
    if (window.FarcadeSDK) {
      window.FarcadeSDK.singlePlayer.actions.gameOver({ score: this.score });
    }
  }
}
