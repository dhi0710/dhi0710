"""Cut each recorded flow into a trimmed, cropped 30fps JPEG sequence + a JS manifest.

usage: python3 -I prep_flows.py <uploads_dir> <out_dir>
"""
import glob, json, os, subprocess, sys

UP, OUT = sys.argv[1], sys.argv[2]
H = 960  # output frame height

POS = dict(crop=(110, 55, 1580, 1621))          # 1774x1676 POS + phone recordings
def RC(x, y): return dict(crop=(x, y, 1540, 1480))  # printed receipt + phone recordings

FLOWS = {
 "F1": dict(src="9f9cb7eb", **POS, num="1", who="New to qlub · new member", title="Join after paying, earn on the same bill",
   segs=[(1.5,2.3),(2.6,3.1),(3.8,4.8),(5.2,5.6),(6.9,7.5),(8.2,8.8),(9.1,9.7),(10.4,11.1),(11.5,15.0)],
   steps=[(1.5,"Staff opens the bill: it would earn +233 coins"),(2.6,"Guest pays by card"),(3.8,"Payment screen shows a join-and-earn QR"),
          (5.2,"Guest scans it with their phone"),(8.2,"Enters their phone number"),(9.1,"Verifies the WhatsApp code"),
          (10.4,"Adds a name and creates the card"),(11.5,"+233 coins land on both screens")]),
 "F1B": dict(src="e69f650f", **POS, num="1B", who="New to qlub · new member", title="Sign up before paying, earn the moment the bill clears",
   segs=[(1.1,1.6),(4.8,6.2),(7.5,8.8),(9.3,9.8),(10.3,10.8),(11.2,11.7),(12.0,14.2),(14.9,17.6)],
   steps=[(1.1,"Staff opens the bill"),(4.8,"Taps Add to identify the guest before paying"),(7.5,"Guest scans; the terminal waits for them"),
          (9.3,"Phone number and WhatsApp code"),(11.2,"Adds a name and creates the card"),(12.0,"Terminal shows the verified member: will earn +233"),
          (14.9,"Guest pays; +233 coins land on both screens")]),
 "F2": dict(src="3d8edda5", **POS, num="2", who="Signed in to qlub · new member", title="Already on qlub? Join in one tap after paying",
   segs=[(0.6,1.2),(1.8,2.2),(2.6,3.4),(3.7,4.0),(5.3,9.0)],
   steps=[(0.6,"Staff opens the bill"),(1.8,"Guest pays by card"),(2.6,"Payment screen shows the earn QR"),
          (3.7,"Guest scans, already signed in to qlub"),(5.3,"One tap: Enroll in Bateel coins"),(6.8,"+233 coins land on both screens")]),
 "F2B": dict(src="af333b30", **POS, num="2B", who="Signed in to qlub · new member", title="Enrol in one tap before paying",
   segs=[(0.5,0.9),(4.9,5.8),(6.0,6.3),(7.4,10.2),(13.1,13.5),(14.0,16.9)],
   steps=[(0.5,"Staff opens the bill"),(4.9,"Taps Add to identify the guest before paying"),(6.0,"Guest scans the terminal QR"),
          (7.4,"Signed in to qlub: enrol in one tap"),(9.3,"Terminal shows the verified member: will earn +233"),
          (13.1,"Guest pays"),(14.0,"+233 coins land on both screens")]),
 "F3": dict(src="a64fed82", **POS, num="3", who="Signed in to qlub · existing member", title="Members earn automatically after paying",
   segs=[(1.8,2.4),(2.9,3.3),(3.9,4.5),(5.0,5.3),(6.8,9.0)],
   steps=[(1.8,"Staff opens the bill"),(2.9,"Guest pays by card"),(3.9,"Payment screen shows the earn QR"),
          (5.0,"Member scans, already signed in"),(6.8,"Welcome back: +233, new balance 1,473")]),
 "F3B": dict(src="3c04c49c", **POS, num="3B", who="Signed out of qlub · existing member", title="Signed out? Sign in after paying and still earn",
   segs=[(0.5,1.0),(1.7,2.1),(2.7,3.2),(3.6,4.0),(5.2,5.7),(6.6,7.1),(7.5,7.9),(8.4,11.0)],
   steps=[(0.5,"Staff opens the bill"),(1.7,"Guest pays by card"),(2.7,"Payment screen shows the earn QR"),
          (3.6,"Member scans while signed out of qlub"),(5.2,"Continues with their phone number"),(7.5,"Verifies the WhatsApp code"),
          (8.4,"Recognised: +233, new balance 1,473")]),
 "F4B": dict(src="edf20c7d", **POS, num="4B", who="Signed out of qlub · existing member", title="Sign in, redeem on the bill, earn on what's left",
   segs=[(0.8,1.2),(3.7,4.6),(5.6,6.0),(7.2,7.7),(12.0,12.5),(13.0,13.5),(14.1,15.5),(16.6,17.3),(18.4,19.0),(20.4,22.6),(27.3,28.6),(29.6,30.1),(30.9,33.2)],
   steps=[(0.8,"Staff opens the bill"),(3.7,"Taps Add to identify the guest"),(5.6,"Guest scans the terminal QR"),
          (12.0,"Signs in with phone number and WhatsApp code"),(14.1,"Terminal shows the member: 1,240 coins"),
          (16.6,"Redeem 1,240 coins to save AED 24.80"),(20.4,"Coins come off the bill; both balances update"),
          (27.3,"Bill drops to AED 68.20 and will earn +171"),(29.6,"Guest pays the rest"),(30.9,"+171 coins earned on what they paid")]),
 "F5": dict(src="59d19593", **POS, num="5", who="Signed in to qlub · existing member", title="Redeem in one scan, earn on the rest",
   segs=[(0.9,1.3),(4.4,5.1),(6.3,6.8),(8.0,9.4),(14.2,15.1),(15.6,16.0),(17.6,19.8),(22.6,23.6),(24.3,24.7),(25.3,27.6)],
   steps=[(0.9,"Staff opens the bill"),(4.4,"Taps Add to identify the guest"),(6.3,"Guest scans, already signed in: no code needed"),
          (8.0,"Recognised instantly: 1,240 coins"),(14.2,"Redeem 1,240 coins to save AED 24.80"),(17.6,"Coins come off the bill"),
          (22.6,"Bill drops to AED 68.20 and will earn +171"),(24.3,"Guest pays the rest"),(25.3,"+171 coins earned on what they paid")]),
 "F4": dict(src="db5b66af", **RC(0, 52), num="4", who="New to qlub · new member", title="Scan the receipt, join, earn on the bill you paid",
   segs=[(1.1,1.7),(2.9,3.7),(4.6,5.2),(5.7,6.2),(6.6,7.3),(7.7,8.4),(9.7,12.4)],
   steps=[(1.1,"Guest scans the QR on the printed receipt"),(2.9,"This bill earns 466 coins"),(4.6,"Enters their phone number"),
          (5.7,"Verifies the WhatsApp code"),(6.6,"Adds a name and creates the card"),(9.7,"+466 coins land on the new card")]),
 "F6": dict(src="cf08adae", **RC(0, 22), num="6", who="Signed in to qlub · new member", title="Scan the receipt, enrol in one tap",
   segs=[(0.5,1.0),(2.2,4.1),(5.3,7.6)],
   steps=[(0.5,"Guest scans the QR on the printed receipt"),(2.2,"Signed in to qlub: enrol in one tap"),(5.3,"+466 coins land on the new card")]),
 "F7": dict(src="c6bd1793", **RC(0, 30), num="7", who="Signed in to qlub · existing member", title="Members scan the receipt, coins land in seconds",
   segs=[(2.4,3.0),(4.5,5.4),(7.0,9.8)],
   steps=[(2.4,"Member scans the receipt QR"),(4.5,"Welcome back: balance 1,240"),(7.0,"+466 coins, new balance 1,706")]),
 "F7B": dict(src="0d218c3e", **RC(10, 0), num="7B", who="Signed out of qlub · existing member", title="Signed out? Just a phone number, coins still land",
   segs=[(0.5,1.0),(2.2,3.2),(8.2,8.9),(9.8,10.5),(11.1,15.2)],
   steps=[(0.5,"Member scans the receipt QR"),(2.2,"Signed out: continue with phone number"),(8.2,"Enters their phone number"),
          (9.8,"Verifies the WhatsApp code"),(11.1,"Welcome back: +466, new balance 1,706")]),
 "F8": dict(src="b83be083", **RC(10, 0), num="8", who="Safeguard", title="Each receipt earns once",
   segs=[(0.4,0.9),(2.1,5.0)],
   steps=[(0.4,"Someone scans a receipt that was already used"),(2.1,"Coins already claimed: no double earning")]),
 "F9": dict(src="5740ce50", **RC(10, 0), num="9", who="Safeguard", title="Receipt QR codes last 24 hours",
   segs=[(0.5,1.0),(2.2,5.4)],
   steps=[(0.5,"Someone scans yesterday's receipt"),(2.2,"QR expired: scan within 24 hours of paying")]),
}

manifest = {}
for key, f in FLOWS.items():
    src = glob.glob(os.path.join(UP, f["src"] + "-*.mov"))[0]
    d = os.path.join(OUT, key); os.makedirs(d, exist_ok=True)
    x, y, w, h = f["crop"]
    n = 0; seg_out = []
    for (a, b) in f["segs"]:
        before = len(os.listdir(d))
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", src,
                        "-vf", f"trim=start={a}:end={b},setpts=PTS-STARTPTS,fps=30,crop={w}:{h}:{x}:{y},scale=-2:{H}:flags=lanczos",
                        "-frames:v", str(round((b - a) * 30)),
                        "-q:v", "3", "-start_number", str(n), os.path.join(d, "%05d.jpg")], check=True)
        cnt = len(os.listdir(d)) - before
        seg_out.append((a, b, n, cnt)); n += cnt
    def out_frame(t):
        for a, b, s, c in seg_out:
            if t < b:
                return s + max(0, min(c - 1, round((t - a) * 30)))
        return n - 1
    manifest[key] = dict(n=n, num=f["num"], who=f["who"], title=f["title"],
                         steps=[[out_frame(t), lbl] for t, lbl in f["steps"]],
                         w=round(w * H / h), h=H, segs=[[st, c] for _, _, st, c in seg_out])
    print(key, n, "frames", round(n / 30, 1), "s")

with open(os.path.join(OUT, "flows.js"), "w") as fh:
    fh.write("window.FLOWS=" + json.dumps(manifest, indent=1) + ";\n")
