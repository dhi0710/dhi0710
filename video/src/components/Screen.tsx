import React from 'react';
import {OffthreadVideo, staticFile} from 'remotion';
import {C} from '../theme';

export const Screen: React.FC<{
  src: string;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  dim?: number;
  radius?: number;
}> = ({src, width, height, label, sublabel, dim = 0, radius = 26}) => {
  return (
    <div style={{width, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <div
        style={{
          width,
          height,
          borderRadius: radius,
          overflow: 'hidden',
          position: 'relative',
          background: '#fff',
          border: `1px solid rgba(255,255,255,${0.16 - dim * 0.1})`,
          boxShadow: `0 28px 56px -24px rgba(0,0,0,0.9)`,
        }}
      >
        <OffthreadVideo
          src={staticFile(src)}
          style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
          pauseWhenBuffering
        />
        {dim > 0 ? (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `rgba(8,5,16,${dim * 0.62})`,
            }}
          />
        ) : null}
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          opacity: 0.55 - dim * 0.25,
        }}
      >
        <div style={{width: 6, height: 6, borderRadius: 6, background: C.lilacDim}} />
        <span
          style={{
            color: C.lilac,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: 1.9,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </span>
        {sublabel ? (
          <span style={{color: C.mute, fontSize: 17, fontWeight: 500, letterSpacing: 0.4}}>
            {sublabel}
          </span>
        ) : null}
      </div>
    </div>
  );
};
