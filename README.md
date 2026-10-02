# Story Space

A basic Three.js navigation template inspired by the supplied SBS Story Line screen recording. Original sample content and styling; no SBS assets or source code are included.

## Use
Serve `dist` with any static web server. Three.js r180 is vendored locally; no API keys or runtime CDN are required.

- Drag with mouse or one finger to rotate the cylindrical story space, with inertia.
- Scroll, pinch, or use + / − to zoom.
- Hover to reveal a name; click to focus and open a story.
- Arrow keys navigate when the scene has focus; Home resets the camera.
- Story index provides a keyboard-accessible text alternative.
- Reduced-motion settings disable inertia and animated focus.

## Customise
- `dist/stories.js`: titles, quotes, author, place, body; add an optional `image` path to replace a title panel with a photo.
- `dist/app.js`: camera distance, cylinder radius, drag sensitivity, damping, layout, and focus behaviour.
- `dist/style.css`: interface colours, fonts, responsive layout.

This prototype approximates motion from the recording. It is not a frame-exact recreation. The sample content is fictional. It contains no audio playback or content management system. Validation covers static entrypoints, imports, and JavaScript syntax; browser interaction QA has not been performed.

Three.js copyright and licence are retained in the vendored sources and THREE-LICENSE.txt.
