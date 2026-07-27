/**
 * EVERYTHING EDITABLE LIVES HERE.
 *
 * Photos are served from /public/photos/web as p01.webp .. p120.webp.
 * p01..p43 = the airdropped family set (p01 is the one phone portrait).
 * p44..p49 = the vort, photographer portraits. p50..p55 = the vort, phone shots.
 * p56..p59 = the wedding album (p56/p59 landscape, p57/p58 portrait).
 * p60..p65 = the newer Rochel shared-album set from late 2025.
 * p66..p77 = a curated 2022 set from the Photos library.
 * p78..p101 = six curated photos from each year, 2023 through 2026.
 * p102..p120 = Rochel-focused motherhood and family moments from 2023 through 2026.
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
  coverSrc: '/photos/optimized/p44-hero.webp',
  /* full-bleed image behind everything, heavily dimmed */
  bgSrc: '/photos/optimized/p56.webp',
}

/* The letter. Short, warm, true. */
export const letter = {
  label: 'No jokes for one minute',
  headline: 'The real part.',
  snapshotSrc: '/photos/optimized/p11-letter.webp',
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
    { src: '/photos/web/p53.webp', caption: 'The vort. Where it went official.' },
    { src: '/photos/web/p45.webp', caption: 'Already sure.' },
    { src: '/photos/web/p50.webp', caption: 'Everyone came. Obviously.' },
    { src: '/photos/web/p46.webp', caption: 'Day one, on the record.' },
    { src: '/photos/web/p59.webp', caption: 'The wedding.' },
    { src: '/photos/web/p57.webp', caption: 'The main event.' },
    { src: '/photos/web/p58.webp', caption: 'Still the best day.' },
    { src: '/photos/web/p60.webp', caption: 'A night out.' },
    { src: '/photos/web/p61.webp', caption: 'Her favorite tablemate.' },
    { src: '/photos/web/p62.webp', caption: 'Out of office.' },
    { src: '/photos/web/p63.webp', caption: 'Sunset, no notes.' },
    { src: '/photos/web/p64.webp', caption: 'The getaway.' },
    { src: '/photos/web/p65.webp', caption: 'Hanukkah with the crew.' },
    { src: '/photos/web/p66.webp', caption: 'Summer 2022. Already us.' },
    { src: '/photos/web/p67.webp', caption: 'At the top of everything.' },
    { src: '/photos/web/p68.webp', caption: 'The Venice Beach era.' },
    { src: '/photos/web/p70.webp', caption: 'The first weeks of forever.' },
    { src: '/photos/web/p74.webp', caption: 'Home team, away game.' },
    { src: '/photos/web/p75.webp', caption: 'Our first winter escape.' },
    { src: '/photos/web/p78.webp', caption: 'New York, us against the cold.' },
    { src: '/photos/web/p80.webp', caption: 'Beach day, first full year.' },
    { src: '/photos/web/p84.webp', caption: 'Three seats, one tiny traveler.' },
    { src: '/photos/web/p85.webp', caption: 'Winter sun.' },
    { src: '/photos/web/p94.webp', caption: 'Blue water, no schedule.' },
    { src: '/photos/web/p96.webp', caption: 'Snow day with the crew.' },
    { src: '/photos/web/p97.webp', caption: 'Cake, candles, chaos.' },
    { src: '/photos/web/p101.webp', caption: 'The newest chapter.' },
    { src: '/photos/web/p102.webp', caption: 'Fully committed to the bit.' },
    { src: '/photos/web/p103.webp', caption: 'The first little hello.' },
    { src: '/photos/web/p104.webp', caption: 'Waiting for our first teammate.' },
    { src: '/photos/web/p106.webp', caption: 'The tiniest chapter begins.' },
    { src: '/photos/web/p107.webp', caption: 'Mom mode, city edition.' },
    { src: '/photos/web/p109.webp', caption: 'Pool day.' },
    { src: '/photos/web/p110.webp', caption: 'Pony day.' },
    { src: '/photos/web/p112.webp', caption: 'Just the girls.' },
    { src: '/photos/web/p115.webp', caption: 'Beach girls.' },
    { src: '/photos/web/p116.webp', caption: 'The view, and the better view.' },
    { src: '/photos/web/p117.webp', caption: 'Hanukkah with mom.' },
    { src: '/photos/web/p120.webp', caption: 'Mom fuel, officially.' },
    { src: '/photos/web/p03.webp', caption: 'Us.' },
    { src: '/photos/web/p04.webp', caption: 'A good day.' },
    { src: '/photos/web/p05.webp', caption: 'This one’s a keeper.' },
    { src: '/photos/web/p06.webp', caption: 'No occasion required.' },
    { src: '/photos/web/p07.webp', caption: 'Somewhere worth remembering.' },
    { src: '/photos/web/p08.webp', caption: 'The usual suspects.' },
    { src: '/photos/web/p09.webp', caption: 'Caught mid-laugh.' },
    { src: '/photos/web/p10.webp', caption: 'Home team.' },
  ],
}

/* Five turning points, not another photo archive. The larger gallery below
   carries the breadth; this section carries the story. */
export const story = {
  label: 'From then to now',
  headline: 'It started with one yes.',
  sub: 'A few frames from everything that followed.',
  chapters: [
    {
      year: '2022',
      date: 'July 6',
      title: 'The yes.',
      copy: 'A vort, a room full of people, and the easiest decision of my life.',
      photo: '/photos/web/p44.webp',
      focus: '50% 38%',
    },
    {
      year: '2022',
      date: 'September 11',
      title: 'The day we became us.',
      copy: 'The chuppah. The dancing. The start of everything we get to call ours.',
      photo: '/photos/web/p57.webp',
      focus: '50% 32%',
    },
    {
      year: '2023',
      date: 'Our first full year',
      title: 'The world got bigger.',
      copy: 'Beach mornings, road trips, and every new place becoming part of our story.',
      photo: '/photos/web/p80.webp',
      focus: '50% 48%',
    },
    {
      year: '2024',
      date: 'The family chapter',
      title: 'Then there were three.',
      copy: 'The trips changed. The bags got bigger. Somehow the fun did too.',
      photo: '/photos/web/p106.webp',
      focus: '50% 42%',
    },
    {
      year: '2026',
      date: 'Right now',
      title: 'The best kind of full.',
      copy: 'Two little girls, a louder home, and more life than that first yes could have imagined.',
      photo: '/photos/web/p101.webp',
      focus: '50% 48%',
    },
  ],
}

/* Full-screen interlude between the gallery and the list.
   IMPORTANT: set metDate to the day you two met (YYYY-MM-DD),
   the day counter is computed from it. */
export const interlude = {
  quote: 'Still us. Still the best call.',
  src: '/photos/web/p52.webp',
  metDate: '2016-03-15',
}

/* The list. Hover each row on desktop for the photo. */
export const reasons = [
  {
    title: 'The laugh',
    phrase: 'Still my favorite sound in any room.',
    src: '/photos/web/p47.webp',
  },
  {
    title: 'The brains',
    phrase: 'You out-think all of us. We have accepted it.',
    src: '/photos/web/p18.webp',
  },
  {
    title: 'The heart',
    phrase: 'Everyone’s first call. Mine especially.',
    src: '/photos/web/p48.webp',
  },
  {
    title: 'The standard',
    phrase: 'You raised the bar. I am still climbing.',
    src: '/photos/web/p49.webp',
  },
  {
    title: 'The patience',
    phrase: 'Mostly with me. Renewed daily.',
    src: '/photos/web/p21.webp',
  },
  {
    title: 'The plans',
    phrase: 'Watching them work is half the fun.',
    src: '/photos/web/p22.webp',
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
      src: '/photos/web/p23.webp',
    },
    {
      name: 'Malka',
      quote: 'Ten out of ten. Would recommend.',
      src: '/photos/web/p24.webp',
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
  bgSrc: '/photos/web/p14.webp',
  /* the photo that fills the letters of her name after the wish */
  nameFillSrc: '/photos/web/p57.webp',
}
