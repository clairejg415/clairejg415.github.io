"""Generates the inked cafe-counter scene and splices it into index.html.

Run:  python3 sketch/scene.py

Perspective grid: eye level y=210, vanishing point off-canvas right (~1647,210).
Heights derive from real dimensions — bar 105cm, stool seat 75cm, seated
shoulder 58cm above the seat — so figures actually sit at the bar.
"""
import math
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from nib import (sample_ellipse, sample_line, nib, taper, pressure, wedge,  # noqa: E402
                 smooth, by_depth, fill_path)

P = []


def ink(d, cls="nib"):
    P.append(f'<path class="{cls}" d="{d}" />')


def shape(d, cls):
    P.append(f'<path class="{cls}" d="{d}" />')


def stroke(p0, p1, w, bow=0.0, n=26, cls="nib"):
    ink(nib(sample_line(p0, p1, n=n, bow=bow), taper(w)), cls)


def limb(p0, p1, w0, w1, bow=0.0, n=22, cls="nib"):
    ink(nib(sample_line(p0, p1, n=n, bow=bow), wedge(w0, w1)), cls)


def ring(cx, cy, rx, ry, w_min, w_max, wobble=0.02, phase=0.0, n=64, cls="nib"):
    pts = sample_ellipse(cx, cy, rx, ry, n=n, wobble=wobble, phase=phase)
    ink(nib(pts, pressure(w_min, w_max), closed=True), cls)


def poly(pts, close=True):
    d = "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts)
    return d + ("Z" if close else "")


def edge(p0, p1, w0, w1, n=40, cls="nib"):
    """Long ruled line with a touch of bow — bar edges, shelf edges."""
    ink(nib(sample_line(p0, p1, n=n, bow=1.4), wedge(w0, w1)), cls)


# ---------------------------------------------------------------- back wall
def mug_rack():
    shape(poly([(262, 138), (620, 157), (620, 166), (250, 150)]), "solid")
    edge((250, 150), (620, 166), 1.6, 1.0)
    edge((262, 138), (620, 157), 1.2, 0.8)
    edge((246, 157), (624, 173), 2.0, 1.2)

    mugs = [(262, 288, 181, 206), (317, 342, 183, 207), (373, 396, 185, 208),
            (428, 449, 187, 209), (483, 503, 189, 209), (538, 556, 190, 210)]
    for i, (x0, x1, y0, y1) in enumerate(mugs):
        cx = (x0 + x1) / 2
        stroke((cx, y0 - 8), (cx, y0), 1.1)
        body = poly([(x0, y0), (x1, y0 + 1), (x1 - 2, y1), (x0 + 2, y1 - 1)])
        shape(body, "hatched" if i % 2 == 0 else "solid")
        limb((x0, y0), (x0 + 2, y1 - 1), 1.5, 1.0, bow=0.6)
        limb((x1, y0 + 1), (x1 - 2, y1), 1.5, 1.0, bow=-0.6)
        stroke((x0, y0), (x1, y0 + 1), 1.4)
        stroke((x0 + 2, y1 - 1), (x1 - 2, y1), 1.8)
        hx = x1
        ink(nib(sample_line((hx, y0 + 6), (hx, y1 - 5), n=14, bow=-4.5),
                taper(1.3)))


def coffee_machine():
    shape(poly([(655, 185), (740, 185), (740, 270), (655, 270)]), "solid")
    shape(poly([(740, 185), (758, 191), (758, 264), (740, 270)]), "hatched")
    shape(poly([(666, 162), (728, 162), (728, 185), (666, 185)]), "solid")
    shape(poly([(728, 162), (744, 168), (744, 183), (728, 185)]), "hatched")

    edge((655, 185), (740, 185), 1.6, 1.6, n=20)
    limb((655, 185), (655, 270), 2.2, 1.6)
    limb((740, 185), (740, 270), 1.4, 1.1)
    edge((655, 270), (740, 270), 2.4, 2.0, n=20)
    limb((740, 185), (758, 191), 1.3, 1.1, n=10)
    limb((758, 191), (758, 264), 1.2, 1.0)
    limb((740, 270), (758, 264), 1.4, 1.1, n=10)

    edge((666, 162), (728, 162), 1.7, 1.5, n=16)
    limb((666, 162), (666, 185), 1.5, 1.3, n=10)
    limb((728, 162), (728, 185), 1.2, 1.1, n=10)
    limb((728, 162), (744, 168), 1.2, 1.0, n=8)
    limb((744, 168), (744, 183), 1.1, 1.0, n=8)

    stroke((664, 198), (698, 198), 1.3)
    ring(710, 198, 4, 4, 0.7, 1.2, n=26)
    ring(724, 198, 4, 4, 0.7, 1.2, n=26, phase=1.2)
    stroke((690, 208), (690, 217), 1.4)

    shape(poly([(676, 222), (710, 222), (714, 246), (672, 246)]), "hatched")
    limb((676, 222), (672, 246), 1.8, 1.5, bow=0.5)
    limb((710, 222), (714, 246), 1.8, 1.5, bow=-0.5)
    stroke((676, 222), (710, 222), 1.5)
    ink(nib(sample_line((672, 246), (714, 246), n=18, bow=2.6), taper(2.2)))
    ink(nib(sample_line((714, 227), (714, 239), n=14, bow=-5.5), taper(1.4)))
    edge((666, 253), (722, 253), 2.2, 2.0, n=18)


# -------------------------------------------------------------------- the bar
def bar():
    shape(poly([(20, 300), (900, 251), (900, 272), (20, 345)]), "solid")
    shape(poly([(20, 345), (900, 272), (900, 330), (20, 448)]), "solid")
    shape(poly([(20, 422), (900, 316), (900, 330), (20, 448)]), "hatched")

    edge((20, 300), (900, 251), 1.5, 0.9, n=70)
    edge((20, 345), (900, 272), 3.2, 1.4, n=70)
    edge((20, 448), (900, 330), 2.6, 1.2, n=70)
    edge((20, 422), (900, 316), 1.3, 0.8, n=70)
    limb((20, 296), (20, 452), 2.2, 2.0, bow=0.8)


def cup():
    P.append('<ellipse class="solid" cx="280" cy="317" rx="26" ry="7" />')
    shape(poly([(264, 296), (296, 296), (293, 312), (266, 312)]), "solid")
    ring(280, 317, 26, 7, 0.9, 2.2, n=48, phase=0.6)
    limb((264, 296), (266, 312), 1.7, 1.3, bow=0.4)
    limb((296, 296), (293, 312), 1.7, 1.3, bow=-0.4)
    stroke((264, 296), (296, 296), 1.6)
    ink(nib(sample_line((296, 300), (296, 309), n=12, bow=-5.0), taper(1.5)))
    ink(nib(sample_line((272, 292), (270, 272), n=14, bow=3.0), taper(1.1)))
    ink(nib(sample_line((288, 292), (290, 272), n=14, bow=-3.0), taper(1.1)))


# ------------------------------------------------------------------- stools
def stool(cx, seat_y, rx, ry, pole_to, foot_y, foot_rx, foot_ry,
          base_y, base_rx, base_ry, seed=0.0):
    P.append(f'<ellipse class="hatched" cx="{cx}" cy="{seat_y}" '
             f'rx="{rx}" ry="{ry}" />')
    ring(cx, seat_y, rx, ry, 0.9, 2.6, wobble=0.015, phase=seed)
    ink(nib(sample_line((cx, seat_y + ry), (cx - 1.5, pole_to), n=30, bow=1.6),
            wedge(2.4, 1.0)))
    stroke((cx - 7, seat_y + ry - 1), (cx + 7, seat_y + ry + 1), 2.2, bow=0.8, n=12)
    ring(cx, foot_y, foot_rx, foot_ry, 0.6, 1.7, wobble=0.03, phase=seed + 0.9)
    ring(cx, base_y, base_rx, base_ry, 0.8, 2.3, wobble=0.02, phase=seed + 2.6)


# ------------------------------------------------------------------ figures
def figure(outline, head, hair, details, y0, y1, hair_fill=False):
    """One coherent seated figure: closed outlines inked with settling weight,
    each backed by a matching occlusion fill so silhouette and ink agree."""
    body = smooth(outline, per=9)
    shape(fill_path(body), "solid")

    hpts = smooth(hair, per=9)
    shape(fill_path(hpts), "solid")

    kpts = smooth(head, per=9)
    shape(fill_path(kpts), "solid")

    ink(nib(body, by_depth(1.3, 3.0, y0, y1), closed=True))
    ink(nib(hpts, by_depth(1.6, 2.9, y0, y1), closed=True))
    ink(nib(kpts, by_depth(1.2, 2.4, y0, y1), closed=True))

    for p0, p1, w, bw in details:
        ink(nib(sample_line(p0, p1, n=16, bow=bw), taper(w)))


def woman():
    """Near figure, back view, right forearm resting on the bar."""
    outline = [
        (135, 292), (156, 300), (170, 312), (178, 326),          # r shoulder
        (192, 336), (214, 330), (222, 333), (216, 343),           # forearm + hand
        (192, 348), (180, 352),                                   # back under arm
        (177, 378), (179, 408), (172, 416),                       # r side to seat
        (98, 416), (91, 408), (93, 378), (90, 352),               # bottom + l side
        (78, 346), (74, 334), (84, 318), (100, 306),              # l arm out
        (116, 298),
    ]
    head = [(135, 247), (148, 253), (152, 268), (147, 285),
            (135, 292), (123, 285), (118, 268), (122, 253)]
    hair = [(135, 241), (154, 249), (160, 270), (163, 306),
            (166, 334), (156, 336), (150, 306), (146, 282),
            (135, 288), (124, 282), (120, 306), (114, 336),
            (104, 334), (107, 306), (110, 270), (116, 249)]
    details = [
        ((112, 344), (142, 350), 1.2, 2.2),
        ((132, 372), (166, 366), 1.1, -2.0),
        ((106, 386), (138, 392), 1.1, 2.0),
        ((128, 292), (128, 302), 1.1, 0.4),
        ((143, 292), (144, 302), 1.1, -0.4),
        ((186, 338), (206, 334), 1.0, 1.6),
    ]
    figure(outline, head, hair, details, 240, 418)


def man():
    """Far figure, back view, elbow on the bar."""
    outline = [
        (565, 272), (580, 279), (590, 288), (596, 300),
        (610, 306), (628, 299), (634, 302), (629, 310),
        (609, 314), (598, 316),
        (595, 336), (596, 352), (590, 359),
        (540, 359), (534, 352), (535, 336), (532, 316),
        (522, 311), (519, 301), (528, 290), (540, 282),
        (552, 277),
    ]
    head = [(565, 231), (576, 236), (580, 249), (575, 264),
            (565, 271), (555, 264), (550, 249), (554, 236)]
    hair = [(565, 227), (579, 233), (584, 250), (583, 262),
            (576, 262), (575, 247), (565, 244), (555, 247),
            (554, 262), (547, 262), (546, 250), (551, 233)]
    details = [
        ((548, 308), (574, 313), 1.1, 1.8),
        ((568, 330), (592, 325), 1.0, -1.6),
        ((551, 275), (565, 286), 1.4, -2.0),
        ((579, 275), (565, 286), 1.4, 2.0),
        ((558, 271), (558, 279), 1.0, 0.3),
        ((572, 271), (573, 279), 1.0, -0.3),
    ]
    figure(outline, head, hair, details, 225, 361)


# -------------------------------------------------------------------- build
def group(label, body_fn, panel=None, aria="", hit=None, lab=None):
    global P
    P = []
    body_fn()
    inner = "\n        ".join(P)
    if panel:
        hx, hy, hw, hh = hit
        lx, ly, lt = lab
        return (f'    <g class="hotspot" data-panel="{panel}" tabindex="0" '
                f'role="button" aria-label="{aria}">\n'
                f'      <rect class="hit" x="{hx}" y="{hy}" width="{hw}" '
                f'height="{hh}" fill="transparent" stroke="none"></rect>\n'
                f'      <g class="ink">\n        {inner}\n      </g>\n'
                f'      <text class="hotspot-label" x="{lx}" y="{ly}" '
                f'text-anchor="middle">{lt}</text>\n    </g>\n')
    return (f'    <!-- {label} -->\n    <g class="decor">\n      <g class="ink">\n'
            f'        {inner}\n      </g>\n    </g>\n')


def main():
    parts = [
        group("rack", mug_rack, "interests",
              "Things I&#39;m into — the rack of mugs",
              (238, 128, 392, 92), (420, 236, "things I&#39;m into")),
        group("machine", coffee_machine, "projects",
              "Projects — the coffee machine",
              (648, 154, 120, 120), (700, 152, "projects")),
        group("bar", bar),
        group("cup", cup, "contact",
              "Say hello — the cup of coffee on the bar",
              (248, 262, 66, 66), (280, 356, "say hello")),
        group("far stool", lambda: stool(565, 345, 35, 11, 434, 406, 18, 5,
                                         440, 22, 6, seed=1.1)),
        group("far figure", man),
        group("middle stool", lambda: stool(360, 368, 42, 13, 470, 436, 21, 6,
                                            478, 27, 7, seed=2.3)),
        group("near stool", lambda: stool(135, 395, 50, 15, 512, 472, 25, 7,
                                          520, 32, 8, seed=0.4)),
        group("near figure", woman, "about", "About me — pull up a stool",
              (72, 236, 168, 312), (135, 552, "about me")),
    ]

    svg = (
        '<main class="room-wrap">\n'
        '  <svg class="room" viewBox="0 0 900 575" '
        'xmlns="http://www.w3.org/2000/svg" role="group" '
        'aria-label="An illustrated cafe counter in perspective. Click the '
        'person at the near stool, the rack of mugs, the coffee machine, or '
        'the cup of coffee to explore.">\n\n'
        '    <defs>\n'
        '      <filter id="sketchy" filterUnits="userSpaceOnUse" x="-120" '
        'y="-120" width="1160" height="840">\n'
        '        <feTurbulence type="fractalNoise" baseFrequency="0.014" '
        'numOctaves="2" seed="11" result="n1" />\n'
        '        <feDisplacementMap in="SourceGraphic" in2="n1" scale="3.5" '
        'xChannelSelector="R" yChannelSelector="G" />\n'
        '      </filter>\n'
        '      <pattern id="hatch" width="6" height="6" '
        'patternUnits="userSpaceOnUse" patternTransform="rotate(45)">\n'
        '        <line x1="0" y1="0" x2="0" y2="6" class="hatch-line" />\n'
        '      </pattern>\n'
        '    </defs>\n\n'
        + "\n".join(parts) +
        '\n  </svg>\n</main>'
    )

    index = os.path.join(os.path.dirname(HERE), "index.html")
    lines = open(index).read().split("\n")
    a = next(i for i, l in enumerate(lines) if l.strip().startswith("<main"))
    b = next(i for i, l in enumerate(lines) if l.strip() == "</main>")
    out = lines[:a] + svg.split("\n") + lines[b + 1:]
    open(index, "w").write("\n".join(out))
    print(f"inked scene -> index.html ({len(svg):,} bytes, "
          f"replaced lines {a + 1}-{b + 1})")


if __name__ == "__main__":
    main()
