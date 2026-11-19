import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Radio,
  Wifi,
  RotateCw,
  User,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Power
} from 'lucide-react';
import SimulatedBadge from './SimulatedBadge';

const PAGE_NAMES = {
  'overview': 'Overview Dashboard',
  'monitoring': 'Live Sensor Telemetry',
  'plant-health': 'Plant & Water Health',
  'device-control': 'Actuator & Device Control',
  'automation': 'Automation Rules & Safety Interlocks',
  'protocol': 'IoT Protocol Benchmark (MQTT vs HTTP vs CoAP)',
  'alerts': 'System Alerts & Event Logs',
  'reports': 'Reports & Analytics Export',
  'settings': 'System Settings & Connectivity',
};

export default function Header({
  activePage,
  setActivePage,
  setMobileOpen,
  alerts = [],
  onRefresh,
  isRefreshing,
  systemMode = 'AUTO',
  onEmergencyStop
}) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeAlerts = alerts.filter(a => a.status !== 'resolved');

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#121A15]/90 backdrop-blur-md border-b border-[#27352D] px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[#95A69A] hover:text-[#F0F5F1] hover:bg-[#18231C]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#95A69A]">
            <span className="hover:text-[#F0F5F1] cursor-pointer" onClick={() => setActivePage('overview')}>HYDROSMART</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#35483D]" />
            <span className="text-[#36D17C] font-medium capitalize">
              {activePage.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-base font-bold text-[#F0F5F1] leading-tight truncate max-w-[200px] sm:max-w-md">
            {PAGE_NAMES[activePage] || 'Dashboard'}
          </h1>
        </div>
      </div>

      {/* Right: Status Indicators & Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Simulation Indicator badge */}
        <div className="hidden sm:block">
          <SimulatedBadge label="Simulation Telemetry" />
        </div>

        {/* System Status Pills */}
        <div className="hidden md:flex items-center gap-2 text-xs">
          {/* MQTT Status */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18231C] border border-[#27352D] text-[#95A69A]"
            title="MQTT Broker: broker.emqx.io:1883 (Connected, QoS 1)"
          >
            <Radio className="w-3.5 h-3.5 text-[#36D17C] animate-pulse" />
            <span className="font-mono text-[11px]">MQTT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#36D17C]" />
          </div>

          {/* ESP32 Status */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18231C] border border-[#27352D] text-[#95A69A]"
            title="ESP32 Node Online via WiFi (192.168.1.142)"
          >
            <Wifi className="w-3.5 h-3.5 text-[#36D17C]" />
            <span className="font-mono text-[11px]">ESP32</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#36D17C]" />
          </div>

          {/* Mode Pill */}
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${
              systemMode === 'AUTO'
                ? 'bg-[#36D17C]/10 text-[#36D17C] border-[#36D17C]/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
            }`}
          >
            {systemMode}
          </div>
        </div>

        {/* Live Clock & Refresh */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#95A69A] border-l border-[#27352D] pl-3">
          <span className="text-[#F0F5F1]">{timeStr}</span>
          <span className="text-[10px] text-[#95A69A]">UTC+5:30</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          className={`p-2 rounded-xl text-[#95A69A] hover:text-[#36D17C] hover:bg-[#18231C] transition-all border border-transparent hover:border-[#27352D] ${
            isRefreshing ? 'animate-spin text-[#36D17C]' : ''
          }`}
          title="Refresh telemetry"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#95A69A] hover:text-[#F0F5F1] hover:bg-[#18231C] border border-transparent hover:border-[#27352D] transition-colors"
            title="System notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#121A15] animate-pulse" />
            )}
          </button>

          {/* Notifications Modal/Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#16211A] border border-[#27352D] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#27352D]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#36D17C]" />
                  <span className="font-semibold text-sm text-[#F0F5F1]">Notifications</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-mono">
                    {activeAlerts.length} Active
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActivePage('alerts');
                  }}
                  className="text-xs text-[#36D17C] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-[#27352D]/60 max-h-72 overflow-y-auto mt-2 space-y-1">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="py-2.5 flex items-start gap-3">
                    <div className="mt-0.5">
                      {alert.severity === 'critical' && (
                        <AlertTriangle className="w-4 h-4 text-[#EF6464]" />
                      )}
                      {alert.severity === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-[#F5B942]" />
                      )}
                      {alert.severity === 'info' && (
                        <CheckCircle2 className="w-4 h-4 text-[#64B5F6]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#F0F5F1] truncate">
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-[#95A69A] line-clamp-2 mt-0.5">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-[#627768] font-mono mt-1 block">
                        {alert.timestamp}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Emergency Stop quick trigger */}
        <button
          onClick={onEmergencyStop}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-800/50 text-[#EF6464] hover:bg-red-900/50 hover:text-red-200 transition-colors text-xs font-medium"
          title="Emergency Actuator Shutdown"
        >
          <Power className="w-3.5 h-3.5" />
          <span>E-Stop</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#27352D]">
          <div className="w-8 h-8 rounded-full bg-[#18231C] border border-[#36D17C]/40 flex items-center justify-center text-[#36D17C] font-semibold text-xs shadow-inner">
            OP
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-[#F0F5F1] leading-none">Operator</p>
            <p className="text-[10px] text-[#95A69A] leading-tight font-mono">Greenhouse #1</p>
          </div>
        </div>
      </div>
    </header>
  );
}
