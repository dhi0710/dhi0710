export type Focus = 'both' | 'phone' | 'terminal' | 'terminal-only';
export type Tone = 'purple' | 'green' | 'plain';

export type Callout = {text: string; tone?: Tone; at?: number; side?: 'terminal' | 'phone'};

export type Beat = {
  clip: string;
  frames: number;
  focus: Focus;
  eyebrow?: string;
  title: string;
  body?: string;
  callouts?: Callout[];
};

export type Chapter = {
  num: string;
  name: string;
  kicker: string;
  cardFrames: number;
  beats: Beat[];
};

export const TITLE_FRAMES = 150;
export const OUTRO_FRAMES = 300;

export const CHAPTERS: Chapter[] = [
  {
    num: '01',
    name: 'Redeem',
    kicker: 'The returning guest',
    cardFrames: 60,
    beats: [
      {
        clip: 'c1_bill', frames: 180, focus: 'terminal-only',
        eyebrow: 'At the table',
        title: 'The bill already knows about loyalty.',
        body: 'SoftPOS surfaces an Earn & redeem prompt on the bill itself. No second device, no second flow.',
        callouts: [{text: 'Table 1 · S$200.24', tone: 'plain', at: 40, side: 'terminal'}],
      },
      {
        clip: 'c1_qr', frames: 120, focus: 'terminal-only',
        eyebrow: 'One tap',
        title: 'Staff taps Add.',
        body: "A QR goes up on the terminal. That is the entire job on the merchant side.",
        callouts: [{text: 'Ask the guest to scan', tone: 'purple', at: 30, side: 'terminal'}],
      },
      {
        clip: 'c1_g1', frames: 105, focus: 'phone',
        eyebrow: "The guest's own phone",
        title: 'Nothing to download.',
        body: 'The guest scans and lands in their browser, still sitting at the table.',
        callouts: [{text: "I'm already a member", tone: 'purple', at: 45, side: 'phone'}],
      },
      {
        clip: 'c1_g2', frames: 105, focus: 'phone',
        eyebrow: 'Sign in',
        title: 'A phone number is the whole identity.',
        body: 'Balance and card travel with the guest to every qlub venue.',
      },
      {
        clip: 'c1_g3', frames: 105, focus: 'phone',
        eyebrow: 'Verify',
        title: 'Five digits, over WhatsApp.',
      },
      {
        clip: 'c1_g4', frames: 105, focus: 'phone',
        eyebrow: 'Verify',
        title: 'Signed in.',
        body: 'The terminal has been waiting this whole time — it syncs back on its own.',
      },
      {
        clip: 'c1_verified', frames: 210, focus: 'terminal',
        eyebrow: 'Back at the terminal',
        title: 'The guest appears, verified, with a balance.',
        body: 'Staff never typed a thing.',
        callouts: [
          {text: '✓ Verified', tone: 'green', at: 45, side: 'terminal'},
          {text: '11.63 Bateel Coins', tone: 'purple', at: 80, side: 'terminal'},
        ],
      },
      {
        clip: 'c1_redeem', frames: 120, focus: 'terminal',
        eyebrow: 'Redeem',
        title: 'Coins are money off the bill.',
        body: 'Redeem 11.63 points · save S$11.63',
      },
      {
        clip: 'c1_applied', frames: 241, focus: 'terminal',
        eyebrow: 'Applied',
        title: 'S$200.24 → S$188.61',
        body: 'The payable amount drops before the guest ever taps a card.',
        callouts: [
          {text: '− S$11.63 redeemed', tone: 'green', at: 60, side: 'terminal'},
          {text: "YOU'LL EARN +19", tone: 'purple', at: 110, side: 'terminal'},
        ],
      },
      {
        clip: 'c1_tip', frames: 60, focus: 'terminal',
        eyebrow: 'Tip',
        title: 'Rate, tip, pay.',
      },
      {
        clip: 'c1_paid', frames: 256, focus: 'terminal',
        eyebrow: 'Paid',
        title: 'Earning happens on the way out.',
        body: 'Earned automatically across every program the guest is enrolled in.',
        callouts: [
          {text: 'Paid with points S$11.63', tone: 'plain', at: 70, side: 'terminal'},
          {text: '18.861 earned', tone: 'purple', at: 120, side: 'terminal'},
        ],
      },
    ],
  },
  {
    num: '02',
    name: 'Earn',
    kicker: 'The payoff',
    cardFrames: 60,
    beats: [
      {
        clip: 'c2_earn', frames: 240, focus: 'phone',
        eyebrow: "On the guest's card, live",
        title: '0.00 → 18.86',
        body: 'The coins land the moment the payment clears. Nothing to claim, nothing to scan twice.',
        callouts: [{text: "You're all set", tone: 'green', at: 90, side: 'phone'}],
      },
    ],
  },
  {
    num: '03',
    name: 'Enrol',
    kicker: 'The first-timer',
    cardFrames: 60,
    beats: [
      {
        clip: 'c3_bill', frames: 120, focus: 'terminal-only',
        eyebrow: 'A different table',
        title: 'Every bill is also an enrolment moment.',
        callouts: [{text: 'WOULD EARN +9 on S$90.00', tone: 'purple', at: 40, side: 'terminal'}],
      },
      {
        clip: 'c3_g1', frames: 120, focus: 'phone',
        eyebrow: 'The offer, up front',
        title: 'Earn. Redeem. Climb.',
        body: 'The guest sees exactly what they get before handing over anything.',
      },
      {clip: 'c3_g2', frames: 90, focus: 'phone', eyebrow: 'Sign up', title: 'Phone number.'},
      {clip: 'c3_g3', frames: 90, focus: 'phone', eyebrow: 'Sign up', title: 'Five digits.'},
      {
        clip: 'c3_g4', frames: 120, focus: 'phone',
        eyebrow: 'Account created',
        title: '“What should we call you?”',
        body: 'One name. That is the entire sign-up.',
      },
      {clip: 'c3_g5', frames: 105, focus: 'phone', eyebrow: 'Done', title: 'Card created, at the table.'},
      {
        clip: 'c3_verified', frames: 195, focus: 'terminal',
        eyebrow: 'Back at the terminal',
        title: 'A brand-new member, mid-service.',
        callouts: [
          {text: '0 Bateel Coins', tone: 'plain', at: 50, side: 'terminal'},
          {text: "YOU'LL EARN +9", tone: 'purple', at: 95, side: 'terminal'},
        ],
      },
      {
        clip: 'c3_noredeem', frames: 121, focus: 'terminal',
        eyebrow: 'The guard rail',
        title: 'Nothing to redeem yet — and it says so.',
        body: '“Not enough balance to redeem on this bill.”',
      },
      {clip: 'c3_tip', frames: 100, focus: 'terminal', eyebrow: 'Tip', title: 'S$90.00 → S$99.00'},
      {
        clip: 'c3_paid', frames: 180, focus: 'terminal',
        eyebrow: 'Paid',
        title: 'They leave with a balance they did not walk in with.',
      },
    ],
  },
  {
    num: '04',
    name: 'Look up',
    kicker: 'No scan, no problem',
    cardFrames: 60,
    beats: [
      {
        clip: 'c4_bill', frames: 151, focus: 'both',
        eyebrow: 'Table 2',
        title: 'Same prompt, smaller bill.',
        callouts: [{text: 'S$21.00 · WOULD EARN +2', tone: 'plain', at: 45, side: 'terminal'}],
      },
      {
        clip: 'c4_qr', frames: 105, focus: 'terminal',
        eyebrow: 'Another way in',
        title: "Guest can't scan?",
        body: 'Staff switches to Enter phone.',
      },
      {
        clip: 'c4_phone', frames: 170, focus: 'terminal',
        eyebrow: 'Look up',
        title: 'Type the number. Any country.',
      },
      {
        clip: 'c4_found', frames: 137, focus: 'terminal',
        eyebrow: 'Found',
        title: '9 Bateel Coins, waiting.',
        callouts: [{text: '9 Bateel Coins', tone: 'purple', at: 45, side: 'terminal'}],
      },
      {
        clip: 'c4_verify', frames: 110, focus: 'terminal',
        eyebrow: 'Consent, not a loophole',
        title: 'The guest still has to say yes.',
        body: 'A 5-digit code goes to their phone. They read it out.',
      },
      {clip: 'c4_code', frames: 140, focus: 'terminal', eyebrow: 'Verify', title: 'Staff types it in.'},
      {
        clip: 'c4_select', frames: 180, focus: 'terminal',
        eyebrow: 'Redeem',
        title: 'Redeem 9 points · save S$9.00',
      },
      {
        clip: 'c4_applied', frames: 240, focus: 'terminal',
        eyebrow: 'Applied',
        title: 'S$21.00 → S$12.00',
        callouts: [{text: '− S$9.00 redeemed', tone: 'green', at: 70, side: 'terminal'}],
      },
      {
        clip: 'c4_paid', frames: 210, focus: 'terminal',
        eyebrow: 'Paid',
        title: 'Redeemed without the guest touching a screen.',
      },
    ],
  },
];

export const TOTAL_FRAMES =
  TITLE_FRAMES +
  CHAPTERS.reduce(
    (n, c) => n + c.cardFrames + c.beats.reduce((m, b) => m + b.frames, 0),
    0,
  ) +
  OUTRO_FRAMES;
