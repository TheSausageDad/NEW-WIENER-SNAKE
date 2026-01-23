export default class MainMenu extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  preload() {
    // Load banner image from Remix hosted URL
    this.load.image('banner', 'https://remix.gg/blob/Y5pXWD1Xm1Ux/home-page-banner-i5JY0uEb9l-VR3BN22Nvj7pOjto9bkaKSFkVTFeL1.webp?QQqL');
  }

  create() {
    const { width, height } = this.cameras.main;

    // Banner image - centered in upper portion
    const banner = this.add.image(width / 2, height * 0.35, 'banner');
    banner.setOrigin(0.5);
    // Scale banner to fit 800x600
    banner.setScale(0.5);

    // Play button
    const playButton = this.add.text(width / 2, height * 0.7, 'PLAY', {
      fontSize: '48px',
      fontFamily: 'Arial, sans-serif',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 40, y: 20 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('GamePlay');
      });

    // Hover effect for play button
    playButton.on('pointerover', () => {
      playButton.setStyle({ backgroundColor: '#f47d59' });
    });
    playButton.on('pointerout', () => {
      playButton.setStyle({ backgroundColor: '#dd5342' });
    });

    // Pulse effect
    this.tweens.add({
      targets: playButton,
      scale: 1.05,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Start game on space key
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('GamePlay');
    });

    // Call Farcade SDK ready when menu is displayed
    if (window.FarcadeSDK) {
      window.FarcadeSDK.singlePlayer.actions.ready();
    }
  }
}
