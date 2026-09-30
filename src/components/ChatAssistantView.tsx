import React, { useState, useEffect, useRef } from 'react';
import { MasterQuestion, UserAnswers, ChatMessage } from '../types';
import { 
  Send, 
  Sparkles, 
  HelpCircle, 
  Lightbulb, 
  Check, 
  ArrowRight,
  User,
  Bot,
  Scissors
} from 'lucide-react';

interface ChatAssistantViewProps {
  questions: MasterQuestion[];
  answers: UserAnswers;
  onUpdateAnswer: (qNum: number, answer: string) => void;
  onGeneratePRD: () => void;
}

export const ChatAssistantView: React.FC<ChatAssistantViewProps> = ({
  questions,
  answers,
  onUpdateAnswer,
  onGeneratePRD,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize first greeting and question 1
  useEffect(() => {
    if (messages.length === 0) {
      const q1 = questions[0];
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Hi there! 👋 I'm Alex, your friendly Product Planning buddy. My job is to help you take that spark of an app idea in your head and turn it into a clear, detailed Product Requirements Document (PRD) that any builder or AI tool can build for you.\n\nWe will go through 10 simple questions together at your own pace. No technical jargon, no stress! Ready? Let's start with Question 1:`,
          timestamp: Date.now(),
        },
        {
          id: 'q-1',
          sender: 'assistant',
          text: `**${q1.title}**: ${q1.question}\n\n*Tip: ${q1.simpleExplanation}*`,
          timestamp: Date.now() + 100,
          questionIndex: 0,
          suggestions: q1.defaultOptions.slice(0, 3),
        }
      ]);
    }
  }, [questions, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Save answer
    const currentQ = questions[currentQIndex];
    onUpdateAnswer(currentQ.questionNumber, text);

    try {
      // Call server chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: currentQIndex,
          userMessage: text,
          answers: { ...answers, [currentQ.questionNumber]: text },
        }),
      });

      const data = await response.json();
      setIsTyping(false);

      const nextIndex = currentQIndex + 1;
      const isComplete = nextIndex >= questions.length;

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || `Got it! Recorded: "${text}".`,
        timestamp: Date.now(),
        isComplexityWarning: data.isComplexityWarning,
        suggestions: !isComplete ? questions[nextIndex].defaultOptions.slice(0, 3) : undefined,
      };

      if (!isComplete) {
        const nextQ = questions[nextIndex];
        const nextQMsg: ChatMessage = {
          id: `next-q-${nextIndex}`,
          sender: 'assistant',
          text: `**Question ${nextQ.questionNumber} of 10: ${nextQ.title}**\n${nextQ.question}\n\n*${nextQ.simpleExplanation}*`,
          timestamp: Date.now() + 50,
          questionIndex: nextIndex,
          suggestions: nextQ.defaultOptions.slice(0, 3),
        };

        setMessages((prev) => [...prev, assistantMsg, nextQMsg]);
        setCurrentQIndex(nextIndex);
      } else {
        const completionMsg: ChatMessage = {
          id: `done-${Date.now()}`,
          sender: 'assistant',
          text: `🎉 Fantastic job! We have collected all 10 answers. You now have a complete, practical foundation for your simple app. Click the button below to generate your complete PRD and export documents!`,
          timestamp: Date.now() + 50,
        };
        setMessages((prev) => [...prev, assistantMsg, completionMsg]);
      }
    } catch (err) {
      setIsTyping(false);
      const nextIndex = currentQIndex + 1;
      if (nextIndex < questions.length) {
        const nextQ = questions[nextIndex];
        setMessages((prev) => [
          ...prev,
          {
            id: `err-reply-${Date.now()}`,
            sender: 'assistant',
            text: `Perfect! Saved that. Let's move to Question ${nextQ.questionNumber} of 10: ${nextQ.question}`,
            timestamp: Date.now(),
            questionIndex: nextIndex,
            suggestions: nextQ.defaultOptions.slice(0, 3),
          },
        ]);
        setCurrentQIndex(nextIndex);
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleDontKnowClick = () => {
    const currentQ = questions[currentQIndex];
    const suggestion = currentQ.dontKnowSuggestions[0] || 'Keep it simple and standard for version 1.';
    handleSendMessage(`I'm not sure: ${suggestion}`);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-140px)]">
      {/* Top Conversation Header */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-sm shadow-amber-500/30">
            A
          </div>
          <div>
            <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
              <span>Alex</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="text-[10px] font-normal text-slate-500">Your Product Planning Partner</span>
            </div>
            <div className="text-[11px] text-slate-500">
              {currentQIndex < questions.length 
                ? `Currently on Question ${currentQIndex + 1} of 10: ${questions[currentQIndex].title}`
                : 'All questions completed! Ready to view PRD.'}
            </div>
          </div>
        </div>

        {currentQIndex >= questions.length && (
          <button
            onClick={onGeneratePRD}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View PRD</span>
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs shrink-0 font-bold ${
                  isUser
                    ? 'bg-slate-900 text-white'
                    : 'bg-amber-100 text-amber-900 border border-amber-200'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-amber-600" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-slate-900 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200 rounded-tl-xs'
                }`}
              >
                {msg.isComplexityWarning && (
                  <div className="mb-2 p-2 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-center gap-1.5 font-medium">
                    <Scissors className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>MVP Simplifier Note:</span>
                  </div>
                )}

                <div className="whitespace-pre-line font-normal">{msg.text}</div>

                {/* Suggestions / Choice Chips */}
                {msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col gap-1.5">
                    <span className="text-[11px] font-semibold text-slate-400">
                      Quick choices:
                    </span>
                    {msg.suggestions.map((s, i) => (
                      <button
                        key={i}
                        onClick={() => handleSuggestionClick(s)}
                        className="text-left p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 text-slate-700 text-xs transition-colors flex items-center justify-between group"
                      >
                        <span className="pr-2">{s}</span>
                        <ArrowRight className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-xs shrink-0">
              <Bot className="w-4 h-4 text-amber-600" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-xs px-4 py-3 text-xs text-slate-500 flex items-center gap-1.5 shadow-xs">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce"></span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 text-slate-400 text-xs">Alex is typing...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box and Action Bar */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        {/* Helper quick actions */}
        <div className="flex items-center gap-2 mb-2 px-1">
          <button
            type="button"
            onClick={handleDontKnowClick}
            className="text-[11px] font-medium text-slate-500 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 px-2.5 py-1 rounded-md transition-colors"
          >
            ❓ I don't know (Help me choose)
          </button>
          <span className="text-slate-300 text-xs">•</span>
          <span className="text-[11px] text-slate-400">Plain words only, no technical terms needed</span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={
              currentQIndex < questions.length
                ? `Answer question ${currentQIndex + 1} (${questions[currentQIndex].title})...`
                : 'Type anything to discuss or refine your app...'
            }
            className="flex-1 bg-transparent px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none"
          />

          <button
            type="button"
            onClick={() => handleSendMessage()}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white flex items-center justify-center transition-colors shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
