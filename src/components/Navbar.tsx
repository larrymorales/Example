import React from 'react';
import { 
  Sparkles, 
  FileText, 
  Compass, 
  MessageSquare, 
  CheckCircle2, 
  RotateCcw, 
  Download,
  Lightbulb,
  ExternalLink
} from 'lucide-react';
import { EXAMPLE_PRESETS } from '../data/exampleIdeas';
import { ExamplePreset } from '../types';

interface NavbarProps {
  currentTab: 'wizard' | 'chat' | 'review' | 'prd';
  setCurrentTab: (tab: 'wizard' | 'chat' | 'review' | 'prd') => void;
  answeredCount: number;
  totalQuestions: number;
  appName: string;
  onSelectPreset: (preset: ExamplePreset) => void;
  onReset: () => void;
  onGenerateClick: () => void;
  isGenerating: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  answeredCount,
  totalQuestions,
  appName,
  onSelectPreset,
  onReset,
  onGenerateClick,
  isGenerating,
}) => {
  const percentComplete = Math.round((answeredCount / totalQuestions) * 100);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">AppCraft</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                  Beginner Friendly
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Turn rough ideas into developer-ready PRDs</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setCurrentTab('wizard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'wizard'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Compass className="w-4 h-4 text-amber-500" />
              <span>Step-by-Step Wizard</span>
            </button>

            <button
              onClick={() => setCurrentTab('chat')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'chat'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span>Chat with Alex</span>
            </button>

            <button
              onClick={() => setCurrentTab('review')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'review'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Review Answers ({answeredCount}/{totalQuestions})</span>
            </button>

            <button
              onClick={() => setCurrentTab('prd')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentTab === 'prd'
                  ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>View PRD & Exports</span>
            </button>
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Example Ideas Dropdown */}
            <div className="relative group">
              <button 
                type="button"
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
                title="Explore ready-to-test example ideas"
              >
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden lg:inline">Example Ideas</span>
              </button>

              <div className="absolute right-0 mt-1 w-64 p-2 bg-white rounded-xl shadow-xl border border-slate-200 hidden group-hover:block hover:block z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Load a sample app idea:
                </div>
                {EXAMPLE_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => onSelectPreset(preset)}
                    className="w-full text-left p-2 rounded-lg hover:bg-amber-50 transition-colors flex items-start gap-2.5 group/item"
                  >
                    <span className="text-xl p-1 bg-slate-100 group-hover/item:bg-white rounded-md">{preset.emoji}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-800">{preset.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{preset.tagline}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Start over with a blank project"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Generate / View PRD CTA */}
            <button
              onClick={onGenerateClick}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-sm shadow-amber-500/25 transition-all transform active:scale-95 disabled:opacity-60"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Creating PRD...' : 'Generate PRD'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 overflow-x-auto gap-2">
          <button
            onClick={() => setCurrentTab('wizard')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 ${
              currentTab === 'wizard' ? 'bg-amber-100 text-amber-900' : 'text-slate-600'
            }`}
          >
            🧭 Wizard
          </button>
          <button
            onClick={() => setCurrentTab('chat')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 ${
              currentTab === 'chat' ? 'bg-blue-100 text-blue-900' : 'text-slate-600'
            }`}
          >
            💬 Chat
          </button>
          <button
            onClick={() => setCurrentTab('review')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 ${
              currentTab === 'review' ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600'
            }`}
          >
            📝 Answers ({answeredCount}/{totalQuestions})
          </button>
          <button
            onClick={() => setCurrentTab('prd')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 ${
              currentTab === 'prd' ? 'bg-amber-500 text-white' : 'text-slate-600'
            }`}
          >
            📄 PRD
          </button>
        </div>
      </div>

      {/* Progress Bar across the bottom of the navbar */}
      <div className="w-full bg-slate-100 h-1">
        <div 
          className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-500 transition-all duration-300"
          style={{ width: `${percentComplete}%` }}
        />
      </div>
    </header>
  );
};
