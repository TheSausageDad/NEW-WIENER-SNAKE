import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu';
import GamePlay from './scenes/GamePlay';
import GameOver from './scenes/GameOver';
import Leaderboard from './scenes/Leaderboard';

const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 800,
  parent: 'game-container',
  backgroundColor: '#754938',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 640,
    height: 800,
    min: {
      width: 320,
      height: 400
    },
    max: {
      width: 1280,
      height: 1600
    }
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [MainMenu, GamePlay, GameOver, Leaderboard]
};

const game = new Phaser.Game(config);
