import React, { useState } from 'react';
import {
  ArrowLeft,
  Cpu,
  Battery,
  Wifi,
  MapPin,
  Clock,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Wind,
  Thermometer,
  Fuel,
  Droplets,
  DoorOpen,
  Eye,
  Mic,
  CloudRain,
  Gauge,
  Radio,
  Edit2,
  Save,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { SensorType } from '../../types';

interface DeviceDetailProps {
  deviceId: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const DeviceDetailPage: React.FC<DeviceDetailProps> = ({
  deviceId,
  setCurrentTab,
  openSimulator,
}) => {
  const { devices, sensors, updateSensorThreshold, updateDevice } = useEmergency();
  const device = devices.find(d => d.id === deviceId) || devices[0];
  const deviceSensors = sensors.filter(s => s.deviceId === device?.id);

  const [editingSensorId, setEditingSensorId] = useState<string | null>(null);
  const [warningInput, setWarningInput] = useState<number>(0);
  const [criticalInput, setCriticalInput] = useState<number>(0);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!device) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Device not found.</p>
        <button
          onClick={() => setCurrentTab('customer-devices')}
          className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs"
        >
          Return to Devices
        </button>
      </div>
    );
  }

  const handleStartEdit = (sensorId: string, currentWarn: number, currentCrit: number) => {
    setEditingSensorId(sensorId);
    setWarningInput(currentWarn);
    setCriticalInput(currentCrit);
  };

  const handleSaveThreshold = (sensorId: string) => {
    updateSensorThreshold(sensorId, warningInput, criticalInput);
    setEditingSensorId(null);
    setSuccessMsg('Sensor calibration threshold updated in database.');
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('customer-devices')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-orange-400 bg-orange-950/60 border border-orange-600/40 px-2 py-0.5 rounded">
                  {device.deviceCode}
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white">{device.name}</h1>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Location: <strong className="text-slate-300">{device.locationName}</strong> &bull; Hardware ID: {device.id}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSimulator}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Simulate Telemetry</span>
            </button>
          </div>
        </div>

        {/* Status notification */}
        {successMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Vitals Overview Card */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Operating Status</span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  device.status === 'online' ? 'bg-emerald-400' : 'bg-red-400 animate-ping'
                }`}
              />
              <span className="text-base font-extrabold uppercase text-white">{device.status}</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Internal LiPo Battery</span>
            <div className="flex items-center gap-2 mt-1">
              <Battery className="w-5 h-5 text-emerald-400" />
              <span className="text-base font-extrabold text-white">{device.batteryLevel}%</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Network Link</span>
            <div className="flex items-center gap-2 mt-1">
              <Wifi className="w-5 h-5 text-blue-400" />
              <span className="text-base font-extrabold text-white">{device.connectionType} LTE</span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Firmware Version</span>
            <div className="flex items-center gap-2 mt-1">
              <Cpu className="w-5 h-5 text-orange-400" />
              <span className="text-base font-extrabold font-mono text-white">{device.firmwareVersion}</span>
            </div>
          </div>
        </div>

        {/* Sensor Channels & Calibrations Table (Requirement 8) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>Configured Sensor Channels &amp; Thresholds</span>
              </h3>
              <p className="text-xs text-slate-400">
                Warning and Critical safety limits can be calibrated per room volume and environmental standards.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3">Sensor Type</th>
                  <th className="pb-3">Channel Code</th>
                  <th className="pb-3">Current Reading</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Warning Limit</th>
                  <th className="pb-3">Critical Limit</th>
                  <th className="pb-3">Calibration</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {deviceSensors.map(s => {
                  const isEditing = editingSensorId === s.id;

                  return (
                    <tr key={s.id} className="hover:bg-slate-800/40">
                      <td className="py-3 text-white font-bold">{s.sensorType}</td>
                      <td className="py-3 font-mono text-slate-400 text-[11px]">{s.sensorCode}</td>
                      <td className="py-3">
                        <span className="font-mono font-bold text-white text-sm">{s.lastReading}</span>{' '}
                        <span className="text-slate-500">{s.unit}</span>
                      </td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
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
                      <td className="py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            value={warningInput}
                            onChange={e => setWarningInput(parseFloat(e.target.value))}
                            className="w-20 bg-slate-950 border border-orange-500 rounded px-1.5 py-0.5 text-white font-mono text-xs"
                          />
                        ) : (
                          <span className="font-mono text-amber-400 font-semibold">{s.warningThreshold}</span>
                        )}
                      </td>
                      <td className="py-3">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.1"
                            value={criticalInput}
                            onChange={e => setCriticalInput(parseFloat(e.target.value))}
                            className="w-20 bg-slate-950 border border-red-500 rounded px-1.5 py-0.5 text-white font-mono text-xs"
                          />
                        ) : (
                          <span className="font-mono text-red-400 font-semibold">{s.criticalThreshold}</span>
                        )}
                      </td>
                      <td className="py-3">
                        <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                          {s.calibrationStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isEditing ? (
                          <button
                            onClick={() => handleSaveThreshold(s.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Save className="w-3 h-3" />
                            <span>Save</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEdit(s.id, s.warningThreshold, s.criticalThreshold)}
                            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>Calibrate</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
