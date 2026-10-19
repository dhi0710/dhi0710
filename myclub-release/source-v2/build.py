"""Assemble release.html (highlights) and walkthrough.html (every flow) from shared scenes."""
import json, os
D = os.path.dirname(os.path.abspath(__file__))
S = json.load(open(os.path.join(D, "scenes.json")))

HEAD = """<!doctype html>
<html><head><meta charset="utf-8"><title>{title}</title>
<link rel="stylesheet" href="assets/fonts.css"><link rel="stylesheet" href="common.css"><link rel="stylesheet" href="flows.css">
<style>
.gcard{{flex:1;padding:34px 30px;height:400px}}
.gl{{font-family:Gelasio,Georgia,serif;font-size:72px;color:var(--copper);line-height:1}}
.gt{{font-family:Gelasio,Georgia,serif;font-size:31px;margin-top:22px;line-height:1.2}}
.gd{{font-size:19px;color:var(--muted-d);margin-top:14px;line-height:1.45}}
.gchips{{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}}
.gchips span{{font-size:16px;font-weight:600;padding:5px 12px;border-radius:999px;border:1.5px solid var(--copper);color:var(--copper2)}}
</style></head><body><div id="root">
"""
TAIL = """<div id="fade" class="abs" style="inset:0;background:#000;opacity:0;pointer-events:none"></div>
</div>
<script src="flows/flows.js"></script><script src="hooks.js"></script><script src="engine.js"></script>
</body></html>
"""

def flow(key, speed, hold, **kw):
    extra = "".join(f' data-{k}="{v}"' for k, v in kw.items())
    return f'<section class="scene" data-flow="{key}" data-speed="{speed}" data-hold="{hold}"{extra}></section>\n'

LIVE = """<section class="scene dark" data-dur="3.8" id="live">
  <div class="glow" data-drift="1" style="width:1400px;height:1400px;left:600px;top:-500px"></div>
  <div class="stage"><div class="abs" style="left:180px;top:330px;right:180px">
    <div class="eyebrow" data-in="0.1">See it working</div>
    <h1 data-in="0.3" style="font-size:96px;line-height:1.1;margin-top:26px">Real flows, recorded <span class="copper it">on qlub.</span></h1>
    <div class="p" data-in="1.0" style="margin-top:40px">Staff terminal on the left, guest phone on the right. Demo merchant: Cafe Bateel.</div>
  </div></div>
</section>
"""

GROUPS = [
  ("A", "Earn after paying", "The guest pays, then scans the QR on the payment screen to earn on that bill.", ["F1", "F2", "F3", "F3B"]),
  ("B", "Join before paying", "Staff identify the guest first, so the bill earns the moment it clears.", ["F1B", "F2B"]),
  ("C", "Redeem, then earn on the rest", "Members take coins off the bill, then earn on what they actually pay.", ["F4B", "F5"]),
  ("D", "Earn from the printed receipt", "No staff step: the QR on the receipt does the work for 24 hours.", ["F4", "F6", "F7", "F7B"]),
  ("E", "Safeguards", "Each receipt earns once, and only within 24 hours of paying.", ["F8", "F9"]),
]
NUM = {k: k[1:] for g in GROUPS for k in g[3]}

def release():
    h = HEAD.format(title="myclub release")
    for sid in ["intro", "hook", "pillars"]: h += S[sid] + "\n"
    h += LIVE
    for k in ["F1", "F2", "F3", "F4"]: h += flow(k, 1.15, 0)
    h += S["coins"] + "\n"
    h += flow("F5", 1.15, 0)
    h += '<section class="scene" data-pair="F8,F9" data-speed="1" data-title="Built-in safeguards, no staff policing."></section>\n'
    for sid in ["tiers", "profile", "dash", "winback", "price", "outro"]: h += S[sid] + "\n"
    return h + TAIL

def walkthrough():
    h = HEAD.format(title="myclub walkthrough")
    h += """<section class="scene dark" data-dur="5" id="wintro">
  <div class="glow" data-drift="1" style="width:1300px;height:1300px;left:-200px;top:-500px"></div>
  <div class="glow" data-drift="-1" style="width:1100px;height:1100px;right:-300px;bottom:-500px"></div>
  <div class="stage"><div class="abs" style="left:0;right:0;top:300px;text-align:center">
    <div class="eyebrow" data-in="0.3">Product walkthrough</div>
    <div class="serif" data-in="0.6" data-y="50" style="font-size:190px;font-weight:500;line-height:1.05;margin-top:24px">my<span class="copper it">club</span></div>
    <div class="p" data-in="1.3" style="margin-top:28px;font-size:34px;color:var(--copper2)">Every guest flow, step by step</div>
    <div class="p" data-in="1.8" style="margin-top:14px;font-size:22px">Recorded on qlub · demo merchant Cafe Bateel</div>
  </div></div>
</section>
"""
    cards = "".join(f"""<div class="card-d gcard" data-in="{0.8+i*0.2:.1f}" data-y="50"><div class="gl">{L}</div><div class="gt">{t}</div><div class="gd">{d}</div>
      <div class="gchips">{''.join(f'<span>{NUM[k]}</span>' for k in ks)}</div></div>""" for i, (L, t, d, ks) in enumerate(GROUPS))
    h += f"""<section class="scene dark" data-dur="8" id="overview">
  <div class="glow" data-drift="1" style="width:1300px;height:1300px;left:-400px;top:300px"></div>
  <div class="stage">
    <div class="abs" style="left:140px;top:150px;right:140px"><div class="eyebrow" data-in="0.1">The map</div>
      <h2 data-in="0.3" style="margin-top:22px">14 flows, five moments.</h2></div>
    <div class="abs row" style="left:140px;right:140px;top:420px;gap:24px">{cards}</div>
  </div>
</section>
"""
    for L, t, d, ks in GROUPS:
        chips = "".join(f'<span class="fchip" style="font-size:22px;padding:9px 20px">Flow {NUM[k]}</span>' for k in ks)
        h += f"""<section class="scene dark" data-dur="3.4" id="sec{L}">
  <div class="glow" data-drift="-1" style="width:1300px;height:1300px;right:-300px;top:-400px"></div>
  <div class="stage"><div class="abs" style="left:180px;top:300px;right:180px">
    <div class="serif copper" data-in="0.1" style="font-size:150px;line-height:1">{L}</div>
    <h1 data-in="0.3" style="font-size:96px;line-height:1.1;margin-top:20px">{t}</h1>
    <div class="p" data-in="0.7" style="margin-top:28px">{d}</div>
    <div class="row" data-in="1.0" style="gap:14px;margin-top:40px">{chips}</div>
  </div></div>
</section>
"""
        for k in ks: h += flow(k, 1, 0.6)
    h += S["outro"] + "\n"
    return h + TAIL

open(os.path.join(D, "release.html"), "w").write(release())
open(os.path.join(D, "walkthrough.html"), "w").write(walkthrough())
print("ok")
