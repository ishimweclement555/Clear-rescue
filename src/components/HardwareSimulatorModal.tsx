import React, { useState } from 'react';
import {
  X,
  Play,
  Flame,
  Wind,
  Thermometer,
  Fuel,
  Droplets,
  DoorOpen,
  Eye,
  BatteryLow,
  WifiOff,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Send,
  Radio,
  Cpu,
} from 'lucide-react';
import { useEmergency, SimulationScenario } from '../context/EmergencyContext';
import { SensorType } from '../types';

interface SimulatorProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HardwareSimulatorModal: React.FC<SimulatorProps> = ({ isOpen, onClose }) => {
  const { devices, selectedDeviceId, setSelectedDeviceId, injectSimulation, updateSensorReading, sensors } =
    useEmergency();

  const [loadingScenario, setLoadingScenario] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Manual slider states
  const [customSmoke, setCustomSmoke] = useState<number>(0.8);
  const [customTemp, setCustomTemp] = useState<number>(23.5);
  const [customGas, setCustomGas] = useState<number>(14);
  const [customFire, setCustomFire] = useState<number>(0);
  const [customWater, setCustomWater] = useState<number>(0);
  const [customDoor, setCustomDoor] = useState<number>(0);
  const [customMotion, setCustomMotion] = useState<number>(0);

  if (!isOpen) return null;

  const currentDevice = devices.find(d => d.id === selectedDeviceId) || devices[0];
  const currentDeviceSensors = sensors.filter(s => s.deviceId === currentDevice?.id);

  const handleScenario = async (scenario: SimulationScenario, name: string) => {
    setLoadingScenario(name);
    setSuccessMessage(null);
    try {
      await injectSimulation(scenario, currentDevice?.id);
      setSuccessMessage(`Telemetry payload injected for ${currentDevice?.deviceCode}: ${name}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingScenario(null);
    }
  };

  const handleSendCustomTelemetry = async () => {
    setLoadingScenario('Custom Telemetry');
    try {
      const readings = [
        { sensorType: 'SMOKE', value: Number(customSmoke) },
        { sensorType: 'TEMPERATURE', value: Number(customTemp) },
        { sensorType: 'GAS', value: Number(customGas) },
        { sensorType: 'FIRE', value: Number(customFire) },
        { sensorType: 'WATER', value: Number(customWater) },
        { sensorType: 'DOOR', value: Number(customDoor) },
        { sensorType: 'MOTION', value: Number(customMotion) },
      ];

      await fetch('/api/sensor-readings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceCode: currentDevice?.deviceCode,
          readings,
        }),
      });

      // Update in local context as well
      for (const item of readings) {
        const sensor = currentDeviceSensors.find(s => s.sensorType === item.sensorType);
        if (sensor) {
          await updateSensorReading(sensor.id, item.value);
        }
      }

      setSuccessMessage(`Custom multi-sensor packet sent to /api/sensor-readings for ${currentDevice?.deviceCode}`);
      setTimeout(() => setSuccessMessage(null), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingScenario(null);
    }
  };

  const presetScenarios: {
    title: string;
    scenario: SimulationScenario;
    desc: string;
    icon: React.ReactNode;
    color: string;
  }[] = [
    {
      title: 'Nominal Safety (Normal)',
      scenario: 'NORMAL',
      desc: 'Smoke <1.0%, Temp ~23°C, Gas ~14ppm, Dry water probes, closed access door.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      color: 'hover:border-emerald-500/50 bg-slate-900/80',
    },
    {
      title: 'Catastrophic Fire (Combined)',
      scenario: 'FIRE_COMBINED',
      desc: 'Simultaneous flame optical trigger, 8.6% smoke, and 78.5°C thermal spike.',
      icon: <Flame className="w-5 h-5 text-red-500" />,
      color: 'hover:border-red-500/50 bg-red-950/20',
    },
    {
      title: 'Incipient Smoke Increase',
      scenario: 'SMOKE_SURGE',
      desc: 'Smoldering combustion particle rise to 6.2% obs/m in optical chamber.',
      icon: <Wind className="w-5 h-5 text-amber-400" />,
      color: 'hover:border-amber-500/50 bg-slate-900/80',
    },
    {
      title: 'Thermal Heat Surge',
      scenario: 'TEMP_SPIKE',
      desc: 'Rapid ambient temperature rise to 62.0°C exceeding critical threshold.',
      icon: <Thermometer className="w-5 h-5 text-orange-400" />,
      color: 'hover:border-orange-500/50 bg-slate-900/80',
    },
    {
      title: 'LPG / Gas Vapor Leak',
      scenario: 'GAS_LEAK',
      desc: 'Catalytic bead gas sensor registers 240 ppm combustible hydrocarbon vapor.',
      icon: <Fuel className="w-5 h-5 text-amber-500" />,
      color: 'hover:border-amber-500/50 bg-slate-900/80',
    },
    {
      title: 'Water Leak & Flooding',
      scenario: 'WATER_FLOOD',
      desc: 'Sub-floor conductive probe triggers wet contact with 88% relative humidity.',
      icon: <Droplets className="w-5 h-5 text-blue-400" />,
      color: 'hover:border-blue-500/50 bg-slate-900/80',
    },
    {
      title: 'Perimeter Door Forced Open',
      scenario: 'DOOR_BREACH',
      desc: 'Magnetic reed switch opens accompanied by active motion and high sound decibels.',
      icon: <DoorOpen className="w-5 h-5 text-purple-400" />,
      color: 'hover:border-purple-500/50 bg-slate-900/80',
    },
    {
      title: 'Motion Intrusion',
      scenario: 'MOTION_INTRUSION',
      desc: 'PIR motion detection triggered in secured zone during off-hours.',
      icon: <Eye className="w-5 h-5 text-indigo-400" />,
      color: 'hover:border-indigo-500/50 bg-slate-900/80',
    },
    {
      title: 'Critical Low Battery (8%)',
      scenario: 'LOW_BATTERY',
      desc: 'Internal backup battery level drops below safe threshold (8%).',
      icon: <BatteryLow className="w-5 h-5 text-amber-500" />,
      color: 'hover:border-amber-500/50 bg-slate-900/80',
    },
    {
      title: 'Device Loss of Connection',
      scenario: 'DEVICE_OFFLINE',
      desc: 'Simulate cellular modem disconnection or tower blackout (0 CSQ).',
      icon: <WifiOff className="w-5 h-5 text-red-400" />,
      color: 'hover:border-red-500/50 bg-slate-900/80',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                IoT Sensor Telemetry Simulator
                <span className="text-[10px] bg-orange-600 text-white font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Live Hardware API Mode
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Transmits real sensor data packets via <code className="text-orange-300">POST /api/sensor-readings</code> and evaluates the AI emergency engine.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Target Device Selector */}
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Target Monitoring Device:
              </label>
              <select
                value={selectedDeviceId}
                onChange={e => setSelectedDeviceId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-sm font-semibold rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
              >
                {devices.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.deviceCode} — {d.name} ({d.locationName})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Connection</span>
                <span className="font-semibold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  {currentDevice?.connectionType} (Online)
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Battery</span>
                <span className="font-semibold text-white">{currentDevice?.batteryLevel}%</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px] uppercase">Firmware</span>
                <span className="font-mono text-slate-300">{currentDevice?.firmwareVersion}</span>
              </div>
            </div>
          </div>

          {/* Success / Status Notification */}
          {successMessage && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-600/50 rounded-xl text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Preset Scenarios Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                1. One-Click Emergency Simulation Presets
              </h4>
              <span className="text-[11px] text-slate-500">
                Triggers database updates &amp; multi-sensor AI reasoning
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {presetScenarios.map(p => (
                <div
                  key={p.scenario}
                  className={`p-3.5 rounded-xl border border-slate-800 transition-all ${p.color} flex flex-col justify-between`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-slate-800/80 shrink-0 mt-0.5">{p.icon}</div>
                    <div>
                      <h5 className="text-xs font-bold text-white">{p.title}</h5>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{p.desc}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-800/60 flex justify-end">
                    <button
                      onClick={() => handleScenario(p.scenario, p.title)}
                      disabled={loadingScenario !== null}
                      className="px-3 py-1 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {loadingScenario === p.title ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>Inject Scenario</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Manual Telemetry Sliders Section */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>2. Manual Telemetry Packet Synthesizer</span>
              </h4>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Custom Multi-Sensor Testing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {/* Smoke Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Smoke (% obs/m):</span>
                  <span className="font-bold text-white">{customSmoke}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.1"
                  value={customSmoke}
                  onChange={e => setCustomSmoke(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Temp Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Temperature (°C):</span>
                  <span className="font-bold text-white">{customTemp}°C</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="95"
                  step="0.5"
                  value={customTemp}
                  onChange={e => setCustomTemp(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Gas Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Gas (ppm):</span>
                  <span className="font-bold text-white">{customGas} ppm</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="400"
                  step="5"
                  value={customGas}
                  onChange={e => setCustomGas(parseFloat(e.target.value))}
                  className="w-full accent-orange-500 cursor-pointer"
                />
              </div>

              {/* Fire Flame Optical */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Flame Detector:</span>
                  <span className="font-bold text-white">{customFire === 1 ? 'TRIGGERED (1)' : 'CLEAR (0)'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomFire(0)}
                    className={`flex-1 py-1 rounded text-xs font-semibold ${
                      customFire === 0 ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    No Flame
                  </button>
                  <button
                    onClick={() => setCustomFire(1)}
                    className={`flex-1 py-1 rounded text-xs font-semibold ${
                      customFire === 1 ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Flame Detected
                  </button>
                </div>
              </div>

              {/* Water Ingress Probe */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Water Sensor:</span>
                  <span className="font-bold text-white">{customWater === 1 ? 'WET (1)' : 'DRY (0)'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomWater(0)}
                    className={`flex-1 py-1 rounded text-xs font-semibold ${
                      customWater === 0 ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Dry Contact
                  </button>
                  <button
                    onClick={() => setCustomWater(1)}
                    className={`flex-1 py-1 rounded text-xs font-semibold ${
                      customWater === 1 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Water Present
                  </button>
                </div>
              </div>

              {/* Door & Motion */}
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400">
                  <span>Door / Access Latch:</span>
                  <span className="font-bold text-white">{customDoor === 1 ? 'OPEN (1)' : 'CLOSED (0)'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCustomDoor(0)}
                    className={`flex-1 py-1 rounded text-xs font-semibold ${
                      customDoor === 0 ? 'bg-slate-700 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Closed
                  </button>
                  <button
                    onClick={() => setCustomDoor(1)}
                    className={`flex-1 py-1 rounded text-xs font-semibold ${
                      customDoor === 1 ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    Door Opened
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={handleSendCustomTelemetry}
                disabled={loadingScenario !== null}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-orange-950/40"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Transmit Custom Telemetry Packet &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
