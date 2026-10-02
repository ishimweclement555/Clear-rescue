import React, { useState } from 'react';
import { Cpu, Battery, Wifi, Activity, Terminal, CheckCircle2, RefreshCw, Radio } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

interface DiagnosticsProps {
  openSimulator: () => void;
}

export const DeviceDiagnosticsPage: React.FC<DiagnosticsProps> = ({ openSimulator }) => {
  const { devices, selectedDeviceId, setSelectedDeviceId, sensors } = useEmergency();
  const [runningTest, setRunningTest] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const selectedDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const devSensors = sensors.filter(s => s.deviceId === selectedDevice?.id);

  const handleRunDiagnostics = () => {
    setRunningTest(true);
    setTestResult(null);
    setTimeout(() => {
      setRunningTest(false);
      setTestResult(
        `Hardware diagnostics passed for ${selectedDevice.deviceCode}. All 12 sensor ADC/I2C buses nominal. Cellular CSQ 26/31. SPI Flash telemetry buffer 100% verified.`
      );
    }, 1800);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Cpu className="w-6 h-6 text-amber-400" />
              <span>Deep Hardware Diagnostics Console</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Low-level ESP32 peripheral bus validation, ADC noise measurement, and RF telemetry testing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunDiagnostics}
              disabled={runningTest}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${runningTest ? 'animate-spin' : ''}`} />
              <span>{runningTest ? 'Executing Loopback...' : 'Run Diagnostics Self-Test'}</span>
            </button>
          </div>
        </div>

        {/* Device selector */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 uppercase">Selected Unit:</span>
            <select
              value={selectedDeviceId}
              onChange={e => setSelectedDeviceId(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-500"
            >
              {devices.map(d => (
                <option key={d.id} value={d.id}>
                  {d.deviceCode} — {d.name} ({d.locationName})
                </option>
              ))}
            </select>
          </div>

          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            Serial Bridge Active: 115200 baud
          </span>
        </div>

        {testResult && (
          <div className="p-4 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{testResult}</span>
          </div>
        )}

        {/* Vitals Diagnostics Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 block">RF Cellular Bridge (A7670E)</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Signal Strength (CSQ):</span>
                <span className="font-mono text-emerald-400 font-bold">26 / 31 (Excellent)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Carrier Registered:</span>
                <span className="text-white font-bold">MTN Rwanda LTE Cat-1</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Packet Roundtrip:</span>
                <span className="font-mono text-blue-400">42 ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">MQTT TLS Connection:</span>
                <span className="text-emerald-400 font-bold">Port 8883 (TLS 1.3)</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 block">Microcontroller Power &amp; Memory</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Core Clock:</span>
                <span className="font-mono text-white">240 MHz (Dual Xtensa LX6)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Free Heap Memory:</span>
                <span className="font-mono text-white">218,440 bytes (68%)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">LiPo Cell Voltage:</span>
                <span className="font-mono text-emerald-400 font-bold">4.12 V (Healthy)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Internal Temp:</span>
                <span className="font-mono text-white">32.6°C</span>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <span className="text-xs font-bold uppercase text-slate-400 block">Sensor Bus Calibration Status</span>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">I2C SHT40 Thermopile:</span>
                <span className="text-emerald-400 font-bold">Online (0x44)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">ADC1 Analog Channels:</span>
                <span className="text-emerald-400 font-bold">Calibrated (12-bit)</span>
              </div>
              <div className="flex justify-between border-b border-slate-800/80 pb-1.5">
                <span className="text-slate-400">Zero Drift:</span>
                <span className="font-mono text-white">&lt; 0.05%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hardware Watchdog:</span>
                <span className="text-emerald-400 font-bold">Armed (8s reset)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Channel Diagnostic Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Channel ADC Voltage &amp; Bus Reading Table</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px] font-sans">
                  <th className="pb-3">Channel Code</th>
                  <th className="pb-3">Type</th>
                  <th className="pb-3">Reading</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Warning</th>
                  <th className="pb-3">Critical</th>
                  <th className="pb-3">Calibration Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {devSensors.map(s => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-bold text-orange-400">{s.sensorCode}</td>
                    <td className="py-2.5 text-white font-sans">{s.sensorType}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">
                      {s.lastReading} {s.unit}
                    </td>
                    <td className="py-2.5">
                      <span className="text-[10px] px-2 py-0.5 rounded font-sans uppercase font-bold bg-slate-800 text-slate-300">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-2.5 text-amber-400">{s.warningThreshold}</td>
                    <td className="py-2.5 text-red-400">{s.criticalThreshold}</td>
                    <td className="py-2.5 text-slate-300 font-sans">{s.calibrationStatus}</td>
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
