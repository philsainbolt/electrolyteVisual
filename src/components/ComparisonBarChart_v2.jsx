import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

const ComparisonBarChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading comparison data...</p>
      </div>
    );
  }

  // Focus on major brands
  const majorBrands = ['relyte', 'gatorade', 'lmnt', 'liquid-iv', 'prime', 'pedialyte',
                       'bodyarmour', 'ultima', 'nuun', 'propel'];

  // Get cheapest product per brand
  const brandMap = new Map();
  data.forEach(product => {
    const slug = product.brandSlug;
    if (!majorBrands.includes(slug)) return;
    if (!product.pricePerThousand || product.pricePerThousand <= 0 || product.pricePerThousand > 10) return;

    // Special case: prefer Strawberry for Re-Lyte
    if (slug === 'relyte') {
      if (product.brand.includes('Strawberry')) {
        brandMap.set(slug, product);
      } else if (!brandMap.has(slug)) {
        brandMap.set(slug, product);
      }
    } else if (!brandMap.has(slug) || product.pricePerThousand < brandMap.get(slug).pricePerThousand) {
      brandMap.set(slug, product);
    }
  });

  // Sort by price and prepare chart data
  const sortedProducts = Array.from(brandMap.values())
    .sort((a, b) => b.pricePerThousand - a.pricePerThousand)
    .slice(0, 10);

  // Find Re-Lyte price for multiplier calculation
  const relytePrice = sortedProducts.find(p => p.isRelyte)?.pricePerThousand || sortedProducts[0]?.pricePerThousand;

  const chartData = sortedProducts.map(product => {
    // Simplify name
    let name = product.brand.replace(/ - .*/, '').replace(/ 16 oz.*/, '').replace(/ w\/.*/, '');
    if (name.length > 25) name = name.substring(0, 25) + '...';

    return {
      name,
      price: product.pricePerThousand,
      isRelyte: product.isRelyte,
      logoPath: product.logoPath,
      fullData: product,
      multiplier: product.isRelyte ? '' : `${(product.pricePerThousand / relytePrice).toFixed(1)}x`,
    };
  });

  console.log('Bar chart data:', chartData);

  // Custom label component for logos, prices, and multipliers
  const CustomBarLabel = ({ x, y, width, value, index }) => {
    const item = chartData[index];
    if (!item) return null;

    const centerX = x + width / 2;
    const logoSize = item.isRelyte ? 55 : 40;
    const logoY = y - 85; // Position logo above bar
    const priceY = y - 10; // Price label on top of bar
    const multiplierY = y - 25; // Multiplier above price

    return (
      <g>
        {/* Brand Logo */}
        {item.logoPath && (
          <image
            href={item.logoPath}
            x={centerX - logoSize / 2}
            y={logoY}
            width={logoSize}
            height={logoSize}
            style={{ opacity: 0.95 }}
          />
        )}

        {/* Price Label */}
        <text
          x={centerX}
          y={priceY}
          textAnchor="middle"
          fill={item.isRelyte ? '#1E3A8A' : '#374151'}
          fontSize={14}
          fontWeight={700}
        >
          ${value.toFixed(2)}
        </text>

        {/* Multiplier Label */}
        {item.multiplier && (
          <text
            x={centerX}
            y={multiplierY}
            textAnchor="middle"
            fill="#9CA3AF"
            fontSize={11}
            fontWeight={500}
          >
            {item.multiplier}
          </text>
        )}

        {/* Gold Star for Re-Lyte */}
        {item.isRelyte && (
          <text
            x={centerX + 25}
            y={priceY}
            fill="#F59E0B"
            fontSize={16}
            fontWeight="bold"
          >
            ★
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full" style={{ height: '700px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 100, right: 40, bottom: 100, left: 60 }}
        >
          {/* Gradient definitions for Re-Lyte bar */}
          <defs>
            <linearGradient id="relyteGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#1E3A8A" stopOpacity={1} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />

          <XAxis
            dataKey="name"
            textAnchor="end"
            height={80}
            interval={0}
            angle={-45}
            tick={{ fontSize: 11, fontWeight: 500 }}
          />

          <YAxis
            label={{
              value: 'Price per 1000mg ($) - Lower is Better',
              angle: -90,
              position: 'insideLeft',
              style: { fontSize: 13, fontWeight: 700, fill: '#374151' }
            }}
            domain={[0, 3]}
            tick={{ fontSize: 11 }}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.[0]) return null;
              const d = payload[0].payload.fullData;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border">
                  <p className="font-bold text-sm">{d.brand}</p>
                  <p className="text-sm">${d.pricePerThousand.toFixed(2)} per 1000mg</p>
                  <p className="text-xs text-gray-600 mt-1">
                    ${d.pricePerServing.toFixed(2)}/serving | {d.totalElectrolytes}mg total
                  </p>
                </div>
              );
            }}
          />

          <Bar dataKey="price" radius={[8, 8, 0, 0]} barSize={60}>
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isRelyte ? 'url(#relyteGradient)' : '#9CA3AF'}
                filter={entry.isRelyte ? 'url(#glow)' : undefined}
                stroke={entry.isRelyte ? '#1E3A8A' : '#6B7280'}
                strokeWidth={entry.isRelyte ? 2 : 1}
              />
            ))}
            <LabelList content={<CustomBarLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonBarChart;
