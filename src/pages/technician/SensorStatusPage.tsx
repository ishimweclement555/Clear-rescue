import React, { useState } from 'react';
import { Sliders, CheckCircle2, AlertTriangle, Search, Filter } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const SensorStatusPage: React.FC = () => {
  const { sensors, devices } = useEmergency();
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  const filteredSensors = sensors.filter(s => {
    if (filterStatus === 'ALL') return true;
    return s.status === filterStatus;
  });

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Sliders className="w-6 h-6 text-amber-400" />
            <span>Sensor Fleet Calibration &amp; Health Status</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Overview of all connected sensors across Kigali, Masaka, and Musanze facilities.
          </p>
        </div>

        {/* Filter */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterStatus === 'ALL' ? 'bg-amber-600 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            All Sensors ({sensors.length})
          </button>
          <button
            onClick={() => setFilterStatus('NORMAL')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterStatus === 'NORMAL'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-900 text-emerald-400 border border-slate-800'
            }`}
          >
            Nominal ({sensors.filter(s => s.status === 'NORMAL').length})
          </button>
          <button
            onClick={() => setFilterStatus('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterStatus === 'WARNING'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-amber-400 border border-slate-800'
            }`}
          >
            Warning ({sensors.filter(s => s.status === 'WARNING').length})
          </button>
          <button
            onClick={() => setFilterStatus('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterStatus === 'CRITICAL'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-red-400 border border-slate-800'
            }`}
          >
            Critical ({sensors.filter(s => s.status === 'CRITICAL').length})
          </button>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px]">
                  <th className="py-3 px-4">Sensor Code</th>
                  <th className="py-3 px-4">Sensor Type</th>
                  <th className="py-3 px-4">Location &amp; Device</th>
                  <th className="py-3 px-4">Latest Reading</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Warning Limit</th>
                  <th className="py-3 px-4">Critical Limit</th>
                  <th className="py-3 px-4">Calibration</th>
                  <th className="py-3 px-4">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredSensors.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-orange-400">{s.sensorCode}</td>
                    <td className="py-3 px-4 font-bold text-white">{s.sensorType}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {s.locationName} <span className="font-mono text-slate-500 text-[10px]">({s.deviceCode})</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 text-sm">
                      {s.lastReading} <span className="text-slate-500 font-sans text-xs">{s.unit}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          s.status === 'CRITICAL'
                            ? 'bg-red-500 text-white animate-pulse'
                            : s.status === 'WARNING'
                            ? 'bg-amber-500 text-black'
                            : 'bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-400">{s.warningThreshold}</td>
                    <td className="py-3 px-4 font-mono text-red-400">{s.criticalThreshold}</td>
                    <td className="py-3 px-4">
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                        {s.calibrationStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {new Date(s.lastUpdated).toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
