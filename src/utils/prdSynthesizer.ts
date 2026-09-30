import { PRDDocument, PRDDeliverables, UserAnswers, PRDFeature, UserStory, ScreenWireframe } from '../types';

export function deriveAppName(idea: string, problem: string): string {
  if (!idea) return 'SimpleMVP App';
  const clean = idea.replace(/^(an?|the|a simple|my idea is|an app that|a web app for)\s+/i, '').trim();
  const words = clean.split(/\s+/).filter(w => w.length > 2);
  if (words.length >= 2) {
    const first = words[0].charAt(0).toUpperCase() + words[0].slice(1).replace(/[^a-zA-Z]/g, '');
    const second = words[1].charAt(0).toUpperCase() + words[1].slice(1).replace(/[^a-zA-Z]/g, '');
    return `${first}${second}`;
  }
  if (words.length === 1) {
    return `${words[0].charAt(0).toUpperCase() + words[0].slice(1).replace(/[^a-zA-Z]/g, '')}Craft`;
  }
  return 'SimpleCraft';
}

export function synthesizePRDFromAnswers(answers: UserAnswers, customName?: string): PRDDeliverables {
  const idea = answers[1]?.trim() || 'A simple utility web application';
  const problem = answers[2]?.trim() || 'People struggle with manual tasks and disorganized notes';
  const users = answers[3]?.trim() || 'Everyday non-technical users and individuals';
  const appType = answers[4]?.trim() || 'Responsive web application for mobile and desktop';
  const mustHaves = answers[5]?.trim() || 'Create item, view list of items, update item status';
  const niceToHaves = answers[6]?.trim() || 'Dark mode, export data, reminders';
  const lookAndFeel = answers[7]?.trim() || 'Simple, modern, clean, friendly, and approachable';
  const colorsStyle = answers[8]?.trim() || 'Neutral slate background with vibrant primary blue buttons';
  const screens = answers[9]?.trim() || 'Responsive web browser supporting mobile phones and desktop screens';
  const boundaries = answers[10]?.trim() || 'No complex payment systems, no complicated multi-role logins in v1';

  const appName = customName || deriveAppName(idea, problem);

  // Parse features
  const rawFeatures = mustHaves
    .split(/(?:\d+\.|\n|;)+/)
    .map(f => f.trim())
    .filter(f => f.length > 4);

  const featureItems = rawFeatures.length > 0 ? rawFeatures : [
    'Quick Create / Input Form',
    'Interactive Overview List or Dashboard',
    'Status Toggle and Actions'
  ];

  const featuresAndFunctionality: PRDFeature[] = featureItems.map((f, index) => {
    let name = f.split(/[:,-]/)[0].trim();
    if (name.length > 35) name = name.slice(0, 32) + '...';
    if (!name) name = `Core Feature ${index + 1}`;

    return {
      name,
      whatItDoes: f,
      whoUsesIt: users.slice(0, 80),
      whyItMatters: `Directly addresses the user's primary goal: "${f.slice(0, 60)}" without friction or unnecessary steps.`,
      inputsAndOutputs: `Input: User interaction (form entry, button click, or tap). Output: Immediate UI update and persistent local state.`,
      edgeCases: `Empty input states, duplicate entries, offline or interrupted network connection, extra long text inputs.`,
      acceptanceCriteria: [
        `User can successfully perform this action in under 3 clicks/taps.`,
        `Clear error or helper feedback is shown if required fields are missing.`,
        `Changes are saved immediately and reflect accurately in the UI.`
      ],
      priority: 'Must-Have'
    };
  });

  // Parse nice to have features
  const rawNice = niceToHaves
    .split(/(?:\d+\.|\n|;|,)+/)
    .map(f => f.trim())
    .filter(f => f.length > 3);

  const niceToHaveList = rawNice.length > 0 ? rawNice : [
    'Dark mode display toggle',
    'Export data to CSV or printable format',
    'Browser push or sound notifications'
  ];

  const prd: PRDDocument = {
    appOverview: {
      appName,
      shortSummary: idea,
      problemStatement: problem,
      purpose: `To provide a focused, delightful, and non-overwhelming tool that solves "${problem}" for "${users}" through a simple, reliable MVP.`
    },
    userAndAudience: {
      whoItIsFor: users,
      mainUserNeeds: [
        `Fast, frustration-free way to achieve their goal without learning technical jargon.`,
        `Immediate visual confirmation when an action is completed.`,
        `Seamless accessibility on both phone screens and desktop browsers.`
      ],
      userPainPoints: [
        `Current methods (spreadsheets, paper notes, or bloated software) take too much time and feel clunky.`,
        `Fear of losing track of important items or forgetting critical steps.`,
        `Complicated apps with too many menus, ads, and unneeded settings.`
      ],
      userJourney: `1. User arrives at the app URL. 2. Sees a friendly, clean interface with no login barrier. 3. Immediately completes their main action (${featureItems[0] || 'creates an item'}). 4. Receives clear visual confirmation and leaves happy in under 60 seconds.`
    },
    goalsAndSuccess: {
      mainGoals: [
        `Build a working, intuitive MVP that requires zero tutorials or onboarding manuals.`,
        `Ensure core task completion time is under 2 minutes for a first-time user.`,
        `Keep tech stack simple, open-source, and easy to maintain by beginner builders or AI tools.`
      ],
      whatSuccessLooksLike: `A first-time user lands on the app, understands what it does within 5 seconds, and successfully completes their goal on their phone or laptop with a smile.`,
      measurableOutcomes: [
        `100% of core actions (create, view, toggle) work smoothly on mobile and desktop.`,
        `Zero setup required (works out of the box with zero configuration).`,
        `Page load time under 1.5 seconds on standard mobile connections.`
      ]
    },
    scope: {
      includedInV1: featureItems,
      notIncludedInV1: [
        boundaries,
        'Enterprise permission hierarchies',
        'Complex recurring billing / credit card vaulting in v1',
        'Multi-lingual manual localization'
      ],
      mustHaveFeatures: featureItems,
      niceToHaveFeatures: niceToHaveList
    },
    featuresAndFunctionality,
    uiUxRequirements: {
      generalStyle: lookAndFeel,
      colorDirection: colorsStyle,
      layoutDirection: 'Single-page responsive layout or simple 2-tab navigation with high visual hierarchy.',
      navigationStyle: 'Top app bar with app name, clear action buttons, and mobile bottom bar if on phone screens.',
      keyInteractiveParts: [
        'High-contrast primary action buttons with large tap targets (min 44px)',
        'Clean rounded cards for displaying items with soft shadows',
        'Simple modal or inline form for entering information without leaving the page',
        'Status pills/badges with friendly text and distinct colors'
      ],
      mobileBehavior: 'Thumb-friendly one-handed tapping, full-width inputs, collapsible drawers, no horizontal scrolling.',
      webBrowserBehavior: 'Responsive container (max-w-4xl or max-w-5xl) centered on screen, responsive grid cards, keyboard shortcuts (Enter to submit, Escape to close).',
      accessibilityBasics: [
        'High contrast ratios (WCAG AA compliant) for readability outdoors and in low light.',
        'Proper HTML button and input elements with descriptive labels and aria tags.',
        'Full keyboard navigation support (Tab and Enter).'
      ],
      simpleDesignPreferences: `Clean, modern styling inspired by ${lookAndFeel}. Focused typography, comfortable padding, no cluttered menus or ads.`
    },
    platformAndCompatibility: {
      platformChoice: appType,
      browserSupport: 'All modern web browsers: Chrome, Safari (iOS & macOS), Edge, Firefox.',
      phoneScreenSupport: 'Optimized for small mobile viewports (down to 360px width) up to large 4K displays.',
      offlineOnlineNeeds: 'Online web app with local browser storage fallback (localStorage) so users do not lose their work if their connection drops.'
    },
    technicalPreferences: {
      openSourceTools: [
        'React with Vite (fast, standard, free, open source)',
        'Tailwind CSS (utility-first, responsive, zero bloated CSS files)',
        'Lucide React (lightweight open-source icons)',
        'Browser LocalStorage / SQLite / Supabase or simple REST API'
      ],
      simplicityStatement: 'Strictly avoid bloated enterprise tools. Prefer beginner-friendly, standard web technologies that an AI builder or solo developer can read, test, and ship in a few hours.',
      aiBuilderSuitability: 'High. Clean component architecture, minimal dependencies, standard React hooks, zero proprietary lock-in.',
      stackRecommendation: {
        frontend: 'React + TypeScript + Vite',
        styling: 'Tailwind CSS',
        backendOrStorage: 'Browser LocalStorage for instant zero-server MVP, or lightweight Express / Supabase if multi-user sync is needed.',
        hosting: 'Cloud Run / Vercel / Netlify (Free tier ready)'
      },
      storageAndAuth: 'Version 1: Frictionless guest mode with LocalStorage or simple email link. No password resets or account lockouts.'
    },
    dataAndContent: {
      storedData: [
        'User-created items, titles, timestamps, and notes',
        'App preferences (e.g. view mode, sort order)',
        'Temporary session state'
      ],
      userUploadedContent: 'Text notes and optional image URLs / photos if supported.',
      privacyAndSafety: 'Data remains private to the user. No third-party ad tracking, no invasive telemetry.',
      simpleDataRules: [
        'Sanitize all text inputs to prevent script injection.',
        'Confirm before destructive actions (like permanent deletion).',
        'Store timestamps in standard ISO format.'
      ]
    },
    risksAndConstraints: {
      difficulties: [
        'Scope creep: Temptation to add payments, social feeds, or complex algorithms before testing basic utility.',
        'Cross-device responsive testing on older mobile browsers.'
      ],
      budgetAndTimeLimits: 'Target build time: Under 1 week for MVP. Zero monthly server costs using open-source web stack.',
      missingInformation: [
        'User preference on whether data needs multi-device cloud synchronization or if single-device local storage is preferred for v1.'
      ],
      tradeOffs: [
        'Choosing simple web app over native App Store apps saves months of app review time and $99/year developer fees, but means no native Apple App Store listing initially.'
      ]
    },
    openQuestions: [
      'Will users want to share links with friends or keep all records strictly private?',
      'Is browser localStorage sufficient for version 1, or is cloud login essential right away?'
    ],
    finalBuildSummary: {
      firstThingToBuild: `Build the core single-page UI with "${featureItems[0] || 'the main action'}" and test it immediately on a phone.`,
      simpleMvpPlan: [
        'Day 1: Scaffold React + Vite + Tailwind project with clean responsive layout.',
        'Day 2: Build the core input form and item list with LocalStorage persistence.',
        'Day 3: Add status toggles, deletion confirmation, and mobile touch polish.',
        'Day 4: Test on iPhone and Android mobile browsers; fix spacing and tap targets.',
        'Day 5: Deploy live to free web hosting and share link with 5 initial test users.'
      ],
      bestNextStep: 'Copy the AI Builder Prompt below and paste it into Google AI Studio, Bolt, or Cursor to generate your working app in minutes!'
    }
  };

  // Generate User Stories
  const userStories: UserStory[] = featureItems.map((f, i) => ({
    id: `US-${i + 1}`,
    asA: users,
    iWant: `to ${f.toLowerCase()}`,
    soThat: `I can easily solve my problem (${problem.slice(0, 50)}) without wasting time or getting confused.`,
    acceptanceCriteria: [
      `Given I am on the home screen, when I tap or click, I can complete "${f}" smoothly.`,
      `The system provides immediate visual feedback.`,
      `Data persists across page refreshes.`
    ],
    priority: i === 0 ? 'High' : 'Medium'
  }));

  // Generate Wireframes
  const wireframes: ScreenWireframe[] = [
    {
      screenName: 'Screen 1: Main Home & Overview',
      purpose: 'The central hub where users see their current items and key actions.',
      layoutDescription: 'Clean top header with app title and action button. Below is the main content area with empty state or item cards. Bottom bar on mobile.',
      elements: [
        'Top Header: App Logo/Name + Primary Action Button (+ Add / New)',
        'Summary Bar: Total count of active items or status overview',
        'Main Card Grid/List: Cards showing item name, details, status tag, and action buttons',
        'Empty State Card: Friendly illustration with "Get Started by creating your first item!" when empty',
        'Mobile Bottom Nav: Quick access to Home, Filter, and Settings'
      ],
      asciiSketch: `+-----------------------------------------------+
|  ${appName.padEnd(20)}       [ + Create New ] |
+-----------------------------------------------+
|  Status: 3 Active Items     [ Filter: All v ] |
+-----------------------------------------------+
|  +-----------------------------------------+  |
|  | [Tag] Item Title 1                      |  |
|  | Details: Description text here...       |  |
|  | [ Quick Action Button ]   [ Details > ] |  |
|  +-----------------------------------------+  |
|  +-----------------------------------------+  |
|  | [Tag] Item Title 2                      |  |
|  | Details: Description text here...       |  |
|  | [ Quick Action Button ]   [ Details > ] |  |
|  +-----------------------------------------+  |
+-----------------------------------------------+`
    },
    {
      screenName: 'Screen 2: Create / Add Modal Form',
      purpose: 'Frictionless, focused form to add or edit an item.',
      layoutDescription: 'A clean centered modal on desktop or bottom sheet slide-up on mobile with clear inputs and large Save button.',
      elements: [
        'Modal Header: "Create New Entry" + Close [X] Button',
        'Text Input: Primary Title / Name (autofocused)',
        'Input / Select: Category, date, or frequency picker',
        'Textarea: Notes or extra details (optional)',
        'Action Row: Cancel (secondary) and "Save & Confirm" (primary high-contrast button)'
      ],
      asciiSketch: `+-----------------------------------------------+
|  Create New Entry                         [X] |
+-----------------------------------------------+
|  Title / Name:                                |
|  [ Type here...                             ] |
|                                               |
|  Details or Category:                         |
|  [ Select Option v                          ] |
|                                               |
|  Additional Notes:                            |
|  [ Write any simple notes here...           ] |
|  [                                          ] |
|                                               |
|  [ Cancel ]               [ Save & Confirm ]  |
+-----------------------------------------------+`
    }
  ];

  // Generate AI Builder Prompt
  const aiBuilderPrompt = `You are an expert full-stack engineer building an MVP web application.
Please build a clean, responsive, fully working web application based on this Product Requirements Document:

APP NAME: ${appName}
ONE-SENTENCE PITCH: ${idea}
PROBLEM TO SOLVE: ${problem}
TARGET USERS: ${users}
PLATFORM: ${appType} (Must be mobile-first responsive)

LOOK AND FEEL:
- Vibe: ${lookAndFeel}
- Colors: ${colorsStyle}
- Clean, accessible typography, high contrast, 44px min tap targets, no horizontal scrolling.

CORE FEATURES (Must-Have for v1):
${featureItems.map((f, i) => `${i + 1}. ${f}`).join('\n')}

NICE-TO-HAVE (Include simple versions if straightforward):
${niceToHaveList.map((f, i) => `- ${f}`).join('\n')}

WHAT THE APP SHOULD NOT DO (Strict Boundaries):
- ${boundaries}
- No complex enterprise permissions or multi-step checkout in v1. Keep it dead simple.

TECHNICAL STACK PREFERENCE:
- React + TypeScript + Tailwind CSS + Lucide Icons.
- Store state in browser localStorage with realistic initial sample data so the app looks alive immediately.
- Fast, accessible, no broken buttons or mock placeholders. Everything must be interactive and functional!

Please produce the complete, production-ready code with responsive layout, zero clutter, and beginner-friendly UI.`;

  // Generate Developer Handoff
  const developerHandoff = `# Developer Handoff Notes: ${appName}

## 1. Executive Summary & Architecture
- **Goal:** Launch a simple, high-performing MVP for "${users}" in under 1 week.
- **Architecture:** Client-side React Single Page Application (SPA) with Tailwind CSS.
- **Persistence Strategy:**
  - *Phase 1 (MVP):* HTML5 \`localStorage\` with a lightweight schema wrapper. Zero server maintenance, instant zero-latency feedback.
  - *Phase 2 (Sync):* Supabase / Firebase / SQLite with simple REST/JSON endpoints if user accounts are requested.

## 2. Recommended Open-Source Stack
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS (utility-first, rapid prototyping)
- **Icons:** \`lucide-react\`
- **State Management:** Simple React \`useState\` / \`useReducer\` with custom \`useLocalStorage\` hook.
- **Deployment:** Cloud Run, Vercel, or GitHub Pages.

## 3. Data Schema Draft
\`\`\`typescript
interface ItemRecord {
  id: string; // crypto.randomUUID()
  title: string;
  category?: string;
  notes?: string;
  status: 'active' | 'completed' | 'archived';
  createdAt: string; // ISO 8601
  updatedAt: string;
}
\`\`\`

## 4. Edge Cases to Handle
- Empty state: Display friendly empty card encouraging user to add their first item.
- Long text truncation: Ensure titles don't overflow card borders on 375px screens.
- Accidental deletes: Show a gentle confirmation dialog before removing data.
- Offline behavior: Since data is in localStorage, works 100% offline seamlessly.

## 5. Non-Technical User Friendly Polish
- Big tap targets (minimum 44x44px for thumb tap).
- Clear, plain language labels (no "CRUD", "Entity", "Payload", or tech jargon in UI).
- Immediate feedback (toasts, subtle sound or motion checkmarks).`;

  // Generate Markdown PRD
  const markdownPRD = `# Product Requirements Document (PRD)
## ${appName}
*Generated by AppCraft - Simple PRD Planner for Non-Technical Founders*

---

### 1. App Overview
- **App Name:** ${appName}
- **Short Summary:** ${idea}
- **Problem Statement:** ${problem}
- **Purpose of the App:** ${prd.appOverview.purpose}

---

### 2. User and Audience
- **Who the App is For:** ${users}
- **Main User Needs:**
${prd.userAndAudience.mainUserNeeds.map(n => `  - ${n}`).join('\n')}
- **User Pain Points:**
${prd.userAndAudience.userPainPoints.map(p => `  - ${p}`).join('\n')}
- **User Journey in Simple Words:**
  ${prd.userAndAudience.userJourney}

---

### 3. Goals and Success
- **Main Goals:**
${prd.goalsAndSuccess.mainGoals.map(g => `  - ${g}`).join('\n')}
- **What Success Looks Like:** ${prd.goalsAndSuccess.whatSuccessLooksLike}
- **Simple Measurable Outcomes:**
${prd.goalsAndSuccess.measurableOutcomes.map(m => `  - ${m}`).join('\n')}

---

### 4. Scope
- **What is Included in Version 1:**
${prd.scope.includedInV1.map(i => `  - [x] ${i}`).join('\n')}
- **What is NOT Included in Version 1 (Boundaries):
${prd.scope.notIncludedInV1.map(i => `  - [ ] ${i}`).join('\n')}
- **Must-Have Features:**
${prd.scope.mustHaveFeatures.map(f => `  - ${f}`).join('\n')}
- **Nice-to-Have Features (Future Versions):**
${prd.scope.niceToHaveFeatures.map(f => `  - ${f}`).join('\n')}

---

### 5. Features and Functionality
${featuresAndFunctionality.map((f, i) => `
#### 5.${i + 1} Feature: ${f.name}
- **What it Does:** ${f.whatItDoes}
- **Who Uses It:** ${f.whoUsesIt}
- **Why It Matters:** ${f.whyItMatters}
- **Inputs and Outputs:** ${f.inputsAndOutputs}
- **Possible Edge Cases:** ${f.edgeCases}
- **Simple Acceptance Criteria:**
${f.acceptanceCriteria.map(ac => `  - ${ac}`).join('\n')}
`).join('\n')}

---

### 6. UI/UX Requirements
- **General Style:** ${prd.uiUxRequirements.generalStyle}
- **Color Direction:** ${prd.uiUxRequirements.colorDirection}
- **Layout Direction:** ${prd.uiUxRequirements.layoutDirection}
- **Navigation Style:** ${prd.uiUxRequirements.navigationStyle}
- **Key Interactive Parts:**
${prd.uiUxRequirements.keyInteractiveParts.map(p => `  - ${p}`).join('\n')}
- **Mobile Behavior:** ${prd.uiUxRequirements.mobileBehavior}
- **Web Browser Behavior:** ${prd.uiUxRequirements.webBrowserBehavior}
- **Accessibility Basics:**
${prd.uiUxRequirements.accessibilityBasics.map(a => `  - ${a}`).join('\n')}
- **Simple Design Preferences:** ${prd.uiUxRequirements.simpleDesignPreferences}

---

### 7. Platform and Compatibility
- **Platform:** ${prd.platformAndCompatibility.platformChoice}
- **Browser Support:** ${prd.platformAndCompatibility.browserSupport}
- **Phone Screen Support:** ${prd.platformAndCompatibility.phoneScreenSupport}
- **Offline / Online Needs:** ${prd.platformAndCompatibility.offlineOnlineNeeds}

---

### 8. Technical Preferences
- **Open-Source Tools Preferred:**
${prd.technicalPreferences.openSourceTools.map(t => `  - ${t}`).join('\n')}
- **Simplicity Principle:** ${prd.technicalPreferences.simplicityStatement}
- **Recommended Simple Stack:**
  - Frontend: ${prd.technicalPreferences.stackRecommendation.frontend}
  - Styling: ${prd.technicalPreferences.stackRecommendation.styling}
  - Storage/Backend: ${prd.technicalPreferences.stackRecommendation.backendOrStorage}
  - Hosting: ${prd.technicalPreferences.stackRecommendation.hosting}
- **Storage and Login Strategy:** ${prd.technicalPreferences.storageAndAuth}

---

### 9. Data and Content
- **What Data the App Will Store:**
${prd.dataAndContent.storedData.map(d => `  - ${d}`).join('\n')}
- **User Uploaded Content:** ${prd.dataAndContent.userUploadedContent}
- **Privacy and Safety Concerns:** ${prd.dataAndContent.privacyAndSafety}
- **Simple Data Rules:**
${prd.dataAndContent.simpleDataRules.map(r => `  - ${r}`).join('\n')}

---

### 10. Risks and Constraints
- **Things That May Be Difficult:**
${prd.risksAndConstraints.difficulties.map(d => `  - ${d}`).join('\n')}
- **Budget and Time Limits:** ${prd.risksAndConstraints.budgetAndTimeLimits}
- **Missing Information:**
${prd.risksAndConstraints.missingInformation.map(m => `  - ${m}`).join('\n')}
- **Trade-offs:**
${prd.risksAndConstraints.tradeOffs.map(t => `  - ${t}`).join('\n')}

---

### 11. Open Questions
${prd.openQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}

---

### 12. Final Build Summary
- **First Thing to Build:** ${prd.finalBuildSummary.firstThingToBuild}
- **Simple MVP Plan:**
${prd.finalBuildSummary.simpleMvpPlan.map(s => `  - ${s}`).join('\n')}
- **Best Next Step:** ${prd.finalBuildSummary.bestNextStep}
`;

  return {
    prd,
    markdownPRD,
    aiBuilderPrompt,
    userStories,
    wireframes,
    developerHandoff
  };
}
