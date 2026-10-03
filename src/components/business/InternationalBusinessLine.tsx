import React, { useState } from 'react';
import { 
  TransferTarget, 
  SmartContractMilestone, 
  Currency 
} from '../../types/sports-os';
import { 
  ShieldCheck, 
  Coins, 
  FileCheck, 
  Leaf, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight 
} from 'lucide-react';

interface InternationalBusinessLineProps {
  targets: TransferTarget[];
  smartContracts: SmartContractMilestone[];
  currency: Currency;
}

export const InternationalBusinessLine: React.FC<InternationalBusinessLineProps> = ({
  targets,
  smartContracts,
  currency,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'transfers' | 'fintech' | 'contracts' | 'esg'>('transfers');
  const [selectedTargetId, setSelectedTargetId] = useState<string>(targets[0]?.id || 'tr-01');
  const [contractsState, setContractsState] = useState<SmartContractMilestone[]>(smartContracts);

  // FX Hedging Simulator state
  const [hedgeAmountEur, setHedgeAmountEur] = useState<number>(35000000);
  const [targetCurrency, setTargetCurrency] = useState<'GBP' | 'USD' | 'SAR'>('GBP');
  const [forwardRate, setForwardRate] = useState<number>(0.842);

  const selectedTarget = targets.find((t) => t.id === selectedTargetId) || targets[0];

  const handleManualDisburse = (id: string) => {
    setContractsState((prev) =>
      prev.map((c) => (c.id === id ? { ...c, state: 'Triggered & Disbursed', progressPct: 100 } : c))
    );
  };

  const formatMoney = (amountEur: number) => {
    if (currency === 'EUR') return `€${(amountEur / 1000000).toFixed(1)}M`;
    if (currency === 'USD') return `$${((amountEur * 1.09) / 1000000).toFixed(1)}M`;
    if (currency === 'GBP') return `£${((amountEur * 0.84) / 1000000).toFixed(1)}M`;
    if (currency === 'JPY') return `¥${((amountEur * 162) / 1000000).toFixed(0)}M`;
    if (currency === 'SAR') return `﷼${((amountEur * 4.09) / 1000000).toFixed(1)}M`;
    return `€${(amountEur / 1000000).toFixed(1)}M`;
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('transfers')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'transfers'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Transfer Market & GBE Compliance</span>
          </button>
          <button
            onClick={() => setActiveSubTab('fintech')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'fintech'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Multi-Currency FinTech & FX Hedging</span>
          </button>
          <button
            onClick={() => setActiveSubTab('contracts')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'contracts'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>Smart Contracts & Escrow</span>
          </button>
          <button
            onClick={() => setActiveSubTab('esg')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'esg'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Leaf className="w-3.5 h-3.5" />
            <span>Data Sovereignty & ESG Carbon</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>UEFA Squad Cost Ratio: </span>
          <span className="text-emerald-400 font-bold">64.2% (Limit: 70%)</span>
        </div>
      </div>

      {/* Sub-view 1: Transfers & GBE Compliance */}
      {activeSubTab === 'transfers' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Target Cards */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              International Scouting Targets (Algorithmic Valuation)
            </h3>
            {targets.map((target) => {
              const isSelected = target.id === selectedTargetId;
              return (
                <button
                  key={target.id}
                  onClick={() => setSelectedTargetId(target.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-slate-800/90 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold text-white">{target.name}</span>
                    <span className="text-xs font-mono text-emerald-400 font-bold">
                      {formatMoney(target.marketValueEur)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>{target.currentClub}</span>
                    <span aria-hidden="true">·</span>
                    <span>{target.position}</span>
                    <span aria-hidden="true">·</span>
                    <span>Age {target.age}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-2 border-t border-slate-800/60">
                    <span className="text-slate-400">GBE Points: <strong className="text-white">{target.gbePoints} pts</strong> (Pass: 15)</span>
                    <span className="text-emerald-400 font-medium">FIFA TMS: {target.fifaAnnexStatus}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Target In-depth Analysis & Radar */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-bold text-white">{selectedTarget.name}</h4>
                  <div className="text-xs text-slate-400">
                    {selectedTarget.nationality} · Contract with {selectedTarget.currentClub} until {selectedTarget.contractUntil}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500 block">Algorithmic Fair Valuation</span>
                  <span className="text-lg font-bold text-emerald-400 font-mono">
                    {formatMoney(selectedTarget.marketValueEur)}
                  </span>
                </div>
              </div>

              {/* Statistical Percentiles vs Top-5 European Leagues */}
              <div className="space-y-2 mb-4">
                <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Percentile Profile vs Top 5 European Leagues
                </h5>
                <div className="space-y-1.5 text-xs font-mono">
                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Progressive Passes (P90)</span>
                      <span className="text-white">{selectedTarget.radarStats.progPasses}th Percentile</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedTarget.radarStats.progPasses}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Ball Recoveries in Opposition Half</span>
                      <span className="text-white">{selectedTarget.radarStats.ballRecovery}th Percentile</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${selectedTarget.radarStats.ballRecovery}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>xG Chain per 90 (Possession Build-up)</span>
                      <span className="text-white">{selectedTarget.radarStats.xGChain}th Percentile</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${selectedTarget.radarStats.xGChain}%` }}></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-400">
                      <span>Defensive Duels Win Rate</span>
                      <span className="text-white">{selectedTarget.radarStats.duelsSuccess}th Percentile</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full mt-0.5 overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${selectedTarget.radarStats.duelsSuccess}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Regulatory Checks */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>GBE Points: {selectedTarget.gbePoints}</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Automatic Governing Body Endorsement pass. Ready for immediate UK / EU work permit clearance.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>UEFA Squad Cost: +{selectedTarget.squadCostImpactPct}%</span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Projected squad cost will reach 69.0%, maintaining strict compliance under the 70% threshold.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 2: Multi-Currency FinTech & FX Hedging */}
      {activeSubTab === 'fintech' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Cross-Border FX Hedging Desk</h3>
              <p className="text-xs text-slate-400">
                Protect multi-year international transfer installment amortizations against foreign exchange volatility.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Installment Exposure</span>
                <span className="text-base font-bold text-white font-mono mt-1 block">€35,000,000</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Due: June 2027</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Forward Rate Lock</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-1 block">0.842 GBP / EUR</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Bank of England Fixing</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">VaR Hedged Value</span>
                <span className="text-base font-bold text-cyan-400 font-mono mt-1 block">£29,470,000</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Zero Downside Risk</span>
              </div>
            </div>

            {/* Interactive Hedging Calculator */}
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="text-xs font-semibold text-slate-300">Simulate Forward FX Contract</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Transfer Installment Tranche (€ EUR)</span>
                  <span className="text-emerald-400">€{(hedgeAmountEur / 1000000).toFixed(0)}M</span>
                </div>
                <input
                  type="range"
                  min="5000000"
                  max="80000000"
                  step="5000000"
                  value={hedgeAmountEur}
                  onChange={(e) => setHedgeAmountEur(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                <span className="text-slate-400">Target Currency:</span>
                <div className="flex gap-2">
                  {(['GBP', 'USD', 'SAR'] as const).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setTargetCurrency(curr)}
                      className={`px-3 py-1 rounded text-xs font-mono font-medium ${
                        targetCurrency === curr ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              International Currency Reserves
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Euro Pool (EUR)</span>
                <span className="text-white font-bold">€54,200,000</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">British Sterling (GBP)</span>
                <span className="text-white font-bold">£38,400,000</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">US Dollar (USD)</span>
                <span className="text-white font-bold">$22,800,000</span>
              </div>
              <div className="flex justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-400">Saudi Riyal (SAR)</span>
                <span className="text-white font-bold">﷼18,500,000</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 3: Smart Contracts & Escrow */}
      {activeSubTab === 'contracts' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Performance-Triggered Smart Contracts</h3>
                <p className="text-xs text-slate-400">
                  Decentralized escrow contracts that disburse bonus and milestone payments upon verification by official match telemetry oracles.
                </p>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
                Oracle: Opta + Chainlink Sub-graphs
              </span>
            </div>

            <div className="space-y-3">
              {contractsState.map((sc) => (
                <div key={sc.id} className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-bold text-white">{sc.contractTitle}</span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${
                      sc.state === 'Triggered & Disbursed'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {sc.state}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-400 mb-3">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Milestone Goal:</span>
                      <span className="text-slate-200">{sc.metricGoal}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Oracle Feed:</span>
                      <span className="font-mono text-cyan-400 text-[11px]">{sc.oracleFeed}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Escrow Deposit:</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        ${(sc.escrowAmountUsd / 1000000).toFixed(2)}M USD
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-mono text-[11px] text-slate-400">
                      <span>{sc.currentProgress}</span>
                      <span className="text-emerald-400">{sc.progressPct}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${sc.progressPct}%` }}
                      ></div>
                    </div>
                  </div>

                  {sc.state !== 'Triggered & Disbursed' && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleManualDisburse(sc.id)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded transition-colors"
                      >
                        Verify Oracle & Trigger Escrow Release
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 4: Data Sovereignty & ESG */}
      {activeSubTab === 'esg' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Global Data Sovereignty Matrix</h3>
              <p className="text-xs text-slate-400">Automated regulatory adherence for player medical records and fan telemetry across 150+ jurisdictions.</p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">European Union (GDPR)</span>
                  <span className="text-[11px] text-slate-400">Athlete biometrics stored in Frankfurt AWS region (ISO 27001).</span>
                </div>
                <span className="text-emerald-400 font-bold">Compliant</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">California, USA (CCPA / CPRA)</span>
                  <span className="text-[11px] text-slate-400">Fan direct-to-consumer store consent opt-in active.</span>
                </div>
                <span className="text-emerald-400 font-bold">Compliant</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Brazil (LGPD)</span>
                  <span className="text-[11px] text-slate-400">Scouting video feeds anonymized with bounding boxes.</span>
                </div>
                <span className="text-emerald-400 font-bold">Compliant</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Club ESG & Carbon Footprint Registry</h3>
              <p className="text-xs text-slate-400">Scope 1, 2, and 3 travel emissions auditing for UEFA sustainability compliance.</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Total Season Footprint</span>
                <span className="text-base font-bold text-white mt-1 block">482.4 tCO2e</span>
                <span className="text-emerald-400 text-[10px] mt-0.5 block">-18% vs 2024 season</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Certified Carbon Offsets</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">520.0 tCO2e</span>
                <span className="text-slate-400 text-[10px] mt-0.5 block">Gold Standard Reforestation</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="font-semibold text-white block mb-1">Stadium Sustainable Energy Mix:</span>
              <p className="text-slate-400 text-[11px]">
                84% solar canopy generation + on-site battery storage powering stadium floodlights during evening fixtures.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
