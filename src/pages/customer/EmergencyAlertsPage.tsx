import React, { useState } from 'react';
import {
  ShieldAlert,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  MapPin,
  Cpu,
  Brain,
  Search,
  HelpCircle,
  PhoneCall,
  Radio,
} from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';
import { useAuth } from '../../context/AuthContext';

interface EmergencyAlertsProps {
  openSimulator: () => void;
}

export const EmergencyAlertsPage: React.FC<EmergencyAlertsProps> = ({ openSimulator }) => {
  const { incidents, acknowledgeIncident, investigateIncident, resolveIncident, markFalseAlarm } =
    useEmergency();
  const { user } = useAuth();

  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [actionType, setActionType] = useState<'RESOLVE' | 'FALSE_ALARM' | null>(null);

  const activeIncidents = incidents.filter(i => i.status === 'OPEN' || i.status === 'INVESTIGATING' || i.status === 'ACKNOWLEDGED');
  const filteredList = activeIncidents.filter(i => {
    if (filterSeverity === 'ALL') return true;
    return i.severity === filterSeverity;
  });

  const handleActionConfirm = (incidentId: string) => {
    if (actionType === 'RESOLVE') {
      resolveIncident(incidentId, user?.displayName || 'Authorized Officer', noteInput || 'Hazard mitigated onsite.');
    } else if (actionType === 'FALSE_ALARM') {
      markFalseAlarm(incidentId, user?.displayName || 'Authorized Officer', noteInput || 'Environmental false trigger.');
    }
    setActionType(null);
    setNoteInput('');
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <ShieldAlert className="w-6 h-6 text-red-500" />
                <span>Emergency Incidents Operations Center</span>
              </h1>
              <span className="text-xs bg-red-600/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded font-bold">
                {activeIncidents.length} Active
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Live emergency verification queue. Correlates AI diagnostic explanations with multi-sensor telemetry.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={openSimulator}
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Simulate Emergency Alert</span>
            </button>
          </div>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setFilterSeverity('ALL')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterSeverity === 'ALL' ? 'bg-slate-700 text-white' : 'bg-slate-900 text-slate-400 border border-slate-800'
            }`}
          >
            All Active ({activeIncidents.length})
          </button>
          <button
            onClick={() => setFilterSeverity('CRITICAL')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterSeverity === 'CRITICAL'
                ? 'bg-red-600 text-white'
                : 'bg-slate-900 text-red-400 border border-slate-800'
            }`}
          >
            Critical Only
          </button>
          <button
            onClick={() => setFilterSeverity('WARNING')}
            className={`px-3 py-1.5 rounded-lg font-bold ${
              filterSeverity === 'WARNING'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-900 text-amber-400 border border-slate-800'
            }`}
          >
            Warning Only
          </button>
        </div>

        {/* Incidents Queue */}
        {filteredList.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-base font-bold text-white">All Monitored Facilities Normal</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              There are currently no active emergency incidents matching your filter. Use the sensor simulator to trigger a test incident.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredList.map(inc => {
              const isCrit = inc.severity === 'CRITICAL';

              return (
                <div
                  key={inc.id}
                  className={`p-6 rounded-2xl border transition-all ${
                    isCrit
                      ? 'bg-slate-900 border-red-500 shadow-2xl shadow-red-950/40'
                      : 'bg-slate-900 border-amber-500/80 shadow-xl shadow-amber-950/30'
                  }`}
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-xl text-white font-bold ${
                          isCrit ? 'bg-red-600 animate-pulse' : 'bg-amber-600'
                        }`}
                      >
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-slate-400">{inc.incidentCode}</span>
                          <span
                            className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                              isCrit ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>
                        <h3 className="text-lg font-extrabold text-white mt-0.5">{inc.eventType}</h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-orange-400" />
                        <span className="font-semibold text-white">{inc.locationName}</span>
                      </div>
                      <span className="text-slate-600">&bull;</span>
                      <div className="flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-blue-400" />
                        <span className="font-mono text-white">{inc.deviceCode}</span>
                      </div>
                      <span className="text-slate-600">&bull;</span>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="font-mono">{new Date(inc.createdTime).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Analysis Explanation Card */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                        <Brain className="w-4 h-4" /> AI Correlated Diagnostic:
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">
                        Confidence: {(inc.aiAnalysis.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-medium">
                      &ldquo;{inc.aiAnalysis.explanation}&rdquo;
                    </p>
                    <div className="pt-2 border-t border-slate-900 flex items-start gap-2">
                      <span className="text-xs text-amber-400 font-bold shrink-0">Recommended Verification:</span>
                      <span className="text-xs text-slate-300 font-medium">{inc.aiAnalysis.recommendedAction}</span>
                    </div>
                  </div>

                  {/* Triggered Sensors Matrix */}
                  <div className="mb-4">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block mb-2">
                      Triggered Sensor Telemetry Channels:
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {inc.sensorReadings && inc.sensorReadings.map(s => (
                        <div key={s.sensorType} className="bg-slate-950 border border-slate-800 p-2.5 rounded-lg text-xs">
                          <span className="text-slate-400 font-bold text-[10px] block">{s.sensorType}</span>
                          <span className="text-base font-black text-red-400 font-mono">{s.value}</span>{' '}
                          <span className="text-slate-500">{s.unit}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Confirm Input Box */}
                  {actionType && selectedIncidentId === inc.id && (
                    <div className="bg-slate-950 border border-slate-700 p-4 rounded-xl space-y-3 mb-4 animate-in fade-in duration-100">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                        {actionType === 'RESOLVE' ? 'Resolve Emergency Incident' : 'Mark as False Alarm'}
                      </h4>
                      <textarea
                        value={noteInput}
                        onChange={e => setNoteInput(e.target.value)}
                        placeholder="Enter field notes, technician mitigation steps, and confirmation..."
                        rows={2}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => setActionType(null)}
                          className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded hover:bg-slate-700"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleActionConfirm(inc.id)}
                          className={`px-4 py-1 text-white text-xs font-bold rounded ${
                            actionType === 'RESOLVE' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-amber-600 hover:bg-amber-500'
                          }`}
                        >
                          Confirm &amp; Update Record
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Current Status:</span>
                      <span
                        className={`text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          inc.status === 'OPEN'
                            ? 'bg-red-500 text-white animate-pulse'
                            : inc.status === 'ACKNOWLEDGED'
                            ? 'bg-amber-500 text-black'
                            : 'bg-blue-500 text-white'
                        }`}
                      >
                        {inc.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {inc.status === 'OPEN' && (
                        <button
                          onClick={() => acknowledgeIncident(inc.id, user?.displayName || 'Operator')}
                          className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          1. Acknowledge Alert
                        </button>
                      )}

                      {inc.status !== 'INVESTIGATING' && (
                        <button
                          onClick={() => investigateIncident(inc.id, user?.displayName || 'Field Responder')}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Search className="w-3.5 h-3.5" />
                          <span>2. Assign Investigation</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedIncidentId(inc.id);
                          setActionType('FALSE_ALARM');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                      >
                        <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mark False Alarm</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedIncidentId(inc.id);
                          setActionType('RESOLVE');
                        }}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-emerald-950/40"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Resolve Emergency</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
