import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Radio,
  Sliders,
  CheckCircle2,
  RotateCw,
  Save,
} from 'lucide-react';
import SimulatedBadge from '../components/SimulatedBadge';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('esp32');
  const [savedNotice, setSavedNotice] = useState(false);

  // ESP32 Settings State
  const [esp32Config, setEsp32Config] = useState({
    deviceName: 'ESP32-HYDRO-NODE-01',
    deviceId: 'ESP32_WROOM_32_B4E6',
    ipAddress: '192.168.1.142',
    wifiSsid: 'Greenhouse_AP_01',
    rssi: '-58 dBm (Excellent)',
    firmwareVersion: 'v2.4.1-rc3',
    uptime: '48h 22m 14s',
    macAddress: '24:6F:28:B4:E6:90',
  });

  // MQTT Settings State
  const [mqttConfig, setMqttConfig] = useState({
    broker: 'broker.emqx.io',
    port: 1883,
    clientId: 'HYDROSMART_GATEWAY_ESP32',
    pubTopic: '/hydrosmart/telemetry/sensors',
    subTopic: '/hydrosmart/actuators/control',
    qos: 1,
    keepAlive: 60,
    cleanSession: true,
  });

  // Calibration & Sampling
  const [sensorConfig, setSensorConfig] = useState({
    samplingInterval: 2000, // ms
    phOffset: 0.05,
    tempOffset: -0.2,
    tdsCalibrationFactor: 1.02,
    turbidityZeroCalibration: 410,
    tempUnit: 'Celsius',
  });

  // System Preferences
  const [sysConfig, setSysConfig] = useState({
    autoRefresh: true,
    refreshInterval: 3, // sec
    soundAlerts: false,
    retentionDays: 90,
  });

  // Test Ping State
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  const handleTestMqtt = () => {
    setIsTestingPing(true);
    setPingSuccess(false);
    setTimeout(() => {
      setIsTestingPing(false);
      setPingSuccess(true);
    }, 800);
  };

  const handleSaveAll = (e) => {
    e.preventDefault();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Toolbar */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#166534] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20 font-semibold">
              System Configuration
            </span>
            <SimulatedBadge label="ESP32 NVS Registry" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            System Settings & Connectivity
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-xl">
            Configure ESP32 microcontroller parameters, MQTT broker bindings, sensor analog calibrations, and system telemetry refresh cadences.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] transition-all text-xs font-bold font-mono tracking-wider shadow-xs self-start md:self-auto"
        >
          <Save className="w-4 h-4" />
          <span>{savedNotice ? 'CONFIGURATION SAVED!' : 'SAVE SETTINGS'}</span>
        </button>
      </div>

      {/* Confirmation Pill */}
      {savedNotice && (
        <div className="p-3 rounded-xl bg-[#EAF7EE] border border-[#16A34A]/30 text-xs font-mono text-[#166534] flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Settings successfully written to local cache and synchronized with ESP32 NVS memory!</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs overflow-x-auto">
        {[
          { id: 'esp32', label: 'ESP32 Microcontroller', icon: Cpu },
          { id: 'mqtt', label: 'MQTT Protocol Broker', icon: Radio },
          { id: 'sensors', label: 'Sensor Calibration', icon: Sliders },
          { id: 'system', label: 'Preferences & Retention', icon: SettingsIcon },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium font-mono whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/30 font-bold shadow-xs'
                  : 'text-[#647067] hover:text-[#18221C] hover:bg-[#F7F9F7]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 3. Tab Contents */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs">
        {/* TAB 1: ESP32 */}
        {activeTab === 'esp32' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5EAE6]">
              <div>
                <h3 className="text-base font-bold text-[#18221C]">ESP32 Hardware Diagnostics & Network</h3>
                <p className="text-xs text-[#647067]">Direct microcontroller specifications and radio status</p>
              </div>
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF7EE] text-[#166534] text-xs font-mono font-bold border border-[#16A34A]/30">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-ping" />
                ONLINE (HEARTBEAT 2s)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">NODE HOSTNAME</label>
                <input
                  type="text"
                  value={esp32Config.deviceName}
                  onChange={(e) => setEsp32Config({ ...esp32Config, deviceName: e.target.value })}
                  className="bg-transparent text-[#18221C] font-bold w-full focus:outline-none"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">CHIP MODEL / ID</label>
                <span className="text-[#18221C] font-bold">{esp32Config.deviceId}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">LOCAL IP ADDRESS</label>
                <span className="text-[#166534] font-bold">{esp32Config.ipAddress}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">WI-FI SSID</label>
                <span className="text-[#18221C] font-bold">{esp32Config.wifiSsid}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">SIGNAL RSSI</label>
                <span className="text-[#166534] font-bold">{esp32Config.rssi}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">FIRMWARE BUILD</label>
                <span className="text-[#18221C] font-bold">{esp32Config.firmwareVersion}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">UPTIME</label>
                <span className="text-[#18221C] font-bold">{esp32Config.uptime}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <label className="text-[#647067] block text-[10px] mb-1 font-semibold">HARDWARE MAC</label>
                <span className="text-[#647067]">{esp32Config.macAddress}</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex items-center justify-between">
                <div>
                  <label className="text-[#647067] block text-[10px] mb-1 font-semibold">RESTART NODE</label>
                  <span className="text-amber-800 font-bold">Soft Reset</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Soft reboot signal dispatched to ESP32 node via MQTT /sys/reboot')}
                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 text-xs font-semibold"
                >
                  Reboot
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MQTT */}
        {activeTab === 'mqtt' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE6]">
              <div>
                <h3 className="text-base font-bold text-[#18221C]">MQTT Broker & Messaging Parameters</h3>
                <p className="text-xs text-[#647067]">Set up pub/sub topics and broker connection parameters</p>
              </div>

              {/* Ping Broker Test */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestMqtt}
                  disabled={isTestingPing}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-xs font-mono text-[#18221C] hover:text-[#16A34A]"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin text-[#16A34A]' : ''}`} />
                  <span>Test Connection</span>
                </button>
                {pingSuccess && (
                  <span className="text-xs font-mono text-[#166534] flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> PING 12ms OK
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Broker Hostname / Address
                </label>
                <input
                  type="text"
                  value={mqttConfig.broker}
                  onChange={(e) => setMqttConfig({ ...mqttConfig, broker: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  TCP Port
                </label>
                <input
                  type="number"
                  value={mqttConfig.port}
                  onChange={(e) => setMqttConfig({ ...mqttConfig, port: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Client Identifier (ClientID)
                </label>
                <input
                  type="text"
                  value={mqttConfig.clientId}
                  onChange={(e) => setMqttConfig({ ...mqttConfig, clientId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Quality of Service (QoS) Level
                </label>
                <select
                  value={mqttConfig.qos}
                  onChange={(e) => setMqttConfig({ ...mqttConfig, qos: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                >
                  <option value={0}>QoS 0 (At most once - Fire and forget)</option>
                  <option value={1}>QoS 1 (At least once - Acknowledged, Recommended)</option>
                  <option value={2}>QoS 2 (Exactly once - Four-step handshake)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Telemetry Publish Topic
                </label>
                <input
                  type="text"
                  value={mqttConfig.pubTopic}
                  onChange={(e) => setMqttConfig({ ...mqttConfig, pubTopic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Actuator Command Topic
                </label>
                <input
                  type="text"
                  value={mqttConfig.subTopic}
                  onChange={(e) => setMqttConfig({ ...mqttConfig, subTopic: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: Sensor Calibration */}
        {activeTab === 'sensors' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#E5EAE6]">
              <h3 className="text-base font-bold text-[#18221C]">Analog Transducer Calibration & Sampling Cadence</h3>
              <p className="text-xs text-[#647067]">Compensate for sensor probe aging and temperature coefficients</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs font-mono">
              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Sampling Interval (ms)
                </label>
                <input
                  type="number"
                  value={sensorConfig.samplingInterval}
                  onChange={(e) => setSensorConfig({ ...sensorConfig, samplingInterval: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  pH Probe Offset (Delta)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sensorConfig.phOffset}
                  onChange={(e) => setSensorConfig({ ...sensorConfig, phOffset: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  DS18B20 Temp Offset (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={sensorConfig.tempOffset}
                  onChange={(e) => setSensorConfig({ ...sensorConfig, tempOffset: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  TDS EC Multiplier Factor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={sensorConfig.tdsCalibrationFactor}
                  onChange={(e) => setSensorConfig({ ...sensorConfig, tdsCalibrationFactor: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Turbidity Clear Water Baseline ADC
                </label>
                <input
                  type="number"
                  value={sensorConfig.turbidityZeroCalibration}
                  onChange={(e) => setSensorConfig({ ...sensorConfig, turbidityZeroCalibration: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#647067] block mb-1">
                  Thermal Unit Standard
                </label>
                <select
                  value={sensorConfig.tempUnit}
                  onChange={(e) => setSensorConfig({ ...sensorConfig, tempUnit: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                >
                  <option value="Celsius">Celsius (°C)</option>
                  <option value="Fahrenheit">Fahrenheit (°F)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: System Preferences */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="pb-4 border-b border-[#E5EAE6]">
              <h3 className="text-base font-bold text-[#18221C]">Dashboard Preferences & Data Retention</h3>
              <p className="text-xs text-[#647067]">Web interface telemetry display parameters and historical database policies</p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <div>
                  <span className="font-semibold text-[#18221C] block">Automatic Telemetry Polling</span>
                  <span className="text-[#647067]">Continuously fetch live sensor readings in the background</span>
                </div>
                <input
                  type="checkbox"
                  checked={sysConfig.autoRefresh}
                  onChange={(e) => setSysConfig({ ...sysConfig, autoRefresh: e.target.checked })}
                  className="w-4 h-4 accent-[#16A34A] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <div>
                  <span className="font-semibold text-[#18221C] block">Audio Alarm for Critical Alerts</span>
                  <span className="text-[#647067]">Trigger audible buzzer upon low water or thermal shutdown</span>
                </div>
                <input
                  type="checkbox"
                  checked={sysConfig.soundAlerts}
                  onChange={(e) => setSysConfig({ ...sysConfig, soundAlerts: e.target.checked })}
                  className="w-4 h-4 accent-[#16A34A] rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
                <div>
                  <span className="font-semibold text-[#18221C] block">Time-Series Data Retention Policy</span>
                  <span className="text-[#647067]">Prune historical telemetry data after elapsed timeframe</span>
                </div>
                <select
                  value={sysConfig.retentionDays}
                  onChange={(e) => setSysConfig({ ...sysConfig, retentionDays: Number(e.target.value) })}
                  className="px-3 py-1.5 rounded-xl bg-white border border-[#E5EAE6] text-xs text-[#18221C] focus:outline-none focus:border-[#16A34A]"
                >
                  <option value={30}>30 Days</option>
                  <option value={90}>90 Days (Recommended)</option>
                  <option value={365}>1 Year (Academic Archive)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
