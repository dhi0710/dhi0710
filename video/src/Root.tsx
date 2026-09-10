import React from 'react';
import {Composition} from 'remotion';
import '@fontsource-variable/plus-jakarta-sans';
import {QlubLoyaltyVideo} from './Video';
import {TOTAL_FRAMES} from './script';
import {FPS, W, H} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="QlubLoyalty"
    component={QlubLoyaltyVideo}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={W}
    height={H}
  />
);
