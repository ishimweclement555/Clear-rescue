import React, { useState } from 'react';
import { Settings, Bell, Shield, Radio, Volume2, Save, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings } = useEmergency();
  const [localSettings, setLocalSettings] = useState(settings);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(localSettings);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings className="w-6 h-6 text-slate-400" />
            <span>Platform &amp; Alarm Configuration</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure audible siren mechanisms, notification dispatch routes, and simulated hardware modes.
          </p>
        </div>

        {savedMsg && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Settings saved successfully.</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Audio Siren Mechanism */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-orange-400" />
              <span>Alarm Mechanism &amp; Audio Notifications</span>
            </h3>

            <div className="space-y-3 text-slate-300">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">Audible Siren on Critical Emergency</span>
                  <span className="text-slate-400 text-[11px]">
                    Trigger local buzzer and audible alert loop when high-severity events occur.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.soundAlertEnabled}
                  onChange={e => setLocalSettings({ ...localSettings, soundAlertEnabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
                <div>
                  <span className="font-bold text-white block">In-App Emergency Modal Override</span>
                  <span className="text-slate-400 text-[11px]">
                    Force focus to full-screen emergency incident window whenever active alarms occur.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={localSettings.pushNotificationsEnabled}
                  onChange={e => setLocalSettings({ ...localSettings, pushNotificationsEnabled: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* AI Reasoning Calibration */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400" />
              <span>AI Multi-Sensor Diagnostics Sensitivity</span>
            </h3>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Correlation Mode</label>
              <select
                value={localSettings.aiAnalysisSensitivity}
                onChange={e =>
                  setLocalSettings({
                    ...localSettings,
                    aiAnalysisSensitivity: e.target.value as 'LOW' | 'BALANCED' | 'HIGH',
                  })
                }
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
              >
                <option value="LOW">Low (Requires 3+ corroborating sensors to escalate to Critical)</option>
                <option value="BALANCED">Balanced (Standard dual-sensor correlation: Flame + Temp, or Smoke + Temp)</option>
                <option value="HIGH">High Sensitivity (Early warning; elevates single rapid rises to Warning)</option>
              </select>
            </div>
          </div>

          {/* Rwanda Emergency Numbers */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white">Emergency Services Hotline Protocol</h3>
            <div>
              <label className="block text-slate-400 mb-1 font-semibold">Configured Regional Numbers</label>
              <input
                type="text"
                value={localSettings.rwandaEmergencyNumber}
                onChange={e => setLocalSettings({ ...localSettings, rwandaEmergencyNumber: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-orange-500"
              />
              <span className="text-[10px] text-slate-500 block mt-1">
                Standard in Rwanda: 111 (Fire &amp; Rescue Brigade), 112 (Police), 912 (SAMU)
              </span>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
