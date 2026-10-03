import React, { useState, useEffect } from 'react';
import { MobileGameProfile } from '../../types/sports-os';
import { 
  Gamepad2, 
  Trophy, 
  Smartphone, 
  Sparkles, 
  RotateCcw, 
  Zap, 
  Activity, 
  Play, 
  Heart, 
  Flame, 
  CheckCircle2, 
  TrendingUp,
  Sliders,
  Gauge
} from 'lucide-react';
import { GamePerformanceBenchmarking } from './GamePerformanceBenchmarking';

interface MobileGamesStudioProps {
  games: MobileGameProfile[];
}

export const MobileGamesStudio: React.FC<MobileGamesStudioProps> = ({ games }) => {
  const [activeTab, setActiveTab] = useState<'benchmarking' | 'penalty-game' | 'pitch-dash' | 'publishing'>('benchmarking');

  // Penalty Striker Game State
  const [aimTarget, setAimTarget] = useState<'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'>('top-right');
  const [shotPower, setShotPower] = useState<number>(85); // km/h
  const [shotCurve, setShotCurve] = useState<'straight' | 'curl-left' | 'curl-right'>('curl-right');
  const [isShooting, setIsShooting] = useState<boolean>(false);
  const [shotResult, setShotResult] = useState<{ outcome: 'GOAL' | 'SAVED' | 'POST'; message: string; speed: number; xG: number } | null>(null);
  const [streak, setStreak] = useState<number>(3);
  const [goalsScored, setGoalsScored] = useState<number>(12);
  const [totalShots, setTotalShots] = useState<number>(15);

  // Pitch Dash Game State
  const [playerLane, setPlayerLane] = useState<number>(1); // 0: Left, 1: Center, 2: Right
  const [dashScore, setDashScore] = useState<number>(420);
  const [dashLives, setDashLives] = useState<number>(3);
  const [dashActive, setDashActive] = useState<boolean>(false);
  const [dashDistance, setDashDistance] = useState<number>(185);
  const [obstacleLane, setObstacleLane] = useState<number>(0);
  const [itemLane, setItemLane] = useState<number>(2);

  // Run the penalty kick simulation
  const handleShootPenalty = () => {
    if (isShooting) return;
    setIsShooting(true);
    setShotResult(null);

    setTimeout(() => {
      setIsShooting(false);
      const random = Math.random();
      const xG = parseFloat((shotPower / 100 * 0.88).toFixed(2));
      const speed = Math.round(shotPower * 1.25);

      setTotalShots((prev) => prev + 1);

      if (random > 0.28) {
        // Goal
        setGoalsScored((prev) => prev + 1);
        setStreak((prev) => prev + 1);
        setShotResult({
          outcome: 'GOAL',
          message: `GOAL! Spectacular strike into the ${aimTarget.replace('-', ' ')} at ${speed} km/h! Goalkeeper had zero chance.`,
          speed,
          xG,
        });
      } else if (random > 0.12) {
        // Saved
        setStreak(0);
        setShotResult({
          outcome: 'SAVED',
          message: `SAVED! Goalkeeper read the ${shotCurve} trajectory and tipped it wide!`,
          speed,
          xG,
        });
      } else {
        // Hit Post
        setStreak(0);
        setShotResult({
          outcome: 'POST',
          message: `WOODWORK! Rattled the crossbar with ${speed} km/h venomous pace!`,
          speed,
          xG,
        });
      }
    }, 550);
  };

  // Pitch Dash Loop
  useEffect(() => {
    let interval: any;
    if (dashActive && dashLives > 0) {
      interval = setInterval(() => {
        setDashDistance((prev) => prev + 12);
        setDashScore((prev) => prev + 25);

        // Spawn new obstacle
        const newObs = Math.floor(Math.random() * 3);
        const newItem = (newObs + 1) % 3;
        setObstacleLane(newObs);
        setItemLane(newItem);

        // Collision check
        if (playerLane === newObs) {
          setDashLives((l) => {
            if (l <= 1) {
              setDashActive(false);
              return 0;
            }
            return l - 1;
          });
        } else if (playerLane === newItem) {
          setDashScore((s) => s + 50);
        }
      }, 900);
    }
    return () => clearInterval(interval);
  }, [dashActive, dashLives, playerLane]);

  return (
    <div className="space-y-6">
      {/* Top Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Amnetek Mobile Games & Esports Studio</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              Interactive Playable Lab
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Playable mobile sports games powered by Amnetek physics engines, coupled with real-time esports publishing telemetry.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('benchmarking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'benchmarking' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-emerald-400" />
            <span>Performance Benchmarking</span>
          </button>
          <button
            onClick={() => setActiveTab('penalty-game')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'penalty-game' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Penalty Striker 3D (Playable)</span>
          </button>
          <button
            onClick={() => setActiveTab('pitch-dash')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'pitch-dash' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Pitch Dash Reflex (Playable)</span>
          </button>
          <button
            onClick={() => setActiveTab('publishing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'publishing' ? 'bg-slate-800 text-white shadow-sm border border-slate-700/60' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
            <span>Publishing & Telemetry</span>
          </button>
        </div>
      </div>

      {/* View 1: Penalty Striker 3D Mini Game */}
      {activeTab === 'penalty-game' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Game Canvas / Goal Area */}
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Amnetek Penalty Striker: Matchday Shootout</span>
                  <span className="text-xs font-mono text-emerald-400">120 FPS WebGL Engine</span>
                </h3>
                <p className="text-xs text-slate-400">Aim your strike, adjust velocity power and spin, and beat the AI goalkeeper.</p>
              </div>

              {/* Scoreboard */}
              <div className="flex items-center gap-3 text-xs font-mono">
                <div className="px-2.5 py-1 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 mr-1.5">Streak:</span>
                  <span className="text-amber-400 font-bold">{streak}</span>
                </div>
                <div className="px-2.5 py-1 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 mr-1.5">Goals:</span>
                  <span className="text-emerald-400 font-bold">{goalsScored} / {totalShots}</span>
                  <span className="text-slate-400 ml-1">
                    ({totalShots > 0 ? ((goalsScored / totalShots) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Goal Post Interactive SVG Canvas */}
            <div className="relative aspect-[16/9] bg-gradient-to-b from-slate-950 via-slate-900 to-emerald-950/60 rounded-xl border border-slate-800 overflow-hidden shadow-inner p-4 flex flex-col justify-end select-none">
              <svg viewBox="0 0 100 55" className="w-full h-full">
                {/* Stadium Crowd Backdrop Silhouette */}
                <rect x="0" y="0" width="100" height="22" fill="#090d16" opacity="0.8" />
                <line x1="0" y1="22" x2="100" y2="22" stroke="#1e293b" strokeWidth="0.5" />

                {/* Pitch Grass & Penalty Box */}
                <polygon points="0,55 100,55 85,22 15,22" fill="#064e3b" opacity="0.8" />
                <line x1="20" y1="22" x2="0" y2="55" stroke="#10b981" strokeWidth="0.3" strokeOpacity="0.4" />
                <line x1="80" y1="22" x2="100" y2="55" stroke="#10b981" strokeWidth="0.3" strokeOpacity="0.4" />
                <circle cx="50" cy="46" r="1.2" fill="#ffffff" />

                {/* Goal Post Frame */}
                {/* Net Mesh Pattern */}
                <polygon points="20,12 80,12 80,38 20,38" fill="#0f172a" fillOpacity="0.6" stroke="#475569" strokeWidth="0.3" strokeDasharray="1,1" />

                {/* Crossbar & Uprights */}
                <rect x="18" y="10" width="64" height="2.5" fill="#ffffff" rx="0.5" />
                <rect x="18" y="10" width="2.5" height="28" fill="#ffffff" rx="0.5" />
                <rect x="79.5" y="10" width="2.5" height="28" fill="#ffffff" rx="0.5" />

                {/* AI Goalkeeper */}
                <g className="transition-all duration-300">
                  <circle cx="50" cy="24" r="3" fill="#f59e0b" />
                  <rect x="47" y="27" width="6" height="8" rx="1.5" fill="#10b981" />
                  {/* Keeper arms */}
                  <line x1="47" y1="29" x2="41" y2="26" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
                  <line x1="53" y1="29" x2="59" y2="26" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" />
                </g>

                {/* Target Markers for Player Aim Selection */}
                <circle
                  cx="26" cy="16" r="3.5"
                  className={`cursor-pointer transition-all ${aimTarget === 'top-left' ? 'fill-emerald-400 fill-opacity-40 stroke-emerald-300 stroke-1' : 'fill-white fill-opacity-10 stroke-slate-500 stroke-0.5'}`}
                  onClick={() => setAimTarget('top-left')}
                />
                <circle
                  cx="74" cy="16" r="3.5"
                  className={`cursor-pointer transition-all ${aimTarget === 'top-right' ? 'fill-emerald-400 fill-opacity-40 stroke-emerald-300 stroke-1' : 'fill-white fill-opacity-10 stroke-slate-500 stroke-0.5'}`}
                  onClick={() => setAimTarget('top-right')}
                />
                <circle
                  cx="26" cy="33" r="3.5"
                  className={`cursor-pointer transition-all ${aimTarget === 'bottom-left' ? 'fill-emerald-400 fill-opacity-40 stroke-emerald-300 stroke-1' : 'fill-white fill-opacity-10 stroke-slate-500 stroke-0.5'}`}
                  onClick={() => setAimTarget('bottom-left')}
                />
                <circle
                  cx="74" cy="33" r="3.5"
                  className={`cursor-pointer transition-all ${aimTarget === 'bottom-right' ? 'fill-emerald-400 fill-opacity-40 stroke-emerald-300 stroke-1' : 'fill-white fill-opacity-10 stroke-slate-500 stroke-0.5'}`}
                  onClick={() => setAimTarget('bottom-right')}
                />
                <circle
                  cx="50" cy="20" r="3"
                  className={`cursor-pointer transition-all ${aimTarget === 'center' ? 'fill-emerald-400 fill-opacity-40 stroke-emerald-300 stroke-1' : 'fill-white fill-opacity-10 stroke-slate-500 stroke-0.5'}`}
                  onClick={() => setAimTarget('center')}
                />

                {/* Ball at Penalty Spot */}
                <g className={isShooting ? 'animate-bounce' : ''}>
                  <circle cx="50" cy="46" r="2.2" fill="#ffffff" stroke="#000000" strokeWidth="0.4" />
                  <circle cx="50" cy="46" r="1.0" fill="#0f172a" />
                </g>

                {/* Animated Trajectory Line during shot */}
                {isShooting && (
                  <line
                    x1="50" y1="46"
                    x2={aimTarget === 'top-left' ? 26 : aimTarget === 'top-right' ? 74 : aimTarget === 'bottom-left' ? 26 : aimTarget === 'bottom-right' ? 74 : 50}
                    y2={aimTarget.startsWith('top') ? 16 : aimTarget.startsWith('bottom') ? 33 : 20}
                    stroke="#38bdf8"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />
                )}
              </svg>

              {/* Shot Outcome Toast */}
              {shotResult && (
                <div className={`absolute top-4 left-4 right-4 p-3 rounded-lg border backdrop-blur text-xs font-mono flex items-center justify-between ${
                  shotResult.outcome === 'GOAL'
                    ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                    : shotResult.outcome === 'SAVED'
                    ? 'bg-red-950/90 border-red-500 text-red-200'
                    : 'bg-amber-950/90 border-amber-500 text-amber-200'
                }`}>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm px-2 py-0.5 rounded bg-black/40">{shotResult.outcome}</span>
                    <span>{shotResult.message}</span>
                  </div>
                  <div className="text-right text-[11px] text-slate-300">
                    <span>xG: {shotResult.xG} · {shotResult.speed} km/h</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Interactive Shot Controls & Telemetry */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-emerald-400" />
                <span>Striker Controls & Physics</span>
              </h4>

              {/* Aim Selection */}
              <div>
                <span className="text-xs text-slate-400 block mb-1.5 font-medium">Target Placement:</span>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setAimTarget(t)}
                      className={`p-2 rounded text-center transition-all ${
                        aimTarget === t
                          ? 'bg-emerald-600 text-white font-bold'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {t.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shot Power Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Shot Velocity Power:</span>
                  <span className="text-emerald-400 font-bold">{shotPower}% ({(shotPower * 1.25).toFixed(0)} km/h)</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={shotPower}
                  onChange={(e) => setShotPower(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Spin / Curve */}
              <div>
                <span className="text-xs text-slate-400 block mb-1.5 font-medium">Aerodynamic Magnus Spin:</span>
                <div className="flex gap-2">
                  {(['curl-left', 'straight', 'curl-right'] as const).map((c) => (
                    <button
                      key={c}
                      onClick={() => setShotCurve(c)}
                      className={`flex-1 py-1.5 text-xs font-mono rounded ${
                        shotCurve === c ? 'bg-cyan-600 text-white font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {c === 'curl-left' ? '↰ Curl L' : c === 'curl-right' ? 'Curl R ↱' : 'Straight ↑'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Strike Button */}
              <button
                onClick={handleShootPenalty}
                disabled={isShooting}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-950/40 disabled:opacity-50 active:scale-[0.98]"
              >
                {isShooting ? (
                  <RotateCcw className="w-4 h-4 animate-spin" />
                ) : (
                  <Flame className="w-4 h-4 fill-current text-amber-300" />
                )}
                <span>{isShooting ? 'Simulating Ballistic Trajectory...' : 'STRIKE BALL ON TARGET'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Pitch Dash Reflex Runner Mini Game */}
      {activeTab === 'pitch-dash' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Amnetek Pitch Dash (Agility Reflex Runner)</h3>
                <p className="text-xs text-slate-400">Switch lanes to dodge red defender tackles and collect green energy orbs.</p>
              </div>

              {/* Lives and Distance */}
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1 text-red-400">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart
                      key={i}
                      className={`w-4 h-4 ${i < dashLives ? 'fill-current text-red-500' : 'text-slate-700'}`}
                    />
                  ))}
                </div>
                <div className="text-white font-bold">
                  {dashDistance}m Ran
                </div>
                <div className="text-emerald-400 font-bold">
                  Score: {dashScore}
                </div>
              </div>
            </div>

            {/* 3-Lane Pitch Field */}
            <div className="relative h-64 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
              {/* Lane Markers */}
              <div className="absolute inset-0 grid grid-cols-3 divide-x divide-slate-800/80">
                <div className="h-full flex items-center justify-center">
                  <span className="text-slate-800 font-mono text-2xl font-bold select-none">LANE 1</span>
                </div>
                <div className="h-full flex items-center justify-center">
                  <span className="text-slate-800 font-mono text-2xl font-bold select-none">LANE 2</span>
                </div>
                <div className="h-full flex items-center justify-center">
                  <span className="text-slate-800 font-mono text-2xl font-bold select-none">LANE 3</span>
                </div>
              </div>

              {/* Oncoming Obstacle (Red Defender) */}
              {dashActive && (
                <div
                  className="absolute top-8 w-1/3 flex justify-center transition-all duration-300"
                  style={{ left: `${obstacleLane * 33.33}%` }}
                >
                  <div className="px-3 py-1.5 bg-red-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5 animate-pulse">
                    <span>🛡️ Opponent Tackle</span>
                  </div>
                </div>
              )}

              {/* Oncoming Energy Orb */}
              {dashActive && (
                <div
                  className="absolute top-12 w-1/3 flex justify-center transition-all duration-300"
                  style={{ left: `${itemLane * 33.33}%` }}
                >
                  <div className="px-2.5 py-1 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                    <span>⚽ +50 Pts</span>
                  </div>
                </div>
              )}

              {/* Player Icon at Bottom */}
              <div
                className="absolute bottom-6 w-1/3 flex justify-center transition-all duration-200"
                style={{ left: `${playerLane * 33.33}%` }}
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-600 border-2 border-white flex items-center justify-center text-white shadow-xl shadow-emerald-950 font-bold text-xs">
                  🏃 RUN
                </div>
              </div>

              {!dashActive && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                  <span className="text-base font-bold text-white">
                    {dashLives === 0 ? 'Tackled! Game Over' : 'Ready to Sprint?'}
                  </span>
                  <button
                    onClick={() => {
                      setDashLives(3);
                      setDashScore(0);
                      setDashDistance(0);
                      setDashActive(true);
                    }}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-transform active:scale-95"
                  >
                    {dashLives === 0 ? 'Play Again' : 'Start Sprint Run'}
                  </button>
                </div>
              )}
            </div>

            {/* Lane Navigation Touch Buttons */}
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPlayerLane(0)}
                className={`py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                  playerLane === 0 ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                ← Left Lane (A)
              </button>
              <button
                onClick={() => setPlayerLane(1)}
                className={`py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                  playerLane === 1 ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                Center Lane (W)
              </button>
              <button
                onClick={() => setPlayerLane(2)}
                className={`py-3 rounded-xl font-mono text-xs font-bold transition-all ${
                  playerLane === 2 ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}
              >
                Right Lane (D) →
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white">Reflex Analytics & Agility</h4>
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Cognitive Reaction Latency</span>
                <span className="text-base font-bold text-emerald-400 mt-1 block">184 ms (Top 5%)</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Actions Per Minute (APM)</span>
                <span className="text-base font-bold text-cyan-400 mt-1 block">142 APM</span>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <span className="text-slate-500 block text-[11px]">Lateral Cutting Deceleration</span>
                <span className="text-base font-bold text-white mt-1 block">5.4 m/s² Nominal</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 3: Amnetek Mobile Games Portfolio & Telemetry */}
      {activeTab === 'publishing' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {games.map((game) => (
              <div key={game.id} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400">{game.genre}</span>
                  <span className="text-xs text-slate-400 font-mono">★ {game.rating}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{game.title}</h4>
                  <span className="text-xs text-slate-400 font-mono">{game.version} · {game.engine}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block text-[10px]">Daily Active Users</span>
                    <span className="text-sm font-bold text-white tabular-nums">{game.activeDau.toLocaleString()}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block text-[10px]">Monthly Revenue</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">
                      ${(game.monthlyRevenueUsd / 1000000).toFixed(2)}M
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs font-mono text-slate-300">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Day-30 Retention:</span>
                    <span className="text-emerald-400 font-bold">{game.retentionDay30}%</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Target Frame-Rate:</span>
                    <span className="text-white">{game.targetFps} FPS Stable</span>
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-500">Touch Response:</span>
                    <span className="text-cyan-300">{game.avgTouchLatencyMs} ms</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono flex items-center justify-between">
                  <span>{game.targetPlatforms.join(', ')}</span>
                  <span className="text-emerald-400 font-medium">{game.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* View 4: Mobile Game Performance Benchmarking */}
      {activeTab === 'benchmarking' && (
        <GamePerformanceBenchmarking />
      )}
    </div>
  );
};
