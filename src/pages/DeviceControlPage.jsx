import React, { useState } from 'react';
import {
  Sliders,
  Power,
  ShieldAlert,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Info,
  SlidersHorizontal,
  Flame
} from 'lucide-react';
import SimulatedBadge from '../components/SimulatedBadge';

export default function DeviceControlPage({
  devices,
  onToggleDevice,
  systemMode,
  setSystemMode,
  onEmergencyStop,
  onResetEmergency,
  isEmergencyStopped
}) {
  const [deviceBrightness, setDeviceBrightness] = useState(85);

  const pump = devices.find((d) => d.id === 'pump') || devices[0];
  const light = devices.find((d) => d.id === 'light') || devices[1];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar & Mode Segmented Control */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#36D17C] bg-[#36D17C]/10 px-2 py-0.5 rounded-full border border-[#36D17C]/20">
              Actuator Subsystem
            </span>
            <SimulatedBadge label="ESP32 GPIO Simulation" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Device Control
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-1 max-w-xl">
            Directly manage relay states, modulate grow lights, enforce fail-safe dry-run pump protections, and supervise hardware interlocks.
          </p>
        </div>

        {/* Operating Mode Segmented Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center p-1.5 rounded-xl bg-[#16211A] border border-[#27352D]">
            <button
              onClick={() => setSystemMode('AUTO')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                systemMode === 'AUTO'
                  ? 'bg-[#182B20] text-[#36D17C] border border-[#36D17C]/30 shadow-md shadow-[#36D17C]/10'
                  : 'text-[#95A69A] hover:text-[#F0F5F1]'
              }`}
            >
              AUTO MODE
            </button>
            <button
              onClick={() => setSystemMode('MANUAL')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                systemMode === 'MANUAL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                  : 'text-[#95A69A] hover:text-[#F0F5F1]'
              }`}
            >
              MANUAL OVERRIDE
            </button>
          </div>

          {/* Emergency Stop Button */}
          {!isEmergencyStopped ? (
            <button
              onClick={onEmergencyStop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-800/60 text-[#EF6464] hover:bg-red-900/60 hover:text-red-100 transition-all text-xs font-bold font-mono tracking-wider shadow-lg shadow-red-950/20"
            >
              <Power className="w-4 h-4" />
              <span>EMERGENCY STOP</span>
            </button>
          ) : (
            <button
              onClick={onResetEmergency}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-950/40 border border-[#36D17C]/60 text-[#36D17C] hover:bg-emerald-900/60 hover:text-white transition-all text-xs font-bold font-mono tracking-wider"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET SYSTEM LOCK</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Status Notice (if tripped) */}
      {isEmergencyStopped && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-600/50 flex items-center justify-between text-xs text-red-200">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="font-bold text-sm">EMERGENCY SYSTEM SHUTDOWN ACTIVE</p>
              <p className="text-red-300/80">
                All actuator relays (Water Pump & Grow Light) are forcefully cut off. Click Reset to re-arm.
              </p>
            </div>
          </div>
          <button
            onClick={onResetEmergency}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-mono font-bold hover:bg-red-500 transition-colors"
          >
            DISARM
          </button>
        </div>
      )}

      {/* Auto Mode Advisory Notice */}
      {systemMode === 'AUTO' && !isEmergencyStopped && (
        <div className="p-4 rounded-xl bg-[#16211A] border border-[#27352D] flex items-center gap-3 text-xs text-[#95A69A]">
          <Info className="w-4 h-4 text-[#36D17C] shrink-0" />
          <p>
            <strong className="text-[#F0F5F1]">Automatic Mode Enabled:</strong> Actuators are governed by programmed automation rules and sensor thresholds. Switch to <em>Manual Override</em> to manually toggle relays.
          </p>
        </div>
      )}

      {/* 2. Primary Actuator Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Water Pump */}
        <div
          className={`p-6 rounded-2xl bg-[#16211A] border transition-all duration-200 flex flex-col justify-between ${
            pump.state ? 'border-[#36D17C]/50 shadow-lg shadow-[#36D17C]/5' : 'border-[#27352D]'
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    pump.state
                      ? 'bg-[#36D17C]/15 border-[#36D17C]/40 text-[#36D17C]'
                      : 'bg-[#18231C] border-[#27352D] text-[#95A69A]'
                  }`}
                >
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F0F5F1]">{pump.name}</h3>
                  <p className="text-xs text-[#95A69A]">{pump.description}</p>
                </div>
              </div>

              {/* Large Toggle Switch */}
              <button
                onClick={() => onToggleDevice('pump')}
                disabled={systemMode === 'AUTO' || isEmergencyStopped}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  pump.state ? 'bg-[#36D17C]' : 'bg-[#27352D]'
                } ${
                  systemMode === 'AUTO' || isEmergencyStopped
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-[#121A15] shadow-lg ring-0 transition duration-200 ease-in-out ${
                    pump.state ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware & Relay Diagnostics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#121A15] border border-[#27352D]">
                <span className="text-[#627768] block text-[10px]">RELAY PIN</span>
                <span className="text-[#F0F5F1] font-bold">{pump.gpio}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121A15] border border-[#27352D]">
                <span className="text-[#627768] block text-[10px]">CHANNEL</span>
                <span className="text-[#F0F5F1] font-bold">{pump.relayChannel}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121A15] border border-[#27352D]">
                <span className="text-[#627768] block text-[10px]">POWER DRAW</span>
                <span className="text-[#36D17C] font-bold">{pump.powerDraw}</span>
              </div>
            </div>

            {/* Status Strip */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#27352D]/50">
                <span className="text-[#95A69A]">Current Relay Status:</span>
                <span
                  className={`font-mono font-bold ${
                    pump.state ? 'text-[#36D17C]' : 'text-[#95A69A]'
                  }`}
                >
                  {pump.state ? 'NO (Normally Open) CLOSED [ACTIVE]' : 'OPEN [DE-ENERGIZED]'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27352D]/50">
                <span className="text-[#95A69A]">Operating Mode:</span>
                <span className="font-mono text-[#F0F5F1]">{systemMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27352D]/50">
                <span className="text-[#95A69A]">Last State Change:</span>
                <span className="font-mono text-[#95A69A]">{pump.lastActivation}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27352D] flex items-center justify-between text-xs text-[#95A69A]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#36D17C]" /> Runtime Today: {pump.runtimeToday}
            </span>
            <span className="font-mono">Cycles: {pump.totalCycles}</span>
          </div>
        </div>

        {/* Card 2: Grow Light */}
        <div
          className={`p-6 rounded-2xl bg-[#16211A] border transition-all duration-200 flex flex-col justify-between ${
            light.state ? 'border-[#36D17C]/50 shadow-lg shadow-[#36D17C]/5' : 'border-[#27352D]'
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    light.state
                      ? 'bg-amber-500/15 border-amber-500/40 text-amber-400'
                      : 'bg-[#18231C] border-[#27352D] text-[#95A69A]'
                  }`}
                >
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F0F5F1]">{light.name}</h3>
                  <p className="text-xs text-[#95A69A]">{light.description}</p>
                </div>
              </div>

              {/* Large Toggle Switch */}
              <button
                onClick={() => onToggleDevice('light')}
                disabled={systemMode === 'AUTO' || isEmergencyStopped}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  light.state ? 'bg-[#36D17C]' : 'bg-[#27352D]'
                } ${
                  systemMode === 'AUTO' || isEmergencyStopped
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-[#121A15] shadow-lg ring-0 transition duration-200 ease-in-out ${
                    light.state ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware & Relay Diagnostics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#121A15] border border-[#27352D]">
                <span className="text-[#627768] block text-[10px]">RELAY PIN</span>
                <span className="text-[#F0F5F1] font-bold">{light.gpio}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121A15] border border-[#27352D]">
                <span className="text-[#627768] block text-[10px]">CHANNEL</span>
                <span className="text-[#F0F5F1] font-bold">{light.relayChannel}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121A15] border border-[#27352D]">
                <span className="text-[#627768] block text-[10px]">POWER DRAW</span>
                <span className="text-amber-400 font-bold">{light.powerDraw}</span>
              </div>
            </div>

            {/* Brightness PWM Modulation Slider */}
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D] mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#95A69A]">LED Spectrum PWM Duty Cycle</span>
                <span className="font-mono font-bold text-[#F0F5F1]">{deviceBrightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={deviceBrightness}
                onChange={(e) => setDeviceBrightness(Number(e.target.value))}
                disabled={!light.state || systemMode === 'AUTO' || isEmergencyStopped}
                className="w-full accent-[#36D17C] bg-[#18231C] h-1.5 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                <span>10% Low Dim</span>
                <span>50% Vegetative</span>
                <span>100% Full Bloom</span>
              </div>
            </div>

            {/* Status Strip */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#27352D]/50">
                <span className="text-[#95A69A]">Current Relay Status:</span>
                <span
                  className={`font-mono font-bold ${
                    light.state ? 'text-amber-400' : 'text-[#95A69A]'
                  }`}
                >
                  {light.state ? 'ENERGIZED [ON]' : 'DE-ENERGIZED [STANDBY]'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#27352D]/50">
                <span className="text-[#95A69A]">Operating Mode:</span>
                <span className="font-mono text-[#F0F5F1]">{systemMode}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27352D] flex items-center justify-between text-xs text-[#95A69A]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-400" /> Runtime Today: {light.runtimeToday}
            </span>
            <span className="font-mono">Cycles: {light.totalCycles}</span>
          </div>
        </div>
      </div>

      {/* 3. Safety Interlocks & Hardware Guardrails */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#27352D]">
          <div>
            <h3 className="text-base font-bold text-[#F0F5F1] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#36D17C]" />
              <span>Hardware Safety Interlocks & Low Water Protection</span>
            </h3>
            <p className="text-xs text-[#95A69A]">
              Autonomous firmware-level guardrails preventing equipment burn-out and reservoir run-dry incidents.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#36D17C]/15 text-[#36D17C] text-xs font-mono font-bold border border-[#36D17C]/30">
            ALL INTERLOCKS ARMED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F0F5F1]">Low Water Interlock</span>
              <CheckCircle2 className="w-4 h-4 text-[#36D17C]" />
            </div>
            <p className="text-[11px] text-[#95A69A]">
              Firmware immediately drops GPIO 26 low if ultrasonic tank clearance exceeds 85cm.
            </p>
            <span className="text-[10px] text-[#36D17C] font-mono block pt-1">Threshold: 85 cm</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F0F5F1]">Relay Anti-Bounce Delay</span>
              <CheckCircle2 className="w-4 h-4 text-[#36D17C]" />
            </div>
            <p className="text-[11px] text-[#95A69A]">
              30-second minimum dwell window between rapid switching cycles to protect mechanical relay contacts.
            </p>
            <span className="text-[10px] text-[#36D17C] font-mono block pt-1">Dwell: 30s Guard</span>
          </div>

          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#F0F5F1]">Thermal Overheat Gate</span>
              <CheckCircle2 className="w-4 h-4 text-[#36D17C]" />
            </div>
            <p className="text-[11px] text-[#95A69A]">
              Auto-disables high-power LED bars if ambient canopy heat exceeds 34°C.
            </p>
            <span className="text-[10px] text-[#36D17C] font-mono block pt-1">Max Canopy: 34.0°C</span>
          </div>
        </div>
      </div>

      {/* 4. Device Activity Timeline */}
      <div className="p-5 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-3">
        <h3 className="text-sm font-bold text-[#F0F5F1] uppercase tracking-wider font-mono">
          Actuator Event Timeline
        </h3>

        <div className="divide-y divide-[#27352D]/60 text-xs">
          {[
            {
              time: '18 mins ago',
              event: 'Water Pump engaged (ON)',
              reason: 'Scheduled NFT cycle timer executed (15m circulation)',
              source: 'Automation Engine',
            },
            {
              time: '3h 10m ago',
              event: 'Grow Light disengaged (OFF)',
              reason: 'Daylight PAR intensity crossed 65% threshold',
              source: 'Rule #3 (Daylight)',
            },
            {
              time: '4h 25m ago',
              event: 'Grow Light engaged (ON)',
              reason: 'Early morning supplemental PAR cycle initiated',
              source: 'Schedule Rule',
            },
            {
              time: 'Yesterday 23:40',
              event: 'Operating mode switched to AUTO',
              reason: 'Operator finished routine physical inspection',
              source: 'Web Dashboard',
            },
          ].map((item, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[#F0F5F1]">{item.event}</p>
                <p className="text-[11px] text-[#95A69A]">{item.reason}</p>
              </div>
              <div className="text-right shrink-0 font-mono text-[10px]">
                <span className="text-[#36D17C] block">{item.source}</span>
                <span className="text-[#627768]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hardware safety interlocks and emergency stop procedures
