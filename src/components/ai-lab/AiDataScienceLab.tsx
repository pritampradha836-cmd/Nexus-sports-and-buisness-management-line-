import React, { useState } from 'react';
import { 
  CodeNotebookCell, 
  PlayerBiometric, 
  TrackingPoint, 
  ActionTag 
} from '../../types/sports-os';
import { 
  Play, 
  RotateCcw, 
  Sliders, 
  Terminal, 
  Activity, 
  Database, 
  Flame, 
  Eye, 
  Compass, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

interface AiDataScienceLabProps {
  notebookCells: CodeNotebookCell[];
  onRunCell: (cellId: string) => void;
  squadBiometrics: PlayerBiometric[];
  trackingPlayers: TrackingPoint[];
  actionTags: ActionTag[];
}

export const AiDataScienceLab: React.FC<AiDataScienceLabProps> = ({
  notebookCells,
  onRunCell,
  squadBiometrics,
  trackingPlayers,
  actionTags,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'notebook' | 'vision' | 'injury' | 'lakehouse'>('notebook');
  
  // Interactive notebook state
  const [selectedCellId, setSelectedCellId] = useState<string>(notebookCells[0]?.id || 'cell-xg');
  const [customCode, setCustomCode] = useState<string>(notebookCells[0]?.code || '');
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [liveOutputs, setLiveOutputs] = useState<Record<string, string>>({});
  
  // Model Hyperparameters
  const [regC, setRegC] = useState<number>(1.4);
  const [simRuns, setSimRuns] = useState<number>(10000);
  const [pressHeightMeters, setPressHeightMeters] = useState<number>(62);

  // Vision Pitch Layer Toggles
  const [showVoronoi, setShowVoronoi] = useState<boolean>(true);
  const [showVectors, setShowVectors] = useState<boolean>(true);
  const [showSkeleton, setShowSkeleton] = useState<boolean>(true);
  const [selectedPlayer, setSelectedPlayer] = useState<TrackingPoint | null>(trackingPlayers[7] || null); // Al-Mansoor

  // Simulated Workload Slider
  const [simulatedLoadSpikePct, setSimulatedLoadSpikePct] = useState<number>(15);

  // Lakehouse SQL state
  const [sqlQuery, setSqlQuery] = useState<string>(
    'SELECT player_name, speed_kmh, x_coord, y_coord, xt_threat FROM tracking_coordinates_50hz WHERE speed_kmh > 24.0 ORDER BY xt_threat DESC LIMIT 6;'
  );
  const [sqlResult, setSqlResult] = useState<any[]>([
    { player_name: 'Gabriel Al-Mansoor', speed_kmh: '28.6', x_coord: '58.2', y_coord: '65.1', xt_threat: '+0.082' },
    { player_name: 'Kylian Vance', speed_kmh: '29.2', x_coord: '74.0', y_coord: '20.4', xt_threat: '+0.145' },
    { player_name: 'Vinicius Jr', speed_kmh: '29.2', x_coord: '35.4', y_coord: '78.2', xt_threat: '+0.094' },
    { player_name: 'Mateo Silva', speed_kmh: '24.1', x_coord: '55.1', y_coord: '32.0', xt_threat: '+0.041' },
    { player_name: 'Devon Walker', speed_kmh: '26.4', x_coord: '26.0', y_coord: '15.2', xt_threat: '+0.018' },
  ]);

  const activeCell = notebookCells.find((c) => c.id === selectedCellId) || notebookCells[0];

  const handleCellSelect = (cell: CodeNotebookCell) => {
    setSelectedCellId(cell.id);
    setCustomCode(cell.code);
  };

  const handleRunExecution = () => {
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
      onRunCell(selectedCellId);
      setLiveOutputs((prev) => ({
        ...prev,
        [selectedCellId]: `[EXECUTED AT ${new Date().toLocaleTimeString()}]\n` +
          (activeCell.output || '') +
          `\n[HYPERPARAMETERS] Regularization C=${regC} | Monte Carlo N=${simRuns.toLocaleString()} | Pressing Height=${pressHeightMeters}m`,
      }));
    }, 450);
  };

  const handleRunSql = () => {
    // Simulated SQL execution
    setIsExecuting(true);
    setTimeout(() => {
      setIsExecuting(false);
    }, 200);
  };

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('notebook')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'notebook'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Interactive Model IDE</span>
          </button>
          <button
            onClick={() => setActiveSubTab('vision')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'vision'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Computer Vision & Pitch 50Hz</span>
          </button>
          <button
            onClick={() => setActiveSubTab('injury')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'injury'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Predictive Biometric Hazard (ACWR)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('lakehouse')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'lakehouse'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Big Data Lakehouse (Parquet/SQL)</span>
          </button>
        </div>

        {/* Live System Context Info */}
        <div className="text-xs text-slate-400 flex items-center gap-2 font-mono">
          <span>Python 3.12 (NumPy, Scikit-learn, XGBoost)</span>
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400">Jupyter Kernel: Ready</span>
        </div>
      </div>

      {/* Sub-view 1: Interactive Model IDE */}
      {activeSubTab === 'notebook' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Cell Selector & Hyperparameters */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-200 mb-3 flex items-center justify-between">
                <span>Model Pipeline Catalog</span>
                <span className="text-xs font-normal text-slate-400">3 pre-built models</span>
              </h2>
              <div className="space-y-2">
                {notebookCells.map((cell) => {
                  const isSelected = cell.id === selectedCellId;
                  return (
                    <button
                      key={cell.id}
                      onClick={() => handleCellSelect(cell)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500/50 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-mono text-emerald-400 uppercase">{cell.language}</span>
                        <span className="text-[11px] text-slate-500 font-mono">{cell.executionTimeMs}ms</span>
                      </div>
                      <p className="text-xs font-medium line-clamp-2 leading-relaxed">{cell.title}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Model Tuning Parameters */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hyperparameter Optimization</span>
              </h3>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Regularization Inverse (C)</span>
                  <span className="text-emerald-400">{regC.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5.0"
                  step="0.1"
                  value={regC}
                  onChange={(e) => setRegC(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Monte Carlo Iterations</span>
                  <span className="text-emerald-400">{simRuns.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="50000"
                  step="1000"
                  value={simRuns}
                  onChange={(e) => setSimRuns(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs text-slate-400 font-mono">
                  <span>Defensive Pressing Line</span>
                  <span className="text-emerald-400">{pressHeightMeters}m</span>
                </div>
                <input
                  type="range"
                  min="35"
                  max="75"
                  step="1"
                  value={pressHeightMeters}
                  onChange={(e) => setPressHeightMeters(parseInt(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              <button
                onClick={handleRunExecution}
                disabled={isExecuting}
                className="w-full mt-2 py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isExecuting ? (
                  <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Play className="w-3.5 h-3.5 fill-current" />
                )}
                <span>{isExecuting ? 'Fitting Model...' : 'Execute Active Model'}</span>
              </button>
            </div>
          </div>

          {/* Right: Code Sandbox & Execution Console */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
                  <span className="font-semibold text-slate-200">{activeCell.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCustomCode(activeCell.code)}
                    title="Reset to default code"
                    className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleRunExecution}
                    disabled={isExecuting}
                    className="px-3 py-1 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-500 rounded flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Run</span>
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="p-3 bg-slate-950">
                <textarea
                  value={customCode}
                  onChange={(e) => setCustomCode(e.target.value)}
                  rows={13}
                  className="w-full bg-transparent text-xs font-mono text-emerald-300 focus:outline-none resize-none leading-relaxed selection:bg-emerald-900"
                  spellCheck={false}
                />
              </div>

              {/* Metrics Header */}
              {activeCell.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-900/80 border-t border-slate-800">
                  {activeCell.metrics.map((m, idx) => (
                    <div key={idx} className="p-2 bg-slate-950/60 rounded border border-slate-800/80">
                      <div className="text-[11px] text-slate-400">{m.label}</div>
                      <div className="text-sm font-bold text-white font-mono mt-0.5 tabular-nums">{m.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Output Console */}
              <div className="p-3 bg-slate-950/95 border-t border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-1.5">
                  <span>Terminal Standard Output</span>
                  <span className="text-emerald-400">Exit Code: 0</span>
                </div>
                <pre className="text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
                  {liveOutputs[selectedCellId] || activeCell.output}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 2: Computer Vision & Pitch 50Hz Tracking */}
      {activeSubTab === 'vision' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Pitch Canvas & Controls */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">Live Match Tracking Engine (Second Spectrum 50Hz)</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Minute: 74:12</span>
                    <span aria-hidden="true">·</span>
                    <span>22 Players + Ball Synchronized</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-emerald-400 font-mono">Camera: Main High-Wide 8K</span>
                  </div>
                </div>

                {/* Layer Toggles */}
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setShowVoronoi(!showVoronoi)}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      showVoronoi ? 'bg-indigo-900/60 border-indigo-500/80 text-indigo-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Voronoi Space
                  </button>
                  <button
                    onClick={() => setShowVectors(!showVectors)}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      showVectors ? 'bg-cyan-900/60 border-cyan-500/80 text-cyan-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Velocity Vectors
                  </button>
                  <button
                    onClick={() => setShowSkeleton(!showSkeleton)}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      showSkeleton ? 'bg-amber-900/60 border-amber-500/80 text-amber-200' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    Skeletal Joint Pose
                  </button>
                </div>
              </div>

              {/* Pitch Visualizer SVG */}
              <div className="relative aspect-[16/10] bg-emerald-950/40 rounded-lg border border-emerald-800/40 overflow-hidden shadow-inner p-2">
                <svg viewBox="0 0 100 65" className="w-full h-full select-none">
                  {/* Pitch Boundary Lines */}
                  <rect x="2" y="2" width="96" height="61" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  
                  {/* Halfway line */}
                  <line x1="50" y1="2" x2="50" y2="63" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  <circle cx="50" cy="32.5" r="9.15" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  <circle cx="50" cy="32.5" r="0.8" fill="#059669" opacity="0.8" />

                  {/* Left Penalty Box */}
                  <rect x="2" y="14" width="16.5" height="37" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  <rect x="2" y="23" width="5.5" height="19" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  <path d="M 18.5 26.5 A 9.15 9.15 0 0 1 18.5 38.5" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />

                  {/* Right Penalty Box */}
                  <rect x="81.5" y="14" width="16.5" height="37" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  <rect x="92.5" y="23" width="5.5" height="19" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />
                  <path d="M 81.5 26.5 A 9.15 9.15 0 0 0 81.5 38.5" fill="none" stroke="#059669" strokeWidth="0.5" strokeOpacity="0.6" />

                  {/* Voronoi Dominance Overlay (Simulated) */}
                  {showVoronoi && (
                    <g opacity="0.2">
                      <polygon points="2,2 50,2 45,35 15,35 2,14" fill="#3b82f6" />
                      <polygon points="50,2 98,2 98,35 60,35 45,35" fill="#ef4444" />
                      <polygon points="2,35 45,35 50,63 2,63" fill="#3b82f6" />
                      <polygon points="45,35 60,35 98,35 98,63 50,63" fill="#ef4444" />
                    </g>
                  )}

                  {/* Pass trajectory line from Al-Mansoor to Vance */}
                  <line 
                    x1="58" y1="42" 
                    x2="74" y2="13" 
                    stroke="#38bdf8" 
                    strokeWidth="0.8" 
                    strokeDasharray="1.5,1" 
                    opacity="0.85" 
                  />
                  <polygon points="74,13 72,15 71,12" fill="#38bdf8" />
                  <text x="64" y="26" fill="#38bdf8" fontSize="2" className="font-mono" opacity="0.9">Pass Probability: 86.4% (xT +0.082)</text>

                  {/* Render Players */}
                  {trackingPlayers.map((player) => {
                    const isHome = player.team === 'home';
                    const isBall = player.team === 'ball';
                    const isSelected = selectedPlayer?.id === player.id;
                    const cx = (player.x / 100) * 96 + 2;
                    const cy = (player.y / 100) * 61 + 2;

                    if (isBall) {
                      return (
                        <g key={player.id}>
                          <circle cx={cx} cy={cy} r="1.4" fill="#ffffff" stroke="#f59e0b" strokeWidth="0.5" />
                          <circle cx={cx} cy={cy} r="2.8" fill="none" stroke="#f59e0b" strokeWidth="0.3" strokeDasharray="0.6,0.6" />
                        </g>
                      );
                    }

                    return (
                      <g 
                        key={player.id} 
                        className="cursor-pointer transition-transform hover:scale-125"
                        onClick={() => setSelectedPlayer(player)}
                      >
                        {/* Velocity Vector */}
                        {showVectors && (
                          <line
                            x1={cx}
                            y1={cy}
                            x2={cx + player.vx * 6}
                            y2={cy + player.vy * 6}
                            stroke={isHome ? '#60a5fa' : '#f87171'}
                            strokeWidth="0.6"
                          />
                        )}

                        {/* Player Node */}
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 2.2 : 1.7}
                          fill={isHome ? '#2563eb' : '#dc2626'}
                          stroke={isSelected ? '#38bdf8' : '#ffffff'}
                          strokeWidth={isSelected ? 0.8 : 0.4}
                        />

                        {/* Number */}
                        <text
                          x={cx}
                          y={cy + 0.6}
                          fontSize="1.2"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontWeight="bold"
                        >
                          {player.number}
                        </text>

                        {/* Skeletal Pose simulation on selected */}
                        {showSkeleton && isSelected && (
                          <g stroke="#38bdf8" strokeWidth="0.3" opacity="0.9">
                            <line x1={cx} y1={cy - 2} x2={cx} y2={cy} />
                            <line x1={cx - 1} y1={cy - 1} x2={cx + 1} y2={cy - 1} />
                            <line x1={cx} y1={cy} x2={cx - 1} y2={cy + 2} />
                            <line x1={cx} y1={cy} x2={cx + 1} y2={cy + 2} />
                            <circle cx={cx} cy={cy - 2.4} r="0.5" fill="#38bdf8" />
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* Right Selected Player & Event Log */}
          <div className="lg:col-span-4 space-y-4">
            {/* Selected Player Telemetry */}
            {selectedPlayer && (
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400 font-mono">CV Track ID: #{selectedPlayer.number}</span>
                  <span className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    selectedPlayer.team === 'home' ? 'bg-blue-900/40 text-blue-300' : 'bg-red-900/40 text-red-300'
                  }`}>
                    {selectedPlayer.team === 'home' ? 'Home' : 'Away'}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-white">{selectedPlayer.name}</h4>
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block">Instant Velocity</span>
                    <span className="text-sm font-bold text-white font-mono tabular-nums">{selectedPlayer.speedKmh} km/h</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block">Pitch Coordinate</span>
                    <span className="text-sm font-bold text-white font-mono tabular-nums">({selectedPlayer.x}m, {selectedPlayer.y}m)</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block">Acceleration Vector</span>
                    <span className="text-sm font-bold text-emerald-400 font-mono tabular-nums">+{selectedPlayer.vx.toFixed(2)} m/s²</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block">Threat Generation (xT)</span>
                    <span className="text-sm font-bold text-cyan-400 font-mono tabular-nums">+0.082 / min</span>
                  </div>
                </div>
              </div>
            )}

            {/* Auto-Tagged Computer Vision Events */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-3 flex items-center justify-between">
                <span>Auto-Action Recognition Feed</span>
                <span className="text-emerald-400 font-mono text-[11px]">YOLOv11-Pose</span>
              </h4>
              <div className="space-y-2">
                {actionTags.map((tag) => (
                  <div key={tag.id} className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-1">
                      <span>{tag.timestamp}</span>
                      <span className={tag.xT > 0 ? 'text-emerald-400' : 'text-red-400'}>
                        xT {tag.xT > 0 ? `+${tag.xT}` : tag.xT}
                      </span>
                    </div>
                    <div className="font-medium text-slate-200">{tag.type}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">
                      <span>{tag.player}</span>
                      <span className="mx-1">·</span>
                      <span>Confidence: {(tag.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 3: Predictive Injury & Biometric Hazard */}
      {activeSubTab === 'injury' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Squad Longitudinal Biometric Risk Matrix</h3>
                <p className="text-xs text-slate-400">
                  Calculated from Catapult GNSS external training load + WHOOP sleep architecture + heart rate variability (rMSSD).
                </p>
              </div>

              {/* Workload Simulation Slider */}
              <div className="flex items-center gap-3 bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs">
                <span className="text-slate-400">Simulate Upcoming Fixture Load:</span>
                <input
                  type="range"
                  min="0"
                  max="40"
                  step="5"
                  value={simulatedLoadSpikePct}
                  onChange={(e) => setSimulatedLoadSpikePct(parseInt(e.target.value))}
                  className="w-28 accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-emerald-400">+{simulatedLoadSpikePct}% Acute Spike</span>
              </div>
            </div>

            {/* Squad Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Athlete</th>
                    <th className="py-2.5 px-3">Position</th>
                    <th className="py-2.5 px-3 text-right">ACWR</th>
                    <th className="py-2.5 px-3 text-right">HRV (rMSSD)</th>
                    <th className="py-2.5 px-3 text-right">Sleep Eff.</th>
                    <th className="py-2.5 px-3 text-right">HSR Sprint</th>
                    <th className="py-2.5 px-3">Soft-Tissue Risk</th>
                    <th className="py-2.5 px-3">Clinical Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {squadBiometrics.map((player) => {
                    const adjustedAcwr = (player.acwr * (1 + simulatedLoadSpikePct / 100)).toFixed(2);
                    const isHigh = parseFloat(adjustedAcwr) > 1.35;
                    return (
                      <tr key={player.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-3 px-3 font-sans font-medium text-slate-200">
                          #{player.number} {player.name}
                        </td>
                        <td className="py-3 px-3 text-slate-400 font-sans">{player.position}</td>
                        <td className="py-3 px-3 text-right tabular-nums">
                          <span className={isHigh ? 'text-red-400 font-bold' : 'text-slate-300'}>
                            {adjustedAcwr}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right tabular-nums text-slate-300">{player.rmssd} ms</td>
                        <td className="py-3 px-3 text-right tabular-nums text-slate-300">{player.sleepEfficiency}%</td>
                        <td className="py-3 px-3 text-right tabular-nums text-slate-300">{player.sprintDistanceMeters}m</td>
                        <td className="py-3 px-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-sans ${
                            player.riskCategory === 'Critical' || isHigh
                              ? 'bg-red-950/80 text-red-300 border border-red-800/80'
                              : player.riskCategory === 'Elevated'
                              ? 'bg-amber-950/80 text-amber-300 border border-amber-800/80'
                              : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80'
                          }`}>
                            {player.riskCategory === 'Critical' || isHigh ? (
                              <AlertTriangle className="w-3 h-3 text-red-400" />
                            ) : (
                              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            )}
                            {isHigh ? 'High Strain Alert' : player.riskCategory}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-sans text-slate-400 max-w-xs truncate" title={player.recommendation}>
                          {player.recommendation}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 4: Big Data Lakehouse & SQL Console */}
      {activeSubTab === 'lakehouse' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-white">Apache Iceberg Unified Data Lakehouse</h3>
                <p className="text-xs text-slate-400">
                  Storage format: Apache Parquet on AWS S3 & GCP Cloud Storage (ZSTD compression). 14.8M rows queried in &lt;180ms.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/60">
                  Partitions: season_2026/fixture_id
                </span>
              </div>
            </div>

            {/* SQL Query Editor */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-3 mb-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1.5">
                <span>SQL Engine (DuckDB / Trino)</span>
                <button
                  onClick={handleRunSql}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-sans font-medium transition-colors"
                >
                  Execute Query
                </button>
              </div>
              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                rows={3}
                className="w-full bg-transparent text-xs font-mono text-cyan-300 focus:outline-none resize-none leading-relaxed"
                spellCheck={false}
              />
            </div>

            {/* Result Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">player_name</th>
                    <th className="py-2 px-3 text-right">speed_kmh</th>
                    <th className="py-2 px-3 text-right">x_coord</th>
                    <th className="py-2 px-3 text-right">y_coord</th>
                    <th className="py-2 px-3 text-right">xt_threat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {sqlResult.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 text-slate-200">{row.player_name}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-300">{row.speed_kmh}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-300">{row.x_coord}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-slate-300">{row.y_coord}</td>
                      <td className="py-2 px-3 text-right tabular-nums text-emerald-400">{row.xt_threat}</td>
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
