import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT} from '../theme';
import type {Beat as BeatT} from '../script';
import {Screen} from './Screen';
import {Callout} from './Chrome';

const TERM_AR = 370 / 864;
const PHONE_AR = 276 / 544;

const LAYOUT = {
  both: {termH: 796, phoneH: 796, gap: 56, dimT: 0, dimP: 0},
  terminal: {termH: 850, phoneH: 500, gap: 54, dimT: 0, dimP: 0.55},
  phone: {termH: 500, phoneH: 850, gap: 54, dimT: 0.55, dimP: 0},
  'terminal-only': {termH: 880, phoneH: 0, gap: 0, dimT: 0, dimP: 0},
} as const;

const DEVICES_CX = 1345;
const CONTENT_TOP = 104;

export const Beat: React.FC<{beat: BeatT}> = ({beat}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const L = LAYOUT[beat.focus];

  const solo = beat.focus === 'terminal-only';
  const termW = Math.round(L.termH * TERM_AR);
  const phoneW = solo ? 0 : Math.round(L.phoneH * PHONE_AR);
  const totalW = solo ? termW : termW + L.gap + phoneW;

  const rise = spring({frame, fps, config: {damping: 200, mass: 0.7}});
  const fade = interpolate(frame, [0, 10], [0, 1], {extrapolateRight: 'clamp'});
  const bodyIn = spring({frame: frame - 8, fps, config: {damping: 200, mass: 0.8}});
  const devIn = spring({frame: frame - 2, fps, config: {damping: 200, mass: 0.9}});

  return (
    <AbsoluteFill style={{fontFamily: FONT}}>
      {/* devices */}
      <div
        style={{
          position: 'absolute',
          left: DEVICES_CX - totalW / 2,
          top: CONTENT_TOP,
          width: totalW,
          height: 1080 - CONTENT_TOP,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: L.gap,
          opacity: fade,
          transform: `scale(${interpolate(devIn, [0, 1], [0.965, 1])})`,
        }}
      >
        <Screen
          src={`clips/${beat.clip}_t.mp4`}
          width={termW}
          height={L.termH}
          label="SoftPOS terminal"
          dim={L.dimT}
        />
        {solo ? null : (
          <Screen
            src={`clips/${beat.clip}_p.mp4`}
            width={phoneW}
            height={L.phoneH}
            label="Guest phone"
            dim={L.dimP}
          />
        )}
      </div>

      {/* text column */}
      <div
        style={{
          position: 'absolute',
          left: 132,
          top: CONTENT_TOP,
          width: 640,
          height: 1080 - CONTENT_TOP,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 0,
        }}
      >
        {beat.eyebrow ? (
          <div
            style={{
              opacity: fade,
              transform: `translateY(${interpolate(rise, [0, 1], [16, 0])}px)`,
              color: C.purpleLift,
              fontSize: 19,
              fontWeight: 800,
              letterSpacing: 3.4,
              textTransform: 'uppercase',
              marginBottom: 22,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <span style={{width: 30, height: 2, background: C.purpleLift, display: 'block'}} />
            {beat.eyebrow}
          </div>
        ) : null}

        <div
          style={{
            opacity: fade,
            transform: `translateY(${interpolate(rise, [0, 1], [26, 0])}px)`,
            color: C.white,
            fontSize: 54,
            lineHeight: 1.13,
            fontWeight: 800,
            letterSpacing: -1.4,
            textWrap: 'balance',
          }}
        >
          {beat.title}
        </div>

        {beat.body ? (
          <div
            style={{
              opacity: bodyIn,
              transform: `translateY(${interpolate(bodyIn, [0, 1], [18, 0])}px)`,
              color: C.mute,
              fontSize: 26,
              lineHeight: 1.5,
              fontWeight: 500,
              marginTop: 26,
              maxWidth: 585,
            }}
          >
            {beat.body}
          </div>
        ) : null}

        {beat.callouts?.length ? (
          <div style={{display: 'flex', flexDirection: 'column', gap: 14, marginTop: 40}}>
            {beat.callouts.map((c, i) => (
              <Callout key={i} text={c.text} tone={c.tone} delay={c.at ?? 30 + i * 25} />
            ))}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
