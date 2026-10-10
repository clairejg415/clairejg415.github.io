# claire.github.io

Personal site for Claire Jacobs: a bar drawn in the style of a Saul Bass poster,
red, black and cream, with a couple at the bar against a red sun. Click around the
scene to explore.

Live at: https://clairejg415.github.io

## The scene

The drawing itself isn't clickable; navigation is the menu (About, Projects,
Writing, Say hello), and each item is its own page. `interests.html` still
exists, but nothing links to it since the bottles stopped being clickable.

The page is laid out as one poster built on the diagonal of the bar: the scene
runs off the top and right edges, and the menu sits on the open floor in big
hand-cut capitals stepping down parallel to the stools. On wide screens (wider than 17:10) the menu instead moves into the
empty strip left of the picture, right-aligned and locked to the window's top
and bottom, leaving the floor open. On screens under 760px wide the menu moves below the picture so it
stays readable.

Accessibility: the menu is a labelled list of real links (44px minimum height,
visible focus ring). All animation stops under prefers-reduced-motion.

## How the drawing is made

The illustration is generated. `sketch/bar.js` lays the bar out with a simple
3D projection (camera at 1.25m, bar receding to the left, real heights for the
bar, stools and drinks) and draws every object as a flat torn-paper shape.
Open `sketch/bar.html` in a browser to see it and copy its SVG markup into the
`<g class="scene">` group in `index.html`.

`sketch/nib.py` and `sketch/scene.py` are the earlier pen-sketch version.
Don't run `scene.py`: it rewrites `<main>` in `index.html` and would replace
the current drawing.

## Editing the content

Open `index.html` and replace anything marked `<!-- TODO -->`:

- Bio text in the **About me** panel
- One-liners for each interest (commerce, culture, resilience, art, technology)
- Project entries and links
- Email and LinkedIn in **Say hello**

## Layout

- `index.html` — page, scene, and panel content
- `style.css` — type, colour, panels, hover states
- `script.js` — opens and closes the panels
- `fonts/` — Para and Post Grotesk
- `sketch/` — the drawing generators (`bar.js` is the current one)

No build step for the site itself; it's plain HTML/CSS/JS. Push to `main` and
GitHub Pages redeploys.
