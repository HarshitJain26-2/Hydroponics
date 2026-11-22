import React from 'react';
import {
  Thermometer,
  Droplets,
  Waves,
  FlaskConical,
  Activity,
  Sparkles,
  Sun,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getSvgPath, getSvgAreaPath } from '../utils/helpers';

const ICON_MAP = {
  Thermometer,
  Droplets,
  ThermometerSnowflake: Thermometer,
  Waves,
  FlaskConical,
  Activity,
  Sparkles,
  Sun,
};

export default function MetricCard({
  sensor,
  onClick,
}) {
  const Icon = ICON_MAP[sensor.icon] || Activity;
  const history = sensor.history || [sensor.value * 0.95, sensor.value * 0.98, sensor.value];
  
  // Status badge styling
  let statusBadge = (
    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#EAF7EE] text-[#166534] border border-[#16A34A]/20">
      Normal
    </span>
  );

  if (sensor.status === 'Monitoring') {
    statusBadge = (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
        Monitoring
      </span>
    );
  } else if (sensor.status === 'Warning') {
    statusBadge = (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
        Warning
      </span>
    );
  } else if (sensor.status === 'Critical') {
    statusBadge = (
      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
        Critical
      </span>
    );
  }

  // Calculate delta from history
  const firstVal = history[0];
  const lastVal = history[history.length - 1];
  const diff = lastVal - firstVal;
  const isUp = diff >= 0;

  return (
    <div
      onClick={onClick}
      className="group relative p-4 rounded-2xl bg-white border border-[#E5EAE6] hover:border-[#16A34A]/40 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[175px]"
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF7EE] border border-[#E5EAE6] flex items-center justify-center text-[#16A34A] group-hover:bg-[#16A34A] group-hover:text-white transition-colors">
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-[#647067] group-hover:text-[#18221C] transition-colors truncate max-w-[120px] sm:max-w-[150px]">
              {sensor.name}
            </h3>
            <span className="text-[10px] text-[#89938B] font-mono">
              {sensor.sensorId}
            </span>
          </div>
        </div>
        {statusBadge}
      </div>

      {/* Main Metric Value */}
      <div className="my-2">
        <div className="flex items-baseline gap-1.5">
          <span className="text-2xl sm:text-3xl font-extrabold text-[#18221C] tracking-tight font-mono">
            {typeof sensor.value === 'number' && sensor.id === 'ph_level'
              ? sensor.value.toFixed(1)
              : typeof sensor.value === 'number' && sensor.id === 'air_temp'
              ? sensor.value.toFixed(1)
              : typeof sensor.value === 'number' && sensor.id === 'water_temp'
              ? sensor.value.toFixed(1)
              : sensor.value}
          </span>
          <span className="text-xs font-medium text-[#647067]">{sensor.unit}</span>
        </div>

        {/* Special visual indicators per card type */}
        {sensor.id === 'water_level' && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px] text-[#647067]">
              <span>Reservoir: ~74% Full</span>
              <span>100cm Tank</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F3F6F4] overflow-hidden border border-[#E5EAE6]">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-[#16A34A] rounded-full transition-all duration-500"
                style={{ width: `${sensor.percent || 74}%` }}
              />
            </div>
          </div>
        )}

        {sensor.id === 'ph_level' && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px] text-[#647067]">
              <span>Optimal: 5.5 - 6.5</span>
              <span>Near Neutral</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F3F6F4] overflow-hidden border border-[#E5EAE6] relative">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                style={{ width: `${((sensor.value - 4) / 6) * 100}%` }}
              />
            </div>
          </div>
        )}

        {sensor.id === 'tds' && (
          <div className="mt-2 space-y-1">
            <div className="flex justify-between text-[10px] text-[#647067]">
              <span>Nutrient: Moderate</span>
              <span>Target: 700-1000</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#F3F6F4] overflow-hidden border border-[#E5EAE6]">
              <div
                className="h-full bg-[#16A34A] rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (sensor.value / 1200) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sparkline / Trend & Comparison */}
      <div className="pt-2 border-t border-[#E5EAE6] flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-mono">
          {isUp ? (
            <span className="text-[#16A34A] flex items-center font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              +{Math.abs(diff).toFixed(1)}
            </span>
          ) : (
            <span className="text-[#2563EB] flex items-center font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              -{Math.abs(diff).toFixed(1)}
            </span>
          )}
          <span className="text-[10px] text-[#89938B]">vs 1h ago</span>
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-20 h-6 shrink-0">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 100 24">
            <defs>
              <linearGradient id={`grad-${sensor.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16A34A" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#16A34A" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            <path
              d={getSvgAreaPath(history, 100, 24, 2)}
              fill={`url(#grad-${sensor.id})`}
            />
            <path
              d={getSvgPath(history, 100, 24, 2)}
              fill="none"
              stroke="#16A34A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
