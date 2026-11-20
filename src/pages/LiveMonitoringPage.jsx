import React, { useState } from 'react';
import {
  Activity,
  Play,
  Pause,
  Download,
  Filter,
  Search,
  ArrowUpDown,
  CheckCircle2,
  AlertTriangle,
  Info,
  Maximize2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import SimulatedBadge from '../components/SimulatedBadge';
import { exportToCsv, getSvgPath, getSvgAreaPath } from '../utils/helpers';

export default function LiveMonitoringPage({
  sensors,
  isLiveUpdating,
  setIsLiveUpdating,
}) {
  const [timeRange, setTimeRange] = useState('15m');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState(['air_temp', 'water_temp']);
  const [focusedSensor, setFocusedSensor] = useState(null);

  // Filtered & sorted sensors for table
  const filteredSensors = sensors
    .filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.sensorId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === 'all' || s.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleExportCsv = () => {
    const exportData = sensors.map((s) => ({
      Sensor_Name: s.name,
      Sensor_ID: s.sensorId,
      Current_Value: s.value,
      Unit: s.unit,
      Status: s.status,
      Min_Recorded: s.min,
      Max_Recorded: s.max,
      Avg_Recorded: s.avg,
      Target_Range: `${s.targetMin} - ${s.targetMax}`,
      Timestamp: new Date().toISOString(),
    }));
    exportToCsv(`HYDROSMART_Live_Telemetry_${Date.now()}.csv`, exportData);
  };

  const toggleCompareSensor = (id) => {
    if (selectedForCompare.includes(id)) {
      if (selectedForCompare.length > 1) {
        setSelectedForCompare(selectedForCompare.filter((x) => x !== id));
      }
    } else {
      if (selectedForCompare.length < 4) {
        setSelectedForCompare([...selectedForCompare, id]);
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#18231C] border border-[#27352D] text-xs font-mono text-[#F0F5F1]">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveUpdating ? 'bg-[#36D17C] animate-ping' : 'bg-amber-400'
                }`}
              />
              <span>{isLiveUpdating ? 'STREAMING REAL-TIME' : 'STREAM PAUSED'}</span>
            </span>
            <SimulatedBadge label="ESP32 Emulation Active" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Live Monitoring
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-0.5">
            Real-time sensor telemetry, high-frequency time-series graphs, and multi-channel telemetry inspection.
          </p>
        </div>

        {/* Controls: Pause, Time Range, Compare, Export */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsLiveUpdating(!isLiveUpdating)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              isLiveUpdating
                ? 'bg-[#16211A] border-[#27352D] text-[#95A69A] hover:text-[#F0F5F1]'
                : 'bg-amber-500/20 border-amber-500/40 text-amber-300'
            }`}
          >
            {isLiveUpdating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-400" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#36D17C]" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#16211A] border border-[#27352D]">
            {['5m', '15m', '30m', '1h', '6h'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  timeRange === r
                    ? 'bg-[#36D17C]/15 text-[#36D17C] border border-[#36D17C]/30 font-bold'
                    : 'text-[#95A69A] hover:text-[#F0F5F1]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Compare Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${
              compareMode
                ? 'bg-[#36D17C]/20 text-[#36D17C] border-[#36D17C]/40'
                : 'bg-[#16211A] text-[#95A69A] border-[#27352D] hover:text-[#F0F5F1]'
            }`}
          >
            {compareMode ? 'Exit Compare' : 'Compare Sensors'}
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16211A] border border-[#27352D] text-xs font-medium text-[#95A69A] hover:text-[#36D17C] hover:border-[#36D17C]/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Comparison Overlay Panel (if enabled) */}
      {compareMode && (
        <div className="p-5 rounded-2xl bg-[#16211A] border border-[#36D17C]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27352D]">
            <div>
              <h3 className="text-sm font-bold text-[#F0F5F1] flex items-center gap-2">
                <span>Multi-Sensor Comparison Mode</span>
                <span className="text-[10px] text-[#36D17C] font-mono font-normal">
                  (Normalized Overlay 0 - 100%)
                </span>
              </h3>
              <p className="text-xs text-[#95A69A]">
                Select up to 4 sensors to analyze synchronized environmental correlations.
              </p>
            </div>

            {/* Sensor selector chips */}
            <div className="flex flex-wrap gap-1.5">
              {sensors.map((s) => {
                const isSelected = selectedForCompare.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleCompareSensor(s.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-[#36D17C] text-[#0B110E] font-bold shadow-sm'
                        : 'bg-[#121A15] text-[#95A69A] border border-[#27352D] hover:text-[#F0F5F1]'
                    }`}
                  >
                    {s.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Multi-series chart */}
          <div className="h-56 relative w-full">
            <svg className="w-full h-full" viewBox="0 0 600 180" preserveAspectRatio="none">
              {/* Grid */}
              {[0, 45, 90, 135, 180].map((y, i) => (
                <line
                  key={i}
                  x1="0"
                  y1={y}
                  x2="600"
                  y2={y}
                  stroke="#27352D"
                  strokeDasharray="3 3"
                />
              ))}

              {selectedForCompare.map((id, sIdx) => {
                const sensor = sensors.find((x) => x.id === id);
                if (!sensor) return null;
                const colors = ['#36D17C', '#64B5F6', '#F5B942', '#EF6464'];
                const strokeColor = colors[sIdx % colors.length];
                const hist = sensor.history || [sensor.value, sensor.value];

                return (
                  <path
                    key={id}
                    d={getSvgPath(hist, 600, 180, 10)}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2 border-t border-[#27352D]">
            {selectedForCompare.map((id, sIdx) => {
              const sensor = sensors.find((x) => x.id === id);
              if (!sensor) return null;
              const colors = ['#36D17C', '#64B5F6', '#F5B942', '#EF6464'];
              return (
                <div key={id} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: colors[sIdx % colors.length] }}
                  />
                  <span className="text-[#F0F5F1]">{sensor.name}:</span>
                  <span className="text-[#36D17C] font-bold">
                    {sensor.value} {sensor.unit}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Individual 8 Sensor Detailed Chart Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {sensors.map((sensor) => {
          const history = sensor.history || [sensor.value, sensor.value * 0.98, sensor.value];
          return (
            <div
              key={sensor.id}
              className="p-4 rounded-2xl bg-[#16211A] border border-[#27352D] hover:border-[#36D17C]/40 transition-all flex flex-col justify-between min-h-[260px]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#F0F5F1] truncate">
                      {sensor.name}
                    </h3>
                    <p className="text-[10px] text-[#627768] font-mono">
                      {sensor.sensorId}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      sensor.status === 'Normal'
                        ? 'bg-[#36D17C]/10 text-[#36D17C] border border-[#36D17C]/20'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}
                  >
                    {sensor.status}
                  </span>
                </div>

                {/* Main Value Display */}
                <div className="my-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#F0F5F1] font-mono">
                      {typeof sensor.value === 'number'
                        ? sensor.value.toFixed(sensor.id === 'air_humidity' || sensor.id === 'tds' || sensor.id === 'turbidity' || sensor.id === 'light_intensity' ? 0 : 1)
                        : sensor.value}
                    </span>
                    <span className="ml-1 text-xs text-[#95A69A]">{sensor.unit}</span>
                  </div>
                  <span className="text-[10px] text-[#95A69A] font-mono">
                    Target: {sensor.targetMin}-{sensor.targetMax}
                  </span>
                </div>

                {/* SVG Time-series graph */}
                <div className="w-full h-24 my-2">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <defs>
                      <linearGradient id={`grad-chart-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#36D17C" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#36D17C" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={getSvgAreaPath(history, 200, 80, 4)}
                      fill={`url(#grad-chart-${sensor.id})`}
                    />
                    <path
                      d={getSvgPath(history, 200, 80, 4)}
                      fill="none"
                      stroke="#36D17C"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Statistics Strip: Min, Avg, Max */}
              <div className="pt-2 border-t border-[#27352D]/60 grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-1 rounded bg-[#121A15] border border-[#27352D]/40">
                  <span className="text-[#627768] block">MIN</span>
                  <span className="text-[#F0F5F1] font-semibold">{sensor.min}</span>
                </div>
                <div className="p-1 rounded bg-[#121A15] border border-[#27352D]/40">
                  <span className="text-[#627768] block">AVG</span>
                  <span className="text-[#64B5F6] font-semibold">{sensor.avg}</span>
                </div>
                <div className="p-1 rounded bg-[#121A15] border border-[#27352D]/40">
                  <span className="text-[#627768] block">MAX</span>
                  <span className="text-[#F0F5F1] font-semibold">{sensor.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Sensor Data Table */}
      <div className="p-5 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#F0F5F1]">
              Sensor Telemetry Roster
            </h3>
            <p className="text-xs text-[#95A69A]">
              Tabular view of all registered analog and digital transducers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#95A69A]" />
              <input
                type="text"
                placeholder="Search sensor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] placeholder-[#627768] focus:outline-none focus:border-[#36D17C]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#95A69A]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
              >
                <option value="all">All Status</option>
                <option value="normal">Normal</option>
                <option value="monitoring">Monitoring</option>
                <option value="warning">Warning</option>
              </select>
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto rounded-xl border border-[#27352D]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121A15] text-[#95A69A] font-mono border-b border-[#27352D]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0F5F1]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sensor Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sensorId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0F5F1]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sensor ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('value')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0F5F1]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Reading</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Unit</th>
                <th className="py-3 px-4">Optimal Range</th>
                <th
                  onClick={() => handleSort('status')}
                  className="py-3 px-4 cursor-pointer hover:text-[#F0F5F1]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27352D]/60 bg-[#16211A]">
              {filteredSensors.map((s) => (
                <tr key={s.id} className="hover:bg-[#18231C] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#F0F5F1] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#36D17C]" />
                    {s.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#95A69A]">{s.sensorId}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#F0F5F1]">
                    {s.value}
                  </td>
                  <td className="py-3 px-4 text-[#95A69A]">{s.unit}</td>
                  <td className="py-3 px-4 font-mono text-[#95A69A]">
                    {s.targetMin} - {s.targetMax} {s.unit}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        s.status === 'Normal'
                          ? 'bg-[#36D17C]/15 text-[#36D17C]'
                          : 'bg-amber-500/15 text-amber-300'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#627768] font-mono">Just now (1s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
