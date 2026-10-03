import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../types/sports-os';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  RotateCcw, 
  Copy, 
  Check, 
  Globe, 
  ExternalLink, 
  Search, 
  Cpu, 
  Sliders, 
  ShieldCheck, 
  Zap, 
  Trash2, 
  Download, 
  Smartphone, 
  Laptop, 
  Activity, 
  Coins 
} from 'lucide-react';

type ChatRole = 
  | 'Sports Data Scientist' 
  | 'Mobile Game Performance Engineer' 
  | 'Developer PC Hardware Architect' 
  | 'Real-Time Sports & Tech Intelligence' 
  | 'International Business & Transfer Director';

type ModelSpeed = 'general' | 'fast' | 'complex';

export const GeminiChatbotStudio: React.FC = () => {
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<ChatRole>('Real-Time Sports & Tech Intelligence');
  const [taskComplexity, setTaskComplexity] = useState<ModelSpeed>('general');
  const [useSearchGrounding, setUseSearchGrounding] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg-1',
      role: 'assistant',
      text: `Welcome to the **Amnetek Gemini Chatbot & Search Grounding Studio**. 
      
I am configured with multi-turn conversation memory, dynamic role specializations, and real-time **Google Search Grounding** using \`gemini-3.5-flash\` to bring you up-to-date information across global sports competitions, developer workstations, and mobile gaming architectures.

### Available Assistant Roles:
* **Real-Time Sports & Tech Intelligence** (Grounded with live Google Search data)
* **Lead Sports Data Scientist** (50Hz coordinate tracking, ACWR injury hazards, xG models)
* **Mobile Game Performance Engineer** (120 FPS stability, A18 Pro / Snapdragon 8 Elite, Vulkan/Metal)
* **Developer PC Hardware Architect** (Threadripper PRO, dual-GPU render stress, thermal dissipation)
* **International Business & Transfer Director** (FIFA Annex 3, UEFA Squad Cost Rule, multi-currency)

How can I assist your engineering, analytics, or scouting organization?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: 'gemini-3.5-flash',
      roleTitle: 'Real-Time Sports & Tech Intelligence',
      useSearchGrounding: true,
      groundingSources: [
        { title: 'UEFA Technical Reports & Match Center', uri: 'https://www.uefa.com' },
        { title: 'FIFA Regulatory Handbook & Annex 3', uri: 'https://www.fifa.com' },
        { title: 'AnandTech Mobile GPU Benchmarks', uri: 'https://www.anandtech.com' }
      ],
      webSearchQueries: ['2026 sports data science trends', 'mobile gaming 120fps benchmarks']
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const starterPrompts = [
    {
      title: 'Live Sports & UCL Trends',
      prompt: 'Search the latest 2026 European football and Champions League tactical trends. What are the key pressing metrics and transition frequencies?',
      role: 'Real-Time Sports & Tech Intelligence' as ChatRole,
      search: true,
      speed: 'general' as ModelSpeed,
    },
    {
      title: 'ACWR Soft-Tissue Risk',
      prompt: 'Formulate an algorithmic injury risk model for Mateo Silva with an ACWR of 1.48 and elevated sprint distance. Provide clinical training restrictions.',
      role: 'Sports Data Scientist' as ChatRole,
      search: false,
      speed: 'complex' as ModelSpeed,
    },
    {
      title: 'Snapdragon vs Apple A18 Pro',
      prompt: 'Compare mobile GPU architecture of Snapdragon 8 Elite (Adreno 830) vs Apple A18 Pro for running Amnetek Penalty Striker 3D at sustained 120 FPS under 6W.',
      role: 'Mobile Game Performance Engineer' as ChatRole,
      search: true,
      speed: 'general' as ModelSpeed,
    },
    {
      title: '450W GPU Heavy Render Stress',
      prompt: 'Calculate thermal dissipation and acoustic noise for a 360mm custom liquid loop cooling an RTX 4090 workstation under sustained 450W Blender OptiX load.',
      role: 'Developer PC Hardware Architect' as ChatRole,
      search: false,
      speed: 'fast' as ModelSpeed,
    },
    {
      title: 'FIFA GBE & Transfer Risk',
      prompt: 'Audit transfer market valuation for a €48M international winger under FIFA Annex 3, UK GBE points requirements, and UEFA Squad Cost Rule.',
      role: 'International Business & Transfer Director' as ChatRole,
      search: true,
      speed: 'complex' as ModelSpeed,
    }
  ];

  const handleSendMessage = async (textOverride?: string) => {
    const textToSend = textOverride || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedHistory = [...messages, userMessage];
    setMessages(updatedHistory);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          role: selectedRole,
          taskComplexity,
          useSearchGrounding,
          history: updatedHistory.map((m) => ({
            role: m.role,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (data.success && data.text) {
        const assistantMessage: ChatMessage = {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: data.model || (useSearchGrounding ? 'gemini-3.5-flash' : taskComplexity === 'complex' ? 'gemini-3.1-pro-preview' : taskComplexity === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.5-flash'),
          roleTitle: selectedRole,
          useSearchGrounding: data.useSearchGrounding || useSearchGrounding,
          groundingSources: data.groundingSources || [],
          webSearchQueries: data.webSearchQueries || [],
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        const errorMessage: ChatMessage = {
          id: `asst-err-${Date.now()}`,
          role: 'assistant',
          text: 'Notice: Could not parse response from Gemini engine. Please verify connectivity or check model configuration.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: 'error-handler',
          roleTitle: selectedRole,
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    } catch (err: any) {
      const fallbackMessage: ChatMessage = {
        id: `asst-err-${Date.now()}`,
        role: 'assistant',
        text: `Network or Server Connection Notice: ${err?.message || 'Unable to connect to /api/ai/chat'}. The Amnetek offline telemetry model remains available.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: 'system-offline',
        roleTitle: selectedRole,
      };
      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (window.confirm('Reset this conversation history?')) {
      setMessages([
        {
          id: `welcome-${Date.now()}`,
          role: 'assistant',
          text: `Conversation history reset. Assistant ready as **${selectedRole}**. Ask any question or use Google Search Grounding to query current sports and engineering intelligence.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          model: useSearchGrounding ? 'gemini-3.5-flash (Search Grounded)' : 'gemini-3.5-flash',
          roleTitle: selectedRole,
        }
      ]);
    }
  };

  const handleExportTranscript = () => {
    const transcript = messages.map((m) => `[${m.timestamp}] ${m.role.toUpperCase()} (${m.model || m.roleTitle || 'Amnetek'}):\n${m.text}\n\n`).join('\n---\n\n');
    const blob = new Blob([transcript], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amnetek_gemini_transcript_${Date.now()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Amnetek Gemini Chatbot Studio</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  Multi-Turn Intelligence
                </span>
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Multi-turn conversational assistant with role-based system instructions and real-time Google Search Grounding via Gemini.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleExportTranscript}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export Chat (.md)</span>
            </button>
            <button
              onClick={handleClearHistory}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-red-400" />
              <span>Clear History</span>
            </button>
          </div>
        </div>

        {/* Dynamic Role, Model & Search Grounding Ribbon */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 border-t border-slate-800 text-xs">
          {/* Role Selector */}
          <div className="md:col-span-5 space-y-1.5">
            <span className="text-slate-400 font-medium block">Assistant Persona & System Role:</span>
            <div className="flex flex-wrap gap-1.5">
              {[
                { id: 'Real-Time Sports & Tech Intelligence', label: 'Live Search Intelligence', icon: Globe },
                { id: 'Sports Data Scientist', label: 'Sports Data Scientist', icon: Activity },
                { id: 'Mobile Game Performance Engineer', label: 'Mobile Games Architect', icon: Smartphone },
                { id: 'Developer PC Hardware Architect', label: 'Dev PC Hardware', icon: Laptop },
                { id: 'International Business & Transfer Director', label: 'Business & Transfers', icon: Coins },
              ].map((roleItem) => {
                const Icon = roleItem.icon;
                const isSelected = selectedRole === roleItem.id;
                return (
                  <button
                    key={roleItem.id}
                    onClick={() => {
                      setSelectedRole(roleItem.id as ChatRole);
                      if (roleItem.id === 'Real-Time Sports & Tech Intelligence') {
                        setUseSearchGrounding(true);
                      }
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-medium transition-all ${
                      isSelected
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{roleItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Model Selection & Task Speed */}
          <div className="md:col-span-4 space-y-1.5">
            <span className="text-slate-400 font-medium block">Model Selection & Task Mode:</span>
            <div className="grid grid-cols-3 gap-1 font-mono text-[11px]">
              <button
                onClick={() => setTaskComplexity('general')}
                className={`p-1.5 rounded border text-center transition-all ${
                  taskComplexity === 'general'
                    ? 'bg-slate-800 text-emerald-400 border-emerald-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
                title="gemini-3.5-flash for general tasks & Search Grounding"
              >
                <span>3.5-Flash</span>
                <span className="block text-[9px] text-slate-500">General</span>
              </button>

              <button
                onClick={() => setTaskComplexity('fast')}
                className={`p-1.5 rounded border text-center transition-all ${
                  taskComplexity === 'fast'
                    ? 'bg-slate-800 text-cyan-400 border-cyan-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
                title="gemini-3.1-flash-lite for tasks that should happen fast"
              >
                <span>Flash-Lite</span>
                <span className="block text-[9px] text-slate-500">Fast</span>
              </button>

              <button
                onClick={() => setTaskComplexity('complex')}
                className={`p-1.5 rounded border text-center transition-all ${
                  taskComplexity === 'complex'
                    ? 'bg-slate-800 text-amber-300 border-amber-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                }`}
                title="gemini-3.1-pro-preview for particularly complex tasks"
              >
                <span>3.1-Pro</span>
                <span className="block text-[9px] text-slate-500">Complex</span>
              </button>
            </div>
          </div>

          {/* Google Search Grounding Toggle */}
          <div className="md:col-span-3 space-y-1.5">
            <span className="text-slate-400 font-medium block">Google Search Grounding:</span>
            <button
              onClick={() => setUseSearchGrounding(!useSearchGrounding)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border font-mono text-xs transition-all ${
                useSearchGrounding
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/80 shadow-sm shadow-emerald-950/40'
                  : 'bg-slate-950 text-slate-500 border-slate-800 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Search className={`w-3.5 h-3.5 ${useSearchGrounding ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span className="font-semibold">Search Grounding</span>
              </div>
              <span className={`px-1.5 py-0.5 text-[10px] rounded font-bold uppercase ${
                useSearchGrounding ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'
              }`}>
                {useSearchGrounding ? 'Active' : 'Off'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Starter Prompts Carousel */}
      <div className="space-y-1.5">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
          Recommended Queries & Domain Actions
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {starterPrompts.map((starter, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSelectedRole(starter.role);
                setUseSearchGrounding(starter.search);
                setTaskComplexity(starter.speed);
                handleSendMessage(starter.prompt);
              }}
              className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-emerald-500/50 transition-all text-xs group"
            >
              <div className="font-bold text-white group-hover:text-emerald-400 transition-colors flex items-center justify-between">
                <span>{starter.title}</span>
                {starter.search && (
                  <span title="Google Search Grounded">
                    <Globe className="w-3 h-3 text-emerald-400 shrink-0" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-1 leading-snug">
                {starter.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Chat Conversation Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl flex flex-col h-[560px] overflow-hidden">
        {/* Messages Thread Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {messages.map((message) => {
            const isUser = message.role === 'user';
            return (
              <div
                key={message.id}
                className={`flex gap-3 max-w-4xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}>
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4 text-emerald-400" />}
                </div>

                {/* Message Bubble */}
                <div className={`space-y-2 max-w-[85%] sm:max-w-[78%] ${isUser ? 'items-end' : 'items-start'}`}>
                  {/* Sender Metadata Bar */}
                  <div className={`flex items-center gap-2 text-[11px] font-mono text-slate-400 ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'You' : message.roleTitle || 'Amnetek Intelligence'}
                    </span>
                    <span>·</span>
                    <span>{message.timestamp}</span>
                    {message.model && (
                      <>
                        <span>·</span>
                        <span className="px-1.5 py-0.2 rounded bg-slate-950 text-emerald-400 border border-slate-800 text-[10px]">
                          {message.model}
                        </span>
                      </>
                    )}
                    {message.useSearchGrounding && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-1.5 py-0.5 rounded">
                        <Search className="w-2.5 h-2.5" />
                        <span>Search Grounded</span>
                      </span>
                    )}
                  </div>

                  {/* Message Body */}
                  <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border relative group ${
                    isUser
                      ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-100 rounded-tr-none'
                      : 'bg-slate-950 border-slate-800/90 text-slate-200 rounded-tl-none whitespace-pre-wrap'
                  }`}>
                    {message.text}

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(message.id, message.text)}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-400 hover:text-white bg-slate-900 rounded border border-slate-800"
                      title="Copy response to clipboard"
                    >
                      {copiedId === message.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Search Grounding Sources Drawer */}
                  {message.groundingSources && message.groundingSources.length > 0 && (
                    <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-3 space-y-2 mt-2">
                      <div className="flex items-center justify-between text-[11px] font-mono text-emerald-400">
                        <span className="flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-emerald-400" />
                          <span>Google Search Grounding Sources ({message.groundingSources.length})</span>
                        </span>
                        <span className="text-slate-500 text-[10px]">Verified Live References</span>
                      </div>

                      {message.webSearchQueries && message.webSearchQueries.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {message.webSearchQueries.map((q, qIdx) => (
                            <span key={qIdx} className="text-[10px] font-mono bg-slate-900 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                              "{q}"
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                        {message.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between gap-2 p-2 rounded bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/40 text-xs text-slate-300 hover:text-emerald-300 transition-all group"
                          >
                            <span className="truncate text-[11px] font-medium">{source.title}</span>
                            <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-emerald-400 shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-4xl mr-auto">
              <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-emerald-400 animate-spin" />
              </div>
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl rounded-tl-none text-xs text-slate-400 flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="font-mono text-slate-300">
                    {useSearchGrounding ? 'Querying Google Search Grounding with gemini-3.5-flash...' : taskComplexity === 'complex' ? 'Reasoning with gemini-3.1-pro-preview...' : 'Generating response with Gemini...'}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder={`Ask ${selectedRole} anything... (e.g. latest Champions League tactical trends, 120 FPS mobile GPU limits)`}
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-emerald-500 rounded-lg px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none placeholder:text-slate-500"
            disabled={isLoading}
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputPrompt.trim()}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center gap-2 text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
          >
            {isLoading ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5 fill-current" />
            )}
            <span className="hidden sm:inline">Send Query</span>
          </button>
        </div>
      </div>
    </div>
  );
};
