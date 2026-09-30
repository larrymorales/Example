import React, { useState } from 'react';
import { MasterQuestion, UserAnswers } from '../types';
import { 
  CheckCircle2, 
  Circle, 
  Edit3, 
  Sparkles, 
  Check, 
  HelpCircle,
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface ReviewAnswersViewProps {
  questions: MasterQuestion[];
  answers: UserAnswers;
  onUpdateAnswer: (qNum: number, answer: string) => void;
  onGeneratePRD: () => void;
  onGoToQuestion: (idx: number) => void;
}

export const ReviewAnswersView: React.FC<ReviewAnswersViewProps> = ({
  questions,
  answers,
  onUpdateAnswer,
  onGeneratePRD,
  onGoToQuestion,
}) => {
  const [editingQNum, setEditingQNum] = useState<number | null>(null);
  const [tempText, setTempText] = useState('');

  const handleStartEdit = (qNum: number, currentAnswer: string) => {
    setEditingQNum(qNum);
    setTempText(currentAnswer || '');
  };

  const handleSaveEdit = (qNum: number) => {
    onUpdateAnswer(qNum, tempText);
    setEditingQNum(null);
  };

  const answeredCount = questions.filter(
    (q) => (answers[q.questionNumber] || '').trim().length > 0
  ).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
              Review & Refine
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {answeredCount} / {questions.length} Answered
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            Your 10 Master Planning Answers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Take a quick look over your answers below. You can tweak any answer or click to build your comprehensive PRD.
          </p>
        </div>

        <button
          onClick={onGeneratePRD}
          className="shrink-0 flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-md shadow-amber-500/25 transition-all transform active:scale-95"
        >
          <Sparkles className="w-4 h-4" />
          <span>Generate Complete PRD</span>
        </button>
      </div>

      {/* 10 Questions Cards List */}
      <div className="space-y-4">
        {questions.map((q, idx) => {
          const answer = answers[q.questionNumber] || '';
          const isAnswered = answer.trim().length > 0;
          const isEditing = editingQNum === q.questionNumber;

          return (
            <div
              key={q.id}
              className={`bg-white rounded-xl border transition-all ${
                isAnswered
                  ? 'border-slate-200/90 shadow-xs'
                  : 'border-dashed border-slate-300 bg-slate-50/50'
              }`}
            >
              <div className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {isAnswered ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <Circle className="w-5 h-5 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
                        Question {q.questionNumber} • {q.title}
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-0.5">
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {!isEditing && (
                    <button
                      onClick={() => handleStartEdit(q.questionNumber, answer)}
                      className="flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100/80 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isAnswered ? 'Edit' : 'Answer'}</span>
                    </button>
                  )}
                </div>

                {/* Content / Edit Area */}
                <div className="mt-3 pl-8">
                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        rows={3}
                        value={tempText}
                        onChange={(e) => setTempText(e.target.value)}
                        placeholder={q.placeholder}
                        className="w-full p-3 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500/20 text-xs sm:text-sm text-slate-900 outline-none"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                          <span className="text-[11px] text-slate-400">Quick defaults:</span>
                          {q.defaultOptions.slice(0, 2).map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setTempText(opt)}
                              className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded truncate max-w-[200px]"
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setEditingQNum(null)}
                            className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveEdit(q.questionNumber)}
                            className="px-4 py-1.5 text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-lg shadow-xs"
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      {isAnswered ? (
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {answer}
                        </p>
                      ) : (
                        <div className="flex items-center justify-between p-2.5 bg-amber-50/50 rounded-lg border border-amber-100">
                          <span className="text-xs text-amber-800/80 italic">
                            Not answered yet. We will make a sensible assumption, or you can add your thoughts.
                          </span>
                          <button
                            onClick={() => onGoToQuestion(idx)}
                            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center gap-1 shrink-0"
                          >
                            <span>Open wizard</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 text-center">
        <button
          onClick={onGeneratePRD}
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-500/25 transition-all transform active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          <span>Looks Great! Build My PRD & Exports</span>
        </button>
      </div>
    </div>
  );
};
