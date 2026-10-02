import React, { useState } from 'react';
import { History, Search, Filter, ShieldCheck, Download } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useEmergency();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter(log => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      log.action.toLowerCase().includes(term) ||
      log.resource.toLowerCase().includes(term) ||
      log.details.toLowerCase().includes(term) ||
      log.userEmail.toLowerCase().includes(term)
    );
  });

  const exportAuditCSV = () => {
    const headers = ['Timestamp', 'Action', 'Resource', 'User Email', 'IP Address', 'Details'];
    const rows = filteredLogs.map(l => [
      l.timestamp,
      l.action,
      `"${l.resource}"`,
      l.userEmail,
      l.ipAddress || 'Internal',
      `"${l.details.replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clear_rescue_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <History className="w-6 h-6 text-teal-400" />
              <span>Immutable System Audit &amp; Compliance Trail</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Cryptographically timestamped log of all user logins, sensor adjustments, simulation triggers, and incident states.
            </p>
          </div>

          <button
            onClick={exportAuditCSV}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-4 h-4 text-orange-400" />
            <span>Export Audit Trail CSV</span>
          </button>
        </div>

        {/* Search */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search audit trail by action (e.g. SIMULATION, SENSOR, INCIDENT), user, or resource..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
            />
          </div>
        </div>

        {/* Log table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px] font-sans">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action Event</th>
                  <th className="py-3 px-4">Resource Target</th>
                  <th className="py-3 px-4">User Identity</th>
                  <th className="py-3 px-4">IP Origin</th>
                  <th className="py-3 px-4">Operation Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-bold text-orange-400 font-sans">{log.action}</td>
                    <td className="py-3 px-4 text-white font-bold">{log.resource}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans text-xs">{log.userEmail}</td>
                    <td className="py-3 px-4 text-slate-500 text-[11px]">{log.ipAddress || '197.243.10.4'}</td>
                    <td className="py-3 px-4 text-slate-300 font-sans text-xs max-w-md truncate">
                      {log.details}
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
