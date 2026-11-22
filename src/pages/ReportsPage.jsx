import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Calendar,
  Filter,
  Printer,
  CheckCircle2,
  FileText,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import SimulatedBadge from '../components/SimulatedBadge';
import Modal from '../components/Modal';
import { exportToCsv } from '../utils/helpers';

export default function ReportsPage({ sensors, devices, alerts }) {
  const [reportType, setReportType] = useState('environmental_trends');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedSensor, setSelectedSensor] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Past reports list
  const [reportsList, setReportsList] = useState([
    {
      id: 'REP-2026-11-01',
      title: 'Weekly Hydroponic Water Chemistry Audit',
      type: 'Water Quality',
      range: 'Nov 14 - Nov 21, 2026',
      size: '1.4 MB',
      format: 'PDF + CSV',
      status: 'Archived',
    },
    {
      id: 'REP-2026-11-02',
      title: 'ESP32 MQTT vs HTTP Telemetry Latency Benchmark',
      type: 'Protocol Benchmarks',
      range: 'Nov 18, 2026',
      size: '840 KB',
      format: 'PDF + JSON',
      status: 'Published',
    },
    {
      id: 'REP-2026-11-03',
      title: 'Canopy Vapor Pressure Deficit & Light PAR Exposure',
      type: 'Environmental Trends',
      range: 'Nov 20 - Nov 21, 2026',
      size: '2.1 MB',
      format: 'PDF',
      status: 'Archived',
    },
  ]);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      const newRep = {
        id: `REP-${Date.now().toString().slice(-6)}`,
        title: `${reportType.replace('_', ' ').toUpperCase()} Comprehensive Audit`,
        type: reportType.replace('_', ' '),
        range: dateRange === '24h' ? 'Last 24 Hours' : dateRange === '7d' ? 'Last 7 Days' : 'Last 30 Days',
        createdAt: new Date().toLocaleString(),
        summaryStats: {
          airTempAvg: '26.8 °C',
          waterTempAvg: '23.1 °C',
          phAvg: '6.18 pH',
          tdsAvg: '845 ppm',
          pumpUptime: '28h 40m',
          mqttReliability: '99.6%',
        },
      };
      setGeneratedReport(newRep);
    }, 600);
  };

  const handleDownloadCsv = () => {
    const data = sensors.map((s) => ({
      Sensor: s.name,
      ID: s.sensorId,
      Current: s.value,
      Unit: s.unit,
      Min: s.min,
      Avg: s.avg,
      Max: s.max,
      Status: s.status,
    }));
    exportToCsv(`HYDROSMART_Report_${Date.now()}.csv`, data);
  };

  const handleDownloadJson = () => {
    const data = {
      meta: {
        system: 'HYDROSMART Intelligent Hydroponics',
        node: 'ESP32-WROOM-32',
        generatedAt: new Date().toISOString(),
      },
      sensors,
      devices,
      alerts,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HYDROSMART_DataExport_${Date.now()}.json`;
    link.click();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#36D17C] bg-[#36D17C]/10 px-2 py-0.5 rounded-full border border-[#36D17C]/20 font-semibold">
              Data Synthesis
            </span>
            <SimulatedBadge label="Telemetry Exporter" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-1 max-w-xl">
            Compile aggregated telemetry archives, protocol benchmark trials, and actuator duty cycles into downloadable research packages.
          </p>
        </div>

        {/* Quick Export Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16211A] border border-[#27352D] text-xs font-mono text-[#95A69A] hover:text-[#36D17C] hover:border-[#36D17C]/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#16211A] border border-[#27352D] text-xs font-mono text-[#95A69A] hover:text-[#36D17C] hover:border-[#36D17C]/40 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Report Generation Configuration Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        <h3 className="text-base font-bold text-[#F0F5F1] flex items-center gap-2">
          <FileBarChart className="w-4 h-4 text-[#36D17C]" />
          <span>Report Formulation Engine</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="text-xs font-semibold text-[#95A69A] block mb-1">
              Audit Category
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
            >
              <option value="environmental_trends">Environmental Canopy Trends</option>
              <option value="water_quality">Water Quality & Nutrient Solution</option>
              <option value="device_usage">Actuator Runtimes & Energy</option>
              <option value="protocol_benchmarks">IoT Protocol Benchmarks (MQTT/HTTP/CoAP)</option>
              <option value="alert_history">Safety & Anomaly Log</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <label className="text-xs font-semibold text-[#95A69A] block mb-1">
              Time Horizon
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days (Recommended)</option>
              <option value="30d">Last 30 Days (Full Cycle)</option>
            </select>
          </div>

          {/* Sensor Scope */}
          <div>
            <label className="text-xs font-semibold text-[#95A69A] block mb-1">
              Transducer Filter
            </label>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
            >
              <option value="all">All Channels (Comprehensive)</option>
              {sensors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#36D17C] text-[#0B110E] hover:bg-[#4AE695] transition-all text-xs font-bold font-mono tracking-wider shadow-lg shadow-[#36D17C]/10"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'SYNTHESIZING REPORT...' : 'COMPILE REPORT'}</span>
          </button>
        </div>
      </div>

      {/* 3. Generated Report Preview Card (if generated) */}
      {generatedReport && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#36D17C]/40 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27352D]">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#36D17C] tracking-wider block">
                COMPILATION COMPLETE
              </span>
              <h3 className="text-lg font-bold text-[#F0F5F1]">{generatedReport.title}</h3>
              <p className="text-xs text-[#95A69A]">
                Horizon: {generatedReport.range} • Generated: {generatedReport.createdAt}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#18231C] border border-[#27352D] text-xs font-medium text-[#F0F5F1] hover:text-[#36D17C]"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Printable Preview</span>
              </button>
              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#36D17C]/15 text-[#36D17C] border border-[#36D17C]/30 text-xs font-mono font-bold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
              <span className="text-[#627768] block text-[10px]">AIR TEMP AVG</span>
              <span className="text-[#F0F5F1] font-bold text-sm">26.8 °C</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
              <span className="text-[#627768] block text-[10px]">WATER TEMP AVG</span>
              <span className="text-[#F0F5F1] font-bold text-sm">23.1 °C</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
              <span className="text-[#627768] block text-[10px]">PH AVG</span>
              <span className="text-[#36D17C] font-bold text-sm">6.18 pH</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
              <span className="text-[#627768] block text-[10px]">NUTRIENT TDS</span>
              <span className="text-[#36D17C] font-bold text-sm">845 ppm</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
              <span className="text-[#627768] block text-[10px]">PUMP RUNTIME</span>
              <span className="text-[#64B5F6] font-bold text-sm">28h 40m</span>
            </div>
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
              <span className="text-[#627768] block text-[10px]">MQTT RELIABILITY</span>
              <span className="text-[#36D17C] font-bold text-sm">99.6%</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Historical Reports Archive */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        <h3 className="text-base font-bold text-[#F0F5F1]">Historical Research Dossiers</h3>

        <div className="divide-y divide-[#27352D]/60 text-xs">
          {reportsList.map((rep) => (
            <div
              key={rep.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#18231C]/40 p-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#36D17C] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#F0F5F1]">{rep.title}</h4>
                  <p className="text-[11px] text-[#95A69A]">
                    {rep.type} • {rep.range} • {rep.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded-full bg-[#18231C] text-[#95A69A] font-mono text-[10px]">
                  {rep.format}
                </span>
                <button
                  onClick={handleDownloadCsv}
                  className="p-1.5 rounded-lg text-[#95A69A] hover:text-[#36D17C] hover:bg-[#121A15]"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Printable Modal Preview */}
      {showPreviewModal && generatedReport && (
        <Modal
          isOpen={true}
          onClose={() => setShowPreviewModal(false)}
          title="Printable Audit Dossier"
          subtitle={generatedReport.title}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-4 text-xs font-sans text-[#F0F5F1]">
            <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-base text-[#36D17C]">HYDROSMART IOT AUDIT</p>
                <p className="text-[#95A69A] text-[11px]">ESP32 Greenhouse Automated Monitoring System</p>
              </div>
              <div className="text-right font-mono text-[10px] text-[#627768]">
                <p>Report ID: {generatedReport.id}</p>
                <p>{generatedReport.createdAt}</p>
              </div>
            </div>

            <div className="border border-[#27352D] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121A15] text-[#95A69A] font-mono border-b border-[#27352D]">
                  <tr>
                    <th className="p-2.5">Transducer / Metric</th>
                    <th className="p-2.5">Mean Reading</th>
                    <th className="p-2.5">Standard Deviation</th>
                    <th className="p-2.5">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#27352D]/60 bg-[#16211A] font-mono">
                  <tr>
                    <td className="p-2.5 text-[#F0F5F1]">Canopy Air Temperature</td>
                    <td className="p-2.5">26.8 °C</td>
                    <td className="p-2.5 text-[#95A69A]">± 1.4 °C</td>
                    <td className="p-2.5 text-[#36D17C]">100% In Bounds</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#F0F5F1]">Relative Atmospheric Humidity</td>
                    <td className="p-2.5">64.5 %</td>
                    <td className="p-2.5 text-[#95A69A]">± 4.2 %</td>
                    <td className="p-2.5 text-[#36D17C]">Optimal Transpiration</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#F0F5F1]">Reservoir Solution Acidity</td>
                    <td className="p-2.5">6.18 pH</td>
                    <td className="p-2.5 text-[#95A69A]">± 0.08 pH</td>
                    <td className="p-2.5 text-[#36D17C]">Stable Buffered</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#F0F5F1]">Total Dissolved Solids (TDS)</td>
                    <td className="p-2.5">845 ppm</td>
                    <td className="p-2.5 text-[#95A69A]">± 25 ppm</td>
                    <td className="p-2.5 text-[#36D17C]">Target Absorption</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#27352D]">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#36D17C] text-[#0B110E] font-bold text-xs"
              >
                Print / Save PDF
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
