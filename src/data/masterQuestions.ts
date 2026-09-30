import { MasterQuestion } from '../types';

export const MASTER_QUESTIONS: MasterQuestion[] = [
  {
    id: 1,
    questionNumber: 1,
    title: 'The Big Idea',
    question: 'What is your app idea in one or two simple sentences?',
    simpleExplanation: 'Imagine you are explaining your app to a friend over coffee. What does it do in everyday words?',
    analogy: 'Think of how someone would describe Uber as "An app that calls a taxi to your door with one tap."',
    placeholder: 'e.g. A simple app where neighbors can borrow gardening tools from each other for free.',
    defaultOptions: [
      'A habit tracker that gives gentle reminders to drink water and take stretch breaks',
      'A simple booking page for a local pet grooming service',
      'A recipe finder that suggests dinners based on 3 ingredients in my fridge',
      'A shared family chore and allowance board that kids can tap when finished'
    ],
    dontKnowSuggestions: [
      'A personal daily task list with a clean 3-task limit per day',
      'A simple appointment booking app for a solo barber or baker',
      'A neighborhood book exchange list to see what friends are reading'
    ],
    complexityTips: 'Keep it to ONE main trick or job first. You can always add more tricks later!',
    category: 'idea'
  },
  {
    id: 2,
    questionNumber: 2,
    title: 'The Problem to Solve',
    question: 'What problem should this app solve, or what should it help people do?',
    simpleExplanation: 'What annoying chore, confusion, or wasted time will disappear once people have this app?',
    analogy: 'Before calculators, people spent hours doing long division on paper. What headache does your app cure?',
    placeholder: 'e.g. People buy expensive lawnmowers they only use twice a year, while their neighbor has one sitting in the garage.',
    defaultOptions: [
      'People forget to water their indoor plants and feel guilty when they wither',
      'Clients keep texting at midnight asking what time slots are open next week',
      'People throw away good food because they do not know what to cook with random leftovers',
      'Writing and emailing freelance invoices by hand in Word takes too much time'
    ],
    dontKnowSuggestions: [
      'It saves 15 minutes of messy back-and-forth text messages every week',
      'It prevents losing track of important notes scattered on sticky pads',
      'It gives people peace of mind by organizing their everyday routine'
    ],
    complexityTips: 'Focus on a single clear pain point. A small app that solves one pain well is 10x better than a messy app that tries to solve everything.',
    category: 'idea'
  },
  {
    id: 3,
    questionNumber: 3,
    title: 'Who Will Use It',
    question: 'Who will use the app? Please describe the main users as simply as you can.',
    simpleExplanation: 'Who is sitting on the couch or at a desk tapping this screen? (Busy moms, college students, pet owners, solo bakers?)',
    analogy: 'A tricycle is built for toddlers with low handles. A mountain bike is built for trail riders with suspension. Who is your rider?',
    placeholder: 'e.g. Everyday neighbors on our street who are friendly and own houses or apartments.',
    defaultOptions: [
      'Busy solo freelancers who want to send a bill in 60 seconds without complex accounting jargon',
      'Home plant owners who love greenery but frequently forget watering schedules',
      'Local dog and cat owners who want a quick haircut or bath for their pets',
      'Grandparents and grandkids who want an easy, large-button shared photo wall'
    ],
    dontKnowSuggestions: [
      'Non-tech-savvy everyday people who just want something super easy to tap',
      'Solo business owners and their clients',
      'Students and young professionals managing personal daily habits'
    ],
    complexityTips: 'Pick one main kind of person first. Don\'t worry about "everyone in the world" yet.',
    category: 'users'
  },
  {
    id: 4,
    questionNumber: 4,
    title: 'Type of App',
    question: 'What type of app do you want: web app, mobile app, both, or not sure?',
    simpleExplanation: 'A "web app" opens in Google Chrome / Safari on any computer or phone without downloading from the App Store. A "mobile app" lives on a phone screen.',
    analogy: 'A web app is like visiting a website. A mobile app is like an icon you download from Apple or Google store.',
    placeholder: 'e.g. Web app first so anyone can open a link immediately without installing anything.',
    defaultOptions: [
      'Web app that looks great and runs smoothly on both phones and computers',
      'Mobile-first web app (optimized for touch screens on phones)',
      'Both web and mobile app',
      'Not sure — whatever is the fastest and cheapest to build first'
    ],
    dontKnowSuggestions: [
      'Web app first (Best choice! Works on iPhones, Androids, and laptops instantly with zero App Store approval)',
      'Mobile responsive website (one link works everywhere)'
    ],
    complexityTips: 'Recommendation: Start with a responsive web app! It works on both phones and laptops, costs zero app store fees, and builds twice as fast.',
    category: 'platform'
  },
  {
    id: 5,
    questionNumber: 5,
    title: 'Must-Have Features',
    question: 'What are the main things the app must do? Please list the most important features first.',
    simpleExplanation: 'If your app only had 3 buttons or actions on day one, what would they be? What is the core heartbeat?',
    analogy: 'A toaster only needs one slot and one lever to push down. What is the single lever of your app?',
    placeholder: 'e.g. 1. Post a tool you have to lend. 2. Search available tools nearby. 3. Click "Request Borrow" to message the owner.',
    defaultOptions: [
      '1. Add a plant with a photo and name. 2. See a countdown: "Water in 2 days". 3. Tap "Watered today!" button.',
      '1. View service menu and prices. 2. Select an available time slot. 3. Enter name & phone number to confirm booking.',
      '1. Type in 3 ingredients. 2. Click "Get Recipes". 3. See simple step-by-step cooking cards with timers.',
      '1. Fill in client name and 3 line items. 2. Click "Generate Invoice". 3. Download clean PDF or copy shareable link.'
    ],
    dontKnowSuggestions: [
      'A simple list view to see items, a "+ Add" button to create an item, and a checkmark button to mark it done',
      'A clean 1-page form where visitors fill out their info and hit submit'
    ],
    complexityTips: 'Keep it to 2 or 3 core features for version 1. If you have 10 features, pick the top 3 and save the rest for question 6!',
    category: 'features'
  },
  {
    id: 6,
    questionNumber: 6,
    title: 'Nice-to-Have Extras',
    question: 'Are there any extra features you want, even if they are not in the first version?',
    simpleExplanation: 'These are the "cherry on top" dreams you would love in version 2 or 3, once the basic version is already working.',
    analogy: 'Version 1 is a sturdy bicycle. Version 2 gets a headlight and a cute basket. What is your basket?',
    placeholder: 'e.g. Borrower ratings, automated text message reminders when a tool is due back, photo check-in.',
    defaultOptions: [
      'Push notifications to phone, light/dark mode switch, export to spreadsheet',
      'Online credit card payments, automatic SMS appointment reminders, loyalty discount codes',
      'AI photo plant disease scanner, weather forecast integration, fertilizer schedule',
      'Multi-currency support, tax calculation by country, client login portal'
    ],
    dontKnowSuggestions: [
      'Email notifications when someone submits a request',
      'Dark mode theme for nighttime use',
      'Export data to CSV or Excel file',
      'Keep it completely minimal — no extra features needed for now'
    ],
    complexityTips: 'Putting features in "Nice-to-Have" protects your launch date and budget. It is safe to dream big here!',
    category: 'features'
  },
  {
    id: 7,
    questionNumber: 7,
    title: 'Look and Feel (Vibe)',
    question: 'How should the app look and feel? For example: simple, modern, fun, serious, colorful, calm, luxury, or something else.',
    simpleExplanation: 'When someone opens the app, what mood should they feel? (Like a peaceful garden? A clean hospital desk? A playful cartoon?)',
    analogy: 'Is your app a cozy coffee shop with wooden tables, or a sleek Apple store with white glass?',
    placeholder: 'e.g. Warm, friendly, and community-focused with soft rounded corners and welcoming text.',
    defaultOptions: [
      'Calm, clean, and organic — lots of white space and gentle leaf-green accents',
      'Modern, trustworthy, and minimal — crisp fonts, soft slate grays, and clear buttons',
      'Playful, energetic, and colorful — bright pastel buttons, friendly emojis, and rewarding confetti',
      'Sleek, professional, and elegant — dark mode option, high-contrast typography, crisp borders'
    ],
    dontKnowSuggestions: [
      'Simple, modern, and clean (safe, timeless, and easy to read for all ages)',
      'Warm and friendly with soft colors',
      'Minimalist with big easy-to-read text'
    ],
    complexityTips: 'Simple and clean is always fastest to build and easiest for non-technical users to navigate.',
    category: 'design'
  },
  {
    id: 8,
    questionNumber: 8,
    title: 'Colors and Style Details',
    question: 'Do you have any color ideas, style ideas, or layout ideas for the app?',
    simpleExplanation: 'Any favorite colors? Do you like big chunky cards, clean lists, dark mode, or soft pastel buttons?',
    analogy: 'If this app were a room in a house, what color are the walls painted and what kind of furniture is in it?',
    placeholder: 'e.g. Forest green and warm cream background, big tap-friendly cards, rounded buttons, friendly icons.',
    defaultOptions: [
      'Emerald green primary with warm cream backgrounds and earthy sage accents',
      'Royal indigo blue primary with crisp white cards and soft charcoal text',
      'Warm sunset coral and amber with friendly rounded card borders',
      'Monochrome clean slate with an electric purple accent for main action buttons'
    ],
    dontKnowSuggestions: [
      'Neutral slate gray with a friendly ocean blue for buttons (standard, accessible, clean)',
      'Soft mint green and white (calming and fresh)',
      'Warm amber and sand tones (cozy and approachable)'
    ],
    complexityTips: 'High contrast text (dark text on light background) ensures older adults and phone users outdoors can easily read everything.',
    category: 'design'
  },
  {
    id: 9,
    questionNumber: 9,
    title: 'Screens and Devices',
    question: 'Should the app work on a web browser, on phones, or both? Should it work well on small screens?',
    simpleExplanation: 'Will people mostly use this on their phone while standing in line, or sitting at a desk on a big monitor?',
    analogy: 'A receipt scanner is used standing up with one hand on a phone. A financial spreadsheet is used on a wide desktop screen.',
    placeholder: 'e.g. Both! Must work flawlessly on small phone screens (iPhone/Android) with big tap targets, plus desktop.',
    defaultOptions: [
      'Both! Fully responsive web app optimized for mobile phone touchscreens and laptops',
      'Mobile-first: mostly used on phones, needs thumb-friendly buttons and fast loading',
      'Desktop browser first: needs spacious tables and room for typing notes',
      'Works on all modern web browsers (Chrome, Safari, Edge) on phones, tablets, and laptops'
    ],
    dontKnowSuggestions: [
      'Responsive web app (works seamlessly on small phone screens and desktop browsers)',
      'Mobile phone screen priority with big easy-to-tap buttons'
    ],
    complexityTips: 'We will specify "Mobile-Responsive Web App" in the PRD so any builder creates big tap targets (minimum 44px) and no horizontal scrolling.',
    category: 'platform'
  },
  {
    id: 10,
    questionNumber: 10,
    title: 'Boundaries & Out of Scope',
    question: 'Is there anything the app should not do, or anything that would make it too hard, too expensive, or too slow to build?',
    simpleExplanation: 'What are you deliberately saying "NO" to for version 1 to keep things simple, cheap, and fast?',
    analogy: 'A small bakery says "We do not do custom 5-tier wedding cakes yet, we just bake fresh sourdough and croissants."',
    placeholder: 'e.g. No payment processing, no live GPS tracking, no complex user accounts — just simple email confirmation.',
    defaultOptions: [
      'No complicated password logins (use simple email links or guest mode), no monthly subscription billing',
      'No real-time video or chat servers — just simple message requests or email notifications',
      'No complex native app store publishing initially (keep as lightweight web app)',
      'No messy multi-language translations or automated bank integrations in v1'
    ],
    dontKnowSuggestions: [
      'No payment gateway in v1 (keep transactions free or direct)',
      'No complex user permission roles (admin vs editor vs viewer)',
      'Keep it strictly a simple MVP (Minimum Viable Product)'
    ],
    complexityTips: 'Saying NO to complex things is the secret superpower to actually launching an app in days rather than months!',
    category: 'boundaries'
  }
];
