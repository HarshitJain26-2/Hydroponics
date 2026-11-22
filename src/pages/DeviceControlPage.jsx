import React, { useState } from 'react';
import {
  Sliders,
  Power,
  ShieldAlert,
  Clock,
  Zap,
  CheckCircle2,
  RotateCcw,
  Info,
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
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#166534] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20 font-semibold">
              Actuator Subsystem
            </span>
            <SimulatedBadge label="ESP32 GPIO Simulation" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            Device Control
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-xl">
            Directly manage relay states, modulate grow lights, enforce fail-safe dry-run pump protections, and supervise hardware interlocks.
          </p>
        </div>

        {/* Operating Mode Segmented Control */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="flex items-center p-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <button
              onClick={() => setSystemMode('AUTO')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                systemMode === 'AUTO'
                  ? 'bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/30 shadow-xs'
                  : 'text-[#647067] hover:text-[#18221C]'
              }`}
            >
              AUTO MODE
            </button>
            <button
              onClick={() => setSystemMode('MANUAL')}
              className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
                systemMode === 'MANUAL'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs'
                  : 'text-[#647067] hover:text-[#18221C]'
              }`}
            >
              MANUAL OVERRIDE
            </button>
          </div>

          {/* Emergency Stop Button */}
          {!isEmergencyStopped ? (
            <button
              onClick={onEmergencyStop}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 border border-red-200 text-[#DC2626] hover:bg-red-100 transition-all text-xs font-bold font-mono tracking-wider shadow-xs"
            >
              <Power className="w-4 h-4" />
              <span>EMERGENCY STOP</span>
            </button>
          ) : (
            <button
              onClick={onResetEmergency}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#EAF7EE] border border-[#16A34A]/30 text-[#166534] hover:bg-[#d5eedc] transition-all text-xs font-bold font-mono tracking-wider shadow-xs"
            >
              <RotateCcw className="w-4 h-4" />
              <span>RESET SYSTEM LOCK</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Status Notice (if tripped) */}
      {isEmergencyStopped && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 flex items-center justify-between text-xs text-red-900">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <p className="font-bold text-sm text-red-800">EMERGENCY SYSTEM SHUTDOWN ACTIVE</p>
              <p className="text-red-700">
                All actuator relays (Water Pump & Grow Light) are forcefully cut off. Click Reset to re-arm.
              </p>
            </div>
          </div>
          <button
            onClick={onResetEmergency}
            className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-mono font-bold hover:bg-red-700 transition-colors shadow-xs"
          >
            DISARM
          </button>
        </div>
      )}

      {/* Auto Mode Advisory Notice */}
      {systemMode === 'AUTO' && !isEmergencyStopped && (
        <div className="p-4 rounded-xl bg-white border border-[#E5EAE6] shadow-xs flex items-center gap-3 text-xs text-[#647067]">
          <Info className="w-4 h-4 text-[#16A34A] shrink-0" />
          <p>
            <strong className="text-[#18221C]">Automatic Mode Enabled:</strong> Actuators are governed by programmed automation rules and sensor thresholds. Switch to <em>Manual Override</em> to manually toggle relays.
          </p>
        </div>
      )}

      {/* 2. Primary Actuator Control Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Water Pump */}
        <div
          className={`p-6 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between shadow-xs ${
            pump.state ? 'border-[#16A34A]/40 ring-1 ring-[#16A34A]/20' : 'border-[#E5EAE6]'
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    pump.state
                      ? 'bg-[#EAF7EE] border-[#16A34A]/30 text-[#166534]'
                      : 'bg-[#F3F6F4] border-[#E5EAE6] text-[#647067]'
                  }`}
                >
                  <Sliders className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18221C]">{pump.name}</h3>
                  <p className="text-xs text-[#647067]">{pump.description}</p>
                </div>
              </div>

              {/* Large Toggle Switch */}
              <button
                onClick={() => onToggleDevice('pump')}
                disabled={systemMode === 'AUTO' || isEmergencyStopped}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  pump.state ? 'bg-[#16A34A]' : 'bg-[#D1D8D3]'
                } ${
                  systemMode === 'AUTO' || isEmergencyStopped
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    pump.state ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware & Relay Diagnostics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <span className="text-[#89938B] block text-[10px]">RELAY PIN</span>
                <span className="text-[#18221C] font-bold">{pump.gpio}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <span className="text-[#89938B] block text-[10px]">CHANNEL</span>
                <span className="text-[#18221C] font-bold">{pump.relayChannel}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <span className="text-[#89938B] block text-[10px]">POWER DRAW</span>
                <span className="text-[#166534] font-bold">{pump.powerDraw}</span>
              </div>
            </div>

            {/* Status Strip */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5EAE6]">
                <span className="text-[#647067]">Current Relay Status:</span>
                <span
                  className={`font-mono font-bold ${
                    pump.state ? 'text-[#166534]' : 'text-[#647067]'
                  }`}
                >
                  {pump.state ? 'NO (Normally Open) CLOSED [ACTIVE]' : 'OPEN [DE-ENERGIZED]'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EAE6]">
                <span className="text-[#647067]">Operating Mode:</span>
                <span className="font-mono text-[#18221C] font-semibold">{systemMode}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EAE6]">
                <span className="text-[#647067]">Last State Change:</span>
                <span className="font-mono text-[#647067]">{pump.lastActivation}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#647067]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-[#16A34A]" /> Runtime Today: {pump.runtimeToday}
            </span>
            <span className="font-mono">Cycles: {pump.totalCycles}</span>
          </div>
        </div>

        {/* Card 2: Grow Light */}
        <div
          className={`p-6 rounded-2xl bg-white border transition-all duration-200 flex flex-col justify-between shadow-xs ${
            light.state ? 'border-[#16A34A]/40 ring-1 ring-[#16A34A]/20' : 'border-[#E5EAE6]'
          }`}
        >
          <div>
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors ${
                    light.state
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-[#F3F6F4] border-[#E5EAE6] text-[#647067]'
                  }`}
                >
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#18221C]">{light.name}</h3>
                  <p className="text-xs text-[#647067]">{light.description}</p>
                </div>
              </div>

              {/* Large Toggle Switch */}
              <button
                onClick={() => onToggleDevice('light')}
                disabled={systemMode === 'AUTO' || isEmergencyStopped}
                className={`relative inline-flex h-8 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  light.state ? 'bg-[#16A34A]' : 'bg-[#D1D8D3]'
                } ${
                  systemMode === 'AUTO' || isEmergencyStopped
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    light.state ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Hardware & Relay Diagnostics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-5 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <span className="text-[#89938B] block text-[10px]">RELAY PIN</span>
                <span className="text-[#18221C] font-bold">{light.gpio}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <span className="text-[#89938B] block text-[10px]">CHANNEL</span>
                <span className="text-[#18221C] font-bold">{light.relayChannel}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <span className="text-[#89938B] block text-[10px]">POWER DRAW</span>
                <span className="text-amber-700 font-bold">{light.powerDraw}</span>
              </div>
            </div>

            {/* Brightness PWM Modulation Slider */}
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] mb-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#647067]">LED Spectrum PWM Duty Cycle</span>
                <span className="font-mono font-bold text-[#18221C]">{deviceBrightness}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={deviceBrightness}
                onChange={(e) => setDeviceBrightness(Number(e.target.value))}
                disabled={!light.state || systemMode === 'AUTO' || isEmergencyStopped}
                className="w-full accent-[#16A34A] bg-[#E5EAE6] h-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                <span>10% Low Dim</span>
                <span>50% Vegetative</span>
                <span>100% Full Bloom</span>
              </div>
            </div>

            {/* Status Strip */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-[#E5EAE6]">
                <span className="text-[#647067]">Current Relay Status:</span>
                <span
                  className={`font-mono font-bold ${
                    light.state ? 'text-amber-700' : 'text-[#647067]'
                  }`}
                >
                  {light.state ? 'ENERGIZED [ON]' : 'DE-ENERGIZED [STANDBY]'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#E5EAE6]">
                <span className="text-[#647067]">Operating Mode:</span>
                <span className="font-mono text-[#18221C] font-semibold">{systemMode}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#647067]">
            <span className="flex items-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Runtime Today: {light.runtimeToday}
            </span>
            <span className="font-mono">Cycles: {light.totalCycles}</span>
          </div>
        </div>
      </div>

      {/* 3. Safety Interlocks & Hardware Guardrails */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
          <div>
            <h3 className="text-base font-bold text-[#18221C] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#16A34A]" />
              <span>Hardware Safety Interlocks & Low Water Protection</span>
            </h3>
            <p className="text-xs text-[#647067]">
              Autonomous firmware-level guardrails preventing equipment burn-out and reservoir run-dry incidents.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-[#EAF7EE] text-[#166534] text-xs font-mono font-bold border border-[#16A34A]/30">
            ALL INTERLOCKS ARMED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#18221C]">Low Water Interlock</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            <p className="text-[11px] text-[#647067]">
              Firmware immediately drops GPIO 26 low if ultrasonic tank clearance exceeds 85cm.
            </p>
            <span className="text-[10px] text-[#166534] font-mono font-semibold block pt-1">Threshold: 85 cm</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#18221C]">Relay Anti-Bounce Delay</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            <p className="text-[11px] text-[#647067]">
              30-second minimum dwell window between rapid switching cycles to protect mechanical relay contacts.
            </p>
            <span className="text-[10px] text-[#166534] font-mono font-semibold block pt-1">Dwell: 30s Guard</span>
          </div>

          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#18221C]">Thermal Overheat Gate</span>
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
            </div>
            <p className="text-[11px] text-[#647067]">
              Auto-disables high-power LED bars if ambient canopy heat exceeds 34°C.
            </p>
            <span className="text-[10px] text-[#166534] font-mono font-semibold block pt-1">Max Canopy: 34.0°C</span>
          </div>
        </div>
      </div>

      {/* 4. Device Activity Timeline */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-3">
        <h3 className="text-sm font-bold text-[#18221C] uppercase tracking-wider font-mono">
          Actuator Event Timeline
        </h3>

        <div className="divide-y divide-[#E5EAE6] text-xs">
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
                <p className="font-semibold text-[#18221C]">{item.event}</p>
                <p className="text-[11px] text-[#647067]">{item.reason}</p>
              </div>
              <div className="text-right shrink-0 font-mono text-[10px]">
                <span className="text-[#166534] font-semibold block">{item.source}</span>
                <span className="text-[#89938B]">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
