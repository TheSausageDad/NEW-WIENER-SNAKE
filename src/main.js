import MainMenu from './scenes/MainMenu';
import GamePlay from './scenes/GamePlay';

const config = {
  type: Phaser.AUTO,
  width: 600,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#754938',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 600,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [MainMenu, GamePlay]
};

const game = new Phaser.Game(config);

// Listen for play_again event from Farcade SDK
if (window.FarcadeSDK) {
  window.FarcadeSDK.singlePlayer.on('play_again', () => {
    const activeScene = game.scene.getScenes(true)[0];
    if (activeScene) {
      activeScene.scene.start('GamePlay');
    }
  });

  window.FarcadeSDK.singlePlayer.on('toggle_mute', (data) => {
    game.sound.mute = data.isMuted;
  });
}
