import React from 'react';
import {
  ShieldAlert,
  Flame,
  Activity,
  Cpu,
  Brain,
  BellRing,
  BatteryCharging,
  History,
  Building2,
  ArrowRight,
  Radio,
  MapPin,
  CheckCircle2,
  Zap,
  Lock,
  BarChart3,
  Server,
  Terminal,
} from 'lucide-react';

interface LandingPageProps {
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openIoTDocs: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  setCurrentTab,
  openSimulator,
  openIoTDocs,
}) => {
  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 border-b border-slate-900">
        {/* Glow backdrop gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-orange-600/20 via-blue-600/15 to-transparent blur-3xl rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-orange-400 mb-6 shadow-inner">
            <span className="h-2 w-2 rounded-full bg-orange-500 animate-ping" />
            <span>AI-Powered Emergency Detection &amp; Response &bull; Rwanda &amp; East Africa</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight">
            CLEAR RESCUE <span className="text-orange-500">AI</span>
          </h1>

          <p className="mt-4 text-xl sm:text-2xl font-bold text-slate-200 tracking-wide">
            &ldquo;Detect Early. Respond Faster. Protect What Matters.&rdquo;
          </p>

          <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A smart full-stack environmental safety platform connecting IoT sensors, cellular connectivity, cloud telemetry, and AI-assisted multi-sensor correlation to protect facilities across Rwanda and East Africa.
          </p>

          {/* Action CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setCurrentTab('customer-dashboard')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-xl shadow-orange-900/40 hover:shadow-orange-700/50 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentTab('how-it-works')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Explore Platform</span>
            </button>
            <button
              onClick={openSimulator}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-orange-500/40 text-orange-400 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-pulse" />
              <span>Launch Simulator</span>
            </button>
          </div>

          {/* Rwanda Live Deployments Ticker */}
          <div className="mt-16 pt-8 border-t border-slate-900 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Active Nodes</span>
              <span className="text-2xl font-black text-white">4 Units</span>
              <span className="text-[11px] text-emerald-400 block mt-0.5">&bull; Kigali, Masaka, Musanze</span>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Sensors Monitored</span>
              <span className="text-2xl font-black text-orange-400">48 Channels</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Fire, Smoke, Gas, Water</span>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Mean AI Detection</span>
              <span className="text-2xl font-black text-blue-400">&lt; 1.2 sec</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Multi-sensor correlation</span>
            </div>
            <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Cellular Bridge</span>
              <span className="text-2xl font-black text-emerald-400">4G LTE</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Airtel / MTN Fallback</span>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Capabilities (Mandated Sections) */}
      <section className="py-20 bg-slate-950/70 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Engineered for Reliability</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Eight Pillars of Clear Rescue AI</h2>
            <p className="text-sm text-slate-400 mt-2">
              Comprehensive physical monitoring that doesn&apos;t just read one sensor in isolation, but intelligently analyzes environmental patterns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. Emergency Detection */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">1. Emergency Detection</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant identification of fire, dense smoke, thermal spikes, combustible LPG leaks, water floods, and physical perimeter breaches.
              </p>
            </div>

            {/* 2. Real-Time Monitoring */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">2. Real-Time Telemetry</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sub-second sensor streams over 4G cellular and Wi-Fi networks with automated offline failover and heartbeat validation.
              </p>
            </div>

            {/* 3. AI-Assisted Analysis */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">3. AI-Assisted Analysis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cross-correlates multi-sensor inputs to distinguish real emergencies from single-sensor false triggers, returning confidence scores.
              </p>
            </div>

            {/* 4. Smart Alerts */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BellRing className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">4. Smart Alerts</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audible sirens, in-app flashing banners, SMS alerts, and email notifications dispatched instantly to facility managers and responders.
              </p>
            </div>

            {/* 5. Device Health */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">5. Device Health &amp; Diagnostics</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitors LiPo backup battery levels, cellular signal link (CSQ), calibration drift, and firmware status 24/7.
              </p>
            </div>

            {/* 6. Incident History */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <History className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">6. Incident History</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full lifecycle tracking: Open &rarr; Acknowledged &rarr; Investigating &rarr; Resolved &rarr; False Alarm with operator notes.
              </p>
            </div>

            {/* 7. Multi-Location Management */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-blue-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">7. Multi-Location Fleet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Manage multiple buildings from one glass pane—from downtown Kigali office towers to Masaka warehouses and Musanze lodges.
              </p>
            </div>

            {/* 8. Professional Dashboard */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-orange-600/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">8. Role-Based Dashboards</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Dedicated interfaces for Customers, Field Technicians, and Central Administrators with comprehensive CSV report exports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Sectors in Rwanda & East Africa */}
      <section className="py-20 bg-slate-900/30 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Tailored Solutions</span>
            <h2 className="text-3xl font-extrabold text-white mt-1">Protecting Critical Infrastructure</h2>
            <p className="text-sm text-slate-400 mt-2">
              Engineered to meet the exact environmental safety profiles of buildings throughout East Africa.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Offices &amp; Server Rooms</span>
              <h4 className="text-lg font-bold text-white">Commercial Buildings</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Continuous surveillance of electrical distribution panels, server racks, and HVAC shafts against smoldering electrical fires and water leaks.
              </p>
              <div className="pt-2 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Server Rack Sub-floor Water Detection</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Off-Hours Security &amp; Door Monitoring</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Logistics &amp; Manufacturing</span>
              <h4 className="text-lg font-bold text-white">Warehouses &amp; Depots</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                High-ceiling smoke obscuration tracking, volatile chemical vapors, and thermal runaway monitoring in storage bays like Masaka Hub.
              </p>
              <div className="pt-2 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Wide-Area Optical Smoke Sampling</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Battery &amp; Backup Generator Room Safety</div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Hospitality &amp; Education</span>
              <h4 className="text-lg font-bold text-white">Schools &amp; Hotels</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Commercial kitchen LPG gas leak detection, science laboratory chemical tracking, and dormitory safety at campuses like Green Hills Academy.
              </p>
              <div className="pt-2 text-xs text-slate-300 space-y-1">
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Fast LPG / Hydrocarbon Gas Shutoff Warnings</div>
                <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Evacuation Acoustic Sound Verification</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulator / Developer Callout */}
      <section className="py-16 bg-gradient-to-r from-orange-950/40 via-slate-900 to-blue-950/40 border-b border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex p-3 rounded-2xl bg-orange-600/20 text-orange-400 mb-2">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Experience the Live IoT Sensor Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t just view static graphs. Use our interactive hardware simulator to transmit live telemetry into the database, trigger AI multi-sensor correlation, and observe real-time emergency incidents.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={openSimulator}
              className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>Open Sensor Simulator</span>
            </button>
            <button
              onClick={openIoTDocs}
              className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Inspect Hardware REST / MQTT API</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
