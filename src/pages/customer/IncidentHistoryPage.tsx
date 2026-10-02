import React, { useState } from 'react';
import { History, Filter, Download, Search, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { IncidentStatus, IncidentSeverity } from '../../types';

export const IncidentHistoryPage: React.FC = () => {
  const { incidents } = useEmergency();
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredIncidents = incidents.filter(i => {
    if (statusFilter !== 'ALL' && i.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && i.severity !== severityFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchCode = i.incidentCode.toLowerCase().includes(term);
      const matchLoc = i.locationName.toLowerCase().includes(term);
      const matchEvent = i.eventType.toLowerCase().includes(term);
      const matchDev = i.deviceCode.toLowerCase().includes(term);
      if (!matchCode && !matchLoc && !matchEvent && !matchDev) return false;
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['Incident Code', 'Location', 'Device', 'Event Type', 'Severity', 'Status', 'Detected Time', 'Resolved Time'];
    const rows = filteredIncidents.map(i => [
      i.incidentCode,
      `"${i.locationName}"`,
      i.deviceCode,
      `"${i.eventType}"`,
      i.severity,
      i.status,
      i.createdTime,
      i.resolvedTime || 'N/A',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clear_rescue_incidents_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <History className="w-6 h-6 text-purple-400" />
              <span>Incident History &amp; Audit Records</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Historical archive of all triggered safety alarms, operator acknowledgments, and resolved emergency tickets.
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Export to CSV ({filteredIncidents.length})</span>
          </button>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex-1 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by code, room, location, or emergency type..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Status:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="OPEN">Open</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="INVESTIGATING">Investigating</option>
                <option value="RESOLVED">Resolved</option>
                <option value="FALSE_ALARM">False Alarm</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">Severity:</span>
              <select
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-orange-500"
              >
                <option value="ALL">All Severities</option>
                <option value="CRITICAL">Critical</option>
                <option value="WARNING">Warning</option>
                <option value="INFO">Info</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 text-[11px]">
                  <th className="py-3 px-4">Incident Code</th>
                  <th className="py-3 px-4">Location &amp; Room</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Severity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Detected At</th>
                  <th className="py-3 px-4">Resolved By</th>
                  <th className="py-3 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredIncidents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-500 text-xs">
                      No incidents match current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredIncidents.map(inc => (
                    <tr key={inc.id} className="hover:bg-slate-800/40">
                      <td className="py-3.5 px-4 font-mono font-bold text-white">{inc.incidentCode}</td>
                      <td className="py-3.5 px-4 text-slate-200">
                        {inc.locationName} <span className="font-mono text-slate-500 block text-[10px]">({inc.deviceCode})</span>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-slate-300">{inc.eventType}</td>
                      <td className="py-3.5 px-4">
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
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            inc.status === 'RESOLVED'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : inc.status === 'FALSE_ALARM'
                              ? 'bg-slate-700 text-slate-300'
                              : inc.status === 'OPEN'
                              ? 'bg-red-500 text-white animate-pulse'
                              : 'bg-amber-500 text-black'
                          }`}
                        >
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {new Date(inc.createdTime).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-slate-300">
                        {inc.resolvedBy || inc.acknowledgedBy || 'Pending'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 max-w-xs truncate text-[11px]">
                        {inc.notes && inc.notes.length > 0 ? inc.notes[inc.notes.length - 1] : '—'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
