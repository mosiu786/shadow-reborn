# SHADOW REBORN — playable prototype

A dark-fantasy 2D side-scrolling action platformer built with **Phaser 4.2.1**.

## Run
1. Extract the ZIP.
2. Open `index.html` in a modern browser while connected to the internet.
3. If your browser blocks local scripts, run a local server from this folder:
   - Windows: `py -m http.server 8000`
   - Then open `http://localhost:8000`

The Phaser runtime is loaded from jsDelivr, so the first run requires internet access.

## Controls
- A / D or Left / Right: move
- Space / Up: jump
- J: melee strike
- K: shadow burst (cooldown)
- Enter: start / restart
- Esc: return to title
- Touch: on-screen movement, jump, attack and burst controls

## Included in this prototype
- Procedurally generated hero, wraith, projectile and particle textures
- Multi-layer parallax environment, moon, ruins, drifting motes and atmospheric palette
- Arcade Physics movement, platforms, enemy pursuit, melee and area attack
- Health, score, damage feedback, death and chapter-complete states
- Responsive scaling and touch controls

## Important scope note
This is a playable vertical-slice prototype, not a finished commercial AAA production. It currently uses original procedural placeholder art and synthesized effects rather than a full bespoke animation, music, voice, level-art and QA pipeline. Phaser is the runtime; no server-side game backend is included.
