# 🎮 Pong Game

A classic Pong game built with vanilla HTML, CSS, and JavaScript. Play against an intelligent AI opponent with realistic ball physics and collision detection.

## Features

✨ **Game Mechanics**
- Smooth ball physics with realistic bouncing
- Paddle-ball collision detection with spin mechanics
- Wall collision detection
- AI opponent with adjustable difficulty
- Score tracking and win condition (first to 10 points)

🎮 **Controls**
- **Arrow Up/Down** - Move left paddle vertically
- **Mouse Movement** - Smoothly track mouse position for paddle control
- **Start/Pause Button** - Control game state
- **Reset Button** - Reset score to 0-0

🎨 **User Interface**
- Modern gradient design with responsive layout
- Live scoreboard with player vs computer display
- Game instructions included
- Mobile-friendly responsive design
- Visual feedback for game state (paused, scoring)

## How to Play

1. Open `index.html` in your web browser
2. Click the "Start Game" button to begin
3. Control your paddle (left side) using:
   - Arrow keys for precise control
   - Mouse movement for smooth tracking
4. Keep the ball in play and try to score past the computer
5. First to 10 points wins!

## Game Rules

- The player controls the left paddle
- The computer controls the right paddle with AI logic
- The ball bounces off paddles and walls
- When the ball passes a paddle, the opponent scores
- Game ends when either player reaches 10 points
- Ball gains spin based on paddle movement and hit location

## Customization

You can adjust difficulty and game settings by modifying constants in `script.js`:

```javascript
const WIN_SCORE = 10;           // Points needed to win
const PADDLE_SPEED = 6;         // Paddle movement speed
const BALL_SPEED = 5;           // Initial ball speed
const difficulty = 0.06;        // AI difficulty (0-1, higher = harder)
```

## Technical Details

- **Canvas**: 800x400 pixels with responsive scaling
- **Animation**: 60 FPS using `requestAnimationFrame`
- **Collision Detection**: Bounding box collision for paddles, circle-based for walls
- **Ball Physics**: 
  - Reflection off surfaces
  - Spin applied based on paddle velocity
  - Angle variation based on hit location

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design, mouse events adapted

## Files

- `index.html` - Game structure and UI
- `styles.css` - Styling and responsive design
- `script.js` - Game logic and AI opponent
- `README.md` - This file

## License

Free to use and modify for personal or educational purposes.

---

Enjoy the game! 🎉
