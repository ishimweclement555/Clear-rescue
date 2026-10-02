import React, { useState } from 'react';
import { MapPin, Plus, Building2, Phone, User, CheckCircle2 } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const AdminLocationsPage: React.FC = () => {
  const { locations, devices } = useEmergency();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center gap-2">
            <MapPin className="w-6 h-6 text-purple-400" />
            <span>Monitored Locations &amp; Facilities Grid</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Regional safety sites across Kigali City, Northern Province, and Western Province corridors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map(loc => {
            const locDevices = devices.filter(d => d.locationId === loc.id);

            return (
              <div key={loc.id} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400 bg-orange-950/60 border border-orange-600/30 px-2 py-0.5 rounded">
                      {loc.buildingType} Facility
                    </span>
                    <h3 className="text-lg font-bold text-white mt-1.5">{loc.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{loc.address}</p>
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-300 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                    {locDevices.length} Hardware Units
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">District / Province</span>
                    <span className="font-bold text-white block mt-0.5">
                      {loc.district}, {loc.province}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block">Country</span>
                    <span className="font-bold text-white block mt-0.5">{loc.country}</span>
                  </div>
                  <div className="col-span-2 pt-1 border-t border-slate-900">
                    <span className="text-[10px] text-slate-500 uppercase block">Onsite Safety Contact</span>
                    <span className="font-medium text-slate-300 block mt-0.5">
                      {loc.contactPerson} &bull; {loc.contactPhone}
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-500 text-[11px]">Hardware Nodes Assigned:</span>
                  <span className="font-mono text-orange-400 font-bold">
                    {locDevices.map(d => d.deviceCode).join(', ') || 'None'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
