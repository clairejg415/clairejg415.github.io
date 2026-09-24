# claire.github.io

Personal site for Claire Jacobs — an illustrated cafe counter, drawn in a
weighted pen-sketch style. Click around the scene to explore.

Live at: https://clairejg415.github.io

## The scene

Four things in the drawing are clickable:

| Object | Opens |
| --- | --- |
| The person on the near stool | About me |
| The rack of mugs | Things I'm into |
| The coffee machine | Projects |
| The cup of coffee on the bar | Say hello |

## How the drawing is made

The illustration is **generated**, not hand-authored. `sketch/nib.py` turns a
centreline plus a width profile into a filled, tapered shape — the way a real
pen stroke thickens under pressure and tapers off at the ends. `sketch/scene.py`
lays the scene out on a perspective grid (eye level y=210, vanishing point off
to the right) where heights come from real dimensions: the bar is 105cm, a stool
seat is 75cm, a seated shoulder is 58cm above the seat. That's what makes the
figures actually sit at the bar rather than float near it.

To change the drawing, edit `sketch/scene.py` and run:

```sh
python3 sketch/scene.py
```

It rewrites the `<main>` block inside `index.html` in place. Everything outside
that block — the panels, styles, and interaction code — is hand-maintained.

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
- `sketch/` — the drawing generator

No build step for the site itself; it's plain HTML/CSS/JS. Push to `main` and
GitHub Pages redeploys.
