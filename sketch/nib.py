"""Pen-nib stroke generator: turns a centerline + width profile into a filled
tapered shape, the way a real pen stroke varies with pressure."""
import math


def sample_ellipse(cx, cy, rx, ry, n=72, wobble=0.0, phase=0.0):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        k = 1.0 + wobble * math.sin(3 * a + phase) + 0.6 * wobble * math.sin(5 * a + 1.7)
        pts.append((cx + rx * k * math.cos(a), cy + ry * k * math.sin(a)))
    return pts


def sample_line(p0, p1, n=28, bow=0.0):
    (x0, y0), (x1, y1) = p0, p1
    dx, dy = x1 - x0, y1 - y0
    L = math.hypot(dx, dy) or 1.0
    nx, ny = -dy / L, dx / L
    cx = (x0 + x1) / 2 + nx * bow * 2
    cy = (y0 + y1) / 2 + ny * bow * 2
    pts = []
    for i in range(n + 1):
        t = i / n
        x = (1 - t) ** 2 * x0 + 2 * (1 - t) * t * cx + t ** 2 * x1
        y = (1 - t) ** 2 * y0 + 2 * (1 - t) * t * cy + t ** 2 * y1
        pts.append((x, y))
    return pts


def nib(pts, hw, closed=False):
    """pts: centerline samples. hw: fn(t, x, y) -> half width."""
    n = len(pts)
    outer, inner = [], []
    for i, (x, y) in enumerate(pts):
        if closed:
            px, py = pts[(i - 1) % n]
            qx, qy = pts[(i + 1) % n]
        else:
            px, py = pts[max(i - 1, 0)]
            qx, qy = pts[min(i + 1, n - 1)]
        dx, dy = qx - px, qy - py
        L = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / L, dx / L
        t = i / (n - 1 if n > 1 else 1)
        w = hw(t, x, y)
        outer.append((x + nx * w, y + ny * w))
        inner.append((x - nx * w, y - ny * w))

    def fmt(seq):
        return "L".join(f"{px:.1f} {py:.1f}" for px, py in seq)

    if closed:
        return f"M{fmt(outer)}Z M{fmt(list(reversed(inner)))}Z"
    return f"M{fmt(outer)}L{fmt(list(reversed(inner)))}Z"


def taper(w_max, bias=0.5, power=0.55):
    """Fat in the middle, tapering to points. bias shifts the fat part."""
    def f(t, x=0, y=0):
        u = t ** (math.log(bias) / math.log(0.5)) if 0 < t < 1 else t
        return max(0.05, w_max * (math.sin(math.pi * u) ** power))
    return f


def pressure(w_min, w_max, heavy_at=math.pi / 2):
    """For closed rings: heaviest where the pen bears down."""
    def f(t, x=0, y=0):
        a = 2 * math.pi * t
        return w_min + (w_max - w_min) * max(0.0, math.sin(a - heavy_at + math.pi / 2)) ** 1.3
    return f


def wedge(w_start, w_end):
    def f(t, x=0, y=0):
        return max(0.05, w_start + (w_end - w_start) * t)
    return f


def tremor(pts, amp=1.2, freq=2.0, seed=0.0, closed=False):
    """Smooth hand-waver baked into the centreline, so edges stay crisp."""
    n = len(pts)
    out = []
    for i, (x, y) in enumerate(pts):
        if closed:
            px, py = pts[(i - 1) % n]
            qx, qy = pts[(i + 1) % n]
        else:
            px, py = pts[max(i - 1, 0)]
            qx, qy = pts[min(i + 1, n - 1)]
        dx, dy = qx - px, qy - py
        L = math.hypot(dx, dy) or 1.0
        nx, ny = -dy / L, dx / L
        t = i / (n if closed else (n - 1 if n > 1 else 1))
        f1, f2 = (round(freq), round(freq * 2.3) or 1) if closed else (freq, freq * 2.3)
        d = amp * (0.62 * math.sin(2 * math.pi * f1 * t + seed)
                   + 0.38 * math.sin(2 * math.pi * f2 * t + seed * 1.7 + 1.1))
        out.append((x + nx * d, y + ny * d))
    return out


def smooth(ctrl, closed=True, per=10):
    """Catmull-Rom through control points -> dense centreline."""
    n = len(ctrl)
    pts = []
    rng = range(n) if closed else range(n - 1)
    for i in rng:
        p0 = ctrl[(i - 1) % n] if closed else ctrl[max(i - 1, 0)]
        p1 = ctrl[i % n]
        p2 = ctrl[(i + 1) % n]
        p3 = ctrl[(i + 2) % n] if closed else ctrl[min(i + 2, n - 1)]
        for j in range(per):
            t = j / per
            t2, t3 = t * t, t * t * t
            x = 0.5 * (2 * p1[0] + (-p0[0] + p2[0]) * t
                       + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2
                       + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * (2 * p1[1] + (-p0[1] + p2[1]) * t
                       + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2
                       + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            pts.append((x, y))
    return pts


def by_depth(w_min, w_max, y0, y1):
    """Heavier lower down, the way weight settles in a drawing."""
    def f(t, x=0, y=0):
        u = (y - y0) / (y1 - y0) if y1 != y0 else 0.0
        u = max(0.0, min(1.0, u))
        return w_min + (w_max - w_min) * u
    return f


def fill_path(pts):
    return "M" + "L".join(f"{x:.1f} {y:.1f}" for x, y in pts) + "Z"
