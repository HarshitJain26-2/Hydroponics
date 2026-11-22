import React, { useState, useEffect } from 'react';
import {
  Menu,
  Bell,
  Radio,
  Wifi,
  RotateCw,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
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
    <header className="sticky top-0 z-30 h-16 bg-white/95 backdrop-blur-md border-b border-[#E5EAE6] px-4 lg:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-2 rounded-lg text-[#647067] hover:text-[#18221C] hover:bg-[#F3F6F4]"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-1.5 text-xs text-[#647067]">
            <span className="hover:text-[#18221C] cursor-pointer" onClick={() => setActivePage('overview')}>HYDROSMART</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#89938B]" />
            <span className="text-[#166534] font-medium capitalize">
              {activePage.replace('-', ' ')}
            </span>
          </div>
          <h1 className="text-base font-bold text-[#18221C] leading-tight truncate max-w-[200px] sm:max-w-md">
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
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F9F7] border border-[#E5EAE6] text-[#647067]"
            title="MQTT Broker: broker.emqx.io:1883 (Connected, QoS 1)"
          >
            <Radio className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
            <span className="font-mono text-[11px] font-medium">MQTT</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          </div>

          {/* ESP32 Status */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F7F9F7] border border-[#E5EAE6] text-[#647067]"
            title="ESP32 Node Online via WiFi (192.168.1.142)"
          >
            <Wifi className="w-3.5 h-3.5 text-[#16A34A]" />
            <span className="font-mono text-[11px] font-medium">ESP32</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
          </div>

          {/* Mode Pill */}
          <div
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold border ${
              systemMode === 'AUTO'
                ? 'bg-[#EAF7EE] text-[#166534] border-[#16A34A]/30'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            {systemMode}
          </div>
        </div>

        {/* Live Clock & Refresh */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-[#647067] border-l border-[#E5EAE6] pl-3">
          <span className="text-[#18221C] font-semibold">{timeStr}</span>
          <span className="text-[10px] text-[#89938B]">UTC+5:30</span>
        </div>

        {/* Manual Refresh Button */}
        <button
          onClick={onRefresh}
          className={`p-2 rounded-xl text-[#647067] hover:text-[#16A34A] hover:bg-[#F3F6F4] transition-all border border-transparent hover:border-[#E5EAE6] ${
            isRefreshing ? 'animate-spin text-[#16A34A]' : ''
          }`}
          title="Refresh telemetry"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl text-[#647067] hover:text-[#18221C] hover:bg-[#F3F6F4] border border-transparent hover:border-[#E5EAE6] transition-colors"
            title="System notifications"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* Notifications Modal/Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white border border-[#E5EAE6] shadow-xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#16A34A]" />
                  <span className="font-semibold text-sm text-[#18221C]">Notifications</span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-mono font-semibold">
                    {activeAlerts.length} Active
                  </span>
                </div>
                <button
                  onClick={() => {
                    setShowNotifications(false);
                    setActivePage('alerts');
                  }}
                  className="text-xs text-[#16A34A] hover:underline font-medium"
                >
                  View All
                </button>
              </div>

              <div className="divide-y divide-[#E5EAE6] max-h-72 overflow-y-auto mt-2 space-y-1">
                {alerts.slice(0, 4).map((alert) => (
                  <div key={alert.id} className="py-2.5 flex items-start gap-3 hover:bg-[#F7F9F7] px-2 rounded-lg transition-colors">
                    <div className="mt-0.5">
                      {alert.severity === 'critical' && (
                        <AlertTriangle className="w-4 h-4 text-[#DC2626]" />
                      )}
                      {alert.severity === 'warning' && (
                        <AlertTriangle className="w-4 h-4 text-[#F59E0B]" />
                      )}
                      {alert.severity === 'info' && (
                        <CheckCircle2 className="w-4 h-4 text-[#2563EB]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#18221C] truncate">
                        {alert.title}
                      </p>
                      <p className="text-[11px] text-[#647067] line-clamp-2 mt-0.5">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-[#89938B] font-mono mt-1 block">
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
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-200 text-[#DC2626] hover:bg-red-100 transition-colors text-xs font-semibold"
          title="Emergency Actuator Shutdown"
        >
          <Power className="w-3.5 h-3.5" />
          <span>E-Stop</span>
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-[#E5EAE6]">
          <div className="w-8 h-8 rounded-full bg-[#EAF7EE] border border-[#16A34A]/30 flex items-center justify-center text-[#166534] font-semibold text-xs shadow-xs">
            OP
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-semibold text-[#18221C] leading-none">Operator</p>
            <p className="text-[10px] text-[#647067] leading-tight font-mono">Greenhouse #1</p>
          </div>
        </div>
      </div>
    </header>
  );
}
