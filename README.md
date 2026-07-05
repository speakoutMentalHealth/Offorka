# OFFORKA OS v3.0

## What is included
- Full premium home page
- Updated premium pages
- Unified design system
- Cinematic intro that plays every open/refresh
- Removed heavy black control backgrounds
- Improved sunrise/light theme
- Jerry+ AI modal
- Firebase Cloud Function backend starter
- Paystack donation integration
- MindCheck link
- PWA manifest + service worker

## Required images
Place inside `/images`:
- `jerry-profile.jpg`
- `jerry-background.webp`

## Active links
- Donation: https://paystack.shop/pay/speakout-donate
- MindCheck: https://mindcheck.speakoutmentalhealth.org/
- Jerry+ function endpoint: https://us-central1-speaakout-portal.cloudfunctions.net/askJerry

## Firebase deployment
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

## Important
ChatGPT Plus does not include API access for your website. You still need an OpenAI API key for Jerry+.
Never put the OpenAI key in frontend JavaScript.
