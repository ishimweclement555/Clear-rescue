import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    facilityType: 'Office',
    location: 'Kigali',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Deployment &amp; Support</span>
          <h1 className="text-4xl font-extrabold text-white">Contact CLEAR RESCUE AI</h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Connect with our engineering and deployment team in Kigali for facility safety assessments, pilot unit deployments, or technician support across East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Card */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-orange-400" />
                <span>Kigali Headquarters</span>
              </h3>
              <div className="space-y-3 text-xs text-slate-300">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Central Operations Center</span>
                    <p className="text-slate-400">Kigali Innovation Hub, Gasabo District, Kigali, Rwanda</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Technical Support</span>
                    <p className="text-slate-400">+250 788 000 000 / +250 788 123 456</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Email Dispatch</span>
                    <p className="text-slate-400">support@clearrescue.rw &bull; contact@clearrescue.ai</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Emergency Hotlines (Rwanda)</h4>
              <ul className="text-xs text-slate-300 space-y-1.5 font-medium">
                <li className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span>Fire &amp; Rescue Brigade:</span>
                  <span className="font-bold text-red-400">111</span>
                </li>
                <li className="flex justify-between border-b border-slate-800/60 pb-1">
                  <span>Rwanda National Police:</span>
                  <span className="font-bold text-blue-400">112</span>
                </li>
                <li className="flex justify-between">
                  <span>SAMU Ambulance Service:</span>
                  <span className="font-bold text-emerald-400">912</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 p-8 rounded-2xl bg-slate-900 border border-slate-800">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-600/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Thank you for reaching out. Our facility assessment team in Kigali will review your specifications and contact you within 24 business hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-base font-bold text-white mb-2">Request Hardware Pilot or Facility Survey</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Jean-Paul Mugisha"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Organization / Facility *</label>
                    <input
                      type="text"
                      required
                      value={formData.organization}
                      onChange={e => setFormData({ ...formData, organization: e.target.value })}
                      placeholder="e.g. Kigali Logistics Ltd"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@organization.rw"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Phone (Rwanda / EA) *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+250 788 000 000"
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">Building Category</label>
                    <select
                      value={formData.facilityType}
                      onChange={e => setFormData({ ...formData, facilityType: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Office">Commercial Office Building</option>
                      <option value="Warehouse">Logistics &amp; Storage Warehouse</option>
                      <option value="School">School / Educational Campus</option>
                      <option value="Hotel">Hotel / Hospitality Resort</option>
                      <option value="Factory">Factory / Agro-Processing</option>
                      <option value="Residential">Residential Estate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1 font-semibold">District / Province</label>
                    <select
                      value={formData.location}
                      onChange={e => setFormData({ ...formData, location: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="Kigali-Nyarugenge">Kigali - Nyarugenge</option>
                      <option value="Kigali-Gasabo">Kigali - Gasabo</option>
                      <option value="Kigali-Kicukiro">Kigali - Kicukiro</option>
                      <option value="Northern-Musanze">Northern Province - Musanze</option>
                      <option value="Western-Rubavu">Western Province - Rubavu</option>
                      <option value="Eastern-Rwamagana">Eastern Province - Rwamagana</option>
                      <option value="Southern-Huye">Southern Province - Huye</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-slate-400 mb-1 font-semibold">Monitoring Requirements / Notes</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe rooms to monitor (e.g., server room, kitchen gas lines, chemicals, battery vaults)..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white placeholder-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Deployment Request</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
