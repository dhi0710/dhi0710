import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {Background} from './components/Background';
import {TopBar, ProgressBar} from './components/Chrome';
import {Title} from './components/Title';
import {ChapterCard} from './components/ChapterCard';
import {Beat} from './components/Beat';
import {Outro} from './components/Outro';
import {CHAPTERS, TITLE_FRAMES, OUTRO_FRAMES} from './script';
import {C, FONT} from './theme';

type Entry =
  | {kind: 'title'; from: number; dur: number}
  | {kind: 'card'; from: number; dur: number; num: string; name: string; kicker: string}
  | {kind: 'beat'; from: number; dur: number; beat: (typeof CHAPTERS)[0]['beats'][0]; num: string; name: string}
  | {kind: 'outro'; from: number; dur: number};

export const buildTimeline = (): Entry[] => {
  const out: Entry[] = [];
  let t = 0;
  out.push({kind: 'title', from: t, dur: TITLE_FRAMES});
  t += TITLE_FRAMES;
  for (const ch of CHAPTERS) {
    out.push({kind: 'card', from: t, dur: ch.cardFrames, num: ch.num, name: ch.name, kicker: ch.kicker});
    t += ch.cardFrames;
    for (const b of ch.beats) {
      out.push({kind: 'beat', from: t, dur: b.frames, beat: b, num: ch.num, name: ch.name});
      t += b.frames;
    }
  }
  out.push({kind: 'outro', from: t, dur: OUTRO_FRAMES});
  return out;
};

export const QlubLoyaltyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const timeline = buildTimeline();

  const active = timeline.find((e) => frame >= e.from && frame < e.from + e.dur);
  const showChrome = active?.kind === 'beat' || active?.kind === 'card';
  const chapter =
    active?.kind === 'beat' || active?.kind === 'card'
      ? {num: active.num, name: active.name}
      : null;

  return (
    <AbsoluteFill style={{backgroundColor: C.ink, fontFamily: FONT}}>
      <Background />

      {timeline.map((e, i) => (
        <Sequence key={i} from={e.from} durationInFrames={e.dur} layout="none">
          {e.kind === 'title' ? <Title /> : null}
          {e.kind === 'card' ? <ChapterCard num={e.num} name={e.name} kicker={e.kicker} /> : null}
          {e.kind === 'beat' ? <Beat beat={e.beat} /> : null}
          {e.kind === 'outro' ? <Outro /> : null}
        </Sequence>
      ))}

      {showChrome && chapter ? <TopBar chapter={chapter.name} num={chapter.num} /> : null}
      <ProgressBar progress={frame / durationInFrames} />
    </AbsoluteFill>
  );
};
