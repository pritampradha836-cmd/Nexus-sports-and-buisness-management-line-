/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TabType, Currency } from './types/sports-os';
import { 
  INITIAL_NOTEBOOK_CELLS, 
  INITIAL_SQUAD_BIOMETRICS, 
  INITIAL_TRACKING_PLAYERS, 
  INITIAL_ACTION_TAGS, 
  INITIAL_PITCH_FACILITIES, 
  INITIAL_GNSS_SATELLITES, 
  INITIAL_TRANSFER_TARGETS, 
  INITIAL_SMART_CONTRACTS, 
  INITIAL_FAN_COHORTS, 
  INITIAL_PROGRAMMATIC_ADS, 
  INITIAL_SPONSORSHIPS, 
  INITIAL_PR_CRISIS_FEED, 
  INITIAL_EDGE_NODES,
  INITIAL_DEV_PC_RIGS,
  INITIAL_MOBILE_GAMES
} from './data/mockData';

import { Header } from './components/layout/Header';
import { AiDataScienceLab } from './components/ai-lab/AiDataScienceLab';
import { SatelliteFieldOps } from './components/satellite/SatelliteFieldOps';
import { InternationalBusinessLine } from './components/business/InternationalBusinessLine';
import { MarketingIntelligence } from './components/marketing/MarketingIntelligence';
import { GlobalCommunication } from './components/communication/GlobalCommunication';
import { AdvancedItManagement } from './components/infrastructure/AdvancedItManagement';
import { DevPcVariety } from './components/dev-pc/DevPcVariety';
import { MobileGamesStudio } from './components/mobile-games/MobileGamesStudio';
import { GeminiChatbotStudio } from './components/chat/GeminiChatbotStudio';
import { SportsAiAssistantModal } from './components/assistant/SportsAiAssistantModal';
import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('ai-lab');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Core mutable state
  const [notebookCells, setNotebookCells] = useState(INITIAL_NOTEBOOK_CELLS);
  const [squadBiometrics] = useState(INITIAL_SQUAD_BIOMETRICS);
  const [trackingPlayers] = useState(INITIAL_TRACKING_PLAYERS);
  const [actionTags] = useState(INITIAL_ACTION_TAGS);
  const [pitchFacilities] = useState(INITIAL_PITCH_FACILITIES);
  const [satellites] = useState(INITIAL_GNSS_SATELLITES);
  const [transferTargets] = useState(INITIAL_TRANSFER_TARGETS);
  const [smartContracts] = useState(INITIAL_SMART_CONTRACTS);
  const [fanCohorts] = useState(INITIAL_FAN_COHORTS);
  const [adCampaigns] = useState(INITIAL_PROGRAMMATIC_ADS);
  const [sponsorships] = useState(INITIAL_SPONSORSHIPS);
  const [crisisFeed] = useState(INITIAL_PR_CRISIS_FEED);
  const [edgeNodes] = useState(INITIAL_EDGE_NODES);
  const [devRigs] = useState(INITIAL_DEV_PC_RIGS);
  const [mobileGames] = useState(INITIAL_MOBILE_GAMES);

  const handleRunCell = (cellId: string) => {
    setNotebookCells((prev) =>
      prev.map((c) =>
        c.id === cellId
          ? {
              ...c,
              status: 'success',
              executionTimeMs: Math.floor(Math.random() * 80 + 60),
            }
          : c
      )
    );
  };

  const handleExportData = () => {
    const dataSnapshot = {
      exportTimestamp: new Date().toISOString(),
      company: 'Amnetek Technologies Group',
      operationalCurrency: currency,
      dataLakehouseSummary: {
        totalTrackingEvents50Hz: 1482000,
        athletesMonitored: squadBiometrics.length,
        pitchFacilitiesSurveyed: pitchFacilities.length,
        activeGnssSatellites: satellites.length,
        transferTargetsAudited: transferTargets.length,
        activeAdCampaigns: adCampaigns.length,
        developerPcWorkstationsOnline: devRigs.length,
        mobileGamesInStudio: mobileGames.length,
        broadcastSmvValuationTotal: sponsorships.reduce((acc, s) => acc + s.earnedMediaValueUsd, 0),
      },
      squadBiometrics,
      pitchFacilities,
      transferTargets,
      smartContracts,
      fanCohorts,
      sponsorships,
      devRigs,
      mobileGames,
    };

    const blob = new Blob([JSON.stringify(dataSnapshot, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amnetek_sports_gaming_lakehouse_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-emerald-500/20 selection:text-emerald-300">
      {/* Top Bar Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
        onExportData={handleExportData}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-[1520px] mx-auto px-4 lg:px-8 py-6 space-y-6">
        {/* Prominent In-App PWA Install Banner */}
        <PWAInstallButton variant="card" />

        {activeTab === 'ai-lab' && (
          <AiDataScienceLab
            notebookCells={notebookCells}
            onRunCell={handleRunCell}
            squadBiometrics={squadBiometrics}
            trackingPlayers={trackingPlayers}
            actionTags={actionTags}
          />
        )}

        {activeTab === 'satellite' && (
          <SatelliteFieldOps
            facilities={pitchFacilities}
            satellites={satellites}
          />
        )}

        {activeTab === 'business' && (
          <InternationalBusinessLine
            targets={transferTargets}
            smartContracts={smartContracts}
            currency={currency}
          />
        )}

        {activeTab === 'marketing' && (
          <MarketingIntelligence
            fanCohorts={fanCohorts}
            adCampaigns={adCampaigns}
            sponsorships={sponsorships}
          />
        )}

        {activeTab === 'communication' && (
          <GlobalCommunication
            crisisFeed={crisisFeed}
          />
        )}

        {activeTab === 'infrastructure' && (
          <AdvancedItManagement
            edgeNodes={edgeNodes}
          />
        )}

        {activeTab === 'dev-pc' && (
          <DevPcVariety
            devRigs={devRigs}
          />
        )}

        {activeTab === 'mobile-games' && (
          <MobileGamesStudio
            games={mobileGames}
          />
        )}

        {activeTab === 'gemini-chat' && (
          <GeminiChatbotStudio />
        )}
      </main>

      {/* Clean Global Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Amnetek OS</span>
            <span aria-hidden="true">·</span>
            <span>Enterprise Sports Data Science, Dev PC Rigs & Mobile Gaming Studio</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Company: Amnetek Technologies</span>
            <span aria-hidden="true">·</span>
            <span>GNSS: Galileo E5 + GPS L5</span>
            <span aria-hidden="true">·</span>
            <span>Lakehouse: Apache Iceberg</span>
            <span aria-hidden="true">·</span>
            <span>Edge Inference: &lt;10ms</span>
          </div>
        </div>
      </footer>

      {/* Sports AI Assistant Modal */}
      <SportsAiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Offline Connectivity Indicator */}
      <OfflineIndicator />
    </div>
  );
}
