import React from 'react';
import {
  ShieldAlert,
  Users,
  Cpu,
  Sliders,
  MapPin,
  History,
  Settings,
  Bell,
  Wrench,
  Radio,
  Activity,
  FileText,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

interface AdminDashboardProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openIoTDocs: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  setCurrentTab,
  openSimulator,
  openIoTDocs,
}) => {
  const { devices, sensors, incidents, locations, maintenanceRecords, auditLogs } = useEmergency();
  const { user } = useAuth();

  const openIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING');

  const adminShortcuts = [
    {
      title: 'User Management',
      tab: 'admin-users',
      desc: 'Create, edit, and assign RBAC roles (Customer, Technician, Admin, Super Admin).',
      icon: <Users className="w-6 h-6 text-blue-400" />,
      count: '4 Accounts',
    },
    {
      title: 'Hardware Units',
      tab: 'admin-devices',
      desc: 'Provision hardware units, assign locations, configure connection parameters.',
      icon: <Cpu className="w-6 h-6 text-orange-400" />,
      count: `${devices.length} Units`,
    },
    {
      title: 'Sensors & Calibrations',
      tab: 'admin-sensors',
      desc: 'Configure warning and critical safety thresholds across all 12 channels.',
      icon: <Sliders className="w-6 h-6 text-emerald-400" />,
      count: `${sensors.length} Channels`,
    },
    {
      title: 'Emergencies & Incidents',
      tab: 'admin-incidents',
      desc: 'Central emergency response queue, status overrides, and AI confidence logs.',
      icon: <ShieldAlert className="w-6 h-6 text-red-400" />,
      count: `${openIncidents.length} Active`,
    },
    {
      title: 'Monitored Facilities',
      tab: 'admin-locations',
      desc: 'Manage geographical sites across Nyarugenge, Gasabo, Kicukiro, and Musanze.',
      icon: <MapPin className="w-6 h-6 text-purple-400" />,
      count: `${locations.length} Sites`,
    },
    {
      title: 'Technician Maintenance',
      tab: 'admin-maintenance',
      desc: 'Assign field engineers, inspect replacement parts logs, and sign off tickets.',
      icon: <Wrench className="w-6 h-6 text-amber-400" />,
      count: `${maintenanceRecords.length} Tickets`,
    },
    {
      title: 'Audit & Compliance Logs',
      tab: 'admin-audit',
      desc: 'Immutable security log of all user logins, sensor adjustments, and incidents.',
      icon: <History className="w-6 h-6 text-teal-400" />,
      count: `${auditLogs.length} Events`,
    },
    {
      title: 'System Settings',
      tab: 'admin-settings',
      desc: 'Global audio siren mechanisms, SMS gateway placeholders, and AI sensitivity.',
      icon: <Settings className="w-6 h-6 text-slate-300" />,
      count: 'Configured',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-orange-500" />
                <span>Clear Rescue Central Command Console</span>
              </h1>
              <span className="text-xs bg-orange-600 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                Admin Center
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Rwanda &amp; East Africa Emergency Detection &amp; Fleet Response Grid &bull; Super Admin Clearance
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSimulator}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-orange-950/40 cursor-pointer active:scale-95"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Launch Simulator</span>
            </button>
            <button
              onClick={openIoTDocs}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-4 h-4 text-blue-400" />
              <span>IoT Specs</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Top Fleet Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Hardware Fleet</span>
            <span className="text-2xl font-black text-white block mt-1">{devices.length} Units</span>
            <span className="text-[10px] text-emerald-400 mt-0.5 block">&bull; 100% Cellular/Wi-Fi Linked</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Live Sensors</span>
            <span className="text-2xl font-black text-blue-400 block mt-1">{sensors.length} Channels</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">&bull; Calibrated &amp; Active</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Active Emergencies</span>
            <span className={`text-2xl font-black block mt-1 ${openIncidents.length > 0 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
              {openIncidents.length} Incidents
            </span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">&bull; Live response queue</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Monitored Facilities</span>
            <span className="text-2xl font-black text-purple-400 block mt-1">{locations.length} Sites</span>
            <span className="text-[10px] text-slate-400 mt-0.5 block">&bull; Rwanda National Grid</span>
          </div>
        </div>

        {/* Admin Navigation Hub (12 Core Modules) */}
        <div>
          <h2 className="text-base font-extrabold text-white mb-4">Platform Administration Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {adminShortcuts.map(item => (
              <div
                key={item.tab}
                onClick={() => setCurrentTab(item.tab)}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/50 hover:bg-slate-850 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-105 transition-transform">
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-mono bg-slate-950 text-slate-400 px-2 py-0.5 rounded font-bold">
                      {item.count}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 mt-3 text-xs text-orange-400 font-semibold flex items-center justify-between">
                  <span>Open Console</span>
                  <span>&rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Security Audit Log Quick Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-teal-400" />
                <span>Security Audit Trail &amp; System Event Log</span>
              </h3>
              <p className="text-xs text-slate-400">Chronological audit stream recording operational changes.</p>
            </div>
            <button
              onClick={() => setCurrentTab('admin-audit')}
              className="text-xs text-orange-400 hover:text-orange-300 font-semibold"
            >
              Full Audit Ledger &rarr;
            </button>
          </div>

          <div className="divide-y divide-slate-800/80 text-xs font-mono">
            {auditLogs.slice(0, 5).map(log => (
              <div key={log.id} className="py-2.5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-orange-400 font-bold">{log.action}</span>
                  <span className="text-slate-400 font-sans text-xs">{log.details}</span>
                </div>
                <span className="text-slate-500 text-[11px] shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
