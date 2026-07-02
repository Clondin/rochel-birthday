# For Rochel

A birthday page. Dark plum, wine accent, serif type, big effects: an intro curtain, Lenis smooth scrolling, a kinetic name reveal inside a spinning type ring, cursor and scroll parallax, velocity-reactive marquee bands, a word-by-word scroll-lit letter, a pinned horizontal photo gallery with inner parallax, a full-screen quote interlude with a live day counter, a cursor-trailing reasons list, draggable kid cards, sealed "open when" notes that morph into letters, and a heart-confetti finale.

Note: `metDate` in `src/content.ts` drives the "Day N of us" counter. Set it to the real date.

## Make it hers

All text and photos live in one file: `src/content.ts`.

1. Drop real photos into `public/photos/`
2. In `src/content.ts`, change each `src` from the picsum placeholder to `/photos/your-file.jpg`
3. Edit the letter, reasons, kid names, and quotes in the same file

## Setup

1. `git clone` this repo
2. `npm install`
3. `npm run dev` → opens at localhost:5173

No env vars needed.

## Deploy

Deployed via Vercel. Push to main to redeploy, or run `vercel --prod`.
