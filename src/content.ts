/**
 * EVERYTHING EDITABLE LIVES HERE.
 * Swap the placeholder text and photos for your own.
 *
 * Photos: drop your images into /public/photos and change each `src`
 * to '/photos/your-file.jpg'. The picsum.photos URLs are placeholders.
 */

export const her = {
  name: 'Rochel',
  from: 'Cheskie',
}

export const hero = {
  eyebrow: 'Happy birthday',
  sub: 'From the guy who married up.',
  coverSrc: 'https://picsum.photos/seed/rochel-cover/900/1200',
}

/* The letter. Short, warm, true. */
export const letter = {
  label: 'From me, to you',
  headline: 'A few true things.',
  paragraphs: [
    'Another year with you. Still the best thing I ever talked my way into.',
    'You make this family run and you make it look easy. It is not easy. We all know.',
    'Happy birthday. You and me, always.',
  ],
}

/* Horizontal gallery. Add or remove freely. */
export const archive = {
  label: 'The evidence',
  sub: 'A short selection. The full collection does not fit on the internet.',
  items: [
    { src: 'https://picsum.photos/seed/rochel-a/1100/800', caption: 'The trip we still talk about' },
    { src: 'https://picsum.photos/seed/rochel-b/800/1100', caption: 'You, mid laugh, as usual' },
    { src: 'https://picsum.photos/seed/rochel-c/1100/800', caption: 'An ordinary day. A favorite one.' },
    { src: 'https://picsum.photos/seed/rochel-d/800/1100', caption: 'Somewhere far from home' },
    { src: 'https://picsum.photos/seed/rochel-e/1100/800', caption: 'The most recent favorite' },
    { src: 'https://picsum.photos/seed/rochel-f/800/1100', caption: 'Proof I occasionally plan a good surprise' },
    { src: 'https://picsum.photos/seed/rochel-g/1100/800', caption: 'Home, on a good night' },
  ],
}

/* Full-screen interlude between the gallery and the list.
   IMPORTANT: set metDate to the day you two met (YYYY-MM-DD),
   the day counter is computed from it. */
export const interlude = {
  quote: 'Every good thing here has you in it.',
  src: 'https://picsum.photos/seed/rochel-interlude/1600/1000',
  metDate: '2016-03-15',
}

/* The list. Hover each row on desktop for the photo. */
export const reasons = [
  {
    title: 'The laugh',
    phrase: 'Still my favorite sound in any room.',
    src: 'https://picsum.photos/seed/rochel-laugh/640/800',
  },
  {
    title: 'The brains',
    phrase: 'You out-think all of us. We have accepted it.',
    src: 'https://picsum.photos/seed/rochel-brains/640/800',
  },
  {
    title: 'The heart',
    phrase: 'Everyone’s first call. Mine especially.',
    src: 'https://picsum.photos/seed/rochel-heart/640/800',
  },
  {
    title: 'The standard',
    phrase: 'You raised the bar. I am still climbing.',
    src: 'https://picsum.photos/seed/rochel-standard/640/800',
  },
]

/* The fan club: one card per kid. Swap names, lines, and photos. */
export const kids = {
  label: 'The fan club',
  headline: 'Statements from the committee.',
  sub: 'Collected independently. No coaching.',
  members: [
    {
      name: 'The eldest',
      quote: 'Best mom. It’s not close.',
      src: 'https://picsum.photos/seed/rochel-kid-one/600/720',
    },
    {
      name: 'The middle one',
      quote: 'Makes the best snacks. Facts.',
      src: 'https://picsum.photos/seed/rochel-kid-two/600/720',
    },
    {
      name: 'The little one',
      quote: 'Ten out of ten. Would recommend.',
      src: 'https://picsum.photos/seed/rochel-kid-three/600/720',
    },
  ],
}

export const finale = {
  lead: 'One more thing.',
  buttonLabel: 'Make a wish',
  headline: 'Happy birthday,',
  sub: 'You and me. Always.',
}
