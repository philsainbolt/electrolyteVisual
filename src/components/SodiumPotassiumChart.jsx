import React, { useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import SodiumPotassiumTooltip from './SodiumPotassiumTooltip';

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
  const { cx, cy, payload, onHover, onLeave } = props;

  const size = payload.isRelyte ? 60 : 48;
  const logoSize = payload.isRelyte ? 52 : 42;

  const color = getProductColor(payload.type, payload.isRelyte);

  const [imageError, setImageError] = React.useState(false);

  // Don't show logo for generic placeholder
  const shouldShowLogo = payload.logoPath && !payload.logoPath.includes('generic.svg') && !imageError;

  return (
    <g
      onMouseEnter={() => onHover && onHover(payload)}
      onMouseLeave={() => onLeave && onLeave()}
    >
      {/* Subtle outer ring for all products (depth effect) */}
      <circle
        cx={cx}
        cy={cy}
        r={size / 2 + 4}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        opacity="0.25"
      />

      {/* Glow effect for Re-Lyte products */}
      {payload.isRelyte && (
        <>
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 12}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="4"
            opacity="0.4"
          />
          <circle
            cx={cx}
            cy={cy}
            r={size / 2 + 6}
            fill="none"
            stroke="#3B82F6"
            strokeWidth="3.5"
            opacity="0.6"
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
        strokeWidth="4"
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
          y={cy + logoSize / 2 + 20}
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

const SodiumPotassiumChart = ({ data }) => {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading data...</p>
      </div>
    );
  }

  // Group Re-Lyte and non-Re-Lyte for rendering order
  const relyteData = data.filter(d => d.isRelyte);
  const otherData = data.filter(d => !d.isRelyte);

  const handleHover = (payload) => {
    setHoveredProduct(payload);
  };

  const handleLeave = () => {
    setHoveredProduct(null);
  };

  // Calculate averages for reference lines
  const avgSodium = data.reduce((sum, d) => sum + d.sodium, 0) / data.length;
  const avgPotassium = data.reduce((sum, d) => sum + d.potassium, 0) / data.length;

  return (
    <div className="w-full h-[800px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{ top: 20, right: 100, bottom: 80, left: 120 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            type="number"
            dataKey="sodium"
            name="Sodium"
            unit=" mg"
            label={{
              value: 'Sodium per 16oz Serving (mg)',
              position: 'bottom',
              offset: 50,
              style: { fontSize: 17, fontWeight: 700, fill: '#1F2937' }
            }}
            domain={[0, 'auto']}
            tick={{ fontSize: 13 }}
          />

          <YAxis
            type="number"
            dataKey="potassium"
            name="Potassium"
            unit=" mg"
            label={{
              value: 'Potassium per 16oz Serving (mg)',
              angle: -90,
              position: 'left',
              offset: 15,
              style: { fontSize: 17, fontWeight: 700, fill: '#1F2937', textAnchor: 'middle' }
            }}
            domain={[0, 'auto']}
            tick={{ fontSize: 13 }}
          />

          <Tooltip content={<SodiumPotassiumTooltip />} cursor={{ strokeDasharray: '3 3' }} />

          {/* Reference lines for averages */}
          <ReferenceLine
            x={avgSodium}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            label={{ value: 'Avg Na', position: 'top', fill: '#6B7280', fontSize: 11 }}
          />
          <ReferenceLine
            y={avgPotassium}
            stroke="#9CA3AF"
            strokeDasharray="5 5"
            label={{ value: 'Avg K', position: 'right', fill: '#6B7280', fontSize: 11 }}
          />

          {/* Other brands scatter */}
          <Scatter
            name="Other Brands"
            data={otherData}
            fill="#6B7280"
            shape={(props) => (
              <CustomShape
                {...props}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            )}
          />

          {/* Re-Lyte products scatter (rendered on top) */}
          <Scatter
            name="Re-Lyte ★"
            data={relyteData}
            fill="#1E3A8A"
            shape={(props) => (
              <CustomShape
                {...props}
                onHover={handleHover}
                onLeave={handleLeave}
              />
            )}
          />

          {/* Overlay scatter for hovered product - renders on top */}
          {hoveredProduct && (
            <Scatter
              data={[hoveredProduct]}
              fill={getProductColor(hoveredProduct.type, hoveredProduct.isRelyte)}
              shape={(props) => (
                <CustomShape
                  {...props}
                  onHover={handleHover}
                  onLeave={handleLeave}
                />
              )}
            />
          )}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SodiumPotassiumChart;
