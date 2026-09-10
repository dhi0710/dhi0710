import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C} from '../theme';

export const QlubMark: React.FC<{size?: number; color?: string}> = ({
  size = 46,
  color = C.white,
}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: size * 0.16}}>
    <span
      style={{
        fontSize: size,
        fontWeight: 800,
        letterSpacing: -size * 0.045,
        color,
        lineHeight: 1,
      }}
    >
      qlub
    </span>
    <span style={{display: 'flex', gap: size * 0.09, marginBottom: size * 0.1}}>
      <i style={{width: size * 0.13, height: size * 0.13, borderRadius: 99, background: C.purpleLift, display: 'block'}} />
      <i style={{width: size * 0.13, height: size * 0.13, borderRadius: 99, background: C.lilac, display: 'block'}} />
    </span>
  </div>
);

export const TopBar: React.FC<{chapter?: string; num?: string}> = ({chapter, num}) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 104,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 74px',
      borderBottom: `1px solid ${C.line}`,
    }}
  >
    <div style={{display: 'flex', alignItems: 'center', gap: 22}}>
      <QlubMark size={34} />
      <span style={{width: 1, height: 26, background: C.line}} />
      <span
        style={{
          color: C.mute,
          fontSize: 17,
          fontWeight: 600,
          letterSpacing: 2.4,
          textTransform: 'uppercase',
        }}
      >
        SoftPOS · Loyalty
      </span>
    </div>
    {chapter ? (
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: 1.6,
            color: C.purpleLift,
            padding: '7px 13px',
            borderRadius: 8,
            background: 'rgba(112,0,204,0.22)',
            border: `1px solid rgba(148,54,232,0.42)`,
          }}
        >
          {num}
        </span>
        <span
          style={{
            color: C.lilac,
            fontSize: 17,
            fontWeight: 700,
            letterSpacing: 2.4,
            textTransform: 'uppercase',
          }}
        >
          {chapter}
        </span>
      </div>
    ) : null}
  </div>
);

export const ProgressBar: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 4, background: 'rgba(255,255,255,0.06)'}}>
    <div
      style={{
        height: '100%',
        width: `${progress * 100}%`,
        background: `linear-gradient(90deg, ${C.purple}, ${C.purpleLift}, ${C.lilac})`,
        
      }}
    />
  </div>
);

export const Callout: React.FC<{
  text: string;
  tone?: 'purple' | 'green' | 'plain';
  delay: number;
}> = ({text, tone = 'purple', delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 200, mass: 0.55}});
  const palette =
    tone === 'green'
      ? {bg: 'rgba(46,212,122,0.14)', bd: 'rgba(46,212,122,0.5)', fg: C.green}
      : tone === 'plain'
        ? {bg: 'rgba(255,255,255,0.07)', bd: 'rgba(255,255,255,0.2)', fg: C.white}
        : {bg: 'rgba(148,54,232,0.2)', bd: 'rgba(148,54,232,0.55)', fg: C.lilac};

  return (
    <div
      style={{
        alignSelf: 'flex-start',
        transform: `translateX(${interpolate(s, [0, 1], [-30, 0])}px)`,
        opacity: s,
        padding: '12px 22px',
        borderRadius: 999,
        background: palette.bg,
        border: `1px solid ${palette.bd}`,
        color: palette.fg,
        fontSize: 25,
        fontWeight: 700,
        letterSpacing: -0.2,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};
