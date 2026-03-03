import MainMenu from './scenes/MainMenu';
import GamePlay from './scenes/GamePlay';
import { initPlayFun } from './playfun.js';

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

initPlayFun().catch(err => console.warn('Play.fun init failed:', err));
