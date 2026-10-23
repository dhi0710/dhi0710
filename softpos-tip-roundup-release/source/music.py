"""Original upbeat background track for the release video (synthesised here, so no licence applies).

usage: python3 music.py <duration_seconds> <out.wav>
120 BPM, C - G - Am - F, four-on-the-floor house groove with bass, chord stabs and a pluck hook.
"""
import sys, wave
import numpy as np

SR = 44100
BPM = 120
BEAT = 60 / BPM
BAR = 4 * BEAT
rng = np.random.default_rng(7)

dur = float(sys.argv[1]) if len(sys.argv) > 1 else 57.0
out = sys.argv[2] if len(sys.argv) > 2 else "music.wav"
N = int(dur * SR) + SR
L = np.zeros(N)
R = np.zeros(N)


def hz(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def band(x, lo=0, hi=None):
    """Zero-phase FFT band filter with soft edges."""
    X = np.fft.rfft(x)
    f = np.fft.rfftfreq(len(x), 1 / SR)
    g = np.ones_like(f)
    if lo:
        g *= 1 / (1 + (lo / np.maximum(f, 1)) ** 4)
    if hi:
        g *= 1 / (1 + (f / hi) ** 4)
    return np.fft.irfft(X * g, len(x))


def env(n, a=0.005, d=0.2):
    t = np.arange(n) / SR
    return np.minimum(t / a, 1) * np.exp(-t / d)


def saw(freq, n, detune=0.0):
    t = np.arange(n) / SR
    ph = (t * freq * (1 + detune) + rng.random()) % 1
    return 2 * ph - 1


def add(buf, sig, t0, gain=1.0):
    i = int(t0 * SR)
    if i >= len(buf):
        return
    sig = sig[: len(buf) - i]
    buf[i:i + len(sig)] += sig * gain


def both(sig, t0, gain=1.0, pan=0.0, delay=0.0):
    add(L, sig, t0, gain * (1 - max(pan, 0)))
    add(R, sig, t0 + delay, gain * (1 + min(pan, 0)))


# ---- instruments -------------------------------------------------------
def kick():
    n = int(0.45 * SR)
    t = np.arange(n) / SR
    f = 48 + 90 * np.exp(-t / 0.035)
    body = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.22)
    click = band(rng.standard_normal(n), 1500, 6000) * np.exp(-t / 0.004) * 0.3
    return np.tanh(1.6 * (body + click))


def clap():
    n = int(0.35 * SR)
    t = np.arange(n) / SR
    e = sum(np.where(t >= o, np.exp(-(t - o) / 0.012), 0) for o in (0, 0.011, 0.022))
    e += np.exp(-t / 0.13) * 0.6
    return band(rng.standard_normal(n), 900, 5000) * e * 0.7


def hat(open_=False):
    n = int((0.22 if open_ else 0.06) * SR)
    return band(rng.standard_normal(n), 7000) * env(n, 0.001, 0.07 if open_ else 0.018)


def bass(m, length):
    n = int(length * SR)
    s = saw(hz(m), n) * 0.6 + np.sin(2 * np.pi * hz(m) * np.arange(n) / SR)
    return band(s, 0, 700) * env(n, 0.004, length * 0.7)


def stab(notes, length):
    n = int(length * SR)
    s = sum(saw(hz(m), n, d) for m in notes for d in (-0.006, 0, 0.006))
    return band(s, 200, 3200) * env(n, 0.003, 0.14) / (3 * len(notes))


def pad(notes, length):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = sum(saw(hz(m), n, d) for m in notes for d in (-0.004, 0.004))
    a = np.minimum(t / 0.4, 1) * np.minimum((length - t) / 0.4, 1)
    return band(s, 150, 1400) * np.clip(a, 0, 1) / (2 * len(notes))


def pluck(m, length=0.3):
    n = int(length * SR)
    t = np.arange(n) / SR
    s = np.sign(np.sin(2 * np.pi * hz(m) * t)) * 0.4 + np.sin(2 * np.pi * hz(m) * t)
    return band(s, 300, 5000) * env(n, 0.002, 0.11)


# ---- arrangement -------------------------------------------------------
CHORDS = [(48, [60, 64, 67]), (43, [59, 62, 67]), (45, [60, 64, 69]), (41, [60, 65, 69])]  # C G Am F
HOOK = [  # (16th step, note offset from chord top) one bar pattern
    (0, 0), (3, 2), (6, 4), (8, 2), (10, 0), (12, 2), (14, 4),
]
nbars = int(np.ceil(dur / BAR))
end_hit = dur - 5.6          # last downbeat area before the outro fade
kick_buf = np.zeros(N)

for b in range(nbars):
    t0 = b * BAR
    root, ch = CHORDS[b % 4]
    intro = t0 < 2 * BAR
    outro = t0 >= end_hit
    breakdown = abs(t0 - 21 * BAR) < 0.01      # one bar breather before the setup scene
    both(pad(ch, BAR), t0, 0.55, delay=0.012)
    if outro:
        continue
    for beat in range(4):
        tb = t0 + beat * BEAT
        if not intro and not breakdown:
            add(kick_buf, kick(), tb)
            both(hat(open_=True), tb + BEAT / 2, 0.22, pan=0.2)
            if beat in (1, 3):
                both(clap(), tb, 0.45)
        both(hat(), tb + BEAT / 4, 0.12, pan=-0.3)
        both(hat(), tb + 3 * BEAT / 4, 0.10, pan=-0.3)
        if not intro:
            both(bass(root, BEAT / 2 * 0.9), tb + BEAT / 2, 0.55)
            if beat in (1, 3):
                both(stab([m + 12 for m in ch], 0.25), tb + BEAT / 2, 0.5, delay=0.015)
    hook_on = b >= 4 and not breakdown
    if intro or hook_on:
        for step, off in HOOK:
            m = ch[-1] + 12 + off if intro else ch[min(off // 2, 2)] + 12
            ts = t0 + step * BEAT / 4
            both(pluck(m), ts, 0.28, pan=0.25)
            both(pluck(m), ts + 3 * BEAT / 4, 0.09, pan=-0.35)   # dotted-eighth echo

# final hit, then let the pad ring out
ht = np.ceil(end_hit / BAR) * BAR
add(kick_buf, kick(), ht)
both(stab([60, 64, 67, 72], 1.2) * np.linspace(1, 0, int(1.2 * SR)), ht, 0.5, delay=0.015)
both(clap(), ht, 0.3)

# sidechain-style ducking of everything but the kick
duck = np.ones(N)
kick_env = np.abs(kick_buf) > 0.02
idx = np.flatnonzero(np.diff(kick_env.astype(int)) == 1)
shape = 1 - 0.45 * np.exp(-np.arange(int(0.3 * SR)) / SR / 0.09)
for i in idx:
    seg = duck[i:i + len(shape)]
    duck[i:i + len(shape)] = np.minimum(seg, shape[: len(seg)])
L = L * duck + kick_buf * 0.9
R = R * duck + kick_buf * 0.9

# master: fades, soft clip, normalise
n = int(dur * SR)
L, R = L[:n], R[:n]
t = np.arange(n) / SR
fade = np.clip(t / 0.3, 0, 1) * np.clip((dur - t) / 3.0, 0, 1)
mix = np.stack([L, R], 1) * fade[:, None]
mix = np.tanh(mix / np.max(np.abs(mix)) * 1.4)
mix = mix / np.max(np.abs(mix)) * 0.89
with wave.open(out, "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print(f"wrote {out}: {dur:.1f}s")
