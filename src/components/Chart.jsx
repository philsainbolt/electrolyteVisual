import React from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';
import CustomTooltip from './CustomTooltip';

// Color scheme by product type
const getProductColor = (type, isRelyte) => {
  if (isRelyte) return '#1E3A8A'; // Re-Lyte blue

  switch (type) {
    case 'Bulk Powder':
      return '#10B981'; // Green
    case 'RTD':
      return '#F59E0B'; // Amber
    case 'Stick Pack':
      return '#8B5CF6'; // Purple
    default:
      return '#6B7280'; // Gray
  }
};

const CustomShape = (props) => {
  const { cx, cy, payload } = props;
  const size = payload.isRelyte ? 40 : 32;
  const color = getProductColor(payload.type, payload.isRelyte);

  return (
    <g>
      {/* Glow effect for Re-Lyte products */}
      {payload.isRelyte && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 8}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            opacity="0.3"
          />
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 4}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            opacity="0.5"
          />
        </>
      )}

      {/* Main circle */}
      <circle
        cx={cx}
        cy={cy}
        r={size / 2}
        fill={color}
        stroke="white"
        strokeWidth="2.5"
        opacity={payload.isRelyte ? 1 : 0.85}
        style={{ cursor: 'pointer' }}
      />

      {/* Star indicator for Re-Lyte */}
      {payload.isRelyte && (
        <text
          x={cx}
          y={cy + 5}
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          ★
        </text>
      )}
    </g>
  );
};

const Chart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  // Group by type for better visualization
  const bulkPowder = data.filter(d => d.type === 'Bulk Powder' && !d.isRelyte);
  const rtd = data.filter(d => d.type === 'RTD' && !d.isRelyte);
  const stickPack = data.filter(d => d.type === 'Stick Pack' && !d.isRelyte);
  const relyteData = data.filter(d => d.isRelyte);

  return (
    <div className="w-full h-[600px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 80, bottom: 60, left: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            type="number"
            dataKey="pricePerThousand"
            name="Price per 1000mg"
            unit="$"
            label={{
              value: 'Price per 1000mg ($) → Lower is Better',
              position: 'bottom',
              offset: 40,
              style: { fontSize: 14, fontWeight: 600 }
            }}
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
          />

          <YAxis
            type="number"
            dataKey="totalElectrolytes"
            name="Total Electrolytes"
            unit=" mg"
            label={{
              value: 'Total Electrolytes per 16oz (mg) → Higher is Better',
              angle: -90,
              position: 'left',
              offset: 40,
              style: { fontSize: 14, fontWeight: 600 }
            }}
            domain={[0, 'auto']}
            tick={{ fontSize: 12 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          <Legend
            verticalAlign="top"
            height={50}
            wrapperStyle={{ fontSize: 13, fontWeight: 600, paddingBottom: 10 }}
          />

          {/* Reference line for average price */}
          <ReferenceLine
            x={data.reduce((sum, d) => sum + d.pricePerThousand, 0) / data.length}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            label={{ value: 'Average', position: 'top', fill: '#6B7280', fontSize: 11 }}
          />

          {/* Scatter plots by product type */}
          <Scatter
            name="Bulk Powder"
            data={bulkPowder}
            fill="#10B981"
            shape={<CustomShape />}
          />

          <Scatter
            name="RTD (Ready-to-Drink)"
            data={rtd}
            fill="#F59E0B"
            shape={<CustomShape />}
          />

          <Scatter
            name="Stick Pack"
            data={stickPack}
            fill="#8B5CF6"
            shape={<CustomShape />}
          />

          {/* Re-Lyte products scatter (rendered on top) */}
          <Scatter
            name="Re-Lyte ★"
            data={relyteData}
            fill="#1E3A8A"
            shape={<CustomShape />}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;
