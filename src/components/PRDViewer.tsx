import React, { useState } from 'react';
import { PRDDeliverables, PRDFeature } from '../types';
import { 
  FileText, 
  Copy, 
  Download, 
  Printer, 
  Check, 
  Bot, 
  Layers, 
  Code, 
  ListCheck, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Smartphone,
  ShieldAlert,
  HelpCircle,
  Calendar,
  CheckCircle2,
  ArrowRight,
  RefreshCw,
  Palette
} from 'lucide-react';

interface PRDViewerProps {
  deliverables: PRDDeliverables;
  onBackToEdit: () => void;
  onRegenerate: () => void;
  isRegenerating: boolean;
}

export const PRDViewer: React.FC<PRDViewerProps> = ({
  deliverables,
  onBackToEdit,
  onRegenerate,
  isRegenerating,
}) => {
  const { prd, markdownPRD, aiBuilderPrompt, userStories, wireframes, developerHandoff } = deliverables;
  const [activeTab, setActiveTab] = useState<'prd' | 'prompt' | 'stories' | 'wireframes' | 'handoff' | 'matrix'>('prd');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    s1: true,
    s2: true,
    s3: true,
    s4: true,
    s5: true,
    s6: true,
    s7: true,
    s8: true,
    s9: true,
    s10: true,
    s11: true,
    s12: true,
  });

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownPRD], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${prd.appOverview.appName.toLowerCase().replace(/\s+/g, '-')}-prd.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Top Banner / Actions Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs mb-6 no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                PRD Ready to Build
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">12 Complete Sections</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
              {prd.appOverview.appName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
              {prd.appOverview.shortSummary}
            </p>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => copyToClipboard(markdownPRD, 'all-md')}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Copy complete markdown document"
            >
              {copiedKey === 'all-md' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-600" />}
              <span>{copiedKey === 'all-md' ? 'Copied Markdown!' : 'Copy Markdown'}</span>
            </button>

            <button
              onClick={downloadMarkdown}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Download as a .md file"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Download .md</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={onRegenerate}
              disabled={isRegenerating}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors"
              title="Regenerate with AI"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Polishing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={onBackToEdit}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              <span>← Edit Answers</span>
            </button>
          </div>
        </div>

        {/* Sub-Tabs Navigation */}
        <div className="flex items-center gap-1.5 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
          <button
            onClick={() => setActiveTab('prd')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'prd'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full 12-Section PRD</span>
          </button>

          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'prompt'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Builder Prompt</span>
            <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 text-[10px] rounded-full font-bold">1-Click</span>
          </button>

          <button
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'stories'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ListCheck className="w-3.5 h-3.5" />
            <span>User Stories</span>
          </button>

          <button
            onClick={() => setActiveTab('wireframes')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'wireframes'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Wireframe Outlines</span>
          </button>

          <button
            onClick={() => setActiveTab('handoff')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              activeTab === 'handoff'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>Developer Handoff</span>
          </button>
        </div>
      </div>

      {/* TAB 1: FULL 12-SECTION PRD */}
      {activeTab === 'prd' && (
        <div className="space-y-6">
          {/* Section 1: App Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s1')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">1</span>
                <h2 className="text-lg font-bold text-slate-900">App Overview</h2>
              </div>
              {expandedSections.s1 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s1 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700">App Name: </span>
                  <span className="text-slate-900 font-bold">{prd.appOverview.appName}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Short Summary: </span>
                  <span className="text-slate-800">{prd.appOverview.shortSummary}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Problem Statement: </span>
                  <span className="text-slate-800">{prd.appOverview.problemStatement}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Purpose of the App: </span>
                  <span className="text-slate-800">{prd.appOverview.purpose}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: User and Audience */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s2')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center">2</span>
                <h2 className="text-lg font-bold text-slate-900">User and Audience</h2>
              </div>
              {expandedSections.s2 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s2 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700">Who the App is For: </span>
                  <span className="text-slate-800">{prd.userAndAudience.whoItIsFor}</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Main User Needs:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.userAndAudience.mainUserNeeds.map((need, i) => (
                      <li key={i}>{need}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">User Pain Points:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.userAndAudience.userPainPoints.map((pain, i) => (
                      <li key={i}>{pain}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-xl">
                  <span className="font-semibold text-blue-950 block mb-1">User Journey in Simple Words:</span>
                  <p className="text-blue-900 leading-relaxed">{prd.userAndAudience.userJourney}</p>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Goals and Success */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s3')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center">3</span>
                <h2 className="text-lg font-bold text-slate-900">Goals and Success</h2>
              </div>
              {expandedSections.s3 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s3 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Main Goals:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.goalsAndSuccess.mainGoals.map((g, i) => (
                      <li key={i}>{g}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">What Success Looks Like: </span>
                  <span className="text-slate-800">{prd.goalsAndSuccess.whatSuccessLooksLike}</span>
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Simple Measurable Outcomes:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.goalsAndSuccess.measurableOutcomes.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 4: Scope */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s4')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 font-bold text-xs flex items-center justify-center">4</span>
                <h2 className="text-lg font-bold text-slate-900">Scope (Version 1 Boundaries)</h2>
              </div>
              {expandedSections.s4 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s4 && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                  <div className="font-bold text-emerald-950 mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Included in Version 1 (Must-Haves)</span>
                  </div>
                  <ul className="space-y-1.5 text-emerald-900">
                    {prd.scope.mustHaveFeatures.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold">•</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-500" />
                    <span>NOT in Version 1 (Strict Boundaries)</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-600">
                    {prd.scope.notIncludedInV1.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="font-bold text-slate-400">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="md:col-span-2 p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <span className="font-bold text-amber-950 block mb-1">Nice-to-Have Features (Version 2+ Roadmap):</span>
                  <ul className="list-disc list-inside space-y-1 text-amber-900">
                    {prd.scope.niceToHaveFeatures.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Features and Functionality */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s5')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-orange-100 text-orange-800 font-bold text-xs flex items-center justify-center">5</span>
                <h2 className="text-lg font-bold text-slate-900">Features and Functionality</h2>
              </div>
              {expandedSections.s5 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s5 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
                {prd.featuresAndFunctionality.map((feature, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2.5 text-xs sm:text-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-xs font-semibold">
                          5.{i + 1}
                        </span>
                        <span>{feature.name}</span>
                      </h3>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        {feature.priority}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 text-slate-700">
                      <div>
                        <strong className="text-slate-900 font-semibold">What it does: </strong>
                        {feature.whatItDoes}
                      </div>
                      <div>
                        <strong className="text-slate-900 font-semibold">Who uses it: </strong>
                        {feature.whoUsesIt}
                      </div>
                      <div>
                        <strong className="text-slate-900 font-semibold">Why it matters: </strong>
                        {feature.whyItMatters}
                      </div>
                      <div>
                        <strong className="text-slate-900 font-semibold">Inputs & Outputs: </strong>
                        {feature.inputsAndOutputs}
                      </div>
                      <div className="sm:col-span-2">
                        <strong className="text-slate-900 font-semibold">Possible edge cases: </strong>
                        {feature.edgeCases}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60">
                      <span className="font-semibold text-slate-900 block mb-1">Simple Acceptance Criteria:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-600">
                        {feature.acceptanceCriteria.map((ac, j) => (
                          <li key={j}>{ac}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: UI/UX Requirements */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s6')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-pink-100 text-pink-800 font-bold text-xs flex items-center justify-center">6</span>
                <h2 className="text-lg font-bold text-slate-900">UI/UX Requirements</h2>
              </div>
              {expandedSections.s6 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s6 && (
              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block">General Style:</span>
                  <span className="text-slate-800">{prd.uiUxRequirements.generalStyle}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Color Direction:</span>
                  <span className="text-slate-800">{prd.uiUxRequirements.colorDirection}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Layout Direction:</span>
                  <span className="text-slate-800">{prd.uiUxRequirements.layoutDirection}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Navigation Style:</span>
                  <span className="text-slate-800">{prd.uiUxRequirements.navigationStyle}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-700 block mb-1">Key Interactive Parts:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.uiUxRequirements.keyInteractiveParts.map((part, i) => (
                      <li key={i}>{part}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Mobile Phone Behavior:</span>
                  <span className="text-slate-800">{prd.uiUxRequirements.mobileBehavior}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block">Desktop Browser Behavior:</span>
                  <span className="text-slate-800">{prd.uiUxRequirements.webBrowserBehavior}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="font-semibold text-slate-700 block mb-1">Accessibility Basics:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.uiUxRequirements.accessibilityBasics.map((acc, i) => (
                      <li key={i}>{acc}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 7: Platform and Compatibility */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s7')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center">7</span>
                <h2 className="text-lg font-bold text-slate-900">Platform and Compatibility</h2>
              </div>
              {expandedSections.s7 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s7 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700">Platform Choice: </span>
                  <span className="text-slate-900 font-semibold">{prd.platformAndCompatibility.platformChoice}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Browser Support: </span>
                  <span className="text-slate-800">{prd.platformAndCompatibility.browserSupport}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Phone Screen Support: </span>
                  <span className="text-slate-800">{prd.platformAndCompatibility.phoneScreenSupport}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Offline/Online Strategy: </span>
                  <span className="text-slate-800">{prd.platformAndCompatibility.offlineOnlineNeeds}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 8: Technical Preferences */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s8')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-xs flex items-center justify-center">8</span>
                <h2 className="text-lg font-bold text-slate-900">Technical Preferences (Open-Source First)</h2>
              </div>
              {expandedSections.s8 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s8 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-4 text-xs sm:text-sm">
                <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-indigo-950">
                  <span className="font-bold block mb-1">Simplicity Principle:</span>
                  {prd.technicalPreferences.simplicityStatement}
                </div>

                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Preferred Open-Source Tools:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.technicalPreferences.openSourceTools.map((tool, i) => (
                      <li key={i}>{tool}</li>
                    ))}
                  </ul>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">FRONTEND</span>
                    <span className="font-semibold text-slate-900">{prd.technicalPreferences.stackRecommendation.frontend}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">STYLING</span>
                    <span className="font-semibold text-slate-900">{prd.technicalPreferences.stackRecommendation.styling}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">STORAGE / BACKEND</span>
                    <span className="font-semibold text-slate-900">{prd.technicalPreferences.stackRecommendation.backendOrStorage}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 font-medium block text-[11px]">HOSTING</span>
                    <span className="font-semibold text-slate-900">{prd.technicalPreferences.stackRecommendation.hosting}</span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-700">Storage & Login Strategy: </span>
                  <span className="text-slate-800">{prd.technicalPreferences.storageAndAuth}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 9: Data and Content */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s9')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-800 font-bold text-xs flex items-center justify-center">9</span>
                <h2 className="text-lg font-bold text-slate-900">Data and Content</h2>
              </div>
              {expandedSections.s9 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s9 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Stored Data:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.dataAndContent.storedData.map((data, i) => (
                      <li key={i}>{data}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">User Uploaded Content: </span>
                  <span className="text-slate-800">{prd.dataAndContent.userUploadedContent}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Privacy & Safety: </span>
                  <span className="text-slate-800">{prd.dataAndContent.privacyAndSafety}</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 10: Risks and Constraints */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s10')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-red-100 text-red-800 font-bold text-xs flex items-center justify-center">10</span>
                <h2 className="text-lg font-bold text-slate-900">Risks and Constraints</h2>
              </div>
              {expandedSections.s10 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s10 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Things That May Be Difficult:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.risksAndConstraints.difficulties.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold text-slate-700">Budget and Time Limits: </span>
                  <span className="text-slate-800">{prd.risksAndConstraints.budgetAndTimeLimits}</span>
                </div>
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">Trade-offs:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-700">
                    {prd.risksAndConstraints.tradeOffs.map((t, i) => (
                      <li key={i}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section 11: Open Questions */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s11')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-yellow-100 text-yellow-800 font-bold text-xs flex items-center justify-center">11</span>
                <h2 className="text-lg font-bold text-slate-900">Open Questions & Assumptions</h2>
              </div>
              {expandedSections.s11 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s11 && (
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs sm:text-sm">
                <p className="text-slate-500 mb-2 italic">
                  Marked assumptions: If anything was left unspecified, these reasonable choices are assumed for the first version:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-800">
                  {prd.openQuestions.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* Section 12: Final Build Summary */}
          <div className="bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-emerald-500/10 rounded-2xl border border-amber-200 p-6 shadow-xs">
            <div 
              className="flex items-center justify-between cursor-pointer select-none"
              onClick={() => toggleSection('s12')}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">12</span>
                <h2 className="text-lg font-bold text-slate-900">Final Build Summary & 5-Day Plan</h2>
              </div>
              {expandedSections.s12 ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </div>

            {expandedSections.s12 && (
              <div className="mt-4 pt-4 border-t border-amber-200/60 space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">First Thing to Build:</span>
                  <p className="text-slate-800 font-medium">{prd.finalBuildSummary.firstThingToBuild}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-900 block mb-2">5-Day Simple MVP Roadmap:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                    {prd.finalBuildSummary.simpleMvpPlan.map((step, i) => (
                      <div key={i} className="p-3 bg-white/90 border border-amber-200/80 rounded-xl">
                        <span className="text-[11px] font-bold text-amber-700 block">DAY {i + 1}</span>
                        <span className="text-xs text-slate-800 mt-1 block">{step.replace(/^Day \d+:\s*/, '')}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-white border border-amber-300 rounded-xl flex items-center justify-between gap-4">
                  <div>
                    <span className="font-bold text-slate-900 block">The Best Next Step:</span>
                    <span className="text-slate-600 text-xs">{prd.finalBuildSummary.bestNextStep}</span>
                  </div>
                  <button
                    onClick={() => setActiveTab('prompt')}
                    className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-xs"
                  >
                    <Bot className="w-3.5 h-3.5" />
                    <span>View AI Prompt</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AI BUILDER PROMPT */}
      {activeTab === 'prompt' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  Ready to Copy & Paste
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Prompt for AI App Builders</h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Paste this prompt directly into Google AI Studio, Bolt, Cursor, or v0 to generate your app!
              </p>
            </div>

            <button
              onClick={() => copyToClipboard(aiBuilderPrompt, 'prompt')}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-amber-500 hover:bg-amber-600 shadow-sm shrink-0 transition-all transform active:scale-95"
            >
              {copiedKey === 'prompt' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedKey === 'prompt' ? 'Copied Prompt!' : 'Copy AI Prompt'}</span>
            </button>
          </div>

          <div className="relative">
            <pre className="p-4 sm:p-5 bg-slate-950 text-slate-100 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-[500px]">
              {aiBuilderPrompt}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: USER STORIES */}
      {activeTab === 'stories' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">User Story List</h2>
              <p className="text-xs text-slate-500">Agile user stories with clear acceptance criteria for developers.</p>
            </div>
            <button
              onClick={() => {
                const storiesText = userStories.map(s => 
                  `### ${s.id}: ${s.asA}\n- **I want to:** ${s.iWant}\n- **So that:** ${s.soThat}\n- **Acceptance Criteria:**\n${s.acceptanceCriteria.map(a => `  - [ ] ${a}`).join('\n')}`
                ).join('\n\n');
                copyToClipboard(storiesText, 'stories');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
            >
              {copiedKey === 'stories' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Stories</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {userStories.map((story) => (
              <div key={story.id} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-mono text-xs font-bold bg-blue-100 text-blue-800">
                      {story.id}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">User Story</span>
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Priority: {story.priority}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-100">
                  <strong className="text-slate-900">As a </strong>{story.asA},<br />
                  <strong className="text-slate-900">I want </strong>{story.iWant},<br />
                  <strong className="text-slate-900">So that </strong>{story.soThat}
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1.5">Acceptance Criteria Checklist:</span>
                  <div className="space-y-1">
                    {story.acceptanceCriteria.map((ac, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <input type="checkbox" readOnly className="mt-0.5 rounded border-slate-300 text-emerald-600" />
                        <span>{ac}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: WIREFRAME OUTLINE */}
      {activeTab === 'wireframes' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900">Screen Layouts & Wireframes</h2>
            <p className="text-xs text-slate-500">Visual blueprints and component lists for the primary screens.</p>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {wireframes.map((wf, idx) => (
              <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">{wf.screenName}</h3>
                  <span className="text-xs font-medium px-2 py-0.5 bg-purple-100 text-purple-800 rounded">
                    Wireframe {idx + 1}
                  </span>
                </div>

                <div className="text-xs sm:text-sm text-slate-700">
                  <strong className="text-slate-900">Purpose: </strong>{wf.purpose}
                </div>

                <div className="text-xs sm:text-sm text-slate-700">
                  <strong className="text-slate-900">Layout Description: </strong>{wf.layoutDescription}
                </div>

                <div>
                  <strong className="text-xs font-bold text-slate-900 block mb-1.5">Key Interactive Components:</strong>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {wf.elements.map((el, i) => (
                      <li key={i}>{el}</li>
                    ))}
                  </ul>
                </div>

                {wf.asciiSketch && (
                  <div>
                    <strong className="text-xs font-bold text-slate-700 block mb-1.5">ASCII Blueprint Layout:</strong>
                    <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-[11px] sm:text-xs overflow-x-auto border border-slate-800 leading-snug">
                      {wf.asciiSketch}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: DEVELOPER HANDOFF */}
      {activeTab === 'handoff' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Developer Handoff Note</h2>
              <p className="text-xs text-slate-500">Technical recommendations, storage schema, and best practices.</p>
            </div>
            <button
              onClick={() => copyToClipboard(developerHandoff, 'handoff')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200"
            >
              {copiedKey === 'handoff' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Note</span>
            </button>
          </div>

          <pre className="p-4 sm:p-5 bg-slate-900 text-slate-100 rounded-xl text-xs sm:text-sm font-mono overflow-x-auto whitespace-pre-wrap leading-relaxed border border-slate-800">
            {developerHandoff}
          </pre>
        </div>
      )}
    </div>
  );
};
