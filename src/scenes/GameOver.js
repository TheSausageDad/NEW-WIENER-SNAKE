import Phaser from 'phaser';

export default class GameOver extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  init(data) {
    this.finalScore = data.score || 0;
  }

  create() {
    const { width, height } = this.cameras.main;

    // Retro border decoration
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xfaca79, 1);
    graphics.strokeRect(20, 20, width - 40, height - 40);

    // Game Over title with shadow
    this.add.text(width / 2 + 3, height / 3 - 37, 'GAME OVER', {
      fontSize: '40px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#754938'
    }).setOrigin(0.5);
    this.add.text(width / 2, height / 3 - 40, 'GAME OVER', {
      fontSize: '40px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#dd5342'
    }).setOrigin(0.5);

    // Sad sausage emoji
    this.add.text(width / 2, height / 3 + 20, '🌭💔', {
      fontSize: '48px'
    }).setOrigin(0.5);

    // Final score with yellow styling
    this.add.text(width / 2, height / 2 - 30, 'YOUR SCORE', {
      fontSize: '16px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2, `${this.finalScore}`, {
      fontSize: '32px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // High score
    const highScore = localStorage.getItem('wienerSnakeHighScore') || 0;
    const isNewHighScore = this.finalScore >= parseInt(highScore);

    this.add.text(width / 2, height / 2 + 50, 'HI-SCORE', {
      fontSize: '16px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    this.add.text(width / 2, height / 2 + 80, `${highScore}`, {
      fontSize: '24px',
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
    const restartButton = this.add.text(width / 2, height * 2 / 3 + 60, 'RESTART', {
      fontSize: '20px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 24, y: 14 }
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

    // Pulse effect
    this.tweens.add({
      targets: restartButton,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Menu button with yellow
    const menuButton = this.add.text(width / 2, height * 2 / 3 + 120, 'MENU', {
      fontSize: '16px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 20, y: 12 }
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
