import React, { useState, useEffect, useRef } from 'react';
import { DevPcRig } from '../../types/sports-os';
import { 
  Flame, 
  Thermometer, 
  Cpu, 
  Zap, 
  RotateCcw, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Activity, 
  Sliders, 
  Wind, 
  Volume2 
} from 'lucide-react';

interface RigStressTestUtilityProps {
  rig: DevPcRig;
}

type WorkloadType = 'unreal-nanite' | 'blender-optix' | 'pytorch-tensor' | 'prores-transcode';
type CoolingProfile = 'custom-liquid' | 'dual-tower-air' | 'server-blower' | 'vapor-chamber';

export const RigStressTestUtility: React.FC<RigStressTestUtilityProps> = ({ rig }) => {
  const [workload, setWorkload] = useState<WorkloadType>('unreal-nanite');
  const [stressIntensityPct, setStressIntensityPct] = useState<number>(100);
  const [coolingSystem, setCoolingSystem] = useState<CoolingProfile>('custom-liquid');
  const [isStressRunning, setIsStressRunning] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Dynamic live stress metrics
  const [currentTempC, setCurrentTempC] = useState<number>(rig.liveMetrics.tempCelsius);
  const [currentPowerW, setCurrentPowerW] = useState<number>(rig.liveMetrics.powerWatts);
  const [currentFanRpm, setCurrentFanRpm] = useState<number>(rig.liveMetrics.fanRpm);
  const [currentGpuLoad, setCurrentGpuLoad] = useState<number>(rig.liveMetrics.gpuLoadPct);
  const [currentCpuLoad, setCurrentCpuLoad] = useState<number>(rig.liveMetrics.cpuLoadPct);

  // 40-point history for SVG temperature and fan graph
  const [tempHistory, setTempHistory] = useState<number[]>(
    Array.from({ length: 40 }).map((_, i) => Math.round(rig.liveMetrics.tempCelsius - 10 + Math.sin(i * 0.4) * 2))
  );

  // Compute thermal targets based on workload and cooling
  const coolingModifier = coolingSystem === 'custom-liquid' ? 0.82 : coolingSystem === 'vapor-chamber' ? 0.90 : coolingSystem === 'server-blower' ? 0.85 : 1.0;
  const workloadHeatMultiplier = workload === 'unreal-nanite' ? 1.25 : workload === 'blender-optix' ? 1.30 : workload === 'pytorch-tensor' ? 1.35 : 1.15;
  const maxPossibleTdp = rig.liveMetrics.powerWatts * (stressIntensityPct / 100) * 1.2;
  const equilibriumTemp = Math.min(94, Math.round(24 + (maxPossibleTdp / 10) * coolingModifier * (workloadHeatMultiplier / 1.2)));

  const tjMaxTemp = 100;
  const thermalHeadroom = Math.max(0, tjMaxTemp - currentTempC);
  const isThrottling = currentTempC >= 92;

  // Real-time stress loop
  useEffect(() => {
    let timer: any;
    if (isStressRunning) {
      timer = setInterval(() => {
        setElapsedSeconds((s) => s + 1);

        // Approach equilibrium temperature smoothly
        setCurrentTempC((prev) => {
          const delta = (equilibriumTemp - prev) * 0.08 + (Math.random() - 0.5) * 0.8;
          const nextVal = Math.round((prev + delta) * 10) / 10;
          return Math.max(35, Math.min(99, nextVal));
        });

        // Fluctuating power draw
        setCurrentPowerW(() => {
          const base = maxPossibleTdp;
          const jitter = (Math.random() - 0.5) * 24;
          return Math.round(base + jitter);
        });

        // Fan RPM curve reacting to temp
        setCurrentFanRpm((prev) => {
          const targetRpm = Math.min(3200, Math.round(1000 + (currentTempC / 100) * 2000));
          return Math.round(prev + (targetRpm - prev) * 0.15);
        });

        // Compute loads
        setCurrentGpuLoad(Math.min(100, Math.round(stressIntensityPct * 0.96 + (Math.random() * 4))));
        setCurrentCpuLoad(Math.min(100, Math.round(stressIntensityPct * 0.88 + (Math.random() * 6))));

        // Append to history
        setTempHistory((prev) => [...prev.slice(1), currentTempC]);
      }, 500);
    } else {
      // Smooth cool-down when stopped
      timer = setInterval(() => {
        if (currentTempC > rig.liveMetrics.tempCelsius) {
          setCurrentTempC((prev) => Math.max(rig.liveMetrics.tempCelsius, Math.round((prev - 0.8) * 10) / 10));
          setCurrentFanRpm((prev) => Math.max(rig.liveMetrics.fanRpm, prev - 30));
          setCurrentPowerW((prev) => Math.max(rig.liveMetrics.powerWatts, prev - 15));
        }
      }, 800);
    }
    return () => clearInterval(timer);
  }, [isStressRunning, currentTempC, equilibriumTemp, maxPossibleTdp, stressIntensityPct, rig.liveMetrics]);

  // Derived cooling efficiency metrics
  const thermalResistance = ( (currentTempC - 24) / Math.max(1, currentPowerW) ).toFixed(3); // °C / Watt
  const coolingEfficiencyScore = Math.max(60, Math.min(99, Math.round(100 - (parseFloat(thermalResistance) * 320))));
  const acousticNoiseDba = Math.round(28 + (currentFanRpm / 3200) * 24);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleExportStressLog = () => {
    const data = {
      benchmarkSession: `AMNETEK-STRESS-LOG-${rig.id}-${Date.now()}`,
      rig: rig.name,
      codename: rig.codename,
      workload,
      coolingSystem,
      stressIntensityPct,
      durationElapsed: formatTime(elapsedSeconds),
      metrics: {
        peakTempCelsius: currentTempC,
        powerDrawWatts: currentPowerW,
        fanRpm: currentFanRpm,
        thermalResistanceCPerW: thermalResistance,
        coolingEfficiencyScore: `${coolingEfficiencyScore}%`,
        acousticNoiseDba: `${acousticNoiseDba} dBA`,
        thermalHeadroomCelsius: thermalHeadroom,
        throttlingDetected: isThrottling,
      },
      historySamples: tempHistory,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amnetek_stress_log_${rig.id}_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isStressRunning ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`}></span>
            <h3 className="text-base font-bold text-white">
              Real-Time Heavy Rendering Stress Utility & Cooling Telemetry
            </h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-950 text-emerald-400 border border-slate-800">
              Rig: {rig.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Simulate continuous TDP rendering loads, evaluate thermal dissipation curves, and measure heat evacuation efficiency.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportStressLog}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Export Thermal Log</span>
          </button>
          
          <button
            onClick={() => setIsStressRunning(!isStressRunning)}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-bold text-white rounded-lg shadow-sm transition-all active:scale-95 ${
              isStressRunning
                ? 'bg-red-600 hover:bg-red-500 shadow-red-950/40'
                : 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40'
            }`}
          >
            {isStressRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Halt Stress Test ({formatTime(elapsedSeconds)})</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Engage Live Rendering Stress</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Control Configuration Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Workload & Cooling System Configuration */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center justify-between">
              <span>Heavy Rendering Workload Profile</span>
              <span className="text-emerald-400 font-mono text-[11px]">Direct GPU/CPU Burn</span>
            </h4>

            {/* Workload Buttons */}
            <div className="space-y-2">
              {[
                { id: 'unreal-nanite', label: 'Unreal Engine 5.5 Nanite & Lumen', desc: '10M dynamic polygons, ray-traced reflections, heavy shader passes' },
                { id: 'blender-optix', label: 'Blender 4.2 OptiX Path Tracing', desc: '1,000 ray samples per pixel with BVH traversal & subsurface scatter' },
                { id: 'pytorch-tensor', label: 'PyTorch Vision Transformer Heavy Batch', desc: 'Full Tensor Core FP16 matrix multiplication & coordinate regression' },
                { id: 'prores-transcode', label: '8K RED RAW Transcode & AI De-noise', desc: 'Saturated AVX-512 vector pipelines & dual NVENC hardware units' },
              ].map((wl) => {
                const isSelected = workload === wl.id;
                return (
                  <button
                    key={wl.id}
                    onClick={() => setWorkload(wl.id as any)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-slate-800/90 border-emerald-500/60 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="text-xs font-bold text-white mb-0.5">{wl.label}</div>
                    <div className="text-[11px] text-slate-400 leading-snug">{wl.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Stress Intensity Slider */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Thermal Stress Intensity:</span>
                <span className="text-emerald-400 font-bold">{stressIntensityPct}% Continuous TDP</span>
              </div>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={stressIntensityPct}
                onChange={(e) => setStressIntensityPct(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            {/* Cooling System Selection */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <span className="text-xs text-slate-400 block font-medium">Equipped Cooling System:</span>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {[
                  { id: 'custom-liquid', label: 'Custom 360mm Liquid Loop' },
                  { id: 'dual-tower-air', label: 'Dual-Tower Heatpipe Air' },
                  { id: 'server-blower', label: 'Industrial Server Blower' },
                  { id: 'vapor-chamber', label: 'Direct-Die Vapor Chamber' },
                ].map((cs) => (
                  <button
                    key={cs.id}
                    onClick={() => setCoolingSystem(cs.id as any)}
                    className={`p-2 rounded text-center transition-all ${
                      coolingSystem === cs.id
                        ? 'bg-emerald-600 text-white font-bold'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {cs.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Real-Time Live Telemetry Gauges & Efficiency Readouts */}
        <div className="lg:col-span-7 space-y-4">
          {/* 4 Core Thermal Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            {/* Core Die Temperature */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>DIE TEMPERATURE</span>
                <Thermometer className="w-3.5 h-3.5 text-amber-400" />
              </div>
              <div className={`text-2xl font-bold tabular-nums ${isThrottling ? 'text-red-400 animate-pulse' : currentTempC > 78 ? 'text-amber-400' : 'text-emerald-400'}`}>
                {currentTempC}° C
              </div>
              <span className="text-[10px] text-slate-400 block">
                Headroom: <strong className="text-white">{thermalHeadroom.toFixed(1)}° C</strong>
              </span>
            </div>

            {/* Total Power Draw */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>ACTIVE POWER (TDP)</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {currentPowerW} <span className="text-xs font-normal text-slate-400">W</span>
              </div>
              <span className="text-[10px] text-cyan-400 block">
                Efficiency: {coolingEfficiencyScore}%
              </span>
            </div>

            {/* Fan & Radiator RPM */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>COOLING FAN RPM</span>
                <Wind className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {currentFanRpm.toLocaleString()} <span className="text-xs font-normal text-slate-400">RPM</span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                Acoustic: {acousticNoiseDba} dBA
              </span>
            </div>

            {/* Thermal Resistance */}
            <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[10px]">
                <span>THERMAL RESISTANCE</span>
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 tabular-nums">
                {thermalResistance}
              </div>
              <span className="text-[10px] text-slate-400 block">
                °C / Watt (Lower is Better)
              </span>
            </div>
          </div>

          {/* Live Thermal Dissipation Line Chart */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Real-Time Cooling Efficiency & Heat Evacuation Curve</span>
                </h4>
                <p className="text-xs text-slate-400">Live dynamic temperature curve sampled every 500ms under heavy rendering compute load.</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-emerald-400 inline-block"></span>
                  <span>Die Temp (°C)</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-0.5 bg-red-500 inline-block"></span>
                  <span>TjMax Throttle ({tjMaxTemp}°C)</span>
                </span>
              </div>
            </div>

            {/* SVG Live Temperature Timeline Chart */}
            <div className="relative h-48 bg-slate-950 rounded-xl border border-slate-800 p-3 select-none">
              <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-full">
                {/* Horizontal reference lines */}
                <line x1="0" y1="5" x2="100" y2="5" stroke="#ef4444" strokeWidth="0.6" strokeDasharray="1.5,1" strokeOpacity="0.8" />
                <line x1="0" y1="20" x2="100" y2="20" stroke="#1e293b" strokeWidth="0.4" strokeDasharray="1,1" />
                <line x1="0" y1="35" x2="100" y2="35" stroke="#1e293b" strokeWidth="0.4" strokeDasharray="1,1" />

                {/* Area Gradient Fill */}
                <polygon
                  points={`0,50 ${tempHistory.map((temp, i) => `${(i / 39) * 100},${50 - (temp / 105) * 45}`).join(' ')} 100,50`}
                  fill="url(#thermalGradientArea)"
                  opacity="0.35"
                />

                {/* Live Temperature Line */}
                <polyline
                  points={tempHistory.map((temp, i) => `${(i / 39) * 100},${50 - (temp / 105) * 45}`).join(' ')}
                  fill="none"
                  stroke={currentTempC > 82 ? '#f59e0b' : '#10b981'}
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                <defs>
                  <linearGradient id="thermalGradientArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={currentTempC > 82 ? '#f59e0b' : '#10b981'} stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#047857" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Chart Scale Labels */}
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>T-20s (Baseline)</span>
                <span>T-15s</span>
                <span>T-10s</span>
                <span>T-5s</span>
                <span className="text-emerald-400 font-bold">Live: {currentTempC}° C</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hardware Component Thermal Dissipation Schematic & Status Log */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hardware Component Thermal Heatmap */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Rig Hardware Thermal Heatmap Schematic</span>
            </h4>
            <span className="text-xs font-mono text-slate-400">Airflow: Front-to-Back Positive Pressure</span>
          </div>

          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs space-y-3">
            {/* CPU Socket Node */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Central Processing Unit (CPU Die)</span>
                <span className="text-[11px] text-slate-400">{rig.cpu.split('(')[0]}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-white tabular-nums">{currentTempC}° C</span>
                <span className="text-[10px] text-emerald-400 block">{currentCpuLoad}% Load</span>
              </div>
            </div>

            {/* Primary GPU Node */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Primary GPU Accelerator (CUDA Node 0)</span>
                <span className="text-[11px] text-slate-400">{rig.gpu.split('(')[0]}</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-emerald-400 tabular-nums">
                  {Math.round(currentTempC - 4)}° C
                </span>
                <span className="text-[10px] text-emerald-400 block">{currentGpuLoad}% Load</span>
              </div>
            </div>

            {/* VRM & Memory Node */}
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between">
              <div>
                <span className="font-bold text-white block">Power Delivery VRM & Octa-Channel RAM</span>
                <span className="text-[11px] text-slate-400">16-Phase 105A Smart Power Stages</span>
              </div>
              <div className="text-right">
                <span className="text-base font-bold text-cyan-400 tabular-nums">54.2° C</span>
                <span className="text-[10px] text-slate-400 block">Vapor Sink Passive</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Diagnostic Event Stream */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Thermal Sensor & Diagnostic Event Stream</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-400">Auto-Polling 500ms</span>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 font-mono text-xs max-h-56 overflow-y-auto">
            <div className="p-2 bg-slate-900 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">[T+00:00] Stress engine connected to {rig.name}</span>
              <span className="text-emerald-400">OK</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">[T+00:05] Workload dispatched: {workload}</span>
              <span className="text-cyan-400">LOADED</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">[T+00:15] Liquid loop pump calibrated to 100% flow</span>
              <span className="text-emerald-400">PUMP OK</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800/80 flex items-center justify-between">
              <span className="text-slate-400">
                [LIVE] Thermal equilibrium: {currentTempC}° C | {thermalHeadroom.toFixed(1)}° C to TjMax
              </span>
              <span className={isThrottling ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                {isThrottling ? 'THROTTLING' : 'OPTIMAL'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
