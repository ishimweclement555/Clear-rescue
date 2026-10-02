import React from 'react';
import { ShieldAlert, Flame, MapPin, Phone, Mail, ExternalLink, AlertOctagon, HeartHandshake } from 'lucide-react';

interface FooterProps {
  setCurrentTab: (tab: string) => void;
  openIoTDocs: () => void;
  openSimulator: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentTab, openIoTDocs, openSimulator }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-sm">
      {/* Real-World Safety Disclaimer Banner (Mandated by Requirement 32) */}
      <div className="bg-amber-950/60 border-b border-amber-800/40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-start sm:items-center gap-3">
          <AlertOctagon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <p className="text-xs text-amber-200/90 leading-relaxed">
            <strong className="font-semibold text-amber-300">REGULATORY SAFETY NOTICE:</strong> CLEAR RESCUE AI is an emergency-monitoring prototype platform and intelligent telemetry software system. It does not replace certified fire alarm systems, life-safety gas detectors, certified intruder security installations, or official emergency dispatch services (such as Rwanda National Police Fire &amp; Rescue Brigade or SAMU Ambulance).
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Brand & Regional Mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/30">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-white">
                CLEAR RESCUE <span className="text-orange-500">AI</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pr-6">
              AI-assisted multi-sensor environmental emergency detection and response system engineered for facilities, schools, hospitals, warehouses, and commercial infrastructures across Rwanda and East Africa.
            </p>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Kigali Innovation City &bull; Gasabo District, Kigali, Rwanda</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>Emergency Protocol Hotline: 111 (Rwanda Fire) / +250 788 000 000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>support@clearrescue.rw &bull; contact@clearrescue.ai</span>
              </div>
            </div>
          </div>

          {/* Column 2: Public Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('landing')} className="hover:text-orange-400 transition-colors">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('about')} className="hover:text-orange-400 transition-colors">
                  About Clear Rescue
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('how-it-works')} className="hover:text-orange-400 transition-colors">
                  How It Works
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('features')} className="hover:text-orange-400 transition-colors">
                  Multi-Sensor Features
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('solutions')} className="hover:text-orange-400 transition-colors">
                  Industry Solutions
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('contact')} className="hover:text-orange-400 transition-colors">
                  Contact &amp; Deployment
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Portals & Workflows */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Dashboards</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setCurrentTab('customer-dashboard')} className="hover:text-blue-400 transition-colors">
                  Customer Operations
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('customer-devices')} className="hover:text-blue-400 transition-colors">
                  Device Management
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('customer-alerts')} className="hover:text-red-400 transition-colors">
                  Emergency Alerts
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('technician-dashboard')} className="hover:text-amber-400 transition-colors">
                  Technician Portal
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('admin-dashboard')} className="hover:text-orange-400 transition-colors">
                  Admin Command Center
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('admin-audit')} className="hover:text-orange-400 transition-colors">
                  Security Audit Logs
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Engineering & Hardware */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">IoT Hardware</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={openIoTDocs} className="hover:text-blue-400 transition-colors text-left flex items-center gap-1">
                  <span>ESP32 Microcontroller API</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </button>
              </li>
              <li>
                <button onClick={openSimulator} className="hover:text-orange-400 transition-colors text-left font-medium text-orange-400">
                  ⚡ Live Sensor Simulator
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentTab('admin-reports')} className="hover:text-slate-200 transition-colors">
                  Incident &amp; Uptime Reports
                </button>
              </li>
              <li>
                <a href="/health" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>REST API /health Probe</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} CLEAR RESCUE AI. Built for Rwanda and East Africa.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Platform Core Online &bull; v2.4.1</span>
            </span>
            <span>Made with passion in Kigali</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
