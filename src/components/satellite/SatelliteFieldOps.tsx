import React, { useState } from 'react';
import { PitchFacility, GnssSatellite } from '../../types/sports-os';
import { 
  Satellite, 
  Droplets, 
  Wind, 
  Thermometer, 
  Layers, 
  Radio, 
  Check, 
  AlertCircle, 
  Navigation, 
  Gauge, 
  Plane 
} from 'lucide-react';

interface SatelliteFieldOpsProps {
  facilities: PitchFacility[];
  satellites: GnssSatellite[];
}

export const SatelliteFieldOps: React.FC<SatelliteFieldOpsProps> = ({
  facilities,
  satellites,
}) => {
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>(facilities[0]?.id || 'stadium-main');
  const [activeLayer, setActiveLayer] = useState<'ndvi' | 'moisture' | 'compaction'>('ndvi');
  const [activeSubTab, setActiveSubTab] = useState<'pitch-ndvi' | 'gnss' | 'weather' | 'logistics'>('pitch-ndvi');
  const [irrigationTriggered, setIrrigationTriggered] = useState<boolean>(false);

  const currentFacility = facilities.find((f) => f.id === selectedFacilityId) || facilities[0];

  const handleTriggerIrrigation = () => {
    setIrrigationTriggered(true);
    setTimeout(() => {
      setIrrigationTriggered(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      {/* Sub-nav */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('pitch-ndvi')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'pitch-ndvi'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Multispectral Pitch NDVI</span>
          </button>
          <button
            onClick={() => setActiveSubTab('gnss')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'gnss'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Sub-10cm GNSS Telemetry</span>
          </button>
          <button
            onClick={() => setActiveSubTab('weather')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'weather'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>Micro-Weather & Pitch Friction</span>
          </button>
          <button
            onClick={() => setActiveSubTab('logistics')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'logistics'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Venue Footfall & Cold-Chain</span>
          </button>
        </div>

        {/* Constellation lock status */}
        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Galileo E5 + GPS L5 (PDOP: 0.82)</span>
        </div>
      </div>

      {/* Sub-view 1: Multispectral Pitch NDVI & Turf Agronomy */}
      {activeSubTab === 'pitch-ndvi' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Facility Selector & Ag Telemetry */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Global Facility Earth Observation
              </h3>
              <div className="space-y-2">
                {facilities.map((fac) => {
                  const isSelected = fac.id === selectedFacilityId;
                  return (
                    <button
                      key={fac.id}
                      onClick={() => setSelectedFacilityId(fac.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-all ${
                        isSelected
                          ? 'bg-slate-800 border-emerald-500/50 text-white'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <span className="text-slate-400">{fac.location}</span>
                        <span className="text-emerald-400">NDVI {fac.meanNdvi}</span>
                      </div>
                      <div className="text-xs font-semibold text-slate-200">{fac.name}</div>
                      <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                        <span>{fac.pitchType}</span>
                        <span className="text-slate-400">{fac.healthStatus}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Agronomy Metrics */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                <span>Biophysical Turf Telemetry</span>
                <span className="text-emerald-400 font-mono text-[11px]">Sentinel-2 Multispectral</span>
              </h3>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[11px]">Mean NDVI Index</span>
                  <span className="text-sm font-bold text-emerald-400 tabular-nums">{currentFacility.meanNdvi}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Optimum: &gt;0.78</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[11px]">Moisture (NDWI)</span>
                  <span className="text-sm font-bold text-cyan-400 tabular-nums">{currentFacility.ndwiMoisture}</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Optimum: 0.55-0.65</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[11px]">Clegg Impact (Hardness)</span>
                  <span className="text-sm font-bold text-white tabular-nums">{currentFacility.cleggHardnessG} G</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">FIFA Safe: 70-95 G</span>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800/80">
                  <span className="text-slate-500 block text-[11px]">Root Depth Profile</span>
                  <span className="text-sm font-bold text-white tabular-nums">{currentFacility.rootDepthMm} mm</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Shear: 38 Nm</span>
                </div>
              </div>

              {/* Automated Irrigation & Aeration Trigger */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 mb-2 flex items-center justify-between">
                  <span>Deficit Irrigation Required:</span>
                  <span className="font-mono text-emerald-400 font-bold">{currentFacility.irrigationNeededLiters.toLocaleString()} L</span>
                </div>
                <button
                  onClick={handleTriggerIrrigation}
                  disabled={irrigationTriggered}
                  className="w-full py-2 px-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-75"
                >
                  {irrigationTriggered ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Sub-Surface Irrigation Initiated</span>
                    </>
                  ) : (
                    <>
                      <Droplets className="w-3.5 h-3.5" />
                      <span>Trigger Smart Hydration Cycle</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right: NDVI Raster Canvas & Heatmap Analysis */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{currentFacility.name}</span>
                    <span className="text-xs font-normal text-slate-400">({currentFacility.coordinates})</span>
                  </h3>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    <span>Satellite Orbit Pass: {currentFacility.lastSentinelPass}</span>
                  </div>
                </div>

                {/* Layer selector */}
                <div className="flex items-center gap-1.5 text-xs bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveLayer('ndvi')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeLayer === 'ndvi' ? 'bg-emerald-700 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    NDVI Vegetation
                  </button>
                  <button
                    onClick={() => setActiveLayer('moisture')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeLayer === 'moisture' ? 'bg-cyan-700 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    NDWI Moisture
                  </button>
                  <button
                    onClick={() => setActiveLayer('compaction')}
                    className={`px-2.5 py-1 rounded transition-colors ${
                      activeLayer === 'compaction' ? 'bg-amber-700 text-white font-medium' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Soil Compaction
                  </button>
                </div>
              </div>

              {/* NDVI False-Color Raster Heatmap SVG */}
              <div className="relative aspect-[16/10] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-inner p-2">
                <svg viewBox="0 0 100 65" className="w-full h-full select-none">
                  <defs>
                    <linearGradient id="ndviGradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#047857" />
                      <stop offset="35%" stopColor="#10b981" />
                      <stop offset="70%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#065f46" />
                    </linearGradient>

                    <radialGradient id="wearGoalLeft" cx="12%" cy="50%" r="14%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="wearGoalRight" cx="88%" cy="50%" r="14%">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                      <stop offset="60%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#047857" stopOpacity="0" />
                    </radialGradient>

                    <radialGradient id="centralWear" cx="50%" cy="50%" r="10%">
                      <stop offset="0%" stopColor="#eab308" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Pitch Base Fill */}
                  <rect x="2" y="2" width="96" height="61" fill="url(#ndviGradient)" rx="1" />

                  {/* Wear and Stress Hotspots detected by Earth Observation */}
                  <rect x="2" y="2" width="96" height="61" fill="url(#wearGoalLeft)" />
                  <rect x="2" y="2" width="96" height="61" fill="url(#wearGoalRight)" />
                  <rect x="2" y="2" width="96" height="61" fill="url(#centralWear)" />

                  {/* Pitch Geometry Hairlines */}
                  <rect x="2" y="2" width="96" height="61" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />
                  <line x1="50" y1="2" x2="50" y2="63" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />
                  <circle cx="50" cy="32.5" r="9.15" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />
                  <circle cx="50" cy="32.5" r="0.6" fill="#ffffff" />

                  <rect x="2" y="14" width="16.5" height="37" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />
                  <rect x="2" y="23" width="5.5" height="19" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />
                  
                  <rect x="81.5" y="14" width="16.5" height="37" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />
                  <rect x="92.5" y="23" width="5.5" height="19" fill="none" stroke="#ffffff" strokeWidth="0.4" strokeOpacity="0.75" />

                  {/* Anomaly markers */}
                  <circle cx="8" cy="32.5" r="3.2" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="0.8,0.8" />
                  <text x="8" y="27" fill="#fecaca" fontSize="2" className="font-mono" textAnchor="middle">Goalmouth Wear: NDVI 0.52</text>

                  <circle cx="92" cy="32.5" r="3.2" fill="none" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="0.8,0.8" />
                  <text x="92" y="27" fill="#fecaca" fontSize="2" className="font-mono" textAnchor="middle">Goalmouth Wear: NDVI 0.54</text>
                </svg>

                {/* Color Legend Bar */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-950/90 backdrop-blur border border-slate-800 px-3 py-1.5 rounded flex items-center justify-between text-[11px] font-mono">
                  <span className="text-amber-400">0.40 Severe Wear</span>
                  <div className="h-2 flex-1 mx-4 rounded-full bg-gradient-to-r from-amber-500 via-emerald-400 to-emerald-800"></div>
                  <span className="text-emerald-400">0.95 Dense Vigorous Root</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 2: Sub-10cm GNSS Precision Telemetry */}
      {activeSubTab === 'gnss' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-white">Dual-Constellation GNSS Lock Matrix (Galileo + GPS L5)</h3>
                <p className="text-xs text-slate-400">Real-time RTK carrier-phase positioning delivering sub-10cm athlete positioning accuracy.</p>
              </div>
              <div className="text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 px-2.5 py-1 rounded">
                Fix: RTK Centimeter Fixed
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Constellation</th>
                    <th className="py-2.5 px-3">PRN ID</th>
                    <th className="py-2.5 px-3">Band</th>
                    <th className="py-2.5 px-3 text-right">Elevation</th>
                    <th className="py-2.5 px-3 text-right">Azimuth</th>
                    <th className="py-2.5 px-3 text-right">Carrier SNR</th>
                    <th className="py-2.5 px-3">Tracking State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {satellites.map((sat) => (
                    <tr key={sat.id} className="hover:bg-slate-800/30">
                      <td className="py-2.5 px-3 text-slate-200">{sat.constellation}</td>
                      <td className="py-2.5 px-3 text-emerald-400">#{sat.prn}</td>
                      <td className="py-2.5 px-3 text-slate-300">{sat.carrierBand}</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">{sat.elevationDeg}°</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-slate-300">{sat.azimuthDeg}°</td>
                      <td className="py-2.5 px-3 text-right tabular-nums text-emerald-400 font-bold">{sat.snrDbHz} dB-Hz</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          sat.status === 'Locked' ? 'bg-emerald-950 text-emerald-300' : 'bg-amber-950 text-amber-300'
                        }`}>
                          {sat.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Precision Dilution of Precision (DOP)
              </h4>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between p-2 bg-slate-950 rounded">
                  <span className="text-slate-400">Positional DOP (PDOP):</span>
                  <span className="text-emerald-400 font-bold">0.82 (Ideal &lt;1.0)</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded">
                  <span className="text-slate-400">Horizontal DOP (HDOP):</span>
                  <span className="text-emerald-400 font-bold">0.51</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded">
                  <span className="text-slate-400">Vertical DOP (VDOP):</span>
                  <span className="text-emerald-400 font-bold">0.64</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-950 rounded">
                  <span className="text-slate-400">Carrier Drift Error:</span>
                  <span className="text-slate-200">± 4.2 cm / 90 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 3: Micro-Weather & Pitch Friction */}
      {activeSubTab === 'weather' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Thermometer className="w-4 h-4 text-emerald-400" />
              <span>Wet Bulb Globe Temperature (WBGT)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">21.4° C</div>
            <div className="text-xs text-slate-400">
              Category: <span className="text-emerald-400 font-medium">Nominal Heat Index</span>. FIFA cooling breaks not required.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Wind className="w-4 h-4 text-cyan-400" />
              <span>Surface Level Wind Shear</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">12.6 km/h</div>
            <div className="text-xs text-slate-400">
              Vector: <span className="text-cyan-400 font-medium">SSW (210°)</span>. Aerodynamic cross-sway minimal for set-pieces.
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Gauge className="w-4 h-4 text-amber-400" />
              <span>Pitch Ball Slickness & Bounce ($C_R$)</span>
            </div>
            <div className="text-2xl font-bold font-mono text-white">0.74 Coefficient</div>
            <div className="text-xs text-slate-400">
              Fast slick surface. High pass velocity tempo favorable for possession squad.
            </div>
          </div>
        </div>
      )}

      {/* Sub-view 4: Logistics & Cold-Chain */}
      {activeSubTab === 'logistics' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Global Team Travel & Cold-Chain Satellite Tracker</h3>
              <p className="text-xs text-slate-400">Satellite-monitored equipment containers, recovery cryo units, and medical nutrition integrity.</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Plane className="w-4 h-4 inline" /> Flight B777-Charter #MC402 En Route
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Recovery Cryo Chamber Pod</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">-112.4° C Nominal</span>
              <span className="text-slate-400 text-[10px] mt-1 block">GPS: 48.8566° N, 2.3522° E (Altitude 34,000 ft)</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[11px]">Platelet & Biologics Cold-Chain</span>
              <span className="text-base font-bold text-emerald-400 mt-1 block">+3.8° C Constant</span>
              <span className="text-slate-400 text-[10px] mt-1 block">Battery Reserve: 98% (42h margin)</span>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-slate-500 block text-[11px]">High-Res Stadium Gate Footfall</span>
              <span className="text-base font-bold text-cyan-400 mt-1 block">Turnstile Flow: 840 / min</span>
              <span className="text-slate-400 text-[10px] mt-1 block">Zero bottleneck queue detected at North Concourse</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
