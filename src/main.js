import Phaser from 'phaser';
import MainMenu from './scenes/MainMenu';
import GamePlay from './scenes/GamePlay';
import GameOver from './scenes/GameOver';
import Leaderboard from './scenes/Leaderboard';
import { initPlayFun } from './playfun.js';

const config = {
  type: Phaser.AUTO,
  width: 720,
  height: 1280,
  parent: 'game-container',
  backgroundColor: '#754938',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280
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

initPlayFun().catch(err => console.warn('Play.fun init failed:', err));
