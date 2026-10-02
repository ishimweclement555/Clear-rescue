import React, { useState } from 'react';
import {
  Cpu,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Battery,
  Wifi,
  MapPin,
  Clock,
  ShieldCheck,
  Radio,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { Device, ConnectionType } from '../../types';

interface CustomerDevicesProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  onSelectDeviceForDetails: (deviceId: string) => void;
}

export const CustomerDevicesPage: React.FC<CustomerDevicesProps> = ({
  setCurrentTab,
  openSimulator,
  onSelectDeviceForDetails,
}) => {
  const { devices, addDevice, deleteDevice, locations, setSelectedDeviceId } = useEmergency();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDeviceCode, setNewDeviceCode] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newLocationId, setNewLocationId] = useState(locations[0]?.id || 'loc-kigali-hq');
  const [newConnType, setNewConnType] = useState<ConnectionType>('4G');

  const handleAddDeviceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loc = locations.find(l => l.id === newLocationId);
    addDevice({
      deviceCode: newDeviceCode || `CRA-${Math.floor(Math.random() * 900 + 100)}`,
      name: newDeviceName || 'Facility Monitoring Unit',
      locationId: newLocationId,
      locationName: loc?.name || 'Kigali Facility',
      connectionType: newConnType,
    });
    setShowAddModal(false);
    setNewDeviceCode('');
    setNewDeviceName('');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-blue-400" />
              <span>Monitoring Hardware Units</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Registered CLEAR RESCUE AI hardware units, battery levels, 4G links, and connected sensors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-950/40 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Device</span>
            </button>
            <button
              onClick={openSimulator}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>Test with Simulator</span>
            </button>
          </div>
        </div>

        {/* Devices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(device => {
            const isEmergency = device.status === 'emergency';
            const isWarning = device.status === 'warning';
            const isOffline = device.status === 'offline';

            return (
              <div
                key={device.id}
                className={`p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                  isEmergency
                    ? 'bg-red-950/40 border-red-500 shadow-xl shadow-red-950/40'
                    : isWarning
                    ? 'bg-amber-950/30 border-amber-500/70 shadow-xl shadow-amber-950/30'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  {/* Top Bar: Code, Name, Status Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <span className="font-mono text-xs font-black text-orange-400 tracking-wider">
                        {device.deviceCode}
                      </span>
                      <h3 className="text-base font-extrabold text-white mt-0.5">{device.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isEmergency
                          ? 'bg-red-500 text-white animate-pulse'
                          : isWarning
                          ? 'bg-amber-500 text-black'
                          : isOffline
                          ? 'bg-slate-700 text-slate-300'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {device.status}
                    </span>
                  </div>

                  {/* Location Info */}
                  <div className="flex items-center gap-2 text-xs text-slate-300 mb-4 bg-slate-950/50 p-2 rounded-lg border border-slate-800/80">
                    <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                    <span className="truncate">{device.locationName}</span>
                  </div>

                  {/* Specs & Vital Metrics (Requirement 6) */}
                  <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase">Backup Battery</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Battery
                          className={`w-4 h-4 ${
                            device.batteryLevel < 20 ? 'text-red-400' : 'text-emerald-400'
                          }`}
                        />
                        <span className="font-bold text-white">{device.batteryLevel}%</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase">Network Connection</span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Wifi className="w-4 h-4 text-blue-400" />
                        <span className="font-bold text-white">{device.connectionType}</span>
                      </div>
                    </div>

                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase">Firmware</span>
                      <span className="font-mono text-slate-300 font-semibold block mt-0.5">
                        {device.firmwareVersion}
                      </span>
                    </div>

                    <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      <span className="text-[10px] text-slate-500 block uppercase">Sensors Connected</span>
                      <span className="font-bold text-white block mt-0.5">
                        {device.sensorsCount || 12} Channels
                      </span>
                    </div>
                  </div>

                  {/* Last Communication Time */}
                  <div className="text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" /> Last Seen:
                    </span>
                    <span className="font-mono text-slate-300">
                      {new Date(device.lastSeen).toLocaleTimeString()} ({new Date(device.lastSeen).toLocaleDateString()})
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setSelectedDeviceId(device.id);
                      onSelectDeviceForDetails(device.id);
                      setCurrentTab('customer-device-detail');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Sensors &amp; Diagnostics</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteDevice(device.id)}
                    className="p-2 rounded-xl bg-slate-800/50 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-transparent hover:border-red-500/30 transition-colors cursor-pointer"
                    title="Remove Device"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Device Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-orange-400" />
                  <span>Provision New Monitoring Unit</span>
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleAddDeviceSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Device Serial Code *</label>
                  <input
                    type="text"
                    required
                    value={newDeviceCode}
                    onChange={e => setNewDeviceCode(e.target.value)}
                    placeholder="e.g. CRA-005"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Device Name / Room Description *</label>
                  <input
                    type="text"
                    required
                    value={newDeviceName}
                    onChange={e => setNewDeviceName(e.target.value)}
                    placeholder="e.g. Chemical Storage Vault - East Wing"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Assigned Location *</label>
                  <select
                    value={newLocationId}
                    onChange={e => setNewLocationId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.id}>
                        {loc.name} ({loc.district}, {loc.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Primary Communication Link</label>
                  <select
                    value={newConnType}
                    onChange={e => setNewConnType(e.target.value as ConnectionType)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                  >
                    <option value="4G">Cellular 4G LTE (MTN / Airtel SIM)</option>
                    <option value="WiFi">Campus Wi-Fi 2.4GHz</option>
                    <option value="Ethernet">Hardwired Industrial Ethernet</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold shadow-lg shadow-orange-950/40"
                  >
                    Provision Unit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
