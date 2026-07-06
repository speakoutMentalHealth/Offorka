# OFFORKA OS v6.0 Go-Live Checklist

## Before uploading
1. Add images:
   - `/images/jerry-profile.jpg`
   - `/images/jerry-background.webp`

2. Update payment links in `booking.html`.

3. Update private scheduling link in `booking-confirmation.html`.

4. Confirm Paystack success redirect points to:
   - `https://yourdomain.com/booking-confirmation.html`

5. Test:
   - Homepage intro
   - Four-dot menu
   - Analog joystick:
     - Tap center = call
     - Up = speaking
     - Left = consulting
     - Right = learning hub
     - Down = donate
   - Jerry+ AI modal opens
   - Donation opens
   - Booking cards open payment modal
   - Mobile day mode visibility
   - Desktop layout

## AI note
Jerry+ frontend is ready. Backend requires Firebase/Apps Script/OpenAI API key connection.
