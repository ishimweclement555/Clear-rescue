import React from 'react';
import { Cpu, Battery, Wifi, MapPin, Clock, Wrench } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

interface AssignedDevicesProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const AssignedDevicesPage: React.FC<AssignedDevicesProps> = ({ setCurrentTab }) => {
  const { devices, setSelectedDeviceId } = useEmergency();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-amber-400" />
            <span>Assigned Field Hardware Units</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Hardware units requiring scheduled preventative calibration, battery testing, or antenna realignment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map(d => (
            <div key={d.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-orange-400">{d.deviceCode}</span>
                  <h3 className="text-base font-bold text-white mt-0.5">{d.name}</h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-400" /> {d.locationName}
                  </p>
                </div>
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {d.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">LiPo Battery</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Battery className="w-3.5 h-3.5 text-emerald-400" /> {d.batteryLevel}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Carrier</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Wifi className="w-3.5 h-3.5 text-blue-400" /> {d.connectionType} LTE
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Firmware</span>
                  <span className="font-mono text-slate-300">{d.firmwareVersion}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Sensors</span>
                  <span className="text-slate-300 font-semibold">12 Channels</span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-xs">
                <span className="text-slate-500 text-[10px]">
                  Heartbeat: {new Date(d.lastSeen).toLocaleTimeString()}
                </span>
                <button
                  onClick={() => {
                    setSelectedDeviceId(d.id);
                    setCurrentTab('technician-diagnostics');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Inspect Hardware</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
