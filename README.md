# OFFORKA OS — Phase A to E Build

This bundle includes the home experience and the Firebase backend starter for Jerry+ AI.

## Files
- `index.html`
- `css/style.css`
- `js/main.js`
- `functions/index.js`
- `functions/package.json`
- `firebase.json`
- `manifest.json`
- `sw.js`

## Required images
Place these inside `/images`:
- `jerry-profile.jpg`
- `jerry-background.webp`

## Active features
- Cinematic intro plays every time the page opens/refreshed.
- 3D joystick/service orb UI.
- Jerry+ AI modal.
- Firebase Cloud Function backend for OpenAI.
- Paystack donation link.
- MindCheck link.
- PWA/offline caching.
- Theme engine.
- Parallax/gyroscope motion.
- Premium tap physics and light sweep.

## Update before deploy
In `js/main.js`, update:
```js
const FIREBASE_AI_ENDPOINT = "https://us-central1-speaakout-portal.cloudfunctions.net/askJerry";
```
This is already set for your project ID.

## Firebase setup for Jerry+ AI
From this project folder:

```bash
npm install -g firebase-tools
firebase login
firebase use speaakout-portal
cd functions
npm install
cd ..
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
firebase deploy --only functions
```

If using newer Firebase environment secrets, you may also use:
```bash
firebase functions:secrets:set OPENAI_API_KEY
```

Then adjust the function if you want secret-based deployment.

## Important
Your ChatGPT Plus subscription does not provide API credits for website integrations. You need an OpenAI API key from the OpenAI developer platform.
Never put the OpenAI API key in `index.html` or `js/main.js`.
