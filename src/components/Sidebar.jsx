import React from 'react';
import {
  LayoutDashboard,
  Activity,
  Droplets,
  Sliders,
  Sparkles,
  GitCompare,
  BellRing,
  FileBarChart,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Cpu,
  X
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
  { id: 'plant-health', label: 'Plant & Water Health', icon: Droplets },
  { id: 'device-control', label: 'Device Control', icon: Sliders },
  { id: 'automation', label: 'Automation Rules', icon: Sparkles },
  { id: 'protocol', label: 'Protocol Analysis', icon: GitCompare, badge: 'Academic' },
  { id: 'alerts', label: 'Alerts & Logs', icon: BellRing, alertCountKey: true },
  { id: 'reports', label: 'Reports', icon: FileBarChart },
  { id: 'settings', label: 'System Settings', icon: SettingsIcon },
];

export default function Sidebar({
  activePage,
  setActivePage,
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  activeAlertCount = 2,
  esp32Status = 'Online'
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col justify-between bg-white border-r border-[#E5EAE6] transition-all duration-300 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Brand Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-[#E5EAE6]">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => setActivePage('overview')}>
              {/* Leaf + Connected Node SVG Icon */}
              <div className="w-10 h-10 rounded-xl bg-[#EAF7EE] border border-[#E5EAE6] flex items-center justify-center shrink-0 group">
                <svg
                  className="w-5 h-5 text-[#16A34A] transition-transform duration-300 group-hover:scale-110"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
                  <circle cx="13" cy="12" r="1.5" fill="#16A34A" stroke="none" />
                  <circle cx="19" cy="2" r="1.5" fill="#16A34A" stroke="none" />
                </svg>
              </div>

              {!collapsed && (
                <div className="min-w-0 transition-opacity duration-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-base tracking-wider text-[#18221C] font-mono">
                      HYDRO<span className="text-[#16A34A]">SMART</span>
                    </span>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest text-[#647067] font-medium truncate">
                    Intelligent Hydroponics
                  </p>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden text-[#647067] hover:text-[#18221C] p-1.5 rounded-lg hover:bg-[#F3F6F4]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)]">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActivePage(item.id);
                    if (window.innerWidth < 1024) setMobileOpen(false);
                  }}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    isActive
                      ? 'bg-[#EAF7EE] text-[#166534] font-semibold border border-[#16A34A]/20 shadow-xs'
                      : 'text-[#647067] hover:bg-[#F3F6F4] hover:text-[#18221C]'
                  } ${collapsed ? 'justify-center px-0' : ''}`}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-colors ${
                      isActive ? 'text-[#16A34A]' : 'text-[#647067] group-hover:text-[#16A34A]'
                    }`}
                  />

                  {!collapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!collapsed && item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#EAF7EE] text-[#166534] font-mono font-semibold border border-[#16A34A]/20">
                      {item.badge}
                    </span>
                  )}

                  {!collapsed && item.alertCountKey && activeAlertCount > 0 && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-mono font-bold border border-amber-200">
                      {activeAlertCount}
                    </span>
                  )}

                  {collapsed && item.alertCountKey && activeAlertCount > 0 && (
                    <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Hardware & Status Section */}
        <div className="p-3 border-t border-[#E5EAE6] bg-[#F7F9F7] space-y-2">
          {/* ESP32 Device Card */}
          {!collapsed ? (
            <div className="p-3 rounded-xl bg-white border border-[#E5EAE6] text-xs shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#16A34A]" />
                  <span className="font-semibold text-[#18221C] font-mono">ESP32-WROOM-32</span>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] text-[#166534] bg-[#EAF7EE] px-2 py-0.5 rounded-full font-mono font-medium border border-[#16A34A]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] animate-ping" />
                  {esp32Status}
                </span>
              </div>
              <div className="flex items-center justify-between text-[#647067] text-[11px]">
                <span className="flex items-center gap-1 font-mono">
                  <Wifi className="w-3.5 h-3.5 text-[#16A34A]" /> 192.168.1.142
                </span>
                <span className="font-mono text-[10px]">QoS 1</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center py-2" title="ESP32 Node Online">
              <div className="w-9 h-9 rounded-xl bg-white border border-[#E5EAE6] flex items-center justify-center relative shadow-xs">
                <Cpu className="w-4 h-4 text-[#16A34A]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-2 ring-white" />
              </div>
            </div>
          )}

          {/* Sidebar Collapse Toggle button (Desktop) */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium text-[#647067] hover:text-[#18221C] hover:bg-white border border-transparent hover:border-[#E5EAE6] transition-all"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
