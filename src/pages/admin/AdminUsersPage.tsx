import React, { useState } from 'react';
import { Users, Plus, CheckCircle2, ShieldCheck, Mail, Phone, Edit2, Trash2 } from 'lucide-react';
import { UserRole } from '../../types';

interface DemoUserRecord {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  phone: string;
  status: 'ACTIVE' | 'DISABLED';
}

export const AdminUsersPage: React.FC = () => {
  const [usersList, setUsersList] = useState<DemoUserRecord[]>([
    {
      id: 'usr-1',
      name: 'Clement Ishimwe',
      email: 'ishimweclement537@gmail.com',
      role: 'admin',
      organization: 'CLEAR RESCUE AI - Central Command',
      phone: '+250 788 555 777',
      status: 'ACTIVE',
    },
    {
      id: 'usr-2',
      name: 'Aline Mukamana',
      email: 'admin.super@clearrescue.rw',
      role: 'superadmin',
      organization: 'CLEAR RESCUE AI Global',
      phone: '+250 788 999 000',
      status: 'ACTIVE',
    },
    {
      id: 'usr-3',
      name: 'Emmanuel Nshimiyimana',
      email: 'emmanuel.tech@clearrescue.rw',
      role: 'technician',
      organization: 'CLEAR RESCUE Field Support',
      phone: '+250 788 987 654',
      status: 'ACTIVE',
    },
    {
      id: 'usr-4',
      name: 'Patrick Habimana',
      email: 'patrick.tech@clearrescue.rw',
      role: 'technician',
      organization: 'CLEAR RESCUE Field Support',
      phone: '+250 788 876 543',
      status: 'ACTIVE',
    },
    {
      id: 'usr-5',
      name: 'Jean-Paul Mugisha',
      email: 'facilities@kigalihq.rw',
      role: 'customer',
      organization: 'Kigali Holdings Ltd',
      phone: '+250 788 123 456',
      status: 'ACTIVE',
    },
    {
      id: 'usr-6',
      name: 'Grace Uwase',
      email: 'manager@musanzelodge.rw',
      role: 'customer',
      organization: 'Musanze Mountain Eco-Lodge',
      phone: '+250 788 456 789',
      status: 'ACTIVE',
    },
  ]);

  const toggleStatus = (id: string) => {
    setUsersList(prev =>
      prev.map(u =>
        u.id === id ? { ...u, status: u.status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' } : u
      )
    );
  };

  const changeRole = (id: string, role: UserRole) => {
    setUsersList(prev => prev.map(u => (u.id === id ? { ...u, role } : u)));
  };

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-400" />
              <span>User &amp; Role-Based Access Control (RBAC)</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Manage platform roles across Customer, Field Technician, Admin, and Super Admin tiers.
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 text-[11px]">
                  <th className="py-3 px-4">User Name</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Organization</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Assigned Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {usersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold text-xs">
                        {u.name[0]}
                      </div>
                      <span>{u.name}</span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5 px-4 text-slate-400">{u.organization}</td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">{u.phone}</td>
                    <td className="py-3.5 px-4">
                      <select
                        value={u.role}
                        onChange={e => changeRole(u.id, e.target.value as UserRole)}
                        className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-white font-bold text-[11px] focus:outline-none focus:border-orange-500 uppercase"
                      >
                        <option value="customer">Customer</option>
                        <option value="technician">Technician</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.status === 'ACTIVE'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="text-xs text-slate-400 hover:text-white font-semibold underline cursor-pointer"
                      >
                        {u.status === 'ACTIVE' ? 'Disable' : 'Enable'}
                      </button>
                    </td>
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
