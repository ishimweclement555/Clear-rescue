import React from 'react';
import { History, CheckCircle2, Wrench, Calendar } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const MaintenanceHistoryPage: React.FC = () => {
  const { maintenanceRecords } = useEmergency();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <History className="w-6 h-6 text-amber-400" />
            <span>Field Maintenance Service Log</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete historical record of all hardware repairs, calibration certifications, and replacement parts.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl divide-y divide-slate-800/80">
          {maintenanceRecords.map(m => (
            <div key={m.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400">{m.ticketCode}</span>
                  <h3 className="text-sm font-bold text-white">{m.title}</h3>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      m.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
                <p className="text-slate-300 leading-relaxed">{m.description}</p>
                <div className="flex flex-wrap gap-4 text-slate-400 text-[11px] pt-1">
                  <span>Unit: <strong className="text-white font-mono">{m.deviceCode}</strong> ({m.locationName})</span>
                  <span>Technician: <strong className="text-white">{m.technicianName}</strong></span>
                  {m.partsReplaced && <span>Parts: <strong className="text-amber-300">{m.partsReplaced}</strong></span>}
                </div>
                {m.notes && (
                  <p className="text-slate-400 text-[11px] italic bg-slate-950 p-2 rounded-lg border border-slate-850 mt-2">
                    &ldquo;{m.notes}&rdquo;
                  </p>
                )}
              </div>

              <div className="text-right shrink-0 font-mono text-[11px] text-slate-500">
                <span className="block text-slate-400">
                  {new Date(m.scheduledDate).toLocaleDateString()}
                </span>
                {m.completedDate && (
                  <span className="text-emerald-400 block text-[10px]">
                    Signed off: {new Date(m.completedDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
