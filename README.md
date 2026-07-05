# OFFORKA OS v4 Final Optimized

## Main fixes
- Mobile home is now one-screen: no homepage scrolling.
- Name size reduced.
- Journal removed and replaced with Jerry AI in the dock.
- Center joystick restored:
  - Drag up -> Public Speaking
  - Drag left -> Leadership & Consulting
  - Drag right -> Learning Hub
  - Drag down -> Donate
  - Tap twice -> Call
- Orbit rings are animated and alive.
- Donation is inside the bottom orbit button.
- Heavy awkward background shadows reduced.
- Day mode cleaned up.
- Desktop keeps richer layout with panels.
- Other pages now contain real front-end content, not setup instructions.

## Required images
Put these in `/images`:
- `jerry-profile.jpg`
- `jerry-background.webp`

## Firebase AI
Endpoint in `js/main.js`:
`https://us-central1-speaakout-portal.cloudfunctions.net/askJerry`

Deploy:
```bash
firebase use speaakout-portal
cd functions
npm install
cd ..
firebase functions:config:set openai.key="YOUR_OPENAI_API_KEY"
firebase deploy --only functions
```

## Final polish update
- Center portrait label now has a dark glass background for readability.
- Tap center portrait once to call. No double-tap required.
- Drag center portrait still works:
  - Up: Public Speaking
  - Left: Leadership & Consulting
  - Right: Learning Hub
  - Down: Donate
- Center control now has stronger analog-style physical base/rim styling.
- Inner page copy is now written for visitors, not for backend instructions.
