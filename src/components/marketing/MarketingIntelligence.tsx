import React, { useState } from 'react';
import { 
  FanSegmentCohort, 
  ProgrammaticAdCampaign, 
  BrandSponsorshipTracker 
} from '../../types/sports-os';
import { 
  Megaphone, 
  Target, 
  Tv, 
  Ticket, 
  DollarSign, 
  Zap, 
  Plus, 
  Check 
} from 'lucide-react';

interface MarketingIntelligenceProps {
  fanCohorts: FanSegmentCohort[];
  adCampaigns: ProgrammaticAdCampaign[];
  sponsorships: BrandSponsorshipTracker[];
}

export const MarketingIntelligence: React.FC<MarketingIntelligenceProps> = ({
  fanCohorts,
  adCampaigns,
  sponsorships,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'cohorts' | 'ads' | 'pricing' | 'smv'>('cohorts');
  const [campaigns, setCampaigns] = useState<ProgrammaticAdCampaign[]>(adCampaigns);
  
  // Dynamic Pricing State
  const [basePriceUsd, setBasePriceUsd] = useState<number>(85);
  const [rivalMultiplier, setRivalMultiplier] = useState<number>(1.4);
  const [weatherCondition, setWeatherCondition] = useState<'Clear' | 'Rain' | 'Cold'>('Clear');

  const computedDynamicPrice = (
    basePriceUsd * rivalMultiplier * (weatherCondition === 'Clear' ? 1.05 : weatherCondition === 'Rain' ? 0.92 : 0.98)
  ).toFixed(0);

  const handleToggleCampaign = (id: string) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'Active' ? 'Paused' : 'Active' } : c))
    );
  };

  const handleSimulateGoalTrigger = () => {
    setCampaigns((prev) =>
      prev.map((c) =>
        c.id === 'ad-01'
          ? {
              ...c,
              status: 'Triggered',
              spentUsd: c.spentUsd + 2400,
              impressions: c.impressions + 180000,
            }
          : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('cohorts')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'cohorts'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>AI Fan Propensity Cohorts</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ads')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'ads'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Event-Triggered Ad Desk</span>
          </button>
          <button
            onClick={() => setActiveSubTab('pricing')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'pricing'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Ticket className="w-3.5 h-3.5" />
            <span>Dynamic Yield Ticket Pricing</span>
          </button>
          <button
            onClick={() => setActiveSubTab('smv')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'smv'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Sponsorship CV Media Value (SMV)</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>Global Commercial ROAS: </span>
          <span className="text-emerald-400 font-bold">4.68x</span>
        </div>
      </div>

      {/* Sub-view 1: Fan Propensity Cohorts */}
      {activeSubTab === 'cohorts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {fanCohorts.map((cohort) => (
            <div key={cohort.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">Cohort #{cohort.id}</span>
                <span className="text-xs text-emerald-400 font-mono">{cohort.primaryChannel}</span>
              </div>
              <h4 className="text-sm font-bold text-white leading-snug">{cohort.name}</h4>
              
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                <div className="p-2 bg-slate-950 rounded">
                  <span className="text-slate-500 block text-[10px]">Audience Size</span>
                  <span className="text-sm font-bold text-white tabular-nums">{cohort.size.toLocaleString()}</span>
                </div>
                <div className="p-2 bg-slate-950 rounded">
                  <span className="text-slate-500 block text-[10px]">Mean LTV</span>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums">${cohort.avgLtvUsd}</span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs font-mono">
                <div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Merchandise Propensity</span>
                    <span className="text-white">{cohort.merchPropensity}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${cohort.merchPropensity}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Match Ticket Propensity</span>
                    <span className="text-white">{cohort.ticketPropensity}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${cohort.ticketPropensity}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-view 2: Event-Triggered Ad Desk */}
      {activeSubTab === 'ads' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Live Match Event-Triggered Programmatic Desk</h3>
                <p className="text-xs text-slate-400">
                  Launch hyper-targeted ad campaigns globally across Meta, Google, and TikTok the second match events occur.
                </p>
              </div>
              <button
                onClick={handleSimulateGoalTrigger}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Simulate 78' Match Goal Event</span>
              </button>
            </div>

            <div className="space-y-3">
              {campaigns.map((ad) => (
                <div key={ad.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{ad.title}</span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                        ad.status === 'Triggered'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : ad.status === 'Active'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {ad.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggleCampaign(ad.id)}
                      className="px-2.5 py-1 text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                    >
                      {ad.status === 'Active' ? 'Pause Campaign' : 'Resume Campaign'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-slate-300 my-2">
                    <div className="p-2 bg-slate-900 rounded">
                      <span className="text-slate-500 block text-[10px]">Trigger Condition</span>
                      <span className="text-slate-200 text-[11px]">{ad.triggerEvent}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <span className="text-slate-500 block text-[10px]">Spend / Budget</span>
                      <span className="text-white text-[11px]">${ad.spentUsd.toLocaleString()} / ${ad.budgetUsd.toLocaleString()}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <span className="text-slate-500 block text-[10px]">Impressions</span>
                      <span className="text-emerald-400 text-[11px] font-bold">{ad.impressions.toLocaleString()}</span>
                    </div>
                    <div className="p-2 bg-slate-900 rounded">
                      <span className="text-slate-500 block text-[10px]">ROAS Multiplier</span>
                      <span className="text-cyan-400 text-[11px] font-bold">{ad.roasMultiplier}x</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono">
                    Target Markets: {ad.regionalMarkets.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 3: Dynamic Ticket Pricing */}
      {activeSubTab === 'pricing' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Algorithmic Match Ticket Yield Engine</h3>
              <p className="text-xs text-slate-400">
                Machine learning pricing adjusting with weather satellite feeds, historical sales velocity, and opponent tier.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-mono text-slate-400">
                  <span>Base Category A Seat Price</span>
                  <span className="text-emerald-400 font-bold">${basePriceUsd} USD</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="160"
                  step="5"
                  value={basePriceUsd}
                  onChange={(e) => setBasePriceUsd(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-mono text-slate-400">
                  <span>Opponent Rivalry Derby Multiplier</span>
                  <span className="text-emerald-400 font-bold">{rivalMultiplier.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="2.5"
                  step="0.1"
                  value={rivalMultiplier}
                  onChange={(e) => setRivalMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <span className="text-slate-400 block mb-1">Weather Forecast Condition:</span>
                <div className="flex gap-2">
                  {(['Clear', 'Rain', 'Cold'] as const).map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeatherCondition(w)}
                      className={`px-3 py-1 rounded font-mono text-xs ${
                        weatherCondition === w ? 'bg-emerald-600 text-white font-medium' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Optimized Yield Price Output
              </h4>
              <div className="text-4xl font-extrabold font-mono text-emerald-400 mb-2">
                ${computedDynamicPrice} <span className="text-sm font-normal text-slate-400">/ ticket</span>
              </div>
              <p className="text-xs text-slate-400">
                Projected stadium sellout probability: <strong className="text-white">98.4%</strong>. Expected gross matchday gate revenue: <strong className="text-emerald-400">$4,860,000</strong>.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-400">
              Auto-sync active with Ticketmaster & official club mobile app ticketing API.
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 4: Sponsorship Media Value (SMV) */}
      {activeSubTab === 'smv' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Broadcast Computer Vision Sponsorship Valuation (SMV)</h3>
                <p className="text-xs text-slate-400">
                  Automated computer vision frame scanning measuring brand screen time, logo surface area, and equivalent media ad value.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                Live Frame Feed: Sky Sports & beIN 4K
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Brand Partner</th>
                    <th className="py-2.5 px-3">Asset Placement</th>
                    <th className="py-2.5 px-3 text-right">On-Air Screen Time</th>
                    <th className="py-2.5 px-3 text-right">Mean Frame Area</th>
                    <th className="py-2.5 px-3 text-right">Clarity Score</th>
                    <th className="py-2.5 px-3 text-right">Earned Media Value ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sponsorships.map((sp) => (
                    <tr key={sp.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-3 font-sans font-bold text-white">{sp.brand}</td>
                      <td className="py-3 px-3 text-slate-300 font-sans">{sp.logoCategory}</td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-300">{sp.screenTimeSec}s</td>
                      <td className="py-3 px-3 text-right tabular-nums text-slate-300">{sp.avgLogoSizePct}%</td>
                      <td className="py-3 px-3 text-right tabular-nums text-emerald-400">{sp.visualClarityScore}%</td>
                      <td className="py-3 px-3 text-right tabular-nums font-bold text-emerald-400">
                        ${(sp.earnedMediaValueUsd / 1000000).toFixed(1)}M USD
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
