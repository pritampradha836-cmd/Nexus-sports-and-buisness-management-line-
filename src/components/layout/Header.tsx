import React from 'react';
import { 
  TabType, 
  Currency 
} from '../../types/sports-os';
import { 
  Satellite, 
  Cpu, 
  Sparkles, 
  Download, 
  Globe2 
} from 'lucide-react';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  onOpenAiAssistant: () => void;
  onExportData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenAiAssistant,
  onExportData,
}) => {
  const navItems: { id: TabType; label: string }[] = [
    { id: 'ai-lab', label: 'AI & ML Lab' },
    { id: 'satellite', label: 'Satellite & Geospatial' },
    { id: 'business', label: 'International Business' },
    { id: 'marketing', label: 'Marketing & Ad Desk' },
    { id: 'communication', label: 'Global Community' },
    { id: 'infrastructure', label: 'IT & Edge Mesh' },
    { id: 'dev-pc', label: 'Dev PC Variety' },
    { id: 'mobile-games', label: 'Mobile Games' },
    { id: 'gemini-chat', label: 'Gemini Chat & Search' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight text-white block leading-none">
              Amnetek OS
            </span>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
              <span>Amnetek Technologies Group</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                <Satellite className="w-3 h-3 inline" /> 18 SVs GNSS Lock
              </span>
            </div>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line tabs) */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions and Context Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Currency Switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg">
            <Globe2 className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              className="bg-transparent text-slate-200 text-xs font-mono focus:outline-none cursor-pointer"
              aria-label="Select Operating Currency"
            >
              <option value="EUR" className="bg-slate-900">EUR (€)</option>
              <option value="USD" className="bg-slate-900">USD ($)</option>
              <option value="GBP" className="bg-slate-900">GBP (£)</option>
              <option value="JPY" className="bg-slate-900">JPY (¥)</option>
              <option value="SAR" className="bg-slate-900">SAR (﷼)</option>
            </select>
          </div>

          {/* PWA Install on Device Action */}
          <PWAInstallButton variant="header" />

          {/* Export Lakehouse */}
          <button
            onClick={onExportData}
            title="Export Big Data Lakehouse Snapshot (Parquet / CSV)"
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Data</span>
          </button>

          {/* AI Intelligence Assistant Action */}
          <button
            onClick={onOpenAiAssistant}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all whitespace-nowrap active:scale-[0.98]"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Studio Consult</span>
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Nav Row */}
      <div className="xl:hidden flex items-center gap-1 overflow-x-auto py-2 mt-2 border-t border-slate-800/60 no-scrollbar">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
