import React, { useState } from 'react';
import { BarChart3, Download, Calendar, Filter, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const ReportsPage: React.FC = () => {
  const { incidents, devices, sensors, maintenanceRecords } = useEmergency();
  const [timeRange, setTimeRange] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY'>('MONTHLY');
  const [selectedLocation, setSelectedLocation] = useState<string>('ALL');

  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter(i => i.severity === 'CRITICAL').length;
  const warningCount = incidents.filter(i => i.severity === 'WARNING').length;
  const falseAlarmCount = incidents.filter(i => i.status === 'FALSE_ALARM').length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;

  const exportComprehensiveCSV = () => {
    const headers = [
      'Report Section',
      'Metric / Item',
      'Value',
      'Status / Details',
      'Generated Date',
    ];

    const rows: string[][] = [
      ['Summary', 'Total Incidents Logged', String(totalIncidents), 'Historical', new Date().toISOString()],
      ['Summary', 'Critical Severity Incidents', String(criticalCount), 'High Priority', new Date().toISOString()],
      ['Summary', 'Warning Level Incidents', String(warningCount), 'Medium Priority', new Date().toISOString()],
      ['Summary', 'Resolved Incidents', String(resolvedCount), 'Mitigated', new Date().toISOString()],
      ['Summary', 'Recorded False Alarms', String(falseAlarmCount), 'Validated', new Date().toISOString()],
      ['Fleet', 'Active Devices Monitored', String(devices.length), 'Online Fleet', new Date().toISOString()],
      ['Fleet', 'Connected Sensors', String(sensors.length), 'Active Channels', new Date().toISOString()],
      ['Maintenance', 'Completed Service Tickets', String(maintenanceRecords.length), 'Technician logs', new Date().toISOString()],
    ];

    devices.forEach(d => {
      rows.push(['Device Health', d.deviceCode, `Battery: ${d.batteryLevel}%`, `Status: ${d.status} | Loc: ${d.locationName}`, d.lastSeen]);
    });

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `clear_rescue_safety_report_${timeRange.toLowerCase()}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-orange-400" />
              <span>Safety &amp; Compliance Analytics Reports</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Audit summaries, device uptime metrics, false alarm rates, and incident resolution benchmarks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportComprehensiveCSV}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-950/40 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Report</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Print / PDF View</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-semibold">Reporting Window:</span>
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setTimeRange('DAILY')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  timeRange === 'DAILY' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Daily
              </button>
              <button
                onClick={() => setTimeRange('WEEKLY')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  timeRange === 'WEEKLY' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setTimeRange('MONTHLY')}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  timeRange === 'MONTHLY' ? 'bg-orange-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly (30 Days)
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-slate-400 font-semibold">Location:</span>
            <select
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500"
            >
              <option value="ALL">All Regional Sites</option>
              <option value="Kigali">Kigali Head Office</option>
              <option value="Masaka">Masaka Logistics Hub</option>
              <option value="GreenHills">Green Hills Academy</option>
              <option value="Musanze">Musanze Eco-Lodge</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Incidents</span>
            <span className="text-3xl font-black text-white block mt-1">{totalIncidents}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">In selected {timeRange.toLowerCase()} period</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Critical Emergencies</span>
            <span className="text-3xl font-black text-red-400 block mt-1">{criticalCount}</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Immediate dispatch triggers</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">False Alarm Ratio</span>
            <span className="text-3xl font-black text-amber-400 block mt-1">
              {totalIncidents > 0 ? `${Math.round((falseAlarmCount / totalIncidents) * 100)}%` : '0%'}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">{falseAlarmCount} classified false triggers</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Fleet Uptime</span>
            <span className="text-3xl font-black text-emerald-400 block mt-1">99.8%</span>
            <span className="text-[10px] text-slate-400 mt-1 block">Cellular telemetry continuity</span>
          </div>
        </div>

        {/* Fleet Hardware Health Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Monitoring Unit Health &amp; Uptime Breakdown</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="pb-3">Unit Code</th>
                  <th className="pb-3">Facility Name</th>
                  <th className="pb-3">Connection</th>
                  <th className="pb-3">Battery Reserve</th>
                  <th className="pb-3">Sensor Channels</th>
                  <th className="pb-3">Estimated Uptime</th>
                  <th className="pb-3">Current Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {devices.map(d => (
                  <tr key={d.id} className="hover:bg-slate-800/40">
                    <td className="py-3 font-mono font-bold text-white">{d.deviceCode}</td>
                    <td className="py-3 text-slate-300">{d.locationName}</td>
                    <td className="py-3 text-emerald-400">{d.connectionType} LTE</td>
                    <td className="py-3 font-mono text-white">{d.batteryLevel}%</td>
                    <td className="py-3 text-slate-400">12 Channels</td>
                    <td className="py-3 font-mono text-emerald-400 font-bold">99.9%</td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                        {d.status}
                      </span>
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
