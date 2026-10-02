import React from 'react';
import {
  Flame,
  Wind,
  Thermometer,
  Fuel,
  Droplets,
  DoorOpen,
  Eye,
  Mic,
  Battery,
  Wifi,
  CloudRain,
  Gauge,
  Sliders,
  CheckCircle,
} from 'lucide-react';

interface FeaturesProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
}

export const FeaturesPage: React.FC<FeaturesProps> = ({ setCurrentTab, openSimulator }) => {
  const sensorCatalog = [
    {
      type: 'FIRE (Flame Optical)',
      icon: <Flame className="w-6 h-6 text-red-500" />,
      unit: 'Flame (0/1)',
      threshold: 'Warning: 0.5 | Critical: 1.0',
      description: 'Dual-band infrared optical flame receiver detecting 760nm–1100nm radiation from combustion with microsecond response.',
    },
    {
      type: 'SMOKE (Obscuration)',
      icon: <Wind className="w-6 h-6 text-amber-400" />,
      unit: '% obs/m',
      threshold: 'Warning: 2.5% | Critical: 5.0%',
      description: 'Photoelectric light-scattering chamber built in conformance with EN 54-7 international fire alarm standards.',
    },
    {
      type: 'TEMPERATURE (Thermal)',
      icon: <Thermometer className="w-6 h-6 text-orange-400" />,
      unit: '°C (Celsius)',
      threshold: 'Warning: 45°C | Critical: 60°C',
      description: 'High-precision digital thermopile sensor (Sensirion SHT40) with ±0.2°C accuracy and rate-of-rise heat analysis.',
    },
    {
      type: 'GAS (LPG / Hydrocarbons)',
      icon: <Fuel className="w-6 h-6 text-amber-500" />,
      unit: 'ppm (Parts per million)',
      threshold: 'Warning: 80 ppm | Critical: 200 ppm',
      description: 'Electrochemical and metal oxide catalytic bead sensor detecting combustible gas leaks, methane, butane, and carbon monoxide.',
    },
    {
      type: 'WATER (Conductive Probe)',
      icon: <Droplets className="w-6 h-6 text-blue-400" />,
      unit: 'Wet Contact (0/1)',
      threshold: 'Warning: 0.5 | Critical: 1.0',
      description: 'Gold-plated conductive trace sensing rope and sub-floor probes for server rooms, HVAC drip pans, and water pipe manifolds.',
    },
    {
      type: 'DOOR (Access Latch)',
      icon: <DoorOpen className="w-6 h-6 text-purple-400" />,
      unit: 'Open / Ajar (0/1)',
      threshold: 'Warning: 0.5 | Critical: 1.0',
      description: 'Hermetic magnetic reed switch detecting unauthorized door openings, emergency exit tampering, and security breaches.',
    },
    {
      type: 'MOTION (PIR Intrusion)',
      icon: <Eye className="w-6 h-6 text-indigo-400" />,
      unit: 'Activity (0/1)',
      threshold: 'Warning: 0.5 | Critical: 1.0',
      description: 'Fresnel lens quad-element Passive Infrared (PIR) detector tracking physical human movement across monitored sectors.',
    },
    {
      type: 'SOUND (Acoustic Pressure)',
      icon: <Mic className="w-6 h-6 text-pink-400" />,
      unit: 'dB(A)',
      threshold: 'Warning: 85 dB | Critical: 105 dB',
      description: 'MEMS microphone with frequency filters targeting sharp glass breakage frequencies, structural impact, or explosive acoustic transients.',
    },
    {
      type: 'HUMIDITY (Vapor)',
      icon: <CloudRain className="w-6 h-6 text-teal-400" />,
      unit: '% RH',
      threshold: 'Warning: 80% | Critical: 92%',
      description: 'Capacitive polymer hygrometer tracking ambient moisture, dampness buildup, and correlating with sub-floor pipe leaks.',
    },
    {
      type: 'AIR QUALITY (PM2.5/VOC)',
      icon: <Gauge className="w-6 h-6 text-emerald-400" />,
      unit: 'AQI Index',
      threshold: 'Warning: 100 AQI | Critical: 200 AQI',
      description: 'Laser particulate scattering sensor measuring microscopic airborne dust and volatile organic combustion compounds.',
    },
    {
      type: 'BATTERY (LiPo Power)',
      icon: <Battery className="w-6 h-6 text-amber-400" />,
      unit: '% Capacity',
      threshold: 'Warning: 25% | Critical: 15%',
      description: 'Coulomb-counting battery fuel gauge ensuring uninterrupted multi-day operation during power grid outages or sabotage.',
    },
    {
      type: 'CONNECTIVITY (Cellular/Wi-Fi)',
      icon: <Wifi className="w-6 h-6 text-blue-400" />,
      unit: 'CSQ Signal',
      threshold: 'Warning: 12 CSQ | Critical: 6 CSQ',
      description: 'Real-time carrier signal strength monitoring with dual-SIM automatic failover between MTN and Airtel Rwanda networks.',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">12 Connected Sensor Channels</span>
          <h1 className="text-4xl font-extrabold text-white">Full-Spectrum Environmental Sensing</h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every CLEAR RESCUE AI unit supports a standardized 12-channel sensor bus with individually configurable warning and emergency thresholds.
          </p>
        </div>

        {/* Sensor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sensorCatalog.map(s => (
            <div
              key={s.type}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="p-2.5 rounded-xl bg-slate-800/80">{s.icon}</div>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                    {s.unit}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white">{s.type}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{s.description}</p>
              </div>
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-amber-400 font-mono block">
                  {s.threshold}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Configurable Threshold Notice (Requirement 8) */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-4">
          <Sliders className="w-6 h-6 text-orange-400 shrink-0 mt-1" />
          <div className="space-y-1 text-xs">
            <h4 className="font-bold text-white text-sm">Configurable Safety Thresholds (No Fixed Assumptions)</h4>
            <p className="text-slate-400 leading-relaxed">
              In accordance with Requirement 8, CLEAR RESCUE AI does not assume universal safety thresholds. Every threshold is stored as a configurable calibration value that administrators and technicians can calibrate according to local building room size, air ventilation, and applicable industry guidelines.
            </p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={openSimulator}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all cursor-pointer"
          >
            Test These Sensors in the Simulator &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
