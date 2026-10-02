import React from 'react';
import { Building2, Warehouse, GraduationCap, Hotel, Factory, Home, CheckCircle2, ArrowRight } from 'lucide-react';

interface SolutionsProps {
  setCurrentTab: (tab: string) => void;
}

export const SolutionsPage: React.FC<SolutionsProps> = ({ setCurrentTab }) => {
  const sectors = [
    {
      title: 'Commercial Offices & Banks',
      icon: <Building2 className="w-8 h-8 text-orange-400" />,
      desc: 'Server rooms, electrical panels, executive floors, and multi-tenant high-rises in urban business districts like Kigali CBD.',
      benefits: [
        'Sub-floor server moisture & cooling monitoring',
        'Smoldering electrical conduit smoke detection',
        'Off-hours perimeter door and motion tracking',
      ],
    },
    {
      title: 'Logistics Warehouses & Depots',
      icon: <Warehouse className="w-8 h-8 text-blue-400" />,
      desc: 'Large footprint industrial facilities like Masaka Logistics Zone requiring high-bay smoke obscuration and battery room safety.',
      benefits: [
        'Volatile solvent & chemical gas leak warning',
        'Forklift battery charging thermal runaway detection',
        'Dual 4G cellular links covering peripheral perimeter zones',
      ],
    },
    {
      title: 'Schools & Universities',
      icon: <GraduationCap className="w-8 h-8 text-emerald-400" />,
      desc: 'Academic campuses such as Green Hills Academy requiring student dormitory fire surveillance and science chemistry lab gas sensors.',
      benefits: [
        'Science lab Bunsen burner & gas line shutoff alerts',
        'Dormitory corridor optical smoke detection',
        'Instant multi-channel notifications to safety officers',
      ],
    },
    {
      title: 'Hotels & Eco-Tourism Lodges',
      icon: <Hotel className="w-8 h-8 text-purple-400" />,
      desc: 'Hospitality establishments such as Musanze mountain lodges with commercial kitchens, guest chalets, and backup diesel generator vaults.',
      benefits: [
        'Commercial kitchen LPG gas leak early warning',
        'Generator room fuel vapor & thermal heat sensors',
        'Discreet, professional aesthetic matching eco-design',
      ],
    },
    {
      title: 'Manufacturing & Agro-Processing',
      icon: <Factory className="w-8 h-8 text-amber-400" />,
      desc: 'Coffee washing stations, tea processing plants, and food manufacturing facilities with high humidity and dust environments.',
      benefits: [
        'Dust-filtered optical smoke obscuration chambers',
        'Boiler and dryer thermal runaway thresholds',
        'Technician preventive maintenance ticketing pipeline',
      ],
    },
    {
      title: 'High-Value Residential Estates',
      icon: <Home className="w-8 h-8 text-teal-400" />,
      desc: 'Gated residential communities and embassies in Nyarutarama and Kacyiru requiring integrated environmental security.',
      benefits: [
        'Kitchen cooking gas and smoke correlation',
        'Basement sump pump and flood ingress probes',
        'Direct family and property manager smartphone alerts',
      ],
    },
  ];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Industry Solutions</span>
          <h1 className="text-4xl font-extrabold text-white">Customized Protection by Facility Type</h1>
          <p className="text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Every building presents unique safety hazards. CLEAR RESCUE AI dynamically adjusts threshold baselines and multi-sensor correlations based on facility classification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map(s => (
            <div
              key={s.title}
              className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-orange-500/40 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-slate-800/80 w-fit">{s.icon}</div>
                <h3 className="text-base font-bold text-white">{s.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{s.desc}</p>
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  {s.benefits.map((b, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <button
            onClick={() => setCurrentTab('contact')}
            className="px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-900/40 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Request Facility Assessment in Rwanda</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
