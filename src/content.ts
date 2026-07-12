/**
 * EVERYTHING EDITABLE LIVES HERE.
 *
 * Photos live in /public/photos as p01.jpg .. p65.jpg.
 * p01..p43 = the airdropped family set (p01 is the one phone portrait).
 * p44..p49 = the vort, photographer portraits. p50..p55 = the vort, phone shots.
 * p56..p59 = the wedding album (p56/p59 landscape, p57/p58 portrait).
 * p60..p65 = the newer Rochel shared-album set from late 2025.
 * To swap any image, just change the number or reorder these arrays.
 */

export const her = {
  name: 'Rochel',
  from: 'Cheskie',
  /* MM-DD. On this date the page celebrates by itself when it opens. */
  birthday: '07-02',
  /* where the footer complaints link goes */
  email: 'clondinski1234@gmail.com',
}

export const hero = {
  eyebrow: 'Birthday mode: on',
  sub: 'Today is entirely yours.',
  coverSrc: '/photos/optimized/p44.webp',
  /* full-bleed image behind everything, heavily dimmed */
  bgSrc: '/photos/optimized/p56.webp',
}

/* The letter. Short, warm, true. */
export const letter = {
  label: 'No jokes for one minute',
  headline: 'The real part.',
  snapshotSrc: '/photos/p11.jpg',
  paragraphs: [
    'Another year with you. Still the best thing I ever talked my way into.',
    'You make this family work. You make it louder, smarter, warmer, and a lot more fun.',
    'Happy birthday. I love the life we built, and I love doing it with you.',
  ],
}

/* Horizontal gallery. Captions are content-agnostic on purpose; edit any of
   them once you know which photo is which. Add or remove items freely. */
export const archive = {
  label: 'The favorites',
  sub: 'No ranking. That would start a family meeting.',
  items: [
    { src: '/photos/p53.jpg', caption: 'The vort. Where it went official.' },
    { src: '/photos/p45.jpg', caption: 'Already sure.' },
    { src: '/photos/p50.jpg', caption: 'Everyone came. Obviously.' },
    { src: '/photos/p46.jpg', caption: 'Day one, on the record.' },
    { src: '/photos/p59.jpg', caption: 'The wedding.' },
    { src: '/photos/p57.jpg', caption: 'The main event.' },
    { src: '/photos/p58.jpg', caption: 'Still the best day.' },
    { src: '/photos/p60.jpg', caption: 'A night out.' },
    { src: '/photos/p61.jpg', caption: 'Her favorite tablemate.' },
    { src: '/photos/p62.jpg', caption: 'Out of office.' },
    { src: '/photos/p63.jpg', caption: 'Sunset, no notes.' },
    { src: '/photos/p64.jpg', caption: 'The getaway.' },
    { src: '/photos/p65.jpg', caption: 'Hanukkah with the crew.' },
    { src: '/photos/p03.jpg', caption: 'Us.' },
    { src: '/photos/p04.jpg', caption: 'A good day.' },
    { src: '/photos/p05.jpg', caption: 'This one’s a keeper.' },
    { src: '/photos/p06.jpg', caption: 'No occasion required.' },
    { src: '/photos/p07.jpg', caption: 'Somewhere worth remembering.' },
    { src: '/photos/p08.jpg', caption: 'The usual suspects.' },
    { src: '/photos/p09.jpg', caption: 'Caught mid-laugh.' },
    { src: '/photos/p10.jpg', caption: 'Home team.' },
  ],
}

/* Full-screen interlude between the gallery and the list.
   IMPORTANT: set metDate to the day you two met (YYYY-MM-DD),
   the day counter is computed from it. */
export const interlude = {
  quote: 'Still us. Still the best call.',
  src: '/photos/p52.jpg',
  metDate: '2016-03-15',
}

/* The list. Hover each row on desktop for the photo. */
export const reasons = [
  {
    title: 'The laugh',
    phrase: 'Still my favorite sound in any room.',
    src: '/photos/p47.jpg',
  },
  {
    title: 'The brains',
    phrase: 'You out-think all of us. We have accepted it.',
    src: '/photos/p18.jpg',
  },
  {
    title: 'The heart',
    phrase: 'Everyone’s first call. Mine especially.',
    src: '/photos/p48.jpg',
  },
  {
    title: 'The standard',
    phrase: 'You raised the bar. I am still climbing.',
    src: '/photos/p49.jpg',
  },
  {
    title: 'The patience',
    phrase: 'Mostly with me. Renewed daily.',
    src: '/photos/p21.jpg',
  },
  {
    title: 'The plans',
    phrase: 'Watching them work is half the fun.',
    src: '/photos/p22.jpg',
  },
]

/* Sealed notes for later. Edit titles and bodies freely. */
export const openWhen = {
  label: 'For later',
  headline: 'Open when.',
  sub: 'Four notes. Zero fine print.',
  notes: [
    {
      title: 'you need a laugh',
      body: 'Think of the worst hotel we ever stayed in, and how hard you laughed anyway. I would book it again tomorrow.',
    },
    {
      title: 'it’s a hard day',
      body: 'Whatever it is, we have had worse and fixed it. Team meeting tonight on the couch. Attendance: two.',
    },
    {
      title: 'the kids are too much',
      body: 'They get it from you: the volume, the stubbornness, the charm. Two of those three are compliments. You pick which.',
    },
    {
      title: 'you miss me',
      body: 'I am probably already on the way home. Check the driveway, then call me anyway.',
    },
  ],
}

/* The fan club: one card per kid. Swap quotes and photos freely. */
export const kids = {
  label: 'The fan club',
  headline: 'Statements from the committee.',
  sub: 'Two members. Unanimous.',
  members: [
    {
      name: 'Hadassah',
      quote: 'Best mom. It’s not close.',
      src: '/photos/p23.jpg',
    },
    {
      name: 'Malka',
      quote: 'Ten out of ten. Would recommend.',
      src: '/photos/p24.jpg',
    },
  ],
}

/* The guestbook: scattered notes. tone: 'paper' | 'blush'. */
export const guestbook = {
  label: 'The guestbook',
  headline: 'Signed, everyone.',
  sub: 'Entries unedited.',
  notes: [
    { text: 'Have the best day today. I already planned it.', by: 'C', tone: 'paper' },
    { text: 'BEST. MOM. EVER.', by: 'Hadassah', tone: 'blush' },
    { text: 'malka wuz here', by: 'Malka', tone: 'paper' },
    { text: 'You still owe me a dance from the wedding.', by: 'C', tone: 'paper' },
    { text: 'Happy birthday to the boss.', by: 'the house', tone: 'blush' },
  ] as { text: string; by: string; tone: 'paper' | 'blush' }[],
}

/* Vouchers. Claims persist in her browser so they actually count. */
export const coupons = {
  label: 'Redeemable',
  headline: 'The vouchers.',
  sub: 'All valid forever. Claim wisely.',
  items: [
    { title: 'One sleep-in Saturday', detail: 'Kids handled. Coffee delivered.' },
    { title: 'One dinner out', detail: 'No phones. I already know the place.' },
    { title: 'One weekend away', detail: 'Planned start to finish, by me.' },
    { title: 'A no-questions yes', detail: 'One request, granted. Anything.' },
    { title: 'One movie night', detail: 'Your pick. I will not comment.' },
    { title: 'Breakfast in bed', detail: 'The good kind. Not cereal.' },
  ],
}

/* The decider wheel. Exactly six options works best. */
export const decider = {
  label: 'The decider',
  headline: 'For “I don’t care, you pick.”',
  sub: 'Spin once. Ruling is final.',
  options: ['Sushi', 'That Italian place', 'Pizza night', 'The steakhouse', 'Dessert first', 'You pick anyway'],
}

/* The FAQ. Keep answers to one dry sentence or two. */
export const faq = {
  label: 'On the record',
  headline: 'Frequently asked.',
  items: [
    {
      q: 'Who is in charge here?',
      a: 'She is. This was settled years ago and has not been close since.',
    },
    {
      q: 'Who is funnier?',
      a: 'Contested. Officially her, on points. He is still appealing the decision.',
    },
    {
      q: 'Best call he ever made?',
      a: 'Asking her. Everything good since is downstream of that one.',
    },
    {
      q: 'Is she always right?',
      a: 'Statistically, yes. The household stopped keeping count in year two.',
    },
  ],
}

export const finale = {
  lead: 'You get the last word.',
  buttonLabel: 'Make a wish',
  headline: 'Happy birthday,',
  sub: 'The main event. Every year.',
  bgSrc: '/photos/p14.jpg',
  /* the photo that fills the letters of her name after the wish */
  nameFillSrc: '/photos/p57.jpg',
}
