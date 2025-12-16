# Sprite Generation Prompts for NEW-WIENER-SNAKE

## 🌭 Sausage Snake Head Sprites

### General Guidelines for All Prompts:
- Style: Retro pixel art, 8-bit/16-bit game aesthetic
- Size: 32x32 pixels
- No anti-aliasing, sharp pixel edges
- Transparent background
- Color palette: coral (#f47d59), red (#dd5342), brown (#754938), yellow (#faca79), teal (#6ac6be)

---

## Snake Head - Facing Right

```
A retro pixel art sprite of a cute sausage snake head facing right, 32x32 pixels, 8-bit video game style. The sausage is coral orange color (#f47d59) with a darker red-brown outline (#dd5342). Two small round brown eyes (#754938) positioned on the side facing the viewer. Add a yellow (#faca79) horizontal stripe or highlight across the middle of the sausage. The sausage has slight segmented texture lines. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic, centered in frame, viewed from top-down perspective like classic Snake game.
```

**Alternative shorter version:**
```
32x32 pixel art sausage snake head facing right, coral orange (#f47d59) with yellow stripe (#faca79), brown eyes, retro 8-bit game style, transparent background, top-down view, no anti-aliasing
```

---

## Snake Head - Facing Left

```
A retro pixel art sprite of a cute sausage snake head facing left, 32x32 pixels, 8-bit video game style. The sausage is coral orange color (#f47d59) with a darker red-brown outline (#dd5342). Two small round brown eyes (#754938) positioned on the side facing the viewer. The sausage has slight segmented texture lines. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic, centered in frame, viewed from top-down perspective like classic Snake game.
```

**Alternative shorter version:**
```
32x32 pixel art sausage snake head facing left, coral orange (#f47d59), brown eyes, retro 8-bit game style, transparent background, top-down view, no anti-aliasing
```

---

## Snake Head - Facing Up

```
A retro pixel art sprite of a cute sausage snake head facing up/north, 32x32 pixels, 8-bit video game style. The sausage is coral orange color (#f47d59) with a darker red-brown outline (#dd5342). Two small round brown eyes (#754938) positioned on the front/top end of the sausage. The sausage has slight segmented texture lines. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic, centered in frame, viewed from top-down perspective like classic Snake game.
```

**Alternative shorter version:**
```
32x32 pixel art sausage snake head facing up, coral orange (#f47d59), brown eyes on front, retro 8-bit game style, transparent background, top-down view, no anti-aliasing
```

---

## Snake Head - Facing Down

```
A retro pixel art sprite of a cute sausage snake head facing down/south, 32x32 pixels, 8-bit video game style. The sausage is coral orange color (#f47d59) with a darker red-brown outline (#dd5342). Two small round brown eyes (#754938) positioned on the front/bottom end of the sausage. The sausage has slight segmented texture lines. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic, centered in frame, viewed from top-down perspective like classic Snake game.
```

**Alternative shorter version:**
```
32x32 pixel art sausage snake head facing down, coral orange (#f47d59), brown eyes on front, retro 8-bit game style, transparent background, top-down view, no anti-aliasing
```

---

## 🌭 Sausage Body Segments

### Body Segment 1 (Red)

```
A retro pixel art sprite of a sausage body segment, 32x32 pixels, 8-bit style. Solid red sausage (#dd5342) with a yellow (#faca79) horizontal stripe or highlight across the middle. Add yellow (#faca79) segmentation lines at top and bottom to show sausage links. Simple, rounded rectangle shape. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic, top-down view.
```

**Shorter:**
```
32x32 pixel art sausage body segment, red (#dd5342) with yellow stripe (#faca79), yellow link lines, retro 8-bit, transparent background, top-down view
```

---

### Body Segment 2 (Coral)

```
A retro pixel art sprite of a sausage body segment, 32x32 pixels, 8-bit style. Solid coral orange sausage (#f47d59) with a yellow (#faca79) horizontal stripe or highlight across the middle. Add yellow (#faca79) segmentation lines at top and bottom to show sausage links. Simple, rounded rectangle shape. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic, top-down view.
```

**Shorter:**
```
32x32 pixel art sausage body segment, coral (#f47d59) with yellow stripe (#faca79), yellow link lines, retro 8-bit, transparent background, top-down view
```

---

## 🟡 Food Pellet

```
A retro pixel art sprite of a round food pellet, 32x32 pixels, 8-bit style. Bright yellow (#faca79) circular pellet with teal (#6ac6be) outline, glowing appearance. Simple geometric circle, centered. Clean pixel art, transparent background, no anti-aliasing, sharp edges, classic arcade game aesthetic like Pac-Man pellets.
```

**Shorter:**
```
32x32 pixel art food pellet, yellow (#faca79), teal outline, round, retro 8-bit style, transparent background
```

---

## 🎨 Tips for Best Results:

### Using AI Image Generators:

1. **DALL-E 3 / ChatGPT:**
   - Use the full detailed prompts
   - Add "exactly 32x32 pixels" for emphasis
   - Request PNG with transparency

2. **Midjourney:**
   - Use shorter prompts
   - Add parameters: `--v 6 --style raw --ar 1:1`
   - Upscale and crop to exact 32x32px afterward

3. **Stable Diffusion:**
   - Use detailed prompts
   - Add to negative prompt: "anti-aliasing, blurry, smooth, gradient, 3D, realistic"
   - Use ControlNet with pixel art model if available

4. **Bing Image Creator:**
   - Use medium-length prompts
   - Works well with "retro video game sprite" keywords

---

## 📐 Post-Generation Steps:

1. **Resize to exact 32x32px** if generator created larger
2. **Remove anti-aliasing** using pixel art tools:
   - Aseprite: Image → Mode → Indexed
   - GIMP: Image → Mode → Indexed
   - Photoshop: Image → Mode → Indexed Color
3. **Ensure transparent background** (PNG format)
4. **Apply color palette** if colors are off:
   - Replace similar colors with exact hex values
5. **Export as PNG** with transparency enabled

---

## 🛠️ Manual Pixel Art Alternative:

If AI generators aren't working well, here's a simple template you can follow:

### Snake Head (Right-facing) - ASCII Template:
```
. . . . . . . . T T T T T T . .
. . . . . T T T O O O O O T T .
. . . T T O O O O O O O O O T T
. . T O O O O O O O O O O O O T
. T O O O O O O O O O O O O O T
T O O O O E E O O O O O O O O T
T O O O O E E O O O O O O O O T
T O O O O O O O O O O O O O O T
T O O O O O O O O O O O O O O T
. T O O O O O O O O O O O O T .
. . T T O O O O O O O O O T . .
. . . . T T T T T T T T T . . .

Legend:
O = Coral (#f47d59)
T = Red outline (#dd5342)
E = Brown eyes (#754938)
. = Transparent
```

---

## 🎯 Recommended Approach:

**Easiest:**
1. Use ChatGPT (DALL-E 3) with detailed prompts
2. Download 1024x1024 version
3. Scale down to 32x32px in Aseprite/Photoshop
4. Convert to indexed color mode
5. Clean up and adjust colors

**Best Quality:**
1. Draw manually in Aseprite or Piskel
2. Follow the color palette exactly
3. 32x32px canvas from the start
4. Export as PNG with transparency

**Quick Test:**
1. Use Piskel.com (free, web-based)
2. 32x32 canvas
3. Draw simple sausage shape
4. Add eyes and outline
5. Export PNG

---

## Example Prompt for Testing (Copy-Paste Ready):

```
Create a pixel art sprite for a retro video game. The sprite is a cute sausage snake head facing right, exactly 32x32 pixels in size. The sausage should be coral orange color (#f47d59 hex) with a bright yellow (#faca79) horizontal stripe across the middle. It has a darker red outline (#dd5342). Two small round brown eyes (#754938) are visible on the side. The style should be 8-bit retro arcade game graphics with sharp pixel edges, no anti-aliasing, and a transparent background. Top-down perspective like classic Snake game.
```

