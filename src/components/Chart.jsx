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
  const size = payload.isRelyte ? 60 : 48;
  const color = getProductColor(payload.type, payload.isRelyte);
  const logoSize = payload.isRelyte ? 52 : 42;
  const [imageError, setImageError] = React.useState(false);

  // Don't show logo for generic placeholder
  const shouldShowLogo = payload.logoPath && !payload.logoPath.includes('generic.svg') && !imageError;

  return (
    <g>
      {/* Glow effect for Re-Lyte products */}
      {payload.isRelyte && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 12}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3"
            opacity="0.3"
          />
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 6}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2.5"
            opacity="0.5"
          />
        </>
      )}

      {/* Background circle */}
      <circle
        cx={cx}
        cy={cy}
        r={size / 2}
        fill="white"
        stroke={payload.isRelyte ? '#1E3A8A' : color}
        strokeWidth="3.5"
        opacity={1}
        style={{ cursor: 'pointer' }}
      />

      {/* Logo image */}
      {shouldShowLogo ? (
        <image
          href={payload.logoPath}
          x={cx - logoSize / 2}
          y={cy - logoSize / 2}
          width={logoSize}
          height={logoSize}
          style={{ cursor: 'pointer' }}
          clipPath={`circle(${logoSize / 2.2}px at ${logoSize / 2}px ${logoSize / 2}px)`}
          onError={() => setImageError(true)}
        />
      ) : (
        /* Colored circle when no logo or logo fails */
        <circle
          cx={cx}
          cy={cy}
          r={(size / 2) - 4}
          fill={color}
          opacity={0.85}
        />
      )}

      {/* Star indicator for Re-Lyte */}
      {payload.isRelyte && (
        <text
          x={cx}
          y={cy + logoSize / 2 + 16}
          textAnchor="middle"
          fill="#1E3A8A"
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
    <div className="w-full h-[1000px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 100, bottom: 80, left: 120 }}
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
              offset: 50,
              style: { fontSize: 17, fontWeight: 700, fill: '#1F2937' }
            }}
            domain={[0, 'auto']}
            tick={{ fontSize: 13 }}
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
              offset: 15,
              style: { fontSize: 17, fontWeight: 700, fill: '#1F2937', textAnchor: 'middle' }
            }}
            domain={[0, 'auto']}
            tick={{ fontSize: 13 }}
          />

          <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          {/* Legend removed - using custom legend in UI instead */}

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
