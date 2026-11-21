import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  ShieldCheck,
  Power,
  RotateCcw,
  Clock,
  ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';
import SimulatedBadge from '../components/SimulatedBadge';

export default function AutomationPage({
  rules,
  onToggleRule,
  onSaveRule,
  onDeleteRule,
  sensors,
  devices,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  // Form State
  const [name, setName] = useState('');
  const [sensor, setSensor] = useState('water_level');
  const [condition, setCondition] = useState('greater_than');
  const [threshold, setThreshold] = useState('85');
  const [action, setAction] = useState('turn_off');
  const [targetDevice, setTargetDevice] = useState('pump');
  const [priority, setPriority] = useState('Critical');
  const [enabled, setEnabled] = useState(true);
  const [description, setDescription] = useState('');

  const openNewRuleModal = () => {
    setEditingRule(null);
    setName('');
    setSensor('water_level');
    setCondition('greater_than');
    setThreshold('85');
    setAction('turn_off');
    setTargetDevice('pump');
    setPriority('Critical');
    setEnabled(true);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (r) => {
    setEditingRule(r);
    setName(r.name);
    setSensor(r.sensor);
    setCondition(r.condition);
    setThreshold(r.threshold.toString());
    setAction(r.action);
    setTargetDevice(r.targetDevice);
    setPriority(r.priority);
    setEnabled(r.enabled);
    setDescription(r.description);
    setIsModalOpen(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const sensorObj = sensors.find((s) => s.id === sensor);
    const deviceObj = devices.find((d) => d.id === targetDevice);

    const saved = {
      id: editingRule ? editingRule.id : `rule_${Date.now()}`,
      name: name || 'Custom Automation Rule',
      sensor,
      sensorName: sensorObj ? sensorObj.name : sensor,
      condition,
      threshold: parseFloat(threshold) || 0,
      unit: sensorObj ? sensorObj.unit : '',
      action,
      targetDevice,
      deviceName: action === 'alert_only' ? 'Alert Dispatcher' : deviceObj ? deviceObj.shortName : 'Device',
      priority,
      enabled,
      description: description || `IF ${sensor} ${condition} ${threshold} THEN ${action} on ${targetDevice}`,
      lastTriggered: editingRule ? editingRule.lastTriggered : 'Never',
      triggerCount: editingRule ? editingRule.triggerCount : 0,
    };

    onSaveRule(saved);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header & New Rule Button */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#36D17C] bg-[#36D17C]/10 px-2 py-0.5 rounded-full border border-[#36D17C]/20">
              Logic & Triggers Engine
            </span>
            <SimulatedBadge label="ESP32 Rule Simulation" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Automation Center
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-1 max-w-xl">
            Configure autonomous closed-loop triggers to turn pumps on/off, regulate grow lighting, and dispatch alerts without human intervention.
          </p>
        </div>

        <button
          onClick={openNewRuleModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#36D17C] text-[#0B110E] hover:bg-[#4AE695] transition-all text-xs font-bold font-mono tracking-wider shadow-lg shadow-[#36D17C]/10 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW RULE</span>
        </button>
      </div>

      {/* 2. Automation Rule Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => {
          let priorityBadge = (
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
              {rule.priority} Priority
            </span>
          );
          if (rule.priority === 'Critical') {
            priorityBadge = (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 border border-red-500/30">
                CRITICAL
              </span>
            );
          } else if (rule.priority === 'High') {
            priorityBadge = (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                HIGH
              </span>
            );
          }

          return (
            <div
              key={rule.id}
              className={`p-5 rounded-2xl bg-[#16211A] border transition-all duration-200 flex flex-col justify-between ${
                rule.enabled ? 'border-[#27352D] hover:border-[#36D17C]/40' : 'border-[#27352D]/50 opacity-60'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                        rule.enabled
                          ? 'bg-[#182B20] border-[#36D17C]/30 text-[#36D17C]'
                          : 'bg-[#121A15] border-[#27352D] text-[#95A69A]'
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#F0F5F1]">{rule.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        {priorityBadge}
                        <span className="text-[10px] text-[#627768] font-mono">
                          ID: {rule.id}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enable/Disable Toggle */}
                  <button
                    onClick={() => onToggleRule(rule.id)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                      rule.enabled ? 'bg-[#36D17C]' : 'bg-[#27352D]'
                    }`}
                    title={rule.enabled ? 'Click to disable' : 'Click to enable'}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-[#121A15] shadow-lg ring-0 transition duration-200 ease-in-out ${
                        rule.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Logic Formula Display Box */}
                <div className="my-4 p-3 rounded-xl bg-[#121A15] border border-[#27352D] font-mono text-xs space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-400 font-bold">IF</span>
                    <span className="text-[#F0F5F1] font-semibold">{rule.sensorName}</span>
                    <span className="text-[#95A69A]">
                      {rule.condition === 'greater_than' ? 'is greater than (>)' : 'falls below (<)'}
                    </span>
                    <span className="text-[#36D17C] font-bold">
                      {rule.threshold} {rule.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-[#27352D]/60">
                    <span className="text-blue-400 font-bold">THEN</span>
                    <span className="text-[#F0F5F1] font-semibold uppercase">
                      {rule.action.replace('_', ' ')}
                    </span>
                    <ArrowRight className="w-3 h-3 text-[#95A69A]" />
                    <span className="text-[#36D17C] font-bold">{rule.deviceName}</span>
                  </div>
                </div>

                <p className="text-xs text-[#95A69A] leading-relaxed">
                  {rule.description}
                </p>
              </div>

              {/* Bottom Actions & Trigger Statistics */}
              <div className="mt-4 pt-3 border-t border-[#27352D]/60 flex items-center justify-between text-xs">
                <div className="text-[11px] font-mono text-[#627768] flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  <span>Last fired: {rule.lastTriggered}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(rule)}
                    className="p-1.5 rounded-lg text-[#95A69A] hover:text-[#36D17C] hover:bg-[#18231C] transition-colors"
                    title="Edit Rule"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeleteRule(rule.id)}
                    className="p-1.5 rounded-lg text-[#95A69A] hover:text-[#EF6464] hover:bg-[#18231C] transition-colors"
                    title="Delete Rule"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Automation Activity & Execution Log */}
      <div className="p-5 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-3">
        <h3 className="text-sm font-bold text-[#F0F5F1] uppercase tracking-wider font-mono">
          Rule Execution History
        </h3>
        <div className="divide-y divide-[#27352D]/60 text-xs">
          {[
            {
              rule: 'Daylight Energy Conservation',
              action: 'Disengaged Grow Light (Turned OFF)',
              condition: 'Foliage light reading 68% exceeded 65% setpoint',
              time: 'Today 09:15',
              status: 'Success',
            },
            {
              rule: 'Insufficient Ambient Daylight Boost',
              action: 'Engaged Grow Light (Turned ON)',
              condition: 'Evening dusk ambient PAR fell to 38%',
              time: 'Yesterday 17:40',
              status: 'Success',
            },
            {
              rule: 'Nutrient Solution Overheating Protection',
              action: 'Dispatched High Priority Alert',
              condition: 'Reservoir temp reached 25.6°C during heat spike',
              time: '3 days ago',
              status: 'Success',
            },
          ].map((log, idx) => (
            <div key={idx} className="py-2.5 flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-[#F0F5F1]">{log.rule}</p>
                <p className="text-[11px] text-[#36D17C]">{log.action}</p>
                <p className="text-[11px] text-[#95A69A]">{log.condition}</p>
              </div>
              <div className="text-right shrink-0 font-mono text-[10px]">
                <span className="px-2 py-0.5 rounded-full bg-[#36D17C]/15 text-[#36D17C]">
                  {log.status}
                </span>
                <span className="text-[#627768] block mt-1">{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Rule Builder Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRule ? 'Edit Automation Rule' : 'Create Automation Rule'}
        subtitle="Specify conditions and deterministic actuators for the ESP32 logic controller"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-[#95A69A] block mb-1">
              Rule Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Low Water Tank Cutoff"
              className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#95A69A] block mb-1">
                Sensor Input
              </label>
              <select
                value={sensor}
                onChange={(e) => setSensor(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
              >
                {sensors.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#95A69A] block mb-1">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
              >
                <option value="greater_than">Greater Than (&gt;)</option>
                <option value="less_than">Less Than (&lt;)</option>
                <option value="equal_to">Equal To (=)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#95A69A] block mb-1">
                Threshold Value
              </label>
              <input
                type="number"
                step="any"
                required
                value={threshold}
                onChange={(e) => setThreshold(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-[#95A69A] block mb-1">
                Action
              </label>
              <select
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
              >
                <option value="turn_off">Turn OFF</option>
                <option value="turn_on">Turn ON</option>
                <option value="alert_only">Alert Only</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#95A69A] block mb-1">
                Target Device
              </label>
              <select
                value={targetDevice}
                onChange={(e) => setTargetDevice(e.target.value)}
                disabled={action === 'alert_only'}
                className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C] disabled:opacity-50"
              >
                <option value="pump">Water Pump</option>
                <option value="light">Grow Light</option>
                <option value="none">None / Alert Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-[#95A69A] block mb-1">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
              >
                <option value="Critical">Critical (Immediate Cutoff)</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="flex items-center pt-6 gap-2">
              <input
                type="checkbox"
                id="enableRule"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                className="w-4 h-4 accent-[#36D17C] rounded cursor-pointer"
              />
              <label htmlFor="enableRule" className="text-xs font-medium text-[#F0F5F1] cursor-pointer">
                Enable rule immediately upon save
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-[#95A69A] block mb-1">
              Rule Description / Rationale
            </label>
            <textarea
              rows="2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this rule exists and safety implications..."
              className="w-full px-3 py-2 rounded-xl bg-[#121A15] border border-[#27352D] text-xs text-[#F0F5F1] focus:outline-none focus:border-[#36D17C]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[#27352D]">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs text-[#95A69A] hover:bg-[#18231C]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#36D17C] text-[#0B110E] font-bold text-xs hover:bg-[#4AE695] transition-colors"
            >
              {editingRule ? 'Save Changes' : 'Create Rule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
