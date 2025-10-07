import React from 'react';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-gray-200 max-w-xs">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={data.logoPath}
          alt={data.brand}
          className="w-12 h-12 object-contain"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
        <h3 className="font-bold text-sm text-gray-800">{data.brand}</h3>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Type:</span>
          <span className="font-semibold text-gray-800">{data.type}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Cost per 1000mg:</span>
          <span className="font-bold text-relyte-accent">
            ${data.pricePerThousand.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Electrolytes:</span>
          <span className="font-semibold text-gray-800">
            {data.totalElectrolytes.toFixed(0)} mg
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-gray-600">Price/serving:</span>
          <span className="font-semibold text-gray-800">
            ${data.pricePerServing.toFixed(2)}
          </span>
        </div>

        <div className="border-t pt-2 mt-2">
          <p className="text-xs text-gray-500 font-semibold mb-1">Mineral Breakdown:</p>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div>Sodium: {data.sodium} mg</div>
            <div>Potassium: {data.potassium} mg</div>
            <div>Calcium: {data.calcium || 0} mg</div>
            <div>Magnesium: {data.magnesium || 0} mg</div>
          </div>
        </div>
      </div>

      {data.isRelyte && (
        <div className="mt-2 px-2 py-1 bg-relyte-light rounded text-xs font-bold text-relyte-blue text-center">
          Re-Lyte Product ⭐
        </div>
      )}
    </div>
  );
};

export default CustomTooltip;
