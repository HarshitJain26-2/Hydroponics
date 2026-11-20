import React, { useState } from 'react';
import {
  RotateCw,
  Activity,
  ShieldCheck,
  Cpu,
  Radio,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles,
  Info
} from 'lucide-react';
import MetricCard from '../components/MetricCard';
import SimulatedBadge from '../components/SimulatedBadge';

export default function OverviewPage({
  sensors,
  devices,
  onToggleDevice,
  systemMode,
  setSystemMode,
  onSensorClick,
  onRefresh,
  isRefreshing,
  setActivePage
}) {
  const [timeFilter, setTimeFilter] = useState('24H');
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Time filter mock data generation
  const pointsCount = timeFilter === '1H' ? 12 : timeFilter === '6H' ? 18 : timeFilter === '24H' ? 24 : 28;
  const labels = Array.from({ length: pointsCount }, (_, i) => {
    if (timeFilter === '1H') return `${i * 5}m`;
    if (timeFilter === '6H') return `${i * 20}m`;
    if (timeFilter === '24H') return `${i}:00`;
    return `Day ${i + 1}`;
  });

  // Base sinusoidal curves for realistic trends
  const airTempSeries = Array.from({ length: pointsCount }, (_, i) => 
    26.5 + Math.sin(i / 3) * 1.8 + (i % 2 === 0 ? 0.3 : -0.2)
  );
  const humiditySeries = Array.from({ length: pointsCount }, (_, i) => 
    64 - Math.sin(i / 3) * 5 + (i % 3 === 0 ? 1.5 : -1.2)
  );
  const waterTempSeries = Array.from({ length: pointsCount }, (_, i) => 
    23.4 + Math.sin(i / 4) * 0.9 + 0.1 * (i % 2)
  );

  // SVG Chart Dimensions
  const chartWidth = 720;
  const chartHeight = 220;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 30;

  const getPoints = (data, minVal, maxVal) => {
    return data.map((val, idx) => {
      const x = padLeft + (idx / (data.length - 1)) * (chartWidth - padLeft - padRight);
      const y = chartHeight - padBottom - ((val - minVal) / (maxVal - minVal)) * (chartHeight - padTop - padBottom);
      return { x, y, val };
    });
  };

  const ptsAir = getPoints(airTempSeries, 18, 35);
  const ptsHum = getPoints(humiditySeries, 45, 80);
  const ptsWater = getPoints(waterTempSeries, 18, 30);

  const makeLinePath = (pts) => `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
  const makeAreaPath = (pts) => {
    const bottom = chartHeight - padBottom;
    return `M ${pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')} L ${pts[pts.length - 1].x},${bottom} L ${pts[0].x},${bottom} Z`;
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Welcome Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#95A69A]">{currentDate}</span>
            <span className="text-[#35483D]">•</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-[#36D17C] font-medium bg-[#36D17C]/10 px-2 py-0.5 rounded-full border border-[#36D17C]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#36D17C] animate-ping" />
              Operational Normal
            </span>
            <SimulatedBadge label="Telemetry Simulation" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Hydroponics Overview
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-1 max-w-xl">
            Monitor real-time biological and physical growing environment metrics, nutrient circulation, and connected ESP32 automation loops.
          </p>
        </div>

        {/* Operating Mode & Refresh */}
        <div className="flex items-center gap-3 self-start md:self-center">
          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#16211A] border border-[#27352D]">
            <button
              onClick={() => setSystemMode('AUTO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                systemMode === 'AUTO'
                  ? 'bg-[#182B20] text-[#36D17C] border border-[#36D17C]/30 shadow-sm'
                  : 'text-[#95A69A] hover:text-[#F0F5F1]'
              }`}
            >
              AUTO
            </button>
            <button
              onClick={() => setSystemMode('MANUAL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all ${
                systemMode === 'MANUAL'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 shadow-sm'
                  : 'text-[#95A69A] hover:text-[#F0F5F1]'
              }`}
            >
              MANUAL
            </button>
          </div>

          <button
            onClick={onRefresh}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl bg-[#16211A] border border-[#27352D] text-xs font-medium text-[#95A69A] hover:text-[#F0F5F1] hover:border-[#36D17C]/40 transition-colors ${
              isRefreshing ? 'text-[#36D17C]' : ''
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {/* 2. Primary 8 Sensor Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-[#F0F5F1] uppercase tracking-wider font-mono">
              Core Telemetry Metrics
            </h3>
            <span className="text-[10px] text-[#95A69A] bg-[#18231C] px-2 py-0.5 rounded-md border border-[#27352D]">
              8 Channels
            </span>
          </div>
          <button
            onClick={() => setActivePage('monitoring')}
            className="text-xs text-[#36D17C] hover:text-[#4AE695] flex items-center gap-1 font-medium"
          >
            Detailed Analytics <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensors.map((sensor) => (
            <MetricCard
              key={sensor.id}
              sensor={sensor}
              onClick={() => onSensorClick(sensor)}
            />
          ))}
        </div>
      </div>

      {/* 3. Middle Section: Environmental Trends & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Large Chart: Environmental Trends (2 cols on lg) */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#16211A] border border-[#27352D] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-[#F0F5F1] flex items-center gap-2">
                  <span>Environmental Trends</span>
                  <span className="text-[10px] text-[#95A69A] font-mono font-normal">
                    (Calibrated Telemetry)
                  </span>
                </h3>
                <p className="text-xs text-[#95A69A] mt-0.5">
                  Simultaneous dynamic correlation of ambient canopy and reservoir conditions
                </p>
              </div>

              {/* Time Range Pills */}
              <div className="flex items-center gap-1 p-1 rounded-xl bg-[#121A15] border border-[#27352D]">
                {['1H', '6H', '24H', '7D'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeFilter(range)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                      timeFilter === range
                        ? 'bg-[#36D17C]/15 text-[#36D17C] border border-[#36D17C]/30'
                        : 'text-[#95A69A] hover:text-[#F0F5F1]'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart Legend */}
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pb-2 mb-2 border-b border-[#27352D]/60">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#36D17C]" />
                <span className="text-[#F0F5F1]">Air Temp (°C)</span>
                <span className="text-[#95A69A] font-bold">27.4°</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#64B5F6]" />
                <span className="text-[#F0F5F1]">Air Humidity (%)</span>
                <span className="text-[#95A69A] font-bold">64%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F5B942]" />
                <span className="text-[#F0F5F1]">Water Temp (°C)</span>
                <span className="text-[#95A69A] font-bold">23.8°</span>
              </div>
            </div>

            {/* SVG Chart */}
            <div className="relative w-full h-56 sm:h-64 mt-2">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="area-air" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#36D17C" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#36D17C" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="area-hum" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64B5F6" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#64B5F6" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines */}
                {[0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = chartHeight - padBottom - pct * (chartHeight - padTop - padBottom);
                  return (
                    <g key={i}>
                      <line
                        x1={padLeft}
                        y1={y}
                        x2={chartWidth - padRight}
                        y2={y}
                        stroke="#27352D"
                        strokeDasharray="3 3"
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 8}
                        y={y + 3}
                        fill="#627768"
                        fontSize="9"
                        textAnchor="end"
                        fontFamily="monospace"
                      >
                        {Math.round(18 + pct * (35 - 18))}
                      </text>
                    </g>
                  );
                })}

                {/* Area fills */}
                <path d={makeAreaPath(ptsAir)} fill="url(#area-air)" />
                <path d={makeAreaPath(ptsHum)} fill="url(#area-hum)" />

                {/* Smooth lines */}
                <path
                  d={makeLinePath(ptsHum)}
                  fill="none"
                  stroke="#64B5F6"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path
                  d={makeLinePath(ptsWater)}
                  fill="none"
                  stroke="#F5B942"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
                <path
                  d={makeLinePath(ptsAir)}
                  fill="none"
                  stroke="#36D17C"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Data points */}
                {ptsAir.map((p, idx) => (
                  <circle
                    key={idx}
                    cx={p.x}
                    cy={p.y}
                    r={hoveredPoint === idx ? 5 : 2.5}
                    fill="#36D17C"
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setHoveredPoint(idx)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}

                {/* X-Axis Labels */}
                {labels.filter((_, idx) => idx % (pointsCount > 20 ? 4 : 2) === 0).map((lbl, idx, arr) => {
                  const step = (chartWidth - padLeft - padRight) / (arr.length - 1 || 1);
                  const x = padLeft + idx * step;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={chartHeight - 8}
                      fill="#627768"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {lbl}
                    </text>
                  );
                })}
              </svg>

              {/* Hover Tooltip */}
              {hoveredPoint !== null && (
                <div
                  className="absolute p-2 rounded-lg bg-[#121A15] border border-[#27352D] text-xs shadow-xl pointer-events-none transform -translate-x-1/2 -translate-y-full"
                  style={{
                    left: `${(ptsAir[hoveredPoint].x / chartWidth) * 100}%`,
                    top: `${(ptsAir[hoveredPoint].y / chartHeight) * 100}%`
                  }}
                >
                  <p className="text-[10px] text-[#95A69A] font-mono">
                    Time: {labels[hoveredPoint]}
                  </p>
                  <p className="text-[#36D17C] font-mono font-bold">
                    Air: {ptsAir[hoveredPoint].val.toFixed(1)}°C
                  </p>
                  <p className="text-[#64B5F6] font-mono">
                    Hum: {ptsHum[hoveredPoint].val.toFixed(0)}%
                  </p>
                  <p className="text-[#F5B942] font-mono">
                    Water: {ptsWater[hoveredPoint].val.toFixed(1)}°C
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Health Panel */}
        <div className="p-5 rounded-2xl bg-[#16211A] border border-[#27352D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#27352D]">
              <div>
                <h3 className="text-base font-bold text-[#F0F5F1]">System Health</h3>
                <p className="text-xs text-[#95A69A]">Aggregate IoT node diagnostics</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-[#36D17C]/15 text-[#36D17C] border border-[#36D17C]/30">
                GOOD
              </span>
            </div>

            {/* Health Score Gauge */}
            <div className="my-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#121A15] border border-[#27352D]">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#18231C"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#36D17C"
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - 0.86)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-[#F0F5F1] font-mono">86</span>
                  <span className="text-[10px] text-[#95A69A] font-mono">/100</span>
                </div>
              </div>

              {/* Explicit Simulation Label */}
              <div className="mt-2 text-center">
                <p className="text-xs font-semibold text-[#F0F5F1]">Environment Health Index</p>
                <p className="text-[10px] text-amber-400/90 font-mono mt-0.5 max-w-[220px]">
                  * Illustrative simulation score calculated from current sensor telemetry & plant profile.
                </p>
              </div>
            </div>

            {/* Segmented Diagnostic Checks */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18231C] border border-[#27352D]">
                <span className="text-[#95A69A] flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-[#36D17C]" /> Sensor Connectivity
                </span>
                <span className="font-mono font-bold text-[#F0F5F1]">7 / 7 Online</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18231C] border border-[#27352D]">
                <span className="text-[#95A69A] flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-[#36D17C]" /> MQTT Protocol Broker
                </span>
                <span className="font-mono font-bold text-[#36D17C]">Connected (QoS 1)</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-[#18231C] border border-[#27352D]">
                <span className="text-[#95A69A] flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#36D17C]" /> ESP32 Microcontroller
                </span>
                <span className="font-mono font-bold text-[#36D17C]">Online (Uptime 48h)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27352D] flex items-center justify-between text-xs">
            <span className="text-[#95A69A]">Safety Interlock</span>
            <span className="text-[#36D17C] font-mono font-semibold">Armed & Active</span>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Device Status Cards & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device Quick Status (2 cards in 1 column or 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-[#F0F5F1] uppercase tracking-wider font-mono">
              Connected Actuator Devices
            </h3>
            <button
              onClick={() => setActivePage('device-control')}
              className="text-xs text-[#36D17C] hover:text-[#4AE695] flex items-center gap-1 font-medium"
            >
              Control Center <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devices.map((device) => {
              const isOn = device.state;
              return (
                <div
                  key={device.id}
                  className={`p-4 rounded-2xl bg-[#16211A] border transition-all duration-200 flex flex-col justify-between min-h-[160px] ${
                    isOn ? 'border-[#36D17C]/40 shadow-sm shadow-[#36D17C]/5' : 'border-[#27352D]'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${
                            isOn
                              ? 'bg-[#36D17C]/15 border-[#36D17C]/30 text-[#36D17C]'
                              : 'bg-[#18231C] border-[#27352D] text-[#95A69A]'
                          }`}
                        >
                          <Sliders className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-[#F0F5F1]">
                            {device.shortName}
                          </h4>
                          <span className="text-[10px] text-[#627768] font-mono">
                            {device.gpio} • {device.relayChannel}
                          </span>
                        </div>
                      </div>

                      {/* ON/OFF Switch */}
                      <button
                        onClick={() => onToggleDevice(device.id)}
                        disabled={systemMode === 'AUTO'}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                          isOn ? 'bg-[#36D17C]' : 'bg-[#27352D]'
                        } ${systemMode === 'AUTO' ? 'opacity-60 cursor-not-allowed' : ''}`}
                        title={systemMode === 'AUTO' ? 'Switch to MANUAL mode to toggle directly' : 'Click to toggle'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#121A15] shadow-lg ring-0 transition duration-200 ease-in-out ${
                            isOn ? 'translate-x-5' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-[#95A69A]">Current State</span>
                      <span
                        className={`font-mono font-bold px-2 py-0.5 rounded-md ${
                          isOn
                            ? 'bg-[#36D17C]/15 text-[#36D17C]'
                            : 'bg-[#18231C] text-[#95A69A]'
                        }`}
                      >
                        {isOn ? 'ENGAGED / ON' : 'STANDBY / OFF'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#27352D]/60 flex items-center justify-between text-[11px] text-[#95A69A]">
                    <span className="flex items-center gap-1 font-mono">
                      <Clock className="w-3 h-3 text-[#36D17C]" /> Runtime: {device.runtimeToday}
                    </span>
                    <span className="font-mono text-[10px] text-[#627768]">
                      Mode: {device.mode}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="p-5 rounded-2xl bg-[#16211A] border border-[#27352D] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#27352D]">
              <h3 className="text-sm font-bold text-[#F0F5F1] uppercase tracking-wider font-mono">
                Recent Activity Feed
              </h3>
              <span className="text-[10px] text-[#36D17C] font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#36D17C] animate-pulse" /> Live
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {[
                {
                  id: 1,
                  title: 'Sensor readings updated',
                  desc: '8 telemetry parameters received via MQTT (Topic: /hydro/sensors)',
                  time: 'Just now',
                  icon: Activity,
                  color: 'text-[#36D17C]',
                  bg: 'bg-[#36D17C]/10',
                },
                {
                  id: 2,
                  title: 'Grow light switched OFF',
                  desc: 'Rule #3 daylight threshold exceeded 65% PAR level',
                  time: '14 mins ago',
                  icon: Sliders,
                  color: 'text-[#64B5F6]',
                  bg: 'bg-[#64B5F6]/10',
                },
                {
                  id: 3,
                  title: 'MQTT message acknowledged',
                  desc: 'ESP32 published QoS 1 telemetry heartbeat packet',
                  time: '28 mins ago',
                  icon: Radio,
                  color: 'text-[#36D17C]',
                  bg: 'bg-[#36D17C]/10',
                },
                {
                  id: 4,
                  title: 'Turbidity monitoring alert',
                  desc: 'Reading 420 NTU nearing 450 monitoring boundary',
                  time: '45 mins ago',
                  icon: AlertTriangle,
                  color: 'text-amber-400',
                  bg: 'bg-amber-400/10',
                },
                {
                  id: 5,
                  title: 'ESP32 Wi-Fi reconnected',
                  desc: 'Re-authenticated with Greenhouse_AP_01 (-58 dBm)',
                  time: '1h 12m ago',
                  icon: CheckCircle2,
                  color: 'text-[#36D17C]',
                  bg: 'bg-[#36D17C]/10',
                },
              ].map((act) => {
                const ActIcon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 text-xs">
                    <div className={`p-1.5 rounded-lg ${act.bg} ${act.color} mt-0.5 shrink-0`}>
                      <ActIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#F0F5F1] truncate">{act.title}</p>
                      <p className="text-[11px] text-[#95A69A] line-clamp-1">{act.desc}</p>
                    </div>
                    <span className="text-[10px] text-[#627768] font-mono shrink-0">
                      {act.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27352D] text-center">
            <button
              onClick={() => setActivePage('alerts')}
              className="text-xs text-[#95A69A] hover:text-[#36D17C] transition-colors"
            >
              View Full Event Log →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// 8 Primary sensor metric cards rendered in responsive grid

// Environmental Trends multi-series SVG chart with 1H, 6H, 24H, 7D filters

// System Health circular gauge and segmented diagnostic checks
