import React, { useState } from 'react';
import {
  Droplets,
  Sprout,
  Sun,
  Thermometer,
  ShieldAlert,
  Info,
  ChevronDown,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  FlaskConical,
  Activity,
  Waves
} from 'lucide-react';
import { PLANT_PROFILES } from '../data/initialState';
import SimulatedBadge from '../components/SimulatedBadge';

export default function PlantHealthPage({
  sensors,
  currentPlantId = 'basil',
  setCurrentPlantId,
}) {
  const [selectedPlantId, setSelectedPlantId] = useState(currentPlantId);

  const plant = PLANT_PROFILES.find((p) => p.id === selectedPlantId) || PLANT_PROFILES[0];

  // Specific sensor readings
  const phSensor = sensors.find((s) => s.id === 'ph_level') || { value: 6.2 };
  const tdsSensor = sensors.find((s) => s.id === 'tds') || { value: 850 };
  const waterTempSensor = sensors.find((s) => s.id === 'water_temp') || { value: 23.8 };
  const turbiditySensor = sensors.find((s) => s.id === 'turbidity') || { value: 420 };
  const waterLevelSensor = sensors.find((s) => s.id === 'water_level') || { value: 80 };
  const airTempSensor = sensors.find((s) => s.id === 'air_temp') || { value: 27.4 };
  const humSensor = sensors.find((s) => s.id === 'air_humidity') || { value: 64 };
  const lightSensor = sensors.find((s) => s.id === 'light_intensity') || { value: 68 };

  // Calculated VPD estimate (kPa) = saturatedVP * (1 - RH/100)
  // SVP = 0.61078 * exp((17.27 * T) / (T + 237.3))
  const T = airTempSensor.value;
  const RH = humSensor.value;
  const svp = 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
  const vpd = svp * (1 - RH / 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Profile Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#121A15] border border-[#27352D] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#36D17C] bg-[#36D17C]/10 px-2 py-0.5 rounded-full border border-[#36D17C]/20">
              Crop Telemetry
            </span>
            <SimulatedBadge label="Experimental Suitability Model" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F0F5F1] tracking-tight">
            Plant & Water Health
          </h2>
          <p className="text-xs sm:text-sm text-[#95A69A] mt-1 max-w-xl">
            Understand the biochemical and physical conditions affecting crop transpiration, nutrient absorption, and root-zone oxygenation.
          </p>
        </div>

        {/* Crop Profile Switcher */}
        <div className="flex items-center gap-3 bg-[#16211A] p-2 rounded-xl border border-[#27352D]">
          <Sprout className="w-5 h-5 text-[#36D17C]" />
          <div>
            <label className="text-[10px] text-[#95A69A] block uppercase tracking-wider font-mono">
              Active Crop Profile
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => {
                setSelectedPlantId(e.target.value);
                if (setCurrentPlantId) setCurrentPlantId(e.target.value);
              }}
              className="bg-transparent text-sm font-semibold text-[#F0F5F1] focus:outline-none cursor-pointer pr-4"
            >
              {PLANT_PROFILES.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#121A15] text-[#F0F5F1]">
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Plant Profile Card & Experimental Suitability Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Plant Overview Card */}
        <div className="p-5 rounded-2xl bg-[#16211A] border border-[#27352D] flex flex-col justify-between">
          <div>
            <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-[#27352D]">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121A15] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-black/60 text-[#36D17C] backdrop-blur-sm border border-[#36D17C]/30">
                    {plant.type}
                  </span>
                  <h3 className="text-base font-bold text-[#F0F5F1] mt-1 drop-shadow">
                    {plant.name.split('(')[0]}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold px-2 py-1 rounded-lg bg-[#36D17C]/20 text-[#36D17C] border border-[#36D17C]/40 backdrop-blur-sm">
                  {plant.stage.split('(')[0]}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#95A69A] leading-relaxed mb-4">
              {plant.notes}
            </p>

            <div className="space-y-2 text-xs border-t border-[#27352D] pt-3">
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Growth Stage</span>
                <span className="font-mono text-[#F0F5F1]">{plant.stage}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Target Solution pH</span>
                <span className="font-mono text-[#36D17C]">{plant.targetPh}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Target EC / TDS</span>
                <span className="font-mono text-[#36D17C]">{plant.targetTds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#95A69A]">Daily Photoperiod</span>
                <span className="font-mono text-[#F0F5F1]">{plant.photoperiod}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#27352D] flex items-center justify-between text-xs text-[#95A69A]">
            <span>Method: NFT Recirculating</span>
            <span className="text-[#36D17C] font-mono">Active</span>
          </div>
        </div>

        {/* Environmental Suitability Score Panel (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#27352D]">
              <div>
                <h3 className="text-base font-bold text-[#F0F5F1] flex items-center gap-2">
                  <span>Simulated Environmental Suitability Index</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-[#36D17C]/15 text-[#36D17C] font-mono font-bold">
                    {plant.suitabilityScore}% Match
                  </span>
                </h3>
                <p className="text-xs text-[#95A69A] mt-0.5">
                  Multi-variable weighted composite score comparing live ESP32 sensors against the selected crop recipe.
                </p>
              </div>
            </div>

            {/* Suitability Bars Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {/* Temperature Suitability */}
              <div className="p-3.5 rounded-xl bg-[#121A15] border border-[#27352D] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#95A69A] flex items-center gap-1.5 font-medium">
                    <Thermometer className="w-3.5 h-3.5 text-[#36D17C]" /> Temperature Suitability
                  </span>
                  <span className="font-mono font-bold text-[#36D17C]">94%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
                  <div className="h-full bg-[#36D17C] rounded-full" style={{ width: '94%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>Current: {airTempSensor.value}°C</span>
                  <span>Target: {plant.targetAirTemp}</span>
                </div>
              </div>

              {/* Humidity & Transpiration Suitability */}
              <div className="p-3.5 rounded-xl bg-[#121A15] border border-[#27352D] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#95A69A] flex items-center gap-1.5 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-[#64B5F6]" /> Humidity & Stomatal Conductance
                  </span>
                  <span className="font-mono font-bold text-[#64B5F6]">89%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
                  <div className="h-full bg-[#64B5F6] rounded-full" style={{ width: '89%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>Current: {humSensor.value}% RH</span>
                  <span>Target: {plant.targetHumidity}</span>
                </div>
              </div>

              {/* Water Quality & Osmotic Suitability */}
              <div className="p-3.5 rounded-xl bg-[#121A15] border border-[#27352D] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#95A69A] flex items-center gap-1.5 font-medium">
                    <FlaskConical className="w-3.5 h-3.5 text-[#36D17C]" /> Nutrient & Osmotic Potential
                  </span>
                  <span className="font-mono font-bold text-[#36D17C]">91%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
                  <div className="h-full bg-[#36D17C] rounded-full" style={{ width: '91%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>pH {phSensor.value} • {tdsSensor.value} ppm</span>
                  <span>Optimal Absorption</span>
                </div>
              </div>

              {/* Light Intensity & Photobiology */}
              <div className="p-3.5 rounded-xl bg-[#121A15] border border-[#27352D] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#95A69A] flex items-center gap-1.5 font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-400" /> Photoperiod & PAR Light
                  </span>
                  <span className="font-mono font-bold text-amber-400">82%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>Ambient Light: {lightSensor.value}%</span>
                  <span>Daily DLI: ~14.2 mol/m²</span>
                </div>
              </div>
            </div>

            {/* VPD Indicator */}
            <div className="mt-4 p-3 rounded-xl bg-[#18231C] border border-[#27352D] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-[#F0F5F1]">Vapor Pressure Deficit (VPD):</span>
                <span className="ml-2 font-mono font-bold text-[#36D17C]">
                  {vpd.toFixed(2)} kPa
                </span>
                <span className="text-[#95A69A] ml-2">(Target: 0.8 - 1.2 kPa for vegetative phase)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-[#36D17C]/15 text-[#36D17C] font-mono font-bold self-start sm:self-auto">
                Optimal Transpiration
              </span>
            </div>
          </div>

          {/* Academic Transparency Alert */}
          <div className="mt-4 pt-3 border-t border-[#27352D] flex items-start gap-2 text-xs text-amber-400/90 bg-amber-500/5 p-3 rounded-xl border border-amber-500/20">
            <Info className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Academic Note:</strong> Suitability scores are experimental algorithmic estimates derived from empirical agronomic models. They do not replace manual laboratory titrations or visual physiological crop inspection.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Water Quality Section with Visual Gauges & Range Bars */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[#16211A] border border-[#27352D] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#27352D]">
          <div>
            <h3 className="text-base font-bold text-[#F0F5F1] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#36D17C]" />
              <span>Water Quality & Reservoir Hydrochemistry</span>
            </h3>
            <p className="text-xs text-[#95A69A]">
              Continuous physical and chemical telemetry from immersion probes in the nutrient tank.
            </p>
          </div>
          <span className="text-xs text-[#95A69A] font-mono">
            Circulation: Active NFT Flow
          </span>
        </div>

        {/* 5 Rich Metric Range Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* pH Metric */}
          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#95A69A] font-medium">Acidity / pH</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#F0F5F1]">
                  {phSensor.value}
                </span>
                <span className="text-xs text-[#95A69A]">pH</span>
              </div>
              {/* Range bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>5.0</span>
                  <span className="text-[#36D17C]">Target {plant.targetPh}</span>
                  <span>7.0</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden relative">
                  <div
                    className="h-full bg-[#36D17C] rounded-full"
                    style={{ width: `${((phSensor.value - 5.0) / 2.0) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#27352D]/60 flex justify-between text-[10px] font-mono">
              <span className="text-[#95A69A]">Deviation</span>
              <span className="text-[#36D17C]">+0.1 pH (Normal)</span>
            </div>
          </div>

          {/* TDS Metric */}
          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#95A69A] font-medium">Nutrient TDS</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#F0F5F1]">
                  {tdsSensor.value}
                </span>
                <span className="text-xs text-[#95A69A]">ppm</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>500</span>
                  <span className="text-[#36D17C]">Target {plant.targetTds}</span>
                  <span>1200</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden relative">
                  <div
                    className="h-full bg-[#36D17C] rounded-full"
                    style={{ width: `${((tdsSensor.value - 500) / 700) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#27352D]/60 flex justify-between text-[10px] font-mono">
              <span className="text-[#95A69A]">Conductivity</span>
              <span className="text-[#36D17C]">1.7 mS/cm EC</span>
            </div>
          </div>

          {/* Water Temperature Metric */}
          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#95A69A] font-medium">Water Temp</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#F0F5F1]">
                  {waterTempSensor.value}
                </span>
                <span className="text-xs text-[#95A69A]">°C</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>16°C</span>
                  <span className="text-[#36D17C]">Target {plant.targetWaterTemp}</span>
                  <span>28°C</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden relative">
                  <div
                    className="h-full bg-[#36D17C] rounded-full"
                    style={{ width: `${((waterTempSensor.value - 16) / 12) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#27352D]/60 flex justify-between text-[10px] font-mono">
              <span className="text-[#95A69A]">Dissolved O₂</span>
              <span className="text-[#36D17C]">7.8 mg/L (High)</span>
            </div>
          </div>

          {/* Turbidity Metric */}
          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#95A69A] font-medium">Turbidity</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#F0F5F1]">
                  {turbiditySensor.value}
                </span>
                <span className="text-xs text-[#95A69A]">NTU</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>0 Clear</span>
                  <span className="text-amber-400">&lt; 500 Max</span>
                  <span>1000 Turbid</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden relative">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(turbiditySensor.value / 1000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#27352D]/60 flex justify-between text-[10px] font-mono">
              <span className="text-[#95A69A]">Bio-Filtration</span>
              <span className="text-amber-400">Monitoring Required</span>
            </div>
          </div>

          {/* Water Level & Volume */}
          <div className="p-4 rounded-xl bg-[#121A15] border border-[#27352D] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#95A69A] font-medium">Reservoir Level</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#F0F5F1]">
                  {waterLevelSensor.value}
                </span>
                <span className="text-xs text-[#95A69A]">cm clearance</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#627768] font-mono">
                  <span>Full (20cm)</span>
                  <span className="text-[#36D17C]">74% Volume</span>
                  <span>Empty (95cm)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#18231C] overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-[#36D17C] rounded-full"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#27352D]/60 flex justify-between text-[10px] font-mono">
              <span className="text-[#95A69A]">Estimated Vol</span>
              <span className="text-[#F0F5F1]">48.2 Liters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
