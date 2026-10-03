import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Check, 
  Copy, 
  Globe, 
  ExternalLink, 
  Search, 
  Trash2, 
  Download 
} from 'lucide-react';
import { ChatMessage } from '../../types/sports-os';

interface SportsAiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SportsAiAssistantModal: React.FC<SportsAiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [chatbotRole, setChatbotRole] = useState<'Real-Time Sports & Tech Intelligence' | 'Sports Data Scientist' | 'Mobile Game Performance Engineer' | 'Developer PC Hardware Architect' | 'International Business & Transfer Director'>('Real-Time Sports & Tech Intelligence');
  const [taskComplexity, setTaskComplexity] = useState<'general' | 'fast' | 'complex'>('general');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'modal-welcome-1',
      role: 'assistant',
      text: `Welcome to the **Amnetek Gemini Chatbot** consultation console.

I provide quantitative analysis and strategic intelligence across sports data science, developer workstation performance, and mobile gaming architectures. **Google Search Grounding** is enabled with \`gemini-3.5-flash\` for verified, up-to-date live data.

How may I assist your team?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.5-flash',
      roleTitle: 'Real-Time Sports & Tech Intelligence',
      useSearchGrounding: true,
      groundingSources: [
        { title: 'UEFA Technical Reports', uri: 'https://www.uefa.com' },
        { title: 'FIFA Regulatory Handbook', uri: 'https://www.fifa.com' }
      ]
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  if (!isOpen) return null;

  const quickPrompts = [
    { label: 'Live Football Trends', prompt: 'Search the latest 2026 UEFA Champions League tactical trends, pressing heights, and transition recovery times.', role: 'Real-Time Sports & Tech Intelligence' as const, search: true, speed: 'general' as const },
    { label: 'Injury ACWR Risk', prompt: 'Evaluate soft-tissue hamstring strain risk for Mateo Silva with ACWR 1.48 and suggest clinical minutes restriction.', role: 'Sports Data Scientist' as const, search: false, speed: 'complex' as const },
    { label: '120 FPS Mobile GPU', prompt: 'Analyze 120 FPS frame rate stability on Snapdragon 8 Elite vs Apple A18 Pro for Amnetek Penalty Striker 3D.', role: 'Mobile Game Performance Engineer' as const, search: true, speed: 'general' as const },
    { label: 'Heavy Render 450W', prompt: 'Calculate thermal dissipation and cooling efficiency for a 360mm custom liquid loop cooling a dual-GPU developer PC rig.', role: 'Developer PC Hardware Architect' as const, search: false, speed: 'fast' as const },
    { label: 'FIFA Transfer Audit', prompt: 'Audit international transfer valuation under FIFA Annex 3, UK GBE work permit points, and UEFA Squad Cost Rule.', role: 'International Business & Transfer Director' as const, search: true, speed: 'complex' as const },
  ];

  const handleSend = async (customText?: string, customRole?: any, customSearch?: boolean, customSpeed?: any) => {
    const textToSend = customText || prompt;
    const roleToSend = customRole || chatbotRole;
    const searchToSend = customSearch !== undefined ? customSearch : useSearchGrounding;
    const speedToSend = customSpeed || taskComplexity;

    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `modal-user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role: roleToSend,
          taskComplexity: speedToSend,
          useSearchGrounding: searchToSend,
          history: newMessages.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();
      if (data.success && data.text) {
        const assistantMessage: ChatMessage = {
          id: `modal-asst-${Date.now()}`,
          role: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: data.model || (searchToSend ? 'gemini-3.5-flash' : speedToSend === 'complex' ? 'gemini-3.1-pro-preview' : speedToSend === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'),
          roleTitle: roleToSend,
          useSearchGrounding: data.useSearchGrounding || searchToSend,
          groundingSources: data.groundingSources || [],
          webSearchQueries: data.webSearchQueries || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `modal-err-${Date.now()}`,
            role: 'assistant',
            text: 'An unexpected response occurred while querying the intelligence model. Please retry.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            roleTitle: roleToSend,
          },
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `modal-err-${Date.now()}`,
          role: 'assistant',
          text: `Notice: ${err.message || 'Network error'}. Fallback algorithms remain available in local tabs.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          roleTitle: roleToSend,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-950/90">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Amnetek Gemini Chatbot</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Search Grounded
                </span>
              </h3>
              <p className="text-xs text-slate-400">Multi-turn sports data science, developer PC & mobile gaming consultation</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setMessages([
                  {
                    id: `modal-welcome-${Date.now()}`,
                    role: 'assistant',
                    text: `Conversation cleared. I am ready to assist as **${chatbotRole}**.`,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    roleTitle: chatbotRole,
                  },
                ])
              }
              title="Clear conversation"
              className="p-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Multi-Turn Role & Model Controls Strip */}
        <div className="px-5 py-2.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Role Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Role:</span>
            <select
              value={chatbotRole}
              onChange={(e) => {
                const r = e.target.value as any;
                setChatbotRole(r);
                if (r === 'Real-Time Sports & Tech Intelligence') {
                  setUseSearchGrounding(true);
                }
              }}
              className="bg-slate-900 border border-slate-800 text-emerald-300 px-2.5 py-1 rounded text-xs focus:outline-none cursor-pointer"
            >
              <option value="Real-Time Sports & Tech Intelligence">Real-Time Sports & Tech Intelligence (Search Grounded)</option>
              <option value="Sports Data Scientist">Sports Data Scientist & Tactical Analyst</option>
              <option value="Mobile Game Performance Engineer">Mobile Game Performance Engineer</option>
              <option value="Developer PC Hardware Architect">Developer PC Hardware Architect</option>
              <option value="International Business & Transfer Director">International Business & Transfer Director</option>
            </select>
          </div>

          {/* Model Speed & Search Grounding Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 font-mono text-[11px]">
              {(['general', 'fast', 'complex'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setTaskComplexity(m)}
                  className={`px-2 py-0.5 rounded uppercase ${
                    taskComplexity === m ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                  title={m === 'general' ? 'gemini-3.5-flash' : m === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.1-pro-preview'}
                >
                  {m === 'general' ? '3.5-Flash' : m === 'fast' ? 'Lite' : '3.1-Pro'}
                </button>
              ))}
            </div>

            <button
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] border transition-colors ${
                useSearchGrounding
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-600 font-bold'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
            >
              <Search className="w-3 h-3" />
              <span>Google Search: {useSearchGrounding ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </div>

        {/* Quick Presets Bar */}
        <div className="px-5 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-500 uppercase font-mono shrink-0">Presets:</span>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => {
                setChatbotRole(qp.role);
                setUseSearchGrounding(qp.search);
                setTaskComplexity(qp.speed);
                handleSend(qp.prompt, qp.role, qp.search, qp.speed);
              }}
              className="px-2.5 py-1 text-xs bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 rounded whitespace-nowrap transition-colors shrink-0 flex items-center gap-1"
            >
              {qp.search && <Globe className="w-2.5 h-2.5 text-emerald-400" />}
              <span>{qp.label}</span>
            </button>
          ))}
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 text-xs leading-relaxed ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-800/80 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`p-4 rounded-xl max-w-[85%] space-y-2 relative group ${
                    isUser
                      ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                      : 'bg-slate-950/90 border border-slate-800 text-slate-200 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>

                  {!isUser && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                        <div className="flex items-center gap-2">
                          <span>{msg.roleTitle || 'Amnetek Intelligence'}</span>
                          <span>·</span>
                          <span className="text-emerald-400">{msg.model || 'gemini-3.5-flash'}</span>
                          {msg.useSearchGrounding && (
                            <span className="text-emerald-400">· Grounded</span>
                          )}
                        </div>

                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-slate-200 transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Grounding sources in modal */}
                      {msg.groundingSources && msg.groundingSources.length > 0 && (
                        <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
                          <span className="font-semibold text-emerald-400 flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            <span>Google Search Sources:</span>
                          </span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
                            {msg.groundingSources.map((src, sIdx) => (
                              <a
                                key={sIdx}
                                href={src.uri}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="truncate text-slate-300 hover:text-emerald-300 flex items-center justify-between p-1 bg-slate-950 rounded border border-slate-800"
                              >
                                <span className="truncate">{src.title}</span>
                                <ExternalLink className="w-2.5 h-2.5 shrink-0 ml-1 text-slate-500" />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <RotateCcw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              <span>
                {useSearchGrounding
                  ? 'Retrieving Google Search Grounding with gemini-3.5-flash...'
                  : taskComplexity === 'complex'
                  ? 'Executing complex reasoning with gemini-3.1-pro-preview...'
                  : 'Generating response with Gemini...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything: live Champions League tactics, Snapdragon 8 Elite vs A18 Pro 120 FPS, 450W cooling, ACWR injury..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
