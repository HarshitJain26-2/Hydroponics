import React, { useState } from 'react';
import {
  Activity,
  Play,
  Pause,
  Download,
  Filter,
  Search,
  ArrowUpDown,
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
      <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EAF7EE] border border-[#16A34A]/20 text-xs font-mono text-[#166534] font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  isLiveUpdating ? 'bg-[#16A34A] animate-ping' : 'bg-amber-500'
                }`}
              />
              <span>{isLiveUpdating ? 'STREAMING REAL-TIME' : 'STREAM PAUSED'}</span>
            </span>
            <SimulatedBadge label="ESP32 Emulation Active" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            Live Monitoring
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-0.5">
            Real-time sensor telemetry, high-frequency time-series graphs, and multi-channel telemetry inspection.
          </p>
        </div>

        {/* Controls: Pause, Time Range, Compare, Export */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsLiveUpdating(!isLiveUpdating)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-colors shadow-xs ${
              isLiveUpdating
                ? 'bg-white border-[#E5EAE6] text-[#647067] hover:text-[#18221C]'
                : 'bg-amber-50 border-amber-300 text-amber-800 font-semibold'
            }`}
          >
            {isLiveUpdating ? (
              <>
                <Pause className="w-3.5 h-3.5 text-amber-600" />
                <span>Pause Stream</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Resume Stream</span>
              </>
            )}
          </button>

          {/* Time Range Selector */}
          <div className="flex items-center p-1 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            {['5m', '15m', '30m', '1h', '6h'].map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-2 py-1 rounded-lg text-xs font-mono transition-all ${
                  timeRange === r
                    ? 'bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/30 font-bold shadow-xs'
                    : 'text-[#647067] hover:text-[#18221C]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Compare Toggle */}
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors shadow-xs ${
              compareMode
                ? 'bg-[#EAF7EE] text-[#166534] border-[#16A34A]/40 font-semibold'
                : 'bg-white text-[#647067] border-[#E5EAE6] hover:text-[#18221C]'
            }`}
          >
            {compareMode ? 'Exit Compare' : 'Compare Sensors'}
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5EAE6] text-xs font-medium text-[#647067] hover:text-[#16A34A] hover:border-[#16A34A]/40 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Comparison Overlay Panel (if enabled) */}
      {compareMode && (
        <div className="p-5 rounded-2xl bg-white border border-[#16A34A]/30 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5EAE6]">
            <div>
              <h3 className="text-sm font-bold text-[#18221C] flex items-center gap-2">
                <span>Multi-Sensor Comparison Mode</span>
                <span className="text-[10px] text-[#166534] font-mono font-normal">
                  (Normalized Overlay 0 - 100%)
                </span>
              </h3>
              <p className="text-xs text-[#647067]">
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
                        ? 'bg-[#16A34A] text-white font-bold shadow-xs'
                        : 'bg-[#F7F9F7] text-[#647067] border border-[#E5EAE6] hover:text-[#18221C]'
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
                  stroke="#E5EAE6"
                  strokeDasharray="3 3"
                />
              ))}

              {selectedForCompare.map((id, sIdx) => {
                const sensor = sensors.find((x) => x.id === id);
                if (!sensor) return null;
                const colors = ['#16A34A', '#2563EB', '#F59E0B', '#DC2626'];
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

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-2 border-t border-[#E5EAE6]">
            {selectedForCompare.map((id, sIdx) => {
              const sensor = sensors.find((x) => x.id === id);
              if (!sensor) return null;
              const colors = ['#16A34A', '#2563EB', '#F59E0B', '#DC2626'];
              return (
                <div key={id} className="flex items-center gap-1.5">
                  <span
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ backgroundColor: colors[sIdx % colors.length] }}
                  />
                  <span className="text-[#18221C] font-medium">{sensor.name}:</span>
                  <span className="text-[#166534] font-bold">
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
              className="p-4 rounded-2xl bg-white border border-[#E5EAE6] hover:border-[#16A34A]/40 hover:shadow-md transition-all flex flex-col justify-between min-h-[260px]"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[#18221C] truncate">
                      {sensor.name}
                    </h3>
                    <p className="text-[10px] text-[#89938B] font-mono">
                      {sensor.sensorId}
                    </p>
                  </div>
                  <span
                    className={`text-[11px] font-mono px-2 py-0.5 rounded-full ${
                      sensor.status === 'Normal'
                        ? 'bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/20'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {sensor.status}
                  </span>
                </div>

                {/* Main Value Display */}
                <div className="my-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-[#18221C] font-mono">
                      {typeof sensor.value === 'number'
                        ? sensor.value.toFixed(sensor.id === 'air_humidity' || sensor.id === 'tds' || sensor.id === 'turbidity' || sensor.id === 'light_intensity' ? 0 : 1)
                        : sensor.value}
                    </span>
                    <span className="ml-1 text-xs text-[#647067]">{sensor.unit}</span>
                  </div>
                  <span className="text-[10px] text-[#89938B] font-mono">
                    Target: {sensor.targetMin}-{sensor.targetMax}
                  </span>
                </div>

                {/* SVG Time-series graph */}
                <div className="w-full h-24 my-2">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <defs>
                      <linearGradient id={`grad-chart-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
                        <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={getSvgAreaPath(history, 200, 80, 4)}
                      fill={`url(#grad-chart-${sensor.id})`}
                    />
                    <path
                      d={getSvgPath(history, 200, 80, 4)}
                      fill="none"
                      stroke="#16A34A"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Statistics Strip: Min, Avg, Max */}
              <div className="pt-2 border-t border-[#E5EAE6] grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                <div className="p-1 rounded bg-[#F7F9F7] border border-[#E5EAE6]">
                  <span className="text-[#89938B] block">MIN</span>
                  <span className="text-[#18221C] font-semibold">{sensor.min}</span>
                </div>
                <div className="p-1 rounded bg-[#F7F9F7] border border-[#E5EAE6]">
                  <span className="text-[#89938B] block">AVG</span>
                  <span className="text-[#2563EB] font-semibold">{sensor.avg}</span>
                </div>
                <div className="p-1 rounded bg-[#F7F9F7] border border-[#E5EAE6]">
                  <span className="text-[#89938B] block">MAX</span>
                  <span className="text-[#18221C] font-semibold">{sensor.max}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Sensor Data Table */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#18221C]">
              Sensor Telemetry Roster
            </h3>
            <p className="text-xs text-[#647067]">
              Tabular view of all registered analog and digital transducers
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#89938B]" />
              <input
                type="text"
                placeholder="Search sensor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] placeholder-[#89938B] focus:outline-none focus:border-[#16A34A]"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <Filter className="w-3.5 h-3.5 text-[#647067]" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] focus:outline-none focus:border-[#16A34A]"
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
        <div className="overflow-x-auto rounded-xl border border-[#E5EAE6]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#647067] font-mono border-b border-[#E5EAE6]">
              <tr>
                <th
                  onClick={() => handleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:text-[#18221C]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sensor Name</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('sensorId')}
                  className="py-3 px-4 cursor-pointer hover:text-[#18221C]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Sensor ID</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('value')}
                  className="py-3 px-4 cursor-pointer hover:text-[#18221C]"
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
                  className="py-3 px-4 cursor-pointer hover:text-[#18221C]"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Last Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6] bg-white">
              {filteredSensors.map((s) => (
                <tr key={s.id} className="hover:bg-[#F7F9F7] transition-colors">
                  <td className="py-3 px-4 font-semibold text-[#18221C] flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    {s.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#647067]">{s.sensorId}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#18221C]">
                    {s.value}
                  </td>
                  <td className="py-3 px-4 text-[#647067]">{s.unit}</td>
                  <td className="py-3 px-4 font-mono text-[#647067]">
                    {s.targetMin} - {s.targetMax} {s.unit}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                        s.status === 'Normal'
                          ? 'bg-[#EAF7EE] text-[#166534]'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#89938B] font-mono">Just now (1s)</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
