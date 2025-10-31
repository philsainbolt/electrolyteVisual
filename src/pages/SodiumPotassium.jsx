import React, { useState, useEffect } from 'react';
import SodiumPotassiumChart from '../components/SodiumPotassiumChart';
import { parseElectrolyteData } from '../utils/dataParser';

// List of brands to display (case-insensitive matching)
const TARGET_BRANDS = [
  'mountain ops',
  'wilderness athlete',
  'black flag',
  'bucked up',
  'gatorade',
  'liquid iv',
  'propel',
  'prime'
];

const SodiumPotassium = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const parsedData = await parseElectrolyteData('/src_data.csv');

        // Filter to include Re-Lyte + target brands, one product per brand
        const brandMap = new Map();

        // First, add Re-Lyte Strawberry specifically
        parsedData.forEach(product => {
          if (product.brand === 'Relyte Strawberry 16oz. w/ powder') {
            brandMap.set('relyte', product);
          }
        });

        // Then add one product from each target brand
        parsedData.forEach(product => {
          const brandLower = product.brand.toLowerCase();
          const matchedTarget = TARGET_BRANDS.find(target =>
            brandLower.includes(target) || target.includes(brandLower)
          );

          if (matchedTarget && !brandMap.has(matchedTarget)) {
            brandMap.set(matchedTarget, product);
          }
        });

        const filteredData = Array.from(brandMap.values());
        setData(filteredData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-relyte-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading electrolyte data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-300 text-red-700 px-6 py-4 rounded-lg max-w-md">
          <h3 className="font-bold mb-2">Error Loading Data</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-relyte-light to-white">
      <div className="container mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="text-center mb-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-relyte-blue mb-3">
            Sodium vs Potassium Comparison
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Comparing sodium and potassium content across {data.length} leading electrolyte brands
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 mb-8">
          <SodiumPotassiumChart data={data} />
        </div>

        {/* About Sodium & Potassium Section */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
          <h3 className="text-base md:text-lg font-bold text-relyte-blue mb-3">
            Why Sodium & Potassium Matter
          </h3>
          <div className="text-gray-700 text-xs md:text-sm space-y-3">
            <p>
              <strong>Sodium</strong> and <strong>potassium</strong> are the two most critical electrolytes
              for hydration, muscle function, and nerve signaling. They work together to maintain proper
              fluid balance in your cells.
            </p>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-semibold mb-2">Key Functions:</p>
              <ul className="space-y-1 ml-4">
                <li>• <strong>Sodium:</strong> Primary electrolyte in extracellular fluid, drives fluid absorption</li>
                <li>• <strong>Potassium:</strong> Primary electrolyte in intracellular fluid, supports muscle contraction</li>
              </ul>
            </div>

            <p>
              The ideal ratio varies by individual needs and activity level. Re-Lyte products are formulated
              with a balanced 2:1 sodium-to-potassium ratio, optimized for most athletes and active individuals.
            </p>

            <div className="bg-relyte-light p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">
                💡 <strong>Higher values = more electrolyte support</strong>
              </p>
              <p className="text-xs">
                Top-right quadrant products provide the most sodium and potassium per serving,
                making them ideal for intense workouts and hot weather activities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SodiumPotassium;
