import Phaser from 'phaser';

export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    // Load banner image with cache busting
    this.load.image('banner', '/assets/banner.png?v=' + Date.now());
  }

  async create() {
    // Wait for fonts to be ready before creating text
    await document.fonts.load('16px "TF Funky Fusion Demo"');
    await document.fonts.load('16px "Baristo"');
    await document.fonts.ready;

    const { width, height } = this.cameras.main;

    // Get current player name
    this.currentPlayerName = localStorage.getItem('wienerSnakePlayerName') || 'Anonymous';

    // Retro border decoration - adjust for mobile
    const graphics = this.add.graphics();
    const isMobile = this.sys.game.device.os.android || this.sys.game.device.os.iOS || this.sys.game.device.os.iPad || this.sys.game.device.os.iPhone;

    if (!isMobile) {
      const borderThickness = 8;
      const borderPadding = 20;
      graphics.lineStyle(borderThickness, 0xfaca79, 1);
      graphics.strokeRect(borderPadding, borderPadding, width - (borderPadding * 2), height - (borderPadding * 2));
    }

    // Calculate responsive positions
    const bannerY = height * 0.22;
    const hiScoreY = height * 0.42;
    const scoreY = height * 0.48;
    const playerLabelY = height * 0.57;
    const playerNameY = height * 0.60;
    const playButtonY = height * 0.73;
    const leaderboardButtonY = height * 0.84;
    const changeNameButtonY = height * 0.93;

    // Banner image
    const banner = this.add.image(width / 2, bannerY, 'banner');
    banner.setOrigin(0.5);
    // Scale banner to fit nicely
    banner.setScale(0.65);

    // High Score with retro styling
    const highScore = localStorage.getItem('wienerSnakeHighScore') || 0;
    this.add.text(width / 2, hiScoreY, `HI-SCORE`, {
      fontSize: '64px',
      fontFamily: '"TF Funky Fusion Demo", cursive',
      color: '#faca79'
    }).setOrigin(0.5);

    this.add.text(width / 2, scoreY, `${highScore}`, {
      fontSize: '72px',
      fontFamily: '"Baristo", cursive',
      color: '#faca79'
    }).setOrigin(0.5);

    // Player name display (above play button)
    this.add.text(width / 2, playerLabelY, 'PLAYER:', {
      fontSize: '64px',
      fontFamily: '"TF Funky Fusion Demo", cursive',
      color: '#faca79'
    }).setOrigin(0.5);

    // Create container for player name with mixed fonts
    this.playerNameContainer = this.add.container(width / 2, playerNameY);
    this.renderPlayerName(this.currentPlayerName);

    // Play button with yellow
    const playButton = this.add.text(width / 2, playButtonY, 'PLAY', {
      fontSize: '64px',
      fontFamily: '"TF Funky Fusion Demo", cursive',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 50, y: 25 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('GamePlay');
      });

    // Hover effect for play button
    playButton.on('pointerover', () => {
      playButton.setStyle({
        backgroundColor: '#f47d59',
        fontFamily: '"TF Funky Fusion Demo", cursive'
      });
    });
    playButton.on('pointerout', () => {
      playButton.setStyle({
        backgroundColor: '#dd5342',
        fontFamily: '"TF Funky Fusion Demo", cursive'
      });
    });

    // Pulse effect (disabled on mobile to prevent hitbox issues)
    if (!isMobile) {
      this.tweens.add({
        targets: playButton,
        scale: 1.05,
        duration: 800,
        yoyo: true,
        repeat: -1
      });
    }

    // Leaderboard button
    const leaderboardButton = this.add.text(width / 2, leaderboardButtonY, 'LEADERBOARD', {
      fontSize: '48px',
      fontFamily: '"TF Funky Fusion Demo", cursive',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 40, y: 22 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('Leaderboard');
      });

    // Hover effect for leaderboard button
    leaderboardButton.on('pointerover', () => {
      leaderboardButton.setStyle({
        backgroundColor: '#f47d59',
        fontFamily: '"TF Funky Fusion Demo", cursive'
      });
    });
    leaderboardButton.on('pointerout', () => {
      leaderboardButton.setStyle({
        backgroundColor: '#dd5342',
        fontFamily: '"TF Funky Fusion Demo", cursive'
      });
    });

    // Change name button (under PLAY and LEADERBOARD buttons)
    const changeNameButton = this.add.text(width / 2, changeNameButtonY, 'CHANGE NAME', {
      fontSize: '38px',
      fontFamily: '"TF Funky Fusion Demo", cursive',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 35, y: 18 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.showNameInput();
      });

    // Hover effect for change name button
    changeNameButton.on('pointerover', () => {
      changeNameButton.setStyle({
        backgroundColor: '#f47d59',
        fontFamily: '"TF Funky Fusion Demo", cursive'
      });
    });
    changeNameButton.on('pointerout', () => {
      changeNameButton.setStyle({
        backgroundColor: '#dd5342',
        fontFamily: '"TF Funky Fusion Demo", cursive'
      });
    });

    // Start game on space key
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GamePlay');
    });
  }

  renderPlayerName(name) {
    // Clear existing name display
    this.playerNameContainer.removeAll(true);

    // Parse name into segments with different fonts for letters vs numbers
    const segments = [];
    let currentSegment = { text: '', isNumber: false };

    for (let i = 0; i < name.length; i++) {
      const char = name[i];
      const isNumber = /[0-9]/.test(char);

      if (i === 0) {
        currentSegment = { text: char, isNumber };
      } else if (isNumber === currentSegment.isNumber) {
        currentSegment.text += char;
      } else {
        segments.push(currentSegment);
        currentSegment = { text: char, isNumber };
      }
    }
    segments.push(currentSegment);

    // Render each segment with appropriate font
    let totalWidth = 0;
    const textObjects = [];

    segments.forEach(segment => {
      const textObj = this.add.text(0, 0, segment.text, {
        fontSize: '72px',
        fontFamily: segment.isNumber ? '"Baristo", cursive' : '"TF Funky Fusion Demo", cursive',
        color: '#f47d59'
      });
      textObjects.push({ obj: textObj, width: textObj.width });
      totalWidth += textObj.width;
    });

    // Position text objects centered with top alignment
    let xPos = -totalWidth / 2;
    textObjects.forEach(({ obj }, index) => {
      const yOffset = segments[index].isNumber ? -1 : 0; // Move numbers up slightly
      obj.setPosition(xPos, yOffset);
      obj.setOrigin(0, 0); // Align from top
      this.playerNameContainer.add(obj);
      xPos += obj.width;
    });
  }

  showNameInput() {
    // Create HTML input overlay
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';

    const popup = document.createElement('div');
    popup.style.backgroundColor = '#754938';
    popup.style.border = '4px solid #faca79';
    popup.style.borderRadius = '8px';
    popup.style.padding = '30px';
    popup.style.maxWidth = '400px';
    popup.style.width = '90%';

    const title = document.createElement('div');
    title.textContent = 'ENTER YOUR NAME';
    title.style.fontFamily = '"Press Start 2P", monospace';
    title.style.fontSize = '16px';
    title.style.color = '#faca79';
    title.style.marginBottom = '20px';
    title.style.textAlign = 'center';

    const input = document.createElement('input');
    input.type = 'text';
    input.value = this.currentPlayerName;
    input.maxLength = 20;
    input.style.width = '100%';
    input.style.padding = '12px';
    input.style.fontSize = '16px';
    input.style.fontFamily = '"Press Start 2P", monospace';
    input.style.backgroundColor = '#754938';
    input.style.color = '#faca79';
    input.style.border = '2px solid #faca79';
    input.style.borderRadius = '4px';
    input.style.marginBottom = '20px';
    input.style.boxSizing = 'border-box';

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.gap = '10px';
    buttonContainer.style.justifyContent = 'center';

    const saveButton = document.createElement('button');
    saveButton.textContent = 'SAVE';
    saveButton.style.fontFamily = '"Press Start 2P", monospace';
    saveButton.style.fontSize = '14px';
    saveButton.style.padding = '12px 24px';
    saveButton.style.backgroundColor = '#dd5342';
    saveButton.style.color = '#faca79';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'CANCEL';
    cancelButton.style.fontFamily = '"Press Start 2P", monospace';
    cancelButton.style.fontSize = '14px';
    cancelButton.style.padding = '12px 24px';
    cancelButton.style.backgroundColor = '#754938';
    cancelButton.style.color = '#faca79';
    cancelButton.style.border = '2px solid #faca79';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';

    // Button hover effects
    saveButton.onmouseover = () => saveButton.style.backgroundColor = '#f47d59';
    saveButton.onmouseout = () => saveButton.style.backgroundColor = '#dd5342';
    cancelButton.onmouseover = () => cancelButton.style.backgroundColor = '#6d4432';
    cancelButton.onmouseout = () => cancelButton.style.backgroundColor = '#754938';

    // Save button click
    saveButton.onclick = () => {
      const newName = input.value.trim();
      if (newName.length > 0) {
        localStorage.setItem('wienerSnakePlayerName', newName);
        this.currentPlayerName = newName;
        this.renderPlayerName(newName);
      }
      document.body.removeChild(overlay);
    };

    // Cancel button click
    cancelButton.onclick = () => {
      document.body.removeChild(overlay);
    };

    // Enter key to save
    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        saveButton.click();
      }
    };

    buttonContainer.appendChild(saveButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(title);
    popup.appendChild(input);
    popup.appendChild(buttonContainer);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    // Auto-focus and select all text
    setTimeout(() => {
      input.focus();
      input.select();
    }, 100);
  }
}
