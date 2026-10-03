import React, { useState } from 'react';
import { PrCrisisFeedItem } from '../../types/sports-os';
import { 
  Languages, 
  ShieldAlert, 
  MessageSquare, 
  Send, 
  Sparkles, 
  Globe, 
  Volume2, 
  Check 
} from 'lucide-react';

interface GlobalCommunicationProps {
  crisisFeed: PrCrisisFeedItem[];
}

export const GlobalCommunication: React.FC<GlobalCommunicationProps> = ({
  crisisFeed,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'translator' | 'crisis' | 'athletes'>('translator');

  // Translator State
  const [sourceText, setSourceText] = useState<string>(
    'The medical department has confirmed that Mateo Silva sustained a minor grade 1 hamstring tweak and will undergo a 10-day rehabilitation program.'
  );
  const [sourceLang, setSourceLang] = useState<string>('English');
  const [targetLang, setTargetLang] = useState<string>('Spanish');
  const [commTone, setCommTone] = useState<'Official Press' | 'Locker Room' | 'Tactical Brief' | 'Social Media'>('Official Press');
  const [translatedText, setTranslatedText] = useState<string>(
    'El departamento médico ha confirmado que Mateo Silva sufrió una leve contractura de grado 1 en el isquiotibial y se someterá a un programa de rehabilitación de 10 días.'
  );
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  // Crisis Synthesizer State
  const [crisisTone, setCrisisTone] = useState<'Firm & Clear' | 'Empathetic' | 'De-escalating'>('Firm & Clear');
  const [draftedStatement, setDraftedStatement] = useState<string>(
    'Metropolis FC categorically refutes unsourced social media rumors regarding squad discord. The entire first-team group and technical staff remain entirely united and focused on our upcoming continental fixture.'
  );

  const handleTranslate = () => {
    setIsTranslating(true);
    setTimeout(() => {
      setIsTranslating(false);
      if (targetLang === 'Spanish') {
        setTranslatedText(
          'El departamento médico ha confirmado que Mateo Silva sufrió una leve contractura de grado 1 en el isquiotibial y se someterá a un programa de rehabilitación de 10 días.'
        );
      } else if (targetLang === 'Mandarin') {
        setTranslatedText(
          '医疗部门已确认马特奥·席尔瓦遭遇了一级轻微腿筋拉伤，并将接受为期10天的康复计划。'
        );
      } else if (targetLang === 'Arabic') {
        setTranslatedText(
          'أكد الطاقم الطبي أن ماتيو سيلفا تعرض لإصابة طفيفة من الدرجة الأولى في أوتار الركبة وسيخضع لبرنامج تأهيلي لمدة 10 أيام.'
        );
      } else if (targetLang === 'Japanese') {
        setTranslatedText(
          'メディカル部門はマテオ・シルバが軽度のハムストリング肉離れ（グレード1）を負い、10日間のリハビリプログラムを受けることを確認しました。'
        );
      } else {
        setTranslatedText(`[${targetLang} Translated - ${commTone} Tone]: ` + sourceText);
      }
    }, 300);
  };

  const handleGenerateStatement = (item: PrCrisisFeedItem) => {
    if (crisisTone === 'Firm & Clear') {
      setDraftedStatement(
        `OFFICIAL CLUB STATEMENT (${item.region}): Metropolis FC categorically refutes unsourced commentary regarding "${item.headline}". Our standards, medical compliance, and tactical integrity adhere to the highest international sports governance benchmarks.`
      );
    } else if (crisisTone === 'Empathetic') {
      setDraftedStatement(
        `COMMUNITY STATEMENT (${item.region}): We acknowledge the heartfelt passion of our global supporters concerning "${item.headline}". The club is committed to transparent dialogue with fan representatives.`
      );
    } else {
      setDraftedStatement(
        `BRIEFING (${item.region}): The club notes external commentary on "${item.headline}". We are actively reviewing relevant internal match reports and will provide verified facts in due course.`
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('translator')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'translator'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Languages className="w-3.5 h-3.5" />
            <span>Multilingual Team Translation Bridge</span>
          </button>
          <button
            onClick={() => setActiveSubTab('crisis')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'crisis'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>PR Crisis & Sentiment Early Warning</span>
          </button>
          <button
            onClick={() => setActiveSubTab('athletes')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'athletes'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Verified Athlete & Exec Network</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>Global Languages Active: </span>
          <span className="text-emerald-400 font-bold">8 Native Models</span>
        </div>
      </div>

      {/* Sub-view 1: Multilingual Translation Bridge */}
      {activeSubTab === 'translator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Source Communication</h3>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Tone:</span>
                <select
                  value={commTone}
                  onChange={(e) => setCommTone(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2 py-1 rounded"
                >
                  <option value="Official Press">Official Press</option>
                  <option value="Locker Room">Squad Locker Room</option>
                  <option value="Tactical Brief">Tactical Coaching Brief</option>
                  <option value="Social Media">Fan Social Media</option>
                </select>
              </div>
            </div>

            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              rows={6}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
              placeholder="Type team announcement, coach tactical instruction, or medical report..."
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Target Language:</span>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2 py-1 rounded"
                >
                  <option value="Spanish">Spanish (Castellano)</option>
                  <option value="Mandarin">Mandarin (Simplified)</option>
                  <option value="Arabic">Arabic (Modern Standard)</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Portuguese">Portuguese (Brazil)</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <button
                onClick={handleTranslate}
                disabled={isTranslating}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Languages className="w-3.5 h-3.5" />
                <span>{isTranslating ? 'Translating...' : 'Translate Instantly'}</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Globe className="w-4 h-4" />
                  <span>Target Output ({targetLang})</span>
                </h3>
                <span className="text-xs text-slate-500 font-mono">Tone: {commTone}</span>
              </div>

              <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-200 leading-relaxed min-h-[140px] font-sans">
                {translatedText}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>Automatic sync available for Club WhatsApp, Slack & Mobile App</span>
              <button 
                onClick={() => alert('Broadcast announcement synced across international channels.')}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
              >
                Broadcast to Squad
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 2: PR Crisis Early Warning Engine */}
      {activeSubTab === 'crisis' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Live Global Media Sentiment Feed
            </h3>
            {crisisFeed.map((item) => (
              <div key={item.id} className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-mono text-[11px]">{item.source} · {item.detectedTime}</span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                    item.severity === 'Watch' ? 'bg-amber-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                  }`}>
                    {item.severity}
                  </span>
                </div>
                <div className="font-bold text-white text-sm leading-snug">{item.headline}</div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Territory: {item.region}</span>
                  <span className={`font-mono font-bold ${item.sentimentScore < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    Sentiment: {item.sentimentScore > 0 ? `+${item.sentimentScore}` : item.sentimentScore}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-[11px] text-slate-400 italic">{item.recommendedAction}</span>
                  <button
                    onClick={() => handleGenerateStatement(item)}
                    className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-emerald-400 rounded transition-colors shrink-0"
                  >
                    Draft Response
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">AI Crisis Statement Generator</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-400">Posture:</span>
                <select
                  value={crisisTone}
                  onChange={(e) => setCrisisTone(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-2 py-1 rounded"
                >
                  <option value="Firm & Clear">Firm & Clear</option>
                  <option value="Empathetic">Empathetic</option>
                  <option value="De-escalating">De-escalating</option>
                </select>
              </div>
            </div>

            <textarea
              value={draftedStatement}
              onChange={(e) => setDraftedStatement(e.target.value)}
              rows={8}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 leading-relaxed resize-none"
            />

            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-mono">Brand Safety Score: 98.2%</span>
              <button 
                onClick={() => alert('Official club communication sent to Legal & Executive signoff queue.')}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg transition-colors"
              >
                Send to Legal Signoff
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 3: Verified Athlete & Executive Network */}
      {activeSubTab === 'athletes' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Secure Encrypted Athlete & Technical Staff Channel</h3>
              <p className="text-xs text-slate-400">Private, zero-knowledge encrypted messaging for match tactics and medical consultations.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
              E2EE Active (Signal Protocol)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span className="font-bold text-emerald-400">Head Coach (Tactical Briefing Room)</span>
                <span>Today 09:15 UTC</span>
              </div>
              <p className="text-slate-200">
                Squad: Tonight's pressing trigger shifts to opposition left center-back. When Rodri drops deep, Vance and Silva initiate double-press at coordinate zone 4.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-400 font-mono text-[11px]">
                <span className="font-bold text-cyan-400">Head of Performance Medicine</span>
                <span>Today 10:40 UTC</span>
              </div>
              <p className="text-slate-200">
                Mateo Silva: Cryotherapy and isometric hamstring protocol completed successfully. ACWR load target reduced to 0.95 for recovery phase.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
