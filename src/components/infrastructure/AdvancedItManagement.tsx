import React, { useState } from 'react';
import { EdgeComputeNode } from '../../types/sports-os';
import { 
  Server, 
  Cpu, 
  ShieldCheck, 
  Network, 
  Activity, 
  Zap, 
  Lock, 
  CheckCircle2 
} from 'lucide-react';

interface AdvancedItManagementProps {
  edgeNodes: EdgeComputeNode[];
}

export const AdvancedItManagement: React.FC<AdvancedItManagementProps> = ({
  edgeNodes,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'edge' | 'streaming' | 'security' | 'api-gateway'>('edge');
  const [nodes, setNodes] = useState<EdgeComputeNode[]>(edgeNodes);
  const [activeRole, setActiveRole] = useState<'Chief Data Scientist' | 'Head Coach' | 'Chief Medical Officer' | 'Executive CEO'>('Chief Data Scientist');

  const handleSimulateFailover = (nodeId: string) => {
    setNodes((prev) =>
      prev.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              linkRedundancy:
                n.linkRedundancy === 'Primary Starlink Active'
                  ? 'Terrestrial Fiber Active'
                  : 'Primary Starlink Active',
            }
          : n
      )
    );
  };

  const apiIntegrations = [
    { name: 'Catapult Vector S7 GNSS', category: 'Wearables', status: 'Operational', latency: '4ms', ping: 'Nominal' },
    { name: 'Second Spectrum 8K Computer Vision', category: 'Optical Tracking', status: 'Operational', latency: '9ms', ping: 'Nominal' },
    { name: 'Opta Core Event Telemetry', category: 'Match Stats', status: 'Operational', latency: '12ms', ping: 'Nominal' },
    { name: 'WHOOP Enterprise Biometrics', category: 'Sleep/HRV', status: 'Operational', latency: '18ms', ping: 'Nominal' },
    { name: 'Ticketmaster Yield Gateway', category: 'Ticketing', status: 'Operational', latency: '24ms', ping: 'Nominal' },
    { name: 'Stripe Multi-Currency Escrow', category: 'FinTech', status: 'Operational', latency: '15ms', ping: 'Nominal' },
    { name: 'SAP Sports One HR', category: 'Club ERP', status: 'Operational', latency: '32ms', ping: 'Nominal' },
    { name: 'Sentinel-2 ESA Hub', category: 'Earth Observation', status: 'Operational', latency: '85ms', ping: 'Nominal' },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('edge')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'edge'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Hybrid Edge-Satellite Mesh</span>
          </button>
          <button
            onClick={() => setActiveSubTab('streaming')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'streaming'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5" />
            <span>Kafka & Big Data Streaming</span>
          </button>
          <button
            onClick={() => setActiveSubTab('security')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'security'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Zero-Trust Biometric Vault</span>
          </button>
          <button
            onClick={() => setActiveSubTab('api-gateway')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'api-gateway'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>API Gateway (1,000+ Hooks)</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          <span>Edge Mesh Ingestion: </span>
          <span className="text-emerald-400 font-bold">51,200 events/sec (&lt;10ms)</span>
        </div>
      </div>

      {/* Sub-view 1: Hybrid Edge-Satellite Mesh */}
      {activeSubTab === 'edge' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div key={node.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                    {node.status}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{node.inferenceLatencyMs}ms Latency</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-white">{node.name}</h4>
                  <span className="text-xs text-slate-400">{node.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block text-[10px]">GPU Compute Load</span>
                    <span className="text-sm font-bold text-white tabular-nums">{node.gpuLoadPct}%</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded">
                    <span className="text-slate-500 block text-[10px]">Die Temp</span>
                    <span className="text-sm font-bold text-emerald-400 tabular-nums">{node.tempCelsius}° C</span>
                  </div>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="text-slate-500 block text-[11px]">Active Edge Models:</span>
                  <span className="font-mono text-cyan-300 text-[11px] block mt-0.5">
                    {node.activeModels.join(', ')}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-mono">{node.linkRedundancy}</span>
                  <button
                    onClick={() => handleSimulateFailover(node.id)}
                    className="px-2 py-0.5 text-[11px] text-slate-300 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                  >
                    Test Failover
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-view 2: Kafka Streaming */}
      {activeSubTab === 'streaming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">High-Throughput Kafka Event Bus</h3>
              <p className="text-xs text-slate-400">Low-latency partition consumers streaming from stadium optical cameras and GNSS trackers.</p>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-emerald-400 font-bold block">stadium.tracking.coordinates.50hz</span>
                  <span className="text-slate-500 text-[10px]">Partitions: 12 · Replicas: 3</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">50,000 msg/s</span>
                  <span className="text-slate-500 block text-[10px]">Lag: 0 ms</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-cyan-400 font-bold block">athlete.wearables.biometrics.stream</span>
                  <span className="text-slate-500 text-[10px]">Partitions: 4 · Replicas: 3</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">1,240 msg/s</span>
                  <span className="text-slate-500 block text-[10px]">Lag: 0 ms</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-indigo-400 font-bold block">broadcast.vision.sponsorship.frames</span>
                  <span className="text-slate-500 text-[10px]">Partitions: 6 · Replicas: 3</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold">2,400 msg/s</span>
                  <span className="text-slate-500 block text-[10px]">Lag: 2 ms</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Apache Iceberg Lakehouse Archival Health
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Streaming ingestion automatically rolls micro-batches into compressed ZSTD columnar Parquet files on cloud object storage every 60 seconds.
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Total Lakehouse Size</span>
                  <span className="text-base font-bold text-white mt-1 block">42.8 TB</span>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">Compression Ratio</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">5.4x (ZSTD)</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800 text-xs font-mono text-emerald-400">
              Zero packet drop across last 14 fixtures.
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 3: Zero-Trust Biometric Security */}
      {activeSubTab === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Cryptographic Role-Based Access Control (RBAC)</h3>
              <p className="text-xs text-slate-400">Enforce strict medical privacy and tactical secrecy with envelope encryption.</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs text-slate-400 block">Simulate Active Security Persona:</span>
              <div className="grid grid-cols-2 gap-2">
                {(['Chief Data Scientist', 'Head Coach', 'Chief Medical Officer', 'Executive CEO'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setActiveRole(role)}
                    className={`p-2 rounded text-xs text-left font-medium transition-all ${
                      activeRole === role
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {role}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-slate-400">Active Permissions:</div>
              <div className="text-emerald-400">
                {activeRole === 'Chief Medical Officer'
                  ? 'FULL ACCESS: Athlete MRI Scans, Blood Biomarkers, Wearable Raw Telemetry'
                  : activeRole === 'Head Coach'
                  ? 'TACTICAL ACCESS: Match Coordinates, Opposition Models, Readiness Scores (No Medical Records)'
                  : activeRole === 'Executive CEO'
                  ? 'COMMERCIAL ACCESS: Financials, Transfer Budgets, Sponsorship Valuations'
                  : 'SCIENTIFIC ACCESS: Model Pipelines, Lakehouse SQL, Feature Store, Anonymized GPS'}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Immutable Cryptographic Audit Trail
            </h4>
            <div className="space-y-2 text-xs font-mono">
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">2026-10-03 10:14:22 UTC</span>
                <span className="text-slate-200">Decrypted: player.biometrics.silva.rmssd (Hash: 0x9f4a...21c)</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">2026-10-03 10:12:05 UTC</span>
                <span className="text-slate-200">Export: model.xg.weights.parquet to Edge Pod Alpha</span>
              </div>
              <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                <span className="text-slate-500 block text-[10px]">2026-10-03 10:05:40 UTC</span>
                <span className="text-slate-200">Verified: GBE work permit points for target #tr-01</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 4: API Gateway */}
      {activeSubTab === 'api-gateway' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Ecosystem Connectors (1,000+ API Hooks)</h3>
              <p className="text-xs text-slate-400">Live operational status across wearables, optical tracking, ERP, and satellite providers.</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-1 rounded border border-emerald-800">
              All Systems Operational
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {apiIntegrations.map((api, idx) => (
              <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-[10px] uppercase font-mono">{api.category}</span>
                  <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 inline" /> {api.latency}
                  </span>
                </div>
                <div className="font-bold text-white text-xs">{api.name}</div>
                <div className="text-[11px] text-slate-400 font-mono">{api.status}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
