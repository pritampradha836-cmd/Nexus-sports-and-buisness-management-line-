import { 
  CodeNotebookCell, 
  PlayerBiometric, 
  TrackingPoint, 
  ActionTag, 
  PitchFacility, 
  GnssSatellite, 
  TransferTarget, 
  SmartContractMilestone, 
  FanSegmentCohort, 
  ProgrammaticAdCampaign, 
  BrandSponsorshipTracker, 
  PrCrisisFeedItem, 
  EdgeComputeNode,
  DevPcRig,
  MobileGameProfile
} from '../types/sports-os';

export const INITIAL_NOTEBOOK_CELLS: CodeNotebookCell[] = [
  {
    id: 'cell-xg',
    title: 'Expected Goals (xG) Logistic Regression with Distance & Angle Vector',
    language: 'python',
    code: `import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression

# Ingest coordinate features from Big Data Lakehouse (Opta / Second Spectrum)
df = pd.read_parquet('s3://sports-lakehouse/events/shots_season_2026.parquet')

# Feature engineering: Euclidean distance to goal center & shot angle
df['goal_dist_m'] = np.sqrt((105 - df['x_coord'])**2 + (34 - df['y_coord'])**2)
df['shot_angle_rad'] = np.arctan2(7.32 * (105 - df['x_coord']), 
                                  (105 - df['x_coord'])**2 + (34 - df['y_coord'])**2 - (7.32/2)**2)

# Logistic regression training for xG
features = ['goal_dist_m', 'shot_angle_rad', 'is_header', 'under_pressure_index', 'big_chance_flag']
model = LogisticRegression(C=1.4, penalty='l2')
model.fit(df[features], df['goal_scored'])

auc_roc = 0.814
brier_score = 0.089
print(f"Model Converged. Log-Loss: 0.284 | AUC-ROC: {auc_roc:.3f} | Brier: {brier_score:.3f}")`,
    output: `[INFO] Read 14,820 shot events from Iceberg partition.
[INFO] Convergence reached after 18 L-BFGS iterations.
Model Converged. Log-Loss: 0.284 | AUC-ROC: 0.814 | Brier: 0.089
Top predictor weights:
 - shot_angle_rad: +1.842
 - goal_dist_m: -0.128
 - under_pressure_index: -0.412`,
    executionTimeMs: 142,
    metrics: [
      { label: 'AUC-ROC', value: '0.814' },
      { label: 'Brier Score', value: '0.089' },
      { label: 'Log-Loss', value: '0.284' },
      { label: 'Feature Importance', value: 'Angle (44%), Dist (31%)' }
    ],
    status: 'success'
  },
  {
    id: 'cell-injury',
    title: 'Cox Proportional Hazards Soft-Tissue Hazard Estimator',
    language: 'python',
    code: `import lifelines
from lifelines import CoxPHFitter

# Ingest longitudinal GNSS external training load + Catapult/WHOOP telemetry
biometrics = pd.read_parquet('s3://sports-lakehouse/wearables/acwr_longitudinal.parquet')

# Model time-to-hamstring/groin strain based on acute:chronic workload spikes
cph = CoxPHFitter(penalizer=0.1)
cph.fit(biometrics, duration_col='days_to_strain', event_col='injury_occurred')
cph.print_summary()`,
    output: `[INFO] Ingested 42 squad athletes across 280 training sessions.
CoxPHFitter Summary:
 - acute_chronic_ratio (ACWR > 1.35): HR = 2.48 (p = 0.003) **
 - high_speed_running_spikes: HR = 1.92 (p = 0.012) *
 - rmssd_drop_pct: HR = 1.64 (p = 0.028) *
Concordance Index: 0.772`,
    executionTimeMs: 289,
    metrics: [
      { label: 'Hazard Ratio (ACWR)', value: '2.48x' },
      { label: 'Concordance Index', value: '0.772' },
      { label: 'p-Value', value: '0.003' }
    ],
    status: 'success'
  },
  {
    id: 'cell-monte-carlo',
    title: 'Tactical Monte Carlo 10,000 Match Outcome Simulation',
    language: 'python',
    code: `import numpy as np

# Simulate match scenarios under high-pressing line (62m) vs low-block counter
np.random.seed(42)
simulations = 10000

home_expected_goals = 2.14
away_expected_goals = 0.92

home_goals = np.random.poisson(home_expected_goals, simulations)
away_goals = np.random.poisson(away_expected_goals, simulations)

home_wins = np.mean(home_goals > away_goals) * 100
draws = np.mean(home_goals == away_goals) * 100
away_wins = np.mean(home_goals < away_goals) * 100

print(f"Simulations Completed: {simulations:,}")
print(f"Win: {home_wins:.1f}% | Draw: {draws:.1f}% | Loss: {away_wins:.1f}%")`,
    output: `Simulations Completed: 10,000
Win: 64.2% | Draw: 21.4% | Loss: 14.4%
Most Probable Scorelines:
 1. 2 - 0 (14.2%)
 2. 2 - 1 (13.1%)
 3. 3 - 1 (9.8%)`,
    executionTimeMs: 78,
    metrics: [
      { label: 'Win Probability', value: '64.2%' },
      { label: 'Draw Probability', value: '21.4%' },
      { label: 'Loss Probability', value: '14.4%' },
      { label: 'Expected Points (xPTS)', value: '2.14' }
    ],
    status: 'success'
  }
];

export const INITIAL_SQUAD_BIOMETRICS: PlayerBiometric[] = [
  {
    id: 'p-01',
    name: 'Mateo Silva',
    number: 8,
    position: 'Central Midfielder',
    acwr: 1.46,
    acuteLoad: 680,
    chronicLoad: 465,
    rmssd: 36,
    sleepHours: 6.8,
    sleepEfficiency: 79,
    sprintDistanceMeters: 890,
    riskScore: 78,
    riskCategory: 'Elevated',
    recommendation: 'Cap match load at 60 mins. High ACWR spike (+31% vs 28-day rolling window).'
  },
  {
    id: 'p-02',
    name: 'Kylian Vance',
    number: 7,
    position: 'Right Winger',
    acwr: 1.12,
    acuteLoad: 520,
    chronicLoad: 464,
    rmssd: 58,
    sleepHours: 8.4,
    sleepEfficiency: 92,
    sprintDistanceMeters: 1140,
    riskScore: 24,
    riskCategory: 'Nominal',
    recommendation: 'Optimal autonomic recovery. Full capacity for 90+ minutes.'
  },
  {
    id: 'p-03',
    name: 'Julian Lindqvist',
    number: 4,
    position: 'Center Back',
    acwr: 1.28,
    acuteLoad: 490,
    chronicLoad: 382,
    rmssd: 44,
    sleepHours: 7.2,
    sleepEfficiency: 84,
    sprintDistanceMeters: 410,
    riskScore: 42,
    riskCategory: 'Moderate',
    recommendation: 'Monitor lumbar mechanical load during set-piece drills.'
  },
  {
    id: 'p-04',
    name: 'Gabriel Al-Mansoor',
    number: 10,
    position: 'Attacking Playmaker',
    acwr: 1.58,
    acuteLoad: 790,
    chronicLoad: 500,
    rmssd: 31,
    sleepHours: 6.2,
    sleepEfficiency: 72,
    sprintDistanceMeters: 780,
    riskScore: 86,
    riskCategory: 'Critical',
    recommendation: 'High soft-tissue hamstring strain probability. Rest recommended from starting lineup.'
  },
  {
    id: 'p-05',
    name: 'Devon Walker',
    number: 2,
    position: 'Right Fullback',
    acwr: 1.05,
    acuteLoad: 440,
    chronicLoad: 419,
    rmssd: 62,
    sleepHours: 8.1,
    sleepEfficiency: 91,
    sprintDistanceMeters: 980,
    riskScore: 18,
    riskCategory: 'Nominal',
    recommendation: 'Nominal baseline. Excellent sprint deceleration mechanics.'
  },
  {
    id: 'p-06',
    name: 'Luca Moretti',
    number: 1,
    position: 'Goalkeeper',
    acwr: 0.98,
    acuteLoad: 290,
    chronicLoad: 295,
    rmssd: 68,
    sleepHours: 8.6,
    sleepEfficiency: 95,
    sprintDistanceMeters: 120,
    riskScore: 12,
    riskCategory: 'Nominal',
    recommendation: 'Optimal reaction speed and nervous system readiness.'
  }
];

export const INITIAL_TRACKING_PLAYERS: TrackingPoint[] = [
  // Home Team (Blue)
  { id: 'h1', team: 'home', number: 1, name: 'Moretti', x: 8, y: 50, vx: 0.1, vy: 0.0, speedKmh: 4.2 },
  { id: 'h2', team: 'home', number: 2, name: 'Walker', x: 26, y: 15, vx: 0.4, vy: 0.1, speedKmh: 18.4 },
  { id: 'h3', team: 'home', number: 4, name: 'Lindqvist', x: 22, y: 38, vx: 0.1, vy: 0.2, speedKmh: 12.1 },
  { id: 'h4', team: 'home', number: 5, name: 'Abe', x: 22, y: 62, vx: 0.2, vy: -0.1, speedKmh: 11.5 },
  { id: 'h5', team: 'home', number: 3, name: 'Mendy', x: 27, y: 85, vx: 0.5, vy: -0.2, speedKmh: 19.8 },
  { id: 'h6', team: 'home', number: 6, name: 'Camara', x: 42, y: 48, vx: 0.3, vy: 0.1, speedKmh: 15.6 },
  { id: 'h7', team: 'home', number: 8, name: 'Silva', x: 55, y: 32, vx: 0.6, vy: 0.2, speedKmh: 22.4 },
  { id: 'h8', team: 'home', number: 10, name: 'Al-Mansoor', x: 58, y: 65, vx: 0.2, vy: -0.3, speedKmh: 16.2, hasBall: true },
  { id: 'h9', team: 'home', number: 7, name: 'Vance', x: 74, y: 20, vx: 0.8, vy: 0.4, speedKmh: 28.6 },
  { id: 'h10', team: 'home', number: 11, name: 'Ferreira', x: 72, y: 80, vx: 0.5, vy: -0.1, speedKmh: 24.1 },
  { id: 'h11', team: 'home', number: 9, name: 'Osimhen', x: 82, y: 52, vx: 0.7, vy: -0.2, speedKmh: 27.8 },

  // Away Team (Red)
  { id: 'a1', team: 'away', number: 1, name: 'Kahn', x: 94, y: 50, vx: -0.1, vy: 0.0, speedKmh: 3.8 },
  { id: 'a2', team: 'away', number: 2, name: 'Davies', x: 72, y: 18, vx: -0.7, vy: -0.3, speedKmh: 26.5 },
  { id: 'a3', team: 'away', number: 4, name: 'Dias', x: 78, y: 40, vx: -0.4, vy: 0.1, speedKmh: 17.2 },
  { id: 'a4', team: 'away', number: 5, name: 'Saliba', x: 78, y: 60, vx: -0.3, vy: -0.1, speedKmh: 16.5 },
  { id: 'a5', team: 'away', number: 3, name: 'Hernandez', x: 70, y: 82, vx: -0.6, vy: 0.2, speedKmh: 23.4 },
  { id: 'a6', team: 'away', number: 6, name: 'Rodri', x: 58, y: 46, vx: -0.2, vy: 0.1, speedKmh: 14.8 },
  { id: 'a7', team: 'away', number: 8, name: 'Bellingham', x: 50, y: 35, vx: -0.5, vy: -0.2, speedKmh: 21.0 },
  { id: 'a8', team: 'away', number: 10, name: 'Pedri', x: 48, y: 62, vx: -0.3, vy: 0.2, speedKmh: 17.5 },
  { id: 'a9', team: 'away', number: 7, name: 'Saka', x: 38, y: 22, vx: -0.6, vy: 0.1, speedKmh: 22.8 },
  { id: 'a10', team: 'away', number: 11, name: 'Vinicius', x: 35, y: 78, vx: -0.8, vy: -0.3, speedKmh: 29.2 },
  { id: 'a11', team: 'away', number: 9, name: 'Haaland', x: 28, y: 50, vx: -0.4, vy: 0.0, speedKmh: 19.5 },

  // Ball
  { id: 'ball', team: 'ball', x: 60, y: 64, vx: 1.2, vy: -0.4, speedKmh: 34.5 }
];

export const INITIAL_ACTION_TAGS: ActionTag[] = [
  { id: 't1', timestamp: "74' 12\"", player: 'Gabriel Al-Mansoor', team: 'home', type: 'Key Pass', xT: 0.082, confidence: 0.94 },
  { id: 't2', timestamp: "73' 58\"", player: 'Mateo Silva', team: 'home', type: 'Progressive Carry', xT: 0.041, confidence: 0.96 },
  { id: 't3', timestamp: "72' 40\"", player: 'Rodri', team: 'away', type: 'Turnover High Press', xT: -0.065, confidence: 0.91 },
  { id: 't4', timestamp: "70' 15\"", player: 'Kylian Vance', team: 'home', type: 'Shot on Target', xT: 0.145, confidence: 0.98 },
  { id: 't5', timestamp: "68' 22\"", player: 'Julian Lindqvist', team: 'home', type: 'Defensive Interception', xT: 0.038, confidence: 0.89 }
];

export const INITIAL_PITCH_FACILITIES: PitchFacility[] = [
  {
    id: 'stadium-main',
    name: 'Metropolis Arena Pitch 1',
    location: 'London, United Kingdom',
    coordinates: '51.5560° N, 0.2795° W',
    pitchType: 'Hybrid Grass',
    lastSentinelPass: '2026-10-02 11:24 UTC (Sentinel-2C)',
    meanNdvi: 0.842,
    ndwiMoisture: 0.612,
    cleggHardnessG: 84,
    rootDepthMm: 145,
    irrigationNeededLiters: 1200,
    healthStatus: 'Pristine'
  },
  {
    id: 'academy-pitch-3',
    name: 'High Performance Training Complex - Pitch 3',
    location: 'St. Albans, Hertfordshire',
    coordinates: '51.7520° N, 0.3390° W',
    pitchType: 'Natural Bentgrass',
    lastSentinelPass: '2026-10-02 11:24 UTC (Sentinel-2C)',
    meanNdvi: 0.718,
    ndwiMoisture: 0.445,
    cleggHardnessG: 104,
    rootDepthMm: 110,
    irrigationNeededLiters: 4800,
    healthStatus: 'Irrigation Alert'
  },
  {
    id: 'altitude-camp',
    name: 'Alpine High-Altitude Training Facility',
    location: 'St. Moritz, Switzerland (1,822m)',
    coordinates: '46.4908° N, 9.8355° E',
    pitchType: 'Warm-Season Bermuda',
    lastSentinelPass: '2026-10-01 10:48 UTC (Landsat-9)',
    meanNdvi: 0.645,
    ndwiMoisture: 0.520,
    cleggHardnessG: 118,
    rootDepthMm: 95,
    irrigationNeededLiters: 3200,
    healthStatus: 'Aeration Required'
  },
  {
    id: 'winter-camp',
    name: 'Coastal Mediterranean Warm-Weather Center',
    location: 'Marbella, Spain',
    coordinates: '36.5101° N, 4.8825° W',
    pitchType: 'Hybrid Grass',
    lastSentinelPass: '2026-10-02 12:05 UTC (Sentinel-2C)',
    meanNdvi: 0.884,
    ndwiMoisture: 0.680,
    cleggHardnessG: 78,
    rootDepthMm: 160,
    irrigationNeededLiters: 800,
    healthStatus: 'Pristine'
  }
];

export const INITIAL_GNSS_SATELLITES: GnssSatellite[] = [
  { id: 'gal-01', constellation: 'Galileo', prn: 11, elevationDeg: 68, azimuthDeg: 142, snrDbHz: 48.2, carrierBand: 'E5a', status: 'Locked' },
  { id: 'gal-02', constellation: 'Galileo', prn: 19, elevationDeg: 54, azimuthDeg: 285, snrDbHz: 46.8, carrierBand: 'E5b', status: 'Locked' },
  { id: 'gal-03', constellation: 'Galileo', prn: 24, elevationDeg: 81, azimuthDeg: 45, snrDbHz: 51.4, carrierBand: 'E5a', status: 'Locked' },
  { id: 'gps-01', constellation: 'GPS L5', prn: 4, elevationDeg: 72, azimuthDeg: 190, snrDbHz: 49.6, carrierBand: 'L5', status: 'Locked' },
  { id: 'gps-02', constellation: 'GPS L5', prn: 18, elevationDeg: 42, azimuthDeg: 310, snrDbHz: 44.1, carrierBand: 'L5', status: 'Locked' },
  { id: 'gps-03', constellation: 'GPS L5', prn: 27, elevationDeg: 35, azimuthDeg: 85, snrDbHz: 43.5, carrierBand: 'L5', status: 'Locked' },
  { id: 'glo-01', constellation: 'GLONASS', prn: 7, elevationDeg: 61, azimuthDeg: 220, snrDbHz: 47.0, carrierBand: 'E5a', status: 'Locked' },
  { id: 'gal-04', constellation: 'Galileo', prn: 33, elevationDeg: 28, azimuthDeg: 15, snrDbHz: 39.8, carrierBand: 'E5b', status: 'Tracking' }
];

export const INITIAL_TRANSFER_TARGETS: TransferTarget[] = [
  {
    id: 'tr-01',
    name: 'Tiago Santos',
    age: 22,
    currentClub: 'Lille OSC',
    nationality: 'Portugal',
    position: 'Right Wing-Back',
    marketValueEur: 42000000,
    contractUntil: 2028,
    radarStats: {
      progPasses: 88,
      ballRecovery: 84,
      aerialWinPct: 62,
      duelsSuccess: 81,
      xGChain: 79,
      pressures: 86
    },
    gbePoints: 21,
    fifaAnnexStatus: 'Compliant',
    squadCostImpactPct: 4.8
  },
  {
    id: 'tr-02',
    name: 'Youssef En-Naji',
    age: 21,
    currentClub: 'Feyenoord',
    nationality: 'Morocco',
    position: 'Box-to-Box Midfielder',
    marketValueEur: 28500000,
    contractUntil: 2029,
    radarStats: {
      progPasses: 92,
      ballRecovery: 91,
      aerialWinPct: 74,
      duelsSuccess: 87,
      xGChain: 85,
      pressures: 94
    },
    gbePoints: 18,
    fifaAnnexStatus: 'Compliant',
    squadCostImpactPct: 3.2
  },
  {
    id: 'tr-03',
    name: 'Hiroki Takahashi',
    age: 20,
    currentClub: 'Gamba Osaka',
    nationality: 'Japan',
    position: 'Center Forward',
    marketValueEur: 16000000,
    contractUntil: 2027,
    radarStats: {
      progPasses: 68,
      ballRecovery: 55,
      aerialWinPct: 69,
      duelsSuccess: 76,
      xGChain: 93,
      pressures: 82
    },
    gbePoints: 16,
    fifaAnnexStatus: 'Compliant',
    squadCostImpactPct: 1.8
  }
];

export const INITIAL_SMART_CONTRACTS: SmartContractMilestone[] = [
  {
    id: 'sc-01',
    contractTitle: 'Puma Kit Performance Incentive: European Qualification',
    stakeholders: ['Metropolis FC', 'Puma SE', 'Standard Chartered Escrow'],
    oracleFeed: 'UEFA Competition Official Match API + Chainlink',
    metricGoal: 'Top 4 League Finish or UCL Group Stage Qualification',
    currentProgress: 'Current League Position: 3rd (Matchday 28 of 38)',
    progressPct: 82,
    escrowAmountUsd: 4500000,
    state: 'Active'
  },
  {
    id: 'sc-02',
    contractTitle: 'Player Goal Milestone Clause: Mateo Silva 15 Contributions',
    stakeholders: ['Metropolis FC', 'Silva Sports Management', 'Player Escrow'],
    oracleFeed: 'Opta Live Stats Feed Oracle',
    metricGoal: '15 Total Goals + Assists in Domestic League',
    currentProgress: '12 Goals / Assists verified by coordinate engine',
    progressPct: 80,
    escrowAmountUsd: 750000,
    state: 'Active'
  },
  {
    id: 'sc-03',
    contractTitle: 'Sponsorship LED Exposure Verification: Emirates Airline',
    stakeholders: ['Metropolis FC', 'The Emirates Group'],
    oracleFeed: 'Nexus Computer Vision Broadcast Logo Monitor',
    metricGoal: 'Minimum 1,200 On-Air Brand Seconds per Season',
    currentProgress: '1,348 Verified Broadcast Seconds Reached',
    progressPct: 100,
    escrowAmountUsd: 12000000,
    state: 'Triggered & Disbursed'
  }
];

export const INITIAL_FAN_COHORTS: FanSegmentCohort[] = [
  {
    id: 'fc-01',
    name: 'Global Digital OTT & Gaming Gen-Z',
    size: 284000,
    avgLtvUsd: 215,
    churnRiskPct: 12.4,
    merchPropensity: 74,
    ticketPropensity: 32,
    primaryChannel: 'TikTok & Discord'
  },
  {
    id: 'fc-02',
    name: 'Domestic Season Ticket Holders (VIP / Club Level)',
    size: 38500,
    avgLtvUsd: 2850,
    churnRiskPct: 3.1,
    merchPropensity: 88,
    ticketPropensity: 98,
    primaryChannel: 'Direct Concierge & SMS'
  },
  {
    id: 'fc-03',
    name: 'International Kit Collectors & Casual Tourists',
    size: 640000,
    avgLtvUsd: 145,
    churnRiskPct: 24.2,
    merchPropensity: 92,
    ticketPropensity: 48,
    primaryChannel: 'Meta Ads & E-Commerce Web'
  },
  {
    id: 'fc-04',
    name: 'B2B Hospitality & Corporate Partners',
    size: 1240,
    avgLtvUsd: 48000,
    churnRiskPct: 6.8,
    merchPropensity: 45,
    ticketPropensity: 96,
    primaryChannel: 'Executive LinkedIn & Direct Rep'
  }
];

export const INITIAL_PROGRAMMATIC_ADS: ProgrammaticAdCampaign[] = [
  {
    id: 'ad-01',
    title: 'Flash Goal Trigger: Scorer Home Jersey Flash Promo',
    triggerEvent: 'Goal scored in 70th-90th minute by designated player',
    status: 'Active',
    budgetUsd: 45000,
    spentUsd: 18200,
    impressions: 1420000,
    roasMultiplier: 4.82,
    regionalMarkets: ['UK', 'USA', 'Japan', 'Brazil']
  },
  {
    id: 'ad-02',
    title: 'Dynamic Ticketing Derby Yield Optimizer',
    triggerEvent: 'Remaining seat inventory >8% at Matchday -48 hours',
    status: 'Active',
    budgetUsd: 20000,
    spentUsd: 8400,
    impressions: 680000,
    roasMultiplier: 6.12,
    regionalMarkets: ['Greater London', 'South East England']
  },
  {
    id: 'ad-03',
    title: 'Continental Broadcast Post-Match Highlights Push',
    triggerEvent: 'Full-time whistle victory in UCL fixtures',
    status: 'Active',
    budgetUsd: 60000,
    spentUsd: 31500,
    impressions: 3840000,
    roasMultiplier: 3.94,
    regionalMarkets: ['Western Europe', 'MENA', 'East Asia']
  }
];

export const INITIAL_SPONSORSHIPS: BrandSponsorshipTracker[] = [
  {
    id: 'sp-01',
    brand: 'Emirates Airline',
    logoCategory: 'Shirt Sponsor',
    screenTimeSec: 2840,
    avgLogoSizePct: 4.8,
    visualClarityScore: 96.2,
    earnedMediaValueUsd: 14200000
  },
  {
    id: 'sp-02',
    brand: 'Puma Performance',
    logoCategory: 'Shirt Sponsor',
    screenTimeSec: 2210,
    avgLogoSizePct: 3.1,
    visualClarityScore: 94.8,
    earnedMediaValueUsd: 8900000
  },
  {
    id: 'sp-03',
    brand: 'Standard Chartered',
    logoCategory: 'LED Pitchside',
    screenTimeSec: 1450,
    avgLogoSizePct: 6.4,
    visualClarityScore: 91.5,
    earnedMediaValueUsd: 5400000
  },
  {
    id: 'sp-04',
    brand: 'PlayStation 5',
    logoCategory: 'Interview Backdrop',
    screenTimeSec: 890,
    avgLogoSizePct: 5.2,
    visualClarityScore: 98.1,
    earnedMediaValueUsd: 3200000
  }
];

export const INITIAL_PR_CRISIS_FEED: PrCrisisFeedItem[] = [
  {
    id: 'pr-01',
    source: 'Global Social Media',
    region: 'South America (Brazil & Argentina)',
    headline: 'Viral rumor alleging star forward training ground fallout',
    sentimentScore: -0.68,
    severity: 'Watch',
    detectedTime: '18 mins ago',
    recommendedAction: 'Deploy verified locker room training clip via official TikTok with coach quote.'
  },
  {
    id: 'pr-02',
    source: 'Press Conference',
    region: 'Western Europe',
    headline: 'Post-match referee VAR penalty controversy debate',
    sentimentScore: -0.42,
    severity: 'Nominal',
    detectedTime: '1 hr 12m ago',
    recommendedAction: 'Standard club protocol: Refrain from speculative commentary, await referee committee report.'
  },
  {
    id: 'pr-03',
    source: 'Fan Forum',
    region: 'Domestic UK',
    headline: 'Praise for youth academy debutant performance in domestic cup',
    sentimentScore: 0.89,
    severity: 'Nominal',
    detectedTime: '2 hrs ago',
    recommendedAction: 'Amplify organic fan clips and announce exclusive behind-the-scenes academy doc.'
  }
];

export const INITIAL_EDGE_NODES: EdgeComputeNode[] = [
  {
    id: 'node-pitch-north',
    name: 'Pitchside Edge Pod Alpha (North Gantry)',
    location: 'Metropolis Stadium Level 4',
    gpuLoadPct: 62,
    tempCelsius: 58,
    inferenceLatencyMs: 6.8,
    activeModels: ['Skeletal Joint Pose 50Hz', 'Ball 3D Trajectory Vector'],
    linkRedundancy: 'Primary Starlink Active',
    status: 'Nominal'
  },
  {
    id: 'node-pitch-south',
    name: 'Pitchside Edge Pod Beta (South Gantry)',
    location: 'Metropolis Stadium Level 4',
    gpuLoadPct: 68,
    tempCelsius: 61,
    inferenceLatencyMs: 7.2,
    activeModels: ['Sponsorship CV Logo Extractor', 'Crowd Density Footfall'],
    linkRedundancy: 'Terrestrial Fiber Active',
    status: 'Nominal'
  },
  {
    id: 'node-training-complex',
    name: 'Academy GNSS RTK Base Station Node',
    location: 'High Performance Center London Colney',
    gpuLoadPct: 34,
    tempCelsius: 48,
    inferenceLatencyMs: 4.1,
    activeModels: ['Galileo/GPS Centimeter RTK Solver', 'ACWR Hazard Live Stream'],
    linkRedundancy: 'Terrestrial Fiber Active',
    status: 'Nominal'
  }
];

export const INITIAL_DEV_PC_RIGS: DevPcRig[] = [
  {
    id: 'pc-titan-ai',
    name: 'Amnetek Titan-X AI Superstation',
    codename: 'PROMETHEUS-96',
    formFactor: 'Extreme AI Tower',
    targetSpecialty: 'Deep Learning & Vision',
    cpu: 'AMD Ryzen Threadripper PRO 7995WX (96 Cores, 192 Threads, 5.1GHz Turbo)',
    gpu: 'Dual NVIDIA GeForce RTX 4090 24GB + NVLink Ada (48GB VRAM)',
    ram: '256GB Octa-Channel DDR5-5600 ECC Registered',
    storage: '8TB Gen5 NVMe SSD RAID 0 (14,400 MB/s Sequential Read)',
    os: 'Ubuntu 24.04 LTS (NVIDIA NGC, CUDA 12.6, PyTorch 2.5)',
    status: 'Online & Building',
    liveMetrics: {
      cpuLoadPct: 44,
      gpuLoadPct: 82,
      tempCelsius: 64,
      fanRpm: 1850,
      powerWatts: 820,
      memoryUsedGb: 114,
      memoryTotalGb: 256
    },
    benchmarks: {
      geekbenchMulti: 104200,
      cudaTflops: 165.2,
      gameCompileMinutes: 1.4,
      aiBatchFps: 2450
    },
    installedToolchains: [
      'CUDA 12.6 Toolkit',
      'PyTorch 2.5 + TorchVision',
      'TensorRT 10.2 LLM',
      'Docker + Kubernetes Engine',
      'JupyterLab Enterprise 4.3'
    ]
  },
  {
    id: 'pc-studio-m4',
    name: 'Amnetek Studio Max Portable Lab',
    codename: 'VORTEX-M4',
    formFactor: 'Studio Mobile Workstation',
    targetSpecialty: 'Mobile Game & Android SDK',
    cpu: 'Apple M4 Max (16-Core High-Performance & Efficiency)',
    gpu: 'Apple 40-Core GPU (Hardware Ray Tracing & Mesh Shading)',
    ram: '128GB Unified Memory (546 GB/s memory bandwidth)',
    storage: '4TB Ultra-High Speed APFS Solid State Storage',
    os: 'macOS Sequoia 15.1 + Amnetek CLI Tools',
    status: 'Compiling Game Asset',
    liveMetrics: {
      cpuLoadPct: 28,
      gpuLoadPct: 54,
      tempCelsius: 52,
      fanRpm: 1200,
      powerWatts: 95,
      memoryUsedGb: 46,
      memoryTotalGb: 128
    },
    benchmarks: {
      geekbenchMulti: 26800,
      cudaTflops: 38.4,
      gameCompileMinutes: 3.1,
      aiBatchFps: 680
    },
    installedToolchains: [
      'Xcode 16.2 + Swift 6',
      'Android Studio Ladybug (API 35)',
      'Flutter 3.24 + Dart SDK',
      'Metal Performance Shaders (MPS)',
      'Unity Hub 2026.1'
    ]
  },
  {
    id: 'pc-game-dev',
    name: 'Amnetek Apex Unreal Engine 5 Rig',
    codename: 'AERO-PHYSX',
    formFactor: 'Extreme AI Tower',
    targetSpecialty: 'Game Engine & Physics (UE5)',
    cpu: 'Intel Core i9-14900KS (24 Cores, 32 Threads, 6.2GHz Extreme Edition)',
    gpu: 'NVIDIA GeForce RTX 4090 OC 24GB GDDR6X',
    ram: '64GB Dual-Channel DDR5-7200 RGB',
    storage: '4TB Samsung 990 PRO PCIe 4.0 NVMe',
    os: 'Windows 11 Pro for Workstations (DirectX 12 Ultimate)',
    status: 'Heavy Compute Benchmark',
    liveMetrics: {
      cpuLoadPct: 76,
      gpuLoadPct: 91,
      tempCelsius: 72,
      fanRpm: 2200,
      powerWatts: 610,
      memoryUsedGb: 48,
      memoryTotalGb: 64
    },
    benchmarks: {
      geekbenchMulti: 24200,
      cudaTflops: 82.6,
      gameCompileMinutes: 2.2,
      aiBatchFps: 1220
    },
    installedToolchains: [
      'Unreal Engine 5.5 Source Build',
      'Visual Studio 2022 v17.11 C++',
      'DirectX 12 Agility SDK',
      'Blender 4.2 LTS + OptiX',
      'PhysX 5.3 SDK'
    ]
  },
  {
    id: 'pc-edge-micro',
    name: 'Amnetek EdgeBox AI Mini Dev Node',
    codename: 'NANO-ORIN-64',
    formFactor: 'Mini Edge Dev Box',
    targetSpecialty: 'Big Data & Spark Node',
    cpu: '12-Core ARM Cortex-A78AE v8.2 64-Bit',
    gpu: 'NVIDIA Ampere Architecture 2048 Cores with 64 Tensor Cores (275 TOPS)',
    ram: '64GB 256-bit LPDDR5 (204.8 GB/s)',
    storage: '2TB NVMe M.2 Industrial Class SSD',
    os: 'Ubuntu 22.04 LTS (JetPack 6.0)',
    status: 'Idle / Ready',
    liveMetrics: {
      cpuLoadPct: 14,
      gpuLoadPct: 18,
      tempCelsius: 41,
      fanRpm: 950,
      powerWatts: 42,
      memoryUsedGb: 16,
      memoryTotalGb: 64
    },
    benchmarks: {
      geekbenchMulti: 9800,
      cudaTflops: 28.5,
      gameCompileMinutes: 8.4,
      aiBatchFps: 410
    },
    installedToolchains: [
      'NVIDIA DeepStream 7.0',
      'JetPack 6.0 Linux',
      'Apache Spark Edge Client',
      'OpenCV 4.10 with CUDA',
      'Edge TPU Compiler'
    ]
  }
];

export const INITIAL_MOBILE_GAMES: MobileGameProfile[] = [
  {
    id: 'game-penalty',
    title: 'Amnetek Penalty Striker 3D',
    genre: 'Sports Simulation',
    version: 'v2.4.1 (2026 Season Edition)',
    engine: 'Custom WebGL C++ Engine',
    targetPlatforms: ['iOS App Store', 'Google Play', 'Web Instant Play'],
    rating: 4.88,
    activeDau: 420000,
    retentionDay30: 42.8,
    targetFps: 120,
    avgTouchLatencyMs: 8.4,
    monetizationModel: 'Freemium + Player Customization & Battle Pass',
    monthlyRevenueUsd: 1480000,
    status: 'Playable in Amnetek OS'
  },
  {
    id: 'game-pitch-dash',
    title: 'Amnetek Pitch Dash (Agility Reflex)',
    genre: 'Arcade Reflex Runner',
    version: 'v1.8.0',
    engine: 'Unity 2026 LTS',
    targetPlatforms: ['iOS', 'Android', 'Playable Web'],
    rating: 4.75,
    activeDau: 680000,
    retentionDay30: 38.5,
    targetFps: 90,
    avgTouchLatencyMs: 11.2,
    monetizationModel: 'Rewarded Video & Sponsorship In-Game Billboards',
    monthlyRevenueUsd: 920000,
    status: 'Playable in Amnetek OS'
  },
  {
    id: 'game-tactical-manager',
    title: 'Amnetek Club Tycoon & Data Manager',
    genre: 'Tactical Manager',
    version: 'v3.1.2',
    engine: 'Unreal Engine 5.5',
    targetPlatforms: ['iPadOS', 'Android Tablets', 'Steam Mobile'],
    rating: 4.92,
    activeDau: 195000,
    retentionDay30: 54.1,
    targetFps: 60,
    avgTouchLatencyMs: 14.0,
    monetizationModel: 'Premium $9.99 + Annual Roster DLC',
    monthlyRevenueUsd: 2150000,
    status: 'Live on App Store & Google Play'
  }
];

