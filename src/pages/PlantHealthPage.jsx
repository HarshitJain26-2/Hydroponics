import React, { useState } from 'react';
import {
  Droplets,
  Sprout,
  Sun,
  Thermometer,
  Info,
  FlaskConical,
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
  const T = airTempSensor.value;
  const RH = humSensor.value;
  const svp = 0.61078 * Math.exp((17.27 * T) / (T + 237.3));
  const vpd = svp * (1 - RH / 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header with Profile Selector */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="text-xs font-mono text-[#166534] bg-[#EAF7EE] px-2.5 py-0.5 rounded-full border border-[#16A34A]/20 font-semibold">
              Crop Telemetry
            </span>
            <SimulatedBadge label="Experimental Suitability Model" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight">
            Plant & Water Health
          </h2>
          <p className="text-xs sm:text-sm text-[#647067] mt-1 max-w-xl">
            Understand the biochemical and physical conditions affecting crop transpiration, nutrient absorption, and root-zone oxygenation.
          </p>
        </div>

        {/* Crop Profile Switcher */}
        <div className="flex items-center gap-3 bg-[#F7F9F7] p-2.5 rounded-xl border border-[#E5EAE6]">
          <div className="w-8 h-8 rounded-lg bg-[#EAF7EE] border border-[#16A34A]/20 flex items-center justify-center">
            <Sprout className="w-4 h-4 text-[#16A34A]" />
          </div>
          <div>
            <label className="text-[10px] text-[#647067] block uppercase tracking-wider font-mono font-medium">
              Active Crop Recipe
            </label>
            <select
              value={selectedPlantId}
              onChange={(e) => {
                setSelectedPlantId(e.target.value);
                if (setCurrentPlantId) setCurrentPlantId(e.target.value);
              }}
              className="bg-transparent text-sm font-bold text-[#18221C] focus:outline-none cursor-pointer pr-4"
            >
              {PLANT_PROFILES.map((p) => (
                <option key={p.id} value={p.id} className="bg-white text-[#18221C]">
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
        <div className="p-5 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="relative h-44 rounded-xl overflow-hidden mb-4 border border-[#E5EAE6]">
              <img
                src={plant.image}
                alt={plant.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded-full bg-white/90 text-[#166534] font-bold backdrop-blur-xs">
                    {plant.type}
                  </span>
                  <h3 className="text-base font-bold text-white mt-1 drop-shadow-sm">
                    {plant.name.split('(')[0]}
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold px-2 py-1 rounded-lg bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/30 backdrop-blur-xs">
                  {plant.stage.split('(')[0]}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#647067] leading-relaxed mb-4">
              {plant.notes}
            </p>

            <div className="space-y-2 text-xs border-t border-[#E5EAE6] pt-3">
              <div className="flex justify-between py-0.5">
                <span className="text-[#647067]">Growth Stage</span>
                <span className="font-mono text-[#18221C] font-semibold">{plant.stage}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#647067]">Target Solution pH</span>
                <span className="font-mono text-[#166534] font-bold">{plant.targetPh}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#647067]">Target EC / TDS</span>
                <span className="font-mono text-[#166534] font-bold">{plant.targetTds}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-[#647067]">Daily Photoperiod</span>
                <span className="font-mono text-[#18221C] font-semibold">{plant.photoperiod}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-center justify-between text-xs text-[#647067]">
            <span>Method: NFT Recirculating</span>
            <span className="text-[#166534] font-mono font-semibold">Active</span>
          </div>
        </div>

        {/* Environmental Suitability Score Panel (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5EAE6]">
              <div>
                <h3 className="text-base font-bold text-[#18221C] flex items-center gap-2">
                  <span>Simulated Environmental Suitability Index</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#EAF7EE] text-[#166534] font-mono font-bold border border-[#16A34A]/20">
                    {plant.suitabilityScore}% Match
                  </span>
                </h3>
                <p className="text-xs text-[#647067] mt-0.5">
                  Multi-variable weighted composite score comparing live ESP32 sensors against the selected crop recipe.
                </p>
              </div>
            </div>

            {/* Suitability Bars Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
              {/* Temperature Suitability */}
              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#647067] flex items-center gap-1.5 font-medium">
                    <Thermometer className="w-3.5 h-3.5 text-[#16A34A]" /> Temperature Suitability
                  </span>
                  <span className="font-mono font-bold text-[#166534]">94%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '94%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>Current: {airTempSensor.value}°C</span>
                  <span>Target: {plant.targetAirTemp}</span>
                </div>
              </div>

              {/* Humidity & Transpiration Suitability */}
              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#647067] flex items-center gap-1.5 font-medium">
                    <Droplets className="w-3.5 h-3.5 text-[#2563EB]" /> Humidity & Stomatal Conductance
                  </span>
                  <span className="font-mono font-bold text-[#2563EB]">89%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-full" style={{ width: '89%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>Current: {humSensor.value}% RH</span>
                  <span>Target: {plant.targetHumidity}</span>
                </div>
              </div>

              {/* Water Quality & Osmotic Suitability */}
              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#647067] flex items-center gap-1.5 font-medium">
                    <FlaskConical className="w-3.5 h-3.5 text-[#16A34A]" /> Nutrient & Osmotic Potential
                  </span>
                  <span className="font-mono font-bold text-[#166534]">91%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-full" style={{ width: '91%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>pH {phSensor.value} • {tdsSensor.value} ppm</span>
                  <span>Optimal Absorption</span>
                </div>
              </div>

              {/* Light Intensity & Photobiology */}
              <div className="p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#647067] flex items-center gap-1.5 font-medium">
                    <Sun className="w-3.5 h-3.5 text-amber-500" /> Photoperiod & PAR Light
                  </span>
                  <span className="font-mono font-bold text-amber-600">82%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '82%' }} />
                </div>
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>Ambient Light: {lightSensor.value}%</span>
                  <span>Daily DLI: ~14.2 mol/m²</span>
                </div>
              </div>
            </div>

            {/* VPD Indicator */}
            <div className="mt-4 p-3.5 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="font-semibold text-[#18221C]">Vapor Pressure Deficit (VPD):</span>
                <span className="ml-2 font-mono font-bold text-[#166534]">
                  {vpd.toFixed(2)} kPa
                </span>
                <span className="text-[#647067] ml-2">(Target: 0.8 - 1.2 kPa for vegetative phase)</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7EE] text-[#166534] font-mono font-bold self-start sm:self-auto border border-[#16A34A]/20">
                Optimal Transpiration
              </span>
            </div>
          </div>

          {/* Academic Transparency Alert */}
          <div className="mt-4 pt-3 border-t border-[#E5EAE6] flex items-start gap-2 text-xs text-amber-900 bg-amber-50 p-3 rounded-xl border border-amber-200">
            <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Academic Note:</strong> Suitability scores are experimental algorithmic estimates derived from empirical agronomic models. They do not replace manual laboratory titrations or visual physiological crop inspection.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Water Quality Section with Visual Gauges & Range Bars */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E5EAE6] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E5EAE6]">
          <div>
            <h3 className="text-base font-bold text-[#18221C] flex items-center gap-2">
              <Droplets className="w-4 h-4 text-[#16A34A]" />
              <span>Water Quality & Reservoir Hydrochemistry</span>
            </h3>
            <p className="text-xs text-[#647067]">
              Continuous physical and chemical telemetry from immersion probes in the nutrient tank.
            </p>
          </div>
          <span className="text-xs text-[#647067] font-mono font-medium">
            Circulation: Active NFT Flow
          </span>
        </div>

        {/* 5 Rich Metric Range Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* pH Metric */}
          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#647067] font-medium">Acidity / pH</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#18221C]">
                  {phSensor.value}
                </span>
                <span className="text-xs text-[#647067]">pH</span>
              </div>
              {/* Range bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>5.0</span>
                  <span className="text-[#166534] font-semibold">Target {plant.targetPh}</span>
                  <span>7.0</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden relative">
                  <div
                    className="h-full bg-[#16A34A] rounded-full"
                    style={{ width: `${((phSensor.value - 5.0) / 2.0) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
              <span className="text-[#647067]">Deviation</span>
              <span className="text-[#166534] font-semibold">+0.1 pH (Normal)</span>
            </div>
          </div>

          {/* TDS Metric */}
          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#647067] font-medium">Nutrient TDS</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#18221C]">
                  {tdsSensor.value}
                </span>
                <span className="text-xs text-[#647067]">ppm</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>500</span>
                  <span className="text-[#166534] font-semibold">Target {plant.targetTds}</span>
                  <span>1200</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden relative">
                  <div
                    className="h-full bg-[#16A34A] rounded-full"
                    style={{ width: `${((tdsSensor.value - 500) / 700) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
              <span className="text-[#647067]">Conductivity</span>
              <span className="text-[#166534] font-semibold">1.7 mS/cm EC</span>
            </div>
          </div>

          {/* Water Temperature Metric */}
          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#647067] font-medium">Water Temp</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#18221C]">
                  {waterTempSensor.value}
                </span>
                <span className="text-xs text-[#647067]">°C</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>16°C</span>
                  <span className="text-[#166534] font-semibold">Target {plant.targetWaterTemp}</span>
                  <span>28°C</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden relative">
                  <div
                    className="h-full bg-[#16A34A] rounded-full"
                    style={{ width: `${((waterTempSensor.value - 16) / 12) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
              <span className="text-[#647067]">Dissolved O₂</span>
              <span className="text-[#166534] font-semibold">7.8 mg/L (High)</span>
            </div>
          </div>

          {/* Turbidity Metric */}
          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#647067] font-medium">Turbidity</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#18221C]">
                  {turbiditySensor.value}
                </span>
                <span className="text-xs text-[#647067]">NTU</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>0 Clear</span>
                  <span className="text-amber-700 font-semibold">&lt; 500 Max</span>
                  <span>1000 Turbid</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden relative">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(turbiditySensor.value / 1000) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
              <span className="text-[#647067]">Bio-Filtration</span>
              <span className="text-amber-700 font-semibold">Monitoring Required</span>
            </div>
          </div>

          {/* Water Level & Volume */}
          <div className="p-4 rounded-xl bg-[#F7F9F7] border border-[#E5EAE6] flex flex-col justify-between">
            <div>
              <span className="text-xs text-[#647067] font-medium">Reservoir Level</span>
              <div className="my-2 flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono text-[#18221C]">
                  {waterLevelSensor.value}
                </span>
                <span className="text-xs text-[#647067]">cm clearance</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#89938B] font-mono">
                  <span>Full (20cm)</span>
                  <span className="text-[#166534] font-semibold">74% Volume</span>
                  <span>Empty (95cm)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#E5EAE6] overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-[#16A34A] rounded-full"
                    style={{ width: '74%' }}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3 pt-2 border-t border-[#E5EAE6] flex justify-between text-[10px] font-mono">
              <span className="text-[#647067]">Estimated Vol</span>
              <span className="text-[#18221C] font-semibold">48.2 Liters</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
