import { ExamplePreset } from '../types';

export const EXAMPLE_PRESETS: ExamplePreset[] = [
  {
    id: 'plant-tracker',
    name: 'SproutCare',
    tagline: 'Gentle houseplant watering and care companion',
    emoji: '🌱',
    color: 'emerald',
    answers: {
      1: 'A simple plant care companion that tells houseplant owners exactly when to water each plant so their plants stay healthy.',
      2: 'People constantly forget when they last watered their plants, leading to overwatering or dry, dying leaves.',
      3: 'Everyday houseplant lovers, apartment dwellers, and beginners who have 2 to 15 houseplants.',
      4: 'A responsive web app that works great on mobile phones when walking around the living room.',
      5: '1. Add a plant with name, location, and photo. 2. Set watering frequency (e.g. Every 5 days). 3. View a clear list of what needs water today. 4. Tap "Watered!" button to reset the timer.',
      6: 'Fertilizer reminders, seasonal winter care tips, and plant health notes with photo history.',
      7: 'Calm, organic, gentle, and relaxing. Feels like a quiet green greenhouse.',
      8: 'Sage green, soft leaf tones, warm off-white background, rounded organic card shapes with big tap buttons.',
      9: 'Both mobile and desktop, but primarily used on mobile phones while holding a watering can.',
      10: 'No complex AI camera disease diagnostics in v1, no social media feed, no shopping store. Strictly personal plant tracking.'
    }
  },
  {
    id: 'pet-grooming',
    name: 'Paws & Bubbles',
    tagline: 'Simple local pet grooming booking page',
    emoji: '🐶',
    color: 'amber',
    answers: {
      1: 'A 1-page booking web app for an independent mobile dog groomer so pet owners can book bath and haircut appointments.',
      2: 'The solo groomer wastes 2 hours every evening answering DMs and phone calls back and forth trying to find mutually free appointment times.',
      3: 'Local dog and cat owners in the neighborhood, and the solo business owner.',
      4: 'A clean web app that opens from an Instagram bio link or text message.',
      5: '1. View service menu (Full Bath, Haircut, Nail Trim) with prices and duration. 2. Pick an open calendar slot. 3. Enter pet name, breed, and owner phone number to confirm.',
      6: 'Automated SMS reminder 24 hours before the appointment, and a photo gallery of happy clean dogs.',
      7: 'Friendly, warm, professional, trustworthy, and cheerful.',
      8: 'Warm caramel amber, soft sky blue accents, clean white cards, high-contrast readable buttons.',
      9: 'Mobile-first web app since 90% of clients book directly from their smartphones.',
      10: 'No complicated in-app credit card processing in v1 (clients pay cash or Venmo at appointment), no multi-staff scheduling, no native app store download.'
    }
  },
  {
    id: 'tool-share',
    name: 'NeighborLend',
    tagline: 'Community garden & power tool borrowing board',
    emoji: '🔨',
    color: 'blue',
    answers: {
      1: 'A friendly neighborhood board where neighbors can see and borrow lawn mowers, ladders, and power tools from nearby neighbors for free.',
      2: 'Homeowners waste hundreds of dollars buying tools they only use once a year, while tools sit unused in neighbors garages.',
      3: 'Suburban or apartment neighbors who want to share resources and be friendly.',
      4: 'Web app accessible via desktop or mobile phone without installing an app.',
      5: '1. Post a tool to lend with a photo, title, and street/block. 2. Browse or search available tools nearby. 3. Tap "Request to Borrow" to send an email or message to the neighbor.',
      6: 'Borrow history log, return date reminders, neighbor thank-you badges.',
      7: 'Welcoming, community-oriented, straightforward, and reliable.',
      8: 'Navy blue and sunny yellow accents, clean grid of photo cards, clear "Available" vs "In Use" badges.',
      9: 'Both desktop and mobile web browsers with quick search filters.',
      10: 'No deposit money holding or escrow, no complex background checks, no courier delivery tracking. Just neighbor-to-neighbor honor system.'
    }
  },
  {
    id: 'quick-invoice',
    name: 'BillBreeze',
    tagline: '60-second simple invoice & PDF generator',
    emoji: '🧾',
    color: 'indigo',
    answers: {
      1: 'A dead-simple invoice generator where freelancers and tutors can create, preview, and download a clean PDF invoice in under 60 seconds.',
      2: 'Existing accounting software like QuickBooks is bloated, expensive, and takes 30 minutes of setup when all you need is a 1-page PDF bill.',
      3: 'Solo freelancers, piano teachers, freelance writers, and independent contractors.',
      4: 'Web app running in any browser on desktop or tablet.',
      5: '1. Enter sender info and client info. 2. Add line items (Description, Quantity, Hourly Rate). 3. Auto-calculate total and tax. 4. One-click "Download PDF" button.',
      6: 'Save client details in browser storage, toggle currency symbol, upload custom company logo.',
      7: 'Clean, modern, crisp, and distraction-free professional look.',
      8: 'Slate gray, crisp royal indigo buttons, clean white paper canvas with subtle shadows.',
      9: 'Desktop web browser primarily, with clean tablet and mobile support.',
      10: 'No monthly recurring payment gateway, no automated bank transaction syncing, no double-entry accounting ledger. Just pristine PDF invoice generation.'
    }
  }
];
