import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  Bell,
  Cpu,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Radio,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEmergency } from '../context/EmergencyContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  openSimulator: () => void;
  openIoTDocs: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  openSimulator,
  openIoTDocs,
}) => {
  const { user, logout, switchRole, isCustomer, isTechnician, isAdmin } = useAuth();
  const { activeEmergency, notifications, markNotificationRead } = useEmergency();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const rolesList: { label: string; role: UserRole; color: string }[] = [
    { label: 'Customer', role: 'customer', color: 'bg-emerald-500' },
    { label: 'Technician', role: 'technician', color: 'bg-amber-500' },
    { label: 'Admin', role: 'admin', color: 'bg-orange-600' },
    { label: 'Super Admin', role: 'superadmin', color: 'bg-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-lg">
      {/* Top emergency status pill ticker if emergency is active */}
      {activeEmergency && (
        <div className="bg-red-600 text-white px-4 py-1.5 text-xs font-semibold flex items-center justify-between animate-pulse">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-white animate-ping" />
            <span>
              🚨 CRITICAL ALERT ACTIVE: {activeEmergency.eventType} at {activeEmergency.locationName} ({activeEmergency.deviceCode})
            </span>
          </div>
          <button
            onClick={() => setCurrentTab('customer-alerts')}
            className="underline hover:text-red-100 cursor-pointer text-xs"
          >
            Open Emergency Response View &rarr;
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setCurrentTab('landing')}
          className="flex items-center gap-3 cursor-pointer select-none group"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
            <ShieldAlert className="w-6 h-6 text-white" />
            <Flame className="w-3.5 h-3.5 text-amber-200 absolute -bottom-0.5 -right-0.5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-wider text-white">CLEAR RESCUE</span>
              <span className="bg-orange-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded tracking-widest">
                AI
              </span>
            </div>
            <span className="text-[10px] text-slate-400 block -mt-1 font-medium tracking-tight">
              Emergency Detection & Response &bull; Rwanda &amp; EA
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={() => setCurrentTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentTab === 'landing' ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentTab('about')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentTab === 'about' ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setCurrentTab('features')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentTab === 'features' ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Features
          </button>
          <button
            onClick={() => setCurrentTab('solutions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              currentTab === 'solutions' ? 'bg-orange-500/20 text-orange-400 font-semibold' : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            Solutions
          </button>

          <span className="h-4 w-px bg-slate-800 mx-2" />

          {/* Role-based Portals */}
          <button
            onClick={() => setCurrentTab('customer-dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
              currentTab.startsWith('customer')
                ? 'bg-blue-600/20 text-blue-400 font-semibold border border-blue-500/30'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            Customer Portal
          </button>

          {(isTechnician || isAdmin) && (
            <button
              onClick={() => setCurrentTab('technician-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentTab.startsWith('technician')
                  ? 'bg-amber-600/20 text-amber-400 font-semibold border border-amber-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              Technician Portal
            </button>
          )}

          {isAdmin && (
            <button
              onClick={() => setCurrentTab('admin-dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                currentTab.startsWith('admin')
                  ? 'bg-orange-600/20 text-orange-400 font-semibold border border-orange-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-orange-400" />
              Admin Center
            </button>
          )}
        </nav>

        {/* Right Action Tools: Simulator, IoT Specs, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hardware Simulator Trigger Button */}
          <button
            onClick={openSimulator}
            className="flex items-center gap-1.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-orange-900/30 transition-all cursor-pointer active:scale-95"
            title="Inject simulated sensor conditions like smoke, temperature rise, gas leaks, or water flood"
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden sm:inline">Sensor Simulator</span>
          </button>

          {/* IoT Hardware Integration Specs Trigger */}
          <button
            onClick={openIoTDocs}
            className="hidden md:flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer"
            title="View ESP32, 4G, and MQTT hardware integration architecture"
          >
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            <span>IoT Hardware API</span>
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {notifDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    System Alerts &amp; Notifications
                  </h4>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full">
                    {unreadCount} unread
                  </span>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-800/60">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-500">No active notifications</div>
                  ) : (
                    notifications.slice(0, 8).map(n => (
                      <div
                        key={n.id}
                        onClick={() => markNotificationRead(n.id)}
                        className={`p-3 text-xs hover:bg-slate-800/60 cursor-pointer transition-colors ${
                          !n.isRead ? 'bg-slate-800/40 border-l-2 border-orange-500' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {n.severity === 'CRITICAL' ? (
                            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                          ) : n.severity === 'WARNING' ? (
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          )}
                          <div className="flex-1">
                            <p className="font-semibold text-slate-200">{n.title}</p>
                            <p className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[9px] text-slate-500 mt-1 block">
                              {new Date(n.createdAt).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="px-3 py-2 border-t border-slate-800 text-center">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(false);
                      setCurrentTab('customer-notifications');
                    }}
                    className="text-xs text-orange-400 hover:text-orange-300 font-medium"
                  >
                    View All Notifications &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 cursor-pointer transition-colors"
            >
              <div className="w-5 h-5 rounded-full bg-orange-600/30 text-orange-400 border border-orange-500/40 flex items-center justify-center font-bold text-[10px]">
                {user?.displayName ? user.displayName[0] : 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <span className="block font-semibold text-xs leading-none text-slate-200">
                  {user?.displayName || 'User'}
                </span>
                <span className="text-[10px] text-orange-400 uppercase font-black tracking-wider">
                  {user?.role || 'Customer'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current User</p>
                  <p className="text-xs font-semibold text-white truncate">{user?.displayName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Demo Role Switcher
                  </p>
                  <div className="space-y-1">
                    {rolesList.map(r => (
                      <button
                        key={r.role}
                        onClick={() => {
                          switchRole(r.role);
                          setRoleDropdownOpen(false);
                          if (r.role === 'customer') setCurrentTab('customer-dashboard');
                          if (r.role === 'technician') setCurrentTab('technician-dashboard');
                          if (r.role === 'admin' || r.role === 'superadmin') setCurrentTab('admin-dashboard');
                        }}
                        className={`w-full flex items-center justify-between px-2 py-1.5 rounded text-xs transition-colors ${
                          user?.role === r.role ? 'bg-slate-800 font-bold text-white' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${r.color}`} />
                          <span>{r.label}</span>
                        </div>
                        {user?.role === r.role && <CheckCircle2 className="w-3.5 h-3.5 text-orange-400" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="px-2 pt-1">
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      setCurrentTab('customer-profile');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      setRoleDropdownOpen(false);
                      logout();
                      setCurrentTab('login');
                    }}
                    className="w-full flex items-center gap-2 px-2 py-1.5 text-xs text-red-400 hover:bg-red-950/30 rounded transition-colors"
                  >
                    <LogOut className="w-3.5 h-3.5 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => {
              setCurrentTab('landing');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
          >
            Public Overview
          </button>
          <button
            onClick={() => {
              setCurrentTab('customer-dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-blue-400 hover:bg-slate-800 rounded-lg font-semibold"
          >
            Customer Dashboard
          </button>
          <button
            onClick={() => {
              setCurrentTab('customer-devices');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 rounded-lg"
          >
            My Devices &amp; Live Sensors
          </button>
          <button
            onClick={() => {
              setCurrentTab('customer-alerts');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-slate-800 rounded-lg font-semibold"
          >
            Emergency Alerts &amp; Incidents
          </button>
          <button
            onClick={() => {
              setCurrentTab('technician-dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-amber-400 hover:bg-slate-800 rounded-lg"
          >
            Technician Maintenance
          </button>
          <button
            onClick={() => {
              setCurrentTab('admin-dashboard');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-orange-400 hover:bg-slate-800 rounded-lg"
          >
            Admin Management Console
          </button>
          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSimulator();
              }}
              className="flex-1 bg-orange-600 text-white py-2 rounded-lg text-xs font-bold text-center"
            >
              Open Sensor Simulator
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openIoTDocs();
              }}
              className="flex-1 bg-slate-800 text-slate-200 py-2 rounded-lg text-xs font-bold text-center"
            >
              Hardware Specs
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
