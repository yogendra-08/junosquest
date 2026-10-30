# JunosQuest - JNCIA-Junos Practice & Revision

A clean JNCIA-Junos practice platform featuring 128 MCQs, instant feedback, explanations, question navigation, and score tracking.

Built with React + Vite. No backend; progress is saved in `localStorage`.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
npm run preview    # preview the build
```

## Deploy to Netlify
**Git:** push to GitHub (repo `junosquest`), then in Netlify choose *Add new site > Import from Git*. `netlify.toml` already sets build command `npm run build` and publish directory `dist`.
**Drag and drop:** run `npm run build`, then drag the `dist` folder onto https://app.netlify.com/drop.

## Questions
All 128 questions live in `src/data/questions.json` (id, question, options, answer indexes, explanation, multi). Questions with two correct answers (25, 118, 122) use checkbox selection and require both answers.

## Disclaimer
Created solely for educational and personal practice. Independent; not affiliated with or endorsed by Juniper Networks.
