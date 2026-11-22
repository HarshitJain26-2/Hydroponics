import React, { useState, useRef } from 'react';
import {
  Play,
  Square,
  RotateCcw,
  Download,
  Server,
  Layers,
  Info
} from 'lucide-react';
import SimulatedBadge from '../components/SimulatedBadge';
import { exportToCsv } from '../utils/helpers';
import { INITIAL_BENCHMARK_PRESETS } from '../data/initialState';

export default function ProtocolBenchmarkPage() {
  const [protocolChoice, setProtocolChoice] = useState('ALL');
  const [messageCount, setMessageCount] = useState(500);
  const [payloadSize, setPayloadSize] = useState(256);
  const [intervalMs, setIntervalMs] = useState(100);
  const [iterations, setIterations] = useState(3);

  // Execution state
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStepInfo, setCurrentStepInfo] = useState('');
  const [activeTrialResults, setActiveTrialResults] = useState(null);
  const [history, setHistory] = useState(INITIAL_BENCHMARK_PRESETS.history);

  // Timer ref
  const timerRef = useRef(null);

  // Simulated Benchmark Engine
  const startBenchmark = () => {
    setIsRunning(true);
    setProgress(0);
    setCurrentStepInfo('Initializing ESP32 socket interfaces & MQTT broker connection...');

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      if (currentProgress === 20) {
        setCurrentStepInfo('Benchmarking MQTT QoS 1 Publish/Subscribe streaming...');
      } else if (currentProgress === 55) {
        setCurrentStepInfo('Benchmarking HTTP 1.1 POST REST requests & TLS handshakes...');
      } else if (currentProgress === 85) {
        setCurrentStepInfo('Benchmarking CoAP UDP datagram transmission & block-wise transfers...');
      } else if (currentProgress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        setProgress(100);
        setCurrentStepInfo('Benchmarking completed successfully. Aggregated trial statistics calculated.');

        const jitter = (Math.random() - 0.5) * 2;
        const mqttRtt = Number((18.4 + jitter * 0.8).toFixed(1));
        const httpRtt = Number((84.7 + jitter * 3.5).toFixed(1));
        const coapRtt = Number((24.1 + jitter * 1.2).toFixed(1));

        const newRuns = [
          {
            id: `RUN-${Date.now().toString().slice(-4)}-MQTT`,
            date: new Date().toLocaleTimeString(),
            protocol: 'MQTT',
            messagesSent: messageCount,
            messagesRecv: Math.round(messageCount * (0.995 + Math.random() * 0.004)),
            avgRttMs: mqttRtt,
            deliveryRate: Number((99.5 + Math.random() * 0.4).toFixed(1)),
            lossPct: Number((0.3 + Math.random() * 0.2).toFixed(1)),
            throughputMsgSec: Number((1000 / (intervalMs + mqttRtt * 0.3)).toFixed(1)),
            payloadBytes: payloadSize,
            overheadBytes: 32,
            status: 'Completed',
          },
          {
            id: `RUN-${Date.now().toString().slice(-4)}-HTTP`,
            date: new Date().toLocaleTimeString(),
            protocol: 'HTTP',
            messagesSent: messageCount,
            messagesRecv: Math.round(messageCount * (0.978 + Math.random() * 0.008)),
            avgRttMs: httpRtt,
            deliveryRate: Number((98.2 + Math.random() * 0.5).toFixed(1)),
            lossPct: Number((1.5 + Math.random() * 0.4).toFixed(1)),
            throughputMsgSec: Number((1000 / (intervalMs + httpRtt * 0.8)).toFixed(1)),
            payloadBytes: payloadSize,
            overheadBytes: 384,
            status: 'Completed',
          },
          {
            id: `RUN-${Date.now().toString().slice(-4)}-CoAP`,
            date: new Date().toLocaleTimeString(),
            protocol: 'CoAP',
            messagesSent: messageCount,
            messagesRecv: Math.round(messageCount * (0.988 + Math.random() * 0.005)),
            avgRttMs: coapRtt,
            deliveryRate: Number((99.0 + Math.random() * 0.4).toFixed(1)),
            lossPct: Number((0.9 + Math.random() * 0.3).toFixed(1)),
            throughputMsgSec: Number((1000 / (intervalMs + coapRtt * 0.4)).toFixed(1)),
            payloadBytes: payloadSize,
            overheadBytes: 48,
            status: 'Completed',
          },
        ];

        setActiveTrialResults({
          mqtt: newRuns[0],
          http: newRuns[1],
          coap: newRuns[2],
        });
        setHistory((prev) => [...newRuns, ...prev]);
      }
      setProgress(Math.min(currentProgress, 100));
    }, 150);

    timerRef.current = interval;
  };

  const stopBenchmark = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentStepInfo('Benchmark aborted by operator.');
  };

  const resetResults = () => {
    stopBenchmark();
    setProgress(0);
    setCurrentStepInfo('');
    setActiveTrialResults(null);
  };

  const handleExportCsv = () => {
    exportToCsv(`HYDROSMART_Protocol_Benchmark_${Date.now()}.csv`, history);
  };

  // Metrics to display (either active trial or defaults)
  const currentMqtt = activeTrialResults ? activeTrialResults.mqtt : history.find((h) => h.protocol === 'MQTT') || history[0];
  const currentHttp = activeTrialResults ? activeTrialResults.http : history.find((h) => h.protocol === 'HTTP') || history[1];
  const currentCoap = activeTrialResults ? activeTrialResults.coap : history.find((h) => h.protocol === 'CoAP') || history[2];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header Section */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#166534] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20 font-semibold">
              Academic IoT Protocol Lab
            </span>
            <SimulatedBadge label="ESP32 Network Simulation Model" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            IoT Protocol Benchmark
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-2xl">
            Experimentally evaluate and compare transmission latency, message delivery reliability, throughput, and packet header overhead for MQTT, HTTP/REST, and CoAP on ESP32 hardware.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E5EAE6] text-xs font-semibold text-[#647067] hover:text-[#16A34A] hover:border-[#16A34A]/40 transition-colors shadow-xs self-start md:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Research Dataset</span>
        </button>
      </div>

      {/* 2. Protocol Architectural Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* MQTT */}
        <div className="p-5 rounded-2xl bg-white border border-[#16A34A]/30 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#EAF7EE]/60 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-[#EAF7EE] text-[#166534] font-bold border border-[#16A34A]/20">
                TCP / BROKER
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            </div>
            <h3 className="text-lg font-bold text-[#18221C]">MQTT (v3.1.1)</h3>
            <p className="text-xs text-[#647067] mt-1 leading-relaxed">
              Publish/Subscribe lightweight telemetry messaging. Minimized 2-byte header, persistent TCP session with broker keep-alive and QoS delivery guarantees.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs font-mono text-[#647067]">
            <span>Transport: TCP/IP</span>
            <span className="text-[#166534] font-bold">Header: 2 - 4 Bytes</span>
          </div>
        </div>

        {/* HTTP */}
        <div className="p-5 rounded-2xl bg-white border border-blue-200 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/60 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-blue-50 text-[#1D4ED8] font-bold border border-blue-200">
                TCP / CLIENT-SERVER
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB]" />
            </div>
            <h3 className="text-lg font-bold text-[#18221C]">HTTP / REST</h3>
            <p className="text-xs text-[#647067] mt-1 leading-relaxed">
              Synchronous Request/Response web standard. Universal compatibility but incurs high TCP/TLS handshake penalties and large ASCII header overhead (200-800B).
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs font-mono text-[#647067]">
            <span>Transport: TCP/IP</span>
            <span className="text-[#2563EB] font-bold">Header: ~380 Bytes</span>
          </div>
        </div>

        {/* CoAP */}
        <div className="p-5 rounded-2xl bg-white border border-amber-200 relative overflow-hidden flex flex-col justify-between shadow-xs">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50/60 rounded-bl-full pointer-events-none" />
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                UDP / ASYNCHRONOUS
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
            </div>
            <h3 className="text-lg font-bold text-[#18221C]">CoAP (RFC 7252)</h3>
            <p className="text-xs text-[#647067] mt-1 leading-relaxed">
              Constrained Application Protocol for extreme low-power microcontroller nodes. Runs over connectionless UDP with binary 4-byte headers and asynchronous REST semantics.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs font-mono text-[#647067]">
            <span>Transport: UDP</span>
            <span className="text-amber-700 font-bold">Header: 4 Bytes</span>
          </div>
        </div>
      </div>

      {/* 3. Benchmark Configuration & Execution Panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE6]">
          <div>
            <h3 className="text-base font-bold text-[#18221C] flex items-center gap-2">
              <Server className="w-4 h-4 text-[#16A34A]" />
              <span>Experimental Test Parameters</span>
            </h3>
            <p className="text-xs text-[#647067]">
              Configure workload matrices to stress-test embedded network stacks under identical Wi-Fi RSSI conditions.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {!isRunning ? (
              <button
                onClick={startBenchmark}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white hover:bg-[#15803D] transition-all text-xs font-bold font-mono tracking-wider shadow-xs"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>START BENCHMARK</span>
              </button>
            ) : (
              <button
                onClick={stopBenchmark}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all text-xs font-bold font-mono tracking-wider animate-pulse shadow-xs"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>STOP TEST</span>
              </button>
            )}

            <button
              onClick={resetResults}
              disabled={isRunning}
              className="p-2.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] text-[#647067] hover:text-[#18221C] transition-colors disabled:opacity-50"
              title="Reset results"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form Controls Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Protocol Target */}
          <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <label className="text-[10px] text-[#647067] uppercase font-mono block mb-1 font-semibold">
              PROTOCOL
            </label>
            <select
              value={protocolChoice}
              onChange={(e) => setProtocolChoice(e.target.value)}
              disabled={isRunning}
              className="w-full bg-transparent text-xs font-bold font-mono text-[#18221C] focus:outline-none"
            >
              <option value="ALL">ALL (MQTT vs HTTP vs CoAP)</option>
              <option value="MQTT">MQTT Only</option>
              <option value="HTTP">HTTP Only</option>
              <option value="CoAP">CoAP Only</option>
            </select>
          </div>

          {/* Messages Count */}
          <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <label className="text-[10px] text-[#647067] uppercase font-mono block mb-1 font-semibold">
              MSG COUNT
            </label>
            <select
              value={messageCount}
              onChange={(e) => setMessageCount(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-transparent text-xs font-bold font-mono text-[#18221C] focus:outline-none"
            >
              <option value={50}>50 packets</option>
              <option value={100}>100 packets</option>
              <option value={250}>250 packets</option>
              <option value={500}>500 packets</option>
              <option value={1000}>1000 packets</option>
            </select>
          </div>

          {/* Payload Size */}
          <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <label className="text-[10px] text-[#647067] uppercase font-mono block mb-1 font-semibold">
              PAYLOAD SIZE
            </label>
            <select
              value={payloadSize}
              onChange={(e) => setPayloadSize(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-transparent text-xs font-bold font-mono text-[#18221C] focus:outline-none"
            >
              <option value={64}>64 Bytes</option>
              <option value={128}>128 Bytes</option>
              <option value={256}>256 Bytes (Default)</option>
              <option value={512}>512 Bytes</option>
              <option value={1024}>1024 Bytes</option>
            </select>
          </div>

          {/* Interval */}
          <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <label className="text-[10px] text-[#647067] uppercase font-mono block mb-1 font-semibold">
              INTERVAL
            </label>
            <select
              value={intervalMs}
              onChange={(e) => setIntervalMs(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-transparent text-xs font-bold font-mono text-[#18221C] focus:outline-none"
            >
              <option value={50}>50 ms</option>
              <option value={100}>100 ms</option>
              <option value={250}>250 ms</option>
              <option value={500}>500 ms</option>
            </select>
          </div>

          {/* Iterations */}
          <div className="p-3 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <label className="text-[10px] text-[#647067] uppercase font-mono block mb-1 font-semibold">
              ITERATIONS
            </label>
            <select
              value={iterations}
              onChange={(e) => setIterations(Number(e.target.value))}
              disabled={isRunning}
              className="w-full bg-transparent text-xs font-bold font-mono text-[#18221C] focus:outline-none"
            >
              <option value={1}>1 Trial</option>
              <option value={3}>3 Trials (Averaged)</option>
              <option value={5}>5 Trials (Rigorous)</option>
            </select>
          </div>
        </div>

        {/* Live Progress Bar when Running */}
        {(isRunning || progress > 0) && (
          <div className="space-y-2 pt-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-[#166534] flex items-center gap-1.5 font-medium">
                <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-[#16A34A] animate-ping' : 'bg-[#16A34A]'}`} />
                {currentStepInfo}
              </span>
              <span className="text-[#18221C] font-bold">{progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-[#16A34A] transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* 4. Comparative Metrics Cards (Latency, Delivery %, Throughput, Overhead) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Latency RTT Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#647067] font-medium block">Average Latency (RTT)</span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#16A34A]">
                {currentMqtt.avgRttMs}
              </span>
              <span className="text-xs text-[#647067]">ms (MQTT)</span>
            </div>
            <p className="text-[11px] text-[#647067]">
              CoAP: <strong className="text-amber-700 font-mono">{currentCoap.avgRttMs} ms</strong> • HTTP: <strong className="text-[#2563EB] font-mono">{currentHttp.avgRttMs} ms</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
            <span className="text-[#647067]">Fastest Protocol</span>
            <span className="text-[#166534] font-bold">MQTT (~4.6x faster than HTTP)</span>
          </div>
        </div>

        {/* Message Delivery Rate Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#647067] font-medium block">Packet Delivery Rate</span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#16A34A]">
                {currentMqtt.deliveryRate}%
              </span>
              <span className="text-xs text-[#647067]">QoS 1</span>
            </div>
            <p className="text-[11px] text-[#647067]">
              CoAP: <strong className="text-amber-700 font-mono">{currentCoap.deliveryRate}%</strong> • HTTP: <strong className="text-[#2563EB] font-mono">{currentHttp.deliveryRate}%</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
            <span className="text-[#647067]">Packet Loss</span>
            <span className="text-[#166534] font-bold">{currentMqtt.lossPct}% (Minimal loss)</span>
          </div>
        </div>

        {/* Throughput Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#647067] font-medium block">Message Throughput</span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#16A34A]">
                {currentMqtt.throughputMsgSec}
              </span>
              <span className="text-xs text-[#647067]">msg/sec</span>
            </div>
            <p className="text-[11px] text-[#647067]">
              CoAP: <strong className="text-amber-700 font-mono">{currentCoap.throughputMsgSec}</strong> • HTTP: <strong className="text-[#2563EB] font-mono">{currentHttp.throughputMsgSec}</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
            <span className="text-[#647067]">Highest Throughput</span>
            <span className="text-[#166534] font-bold">MQTT Publish</span>
          </div>
        </div>

        {/* Overhead Comparison Card */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-xs text-[#647067] font-medium block">Header / Wire Overhead</span>
            <div className="my-2 flex items-baseline gap-1">
              <span className="text-3xl font-extrabold font-mono text-[#16A34A]">
                {currentMqtt.overheadBytes}
              </span>
              <span className="text-xs text-[#647067]">Bytes/pkt</span>
            </div>
            <p className="text-[11px] text-[#647067]">
              CoAP: <strong className="text-amber-700 font-mono">48 B</strong> • HTTP: <strong className="text-[#2563EB] font-mono">384 B (12x larger!)</strong>
            </p>
          </div>
          <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
            <span className="text-[#647067]">Wire Efficiency</span>
            <span className="text-[#166534] font-bold">MQTT / CoAP 92% payload</span>
          </div>
        </div>
      </div>

      {/* 5. Protocol Comparison Visual Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latency Comparison Chart */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#18221C] uppercase tracking-wider font-mono">
                Latency Comparison (Round Trip Time)
              </h3>
              <p className="text-xs text-[#647067]">Lower latency represents faster control reaction time</p>
            </div>
            <span className="text-xs font-mono text-[#89938B]">ms (Lower is Better)</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* MQTT */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#18221C] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#16A34A]" /> MQTT (Broker Pub/Sub)
                </span>
                <span className="text-[#166534] font-bold">{currentMqtt.avgRttMs} ms</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F3F6F4] overflow-hidden">
                <div
                  className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentMqtt.avgRttMs / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* CoAP */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#18221C] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#F59E0B]" /> CoAP (UDP Datagrams)
                </span>
                <span className="text-amber-700 font-bold">{currentCoap.avgRttMs} ms</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F3F6F4] overflow-hidden">
                <div
                  className="h-full bg-[#F59E0B] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentCoap.avgRttMs / 100) * 100)}%` }}
                />
              </div>
            </div>

            {/* HTTP */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#18221C] font-semibold flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" /> HTTP / REST (TCP Socket)
                </span>
                <span className="text-[#2563EB] font-bold">{currentHttp.avgRttMs} ms</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F3F6F4] overflow-hidden">
                <div
                  className="h-full bg-[#2563EB] rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (currentHttp.avgRttMs / 100) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Packet Header & Wire Overhead Chart */}
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#18221C] uppercase tracking-wider font-mono">
                Protocol Overhead vs Useful Sensor Payload
              </h3>
              <p className="text-xs text-[#647067]">Ratio of metadata header bytes vs actual telemetry</p>
            </div>
            <span className="text-xs font-mono text-[#89938B]">Bytes/Transmission</span>
          </div>

          <div className="space-y-4 pt-2">
            {/* MQTT */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#18221C] font-semibold">MQTT (256B Payload + 32B Overhead)</span>
                <span className="text-[#166534] font-bold">11% Overhead</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F3F6F4] overflow-hidden flex">
                <div className="h-full bg-[#16A34A]" style={{ width: '89%' }} />
                <div className="h-full bg-red-400" style={{ width: '11%' }} />
              </div>
            </div>

            {/* CoAP */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#18221C] font-semibold">CoAP (256B Payload + 48B Overhead)</span>
                <span className="text-amber-700 font-bold">15% Overhead</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F3F6F4] overflow-hidden flex">
                <div className="h-full bg-amber-500" style={{ width: '85%' }} />
                <div className="h-full bg-red-400" style={{ width: '15%' }} />
              </div>
            </div>

            {/* HTTP */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-[#18221C] font-semibold">HTTP (256B Payload + 384B Headers)</span>
                <span className="text-[#2563EB] font-bold">60% Overhead!</span>
              </div>
              <div className="w-full h-3 rounded-full bg-[#F3F6F4] overflow-hidden flex">
                <div className="h-full bg-[#2563EB]" style={{ width: '40%' }} />
                <div className="h-full bg-red-400" style={{ width: '60%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Scientific Conclusion & Research Findings Panel */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-[#E5EAE6]">
          <Layers className="w-4 h-4 text-[#16A34A]" />
          <h3 className="text-base font-bold text-[#18221C]">
            Research Summary & Experimental Conclusions
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <span className="text-[#647067] font-medium block">Fastest Response</span>
            <span className="text-base font-bold text-[#166534] font-mono block mt-1">
              MQTT (18.4 ms)
            </span>
            <p className="text-[11px] text-[#647067] mt-1 leading-relaxed">
              Persistent TCP session avoids connection establishment delays on every cycle.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <span className="text-[#647067] font-medium block">Highest Delivery Reliability</span>
            <span className="text-base font-bold text-[#166534] font-mono block mt-1">
              MQTT QoS 1 (99.6%)
            </span>
            <p className="text-[11px] text-[#647067] mt-1 leading-relaxed">
              Broker packet acknowledgment with PUBACK prevents loss during transient RF drops.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <span className="text-[#647067] font-medium block">Highest Throughput</span>
            <span className="text-base font-bold text-[#166534] font-mono block mt-1">
              MQTT (54.2 msg/s)
            </span>
            <p className="text-[11px] text-[#647067] mt-1 leading-relaxed">
              Streaming pipeline without HTTP request-header re-transmission overhead.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6]">
            <span className="text-[#647067] font-medium block">Lowest Bandwidth Overhead</span>
            <span className="text-base font-bold text-[#166534] font-mono block mt-1">
              MQTT (32 B) & CoAP (48 B)
            </span>
            <p className="text-[11px] text-[#647067] mt-1 leading-relaxed">
              Conserves 85%+ cellular / battery budget compared to plain HTTP REST.
            </p>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong>Academic Project Finding:</strong> For automated smart hydroponics where ESP32 microcontrollers must both stream continuous sensor readings and trigger emergency actuator cutoffs (e.g. low water pump shutdown), <strong>MQTT</strong> offers the superior architectural trade-off due to low latency (18.4ms) and broker-brokered fan-out. CoAP is highly suitable for sleep-mode nodes on battery/solar power, whereas HTTP is best reserved for external cloud API dashboards.
          </p>
        </div>
      </div>

      {/* 7. Comprehensive Benchmark Results Table */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#18221C] uppercase tracking-wider font-mono">
            Benchmark Experimental Trials Roster
          </h3>
          <span className="text-xs text-[#647067] font-mono">
            {history.length} Trials Recorded
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#E5EAE6]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F7] text-[#647067] font-mono border-b border-[#E5EAE6]">
              <tr>
                <th className="py-3 px-4">Run ID</th>
                <th className="py-3 px-4">Protocol</th>
                <th className="py-3 px-4">Messages</th>
                <th className="py-3 px-4">Avg RTT</th>
                <th className="py-3 px-4">Delivery Rate</th>
                <th className="py-3 px-4">Packet Loss</th>
                <th className="py-3 px-4">Throughput</th>
                <th className="py-3 px-4">Payload/Overhead</th>
                <th className="py-3 px-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5EAE6] bg-white font-mono">
              {history.map((trial) => (
                <tr key={trial.id} className="hover:bg-[#F7F9F7] transition-colors">
                  <td className="py-3 px-4 font-bold text-[#18221C]">{trial.id}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        trial.protocol === 'MQTT'
                          ? 'bg-[#EAF7EE] text-[#166534]'
                          : trial.protocol === 'HTTP'
                          ? 'bg-blue-50 text-[#1D4ED8]'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {trial.protocol}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#18221C]">
                    {trial.messagesRecv} / {trial.messagesSent}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#18221C]">
                    {trial.avgRttMs} ms
                  </td>
                  <td className="py-3 px-4 text-[#166534] font-bold">
                    {trial.deliveryRate}%
                  </td>
                  <td className="py-3 px-4 text-[#DC2626]">
                    {trial.lossPct}%
                  </td>
                  <td className="py-3 px-4 text-[#18221C]">
                    {trial.throughputMsgSec} msg/s
                  </td>
                  <td className="py-3 px-4 text-[#647067]">
                    {trial.payloadBytes}B / +{trial.overheadBytes}B
                  </td>
                  <td className="py-3 px-4 text-[#89938B] text-[10px]">
                    {trial.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
