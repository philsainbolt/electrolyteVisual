import React, { useState, useEffect } from 'react';
import { parseElectrolyteData } from '../utils/dataParser';

const Table = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'pricePerThousand', direction: 'asc' });
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const parsedData = await parseElectrolyteData('/src_data.csv');
        setData(parsedData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const downloadCSV = () => {
    const headers = [
      'Brand',
      'Type',
      'Price per 1000mg ($)',
      'Total Electrolytes (mg)',
      'Price per Serving ($)',
      'Sodium (mg)',
      'Potassium (mg)',
      'Calcium (mg)',
      'Magnesium (mg)',
    ];

    const csvContent = [
      headers.join(','),
      ...filteredAndSortedData.map((row) =>
        [
          `"${row.brand}"`,
          `"${row.type}"`,
          row.pricePerThousand.toFixed(2),
          row.totalElectrolytes.toFixed(0),
          row.pricePerServing.toFixed(2),
          row.sodium,
          row.potassium,
          row.calcium || 0,
          row.magnesium || 0,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'electrolyte-comparison-data.csv';
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-relyte-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
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

  // Apply filters
  const filteredData = filterType === 'all'
    ? data
    : data.filter(d => d.type === filterType);

  // Apply sorting
  const filteredAndSortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortConfig.key];
    const bVal = b[sortConfig.key];

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) return <span className="text-gray-400">◆</span>;
    return sortConfig.direction === 'asc' ? <span>▲</span> : <span>▼</span>;
  };

  const productTypes = ['all', ...new Set(data.map(d => d.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-relyte-light to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-relyte-blue mb-2">
            Full Data Table
          </h1>
          <p className="text-gray-600">
            Complete comparison of all {data.length} electrolyte products
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <label className="font-semibold text-gray-700">Filter by Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-relyte-accent focus:border-transparent"
            >
              {productTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-600">
              ({filteredAndSortedData.length} products)
            </span>
          </div>

          <button
            onClick={downloadCSV}
            className="bg-relyte-blue text-white px-6 py-2 rounded-lg font-semibold hover:bg-relyte-accent transition-colors shadow-md"
          >
            ⬇ Download CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-relyte-blue text-white">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Brand</th>
                  <th className="px-4 py-3 text-left font-semibold">Type</th>
                  <th
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-relyte-accent"
                    onClick={() => handleSort('pricePerThousand')}
                  >
                    Price/1000mg <SortIcon columnKey="pricePerThousand" />
                  </th>
                  <th
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-relyte-accent"
                    onClick={() => handleSort('totalElectrolytes')}
                  >
                    Total (mg) <SortIcon columnKey="totalElectrolytes" />
                  </th>
                  <th
                    className="px-4 py-3 text-right font-semibold cursor-pointer hover:bg-relyte-accent"
                    onClick={() => handleSort('pricePerServing')}
                  >
                    Price/Serving <SortIcon columnKey="pricePerServing" />
                  </th>
                  <th className="px-4 py-3 text-right font-semibold">Na (mg)</th>
                  <th className="px-4 py-3 text-right font-semibold">K (mg)</th>
                  <th className="px-4 py-3 text-right font-semibold">Ca (mg)</th>
                  <th className="px-4 py-3 text-right font-semibold">Mg (mg)</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedData.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b ${
                      row.isRelyte
                        ? 'bg-relyte-light font-semibold'
                        : index % 2 === 0
                        ? 'bg-white'
                        : 'bg-gray-50'
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-3 text-left">
                      <div className="flex items-center gap-2">
                        {row.isRelyte && <span className="text-relyte-accent">★</span>}
                        {row.brand}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-left text-gray-600">{row.type}</td>
                    <td className="px-4 py-3 text-right font-semibold text-relyte-accent">
                      ${row.pricePerThousand.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right">{row.totalElectrolytes.toFixed(0)}</td>
                    <td className="px-4 py-3 text-right">${row.pricePerServing.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.sodium}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.potassium}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.calcium || 0}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{row.magnesium || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            ★ = Re-Lyte Product | Click column headers to sort | All prices normalized to 16oz servings
          </p>
        </div>
      </div>
    </div>
  );
};

export default Table;
