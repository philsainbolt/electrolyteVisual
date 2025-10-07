import Papa from 'papaparse';

// Map brand names to logo file paths
const logoMapping = {
  'Relyte - Unflavored 16 oz w/ powder': '/logos/relyte.png',
  'Relyte Strawberry 16oz. w/ powder': '/logos/relyte.png',
  'Re-Lyte Energy Limeade - 14 oz, w/ powder': '/logos/relyte.png',
  'Re-Lyte Kids Grape - 16 oz w/powder': '/logos/relyte.png',
  'Re-Lyte Immunity Pineapple Orange - 14 oz, w/ powder': '/logos/relyte.png',
  'Relyte - Lemon Lime Packet 16 oz': '/logos/relyte.png',
  'LMNT Orange 16 oz water w/ powder': '/logos/lmnt.png',
  'LMNT - sparkling Electrolyte drink, decarbonated': '/logos/lmnt.png',
  'Liquid IV Sugar-Free Lemon Lime 16 oz w/ powder': '/logos/liquid-iv.png',
  'Gatorade Powder': '/logos/gatorade.png',
  'Gatorade Lemon Lime, RTD': '/logos/gatorade.png',
  'Gatorade Hydration Booster - Strawberry Watermelon, 10 g Packet, 20 oz': '/logos/gatorade.png',
  'Gatorade Zero powder, orange, 16 oz w/ powder': '/logos/gatorade.png',
  'Gatorlyte rapid rehydration - Orange, 16.9 oz w/ powder': '/logos/gatorade.png',
  'Bodyarmour Lyte - Peach Mango RTD': '/logos/bodyarmour.png',
  'Bodyarmour Flash IV - zero sugar - lemon lime, 16 oz w/powder': '/logos/bodyarmour.png',
  'Pedialyte - Strawberry, RTD': '/logos/pedialyte.png',
  'Ultima Grape': '/logos/ultima.png',
  'Nuun Sport Hydration (tablet)': '/logos/nuun.png',
  'Propel Fitness Water - Berry, RTD': '/logos/propel.png',
  'Propel Fitness Water zero Sugar Powder - Grape, 16 oz w/ poweder': '/logos/propel.png',
  'Powerade Fruit Punch, RTD': '/logos/powerade.png',
};

// Get brand name slug for logo (simplified version)
const getBrandSlug = (fluidName) => {
  const name = fluidName.toLowerCase();
  if (name.includes('relyte') || name.includes('re-lyte')) return 'relyte';
  if (name.includes('lmnt')) return 'lmnt';
  if (name.includes('liquid iv')) return 'liquid-iv';
  if (name.includes('gatorade') || name.includes('gatorlyte')) return 'gatorade';
  if (name.includes('bodyarmour')) return 'bodyarmour';
  if (name.includes('pedialyte')) return 'pedialyte';
  if (name.includes('ultima')) return 'ultima';
  if (name.includes('nuun')) return 'nuun';
  if (name.includes('propel')) return 'propel';
  if (name.includes('powerade')) return 'powerade';
  if (name.includes('electrolit')) return 'electrolit';
  if (name.includes('prime')) return 'prime';
  if (name.includes('kinderlyte')) return 'kinderlyte';
  if (name.includes('drip')) return 'dripdrop';
  return 'generic';
};

// Parse CSV data and add computed fields
export const parseElectrolyteData = async (csvPath) => {
  return new Promise((resolve, reject) => {
    Papa.parse(csvPath, {
      download: true,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {

        const processedData = results.data
          .filter(row => row.Fluid && row[' Price per 1000mg in 16 oz ']) // Filter valid rows
          .map(row => {
            const pricePerThousand = parseFloat(
              String(row[' Price per 1000mg in 16 oz '] || '0').replace('$', '').trim()
            );
            const totalElectrolytes = parseFloat(
              String(row['Cation Electrolyes per 16oz Serving'] || '0').replace(',', '')
            );
            const pricePerServing = parseFloat(
              String(row[' Price Per 16 oz Serving '] || '0').replace('$', '').trim()
            );

            const brandSlug = getBrandSlug(row.Fluid);
            const isRelyte = brandSlug === 'relyte';

            return {
              brand: row.Fluid,
              type: row['Type of Product'],
              pricePerThousand: isNaN(pricePerThousand) ? 0 : pricePerThousand,
              totalElectrolytes: isNaN(totalElectrolytes) ? 0 : totalElectrolytes,
              pricePerServing: isNaN(pricePerServing) ? 0 : pricePerServing,
              sodium: row['Sodium (mg)'] || 0,
              potassium: row['Potassium (mg)'] || 0,
              calcium: row['Calcium (mg)'] || 0,
              magnesium: row['Magneisum (mg)'] || 0,
              logoPath: `/logos/${brandSlug}.png`,
              isRelyte,
              brandSlug,
            };
          })
          .filter(item => item.pricePerThousand > 0 && item.totalElectrolytes > 0); // Only keep valid data

        resolve(processedData);
      },
      error: (error) => {
        console.error('Error loading electrolyte data:', error);
        reject(error);
      }
    });
  });
};

// Get summary statistics
export const getDataSummary = (data) => {
  const relyteBest = data.find(d => d.isRelyte);
  const sorted = [...data].sort((a, b) => a.pricePerThousand - b.pricePerThousand);

  return {
    totalProducts: data.length,
    bestValue: sorted[0],
    worstValue: sorted[sorted.length - 1],
    relyteRank: sorted.findIndex(d => d.isRelyte) + 1,
    relyteBest,
    avgPrice: (data.reduce((sum, d) => sum + d.pricePerThousand, 0) / data.length).toFixed(2),
  };
};
