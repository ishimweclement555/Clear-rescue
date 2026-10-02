import React from 'react';
import { Cpu, Wifi, Server, Brain, Bell, ShieldCheck, ArrowRight, Radio } from 'lucide-react';

interface HowItWorksProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openIoTDocs: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksProps> = ({
  setCurrentTab,
  openSimulator,
  openIoTDocs,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Physical Sensor Data Collection',
      desc: 'High-precision sensors continuously sample environmental parameters: optical smoke obscuration (EN54-7), thermopile temperature, MOX combustible gas, sub-floor water trace ropes, flame optical infrared, and PIR motion.',
      icon: <Cpu className="w-6 h-6 text-orange-400" />,
      color: 'border-orange-500/30 bg-orange-950/10',
    },
    {
      num: '02',
      title: 'ESP32 Microcontroller Aggregation',
      desc: 'The CLEAR RESCUE AI Unit controller reads digital I2C buses, SPI sensors, and analog channels. Readings are filtered and checked against baseline noise thresholds with zero-drift calibration routines.',
      icon: <Server className="w-6 h-6 text-blue-400" />,
      color: 'border-blue-500/30 bg-blue-950/10',
    },
    {
      num: '03',
      title: 'Encrypted Cellular / Wi-Fi Transport',
      desc: 'Telemetry packets are serialized into JSON and dispatched over 4G LTE or WPA3 Wi-Fi via HTTPS REST (or MQTT TLS 1.3) to the CLEAR RESCUE AI cloud backend with device bearer authorization.',
      icon: <Wifi className="w-6 h-6 text-emerald-400" />,
      color: 'border-emerald-500/30 bg-emerald-950/10',
    },
    {
      num: '04',
      title: 'AI Multi-Sensor Correlation Engine',
      desc: 'Rather than firing alarms on a single sensor spike, the AI engine evaluates correlations (e.g., Smoke + Temp + Flame = Critical Fire; Gas alone = Gas Leak Alert; Water + Humidity = Flooding Risk) and assigns calibrated confidence.',
      icon: <Brain className="w-6 h-6 text-indigo-400" />,
      color: 'border-indigo-500/30 bg-indigo-950/10',
    },
    {
      num: '05',
      title: 'Incident Creation & Smart Notifications',
      desc: 'If thresholds are breached, an emergency incident is opened, activating the dashboard siren banner, notifying facility managers, and dispatching diagnostic logs to assigned field technicians.',
      icon: <Bell className="w-6 h-6 text-red-400" />,
      color: 'border-red-500/30 bg-red-950/10',
    },
    {
      num: '06',
      title: 'Human-in-the-Loop Operational Response',
      desc: 'Operators and technicians review AI explanations, initiate physical verification, coordinate emergency responders (e.g. Rwanda Fire 111), and record audit logs with final resolution.',
      icon: <ShieldCheck className="w-6 h-6 text-teal-400" />,
      color: 'border-teal-500/30 bg-teal-950/10',
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Architecture &amp; Dataflow</span>
          <h1 className="text-4xl font-extrabold text-white">How CLEAR RESCUE AI Works</h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            From physical silicon sensors on the wall to real-time AI reasoning and emergency resolution—engineered end-to-end.
          </p>
        </div>

        {/* Step-by-Step Flow */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {steps.map(s => (
            <div key={s.num} className={`p-6 rounded-2xl border ${s.color} space-y-3`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-black text-slate-600 font-mono">{s.num}</span>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">{s.icon}</div>
              </div>
              <h3 className="text-base font-bold text-white">{s.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Technical Callout */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-bold text-white">Want to test the dataflow right now?</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Transmit custom sensor packets through the backend API or view the ESP32 code template.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={openSimulator}
              className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>Launch Simulator</span>
            </button>
            <button
              onClick={openIoTDocs}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Hardware Specs</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
