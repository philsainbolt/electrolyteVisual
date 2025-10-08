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

  // Focus on major brands with logos
  const majorBrands = ['relyte', 'gatorade', 'lmnt', 'liquid-iv', 'prime', 'pedialyte',
                       'bodyarmour', 'ultima', 'nuun', 'propel'];

  // Get one product per brand - pick the cheapest for each brand
  const brandMap = new Map();

  data.forEach(product => {
    const slug = product.brandSlug;

    // Only include major brands
    if (!majorBrands.includes(slug)) return;

    // Validate data - filter out corrupted entries
    if (!product.pricePerThousand || product.pricePerThousand <= 0 || product.pricePerThousand > 10) return;

    // If we don't have this brand yet, or this product is cheaper, use it
    if (!brandMap.has(slug) || product.pricePerThousand < brandMap.get(slug).pricePerThousand) {
      brandMap.set(slug, product);
    }
  });

  // Convert to array and sort by price (ascending - cheapest first)
  const comparisonData = Array.from(brandMap.values())
    .sort((a, b) => a.pricePerThousand - b.pricePerThousand)
    .slice(0, 10); // Top 10 brands

  // Calculate multiplier vs Re-Lyte (cheapest)
  const relytePrice = comparisonData.find(d => d.isRelyte)?.pricePerThousand || comparisonData[0]?.pricePerThousand;

  const chartData = comparisonData.map(product => {
    // Simplify brand labels - remove extra details
    let brandLabel = product.brand;
    // Remove flavor details and package info for cleaner labels
    brandLabel = brandLabel.replace(/ - .*/, '').replace(/ 16 oz.*/, '').replace(/ w\/.*/, '');
    if (brandLabel.length > 30) {
      brandLabel = brandLabel.substring(0, 30) + '...';
    }

    return {
      ...product,
      brandLabel,
      value: product.pricePerThousand, // Ensure we have a value field
      multiplier: product.isRelyte ? '' : `${(product.pricePerThousand / relytePrice).toFixed(1)}x`,
    };
  });

  // Debug: log chart data to console
  console.log('ComparisonBarChart data:', chartData);

  const CustomYAxisTick = ({ x, y, payload }) => {
    const product = chartData[payload.index];
    if (!product) return null;

    return (
      <g transform={`translate(${x},${y})`}>
        {/* Logo */}
        {product.logoPath && (
          <image
            href={product.logoPath}
            x={-45}
            y={-12}
            width={24}
            height={24}
            style={{ opacity: 0.9 }}
          />
        )}
        {/* Brand name */}
        <text
          x={-55}
          y={0}
          dy={4}
          textAnchor="end"
          fill={product.isRelyte ? '#1E3A8A' : '#374151'}
          fontSize={12}
          fontWeight={product.isRelyte ? 700 : 500}
        >
          {product.brandLabel}
        </text>
      </g>
    );
  };

  const CustomLabel = ({ x, y, width, value, index }) => {
    const product = chartData[index];
    const labelX = x + width + 8;

    return (
      <g>
        {/* Price */}
        <text
          x={labelX}
          y={y + 10}
          fill={product.isRelyte ? '#1E3A8A' : '#6B7280'}
          fontSize={13}
          fontWeight={product.isRelyte ? 700 : 600}
        >
          ${value.toFixed(2)}
        </text>
        {/* Multiplier */}
        {product.multiplier && (
          <text
            x={labelX + 45}
            y={y + 10}
            fill="#9CA3AF"
            fontSize={11}
            fontWeight={500}
          >
            ({product.multiplier})
          </text>
        )}
        {/* Star for Re-Lyte */}
        {product.isRelyte && (
          <text
            x={labelX + 80}
            y={y + 10}
            fill="#F59E0B"
            fontSize={14}
            fontWeight="bold"
          >
            ★
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="horizontal"
          margin={{ top: 10, right: 140, bottom: 20, left: 180 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />

          <XAxis
            type="number"
            domain={[0, 3]}
            tick={{ fontSize: 11 }}
            label={{
              value: 'Price per 1000mg ($) - Lower is Better',
              position: 'bottom',
              offset: 0,
              style: { fontSize: 12, fontWeight: 600, fill: '#6B7280' }
            }}
          />

          <YAxis
            type="category"
            dataKey="brandLabel"
            tick={<CustomYAxisTick />}
            width={180}
          />

          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload || !payload[0]) return null;
              const data = payload[0].payload;
              return (
                <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                  <p className="font-semibold text-sm text-gray-800 mb-1">{data.brand}</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">${data.pricePerThousand.toFixed(2)}</span> per 1000mg
                  </p>
                  {data.multiplier && (
                    <p className="text-xs text-gray-500 mt-1">
                      {data.multiplier} vs Re-Lyte
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Total: {data.totalElectrolytes}mg | ${data.pricePerServing.toFixed(2)}/serving
                  </p>
                </div>
              );
            }}
          />

          <Bar
            dataKey="pricePerThousand"
            fill="#9CA3AF"
            radius={[0, 6, 6, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.isRelyte ? '#1E3A8A' : '#9CA3AF'}
              />
            ))}
            <LabelList content={<CustomLabel />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ComparisonBarChart;
