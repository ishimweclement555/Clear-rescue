import React, { useState } from 'react';
import { Settings, Shield, Volume2, Save, CheckCircle2, Server, Database } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const AdminSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useEmergency();
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-orange-400" />
            <span>Global Platform &amp; Engine Settings</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System-wide emergency thresholds, database retention parameters, and Rwanda SMS gateway integrations.
          </p>
        </div>

        {saved && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Platform settings saved and propagated to fleet.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Engine Parameters */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>AI Multi-Sensor Correlation Engine</span>
            </h3>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Inference Model Pipeline</label>
              <input
                type="text"
                disabled
                value="Gemini 2.5 Flash / ClearRescue-RuleEngine-v2 Hybrid"
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg p-2.5 text-slate-400 font-mono text-xs cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">AI Analysis Sensitivity</label>
              <select
                value={form.aiAnalysisSensitivity}
                onChange={e => setForm({ ...form, aiAnalysisSensitivity: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="LOW">Low (Requires 3+ corroborating sensors)</option>
                <option value="BALANCED">Balanced (Standard Dual-Sensor Flame+Temp / Smoke+Temp)</option>
                <option value="HIGH">High (Immediate early-warning trigger on fast rise)</option>
              </select>
            </div>
          </div>

          {/* Retention & DB */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Data Retention &amp; Telemetry Archival</span>
            </h3>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Telemetry Log Retention (Days)</label>
              <input
                type="number"
                value={form.dataRetentionDays}
                onChange={e => setForm({ ...form, dataRetentionDays: parseInt(e.target.value) || 90 })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Raw sensor readings older than this threshold will be rolled into hourly aggregates.
              </span>
            </div>
          </div>

          {/* Integration Gateway Toggles */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-orange-400" />
              <span>Regional Carrier Notification Gateways</span>
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">SMS Gateway Simulator (MTN / Airtel Rwanda)</span>
                  <span className="text-slate-400 text-[11px]">
                    Development simulator active (messages recorded in database logs instead of live carrier fees).
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.smsGatewayEnabled}
                  onChange={e => setForm({ ...form, smsGatewayEnabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Email Dispatch Simulator</span>
                  <span className="text-slate-400 text-[11px]">
                    Dispatches formatted incident summaries to authorized facility safety officers.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={form.emailAlertsEnabled}
                  onChange={e => setForm({ ...form, emailAlertsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 cursor-pointer"
            >
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
