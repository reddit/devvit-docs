# Launch Screen Customization

## Creating Your Launch (Preview) Screen

Create an HTML file that serves as your app's launch screen in inline mode. This is what users see immediately when they encounter your post. Templates include a performant and compliant preview screen.

```html title="preview.html"
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Game</title>
    <script src="preview.js"></script>
  </head>
  <body>
    <div class="preview-container">
      <h1>Adventure Game</h1>
      <p>Tap to play in fullscreen</p>
      <button id="play-button">Play Now</button>
    </div>
  </body>
</html>
```

```tsx title="preview.js"
import { requestExpandedMode } from '@devvit/web/client';

document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('play-button');

  playButton.addEventListener('click', (event) => {
    try {
      requestExpandedMode(event, 'game');
    } catch (error) {
      console.error('Failed to enter expanded mode:', error);
    }
  });
});
```

## API Reference

### requestExpandedMode()

Requests expanded mode for the web view. This displays the web view in a larger modal presentation on web and full screen on mobile.

```tsx
import { requestExpandedMode } from '@devvit/web/client';

// Must be called synchronously from a trusted click event.
requestExpandedMode(event, 'game');
```

**Parameters**

- `event` (MouseEvent): The trusted `click` event that triggered the request
- `entry` (string): The destination URI name (e.g., `splash` or `game`). Entry names are the `devvit.json post.entrypoints` keys

### getWebViewMode()

Get the current web view mode state.

```tsx
import { getWebViewMode } from '@devvit/web/client';

const currentMode = getWebViewMode(); // Returns 'inline' | 'expanded'

if (currentMode === 'expanded') {
  // Show expanded UI
} else {
  // Show inline UI
}
```

### Returning to inline mode

The legacy `addWebViewModeListener()` and `removeWebViewModeListener()` APIs are deprecated. Listen for the window `focus` event to detect when an expanded web view returns to inline mode, then read the current mode again.

```tsx
import { getWebViewMode } from '@devvit/web/client';

function useWebViewMode() {
  const [mode, setMode] = useState(getWebViewMode());

  useEffect(() => {
    const handleFocus = () => setMode(getWebViewMode());

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  return mode;
}
```

## Complete Example

```tsx title="game.tsx"
import React, { useState, useEffect } from 'react';
import {
  getWebViewMode,
  requestExpandedMode,
  exitExpandedMode,
} from '@devvit/web/client';

export function GameApp() {
  const [mode, setMode] = useState(getWebViewMode());
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const handleFocus = () => {
      const nextMode = getWebViewMode();
      setMode(nextMode);

      // Pause game when returning to inline mode.
      if (nextMode === 'inline' && gameStarted) {
        pauseGame();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [gameStarted]);

  const handlePlayClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      requestExpandedMode(event.nativeEvent, 'game');
      setMode('expanded');
      setGameStarted(true);
    } catch (error) {
      console.error('Could not enter expanded mode:', error);
      // Fallback: start game inline.
      setGameStarted(true);
    }
  };

  const handleExitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    try {
      exitExpandedMode(event.nativeEvent);
    } catch (error) {
      console.error('Could not exit expanded mode:', error);
    }
  };

  if (mode === 'inline') {
    return (
      <div className="inline-view">
        <h2>Adventure Game</h2>
        <p>Tap to play in fullscreen</p>
        <button onClick={handlePlayClick} className="play-button">
          Play Now
        </button>
      </div>
    );
  }

  return (
    <div className="expanded-view">
      <button onClick={handleExitClick} className="exit-button">
        Exit
      </button>
      <GameCanvas />
    </div>
  );
}
```
