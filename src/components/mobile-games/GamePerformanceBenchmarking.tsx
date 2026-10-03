import React, { useState } from 'react';
import { 
  Activity, 
  Thermometer, 
  Smartphone, 
  Cpu, 
  Zap, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Download, 
  Gauge, 
  Flame, 
  Play 
} from 'lucide-react';

interface GameBuild {
  id: string;
  name: string;
  version: string;
  engine: string;
  polyCount: string;
  baseDrawCalls: number;
  textureMemoryMb: number;
  physicsComplexity: 'Medium' | 'High' | 'Extreme';
}

interface TestDevice {
  id: string;
  name: string;
  chipset: string;
  gpu: string;
  manufacturingNode: string;
  thermalDissipationW: number;
  maxFpsCap: number;
}

export const GamePerformanceBenchmarking: React.FC = () => {
  const gameBuilds: GameBuild[] = [
    {
      id: 'build-striker',
      name: 'Amnetek Penalty Striker 3D',
      version: 'v2.4.1-Release (WebGL / Metal)',
      engine: 'Custom WebGL C++ & PhysX',
      polyCount: '185,000 polys/frame',
      baseDrawCalls: 620,
      textureMemoryMb: 480,
      physicsComplexity: 'High',
    },
    {
      id: 'build-pitch-dash',
      name: 'Amnetek Pitch Dash Reflex',
      version: 'v1.8.0-Vulkan RC2',
      engine: 'Unity 2026 LTS (Vulkan 1.3)',
      polyCount: '95,000 polys/frame',
      baseDrawCalls: 380,
      textureMemoryMb: 320,
      physicsComplexity: 'Medium',
    },
    {
      id: 'build-tycoon',
      name: 'Amnetek Club Tycoon 2026',
      version: 'v3.1.2-UE5.5 Nanite Build',
      engine: 'Unreal Engine 5.5 (Hardware RT)',
      polyCount: '1,240,000 polys/frame',
      baseDrawCalls: 1840,
      textureMemoryMb: 1420,
      physicsComplexity: 'Extreme',
    },
  ];

  const testDevices: TestDevice[] = [
    {
      id: 'dev-a18-pro',
      name: 'Apple A18 Pro (iPhone 16 Pro Max)',
      chipset: 'Apple A18 Pro (3nm TSMC N3E)',
      gpu: '6-Core Apple GPU (Hardware RT + Mesh)',
      manufacturingNode: '3nm',
      thermalDissipationW: 5.5,
      maxFpsCap: 120,
    },
    {
      id: 'dev-snapdragon-8-elite',
      name: 'Snapdragon 8 Elite (Galaxy S25 Ultra)',
      chipset: 'Qualcomm Snapdragon 8 Elite (Oryon CPU)',
      gpu: 'Adreno 830 (1.1 GHz, Sliced Architecture)',
      manufacturingNode: '3nm',
      thermalDissipationW: 6.2,
      maxFpsCap: 120,
    },
    {
      id: 'dev-dimensity-9400',
      name: 'MediaTek Dimensity 9400',
      chipset: 'Dimensity 9400 (All-Big-Core X925)',
      gpu: 'Immortalis-G925 MC12',
      manufacturingNode: '3nm',
      thermalDissipationW: 5.8,
      maxFpsCap: 120,
    },
    {
      id: 'dev-sd-7-gen3',
      name: 'Snapdragon 7+ Gen 3 (Mid-Range Target)',
      chipset: 'Qualcomm Snapdragon 7+ Gen 3',
      gpu: 'Adreno 732',
      manufacturingNode: '4nm',
      thermalDissipationW: 4.2,
      maxFpsCap: 90,
    },
  ];

  const [selectedBuildId, setSelectedBuildId] = useState<string>('build-striker');
  const [compareBuildId, setCompareBuildId] = useState<string>('build-tycoon');
  const [isCompareMode, setIsCompareMode] = useState<boolean>(false);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('dev-a18-pro');
  const [testDurationSec, setTestDurationSec] = useState<number>(60);
  const [renderResolution, setRenderResolution] = useState<'1080p' | '1440p' | '4K-MetalFX'>('1440p');
  const [targetFps, setTargetFps] = useState<number>(120);
  const [graphicsPreset, setGraphicsPreset] = useState<'Medium' | 'High' | 'Ultra RT'>('High');
  const [ambientTempC, setAmbientTempC] = useState<number>(24);

  // Benchmark Execution State
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [testProgress, setTestProgress] = useState<number>(0);
  const [benchmarkCompleted, setBenchmarkCompleted] = useState<boolean>(true);

  const selectedBuild = gameBuilds.find((b) => b.id === selectedBuildId) || gameBuilds[0];
  const compareBuild = gameBuilds.find((b) => b.id === compareBuildId) || gameBuilds[2];
  const selectedDevice = testDevices.find((d) => d.id === selectedDeviceId) || testDevices[0];

  // Dynamic Metrics Calculation for Build A
  const resMultiplier = renderResolution === '1080p' ? 1.0 : renderResolution === '1440p' ? 0.88 : 0.76;
  const presetMultiplier = graphicsPreset === 'Medium' ? 1.12 : graphicsPreset === 'High' ? 1.0 : 0.82;
  const chipMultiplier = selectedDevice.id === 'dev-a18-pro' ? 1.0 : selectedDevice.id === 'dev-snapdragon-8-elite' ? 1.02 : selectedDevice.id === 'dev-dimensity-9400' ? 0.98 : 0.74;
  const buildDifficulty = selectedBuild.id === 'build-striker' ? 1.0 : selectedBuild.id === 'build-pitch-dash' ? 1.15 : 0.72;

  const rawExpectedFps = targetFps * resMultiplier * presetMultiplier * chipMultiplier * buildDifficulty;
  const computedAvgFps = Math.min(targetFps, Math.round(rawExpectedFps));
  const computedOnePercentLow = Math.round(computedAvgFps * 0.84);
  const computedPointOnePercentLow = Math.round(computedAvgFps * 0.71);
  const frameTimeJitterMs = (1000 / computedAvgFps * 0.08).toFixed(1);

  // Dynamic Metrics Calculation for Build B (Comparison)
  const compareDifficulty = compareBuild.id === 'build-striker' ? 1.0 : compareBuild.id === 'build-pitch-dash' ? 1.15 : 0.72;
  const compareRawFps = targetFps * resMultiplier * presetMultiplier * chipMultiplier * compareDifficulty;
  const compareAvgFps = Math.min(targetFps, Math.round(compareRawFps));
  const compareOnePercentLow = Math.round(compareAvgFps * 0.84);
  const compareSoCTempC = (ambientTempC + 16 + ((targetFps / 60) * (graphicsPreset === 'Ultra RT' ? 1.4 : 1.15) * 4.6)).toFixed(1);

  // Thermal calculation
  const thermalLoadMultiplier = (targetFps / 60) * (graphicsPreset === 'Ultra RT' ? 1.35 : 1.1) * (1 / chipMultiplier);
  const peakSoCTempC = (ambientTempC + 16 + (thermalLoadMultiplier * 4.2)).toFixed(1);
  const peakChassisTempC = (ambientTempC + 10 + (thermalLoadMultiplier * 2.8)).toFixed(1);
  const avgPowerWatts = (selectedDevice.thermalDissipationW * (computedAvgFps / targetFps) * 0.85).toFixed(1);
  const batteryLifeHours = (19.4 / parseFloat(avgPowerWatts)).toFixed(1); // Assuming 5000mAh (19.4Wh)

  const isThrottling = parseFloat(peakSoCTempC) > 46.0;

  const handleRunSimulation = () => {
    setIsRunningTest(true);
    setTestProgress(0);
    setBenchmarkCompleted(false);

    const interval = setInterval(() => {
      setTestProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunningTest(false);
          setBenchmarkCompleted(true);
          return 100;
        }
        return prev + 10;
      });
    }, 180);
  };

  const handleExportReport = () => {
    const reportData = {
      benchmarkSession: `AMNETEK-PERF-LOG-${Date.now()}`,
      timestamp: new Date().toISOString(),
      gameBuild: selectedBuild,
      testDevice: selectedDevice,
      parameters: {
        testDurationSec,
        renderResolution,
        targetFps,
        graphicsPreset,
        ambientTempC,
      },
      results: {
        avgFps: computedAvgFps,
        onePercentLowFps: computedOnePercentLow,
        pointOnePercentLowFps: computedPointOnePercentLow,
        frameTimeJitterMs,
        peakSoCTempCelsius: peakSoCTempC,
        peakChassisTouchTempCelsius: peakChassisTempC,
        averagePowerDrawWatts: avgPowerWatts,
        estimatedBatteryHours: batteryLifeHours,
        thermalThrottlingDetected: isThrottling,
      },
      engineRecommendations: [
        'Render Resolution Mip-Map Budget: Within nominal thresholds.',
        'LOD Transition Distance: Optimal. Zero geometry pop-in detected.',
        'VRAM Peak Allocation: 480MB nominal on Unified Memory architecture.',
      ],
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amnetek_benchmark_${selectedBuild.id}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Generate 50 points for the FPS chart
  const fpsChartPoints = Array.from({ length: 50 }).map((_, i) => {
    const variance = (Math.sin(i * 0.6) * 3) + ((Math.random() - 0.5) * 4);
    const dip = (i === 18 || i === 38) ? 14 : 0; // occasional stutter
    const val = Math.max(30, Math.min(targetFps, Math.round(computedAvgFps + variance - dip)));
    return val;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="text-base font-bold text-white">Amnetek Mobile Games Performance Benchmarking Lab</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate real-time frame rates, 1% lows, SoC thermal throttling, and battery power curves across flagship and mid-range mobile silicon.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setIsCompareMode(false)}
              className={`px-2.5 py-1 rounded transition-colors ${
                !isCompareMode ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Single Build
            </button>
            <button
              onClick={() => setIsCompareMode(true)}
              className={`px-2.5 py-1 rounded transition-colors ${
                isCompareMode ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compare 2 Builds
            </button>
          </div>

          <button
            onClick={handleExportReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Benchmark Data</span>
          </button>
          <button
            onClick={handleRunSimulation}
            disabled={isRunningTest}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-sm transition-all disabled:opacity-50 active:scale-95"
          >
            {isRunningTest ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunningTest ? `Benchmarking (${testProgress}%)` : 'Run Simulation Test'}</span>
          </button>
        </div>
      </div>

      {/* Test Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Build & Target Silicon Selectors */}
        <div className="lg:col-span-5 space-y-4">
          {/* 1. Game Build Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Select Mobile Game Build Target</span>
              <span className="text-emerald-400 font-mono text-[11px]">3 Builds Indexed</span>
            </h4>
            <div className="space-y-2">
              <span className="text-[11px] font-mono text-emerald-400 block font-semibold">
                {isCompareMode ? 'Primary Target (Build A):' : 'Active Build Target:'}
              </span>
              {gameBuilds.map((build) => {
                const isSelected = build.id === selectedBuildId;
                return (
                  <button
                    key={build.id}
                    onClick={() => setSelectedBuildId(build.id)}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/60 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-0.5">
                      <span className="font-bold text-white">{build.name}</span>
                      <span className="text-emerald-400 text-[10px]">{build.physicsComplexity} Physics</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono truncate">{build.version}</div>
                  </button>
                );
              })}

              {isCompareMode && (
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <span className="text-[11px] font-mono text-cyan-400 block font-semibold">
                    Comparison Target (Build B):
                  </span>
                  {gameBuilds.map((build) => {
                    const isSelected = build.id === compareBuildId;
                    return (
                      <button
                        key={build.id}
                        onClick={() => setCompareBuildId(build.id)}
                        className={`w-full text-left p-2.5 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-500/60 shadow-sm'
                            : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono mb-0.5">
                          <span className="font-bold text-white">{build.name}</span>
                          <span className="text-cyan-400 text-[10px]">{build.physicsComplexity} Physics</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-mono truncate">{build.version}</div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 2. Device Silicon Profile Selection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Target Mobile SoC Architecture</span>
              <span className="text-cyan-400 font-mono text-[11px]">Flagship & Reference</span>
            </h4>
            <div className="space-y-2">
              {testDevices.map((dev) => {
                const isSelected = dev.id === selectedDeviceId;
                return (
                  <button
                    key={dev.id}
                    onClick={() => setSelectedDeviceId(dev.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-cyan-500/60 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-mono mb-1">
                      <span className="font-bold text-white">{dev.name}</span>
                      <span className="text-cyan-400">{dev.manufacturingNode}</span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-mono">{dev.gpu}</div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                      <span>Thermal Envelope: {dev.thermalDissipationW}W</span>
                      <span>Max Refresh: {dev.maxFpsCap}Hz</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Interactive Sliders & Live Results */}
        <div className="lg:col-span-7 space-y-4">
          {/* Test Parameters Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              <span>Benchmark Execution Parameters</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Target FPS */}
              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Target Refresh Rate:</span>
                  <span className="text-emerald-400 font-bold">{targetFps} FPS</span>
                </div>
                <div className="flex gap-2">
                  {[60, 90, 120].map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setTargetFps(fps)}
                      disabled={fps > selectedDevice.maxFpsCap}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-all disabled:opacity-30 ${
                        targetFps === fps ? 'bg-emerald-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {fps} FPS
                    </button>
                  ))}
                </div>
              </div>

              {/* Render Resolution */}
              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Render Resolution:</span>
                  <span className="text-cyan-400 font-bold">{renderResolution}</span>
                </div>
                <div className="flex gap-2">
                  {(['1080p', '1440p', '4K-MetalFX'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setRenderResolution(res)}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                        renderResolution === res ? 'bg-cyan-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphics Preset */}
              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Graphics Shading Preset:</span>
                  <span className="text-white font-bold">{graphicsPreset}</span>
                </div>
                <div className="flex gap-2">
                  {(['Medium', 'High', 'Ultra RT'] as const).map((pre) => (
                    <button
                      key={pre}
                      onClick={() => setGraphicsPreset(pre)}
                      className={`flex-1 py-1.5 rounded text-xs font-bold transition-all ${
                        graphicsPreset === pre ? 'bg-indigo-600 text-white' : 'bg-slate-950 text-slate-300 border border-slate-800'
                      }`}
                    >
                      {pre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ambient Temp */}
              <div className="space-y-1 font-mono">
                <div className="flex justify-between text-slate-400">
                  <span>Ambient Room Temp:</span>
                  <span className="text-amber-400 font-bold">{ambientTempC}° C</span>
                </div>
                <input
                  type="range"
                  min="18"
                  max="38"
                  step="1"
                  value={ambientTempC}
                  onChange={(e) => setAmbientTempC(parseInt(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Test Progress Bar during run */}
            {isRunningTest && (
              <div className="space-y-1 pt-2 border-t border-slate-800 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Executing 60-Second Stress Loop...</span>
                  <span className="text-emerald-400 font-bold">{testProgress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-200"
                    style={{ width: `${testProgress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Real-Time Benchmark Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 block text-[10px]">Average Frame Rate</span>
              <div className="text-2xl font-bold text-white tabular-nums">
                {computedAvgFps} <span className="text-xs font-normal text-slate-400">FPS</span>
              </div>
              <span className="text-[10px] text-emerald-400 block">
                Target: {targetFps} FPS ({((computedAvgFps / targetFps) * 100).toFixed(0)}% stability)
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 block text-[10px]">1% Lows (Stutter Floor)</span>
              <div className="text-2xl font-bold text-cyan-400 tabular-nums">
                {computedOnePercentLow} <span className="text-xs font-normal text-slate-400">FPS</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                0.1% Low: {computedPointOnePercentLow} FPS
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 block text-[10px]">Peak SoC Temperature</span>
              <div className={`text-2xl font-bold tabular-nums ${isThrottling ? 'text-red-400' : 'text-amber-400'}`}>
                {peakSoCTempC}° C
              </div>
              <span className="text-[10px] text-slate-400 block">
                Chassis: {peakChassisTempC}° C
              </span>
            </div>

            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-500 block text-[10px]">Power & Battery Run</span>
              <div className="text-2xl font-bold text-white tabular-nums">
                {avgPowerWatts} <span className="text-xs font-normal text-slate-400">W</span>
              </div>
              <span className="text-[10px] text-emerald-400 block">
                ~{batteryLifeHours} hrs continuous
              </span>
            </div>
          </div>

          {/* Comparative A/B Scorecard when isCompareMode is active */}
          {isCompareMode && (
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-300 font-bold border-b border-slate-800 pb-2">
                <span className="text-emerald-400">Build A: {selectedBuild.name}</span>
                <span className="text-slate-500 font-normal">VS</span>
                <span className="text-cyan-400">Build B: {compareBuild.name}</span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FPS Delta</span>
                  <span className={`text-sm font-bold ${computedAvgFps >= compareAvgFps ? 'text-emerald-400' : 'text-red-400'}`}>
                    {computedAvgFps >= compareAvgFps ? `+${computedAvgFps - compareAvgFps}` : `${computedAvgFps - compareAvgFps}`} FPS
                  </span>
                  <span className="text-[10px] text-slate-400 block">({computedAvgFps} vs {compareAvgFps})</span>
                </div>

                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">1% Low Delta</span>
                  <span className={`text-sm font-bold ${computedOnePercentLow >= compareOnePercentLow ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {computedOnePercentLow >= compareOnePercentLow ? `+${computedOnePercentLow - compareOnePercentLow}` : `${computedOnePercentLow - compareOnePercentLow}`} FPS
                  </span>
                  <span className="text-[10px] text-slate-400 block">({computedOnePercentLow} vs {compareOnePercentLow})</span>
                </div>

                <div className="p-2 bg-slate-900 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Thermal Delta</span>
                  <span className="text-sm font-bold text-amber-400">
                    {(parseFloat(peakSoCTempC) - parseFloat(compareSoCTempC)).toFixed(1)}° C
                  </span>
                  <span className="text-[10px] text-slate-400 block">({peakSoCTempC}°C vs {compareSoCTempC}°C)</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Frame Rate Stability Timeline Chart & Thermal Dissipation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Frame Rate Curve (FPS over test duration) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Frame Rate Stability Curve (FPS vs Time)</span>
              </h4>
              <p className="text-xs text-slate-400">Sampled over 50 consecutive seconds under continuous game physics load.</p>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                <span>Rendered FPS</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-slate-600 inline-block"></span>
                <span>Target ({targetFps} FPS)</span>
              </span>
            </div>
          </div>

          {/* SVG Frame Rate Line Chart */}
          <div className="relative h-48 bg-slate-950 rounded-xl border border-slate-800 p-3 select-none">
            <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
              {/* Grid Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="#1e293b" strokeWidth="0.4" strokeDasharray="1,1" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" strokeWidth="0.4" strokeDasharray="1,1" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#1e293b" strokeWidth="0.4" strokeDasharray="1,1" />

              {/* Target Line */}
              <line x1="0" y1="8" x2="100" y2="8" stroke="#475569" strokeWidth="0.6" strokeDasharray="1.5,1" />

              {/* FPS Curve Polygon Fill */}
              <polygon
                points={`0,50 ${fpsChartPoints.map((fps, i) => `${(i / 49) * 100},${50 - (fps / 130) * 44}`).join(' ')} 100,50`}
                fill="url(#fpsAreaGradient)"
                opacity="0.3"
              />

              {/* FPS Curve Line */}
              <polyline
                points={fpsChartPoints.map((fps, i) => `${(i / 49) * 100},${50 - (fps / 130) * 44}`).join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <defs>
                <linearGradient id="fpsAreaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
            </svg>

            {/* Bottom Scale Markers */}
            <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
              <span>0s (Game Launch)</span>
              <span>15s (Asset Load)</span>
              <span>30s (Crowd Simulation)</span>
              <span>45s (Particle Burst)</span>
              <span>60s (Peak Load)</span>
            </div>
          </div>
        </div>

        {/* Thermal Dissipation & Chassis Touch Heatmap */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-amber-400" />
              <span>Chassis Thermal Dissipation</span>
            </h4>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
              isThrottling ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
            }`}>
              {isThrottling ? 'Stage 1 Throttling' : 'Zero Throttling'}
            </span>
          </div>

          {/* Smartphone Heatmap Silhouette */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-center">
            <div className="relative w-36 h-56 rounded-2xl border-2 border-slate-700 bg-slate-900 p-2 flex flex-col justify-between overflow-hidden shadow-lg">
              {/* Camera Island Thermal Hotspot */}
              <div className="absolute top-4 left-4 w-12 h-16 rounded-xl bg-gradient-to-br from-red-500 via-amber-500 to-transparent opacity-80 blur-sm"></div>
              
              {/* SoC Die Center Hotspot */}
              <div className="absolute top-16 left-8 w-16 h-16 rounded-full bg-gradient-to-r from-red-600 to-amber-500 opacity-60 blur-md"></div>

              {/* Battery Area cooler zone */}
              <div className="absolute bottom-6 left-6 right-6 h-20 rounded-xl bg-gradient-to-t from-emerald-600/30 to-amber-500/20 blur-sm"></div>

              {/* Labels on Device */}
              <div className="relative z-10 text-[9px] font-mono text-white text-center font-bold">
                <span className="bg-black/60 px-1 py-0.5 rounded text-red-300 block mb-0.5">SoC: {peakSoCTempC}° C</span>
              </div>
              <div className="relative z-10 text-[9px] font-mono text-white text-center font-bold">
                <span className="bg-black/60 px-1 py-0.5 rounded text-emerald-300 block">Grip: {peakChassisTempC}° C</span>
              </div>
            </div>
          </div>

          {/* Thermal Throttling Safety Thresholds */}
          <div className="space-y-1.5 text-xs font-mono">
            <div className="flex justify-between text-slate-400">
              <span>SoC Throttle Limit:</span>
              <span className="text-white">48.0° C</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Hand Touch Comfort Threshold:</span>
              <span className="text-emerald-400">Safe (&lt;43° C)</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Battery Temperature:</span>
              <span className="text-white">35.4° C Nominal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Amnetek Optimization Engine Recommendations */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
          <span>Amnetek Mobile Engine Profiling & Optimization Insights</span>
          <span className="text-emerald-400 font-mono text-[11px]">AI Analyzer Active</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Draw Call Budget</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              {selectedBuild.baseDrawCalls} draw calls fits comfortably within Vulkan/Metal command buffer limits (ideal &lt;1,200).
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-bold">
              <Zap className="w-3.5 h-3.5" />
              <span>MetalFX / FSR 3 Upscaling</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              Rendering at 1080p native and upscaling to 1440p via spatial reconstruction will boost 1% lows by +12.4 FPS.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Thermal Longevity</span>
            </div>
            <p className="text-slate-300 text-[11px]">
              At {targetFps} FPS Ultra RT, continuous gaming exceeds 45° C at 35 minutes. Capping to 90 FPS extends battery by +1.4 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
