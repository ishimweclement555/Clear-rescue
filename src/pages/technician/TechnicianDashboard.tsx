import React from 'react';
import {
  Wrench,
  Cpu,
  CheckCircle2,
  Clock,
  Battery,
  Wifi,
  Sliders,
  AlertTriangle,
  Radio,
  Plus,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

interface TechDashboardProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const TechnicianDashboard: React.FC<TechDashboardProps> = ({
  setCurrentTab,
  openSimulator,
}) => {
  const { devices, maintenanceRecords, sensors } = useEmergency();
  const { user } = useAuth();

  const assignedDevices = devices.filter(
    d => d.assignedTechnicianName?.toLowerCase().includes('emmanuel') || true // show all assigned for demo ease
  );

  const pendingTickets = maintenanceRecords.filter(m => m.status === 'SCHEDULED' || m.status === 'IN_PROGRESS');
  const completedTickets = maintenanceRecords.filter(m => m.status === 'COMPLETED');

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <Wrench className="w-6 h-6 text-amber-400" />
                <span>Technician Diagnostic &amp; Field Support</span>
              </h1>
              <span className="text-xs bg-amber-600/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-semibold">
                Field Technician
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as: <strong className="text-white">{user?.displayName || 'Emmanuel Nshimiyimana'}</strong> &bull; CLEAR RESCUE Field Service Fleet
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('technician-maintenance')}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Create Work Ticket</span>
            </button>
            <button
              onClick={openSimulator}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>Hardware Simulator</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Assigned Fleet</span>
            <span className="text-2xl font-black text-white block mt-1">{devices.length} Units</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Kigali, Masaka, Musanze</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Work Orders</span>
            <span className="text-2xl font-black text-amber-400 block mt-1">{pendingTickets.length} Tickets</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Scheduled inspections</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Completed Tickets</span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">{completedTickets.length} Passed</span>
            <span className="text-[10px] text-slate-400 mt-1 block">All sensor checks verified</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Sensors Calibrated</span>
            <span className="text-2xl font-black text-blue-400 block mt-1">{sensors.length} Probes</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Zero drift detected</span>
          </div>
        </div>

        {/* Assigned Devices Section */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-blue-400" />
                <span>Assigned Monitoring Units &amp; Diagnostics</span>
              </h3>
              <p className="text-xs text-slate-400">Field units assigned to your maintenance inspection territory.</p>
            </div>
            <button
              onClick={() => setCurrentTab('technician-devices')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              View All ({devices.length}) &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedDevices.slice(0, 4).map(d => (
              <div key={d.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs font-bold text-orange-400">{d.deviceCode}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{d.name}</h4>
                      <p className="text-xs text-slate-400">{d.locationName}</p>
                    </div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {d.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-4 text-[11px]">
                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[9px] uppercase">Battery</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Battery className="w-3.5 h-3.5 text-emerald-400" />
                        {d.batteryLevel}%
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[9px] uppercase">Connection</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Wifi className="w-3.5 h-3.5 text-blue-400" />
                        {d.connectionType}
                      </span>
                    </div>

                    <div className="bg-slate-900 p-2 rounded-lg">
                      <span className="text-slate-500 block text-[9px] uppercase">Firmware</span>
                      <span className="font-mono font-bold text-white">{d.firmwareVersion}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-900 mt-3 flex justify-between items-center text-xs">
                  <span className="text-slate-500 text-[10px]">
                    Seen: {new Date(d.lastSeen).toLocaleTimeString()}
                  </span>
                  <button
                    onClick={() => setCurrentTab('technician-diagnostics')}
                    className="text-amber-400 hover:text-amber-300 font-semibold"
                  >
                    Run Diagnostics &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Maintenance Work Tickets */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Current Maintenance Work Tickets</h3>
            <button
              onClick={() => setCurrentTab('technician-maintenance')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Manage Tickets &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {maintenanceRecords.slice(0, 4).map(m => (
              <div key={m.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-400">{m.ticketCode}</span>
                    <span className="font-bold text-white">{m.title}</span>
                    <span
                      className={`text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        m.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : m.status === 'IN_PROGRESS'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {m.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mt-1">{m.description}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-slate-500 block text-[10px]">Assigned: {m.technicianName}</span>
                  <span className="text-slate-400 font-mono text-[11px]">
                    {new Date(m.scheduledDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
