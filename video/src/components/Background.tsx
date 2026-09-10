import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../theme';

export const Background: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.ink}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1100px 780px at 18% -8%, rgba(112,0,204,0.42), transparent 62%),
                       radial-gradient(900px 700px at 104% 112%, rgba(148,54,232,0.28), transparent 60%),
                       radial-gradient(700px 500px at 50% 50%, rgba(30,20,48,0.55), transparent 70%)`,
        }}
      />
      {/* fine grid */}
      <AbsoluteFill
        style={{
          backgroundImage: `linear-gradient(${C.line} 1px, transparent 1px),
                            linear-gradient(90deg, ${C.line} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          opacity: 0.16,
          WebkitMaskImage: 'radial-gradient(1400px 900px at 50% 40%, black, transparent 78%)',
        }}
      />
      {/* vignette */}
      <AbsoluteFill
        style={{
          background:
            'radial-gradient(1500px 1000px at 50% 45%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};
