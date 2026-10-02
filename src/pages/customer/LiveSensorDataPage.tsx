import React, { useState } from 'react';
import { Activity, Radio, Cpu, RefreshCw, Filter, Sliders, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { SensorType } from '../../types';

interface LiveSensorDataProps {
  openSimulator: () => void;
}

export const LiveSensorDataPage: React.FC<LiveSensorDataProps> = ({ openSimulator }) => {
  const { sensors, devices, selectedDeviceId, setSelectedDeviceId } = useEmergency();
  const [filterType, setFilterType] = useState<string>('ALL');

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const deviceSensors = sensors.filter(s => s.deviceId === selectedDevice?.id);

  const filteredSensors = deviceSensors.filter(s => {
    if (filterType === 'ALL') return true;
    if (filterType === 'ABNORMAL') return s.status === 'WARNING' || s.status === 'CRITICAL';
    return s.sensorType === filterType;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              <span>Live Sensor Telemetry Bus</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Real-time multi-channel environmental data streaming from IoT hardware units.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSimulator}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Inject Simulated Data</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Device:</span>
            <select
              value={selectedDeviceId}
              onChange={e => setSelectedDeviceId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500"
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>
                  {d.deviceCode} — {d.name} ({d.locationName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Filter className="w-4 h-4 text-slate-500" />
            <span className="text-slate-400">Filter View:</span>
            <button
              onClick={() => setFilterType('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filterType === 'ALL' ? 'bg-orange-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              All (12)
            </button>
            <button
              onClick={() => setFilterType('ABNORMAL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                filterType === 'ABNORMAL' ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'
              }`}
            >
              Abnormal / Alerts
            </button>
          </div>
        </div>

        {/* Grid of Live Gauges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSensors.map(sensor => {
            const isWarning = sensor.status === 'WARNING';
            const isCritical = sensor.status === 'CRITICAL';

            // Calculate percentage gauge against critical threshold
            const maxRef = Math.max(sensor.criticalThreshold * 1.25, sensor.lastReading * 1.1, 10);
            const gaugePercent = Math.min(100, Math.max(0, (sensor.lastReading / maxRef) * 100));

            return (
              <div
                key={sensor.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isCritical
                    ? 'bg-red-950/40 border-red-500 shadow-xl'
                    : isWarning
                    ? 'bg-amber-950/30 border-amber-500 shadow-xl'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-extrabold uppercase tracking-wide text-white">
                    {sensor.sensorType}
                  </span>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      isCritical
                        ? 'bg-red-500 text-white animate-pulse'
                        : isWarning
                        ? 'bg-amber-500 text-black'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {sensor.status}
                  </span>
                </div>

                <div className="my-3 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className={`text-4xl font-black font-mono ${
                        isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-emerald-400'
                      }`}
                    >
                      {sensor.lastReading}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{sensor.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Warning &gt; {sensor.warningThreshold}
                  </span>
                </div>

                {/* Visual Progress Gauge */}
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 my-2">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${gaugePercent}%` }}
                  />
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 flex justify-between">
                  <span>Channel: {sensor.sensorCode}</span>
                  <span className="font-mono">{new Date(sensor.lastUpdated).toLocaleTimeString()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
