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
  /* MM-DD. On this date the page celebrates by itself when it opens.
     The hero header and intro date derive from this too. */
  birthday: '08-04',
}

/* "August" / "04", derived from her.birthday so the date lives in one place. */
const [bMonth, bDay] = her.birthday.split('-')
export const birthdayLabel = {
  month: new Date(2000, Number(bMonth) - 1, 1).toLocaleString('en-US', { month: 'long' }),
  day: bDay,
}

export const hero = {
  sub: 'Happy birthday.',
  coverSrc: '/photos/optimized/p44-hero.webp',
  /* full-bleed image behind everything, heavily dimmed */
  bgSrc: '/photos/optimized/p56.webp',
}

/* The letter. */
export const letter = {
  label: 'From me',
  headline: 'Dear Rochel,',
  snapshotSrc: '/photos/optimized/p11-letter.webp',
  paragraphs: [
    'Happy birthday. It’s crazy that we’ve gone from essentially being kids when we got married to now having two of our own.',
    'You are such an amazing human, wife, and mother to our kids. I have a tremendous amount of admiration and respect for everything you manage to juggle in your life.',
    'Mazel tov on turning 25. I look forward to spending many more birthdays together.',
  ],
  closing: 'Love,',
  postscript: 'P.S. This letter was written by me, not the AI lol.',
}

/* The photographs that lead the gallery. */
export const archive = {
  label: 'Photos',
  headline: 'The photo album.',
  items: [
    '/photos/web/p53.webp',
    '/photos/web/p45.webp',
    '/photos/web/p50.webp',
    '/photos/web/p46.webp',
    '/photos/web/p59.webp',
    '/photos/web/p57.webp',
    '/photos/web/p58.webp',
    '/photos/web/p60.webp',
    '/photos/web/p61.webp',
    '/photos/web/p62.webp',
    '/photos/web/p63.webp',
    '/photos/web/p64.webp',
    '/photos/web/p65.webp',
    '/photos/web/p66.webp',
    '/photos/web/p67.webp',
    '/photos/web/p68.webp',
    '/photos/web/p70.webp',
    '/photos/web/p74.webp',
    '/photos/web/p75.webp',
    '/photos/web/p78.webp',
    '/photos/web/p80.webp',
    '/photos/web/p84.webp',
    '/photos/web/p85.webp',
    '/photos/web/p94.webp',
    '/photos/web/p96.webp',
    '/photos/web/p97.webp',
    '/photos/web/p101.webp',
    '/photos/web/p102.webp',
    '/photos/web/p103.webp',
    '/photos/web/p104.webp',
    '/photos/web/p106.webp',
    '/photos/web/p107.webp',
    '/photos/web/p109.webp',
    '/photos/web/p110.webp',
    '/photos/web/p112.webp',
    '/photos/web/p115.webp',
    '/photos/web/p116.webp',
    '/photos/web/p117.webp',
    '/photos/web/p120.webp',
    '/photos/web/p03.webp',
    '/photos/web/p04.webp',
    '/photos/web/p05.webp',
    '/photos/web/p06.webp',
    '/photos/web/p07.webp',
    '/photos/web/p08.webp',
    '/photos/web/p09.webp',
    '/photos/web/p10.webp',
  ],
}

/* Five dates from the family archive. */
export const story = {
  label: 'Five photographs',
  headline: '2022 to now.',
  chapters: [
    {
      year: '2022',
      date: 'July 6',
      title: 'The vort.',
      copy: 'We said yes. Everyone took a picture.',
      photo: '/photos/web/p44.webp',
      focus: '50% 38%',
    },
    {
      year: '2022',
      date: 'September 11',
      title: 'Our wedding.',
      copy: 'The chuppah. The dancing. Our first day married.',
      photo: '/photos/web/p57.webp',
      focus: '50% 32%',
    },
    {
      year: '2023',
      date: 'Our first year',
      title: 'Our first year.',
      copy: 'Trips, late nights, and a lot of pictures.',
      photo: '/photos/web/p80.webp',
      focus: '50% 48%',
    },
    {
      year: '2024',
      date: 'Three of us',
      title: 'Then there were three.',
      copy: 'Travel required more luggage.',
      photo: '/photos/web/p106.webp',
      focus: '50% 42%',
    },
    {
      year: '2026',
      date: 'Right now',
      title: 'Four of us.',
      copy: 'This is home now.',
      photo: '/photos/web/p101.webp',
      focus: '50% 48%',
    },
  ],
}

/* A quiet photograph between the two galleries — and a video message
   that pops out and plays (with sound) when you scroll to it. */
export const interlude = {
  src: '/photos/web/p52.webp',
  alt: 'Cheskie and Rochel together',
  video: {
    src: '/video/birthday-message.mp4',
    label: 'A message for Mommy',
  },
}

export const finale = {
  lead: 'Close your eyes.',
  buttonLabel: 'Make a wish',
  buttonHint: 'press and hold',
  /* the quiet last line after the fireworks — edit freely */
  closingLine: 'Same time next year.',
  headline: 'Happy birthday,',
  sub: 'I love you.',
  bgSrc: '/photos/web/p14.webp',
  /* the photo that fills the letters of her name after the wish */
  nameFillSrc: '/photos/web/p57.webp',
}
