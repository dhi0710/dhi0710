import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';

export const ChapterCard: React.FC<{num: string; name: string; kicker: string}> = ({
  num,
  name,
  kicker,
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const a = spring({frame, fps, config: {damping: 200, mass: 0.6}});
  const b = spring({frame: frame - 7, fps, config: {damping: 200, mass: 0.7}});
  const out = interpolate(frame, [durationInFrames - 10, durationInFrames], [1, 0], {
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
      <div style={{display: 'flex', alignItems: 'baseline', gap: 34}}>
        <span
          style={{
            fontSize: 190,
            fontWeight: 800,
            letterSpacing: -8,
            lineHeight: 1,
            color: 'transparent',
            WebkitTextStroke: `2px ${C.purpleLift}`,
            opacity: a,
            transform: `translateX(${interpolate(a, [0, 1], [-40, 0])}px)`,
          }}
        >
          {num}
        </span>
        <div
          style={{
            opacity: b,
            transform: `translateX(${interpolate(b, [0, 1], [36, 0])}px)`,
          }}
        >
          <div
            style={{
              fontSize: 92,
              fontWeight: 800,
              letterSpacing: -3,
              color: C.white,
              lineHeight: 1.05,
            }}
          >
            {name}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 27,
              fontWeight: 600,
              letterSpacing: 3.2,
              textTransform: 'uppercase',
              color: C.purpleLift,
            }}
          >
            {kicker}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
