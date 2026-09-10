import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import {QlubMark} from './Chrome';

export const Title: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 200, mass: 0.8}});
  const b = spring({frame: frame - 16, fps, config: {damping: 200, mass: 0.9}});
  const c = spring({frame: frame - 34, fps, config: {damping: 200, mass: 0.9}});
  const out = interpolate(frame, [durationInFrames - 14, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        fontFamily: FONT,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: out,
      }}
    >
      <div style={{opacity: a, transform: `translateY(${interpolate(a, [0, 1], [22, 0])}px)`}}>
        <QlubMark size={66} />
      </div>

      <div
        style={{
          marginTop: 46,
          opacity: b,
          transform: `translateY(${interpolate(b, [0, 1], [30, 0])}px)`,
          fontSize: 124,
          fontWeight: 800,
          letterSpacing: -4.6,
          lineHeight: 1.02,
          color: C.white,
          textAlign: 'center',
        }}
      >
        Loyalty.
        <br />
        <span
          style={{
            background: `linear-gradient(96deg, ${C.lilac}, ${C.purpleLift} 62%, ${C.lilac})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Earn &amp; Redeem.
        </span>
      </div>

      <div
        style={{
          marginTop: 44,
          opacity: c,
          transform: `translateY(${interpolate(c, [0, 1], [20, 0])}px)`,
          display: 'flex',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <span
          style={{
            padding: '12px 24px',
            borderRadius: 999,
            border: `1px solid rgba(148,54,232,0.55)`,
            background: 'rgba(112,0,204,0.2)',
            color: C.lilac,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: 2.6,
            textTransform: 'uppercase',
          }}
        >
          Now live on SoftPOS
        </span>
      </div>

      <div
        style={{
          marginTop: 30,
          opacity: c * 0.75,
          color: C.mute,
          fontSize: 23,
          fontWeight: 500,
          letterSpacing: 0.6,
        }}
      >
        Enrol, redeem and earn — inside the bill your staff already has open.
      </div>
    </AbsoluteFill>
  );
};
