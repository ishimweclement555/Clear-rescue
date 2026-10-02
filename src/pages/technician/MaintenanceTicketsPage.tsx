import React, { useState } from 'react';
import { Wrench, Plus, CheckCircle2, Clock, X, Save, Edit3 } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';
import { MaintenanceRecord } from '../../types';

export const MaintenanceTicketsPage: React.FC = () => {
  const { maintenanceRecords, createMaintenanceRecord, updateMaintenanceRecord, devices } = useEmergency();
  const { user } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<MaintenanceRecord | null>(null);

  // Form states
  const [deviceId, setDeviceId] = useState(devices[0]?.id || 'dev-cra-001');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // Edit ticket state
  const [editStatus, setEditStatus] = useState<MaintenanceRecord['status']>('IN_PROGRESS');
  const [partsReplaced, setPartsReplaced] = useState('');
  const [notes, setNotes] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const dev = devices.find(d => d.id === deviceId);
    createMaintenanceRecord({
      deviceId,
      deviceCode: dev?.deviceCode || 'CRA-001',
      locationName: dev?.locationName || 'Kigali Facility',
      technicianName: user?.displayName || 'Emmanuel Nshimiyimana',
      title,
      description,
      priority,
    });
    setShowCreateModal(false);
    setTitle('');
    setDescription('');
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket) return;
    updateMaintenanceRecord(selectedTicket.id, {
      status: editStatus,
      partsReplaced,
      notes,
      completedDate: editStatus === 'COMPLETED' ? new Date().toISOString() : undefined,
    });
    setSelectedTicket(null);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Wrench className="w-6 h-6 text-amber-400" />
              <span>Maintenance Tickets &amp; Service Work Orders</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Field inspections, sensor calibration tests, parts replacement, and technician sign-offs.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md shadow-amber-950/40"
          >
            <Plus className="w-4 h-4" />
            <span>Open Maintenance Ticket</span>
          </button>
        </div>

        {/* Tickets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maintenanceRecords.map(ticket => (
            <div key={ticket.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-amber-400">{ticket.ticketCode}</span>
                    <h3 className="text-base font-bold text-white mt-0.5">{ticket.title}</h3>
                    <p className="text-xs text-slate-400">
                      {ticket.deviceCode} &bull; {ticket.locationName}
                    </p>
                  </div>
                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      ticket.status === 'COMPLETED'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : ticket.status === 'IN_PROGRESS'
                        ? 'bg-blue-500/20 text-blue-400'
                        : ticket.status === 'CANCELLED'
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-amber-500/20 text-amber-400'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-3 leading-relaxed">{ticket.description}</p>

                <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Technician:</span>
                    <span className="text-white font-medium">{ticket.technicianName}</span>
                  </div>
                  {ticket.partsReplaced && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Parts Replaced:</span>
                      <span className="text-amber-300 font-medium">{ticket.partsReplaced}</span>
                    </div>
                  )}
                  {ticket.notes && (
                    <div className="pt-1">
                      <span className="text-slate-500 block">Notes:</span>
                      <p className="text-slate-300 text-[10px] italic">{ticket.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500 font-mono text-[10px]">
                  Scheduled: {new Date(ticket.scheduledDate).toLocaleDateString()}
                </span>
                <button
                  onClick={() => {
                    setSelectedTicket(ticket);
                    setEditStatus(ticket.status);
                    setPartsReplaced(ticket.partsReplaced || '');
                    setNotes(ticket.notes || '');
                  }}
                  className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
                >
                  Update Ticket &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create Ticket Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wrench className="w-5 h-5 text-amber-400" />
                  <span>Open Maintenance Service Order</span>
                </h3>
                <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Target Hardware Unit</label>
                  <select
                    value={deviceId}
                    onChange={e => setDeviceId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    {devices.map(d => (
                      <option key={d.id} value={d.id}>
                        {d.deviceCode} — {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Inspection Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Optical Smoke Sensor Chamber Cleaning"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Priority Level</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="LOW">Low (Routine)</option>
                    <option value="MEDIUM">Medium (Preventive)</option>
                    <option value="HIGH">High (Sensor Drift)</option>
                    <option value="CRITICAL">Critical (Post-Emergency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Service Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Describe tasks to perform, benchmark tools to use, and baseline readings required..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    Dispatch Ticket
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Update Ticket Modal */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-amber-400">{selectedTicket.ticketCode}</span>
                  <h3 className="text-base font-bold text-white">{selectedTicket.title}</h3>
                </div>
                <button onClick={() => setSelectedTicket(null)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleUpdate} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Maintenance Status</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="COMPLETED">COMPLETED (Sign-off)</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Replacement Parts Used (if any)</label>
                  <input
                    type="text"
                    value={partsReplaced}
                    onChange={e => setPartsReplaced(e.target.value)}
                    placeholder="e.g. Replaced SHT40 probe SN #8812, 1x LiPo 3.7V cell"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Technician Service Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Record post-inspection calibrations, CSQ signal readings, and validation outcome..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
                  >
                    Save &amp; Update Record
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
