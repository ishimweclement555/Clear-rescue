import React from 'react';
import {
  ShieldAlert,
  Flame,
  Wind,
  Thermometer,
  Fuel,
  Droplets,
  DoorOpen,
  Eye,
  Mic,
  Battery,
  Wifi,
  CloudRain,
  Gauge,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Radio,
  Building2,
  Cpu,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { SensorType } from '../../types';

interface CustomerDashboardProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  setCurrentTab,
  openSimulator,
}) => {
  const {
    devices,
    sensors,
    incidents,
    activeEmergency,
    selectedDeviceId,
    setSelectedDeviceId,
  } = useEmergency();
  const { user } = useAuth();

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const deviceSensors = sensors.filter(s => s.deviceId === selectedDevice?.id);

  // Top Statistics Calculations
  const onlineDevicesCount = devices.filter(d => d.status === 'online').length;
  const offlineDevicesCount = devices.filter(d => d.status === 'offline').length;
  const activeAlertsCount = incidents.filter(
    i => (i.severity === 'CRITICAL' || i.severity === 'WARNING') && (i.status === 'OPEN' || i.status === 'INVESTIGATING')
  ).length;
  const todaysIncidentsCount = incidents.filter(
    i => new Date(i.createdTime).toDateString() === new Date().toDateString()
  ).length;
  const nominalSensorsCount = sensors.filter(s => s.status === 'NORMAL').length;
  const sensorHealthPercent = sensors.length > 0 ? Math.round((nominalSensorsCount / sensors.length) * 100) : 100;
  const avgBattery = Math.round(
    devices.reduce((acc, d) => acc + (d.batteryLevel || 100), 0) / (devices.length || 1)
  );

  // Live System Status (Requirement 5: GREEN: Normal, YELLOW: Warning, RED: Emergency)
  let systemStatus: 'GREEN' | 'YELLOW' | 'RED' = 'GREEN';
  let statusText = 'Normal & Nominal';
  let statusSubtext = 'All monitored zones and connected sensors reporting safe parameters.';

  if (activeEmergency?.severity === 'CRITICAL' || devices.some(d => d.status === 'emergency')) {
    systemStatus = 'RED';
    statusText = 'Emergency Alarm Active';
    statusSubtext = 'Correlated critical anomaly detected. Immediate verification required.';
  } else if (activeEmergency?.severity === 'WARNING' || devices.some(d => d.status === 'warning') || offlineDevicesCount > 0) {
    systemStatus = 'YELLOW';
    statusText = 'Warning / Pre-Incident State';
    statusSubtext = 'Elevated sensor measurements or offline node detected.';
  }

  const getSensorIcon = (type: SensorType) => {
    switch (type) {
      case 'FIRE':
        return <Flame className="w-5 h-5 text-red-500" />;
      case 'SMOKE':
        return <Wind className="w-5 h-5 text-amber-400" />;
      case 'TEMPERATURE':
        return <Thermometer className="w-5 h-5 text-orange-400" />;
      case 'GAS':
        return <Fuel className="w-5 h-5 text-amber-500" />;
      case 'WATER':
        return <Droplets className="w-5 h-5 text-blue-400" />;
      case 'DOOR':
        return <DoorOpen className="w-5 h-5 text-purple-400" />;
      case 'MOTION':
        return <Eye className="w-5 h-5 text-indigo-400" />;
      case 'SOUND':
        return <Mic className="w-5 h-5 text-pink-400" />;
      case 'HUMIDITY':
        return <CloudRain className="w-5 h-5 text-teal-400" />;
      case 'AIR_QUALITY':
        return <Gauge className="w-5 h-5 text-emerald-400" />;
      case 'BATTERY':
        return <Battery className="w-5 h-5 text-amber-400" />;
      case 'CONNECTIVITY':
        return <Wifi className="w-5 h-5 text-blue-400" />;
      default:
        return <Activity className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* Dashboard Sub-header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">Facility Operations Command</h1>
              <span className="text-xs bg-orange-600/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded font-semibold">
                Customer View
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Organization: <strong className="text-white">{user?.organizationName || 'Kigali Holdings Ltd'}</strong> &bull; Regional Safety Fleet
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSimulator}
              className="px-3 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md shadow-orange-950/40 flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Sensor Simulator</span>
            </button>
            <button
              onClick={() => setCurrentTab('customer-devices')}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>Manage Devices ({devices.length})</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Top Statistics Bar (Requirement 5) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Devices Online */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Devices Online</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{onlineDevicesCount}</span>
              <span className="text-xs text-slate-500">/ {devices.length}</span>
            </div>
            <span className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Telemetry Active
            </span>
          </div>

          {/* Devices Offline */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Devices Offline</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black ${offlineDevicesCount > 0 ? 'text-red-400' : 'text-slate-300'}`}>
                {offlineDevicesCount}
              </span>
              <span className="text-xs text-slate-500">units</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {offlineDevicesCount === 0 ? 'Zero connectivity loss' : 'Attention needed'}
            </span>
          </div>

          {/* Active Alerts */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Alerts</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-black ${activeAlertsCount > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                {activeAlertsCount}
              </span>
              <span className="text-xs text-slate-500">open</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {activeAlertsCount > 0 ? 'Action required in field' : 'No open emergencies'}
            </span>
          </div>

          {/* Today's Incidents */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Today&apos;s Incidents</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{todaysIncidentsCount}</span>
              <span className="text-xs text-slate-500">logged</span>
            </div>
            <button
              onClick={() => setCurrentTab('customer-incidents')}
              className="text-[10px] text-orange-400 hover:text-orange-300 mt-1 block text-left"
            >
              View incident log &rarr;
            </button>
          </div>

          {/* Sensor Health */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Sensor Health</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{sensorHealthPercent}%</span>
              <span className="text-xs text-slate-500">nominal</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {nominalSensorsCount} of {sensors.length} calibrated
            </span>
          </div>

          {/* Battery Status */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Fleet Battery</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{avgBattery}%</span>
              <span className="text-xs text-emerald-400">avg</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              LiPo power reserves OK
            </span>
          </div>
        </div>

        {/* Live System Status Banner (GREEN / YELLOW / RED) */}
        <div
          className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
            systemStatus === 'RED'
              ? 'bg-red-950/60 border-red-600 shadow-red-950/50'
              : systemStatus === 'YELLOW'
              ? 'bg-amber-950/40 border-amber-600 shadow-amber-950/40'
              : 'bg-emerald-950/30 border-emerald-600/50 shadow-emerald-950/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                systemStatus === 'RED'
                  ? 'bg-red-600 animate-pulse'
                  : systemStatus === 'YELLOW'
                  ? 'bg-amber-600'
                  : 'bg-emerald-600'
              }`}
            >
              {systemStatus === 'RED' ? (
                <ShieldAlert className="w-7 h-7" />
              ) : systemStatus === 'YELLOW' ? (
                <AlertTriangle className="w-7 h-7" />
              ) : (
                <CheckCircle2 className="w-7 h-7" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Platform Readiness Status:
                </span>
                <span
                  className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    systemStatus === 'RED'
                      ? 'bg-red-500 text-white'
                      : systemStatus === 'YELLOW'
                      ? 'bg-amber-500 text-black'
                      : 'bg-emerald-500 text-white'
                  }`}
                >
                  {systemStatus}: {statusText}
                </span>
              </div>
              <p className="text-xs text-slate-200 mt-1 font-medium">{statusSubtext}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {systemStatus !== 'GREEN' && (
              <button
                onClick={() => setCurrentTab('customer-alerts')}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg"
              >
                Inspect Alert Details &rarr;
              </button>
            )}
            <button
              onClick={openSimulator}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-semibold cursor-pointer"
            >
              Simulate Test Event
            </button>
          </div>
        </div>

        {/* Selected Device Context Bar */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-orange-600/20 text-orange-400 border border-orange-500/30">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Active Device View:</span>
              <select
                value={selectedDeviceId}
                onChange={e => setSelectedDeviceId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white font-bold text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.deviceCode} — {d.name} ({d.locationName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Location</span>
              <span className="font-semibold text-white">{selectedDevice?.locationName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Cellular / Wi-Fi</span>
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {selectedDevice?.connectionType}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Battery</span>
              <span className="font-semibold text-white">{selectedDevice?.batteryLevel}%</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Firmware</span>
              <span className="font-mono text-slate-400">{selectedDevice?.firmwareVersion}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase">Last Heartbeat</span>
              <span className="font-mono text-slate-300 text-[11px]">
                {new Date(selectedDevice?.lastSeen || '').toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>

        {/* 12 SENSOR CARDS SECTION (Requirement 5) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                <span>Live Environmental Sensor Matrix</span>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono font-normal">
                  {deviceSensors.length} Channels Monitored
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Live readings for {selectedDevice?.deviceCode}. Thresholds are calibrated for {selectedDevice?.locationName}.
              </p>
            </div>
            <button
              onClick={() => setCurrentTab('customer-live-sensors')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              Full Screen Sensor View &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {deviceSensors.map(sensor => {
              const isWarning = sensor.status === 'WARNING';
              const isCritical = sensor.status === 'CRITICAL';

              return (
                <div
                  key={sensor.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    isCritical
                      ? 'bg-red-950/40 border-red-600 shadow-lg shadow-red-950/40'
                      : isWarning
                      ? 'bg-amber-950/30 border-amber-600/70 shadow-lg shadow-amber-950/30'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Card Header: Icon, Type, Status Pill */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-slate-800/80">{getSensorIcon(sensor.sensorType)}</div>
                      <div>
                        <h4 className="text-xs font-bold text-white tracking-wide">{sensor.sensorType}</h4>
                        <span className="text-[10px] text-slate-400 block">{sensor.measurement}</span>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isCritical
                          ? 'bg-red-500 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-500 text-black'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {sensor.status}
                    </span>
                  </div>

                  {/* Reading Display */}
                  <div className="my-2">
                    <div className="flex items-baseline gap-1.5">
                      <span
                        className={`text-3xl font-black font-mono tracking-tight ${
                          isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-white'
                        }`}
                      >
                        {sensor.lastReading}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{sensor.unit}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Nominal: {sensor.normalRangeText || `< ${sensor.warningThreshold}`}
                    </span>
                  </div>

                  {/* Card Footer: Metadata (Sensor ID, Device ID, Last Updated) */}
                  <div className="pt-3 border-t border-slate-800/80 text-[10px] text-slate-400 space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Sensor ID:</span>
                      <span className="font-mono text-slate-300">{sensor.sensorCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Device ID:</span>
                      <span className="font-mono text-slate-300">{selectedDevice?.deviceCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Updated:</span>
                      <span className="font-mono text-slate-300">
                        {new Date(sensor.lastUpdated).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Incidents Quick Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white">Recent Incident Tracking</h3>
              <p className="text-xs text-slate-400">Active and resolved events for your facility fleet</p>
            </div>
            <button
              onClick={() => setCurrentTab('customer-incidents')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              View Full Incident Archive &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3">Incident Code</th>
                  <th className="pb-3">Event Type</th>
                  <th className="pb-3">Location &amp; Device</th>
                  <th className="pb-3">Severity</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time Detected</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {incidents.slice(0, 5).map(inc => (
                  <tr key={inc.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-white">{inc.incidentCode}</td>
                    <td className="py-3 text-slate-200">{inc.eventType}</td>
                    <td className="py-3 text-slate-400">
                      {inc.locationName} <span className="font-mono text-slate-500">({inc.deviceCode})</span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.severity === 'CRITICAL'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : inc.severity === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {inc.severity}
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inc.status === 'OPEN'
                            ? 'bg-red-500 text-white animate-pulse'
                            : inc.status === 'ACKNOWLEDGED'
                            ? 'bg-amber-500 text-black'
                            : inc.status === 'INVESTIGATING'
                            ? 'bg-blue-500 text-white'
                            : inc.status === 'RESOLVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400 font-mono text-[11px]">
                      {new Date(inc.createdTime).toLocaleTimeString()} ({new Date(inc.createdTime).toLocaleDateString()})
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
