import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MASTER_QUESTIONS } from './src/data/masterQuestions';
import { synthesizePRDFromAnswers } from './src/utils/prdSynthesizer';
import { UserAnswers } from './src/types';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI if key is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('[Server] Gemini API client initialized successfully.');
  } catch (err) {
    console.warn('[Server] Error initializing Gemini client:', err);
  }
} else {
  console.log('[Server] No GEMINI_API_KEY found in environment; running with built-in heuristic AI engine.');
}

// 1. Chat & Refinement Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  const { questionIndex, userMessage, answers } = req.body;
  const currentQ = MASTER_QUESTIONS[questionIndex] || MASTER_QUESTIONS[0];

  if (!ai) {
    // High-quality deterministic fallback
    const isTooVague = !userMessage || userMessage.trim().length < 5;
    const isIdk = /don't know|not sure|no idea|idk|whatever|you decide/i.test(userMessage || '');
    const isComplex = /crypto|blockchain|social network|machine learning|live video streaming|uber for|complex/i.test(userMessage || '');

    let reply = `That makes a lot of sense! `;
    let refinement = userMessage?.trim() || '';
    let suggestions = currentQ.defaultOptions.slice(0, 3);
    let isComplexityWarning = false;
    let simplerAlternative = '';

    if (isIdk) {
      reply = `No worries at all! That is completely normal. Here are a few simple choices that work wonderfully:`;
      suggestions = currentQ.dontKnowSuggestions;
    } else if (isComplex) {
      isComplexityWarning = true;
      simplerAlternative = `Start with a clean 1-page web app with simple email alerts or local storage instead of complex infrastructure.`;
      reply = `That sounds very ambitious! However, for our first simple version, building that might be a bit slow or expensive. How about we try a simpler version first?`;
    } else if (isTooVague) {
      reply = `Got it! Could you tell me just a tiny bit more? For example, ${currentQ.simpleExplanation}`;
      suggestions = currentQ.defaultOptions.slice(0, 3);
    } else {
      reply = `Great answer for "${currentQ.title}"! I've recorded this. Whenever you're ready, let's look at question ${questionIndex + 2} of 10.`;
    }

    return res.json({
      reply,
      refinement,
      suggestedOptions: suggestions,
      isComplexityWarning,
      simplerAlternative
    });
  }

  try {
    const prompt = `You are a helpful, patient product-planning assistant for non-technical people.
Your job is to help the user turn a rough app idea into a very detailed Product Requirements Document (PRD) for a simple app.

Your style must be:
- very simple
- very clear
- friendly
- guiding
- non-technical unless necessary
- patient with beginners

Current Master Question (${questionIndex + 1} of 10):
Title: "${currentQ.title}"
Question: "${currentQ.question}"
Simple Meaning: "${currentQ.simpleExplanation}"

User's response: "${userMessage}"
Previous collected answers: ${JSON.stringify(answers || {})}

Analyze the user's answer:
1. If the user says "I don't know", is confused, or gives a vague answer: explain gently in plain words and offer 2 to 4 simple, realistic options.
2. If the user's idea or feature is too complex for a simple MVP (e.g. building their own payments processor, complex AI video pipeline, multi-tenant enterprise system, native 3D game): gently explain why that might be too hard or expensive for v1, and suggest a simple MVP version.
3. If the answer is good: warmly validate it, give a polished 1-sentence version of their answer, and provide 2-3 neat enhancement suggestions or follow-ups.

Respond in valid JSON only with this exact format:
{
  "reply": "Friendly 1-3 sentence response in simple language",
  "refinement": "A clean, crisp 1-sentence version of their answer for the PRD",
  "suggestedOptions": ["option 1", "option 2", "option 3"],
  "isComplexityWarning": boolean,
  "simplerAlternative": "A simpler MVP version if isComplexityWarning is true, otherwise empty"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const text = response.text || '{}';
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error) {
    console.error('[Server] Gemini chat error:', error);
    return res.json({
      reply: `Got it! That sounds clear and practical for "${currentQ.title}".`,
      refinement: userMessage,
      suggestedOptions: currentQ.defaultOptions.slice(0, 3),
      isComplexityWarning: false
    });
  }
});

// 2. Suggest Options Endpoint
app.post('/api/suggest-options', async (req: Request, res: Response) => {
  const { questionIndex, answers } = req.body;
  const currentQ = MASTER_QUESTIONS[questionIndex] || MASTER_QUESTIONS[0];

  if (!ai) {
    return res.json({
      suggestions: currentQ.dontKnowSuggestions
    });
  }

  try {
    const prompt = `The user is answering Question ${questionIndex + 1}: "${currentQ.question}".
App idea so far: ${JSON.stringify(answers || {})}

The user clicked "I don't know / Give me easy choices".
Suggest 3 very simple, realistic, beginner-friendly options for this specific question tailored to their app.
Respond in JSON: { "suggestions": ["string", "string", "string"] }`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.6,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    return res.json({ suggestions: currentQ.dontKnowSuggestions });
  }
});

// 3. Generate Complete PRD Endpoint
app.post('/api/generate-prd', async (req: Request, res: Response) => {
  const { answers, customAppName } = req.body as { answers: UserAnswers; customAppName?: string };

  // Always compute base PRD deliverables using local synthesizer as ground truth
  const baseDeliverables = synthesizePRDFromAnswers(answers, customAppName);

  if (!ai) {
    return res.json(baseDeliverables);
  }

  try {
    const prompt = `You are a world-class senior product manager and startup architect.
Review the following user answers to the 10 Master Product Planning questions:
${JSON.stringify(answers, null, 2)}

Your task is to review and enhance this Product Requirements Document (PRD) for a simple app.
Requirements:
- Style: Very simple, clear, friendly, non-technical unless necessary.
- Prefer simple, easy-to-build, and open-source tools (React, Vite, Tailwind, LocalStorage/Supabase/SQLite).
- Keep the app small and practical (simple MVP first).
- Detail enough for an AI builder, no-code builder, or developer to start building immediately.

Return a JSON object with:
{
  "appName": "Creative, catchy name for the app",
  "appOverview": {
    "appName": "string",
    "shortSummary": "string",
    "problemStatement": "string",
    "purpose": "string"
  },
  "userAndAudience": {
    "whoItIsFor": "string",
    "mainUserNeeds": ["string", "string", "string"],
    "userPainPoints": ["string", "string", "string"],
    "userJourney": "string"
  },
  "goalsAndSuccess": {
    "mainGoals": ["string", "string", "string"],
    "whatSuccessLooksLike": "string",
    "measurableOutcomes": ["string", "string", "string"]
  },
  "scope": {
    "includedInV1": ["string", "string", "string"],
    "notIncludedInV1": ["string", "string", "string"],
    "mustHaveFeatures": ["string", "string", "string"],
    "niceToHaveFeatures": ["string", "string", "string"]
  },
  "featuresAndFunctionality": [
    {
      "name": "Feature Name",
      "whatItDoes": "string",
      "whoUsesIt": "string",
      "whyItMatters": "string",
      "inputsAndOutputs": "string",
      "edgeCases": "string",
      "acceptanceCriteria": ["string", "string"],
      "priority": "Must-Have"
    }
  ],
  "uiUxRequirements": {
    "generalStyle": "string",
    "colorDirection": "string",
    "layoutDirection": "string",
    "navigationStyle": "string",
    "keyInteractiveParts": ["string", "string", "string"],
    "mobileBehavior": "string",
    "webBrowserBehavior": "string",
    "accessibilityBasics": ["string", "string"],
    "simpleDesignPreferences": "string"
  },
  "platformAndCompatibility": {
    "platformChoice": "string",
    "browserSupport": "string",
    "phoneScreenSupport": "string",
    "offlineOnlineNeeds": "string"
  },
  "technicalPreferences": {
    "openSourceTools": ["string", "string", "string"],
    "simplicityStatement": "string",
    "aiBuilderSuitability": "string",
    "stackRecommendation": {
      "frontend": "React + TypeScript + Vite",
      "styling": "Tailwind CSS",
      "backendOrStorage": "LocalStorage or lightweight Supabase/SQLite",
      "hosting": "Cloud Run / Vercel"
    },
    "storageAndAuth": "string"
  },
  "dataAndContent": {
    "storedData": ["string", "string"],
    "userUploadedContent": "string",
    "privacyAndSafety": "string",
    "simpleDataRules": ["string", "string"]
  },
  "risksAndConstraints": {
    "difficulties": ["string", "string"],
    "budgetAndTimeLimits": "string",
    "missingInformation": ["string"],
    "tradeOffs": ["string"]
  },
  "openQuestions": ["string", "string"],
  "finalBuildSummary": {
    "firstThingToBuild": "string",
    "simpleMvpPlan": ["Day 1...", "Day 2...", "Day 3...", "Day 4...", "Day 5..."],
    "bestNextStep": "string"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.5,
      },
    });

    const parsedPRD = JSON.parse(response.text || '{}');
    if (parsedPRD && parsedPRD.appOverview) {
      // Re-synthesize markdown and prompt with the AI-enhanced PRD
      const enrichedDeliverables = synthesizePRDFromAnswers({
        ...answers,
        1: parsedPRD.appOverview.shortSummary || answers[1],
        2: parsedPRD.appOverview.problemStatement || answers[2],
        3: parsedPRD.userAndAudience.whoItIsFor || answers[3],
        5: parsedPRD.scope.mustHaveFeatures.join('; ') || answers[5],
        6: parsedPRD.scope.niceToHaveFeatures.join('; ') || answers[6],
      }, parsedPRD.appName || customAppName);

      enrichedDeliverables.prd = {
        ...enrichedDeliverables.prd,
        ...parsedPRD,
      };

      return res.json(enrichedDeliverables);
    }

    return res.json(baseDeliverables);
  } catch (err) {
    console.error('[Server] Gemini PRD synthesis failed, using local synthesizer:', err);
    return res.json(baseDeliverables);
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const isHmrDisabled = process.env.DISABLE_HMR !== 'false';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Server] AppCraft server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[Server] Failed to start server:', err);
});
