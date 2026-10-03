import React, { useState } from 'react';
import { DevPcRig } from '../../types/sports-os';
import { 
  Laptop, 
  Cpu, 
  HardDrive, 
  Gauge, 
  Terminal, 
  Zap, 
  Activity, 
  Sliders, 
  RotateCcw, 
  CheckCircle2, 
  Play,
  Flame
} from 'lucide-react';
import { RigStressTestUtility } from './RigStressTestUtility';

interface DevPcVarietyProps {
  devRigs: DevPcRig[];
}

export const DevPcVariety: React.FC<DevPcVarietyProps> = ({ devRigs }) => {
  const [selectedRigId, setSelectedRigId] = useState<string>(devRigs[0]?.id || 'pc-titan-ai');
  const [isBenchmarking, setIsBenchmarking] = useState<boolean>(false);
  const [benchmarkResult, setBenchmarkResult] = useState<string | null>(null);
  const [allocatedGpuBatch, setAllocatedGpuBatch] = useState<number>(64);
  const [activeTab, setActiveTab] = useState<'hardware' | 'stress-test' | 'benchmarks' | 'toolchains'>('hardware');

  const selectedRig = devRigs.find((r) => r.id === selectedRigId) || devRigs[0];

  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkResult(null);
    setTimeout(() => {
      setIsBenchmarking(false);
      setBenchmarkResult(
        `[BENCHMARK PASSED] ${selectedRig.name}\n` +
        `Target Workload: ${selectedRig.targetSpecialty}\n` +
        `CUDA / Neural Compute: ${selectedRig.benchmarks.cudaTflops} TFLOPS sustained\n` +
        `Batch Size: ${allocatedGpuBatch} | AI Throughput: ${(selectedRig.benchmarks.aiBatchFps * (allocatedGpuBatch / 64)).toFixed(0)} frames/sec\n` +
        `Game Engine Shader Compilation: Completed in ${selectedRig.benchmarks.gameCompileMinutes} mins\n` +
        `Peak Thermal: ${selectedRig.liveMetrics.tempCelsius + 4}° C | Power Draw: ${selectedRig.liveMetrics.powerWatts}W | Zero Thermal Throttling`
      );
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Amnetek Developer PC Variety & Workstation Farm</span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
              4 Developer Rigs Online
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Dedicated hardware configurations for AI model training, mobile game engine compilation, and low-latency sports telemetry.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('hardware')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'hardware' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hardware Specs & Telemetry
          </button>
          <button
            onClick={() => setActiveTab('stress-test')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'stress-test' 
                ? 'bg-red-950/90 text-red-300 border border-red-800/80 shadow-sm' 
                : 'text-red-400 hover:text-red-300'
            }`}
          >
            <Flame className="w-3.5 h-3.5 fill-current" />
            <span>Heavy Rendering Stress & Cooling</span>
          </button>
          <button
            onClick={() => setActiveTab('benchmarks')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'benchmarks' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compute Benchmarks
          </button>
          <button
            onClick={() => setActiveTab('toolchains')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'toolchains' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dev Toolchains & SDKs
          </button>
        </div>
      </div>

      {/* Developer Rig Variety Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {devRigs.map((rig) => {
          const isSelected = rig.id === selectedRigId;
          return (
            <button
              key={rig.id}
              onClick={() => setSelectedRigId(rig.id)}
              className={`text-left p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500/60 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono mb-2">
                <span className="text-slate-500 text-[11px]">{rig.codename}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] ${
                  rig.status === 'Online & Building'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : rig.status === 'Compiling Game Asset'
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {rig.status}
                </span>
              </div>

              <div className="text-sm font-bold text-white mb-1 line-clamp-1">{rig.name}</div>
              <div className="text-xs text-emerald-400 font-medium mb-3">{rig.targetSpecialty}</div>

              <div className="space-y-1.5 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                <div className="truncate">CPU: {rig.cpu.split('(')[0]}</div>
                <div className="truncate">GPU: {rig.gpu.split('(')[0]}</div>
                <div className="flex justify-between text-slate-400 pt-1">
                  <span>RAM: {rig.ram.split(' ')[0]}</span>
                  <span>{rig.liveMetrics.powerWatts}W Draw</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Tab Content 1: Dedicated Real-Time Stress Testing Utility */}
      {activeTab === 'stress-test' ? (
        <RigStressTestUtility rig={selectedRig} />
      ) : (
        /* Selected PC In-Depth Telemetry & Benchmarking */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Rig Telemetry & Live Gauges */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">{selectedRig.formFactor}</span>
                <h3 className="text-base font-bold text-white">{selectedRig.name}</h3>
                <p className="text-xs text-slate-400">{selectedRig.os}</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('stress-test')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-300 bg-red-950/60 hover:bg-red-900/60 border border-red-800/60 rounded-lg transition-colors"
                >
                  <Flame className="w-3.5 h-3.5 fill-current" />
                  <span>Launch Stress Test</span>
                </button>
                <div className="text-right font-mono text-xs hidden sm:block">
                  <span className="text-slate-500 block">System Memory Usage</span>
                  <span className="text-emerald-400 font-bold text-sm">
                    {selectedRig.liveMetrics.memoryUsedGb} GB / {selectedRig.liveMetrics.memoryTotalGb} GB
                  </span>
                </div>
              </div>
            </div>

          {/* 4 Real-Time Telemetry Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">CPU Compute</span>
              <span className="text-lg font-bold text-white mt-0.5 block tabular-nums">
                {selectedRig.liveMetrics.cpuLoadPct}%
              </span>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${selectedRig.liveMetrics.cpuLoadPct}%` }}></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">GPU Compute Load</span>
              <span className="text-lg font-bold text-emerald-400 mt-0.5 block tabular-nums">
                {selectedRig.liveMetrics.gpuLoadPct}%
              </span>
              <div className="h-1 w-full bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${selectedRig.liveMetrics.gpuLoadPct}%` }}></div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Die Temperature</span>
              <span className="text-lg font-bold text-cyan-400 mt-0.5 block tabular-nums">
                {selectedRig.liveMetrics.tempCelsius}° C
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">{selectedRig.liveMetrics.fanRpm} RPM Fan</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[10px]">Total Power Draw</span>
              <span className="text-lg font-bold text-amber-400 mt-0.5 block tabular-nums">
                {selectedRig.liveMetrics.powerWatts}W
              </span>
              <span className="text-[10px] text-slate-500 block mt-1">Titanium PSU</span>
            </div>
          </div>

          {/* Full Hardware Architecture Breakdown */}
          <div className="space-y-2 text-xs">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hardware Architecture Specifications
            </h4>
            <div className="space-y-1.5 font-mono text-slate-300">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80 flex justify-between">
                <span className="text-slate-500">Processor:</span>
                <span className="text-white font-medium text-right">{selectedRig.cpu}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80 flex justify-between">
                <span className="text-slate-500">Graphics & ML Accelerator:</span>
                <span className="text-emerald-400 font-medium text-right">{selectedRig.gpu}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80 flex justify-between">
                <span className="text-slate-500">High-Bandwidth Memory:</span>
                <span className="text-white font-medium text-right">{selectedRig.ram}</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80 flex justify-between">
                <span className="text-slate-500">Ultra-Fast NVMe Storage:</span>
                <span className="text-cyan-300 font-medium text-right">{selectedRig.storage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Compute Benchmark Runner & Toolchains */}
        <div className="lg:col-span-5 space-y-4">
          {/* Benchmark Runner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Workstation Compute Benchmark</span>
              </h4>
              <span className="text-xs font-mono text-slate-500">v4.2 PRO</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>AI Batch Size (Tensor Parallelism):</span>
                <span className="text-emerald-400 font-bold">{allocatedGpuBatch} images / frame</span>
              </div>
              <input
                type="range"
                min="16"
                max="256"
                step="16"
                value={allocatedGpuBatch}
                onChange={(e) => setAllocatedGpuBatch(parseInt(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">Geekbench Multi-Core</span>
                <span className="text-base font-bold text-white mt-0.5 block tabular-nums">
                  {selectedRig.benchmarks.geekbenchMulti.toLocaleString()}
                </span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CUDA / ML Power</span>
                <span className="text-base font-bold text-emerald-400 mt-0.5 block tabular-nums">
                  {selectedRig.benchmarks.cudaTflops} TFLOPS
                </span>
              </div>
            </div>

            <button
              onClick={handleRunBenchmark}
              disabled={isBenchmarking}
              className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {isBenchmarking ? (
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current" />
              )}
              <span>{isBenchmarking ? 'Running Compute Stress Benchmark...' : 'Run Hardware Benchmark'}</span>
            </button>

            {benchmarkResult && (
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-emerald-300 whitespace-pre-wrap leading-relaxed">
                {benchmarkResult}
              </div>
            )}
          </div>

          {/* Installed Developer Toolchains */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>Active Dev Toolchains & SDKs</span>
              <span className="text-emerald-400 font-mono text-[11px]">Amnetek Certified</span>
            </h4>
            <div className="space-y-1.5 text-xs font-mono">
              {selectedRig.installedToolchains.map((tool, idx) => (
                <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-200">{tool}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              ))}
            </div>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};
