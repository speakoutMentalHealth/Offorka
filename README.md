# OFFORKA OS v6.0 Production

## Production Architecture

### Homepage is isolated
- `index.html`
- `css/home.css`
- `js/home.js`

This protects the cinematic homepage, analog joystick, intro sequence, background composition, and premium OS experience from inner-page edits.

### Inner pages share one system
- `css/style.css`
- `js/main.js`

Used by:
- `about.html`
- `speaking.html`
- `consulting.html`
- `media.html`
- `speakout.html`
- `booking.html`
- `contact.html`
- `booking-confirmation.html`

### Booking engine
- `booking.html`
- `booking-confirmation.html`
- `css/booking-paid.css`
- `js/booking-paid.js`

Replace these placeholders:
- `PASTE_PAYSTACK_PRIVATE_CONSULTATION_LINK_HERE`
- `PASTE_PAYSTACK_LEADERSHIP_ADVISORY_LINK_HERE`
- `PASTE_PAYSTACK_MENTAL_HEALTH_ADVISORY_LINK_HERE`
- `PASTE_CALENDLY_OR_GOOGLE_CALENDAR_BOOKING_LINK_HERE`

### Jerry+ AI
- Frontend modal is active.
- Firebase function scaffold remains in `/functions`.
- AI will work after backend deployment and API key configuration.

### Required images
Place these in `/images`:
- `jerry-profile.jpg`
- `jerry-background.webp`

## v6.0 Production Improvements
- Premium mobile-first OS behavior
- Four-dot menu retained and stabilized
- Cinematic mobile background correction
- Stronger day-mode contrast
- Paid booking page with protected appointment flow
- Jerry+ AI modal retained
- Donation flow retained
- MindCheck link retained
- Escape-key overlay closing
- Placeholder-link guard
- Reduced-motion support
