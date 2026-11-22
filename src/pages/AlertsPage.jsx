import React, { useState } from 'react';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Info,
  Clock,
  Filter,
  ShieldAlert,
  Search,
  Check,
  Eye,
  Radio,
  Sliders,
  Cpu
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
      color: 'text-amber-400',
    },
    {
      id: 2,
      category: 'device',
      title: 'Water Pump Scheduled Run Cycle Completed',
      detail: 'Relay 1 toggled OFF after circulating nutrient solution for 15 minutes.',
      time: '48 mins ago',
      icon: Sliders,
      color: 'text-[#36D17C]',
    },
    {
      id: 3,
      category: 'automation',
      title: 'Daylight Rule Triggered',
      detail: 'Ambient light sensor measured 68% PAR. Grow light de-energized to save energy.',
      time: '1h 20m ago',
      icon: CheckCircle2,
      color: 'text-[#64B5F6]',
    },
    {
      id: 4,
      category: 'network',
      title: 'ESP32 Wi-Fi Node Reconnected',
      detail: 'Established 802.11b/g/n link to Greenhouse_AP_01 with RSSI -58 dBm.',
      time: '3 hours ago',
      icon: Radio,
      color: 'text-[#36D17C]',
    },
    {
      id: 5,
      category: 'device',
      title: 'Grow Light Activated (Rule Boost)',
      detail: 'Relay 2 energized during early morning low-light period.',
      time: '5 hours ago',
      icon: Sliders,
      color: 'text-amber-400',
    },
  ].filter((e) => timelineCategory === 'all' || e.category === timelineCategory);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#36D17C] bg-[#36D17C]/10 px-2 py-0.5 rounded-full border border-[#36D17C]/20 font-semibold">
              Diagnostic Supervision
            </span>
            <SimulatedBadge label="ESP32 Alert Dispatcher" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Alerts & System Logs
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-1 max-w-xl">
            Supervise biochemical boundary transgressions, actuator status switches, wireless connectivity dropouts, and fail-safe safety events.
          </p>
        </div>
      </div>

      {/* 2. Summary Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[#16211A] border border-[#27352D]">
          <span className="text-xs text-[#95A69A] font-medium block">Active Alerts</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#F0F5F1] mt-1 block">
            {activeCount}
          </span>
          <span className="text-[10px] text-[#627768] font-mono mt-1 block">Requiring inspection</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#16211A] border border-red-500/30">
          <span className="text-xs text-red-400 font-medium block">Critical Alerts</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-red-400 mt-1 block">
            {criticalCount}
          </span>
          <span className="text-[10px] text-red-400/80 font-mono mt-1 block">Safety shut-offs</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#16211A] border border-amber-500/30">
          <span className="text-xs text-amber-400 font-medium block">Warnings</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400 mt-1 block">
            {warningCount}
          </span>
          <span className="text-[10px] text-amber-400/80 font-mono mt-1 block">Boundary monitoring</span>
        </div>

        <div className="p-4 rounded-2xl bg-[#16211A] border border-[#36D17C]/30">
          <span className="text-xs text-[#36D17C] font-medium block">Resolved Today</span>
          <span className="text-2xl sm:text-3xl font-extrabold font-mono text-[#36D17C] mt-1 block">
            {resolvedCount}
          </span>
          <span className="text-[10px] text-[#36D17C]/80 font-mono mt-1 block">Cleared conditions</span>
        </div>
      </div>

      {/* 3. Alerts Table */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[#F0F5F1]">Active & Historical Alert Queue</h3>
            <p className="text-xs text-[#95A69A]">Filter and acknowledge anomalous transducer signals</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#95A69A]" />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] placeholder-[#627768] focus:outline-none focus:border-[#36D17C]"
              />
            </div>

            {/* Severity Filter */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="warning">Warning</option>
              <option value="info">Information</option>
            </select>
          </div>
        </div>

        {/* The Alert List */}
        <div className="overflow-x-auto rounded-xl border border-[#27352D]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#121A15] text-[#95A69A] font-mono border-b border-[#27352D]">
              <tr>
                <th className="py-3 px-4">Severity</th>
                <th className="py-3 px-4">Alert Title & Detail</th>
                <th className="py-3 px-4">Source Device</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#27352D]/60 bg-[#16211A]">
              {filteredAlerts.map((alert) => {
                let badge = (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    INFO
                  </span>
                );
                if (alert.severity === 'critical') {
                  badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/15 text-red-400 border border-red-500/30">
                      CRITICAL
                    </span>
                  );
                } else if (alert.severity === 'warning') {
                  badge = (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      WARNING
                    </span>
                  );
                }

                return (
                  <tr key={alert.id} className="hover:bg-[#18231C] transition-colors">
                    <td className="py-3 px-4">{badge}</td>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-[#F0F5F1]">{alert.title}</p>
                      <p className="text-[11px] text-[#95A69A] line-clamp-1">{alert.message}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-[#95A69A]">{alert.source}</td>
                    <td className="py-3 px-4 font-mono text-[#627768] text-[10px]">{alert.timestamp}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono capitalize ${
                          alert.status === 'resolved'
                            ? 'bg-[#36D17C]/15 text-[#36D17C]'
                            : alert.status === 'acknowledged'
                            ? 'bg-amber-500/15 text-amber-300'
                            : 'bg-red-500/15 text-red-400 font-bold'
                        }`}
                      >
                        {alert.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setViewDetailAlert(alert)}
                          className="p-1 rounded-lg text-[#95A69A] hover:text-[#F0F5F1] hover:bg-[#121A15]"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {alert.status === 'active' && (
                          <button
                            onClick={() => onAcknowledgeAlert(alert.id)}
                            className="px-2 py-1 rounded-lg bg-amber-500/10 text-amber-300 text-[10px] font-mono hover:bg-amber-500/20"
                            title="Acknowledge alert"
                          >
                            Ack
                          </button>
                        )}
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => onResolveAlert(alert.id)}
                            className="px-2 py-1 rounded-lg bg-[#36D17C]/10 text-[#36D17C] text-[10px] font-mono hover:bg-[#36D17C]/20"
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
      <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#27352D]">
          <div>
            <h3 className="text-base font-bold text-[#F0F5F1]">Chronological System Event Timeline</h3>
            <p className="text-xs text-[#95A69A]">Trace hardware, network, and automated relay transitions</p>
          </div>

          {/* Timeline Category Filters */}
          <div className="flex flex-wrap items-center gap-1 p-1 rounded-xl bg-[#121A15] border border-[#27352D]">
            {['all', 'sensor', 'device', 'network', 'automation'].map((cat) => (
              <button
                key={cat}
                onClick={() => setTimelineCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono capitalize transition-all ${
                  timelineCategory === cat
                    ? 'bg-[#36D17C]/15 text-[#36D17C] font-bold border border-[#36D17C]/30'
                    : 'text-[#95A69A] hover:text-[#F0F5F1]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-[#27352D]">
          {timelineEvents.map((event) => {
            const Icon = event.icon;
            return (
              <div key={event.id} className="relative flex items-start gap-4 pl-8 text-xs">
                <div className="absolute left-1.5 top-1 -translate-x-1/2 w-4 h-4 rounded-full bg-[#121A15] border-2 border-[#36D17C] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#36D17C]" />
                </div>
                <div className="flex-1 p-3 rounded-xl bg-[#121A15] border border-[#27352D]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#F0F5F1] flex items-center gap-1.5">
                      <Icon className={`w-3.5 h-3.5 ${event.color}`} />
                      {event.title}
                    </span>
                    <span className="text-[10px] text-[#627768] font-mono">{event.time}</span>
                  </div>
                  <p className="text-[11px] text-[#95A69A]">{event.detail}</p>
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
            <div className="p-3 rounded-xl bg-[#121A15] border border-[#27352D] space-y-2">
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Severity:</span>
                <span className="font-bold text-amber-400 uppercase">{viewDetailAlert.severity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Origin Transducer:</span>
                <span className="font-mono text-[#F0F5F1]">{viewDetailAlert.source}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Detected At:</span>
                <span className="font-mono text-[#F0F5F1]">{viewDetailAlert.rawTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Current Status:</span>
                <span className="font-mono text-[#36D17C] capitalize">{viewDetailAlert.status}</span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-[#F0F5F1] block mb-1">Diagnostic Detail:</span>
              <p className="p-3 rounded-xl bg-[#121A15] border border-[#27352D] text-[#95A69A] leading-relaxed">
                {viewDetailAlert.message}
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#27352D]">
              <button
                onClick={() => setViewDetailAlert(null)}
                className="px-4 py-2 rounded-xl bg-[#18231C] text-[#F0F5F1]"
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
