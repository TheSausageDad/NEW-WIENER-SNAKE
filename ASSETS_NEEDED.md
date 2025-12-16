# NEW-WIENER-SNAKE Assets List

## Art Style Guidelines
- **Style**: Retro pixel art (8-bit/16-bit aesthetic)
- **Resolution**: 32x32px for game objects (to match grid size)
- **Color Palette**:
  - `#f47d59` - Coral (main highlights, sausage head)
  - `#dd5342` - Red (borders, sausage body)
  - `#6ac6be` - Teal (interactive elements)
  - `#754938` - Brown (background, shadows)
  - `#faca79` - Yellow (food, scores)

---

## 🎨 Visual Assets

### 1. Snake Sprites (32x32px each)
- [ ] **Sausage Head** - 4 variations (one for each direction)
  - `sausage-head-up.png`
  - `sausage-head-down.png`
  - `sausage-head-left.png`
  - `sausage-head-right.png`
  - Should have eyes/face indicating direction
  - Use coral (#f47d59) as base color

- [ ] **Sausage Body Segments** - 2 variations for alternating pattern
  - `sausage-body-1.png` (red #dd5342)
  - `sausage-body-2.png` (coral #f47d59)
  - Add sausage texture/links

- [ ] **Sausage Tail** - Optional, could have rounded end
  - `sausage-tail.png`

### 2. Food Sprites (32x32px)
- [ ] **Standard Pellet**
  - `food-pellet.png` (yellow #faca79)
  - Simple circular/square food item

- [ ] **Special Food** (for future power-ups)
  - `food-mustard.png` - Speed boost
  - `food-ketchup.png` - Bonus points
  - `food-bun.png` - Special ability

### 3. UI Elements
- [ ] **Logo/Title** (400x200px)
  - `logo.png` - Main game logo with sausage theme
  - Retro pixel font style

- [ ] **Buttons** (Various sizes)
  - `btn-up.png`, `btn-down.png`, `btn-left.png`, `btn-right.png` (D-pad)
  - `btn-start.png`, `btn-restart.png`, `btn-menu.png`
  - Size: 60x60px for D-pad

- [ ] **Icons** (32x32px)
  - `icon-score.png` - Score indicator
  - `icon-highscore.png` - Trophy/medal
  - `icon-sound-on.png`, `icon-sound-off.png`

### 4. Background Elements
- [ ] **Grid Pattern**
  - `grid-tile.png` (32x32px) - Optional textured tile
  - Brown background with subtle pattern

- [ ] **Decorative Elements**
  - `border-corner.png` - Retro border decorations
  - `particle-eat.png` - Small particles when eating food (16x16px)

---

## 🔊 Sound Effects

### 1. Gameplay Sounds
- [ ] `sfx-eat.wav` - When snake eats food
  - Short, satisfying "chomp" or "nom" sound
  - 0.1-0.2 seconds

- [ ] `sfx-move.wav` - Optional subtle movement sound
  - Very quiet, rhythmic tick
  - 0.05 seconds

- [ ] `sfx-turn.wav` - When snake changes direction
  - Quick directional blip
  - 0.05 seconds

- [ ] `sfx-game-over.wav` - Death/collision sound
  - Descending tone, retro "ouch"
  - 0.5-1.0 seconds

- [ ] `sfx-highscore.wav` - New high score achievement
  - Celebratory fanfare
  - 1-2 seconds

### 2. UI Sounds
- [ ] `sfx-button-press.wav` - Button/menu click
  - Short blip
  - 0.05 seconds

- [ ] `sfx-start.wav` - Game start sound
  - Uplifting beep/jingle
  - 0.3-0.5 seconds

---

## 🎵 Music

### 1. Background Music (Looping)
- [ ] `music-menu.mp3` - Main menu theme
  - Upbeat, retro chiptune
  - 30-60 seconds loop
  - Should fit sausage/food theme

- [ ] `music-gameplay.mp3` - In-game background music
  - Energetic, not distracting
  - 60-90 seconds loop
  - Gradually increase tempo as snake grows (optional)

- [ ] `music-game-over.mp3` - Game over theme
  - Sad/dramatic retro tune
  - 10-20 seconds, no loop

---

## 📝 Fonts

### Current: Using Google Fonts
- "Press Start 2P" (loaded via CDN)

### Optional Custom Fonts
- [ ] `pixel-font.ttf` - Custom pixel/bitmap font
  - For scores and UI text
  - Should match retro aesthetic

---

## 📱 Icons & Meta Assets

### 1. App Icons
- [ ] `favicon.ico` (16x16, 32x32, 48x48)
  - Small sausage icon

- [ ] `icon-192.png` (192x192px) - PWA icon
- [ ] `icon-512.png` (512x512px) - PWA icon
  - Full color sausage logo

### 2. Social/Meta Images
- [ ] `og-image.png` (1200x630px) - Open Graph image
  - Game screenshot or logo for social sharing

- [ ] `apple-touch-icon.png` (180x180px)
  - iOS home screen icon

---

## 🎯 Priority Levels

### High Priority (Core Gameplay)
1. Snake head sprites (4 directions)
2. Snake body sprites (2 variations)
3. Food pellet sprite
4. Eat sound effect
5. Game over sound effect

### Medium Priority (Polish)
1. UI button sprites
2. Background music (gameplay)
3. Logo/title image
4. High score sound
5. Menu music

### Low Priority (Enhancement)
1. Special food sprites
2. Movement/turn sounds
3. Decorative elements
4. Particle effects
5. Game over music

---

## 📐 File Format Specifications

### Images
- **Format**: PNG (with transparency)
- **Color Mode**: Indexed color (for authentic pixel art)
- **Scaling**: Design at exact size (32x32), no anti-aliasing
- **Export**: 2x versions for retina displays optional

### Audio
- **Sound Effects**: WAV or MP3, 44.1kHz, mono/stereo
- **Music**: MP3 or OGG, 44.1kHz, stereo
- **Size**: Keep under 100KB per sound effect, under 1MB per music track

---

## 🛠️ Tools for Creating Assets

### Pixel Art
- **Aseprite** (paid) - Industry standard for pixel art
- **Piskel** (free, web-based) - Simple pixel art editor
- **GraphicsGale** (free) - Good for animations
- **GIMP** (free) - General purpose with pixel art support

### Sound Effects
- **BFXR** (free, web-based) - Retro game sound generator
- **ChipTone** (free, web-based) - Chiptune sound maker
- **Audacity** (free) - Audio editing

### Music
- **BeepBox** (free, web-based) - Chiptune music composer
- **FamiStudio** (free) - NES-style music maker
- **Bosca Ceoil** (free) - Simple music creation tool

---

## 📦 Asset Organization

```
assets/
├── sprites/
│   ├── snake/
│   │   ├── head-up.png
│   │   ├── head-down.png
│   │   ├── head-left.png
│   │   ├── head-right.png
│   │   ├── body-1.png
│   │   └── body-2.png
│   ├── food/
│   │   ├── pellet.png
│   │   ├── mustard.png
│   │   └── ketchup.png
│   └── ui/
│       ├── logo.png
│       └── buttons/
│           ├── up.png
│           ├── down.png
│           ├── left.png
│           └── right.png
├── audio/
│   ├── sfx/
│   │   ├── eat.wav
│   │   ├── game-over.wav
│   │   └── highscore.wav
│   └── music/
│       ├── menu.mp3
│       └── gameplay.mp3
└── fonts/
    └── pixel-font.ttf
```

---

## ✅ Next Steps

1. Start with high-priority assets
2. Use color palette consistently across all assets
3. Keep file sizes small for web performance
4. Test assets in-game at actual size (32x32px)
5. Create sprite sheets for animations if needed
6. Optimize images (use tools like TinyPNG)
7. Compress audio files appropriately

---

**Note**: Currently the game uses programmatic graphics (Phaser's graphics API). Assets can be added incrementally without breaking existing functionality.
