/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { MASTER_QUESTIONS } from './data/masterQuestions';
import { EXAMPLE_PRESETS } from './data/exampleIdeas';
import { UserAnswers, PRDDeliverables, ExamplePreset } from './types';
import { synthesizePRDFromAnswers } from './utils/prdSynthesizer';
import { Navbar } from './components/Navbar';
import { WizardView } from './components/WizardView';
import { ChatAssistantView } from './components/ChatAssistantView';
import { ReviewAnswersView } from './components/ReviewAnswersView';
import { PRDViewer } from './components/PRDViewer';
import { 
  Sparkles, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  MessageSquare,
  ShieldCheck,
  Zap,
  HelpCircle
} from 'lucide-react';

const STORAGE_KEY = 'appcraft_answers_v1';
const CURRENT_TAB_KEY = 'appcraft_tab_v1';

export default function App() {
  const [answers, setAnswers] = useState<UserAnswers>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [currentTab, setCurrentTab] = useState<'wizard' | 'chat' | 'review' | 'prd'>('wizard');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [deliverables, setDeliverables] = useState<PRDDeliverables | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Sync answers with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
    } catch (e) {
      console.warn('Could not save to localStorage', e);
    }
  }, [answers]);

  const answeredCount = MASTER_QUESTIONS.filter(
    (q) => (answers[q.questionNumber] || '').trim().length > 0
  ).length;

  const handleUpdateAnswer = (qNum: number, text: string) => {
    setAnswers((prev) => ({
      ...prev,
      [qNum]: text,
    }));
  };

  const handleSelectPreset = (preset: ExamplePreset) => {
    setAnswers(preset.answers);
    const initialPRD = synthesizePRDFromAnswers(preset.answers, preset.name);
    setDeliverables(initialPRD);
    setCurrentTab('wizard');
    setCurrentQuestionIndex(0);
  };

  const handleGeneratePRD = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-prd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      });

      if (response.ok) {
        const data = await response.json();
        setDeliverables(data);
      } else {
        // Fallback to local synthesizer
        const local = synthesizePRDFromAnswers(answers);
        setDeliverables(local);
      }
    } catch (err) {
      console.warn('Network error during PRD generation, using local synthesizer', err);
      const local = synthesizePRDFromAnswers(answers);
      setDeliverables(local);
    } finally {
      setIsGenerating(false);
      setCurrentTab('prd');
    }
  };

  const handleRefineWithAI = async (qNum: number, currentText: string): Promise<string | null> => {
    setIsRefining(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: qNum - 1,
          userMessage: currentText,
          answers,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.refinement || null;
      }
    } catch (e) {
      console.warn('Refinement error', e);
    } finally {
      setIsRefining(false);
    }
    return null;
  };

  const handleReset = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setAnswers({});
    setDeliverables(null);
    setCurrentQuestionIndex(0);
    setCurrentTab('wizard');
    setShowResetConfirm(false);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  const currentAppName = deliverables?.prd.appOverview.appName || 'My Simple App';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        answeredCount={answeredCount}
        totalQuestions={MASTER_QUESTIONS.length}
        appName={currentAppName}
        onSelectPreset={handleSelectPreset}
        onReset={handleReset}
        onGenerateClick={handleGeneratePRD}
        isGenerating={isGenerating}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Welcome Hero Banner (Only shown if user has answered 0 questions and is on wizard) */}
        {answeredCount === 0 && currentTab === 'wizard' && currentQuestionIndex === 0 && (
          <div className="max-w-3xl mx-auto px-4 pt-6">
            <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-amber-400/10 border border-amber-200/80 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-amber-500/20 shrink-0">
                  ✨
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Welcome to your friendly Product Planning assistant!
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                    Have an idea for an app but don't know where to start? We will guide you through <strong>10 simple questions</strong> in plain, everyday English. At the end, you'll have a complete, professional Product Requirements Document (PRD), wireframes, and a ready-to-use prompt for AI app builders!
                  </p>

                  <div className="mt-4 pt-4 border-t border-amber-200/60">
                    <span className="text-xs font-bold text-amber-900 block mb-2">
                      💡 Want to see an example first? Click one to test:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {EXAMPLE_PRESETS.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => handleSelectPreset(preset)}
                          className="p-2.5 bg-white/90 hover:bg-white border border-amber-200 hover:border-amber-300 rounded-xl text-left transition-all hover:shadow-xs group"
                        >
                          <span className="text-lg block mb-0.5">{preset.emoji}</span>
                          <span className="text-xs font-bold text-slate-800 block truncate group-hover:text-amber-800">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {preset.tagline}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 1: Wizard View */}
        {currentTab === 'wizard' && (
          <WizardView
            questions={MASTER_QUESTIONS}
            currentQuestionIndex={currentQuestionIndex}
            setCurrentQuestionIndex={setCurrentQuestionIndex}
            answers={answers}
            onUpdateAnswer={handleUpdateAnswer}
            onGeneratePRD={handleGeneratePRD}
            onRefineWithAI={handleRefineWithAI}
            isRefining={isRefining}
          />
        )}

        {/* Tab 2: Chat Assistant View */}
        {currentTab === 'chat' && (
          <ChatAssistantView
            questions={MASTER_QUESTIONS}
            answers={answers}
            onUpdateAnswer={handleUpdateAnswer}
            onGeneratePRD={handleGeneratePRD}
          />
        )}

        {/* Tab 3: Review Answers View */}
        {currentTab === 'review' && (
          <ReviewAnswersView
            questions={MASTER_QUESTIONS}
            answers={answers}
            onUpdateAnswer={handleUpdateAnswer}
            onGeneratePRD={handleGeneratePRD}
            onGoToQuestion={(idx) => {
              setCurrentQuestionIndex(idx);
              setCurrentTab('wizard');
            }}
          />
        )}

        {/* Tab 4: PRD Studio & Exports View */}
        {currentTab === 'prd' && deliverables && (
          <PRDViewer
            deliverables={deliverables}
            onBackToEdit={() => setCurrentTab('review')}
            onRegenerate={handleGeneratePRD}
            isRegenerating={isGenerating}
          />
        )}

        {/* Fallback if user clicked PRD tab before generating */}
        {currentTab === 'prd' && !deliverables && (
          <div className="max-w-md mx-auto px-4 py-16 text-center">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Ready to build your PRD?</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
              You've answered {answeredCount} of {MASTER_QUESTIONS.length} questions. You can generate your PRD now, and we'll fill in any missing details with smart defaults.
            </p>
            <button
              onClick={handleGeneratePRD}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing PRD...' : 'Generate PRD Now'}</span>
            </button>
          </div>
        )}
      </main>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900">Start over with a clean slate?</h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              This will clear your current answers so you can plan a completely new app idea.
            </p>
            <div className="flex items-center justify-end gap-2.5 mt-6">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmReset}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 shadow-xs"
              >
                Clear & Start Over
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
