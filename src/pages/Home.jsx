import React, { useState, useEffect } from 'react';
import Chart from '../components/Chart';
import ComparisonBarChart from '../components/ComparisonBarChart_v2';
import { parseElectrolyteData, getDataSummary } from '../utils/dataParser';

const Home = () => {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const parsedData = await parseElectrolyteData('/src_data.csv');
        setData(parsedData);
        setSummary(getDataSummary(parsedData));
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
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-relyte-blue mb-3">
            Electrolyte Cost Efficiency Comparison
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Comparing price per 1000mg of electrolytes across {data.length} hydration products
          </p>
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 mb-8">
          <div className="text-center mb-6">
            <p className="text-xs md:text-sm text-gray-600 mb-2">
              Hover over any circle for detailed breakdown
            </p>
            <p className="text-xs text-gray-500">
              <span className="inline-block w-3 h-3 rounded-full bg-emerald-500 mr-1"></span> Bulk Powder
              <span className="inline-block w-3 h-3 rounded-full bg-amber-500 ml-3 mr-1"></span> RTD
              <span className="inline-block w-3 h-3 rounded-full bg-violet-500 ml-3 mr-1"></span> Stick Pack
              <span className="inline-block w-3 h-3 rounded-full bg-relyte-blue ml-3 mr-1"></span> Re-Lyte ★
            </p>
          </div>
          <Chart data={data} />

          {summary && summary.relyteBest && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-sm text-gray-700">
                <strong>Bottom-left quadrant = best value</strong> (low price, high electrolytes) •{' '}
                Re-Lyte leads at <span className="font-bold">${summary.relyteBest.pricePerThousand.toFixed(2)}/1000mg</span>
              </p>
            </div>
          )}
        </div>

        {/* Quick Brand Comparison Section */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-8 mb-8">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-relyte-blue mb-2">
              Quick Brand Comparison
            </h2>
            <p className="text-xs md:text-sm text-gray-600">
              See how Re-Lyte stacks up against leading competitors on price per 1000mg
            </p>
          </div>
          <ComparisonBarChart data={data} />
          <div className="mt-4 text-center text-xs text-gray-500">
            <p>Lower price per 1000mg = better value • Numbers in parentheses show cost multiplier vs Re-Lyte</p>
          </div>
        </div>

        {/* Methodology Section */}
        <div className="bg-white rounded-xl shadow-xl p-4 md:p-8">
          <h3 className="text-base md:text-lg font-bold text-relyte-blue mb-3">
            About This Metric
          </h3>
          <div className="text-gray-700 text-xs md:text-sm space-y-3">
            <p>
              <strong>Price per 1000mg</strong> normalizes cost against total electrolyte content
              (sodium, potassium, calcium, magnesium) for fair comparison across all product types.
            </p>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-mono text-xs">
                Price per 1000mg = (Price per 16oz) ÷ (Total electrolytes ÷ 1000)
              </p>
            </div>

            <p>
              <strong>Example:</strong> Re-Lyte Unflavored costs $0.60 per serving with 1560mg electrolytes
              <br />
              → $0.60 ÷ 1.56 = <strong>$0.38 per 1000mg</strong>
            </p>

            <div className="bg-relyte-light p-3 rounded-lg">
              <p className="text-xs text-gray-600 mb-2">
                💡 <strong>Lower values = better cost efficiency</strong> (more electrolytes per dollar)
              </p>
              <ul className="text-xs space-y-1">
                <li>✅ Re-Lyte Unflavored: $0.38/1000mg</li>
                <li>• LMNT: $1.35/1000mg</li>
                <li>• Liquid IV: $2.16/1000mg</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
