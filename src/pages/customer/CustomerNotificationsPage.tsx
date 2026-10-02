import React from 'react';
import { Bell, CheckCheck, Trash2, AlertTriangle, Info, ShieldAlert } from 'lucide-react';
import { useEmergency } from '../../context/EmergencyContext';

export const CustomerNotificationsPage: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useEmergency();

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-white flex items-center gap-2">
              <Bell className="w-6 h-6 text-orange-400" />
              <span>Notification Center</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Multi-channel safety alerts, system status advisories, and technician maintenance bulletins.
            </p>
          </div>

          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <CheckCheck className="w-4 h-4 text-emerald-400" />
            <span>Mark All as Read</span>
          </button>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800/80 shadow-xl overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">No notifications logged.</div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-4 flex items-start gap-4 transition-colors cursor-pointer ${
                  !n.isRead ? 'bg-slate-800/50 border-l-4 border-orange-500' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0 mt-0.5">
                  {n.severity === 'CRITICAL' ? (
                    <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                  ) : n.severity === 'WARNING' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-400" />
                  ) : (
                    <Info className="w-5 h-5 text-blue-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{n.title}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(n.createdAt).toLocaleTimeString()} ({new Date(n.createdAt).toLocaleDateString()})
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{n.message}</p>
                  {n.metadata && (
                    <div className="flex gap-2 text-[10px] text-slate-400 font-mono pt-1">
                      {n.metadata.locationName && <span>Loc: {n.metadata.locationName}</span>}
                      {n.metadata.deviceCode && <span>&bull; Dev: {n.metadata.deviceCode}</span>}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
