import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Search,
  Eye,
  Sliders,
  Radio,
} from 'lucide-react';
import SimulatedBadge from '../components/SimulatedBadge';
import Modal from '../components/Modal';

export default function AlertsPage({
  alerts,
  onResolveAlert,
  onAcknowledgeAlert,
}) {
  const [severityFilter, setSeverityFilter] = useState('all');
  const [timelineCategory, setTimelineCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewDetailAlert, setViewDetailAlert] = useState(null);

  // Counters
  const activeCount = alerts.filter((a) => a.status === 'active').length;
  const criticalCount = alerts.filter((a) => a.severity === 'critical' && a.status !== 'resolved').length;
  const warningCount = alerts.filter((a) => a.severity === 'warning' && a.status !== 'resolved').length;
  const resolvedCount = alerts.filter((a) => a.status === 'resolved').length;

  const filteredAlerts = alerts.filter((a) => {
    const matchesSev =
      severityFilter === 'all' || a.severity === severityFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSev && matchesSearch;
  });

  // Timeline events
  const timelineEvents = [
    {
      id: 1,
      category: 'sensor',
      title: 'Turbidity Reading Elevated (420 NTU)',
      detail: 'Analog sensor ADC exceeded normal baseline. Biofilter check suggested.',
      time: '22 mins ago',
      icon: AlertTriangle,
      color: 'text-amber-600',
    },
    {
      id: 2,
      category: 'device',
      title: 'Water Pump Scheduled Run Cycle Completed',
      detail: 'Relay 1 toggled OFF after circulating nutrient solution for 15 minutes.',
      time: '48 mins ago',
      icon: Sliders,
      color: 'text-[#16A34A]',
    },
    {
      id: 3,
      category: 'automation',
      title: 'Daylight Rule Triggered',
      detail: 'Ambient light sensor measured 68% PAR. Grow light de-energized to save energy.',
      time: '1h 20m ago',
      icon: CheckCircle2,
      color: 'text-[#2563EB]',
    },
    {
      id: 4,
      category: 'network',
      title: 'ESP32 Wi-Fi Node Reconnected',
      detail: 'Established 802.11b/g/n link to Greenhouse_AP_01 with RSSI -58 dBm.',
      time: '3 hours ago',
      icon: Radio,
      color: 'text-[#16A34A]',
    },
    {
      id: 5,
      category: 'device',
      title: 'Grow Light Activated (Rule Boost)',
      detail: 'Relay 2 energized during early morning low-light period.',
      time: '5 hours ago',
      icon: Sliders,
      color: 'text-amber-600',
    },
  ].filter((e) => timelineCategory === 'all' || e.category === timelineCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#166534] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20 font-semibold">
              Diagnostic Supervision
            </span>
            <SimulatedBadge label="ESP32 Alert Dispatcher" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            Alerts & System Logs
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-xl">
            Supervise biochemical boundary transgressions, actuator status switches, wireless connectivity dropouts, and fail-safe safety events.
          </p>
        </div>
      </div>

      {/* 2. Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
          <span className="text-xs text-[#647067] font-medium block">Active Alerts</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#18221C] mt-1 block">
            {activeCount}
          </span>
          <span className="text-[10px] text-[#89938B] font-mono mt-1 block">Requiring inspection</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] border-l-4 border-l-red-500 shadow-xs">
          <span className="text-xs text-red-700 font-medium block">Critical Alerts</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-red-600 mt-1 block">
            {criticalCount}
          </span>
          <span className="text-[10px] text-red-600 font-mono mt-1 block">Safety shut-offs</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] border-l-4 border-l-amber-500 shadow-xs">
          <span className="text-xs text-amber-800 font-medium block">Warnings</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-600 mt-1 block">
            {warningCount}
          </span>
          <span className="text-[10px] text-amber-700 font-mono mt-1 block">Boundary monitoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#E5EAE6] border-l-4 border-l-[#16A34A] shadow-xs">
          <span className="text-xs text-[#166534] font-medium block">Resolved Today</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#16A34A] mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[10px] text-[#166534] font-mono mt-1 block">Cleared conditions</span>
        </div>
      </div>

      {/* 3. Alerts Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#18221C]">Active & Historical Alert Queue</h3>
            <p className="text-xs text-[#647067]">Filter and acknowledge anomalous transducer signals</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#89938B]" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] placeholder-[#89938B] focus:outline-none focus:border-[#16A34A]"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs text-[#18221C] focus:outline-none focus:border-[#16A34A]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Information</option>
            </select>
          </div>
        </div>

        {/* The Alert List */}
        <div className="overflow-x-auto rounded-xl border border-[#E5EAE6]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#647067] font-mono border-b border-[#E5EAE6]">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Alert Title & Detail</th>
                <th className="py-3 px-4">Source Device</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6] bg-white">
              {filteredAlerts.map((alert) => {
                let badge = (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-50 text-[#1D4ED8] border border-blue-200">
                    INFO
                  </span>
                );
                if (alert.severity === 'critical') {
                  badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-50 text-red-700 border border-red-200">
                      CRITICAL
                    </span>
                  );
                } else if (alert.severity === 'warning') {
                  badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      WARNING
                    </span>
                  );
                }

                return (
                  <tr key={alert.id} className="hover:bg-[#F7F9F7] transition-colors">
                    <td className="py-3 px-4">{badge}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#18221C]">{alert.title}</p>
                      <p className="text-[11px] text-[#647067] line-clamp-1">{alert.message}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#647067]">{alert.source}</td>
                    <td className="py-3 px-4 font-mono text-[#89938B] text-[10px]">{alert.timestamp}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono capitalize ${
                          alert.status === 'resolved'
                            ? 'bg-[#EAF7EE] text-[#166534]'
                            : alert.status === 'acknowledged'
                            ? 'bg-amber-100 text-amber-800 font-semibold'
                            : 'bg-red-50 text-red-700 font-bold'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDetailAlert(alert)}
                          className="p-1.5 rounded-lg text-[#647067] hover:text-[#18221C] hover:bg-[#F3F6F4]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {alert.status === 'active' && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[10px] font-mono font-medium hover:bg-amber-100"
                            title="Acknowledge alert"
                          >
                            Ack
                          </button>
                        )}
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => onResolveAlert(alert.id)}
                            className="px-2.5 py-1 rounded-lg bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/20 text-[10px] font-mono font-medium hover:bg-[#d5eedc]"
                            title="Mark resolved"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Chronological Activity Timeline */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5EAE6]">
          <div>
            <h3 className="text-base font-bold text-[#18221C]">Chronological System Event Timeline</h3>
            <p className="text-xs text-[#647067]">Trace hardware, network, and automated relay transitions</p>
          </div>

          {/* Timeline Category Filters */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            {['all', 'sensor', 'device', 'network', 'automation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTimelineCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  timelineCategory === cat
                    ? 'bg-[#EAF7EE] text-[#166534] font-bold border border-[#16A34A]/30 shadow-xs'
                    : 'text-[#647067] hover:text-[#18221C]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#E5EAE6]">
          {timelineEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative flex items-start gap-4 pl-8 text-xs">
                <div className="absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-white border-2 border-[#16A34A] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                </div>
                <div className="flex-1 p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#18221C] flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${event.color}`} />
                      {event.title}
                    </span>
                    <span className="text-[10px] text-[#89938B] font-mono">{event.time}</span>
                  </div>
                  <p className="text-[11px] text-[#647067]">{event.detail}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Detail Modal */}
      {viewDetailAlert && (
        <Modal
          isOpen={true}
          onClose={() => setViewDetailAlert(null)}
          title="Alert Diagnostics"
          subtitle={`Event ID: ${viewDetailAlert.id}`}
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#647067]">Severity:</span>
                <span className="font-bold text-amber-700 uppercase">{viewDetailAlert.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647067]">Origin Transducer:</span>
                <span className="font-mono text-[#18221C] font-semibold">{viewDetailAlert.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647067]">Detected At:</span>
                <span className="font-mono text-[#18221C]">{viewDetailAlert.rawTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#647067]">Current Status:</span>
                <span className="font-mono text-[#166534] font-semibold capitalize">{viewDetailAlert.status}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-[#18221C] block mb-1">Diagnostic Detail:</span>
              <p className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#647067] leading-relaxed">
                {viewDetailAlert.message}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E5EAE6]">
              <button
                onClick={() => setViewDetailAlert(null)}
                className="px-4 py-2 rounded-xl bg-[#F3F6F4] text-[#18221C] font-medium hover:bg-[#E5EAE6]"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
