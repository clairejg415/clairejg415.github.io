# claire.github.io

Personal site for Claire Jacobs: a bar drawn in the style of a Saul Bass poster,
red, black and cream, with a couple at the bar against a red sun. Click around the
scene to explore.

Live at: https://clairejg415.github.io

## The scene

Four things in the drawing are clickable:

| Object | Opens |
| --- | --- |
| The empty stool nearest you | About me |
| The bottles on the backbar | Things I'm into |
| The TV over the bar | Projects |
| The coupe on the bar | Say hello |

The menu beside the picture (About, Projects, Writing, Say hello) opens the
same panels, plus a Writing panel. Each menu word is set in hand-cut capitals:
every letter carries a small `--r` rotation and `--y` offset in `index.html`.

The clickable areas are the `.hotspot` groups at the end of the `<svg>` in
`index.html`, drawn on top of the picture.

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
