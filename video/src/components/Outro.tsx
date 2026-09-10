import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {QlubMark} from './Chrome';

const PILLARS = [
  {
    k: 'Enrol',
    v: 'At the table, in a browser. Phone number, one code, a name — and a card exists.',
  },
  {
    k: 'Redeem',
    v: 'Coins come off the payable amount before the card is ever tapped. QR scan, or staff lookup with the guest’s consent.',
  },
  {
    k: 'Earn',
    v: 'Credited the moment payment clears, automatically, across every program the guest is enrolled in.',
  },
];

export const Outro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 200, mass: 0.8}});

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 150px',
      }}
    >
      <div
        style={{
          opacity: a,
          transform: `translateY(${interpolate(a, [0, 1], [26, 0])}px)`,
          fontSize: 78,
          fontWeight: 800,
          letterSpacing: -2.8,
          color: C.white,
          textAlign: 'center',
          lineHeight: 1.08,
        }}
      >
        Loyalty Earn &amp; Redeem
        <br />
        <span style={{color: C.purpleLift}}>is live on SoftPOS.</span>
      </div>

      <div style={{display: 'flex', gap: 34, marginTop: 76}}>
        {PILLARS.map((p, i) => {
          const s = spring({frame: frame - 18 - i * 11, fps, config: {damping: 200, mass: 0.8}});
          return (
            <div
              key={p.k}
              style={{
                width: 486,
                opacity: s,
                transform: `translateY(${interpolate(s, [0, 1], [30, 0])}px)`,
                padding: '34px 36px 38px',
                borderRadius: 22,
                background: 'rgba(255,255,255,0.045)',
                border: `1px solid ${C.line}`,
              }}
            >
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: -0.8,
                  color: C.lilac,
                  marginBottom: 16,
                }}
              >
                {p.k}
              </div>
              <div style={{fontSize: 22, lineHeight: 1.55, color: C.mute, fontWeight: 500}}>
                {p.v}
              </div>
            </div>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 82,
          opacity: spring({frame: frame - 58, fps, config: {damping: 200}}),
          display: 'flex',
          alignItems: 'center',
          gap: 18,
        }}
      >
        <span style={{color: C.mute, fontSize: 23, fontWeight: 500, letterSpacing: 2}}>
          Loyalty powered by
        </span>
        <QlubMark size={38} />
      </div>
    </AbsoluteFill>
  );
};
