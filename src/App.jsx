import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Modal from './components/Modal';
import OverviewPage from './pages/OverviewPage';
import LiveMonitoringPage from './pages/LiveMonitoringPage';
import PlantHealthPage from './pages/PlantHealthPage';
import DeviceControlPage from './pages/DeviceControlPage';
import AutomationPage from './pages/AutomationPage';
import ProtocolBenchmarkPage from './pages/ProtocolBenchmarkPage';
import AlertsPage from './pages/AlertsPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';

import {
  INITIAL_SENSORS,
  INITIAL_DEVICES,
  INITIAL_RULES,
  INITIAL_ALERTS,
  PLANT_PROFILES
} from './data/initialState';
import { AlertTriangle, Power } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Application State
  const [sensors, setSensors] = useState(INITIAL_SENSORS);
  const [devices, setDevices] = useState(INITIAL_DEVICES);
  const [rules, setRules] = useState(INITIAL_RULES);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [systemMode, setSystemMode] = useState('AUTO'); // 'AUTO' | 'MANUAL'
  const [currentPlantId, setCurrentPlantId] = useState('basil');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Emergency Stop Modal & State
  const [isEmergencyStopped, setIsEmergencyStopped] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  // Background Simulation Telemetry Loop
  useEffect(() => {
    if (!isLiveUpdating || isEmergencyStopped) return;

    const interval = setInterval(() => {
      setSensors((prevSensors) =>
        prevSensors.map((sensor) => {
          let delta = (Math.random() - 0.49) * 0.15;
          let newVal = sensor.value;

          if (sensor.id === 'air_temp') {
            newVal = Math.min(31, Math.max(22, sensor.value + delta * 0.5));
          } else if (sensor.id === 'air_humidity') {
            newVal = Math.min(80, Math.max(50, Math.round(sensor.value + (Math.random() - 0.5) * 1.2)));
          } else if (sensor.id === 'water_temp') {
            newVal = Math.min(27, Math.max(19, sensor.value + delta * 0.3));
          } else if (sensor.id === 'ph_level') {
            newVal = Math.min(7.2, Math.max(5.2, Number((sensor.value + delta * 0.1).toFixed(2))));
          } else if (sensor.id === 'tds') {
            newVal = Math.min(1100, Math.max(650, Math.round(sensor.value + (Math.random() - 0.5) * 4)));
          } else if (sensor.id === 'turbidity') {
            newVal = Math.min(550, Math.max(350, Math.round(sensor.value + (Math.random() - 0.5) * 3)));
          } else if (sensor.id === 'light_intensity') {
            newVal = Math.min(95, Math.max(10, Math.round(sensor.value + (Math.random() - 0.5) * 1.5)));
          } else if (sensor.id === 'water_level') {
            newVal = Math.min(90, Math.max(40, Math.round(sensor.value + (Math.random() - 0.5) * 0.4)));
          }

          const newHistory = [...(sensor.history || []), newVal].slice(-15);
          return {
            ...sensor,
            value: typeof newVal === 'number' && (sensor.id === 'ph_level' || sensor.id === 'air_temp' || sensor.id === 'water_temp')
              ? Number(newVal.toFixed(1))
              : newVal,
            history: newHistory,
          };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [isLiveUpdating, isEmergencyStopped]);

  // Manual Device Toggle
  const handleToggleDevice = (deviceId) => {
    if (systemMode === 'AUTO' || isEmergencyStopped) return;
    setDevices((prev) =>
      prev.map((d) => (d.id === deviceId ? { ...d, state: !d.state } : d))
    );
  };

  // Emergency Stop Execution
  const handleEmergencyShutdownConfirm = () => {
    setIsEmergencyStopped(true);
    setShowEmergencyModal(false);
    // Turn off all actuators immediately
    setDevices((prev) => prev.map((d) => ({ ...d, state: false })));
    // Add critical alert
    const shutdownAlert = {
      id: `alt_emergency_${Date.now()}`,
      severity: 'critical',
      title: 'EMERGENCY HARDWARE SHUTDOWN EXECUTED',
      message: 'Operator triggered emergency cutoff. All actuators (GPIO 26 pump, GPIO 27 light) de-energized immediately.',
      source: 'Safety Interlock Bus',
      category: 'device',
      timestamp: 'Just now',
      rawTime: new Date().toISOString(),
      status: 'active',
    };
    setAlerts((prev) => [shutdownAlert, ...prev]);
  };

  const handleResetEmergency = () => {
    setIsEmergencyStopped(false);
    // Mark emergency alert as resolved
    setAlerts((prev) =>
      prev.map((a) => (a.severity === 'critical' ? { ...a, status: 'resolved' } : a))
    );
  };

  // Rule Actions
  const handleToggleRule = (ruleId) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
  };

  const handleSaveRule = (savedRule) => {
    setRules((prev) => {
      const idx = prev.findIndex((r) => r.id === savedRule.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = savedRule;
        return updated;
      }
      return [savedRule, ...prev];
    });
  };

  const handleDeleteRule = (ruleId) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  // Alert Actions
  const handleResolveAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'resolved' } : a))
    );
  };

  const handleAcknowledgeAlert = (alertId) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, status: 'acknowledged' } : a))
    );
  };

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0B110E] text-[#F0F5F1] flex flex-col lg:flex-row antialiased">
      {/* Persistent Left Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
        activeAlertCount={alerts.filter((a) => a.status === 'active').length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <Header
          activePage={activePage}
          setActivePage={setActivePage}
          setMobileOpen={setMobileMenuOpen}
          alerts={alerts}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          systemMode={systemMode}
          onEmergencyStop={() => setShowEmergencyModal(true)}
        />

        {/* Dynamic Page Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activePage === 'overview' && (
            <OverviewPage
              sensors={sensors}
              devices={devices}
              onToggleDevice={handleToggleDevice}
              systemMode={systemMode}
              setSystemMode={setSystemMode}
              onSensorClick={(s) => setActivePage('monitoring')}
              onRefresh={handleManualRefresh}
              isRefreshing={isRefreshing}
              setActivePage={setActivePage}
            />
          )}

          {activePage === 'monitoring' && (
            <LiveMonitoringPage
              sensors={sensors}
              isLiveUpdating={isLiveUpdating}
              setIsLiveUpdating={setIsLiveUpdating}
            />
          )}

          {activePage === 'plant-health' && (
            <PlantHealthPage
              sensors={sensors}
              currentPlantId={currentPlantId}
              setCurrentPlantId={setCurrentPlantId}
            />
          )}

          {activePage === 'device-control' && (
            <DeviceControlPage
              devices={devices}
              onToggleDevice={handleToggleDevice}
              systemMode={systemMode}
              setSystemMode={setSystemMode}
              onEmergencyStop={() => setShowEmergencyModal(true)}
              onResetEmergency={handleResetEmergency}
              isEmergencyStopped={isEmergencyStopped}
            />
          )}

          {activePage === 'automation' && (
            <AutomationPage
              rules={rules}
              onToggleRule={handleToggleRule}
              onSaveRule={handleSaveRule}
              onDeleteRule={handleDeleteRule}
              sensors={sensors}
              devices={devices}
            />
          )}

          {activePage === 'protocol' && (
            <ProtocolBenchmarkPage />
          )}

          {activePage === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
              onAcknowledgeAlert={handleAcknowledgeAlert}
            />
          )}

          {activePage === 'reports' && (
            <ReportsPage
              sensors={sensors}
              devices={devices}
              alerts={alerts}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>

      {/* Emergency Stop Confirmation Modal */}
      {showEmergencyModal && (
        <Modal
          isOpen={true}
          onClose={() => setShowEmergencyModal(false)}
          title="Confirm Emergency Shutdown"
          subtitle="Hardware Fail-Safe Interlock Procedure"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-600/40 text-red-200 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold text-sm">CRITICAL WARNING</p>
                <p className="text-[11px] leading-relaxed">
                  Executing an emergency stop will instantly disengage GPIO 26 (Submersible Water Pump) and GPIO 27 (Full Spectrum Grow Light). All automated dosing and circulation will cease until manual override reset.
                </p>
              </div>
            </div>

            <p className="text-[#95A69A]">
              Are you sure you wish to cut all relay contacts immediately?
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-[#27352D]">
              <button
                type="button"
                onClick={() => setShowEmergencyModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-[#95A69A] hover:bg-[#18231C]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleEmergencyShutdownConfirm}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold font-mono text-xs flex items-center gap-1.5 shadow-lg shadow-red-950/40"
              >
                <Power className="w-3.5 h-3.5" />
                <span>CONFIRM EMERGENCY CUTOFF</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
