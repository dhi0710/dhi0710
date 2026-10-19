"""Move each step's start frame to the first big screen change within its segment (labels must not lead footage)."""
import json, os, re, sys
from PIL import Image, ImageChops
D = sys.argv[1]
js = open(os.path.join(D, "flows.js")).read()
M = json.loads(re.search(r"window.FLOWS=(.*);", js, re.S).group(1))
def small(d, k): return Image.open(os.path.join(d, f"{k:05d}.jpg")).convert("L").resize((120, 120))
def changed(a, b):
    diff = ImageChops.difference(a, b).point(lambda v: 255 if v > 24 else 0)
    return sum(diff.histogram()[255:]) / (120 * 120)
for key, fl in M.items():
    d = os.path.join(D, key); n = fl["n"]
    steps = fl["steps"]
    for i in range(1, len(steps)):
        f = steps[i][0]
        seg_end = next(st + c - 1 for st, c in fl["segs"] if st <= f < st + c)
        lim = min(seg_end, f + 27, (steps[i + 1][0] - 3) if i + 1 < len(steps) else n - 1)
        base = small(d, f); best = None
        for k in range(f + 1, lim + 1):
            if changed(base, small(d, k)) > 0.10: best = k; break
        if best: print(f"{key} step{i} {f}->{best} {steps[i][1][:40]}"); steps[i][0] = best
open(os.path.join(D, "flows.js"), "w").write("window.FLOWS=" + json.dumps(M, indent=1) + ";\n")
