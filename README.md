# For Rochel

A birthday letter and family photo album for Rochel. The page includes a Blender-rendered envelope, a short dated family timeline, a cinematic photo hallway, two photo galleries, and a fireworks finale.

## Make it hers

The visible text lives in `src/content.ts`. Web-ready photographs live in `public/photos/web/`. The Blender source scenes and build scripts live in `blender/`.

Raw Blender render frames are intentionally excluded from Git and Vercel.

## Setup

1. `git clone` this repo
2. `npm install`
3. `npm run dev`

The local site opens at `http://localhost:5173`. No environment variables are required.

## Deploy

The site deploys through Vercel when `main` changes.
