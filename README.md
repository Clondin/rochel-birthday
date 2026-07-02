# For Rochel

A birthday page. Dark plum, wine accent, serif type, big effects: kinetic name reveal, cursor parallax, marquee bands, a horizontal-scroll photo gallery, a cursor-trailing photo list, tilted kid cards, and a confetti finale.

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
