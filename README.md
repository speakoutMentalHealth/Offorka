# OFFORKA OS v5.0 — Clean Rebuild

This is a clean rebuild of the UI while preserving:
- Existing navigation
- Firebase Jerry+ AI architecture
- MindCheck integration
- Paystack donation flow
- Call action
- Service routing

## Required images
Place these files in `/images`:
- `jerry-profile.jpg`
- `jerry-background.webp`

## Home interactions
- Tap the center analog once: call
- Drag up: Public Speaking
- Drag left: Leadership & Consulting
- Drag right: Learning Hub
- Drag down: Donate
- Dock replaces Journal with Jerry AI
- Mobile home is one-screen, no homepage scrolling

## Firebase AI
Endpoint is set in `js/main.js`:
`https://us-central1-speaakout-portal.cloudfunctions.net/askJerry`

Deploy functions:
```bash
firebase use speaakout-portal
cd functions
npm install
cd ..
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
firebase deploy --only functions
```
