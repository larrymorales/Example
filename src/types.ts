export interface MasterQuestion {
  id: number;
  questionNumber: number;
  title: string;
  question: string;
  simpleExplanation: string;
  analogy: string;
  placeholder: string;
  defaultOptions: string[];
  dontKnowSuggestions: string[];
  complexityTips?: string;
  category: 'idea' | 'users' | 'platform' | 'features' | 'design' | 'boundaries';
}

export interface UserAnswers {
  [questionNumber: number]: string;
}

export interface PRDFeature {
  name: string;
  whatItDoes: string;
  whoUsesIt: string;
  whyItMatters: string;
  inputsAndOutputs: string;
  edgeCases: string;
  acceptanceCriteria: string[];
  priority: 'Must-Have' | 'Nice-to-Have';
}

export interface PRDDocument {
  appOverview: {
    appName: string;
    shortSummary: string;
    problemStatement: string;
    purpose: string;
  };
  userAndAudience: {
    whoItIsFor: string;
    mainUserNeeds: string[];
    userPainPoints: string[];
    userJourney: string;
  };
  goalsAndSuccess: {
    mainGoals: string[];
    whatSuccessLooksLike: string;
    measurableOutcomes: string[];
  };
  scope: {
    includedInV1: string[];
    notIncludedInV1: string[];
    mustHaveFeatures: string[];
    niceToHaveFeatures: string[];
  };
  featuresAndFunctionality: PRDFeature[];
  uiUxRequirements: {
    generalStyle: string;
    colorDirection: string;
    layoutDirection: string;
    navigationStyle: string;
    keyInteractiveParts: string[];
    mobileBehavior: string;
    webBrowserBehavior: string;
    accessibilityBasics: string[];
    simpleDesignPreferences: string;
  };
  platformAndCompatibility: {
    platformChoice: string;
    browserSupport: string;
    phoneScreenSupport: string;
    offlineOnlineNeeds: string;
  };
  technicalPreferences: {
    openSourceTools: string[];
    simplicityStatement: string;
    aiBuilderSuitability: string;
    stackRecommendation: {
      frontend: string;
      styling: string;
      backendOrStorage: string;
      hosting: string;
    };
    storageAndAuth: string;
  };
  dataAndContent: {
    storedData: string[];
    userUploadedContent: string;
    privacyAndSafety: string;
    simpleDataRules: string[];
  };
  risksAndConstraints: {
    difficulties: string[];
    budgetAndTimeLimits: string;
    missingInformation: string[];
    tradeOffs: string[];
  };
  openQuestions: string[];
  finalBuildSummary: {
    firstThingToBuild: string;
    simpleMvpPlan: string[];
    bestNextStep: string;
  };
}

export interface UserStory {
  id: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority: 'High' | 'Medium' | 'Low';
}

export interface ScreenWireframe {
  screenName: string;
  purpose: string;
  layoutDescription: string;
  elements: string[];
  asciiSketch?: string;
}

export interface PRDDeliverables {
  prd: PRDDocument;
  markdownPRD: string;
  aiBuilderPrompt: string;
  userStories: UserStory[];
  wireframes: ScreenWireframe[];
  developerHandoff: string;
}

export interface ExamplePreset {
  id: string;
  name: string;
  tagline: string;
  emoji: string;
  color: string;
  answers: UserAnswers;
}

export interface ChatMessage {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
  timestamp: number;
  questionIndex?: number;
  suggestions?: string[];
  isComplexityWarning?: boolean;
}
