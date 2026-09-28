# MOND

A human-centred wearable concept, explainable AI, and a hand-painted browser adventure.

- **Startup website:** https://diamondcao1996.github.io/MOND-game/
- **Play the game:** https://diamondcao1996.github.io/MOND-game/game.html

## Website

`index.html`, `styles.css`, and `app.js` form a responsive English / Chinese product website. Artwork, the supplied MOND logo, product concept and founder photographs are in `assets/`. The wearable is presented as a concept in development. Contact links open the visitor's email app; there is no contact form backend.

The site has no build step, external fonts, analytics, or third-party JavaScript. UI motion respects `prefers-reduced-motion`.

## Game

`game.html` preserves the self-contained adventure and all embedded artwork, audio and scripts. Its home link returns to the startup homepage. Browser saves remain on the same origin.

Jump from the balloon, explore four painted worlds, shelter from weather, outsmart hunters and return to a warm burrow. Each glowing question mark opens one untimed challenge. Discover reasoning riddles, music lessons and a playable piano. Build your burrow, garden, trade and unlock outfits.

### Controls

- A / D or arrow keys: move
- Space: jump; hold to glide
- S / Down: hide or dive
- E: play or distract
- Shift: boost
- F: dig on the ground
- Q: retry a nearby question
- 1-4: choose a riddle answer
- Esc / P: pause or close a panel

Touch controls are available on phones and tablets. Clearing browser storage removes local saves. The game file can also be downloaded and opened offline.

## Preview and publish

Run `python -m http.server 8767` in this directory and open `http://localhost:8767/`.

GitHub Pages publishes from the `main` branch root. `.nojekyll` keeps the site static. No server, account, API key or build step is needed to play.

## Shared wellbeing visit

Choose **Visit your bunny** for rest, music, or gardening. An optional check-in takes priority over physiological suggestions. Every completed shared moment earns a seed, even without a sensor; flowers and fireflies unlock through participation. The adventure pauses during the visit. Progress is saved locally and never decreases for missed days or low readings.

To connect on the same Mac, start recording in the updated HRV Sensor app and click **Open MOND**. In the care panel, expand **Connect your sensor**, click **Connect Mac app**, and keep its localhost connection window open. Quit older app versions first if port 8765 is occupied. The game receives a quality-checked summary; it does not upload measurements or store them in browser saves. Simulated and replay readings are labeled. Browsers must allow the connection popup.

`mond-care.js` and `mond-care.css` now accompany `game.html`; include all three when downloading the game for offline use. Test care rules with `node --test test-mond-care.cjs`. Real browser popup behavior and Bluetooth hardware still require end-to-end verification.
