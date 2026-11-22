import React, { useState } from 'react';
import {
  FileBarChart,
  Download,
  Printer,
  FileText,
  Sparkles,
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
  const [reportsList] = useState([
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
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#166534] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20 font-semibold">
              Data Synthesis
            </span>
            <SimulatedBadge label="Telemetry Exporter" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            Reports & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-xl">
            Compile aggregated telemetry archives, protocol benchmark trials, and actuator duty cycles into downloadable research packages.
          </p>
        </div>

        {/* Quick Export Actions */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={handleDownloadCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5EAE6] text-xs font-mono text-[#647067] hover:text-[#16A34A] hover:border-[#16A34A]/40 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV</span>
          </button>
          <button
            onClick={handleDownloadJson}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E5EAE6] text-xs font-mono text-[#647067] hover:text-[#16A34A] hover:border-[#16A34A]/40 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON</span>
          </button>
        </div>
      </div>

      {/* 2. Report Generation Configuration Form */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#18221C] flex items-center gap-2">
          <FileBarChart className="w-4 h-4 text-[#16A34A]" />
          <span>Report Formulation Engine</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="text-xs font-semibold text-[#647067] block mb-1">
              Audit Category
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] focus:outline-none focus:border-[#16A34A]"
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
            <label className="text-xs font-semibold text-[#647067] block mb-1">
              Time Horizon
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] focus:outline-none focus:border-[#16A34A]"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days (Recommended)</option>
              <option value="30d">Last 30 Days (Full Cycle)</option>
            </select>
          </div>

          {/* Sensor Scope */}
          <div>
            <label className="text-xs font-semibold text-[#647067] block mb-1">
              Transducer Filter
            </label>
            <select
              value={selectedSensor}
              onChange={(e) => setSelectedSensor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] focus:outline-none focus:border-[#16A34A]"
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] transition-all text-xs font-bold font-mono tracking-wider shadow-xs"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isGenerating ? 'SYNTHESIZING REPORT...' : 'COMPILE REPORT'}</span>
          </button>
        </div>
      </div>

      {/* 3. Generated Report Preview Card (if generated) */}
      {generatedReport && (
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#16A34A]/40 shadow-sm space-y-4 animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5EAE6]">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold text-[#166534] tracking-wider block">
                COMPILATION COMPLETE
              </span>
              <h3 className="text-lg font-bold text-[#18221C]">{generatedReport.title}</h3>
              <p className="text-xs text-[#647067]">
                Horizon: {generatedReport.range} • Generated: {generatedReport.createdAt}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreviewModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs font-medium text-[#18221C] hover:text-[#16A34A] shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Printable Preview</span>
              </button>
              <button
                onClick={handleDownloadCsv}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/30 text-xs font-mono font-bold shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Audit CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
              <span className="text-[#89938B] block text-[10px]">AIR TEMP AVG</span>
              <span className="text-[#18221C] font-bold text-sm">26.8 °C</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
              <span className="text-[#89938B] block text-[10px]">WATER TEMP AVG</span>
              <span className="text-[#18221C] font-bold text-sm">23.1 °C</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
              <span className="text-[#89938B] block text-[10px]">PH AVG</span>
              <span className="text-[#166534] font-bold text-sm">6.18 pH</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
              <span className="text-[#89938B] block text-[10px]">NUTRIENT TDS</span>
              <span className="text-[#166534] font-bold text-sm">845 ppm</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
              <span className="text-[#89938B] block text-[10px]">PUMP RUNTIME</span>
              <span className="text-[#2563EB] font-bold text-sm">28h 40m</span>
            </div>
            <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
              <span className="text-[#89938B] block text-[10px]">MQTT RELIABILITY</span>
              <span className="text-[#166534] font-bold text-sm">99.6%</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Historical Reports Archive */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <h3 className="text-base font-bold text-[#18221C]">Historical Research Dossiers</h3>

        <div className="divide-y divide-[#E5EAE6] text-xs">
          {reportsList.map((rep) => (
            <div
              key={rep.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#F7F9F7] p-2 rounded-xl transition-colors"
            >
              <div className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-[#18221C]">{rep.title}</h4>
                  <p className="text-[11px] text-[#647067]">
                    {rep.type} • {rep.range} • {rep.size}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="px-2 py-0.5 rounded-full bg-[#F7F9F7] text-[#647067] border border-[#E5EAE6] font-mono text-[10px]">
                  {rep.format}
                </span>
                <button
                  onClick={handleDownloadCsv}
                  className="p-1.5 rounded-lg text-[#647067] hover:text-[#16A34A] hover:bg-white transition-colors"
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
          <div className="space-y-4 text-xs font-sans text-[#18221C]">
            <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex items-center justify-between">
              <div>
                <p className="font-mono font-bold text-base text-[#166534]">HYDROSMART IOT AUDIT</p>
                <p className="text-[#647067] text-[11px]">ESP32 Greenhouse Automated Monitoring System</p>
              </div>
              <div className="text-right font-mono text-[10px] text-[#89938B]">
                <p>Report ID: {generatedReport.id}</p>
                <p>{generatedReport.createdAt}</p>
              </div>
            </div>

            <div className="border border-[#E5EAE6] rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F7F9F7] text-[#647067] font-mono border-b border-[#E5EAE6]">
                  <tr>
                    <th className="p-2.5">Transducer / Metric</th>
                    <th className="p-2.5">Mean Reading</th>
                    <th className="p-2.5">Standard Deviation</th>
                    <th className="p-2.5">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5EAE6] bg-white font-mono">
                  <tr>
                    <td className="p-2.5 text-[#18221C]">Canopy Air Temperature</td>
                    <td className="p-2.5">26.8 °C</td>
                    <td className="p-2.5 text-[#647067]">± 1.4 °C</td>
                    <td className="p-2.5 text-[#166534] font-semibold">100% In Bounds</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#18221C]">Relative Atmospheric Humidity</td>
                    <td className="p-2.5">64.5 %</td>
                    <td className="p-2.5 text-[#647067]">± 4.2 %</td>
                    <td className="p-2.5 text-[#166534] font-semibold">Optimal Transpiration</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#18221C]">Reservoir Solution Acidity</td>
                    <td className="p-2.5">6.18 pH</td>
                    <td className="p-2.5 text-[#647067]">± 0.08 pH</td>
                    <td className="p-2.5 text-[#166534] font-semibold">Stable Buffered</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 text-[#18221C]">Total Dissolved Solids (TDS)</td>
                    <td className="p-2.5">845 ppm</td>
                    <td className="p-2.5 text-[#647067]">± 25 ppm</td>
                    <td className="p-2.5 text-[#166534] font-semibold">Target Absorption</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAE6]">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-[#16A34A] text-white font-bold text-xs hover:bg-[#15803D]"
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
