export type TabType = 
  | 'ai-lab' 
  | 'satellite' 
  | 'business' 
  | 'marketing' 
  | 'communication' 
  | 'infrastructure'
  | 'dev-pc'
  | 'mobile-games'
  | 'gemini-chat';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  model?: string;
  roleTitle?: string;
  useSearchGrounding?: boolean;
  groundingSources?: Array<{ title: string; uri: string }>;
  webSearchQueries?: string[];
}

export type Currency = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'SAR';

export interface CodeNotebookCell {
  id: string;
  title: string;
  language: 'python' | 'r' | 'sql';
  code: string;
  output?: string;
  executionTimeMs?: number;
  metrics?: { label: string; value: string | number }[];
  status: 'idle' | 'running' | 'success' | 'error';
}

export interface PlayerBiometric {
  id: string;
  name: string;
  number: number;
  position: string;
  acwr: number; // Acute-to-chronic workload ratio
  acuteLoad: number; // Arbitrary load units
  chronicLoad: number;
  rmssd: number; // HRV in ms
  sleepHours: number;
  sleepEfficiency: number; // percentage
  sprintDistanceMeters: number; // >25.2 km/h
  riskScore: number; // 0 to 100
  riskCategory: 'Nominal' | 'Moderate' | 'Elevated' | 'Critical';
  recommendation: string;
}

export interface TrackingPoint {
  id: string;
  team: 'home' | 'away' | 'ball';
  number?: number;
  name?: string;
  x: number; // 0 to 100 (pitch percent)
  y: number; // 0 to 100
  vx: number;
  vy: number;
  speedKmh: number;
  hasBall?: boolean;
}

export interface ActionTag {
  id: string;
  timestamp: string;
  player: string;
  team: 'home' | 'away';
  type: 'Key Pass' | 'Shot on Target' | 'Turnover High Press' | 'Defensive Interception' | 'Progressive Carry';
  xT: number; // Expected Threat change (+0.08)
  confidence: number;
}

export interface PitchFacility {
  id: string;
  name: string;
  location: string;
  coordinates: string;
  pitchType: 'Hybrid Grass' | 'Natural Bentgrass' | 'Warm-Season Bermuda';
  lastSentinelPass: string;
  meanNdvi: number; // Normalised Difference Vegetation Index 0 - 1
  ndwiMoisture: number; // Normalised Difference Water Index
  cleggHardnessG: number; // Clegg Impact Value
  rootDepthMm: number;
  irrigationNeededLiters: number;
  healthStatus: 'Pristine' | 'Nominal' | 'Irrigation Alert' | 'Aeration Required';
}

export interface GnssSatellite {
  id: string;
  constellation: 'Galileo' | 'GPS L5' | 'GLONASS';
  prn: number;
  elevationDeg: number;
  azimuthDeg: number;
  snrDbHz: number;
  carrierBand: 'E5a' | 'E5b' | 'L5';
  status: 'Locked' | 'Tracking' | 'Searching';
}

export interface TransferTarget {
  id: string;
  name: string;
  age: number;
  currentClub: string;
  nationality: string;
  position: string;
  marketValueEur: number;
  contractUntil: number;
  radarStats: {
    progPasses: number;
    ballRecovery: number;
    aerialWinPct: number;
    duelsSuccess: number;
    xGChain: number;
    pressures: number;
  };
  gbePoints: number; // UK / Governing Body Endorsement points (15 needed)
  fifaAnnexStatus: 'Compliant' | 'Review Required';
  squadCostImpactPct: number; // UEFA 70% rule impact
}

export interface SmartContractMilestone {
  id: string;
  contractTitle: string;
  stakeholders: string[];
  oracleFeed: string;
  metricGoal: string;
  currentProgress: string;
  progressPct: number;
  escrowAmountUsd: number;
  state: 'Active' | 'Triggered & Disbursed' | 'Pending Verification';
}

export interface FanSegmentCohort {
  id: string;
  name: string;
  size: number;
  avgLtvUsd: number;
  churnRiskPct: number;
  merchPropensity: number; // 0 - 100
  ticketPropensity: number;
  primaryChannel: string;
}

export interface ProgrammaticAdCampaign {
  id: string;
  title: string;
  triggerEvent: string;
  status: 'Active' | 'Paused' | 'Triggered';
  budgetUsd: number;
  spentUsd: number;
  impressions: number;
  roasMultiplier: number;
  regionalMarkets: string[];
}

export interface BrandSponsorshipTracker {
  id: string;
  brand: string;
  logoCategory: 'Shirt Sponsor' | 'LED Pitchside' | 'Interview Backdrop' | 'Sleeve Patch';
  screenTimeSec: number;
  avgLogoSizePct: number;
  visualClarityScore: number;
  earnedMediaValueUsd: number;
}

export interface PrCrisisFeedItem {
  id: string;
  source: 'Global Social Media' | 'Broadcast Interview' | 'Press Conference' | 'Fan Forum';
  region: string;
  headline: string;
  sentimentScore: number; // -1.0 to +1.0
  severity: 'Nominal' | 'Watch' | 'Critical Spike';
  detectedTime: string;
  recommendedAction: string;
}

export interface EdgeComputeNode {
  id: string;
  name: string;
  location: string;
  gpuLoadPct: number;
  tempCelsius: number;
  inferenceLatencyMs: number;
  activeModels: string[];
  linkRedundancy: 'Primary Starlink Active' | 'Terrestrial Fiber Active';
  status: 'Nominal' | 'Degraded' | 'Offline';
}

export interface DevPcRig {
  id: string;
  name: string;
  codename: string;
  formFactor: 'Extreme AI Tower' | 'Studio Mobile Workstation' | 'Mini Edge Dev Box' | 'Rackmount AI Workstation';
  targetSpecialty: 'Deep Learning & Vision' | 'Game Engine & Physics (UE5)' | 'Mobile Game & Android SDK' | 'Big Data & Spark Node';
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
  os: string;
  status: 'Online & Building' | 'Idle / Ready' | 'Heavy Compute Benchmark' | 'Compiling Game Asset';
  liveMetrics: {
    cpuLoadPct: number;
    gpuLoadPct: number;
    tempCelsius: number;
    fanRpm: number;
    powerWatts: number;
    memoryUsedGb: number;
    memoryTotalGb: number;
  };
  benchmarks: {
    geekbenchMulti: number;
    cudaTflops: number;
    gameCompileMinutes: number;
    aiBatchFps: number;
  };
  installedToolchains: string[];
}

export interface MobileGameProfile {
  id: string;
  title: string;
  genre: 'Sports Simulation' | 'Arcade Reflex Runner' | 'Tactical Manager' | 'Esports Strategy';
  version: string;
  engine: 'Unity 2026 LTS' | 'Unreal Engine 5.5' | 'Custom WebGL C++ Engine';
  targetPlatforms: string[];
  rating: number;
  activeDau: number;
  retentionDay30: number; // percentage
  targetFps: number;
  avgTouchLatencyMs: number;
  monetizationModel: string;
  monthlyRevenueUsd: number;
  status: 'Live on App Store & Google Play' | 'Beta Test Flight' | 'Playable in Amnetek OS';
}

