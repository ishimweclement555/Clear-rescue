import React, { useState } from 'react';
import {
  AlertTriangle,
  Flame,
  ShieldAlert,
  Clock,
  MapPin,
  Cpu,
  Brain,
  CheckCircle,
  Search,
  PhoneCall,
  Volume2,
  VolumeX,
  X,
  HelpCircle,
} from 'lucide-react';
import { useEmergency } from '../context/EmergencyContext';
import { useAuth } from '../context/AuthContext';

export const EmergencyAlertModal: React.FC = () => {
  const {
    activeEmergency,
    acknowledgeIncident,
    investigateIncident,
    resolveIncident,
    markFalseAlarm,
    dismissEmergencyBanner,
    isBannerDismissed,
  } = useEmergency();
  const { user } = useAuth();

  const [soundMuted, setSoundMuted] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [showFalseAlarmModal, setShowFalseAlarmModal] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);

  if (!activeEmergency || isBannerDismissed) {
    return null;
  }

  const isCritical = activeEmergency.severity === 'CRITICAL';
  const isAcknowledged = activeEmergency.status === 'ACKNOWLEDGED';
  const isInvestigating = activeEmergency.status === 'INVESTIGATING';

  const handleAcknowledge = () => {
    acknowledgeIncident(activeEmergency.id, user?.displayName || 'Emergency Operations Officer');
  };

  const handleInvestigate = () => {
    investigateIncident(activeEmergency.id, user?.displayName || 'Field Responder');
  };

  const handleResolve = () => {
    resolveIncident(
      activeEmergency.id,
      user?.displayName || 'Authorized Responder',
      resolutionNotes || 'Hazard neutralized and sensor baseline restored.'
    );
    setShowResolveModal(false);
    setResolutionNotes('');
  };

  const handleFalseAlarm = () => {
    markFalseAlarm(
      activeEmergency.id,
      user?.displayName || 'Authorized Inspector',
      resolutionNotes || 'False trigger due to environmental noise / authorized maintenance.'
    );
    setShowFalseAlarmModal(false);
    setResolutionNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-3xl rounded-2xl border shadow-2xl overflow-hidden ${
          isCritical
            ? 'bg-slate-950 border-red-500 shadow-red-500/30'
            : 'bg-slate-950 border-amber-500 shadow-amber-500/30'
        }`}
      >
        {/* Flashing Top Alert Banner */}
        <div
          className={`px-6 py-4 flex items-center justify-between text-white font-bold ${
            isCritical ? 'bg-red-600 animate-pulse' : 'bg-amber-600'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="h-3 w-3 rounded-full bg-white animate-ping" />
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" />
              <span className="text-lg uppercase tracking-wider font-extrabold">
                {isCritical ? '🚨 CRITICAL POSSIBLE EMERGENCY DETECTED' : '⚠️ WARNING: ENVIRONMENTAL ANOMALY'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundMuted(!soundMuted)}
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition-colors text-white text-xs flex items-center gap-1 cursor-pointer"
              title={soundMuted ? 'Unmute Audio Siren' : 'Mute Audio Siren'}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="text-[11px] font-semibold">{soundMuted ? 'Muted' : 'Siren'}</span>
            </button>
            <button
              onClick={dismissEmergencyBanner}
              className="p-1.5 rounded-lg bg-black/30 hover:bg-black/50 text-white transition-colors cursor-pointer"
              title="Minimize Emergency Screen to background"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Key Info Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
            <div>
              <span className="text-xs text-slate-400 block flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-orange-400" /> Monitored Location
              </span>
              <p className="text-sm font-bold text-white">{activeEmergency.locationName}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 block flex items-center gap-1 mb-1">
                <Cpu className="w-3.5 h-3.5 text-blue-400" /> Device Code
              </span>
              <p className="text-sm font-bold text-white">{activeEmergency.deviceCode}</p>
            </div>
            <div>
              <span className="text-xs text-slate-400 block flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> Time Detected
              </span>
              <p className="text-sm font-bold text-white">
                {new Date(activeEmergency.createdTime).toLocaleTimeString()} ({new Date(activeEmergency.createdTime).toLocaleDateString()})
              </p>
            </div>
          </div>

          {/* Event Type & Current Status */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-950/30 border border-red-900/40 p-4 rounded-xl">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-red-400">Event Classification</span>
              <h3 className="text-xl font-extrabold text-white mt-0.5">{activeEmergency.eventType}</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Current State:</span>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                  activeEmergency.status === 'OPEN'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                    : activeEmergency.status === 'ACKNOWLEDGED'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                }`}
              >
                {activeEmergency.status}
              </span>
            </div>
          </div>

          {/* Triggered Sensors Matrix */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Correlated Sensor Readings
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {activeEmergency.sensorReadings && activeEmergency.sensorReadings.length > 0 ? (
                activeEmergency.sensorReadings.map(s => (
                  <div
                    key={s.sensorType}
                    className="bg-slate-900 border border-red-900/60 rounded-xl p-3 flex flex-col justify-between"
                  >
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {s.sensorType}
                    </span>
                    <div className="my-1.5">
                      <span className="text-2xl font-black text-red-400">{s.value}</span>
                      <span className="text-xs text-slate-400 ml-1">{s.unit}</span>
                    </div>
                    <span className="text-[10px] text-amber-400">
                      Threshold: &gt; {s.threshold}
                    </span>
                  </div>
                ))
              ) : (
                <div className="col-span-4 bg-slate-900 p-3 rounded-lg text-xs text-slate-400">
                  Triggered channels: {activeEmergency.triggeredSensors.join(', ')}
                </div>
              )}
            </div>
          </div>

          {/* AI Analysis Card */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-900/80 border border-indigo-900/50 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <Brain className="w-4 h-4 text-indigo-400" />
                <span>AI Emergency Analysis Diagnostic</span>
              </div>
              <span className="text-xs bg-indigo-950/60 text-indigo-300 border border-indigo-800/40 px-2 py-0.5 rounded font-mono">
                Confidence: {(activeEmergency.aiAnalysis.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed font-medium">
              &ldquo;{activeEmergency.aiAnalysis.explanation}&rdquo;
            </p>
            <div className="pt-2 border-t border-indigo-900/40 flex items-start gap-2">
              <span className="text-xs text-amber-400 font-bold shrink-0">Recommended Action:</span>
              <span className="text-xs text-slate-300 font-medium">
                {activeEmergency.aiAnalysis.recommendedAction}
              </span>
            </div>
          </div>

          {/* Emergency Personnel Call Notice (Requirement 11: Do not claim contacted without real integration) */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <PhoneCall className="w-4 h-4 text-orange-400 shrink-0" />
              <span>
                Rwanda Emergency Services: <strong>111 (Fire &amp; Rescue)</strong> &bull; <strong>112 (Police)</strong>
              </span>
            </div>
            <button
              onClick={() => setShowCallConfirm(true)}
              className="px-3 py-1.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Dial Emergency Protocol
            </button>
          </div>

          {/* Call Confirm Banner */}
          {showCallConfirm && (
            <div className="bg-orange-950/80 border border-orange-600 p-4 rounded-xl text-xs text-orange-200 space-y-2">
              <p className="font-bold text-orange-300 text-sm">
                Initiate Onsite Emergency Dispatch?
              </p>
              <p>
                In accordance with regulatory safety requirements, CLEAR RESCUE AI does not automatically dispatch third-party public responders without authorized manual operator verification.
              </p>
              <div className="flex gap-2 pt-1">
                <a
                  href="tel:111"
                  className="bg-red-600 text-white px-3 py-1.5 rounded font-bold hover:bg-red-500"
                >
                  Confirm &amp; Call 111 (Rwanda Fire)
                </a>
                <button
                  onClick={() => setShowCallConfirm(false)}
                  className="bg-slate-800 text-slate-300 px-3 py-1.5 rounded hover:bg-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Resolution / False Alarm Input Box */}
          {(showResolveModal || showFalseAlarmModal) && (
            <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl space-y-3 animate-in fade-in duration-150">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {showResolveModal ? 'Resolve Emergency Incident' : 'Record False Alarm'}
              </h5>
              <textarea
                value={resolutionNotes}
                onChange={e => setResolutionNotes(e.target.value)}
                placeholder={
                  showResolveModal
                    ? 'Enter field resolution details, technician actions taken, and verified sensor baseline...'
                    : 'Enter reason for false alarm (e.g., cooking smoke in kitchen, sensor calibration drift, testing)...'
                }
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowResolveModal(false);
                    setShowFalseAlarmModal(false);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
                >
                  Cancel
                </button>
                {showResolveModal ? (
                  <button
                    onClick={handleResolve}
                    className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirm Resolution
                  </button>
                ) : (
                  <button
                    onClick={handleFalseAlarm}
                    className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold"
                  >
                    Confirm False Alarm
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons (Mandated: Acknowledge, Investigate, Mark False Alarm, Resolve) */}
          <div className="pt-2 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              onClick={handleAcknowledge}
              disabled={isAcknowledged || isInvestigating}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isAcknowledged
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-600 hover:bg-amber-500 text-white active:scale-95'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{isAcknowledged ? 'Acknowledged' : '1. Acknowledge'}</span>
            </button>

            <button
              onClick={handleInvestigate}
              disabled={isInvestigating}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                isInvestigating
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-500 text-white active:scale-95'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{isInvestigating ? 'Investigating' : '2. Investigate'}</span>
            </button>

            <button
              onClick={() => {
                setShowFalseAlarmModal(true);
                setShowResolveModal(false);
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Mark False Alarm</span>
            </button>

            <button
              onClick={() => {
                setShowResolveModal(true);
                setShowFalseAlarmModal(false);
              }}
              className="px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/40"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Resolve Incident</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
