import Phaser from 'phaser';
import { supabase } from '../supabaseClient';

export default class Leaderboard extends Phaser.Scene {
  constructor() {
    super('Leaderboard');
  }

  async create() {
    const { width, height } = this.cameras.main;

    // Retro border decoration
    const graphics = this.add.graphics();
    graphics.lineStyle(4, 0xfaca79, 1);
    graphics.strokeRect(20, 20, width - 40, height - 40);

    // Title
    this.add.text(width / 2, 60, 'LEADERBOARD', {
      fontSize: '32px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // Loading text
    const loadingText = this.add.text(width / 2, height / 2, 'Loading...', {
      fontSize: '16px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79'
    }).setOrigin(0.5);

    // Fetch leaderboard data
    try {
      const { data, error } = await supabase
        .from('leaderboard')
        .select('*')
        .order('score', { ascending: false })
        .limit(10);

      loadingText.destroy();

      if (error) {
        throw error;
      }

      // Display leaderboard entries
      if (data && data.length > 0) {
        let yPos = 120;
        data.forEach((entry, index) => {
          const rank = index + 1;
          const name = entry.player_name || 'Anonymous';
          const score = entry.score;

          // Rank and name
          this.add.text(width / 2 - 200, yPos, `${rank}.`, {
            fontSize: '14px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#faca79'
          });

          this.add.text(width / 2 - 170, yPos, name.substring(0, 15), {
            fontSize: '14px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#f47d59'
          });

          // Score
          this.add.text(width / 2 + 150, yPos, `${score}`, {
            fontSize: '14px',
            fontFamily: '"Press Start 2P", monospace',
            color: '#faca79'
          }).setOrigin(1, 0);

          yPos += 40;
        });
      } else {
        this.add.text(width / 2, height / 2 - 40, 'No scores yet!', {
          fontSize: '16px',
          fontFamily: '"Press Start 2P", monospace',
          color: '#faca79'
        }).setOrigin(0.5);

        this.add.text(width / 2, height / 2, 'Be the first to play!', {
          fontSize: '12px',
          fontFamily: '"Press Start 2P", monospace',
          color: '#f47d59'
        }).setOrigin(0.5);
      }
    } catch (error) {
      loadingText.destroy();

      this.add.text(width / 2, height / 2 - 40, 'Error loading', {
        fontSize: '16px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#dd5342'
      }).setOrigin(0.5);

      this.add.text(width / 2, height / 2, 'leaderboard', {
        fontSize: '16px',
        fontFamily: '"Press Start 2P", monospace',
        color: '#dd5342'
      }).setOrigin(0.5);

      console.error('Error fetching leaderboard:', error);
    }

    // Back button
    const backButton = this.add.text(width / 2, height - 80, 'BACK', {
      fontSize: '20px',
      fontFamily: '"Press Start 2P", monospace',
      color: '#faca79',
      backgroundColor: '#dd5342',
      padding: { x: 24, y: 14 }
    }).setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => {
        this.scene.start('MainMenu');
      });

    // Hover effect
    backButton.on('pointerover', () => {
      backButton.setStyle({ backgroundColor: '#f47d59' });
    });
    backButton.on('pointerout', () => {
      backButton.setStyle({ backgroundColor: '#dd5342' });
    });

    // ESC key to go back
    this.input.keyboard.once('keydown-ESC', () => {
      this.scene.start('MainMenu');
    });
  }
}
