import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  preload() {
    console.log('GameOver preload started');
    // Load game over banner with cache busting
    this.load.image('gameOverBanner', '/assets/BANNERS/Game-Over.png?v=' + Date.now());

    this.load.once('complete', () => {
      console.log('GameOver assets loaded successfully');
    });

    this.load.once('loaderror', (file) => {
      console.error('GameOver failed to load:', file.src);
    });
  }

  create() {
    const { width, height } = this.cameras.main;

    // Retro border decoration - adjust for mobile
    const graphics = this.add.graphics();
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone;

    if (!isMobile) {
      const borderThickness = 8;
      const borderPadding = 20;
      graphics.lineStyle(borderThickness, 0xfaca79, 1);
      graphics.strokeRect(borderPadding, borderPadding, width - (borderPadding * 2), height - (borderPadding * 2));
    }

    // Game Over banner image
    const banner = this.add.image(width / 2, height / 4 + 20, 'gameOverBanner');
    banner.setOrigin(0.5);
    banner.setScale(0.85);

    // Final score with yellow styling
    this.add.text(width / 2, height / 2 - 40, 'YOUR SCORE', {
      fontSize: '32px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 10, `${this.finalScore}`, {
      fontSize: '48px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // High score
    const highScore = localStorage.getItem('wienerSnakeHighScore') || 0;
    const isNewHighScore = this.finalScore >= parseInt(highScore);

    this.add.text(width / 2, height / 2 + 75, 'HI-SCORE', {
      fontSize: '32px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 125, `${highScore}`, {
      fontSize: '36px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // New high score message
    if (isNewHighScore && this.finalScore > 0) {
      const newHighScoreText = this.add.text(width / 2, height / 2 + 120, 'NEW RECORD!', {
        fontSize: '20px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#faca79'
      }).setOrigin(0.5);

      // Pulse effect
      this.tweens.add({
        targets: newHighScoreText,
        scale: 1.1,
        duration: 500,
        yoyo: true,
        repeat: -1
      });
    }

    // Restart button with yellow
    const restartButton = this.add.text(width / 2, height * 2 / 3 + 120, 'RESTART', {
      fontSize: '44px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 50, y: 26 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('GamePlay');
      });

    // Hover effect for restart button
    restartButton.on('pointerover', () => {
      restartButton.setStyle({ backgroundColor: '#f47d59' });
    });
    restartButton.on('pointerout', () => {
      restartButton.setStyle({ backgroundColor: '#dd5342' });
    });

    // Pulse effect (disabled on mobile to prevent hitbox issues)
    if (!isMobile) {
      this.tweens.add({
        targets: restartButton,
        scale: 1.05,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }

    // Menu button with yellow
    const menuButton = this.add.text(width / 2, height * 2 / 3 + 240, 'MENU', {
      fontSize: '38px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 44, y: 24 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MainMenu');
      });

    // Hover effect for menu button
    menuButton.on('pointerover', () => {
      menuButton.setStyle({ backgroundColor: '#f47d59' });
    });
    menuButton.on('pointerout', () => {
      menuButton.setStyle({ backgroundColor: '#dd5342' });
    });

    // Setup input handlers
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GamePlay');
    });

    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });
  }
}
