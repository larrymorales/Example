import React, { useState } from 'react';
import { 
  MasterQuestion, 
  UserAnswers 
} from '../types';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  HelpCircle, 
  Lightbulb, 
  Sparkles, 
  Scissors, 
  Info,
  ChevronDown,
  ChevronUp,
  Wand2
} from 'lucide-react';

interface WizardViewProps {
  questions: MasterQuestion[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  answers: UserAnswers;
  onUpdateAnswer: (qNum: number, answer: string) => void;
  onGeneratePRD: () => void;
  onRefineWithAI: (qNum: number, currentText: string) => Promise<string | null>;
  isRefining: boolean;
}

export const WizardView: React.FC<WizardViewProps> = ({
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  answers,
  onUpdateAnswer,
  onGeneratePRD,
  onRefineWithAI,
  isRefining,
}) => {
  const currentQ = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQ.questionNumber] || '';
  const [showAnalogy, setShowAnalogy] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [complexityNotice, setComplexityNotice] = useState<string | null>(null);

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      onGeneratePRD();
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSelectOption = (opt: string) => {
    onUpdateAnswer(currentQ.questionNumber, opt);
  };

  const handleAppendOption = (opt: string) => {
    if (!currentAnswer.trim()) {
      onUpdateAnswer(currentQ.questionNumber, opt);
    } else {
      onUpdateAnswer(currentQ.questionNumber, `${currentAnswer.trim()}; ${opt}`);
    }
  };

  const handleDontKnow = () => {
    const defaultSuggestion = currentQ.dontKnowSuggestions[0] || currentQ.defaultOptions[0];
    onUpdateAnswer(currentQ.questionNumber, defaultSuggestion);
  };

  const handleCheckComplexity = () => {
    // Client-side quick check
    const text = currentAnswer.toLowerCase();
    if (
      text.includes('crypto') ||
      text.includes('blockchain') ||
      text.includes('social network') ||
      text.includes('live stream') ||
      text.includes('ai video') ||
      text.includes('payment gateway') ||
      text.includes('credit card') ||
      text.includes('uber for')
    ) {
      setComplexityNotice(
        '💡 Pro Tip for Beginners: This feature sounds exciting, but payment processing and live servers can add weeks of work and monthly bills. For version 1, we strongly recommend keeping it free, local, or using a simple email link/form!'
      );
    } else {
      setComplexityNotice(
        '✨ Awesome! Your idea sounds super clean, practical, and fast to build as a simple MVP. It is right in the sweet spot for a beginner builder or AI agent.'
      );
    }
  };

  const handleRefine = async () => {
    if (!currentAnswer.trim()) return;
    const refined = await onRefineWithAI(currentQ.questionNumber, currentAnswer);
    if (refined) {
      onUpdateAnswer(currentQ.questionNumber, refined);
    }
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = currentAnswer.trim().length > 0;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Step Indicators Top Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2">
          <span>Question {currentQ.questionNumber} of {questions.length}</span>
          <span className="capitalize px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
            {currentQ.category}
          </span>
        </div>

        {/* Step dots */}
        <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
          {questions.map((q, idx) => {
            const hasAnswer = (answers[q.questionNumber] || '').trim().length > 0;
            const isCurrent = idx === currentQuestionIndex;

            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-2 sm:h-2.5 rounded-full transition-all duration-200 relative group ${
                  isCurrent
                    ? 'bg-amber-500 ring-2 ring-amber-300 ring-offset-1'
                    : hasAnswer
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-slate-200 hover:bg-slate-300'
                }`}
                title={`Q${q.questionNumber}: ${q.title}`}
              >
                <span className="absolute -top-7 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap z-30">
                  Q{q.questionNumber}: {q.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 transition-all">
        {/* Title & Badge */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <span className="text-xs font-bold text-amber-600 tracking-wider uppercase">
              Step {currentQ.questionNumber} • {currentQ.title}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
              {currentQ.question}
            </h2>
          </div>
        </div>

        {/* Everyday Analogy Box */}
        {currentQ.analogy && showAnalogy && (
          <div className="mb-5 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl flex items-start gap-3 text-xs sm:text-sm text-amber-900">
            <span className="text-lg shrink-0">💡</span>
            <div className="flex-1">
              <span className="font-semibold text-amber-950">Everyday Picture: </span>
              {currentQ.analogy}
            </div>
            <button
              onClick={() => setShowAnalogy(false)}
              className="text-amber-700/60 hover:text-amber-900 text-xs shrink-0"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        )}

        {/* Expandable Explanation */}
        <div className="mb-5">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>Need more clarification? Click to explain in simple words</span>
            {showExplanation ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {showExplanation && (
            <div className="mt-2.5 p-3.5 bg-blue-50/70 border border-blue-200/70 rounded-xl text-xs sm:text-sm text-blue-900 animate-in fade-in duration-200">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">{currentQ.simpleExplanation}</p>
                  {currentQ.complexityTips && (
                    <p className="mt-1.5 text-blue-800/90 text-xs font-normal">
                      🎯 <strong className="font-semibold">Simplicity Rule:</strong> {currentQ.complexityTips}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Answer Text Area */}
        <div className="relative mb-4">
          <textarea
            rows={4}
            value={currentAnswer}
            onChange={(e) => onUpdateAnswer(currentQ.questionNumber, e.target.value)}
            placeholder={currentQ.placeholder}
            className="w-full p-4 rounded-xl border border-slate-300 focus:border-amber-500 focus:ring-3 focus:ring-amber-500/20 text-slate-900 text-sm sm:text-base placeholder:text-slate-400 outline-none transition-all resize-y shadow-xs"
          />

          {/* Quick Helper Floating Buttons inside or under */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDontKnow}
                className="text-xs font-medium text-slate-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-100/70 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                title="Fill with a sensible beginner recommendation"
              >
                <span>❓ I don't know (Pick for me)</span>
              </button>

              <button
                type="button"
                onClick={handleCheckComplexity}
                className="text-xs font-medium text-slate-600 hover:text-purple-700 bg-slate-100 hover:bg-purple-50 px-2.5 py-1.5 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                title="Check if this idea is simple enough for an MVP"
              >
                <Scissors className="w-3.5 h-3.5 text-purple-500" />
                <span className="hidden sm:inline">Is this too complex?</span>
              </button>
            </div>

            {currentAnswer.trim() && (
              <button
                type="button"
                onClick={handleRefine}
                disabled={isRefining}
                className="text-xs font-medium text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors flex items-center gap-1.5"
                title="Polish this answer with AI"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isRefining ? 'animate-spin' : ''}`} />
                <span>{isRefining ? 'Polishing...' : 'Polish answer'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Complexity Feedback Box if triggered */}
        {complexityNotice && (
          <div className="mb-4 p-3 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-800 flex items-start justify-between gap-2">
            <div>{complexityNotice}</div>
            <button
              onClick={() => setComplexityNotice(null)}
              className="text-slate-400 hover:text-slate-600 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Suggested Choices / Example Chips */}
        <div className="mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2.5">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Click any example to insert or get inspired:</span>
          </div>

          <div className="flex flex-col gap-2">
            {currentQ.defaultOptions.map((opt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSelectOption(opt)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-200/90 hover:border-amber-300 hover:bg-amber-50/50 text-xs sm:text-sm text-slate-700 transition-all flex items-start justify-between group"
              >
                <span className="flex-1 pr-2">{opt}</span>
                <span className="text-[11px] font-semibold text-amber-600 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity">
                  Use this ↵
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="mt-8 pt-5 border-t border-slate-200 flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {!isAnswered && (
              <button
                type="button"
                onClick={handleNext}
                className="text-xs text-slate-400 hover:text-slate-600 px-3 py-2"
              >
                Skip for now
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all transform active:scale-95 shadow-md ${
                isLastQuestion
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-500/20'
              }`}
            >
              <span>{isLastQuestion ? 'Review & Build PRD' : 'Save & Next'}</span>
              {isLastQuestion ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
