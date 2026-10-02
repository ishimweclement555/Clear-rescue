import React from 'react';
import { ShieldAlert, Award, Globe, Users, CheckCircle2, AlertOctagon, ArrowRight } from 'lucide-react';

interface AboutProps {
  setCurrentTab: (tab: string) => void;
}

export const AboutPage: React.FC<AboutProps> = ({ setCurrentTab }) => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">About Clear Rescue AI</span>
          <h1 className="text-4xl font-extrabold text-white">
            Pioneering Smart Environmental Safety in Rwanda &amp; East Africa
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            CLEAR RESCUE AI was conceived to address critical safety challenges across commercial and institutional buildings where isolated smoke alarms or mechanical detectors fail to provide correlated, actionable intelligence.
          </p>
        </div>

        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center font-bold">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Our East African Mission</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              To build accessible, enterprise-grade emergency telemetry systems engineered for the infrastructure realities of East Africa—leveraging redundant 4G cellular links, LiPo backup battery power for intermittent grid conditions, and intelligent AI correlation to cut through noise.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white">Why Multi-Sensor AI Matters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Traditional alarms frequently trigger false alarms from cooking fumes or dust, causing staff to disable sirens. CLEAR RESCUE AI combines thermal curves, smoke obscuration, and flame optical telemetry to verify legitimate fire events before escalating.
            </p>
          </div>
        </div>

        {/* Real-World Safety Disclaimer Notice (Requirement 32) */}
        <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-800/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertOctagon className="w-5 h-5" />
            <span>Platform Prototype &amp; Operational Safety Boundary</span>
          </div>
          <p className="text-xs text-amber-200/90 leading-relaxed">
            CLEAR RESCUE AI is an intelligent monitoring prototype and software platform. The software assists operators and technicians by synthesizing telemetry. It does <strong>not</strong> claim to replace certified physical fire alarm systems, life-safety toxic gas detectors, or official public emergency services (such as the Rwanda National Police Fire &amp; Rescue Brigade). Real-world deployments require certified sensors and compliance with applicable building codes.
          </p>
        </div>

        {/* Regional Impact Highlights */}
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <h3 className="text-xl font-bold text-white">Built for Rwandan Infrastructure</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="space-y-1.5">
              <span className="font-bold text-orange-400 block text-sm">Dual Carrier Cellular</span>
              <p className="text-slate-400 leading-relaxed">
                Hardware modules switch between MTN Rwanda and Airtel networks to maintain cloud telemetry even during fiber outages.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-blue-400 block text-sm">Localized Emergency Hubs</span>
              <p className="text-slate-400 leading-relaxed">
                Configured with direct protocols for Nyarugenge, Kicukiro, Gasabo, Musanze, and Rubavu dispatch coordination.
              </p>
            </div>
            <div className="space-y-1.5">
              <span className="font-bold text-emerald-400 block text-sm">Offline Autonomous Buffer</span>
              <p className="text-slate-400 leading-relaxed">
                ESP32 controllers store up to 72 hours of telemetry in local SPI flash memory, syncing seamlessly upon reconnection.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentTab('customer-dashboard')}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Explore Customer Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
