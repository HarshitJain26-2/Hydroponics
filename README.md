# HYDROSMART — Smart Hydroponics IoT Dashboard

A modern, responsive, light-mode web dashboard for **HYDROSMART**, an IoT-powered smart hydroponics monitoring, automation, and communication protocol analysis system built with **ESP32, MQTT/HTTP/CoAP, and automated actuators**.

---

## 🌿 Theme Direction: Clean White + Fresh Green

- **Design Aesthetic**:
  - Light, clean, premium white dashboard inspired by modern SaaS analytics platforms, precision agriculture, and professional IoT monitoring software.
  - Dominant colors: Soft off-white app background (`#F7F9F7`), pure white cards (`#FFFFFF`), subtle light-gray borders (`#E5EAE6`).
  - Restrained brand green: Primary green (`#16A34A`), deep green (`#166534`), and soft green accent pill backgrounds (`#EAF7EE`).
  - Dark charcoal text (`#18221C`) and neutral grays (`#647067`, `#89938B`) for maximum readability.
  - Professional vector SVG time-series charts with minimal gridlines, multi-series color balance (Green, Blue `#2563EB`, Amber `#F59E0B`).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or pnpm

### Running Development Server
```bash
cd Hydroponics
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Building for Production
```bash
npm run build
npm run preview
```

---

## 📑 9 Dedicated Dashboard Pages

1. **Overview Dashboard (`OverviewPage.jsx`)**
   - Welcome banner with live operational status, auto/manual mode switcher, and date display.
   - **8 Core Sensor Metric Cards**: Air Temp (27.4°C), Air Humidity (64%), Water Temp (23.8°C), Water Level (80cm clearance with 74% tank visualization), pH Level (6.2 with buffer bar), TDS (850 ppm nutrient gauge), Turbidity (420 NTU monitoring badge), Light Intensity (68%).
   - **Environmental Trends Large Chart**: Synchronized multi-series graph (Air Temp, Humidity, Water Temp) with 1H, 6H, 24H, 7D time filters and hover tooltips.
   - **System Health Panel**: 86/100 environment health index gauge, 7/7 sensor connectivity, MQTT connected, ESP32 online.
   - **Connected Actuators Quick Status**: Water pump and grow light states, runtimes, and manual toggles.
   - **Recent Activity Feed**: Real-time event log with timestamps and status chips.

2. **Live Monitoring (`LiveMonitoringPage.jsx`)**
   - Streaming telemetry indicator with pulsing heartbeat.
   - Real-time pause/resume stream toggle.
   - Time horizon selector (`5m`, `15m`, `30m`, `1h`, `6h`).
   - One-click **CSV Data Export** of sensor readings.
   - 8 individual time-series charts with MIN, AVG, and MAX telemetry strips.
   - **Multi-Sensor Comparison Mode**: Overlay up to 4 sensors on a single normalized chart.
   - Filterable, sortable, and searchable transducer data roster.

3. **Plant & Water Health (`PlantHealthPage.jsx`)**
   - **Interactive Crop Profile Switcher**: Switch between Sweet Italian Basil, Butterhead Lettuce, Cherry Tomato, and Albion Strawberry.
   - Simulated Environmental Suitability Index breakdown: Temperature suitability (94%), Stomatal conductance (89%), Osmotic potential (91%), Photoperiod PAR (82%).
   - **Vapor Pressure Deficit (VPD)** real-time calculation (~1.27 kPa) for transpiration optimization.
   - **Water Quality & Reservoir Hydrochemistry Panel**: Visual range bars and deviation indicators for pH, TDS, water temp, turbidity, and tank clearance.

4. **Device Control (`DeviceControlPage.jsx`)**
   - Actuator management for Submersible Water Pump (GPIO 26 / Relay 1) and Full Spectrum Grow Light (GPIO 27 / Relay 2).
   - Prominent **AUTO vs MANUAL OVERRIDE** mode switch.
   - LED Spectrum PWM duty cycle modulation slider (10% - 100%).
   - Hardware safety interlocks: Low water cutoff (<85cm), relay anti-bounce delay (30s), thermal canopy overheat gate (34°C).
   - **Emergency Stop (E-Stop)** with confirmation modal to immediately trip all actuator relays.
   - Actuator event timeline.

5. **Automation Rules (`AutomationPage.jsx`)**
   - Rule Cards: Low Water Level Safety Interlock, Ambient Daylight Boost, Daylight Energy Conservation, Nutrient Solution Overheating Protection.
   - Dynamic **Rule Builder Modal**: Configure sensor inputs, conditions (`>`, `<`, `=`), thresholds, deterministic actions (Turn ON, Turn OFF, Alert Only), target devices, and priority levels.
   - Live enable/disable toggles and deletion options.
   - Rule execution history log.

6. **IoT Protocol Benchmark (`ProtocolBenchmarkPage.jsx`)**
   - Dedicated academic comparative research benchmark of **MQTT vs HTTP vs CoAP**.
   - Architectural comparison cards detailing transport protocols and packet headers.
   - **Benchmark Control Panel**: Configurable message counts (50 - 1000), payload sizes (64B - 1024B), packet intervals (50ms - 500ms), and test iterations (1 - 5).
   - Interactive live benchmark runner with animated progress and step updates.
   - Comparative analytics: Latency RTT comparison (MQTT 18.4ms vs HTTP 84.7ms vs CoAP 24.1ms), message delivery rates, packet loss, throughput (msgs/sec), and wire overhead breakdown (MQTT 32B vs HTTP 384B vs CoAP 48B).
   - Scientific Research Takeaway panel and historical trials roster with CSV export.

7. **Alerts & System Logs (`AlertsPage.jsx`)**
   - Active, Critical, Warning, and Resolved counters.
   - Filterable alerts table by severity and search query.
   - Operator actions: Acknowledge (Ack) and Mark Resolved.
   - Diagnostic detail inspection modal.
   - Chronological event timeline filterable by category (Sensor, Device, Network, Automation).

8. **Reports & Analytics (`ReportsPage.jsx`)**
   - Report formulation engine with configurable audit categories and date ranges.
   - Real **CSV and JSON data export** triggers.
   - Printable audit dossier preview modal with clean formatting for academic submission or project review.
   - Historical research dossiers archive.

9. **System Settings & Connectivity (`SettingsPage.jsx`)**
   - **ESP32 Tab**: Hostname, Chip ID, IP address, Wi-Fi SSID, RSSI signal, firmware build, and soft-reboot trigger.
   - **MQTT Tab**: Broker hostname, TCP port, ClientID, QoS levels (QoS 0, 1, 2), pub/sub topics, and live Ping connection test.
   - **Sensor Tab**: Sampling cadence, analog probe calibration offsets (pH, temperature, TDS factor, turbidity baseline).
   - **System Tab**: Background polling toggles, audio alarms, and data retention policies.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + Vite 6
- **Styling**: Tailwind CSS 3.4 (Custom Clean White & Fresh Green SaaS theme)
- **Icons**: Lucide React
- **Visualizations**: Responsive Vector SVG line charts, area fills, and range gauges
- **Telemetry Engine**: Integrated real-time client-side simulation engine with realistic sensor jitter and emergency safety trips
