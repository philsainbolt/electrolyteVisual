# Re-Lyte Electrolyte Comparison Visualization

An interactive data visualization comparing electrolyte supplements by cost efficiency and performance.

## 🎯 Features

- **Interactive Scatter Plot**: Compare products by cost per 1000mg vs. total electrolyte content
- **Brand Logos**: Visual representation using brand logos as data points
- **Detailed Tooltips**: Hover over any product to see complete breakdown
- **Data Table**: Sortable, filterable table with full dataset
- **CSV Export**: Download the complete comparison data
- **Mobile Responsive**: Works seamlessly on all devices

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Opens at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📊 Data Source

The application reads from `/public/src_data.csv` which contains:
- 44+ electrolyte products
- Cost per serving
- Electrolyte content (Na, K, Ca, Mg)
- Product type (Bulk Powder, RTD, Stick Pack)

## 🎨 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool & dev server
- **TailwindCSS** - Styling
- **Recharts** - Interactive charts
- **PapaParse** - CSV parsing
- **React Router** - Navigation

## 📁 Project Structure

```
electrolyteVisual/
├── public/
│   ├── logos/          # Brand logo images (add your own)
│   └── src_data.csv    # Electrolyte comparison data
├── src/
│   ├── components/
│   │   ├── Chart.jsx        # Main scatter plot
│   │   ├── CustomTooltip.jsx
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx         # Chart + insights
│   │   └── Table.jsx        # Full data table
│   ├── utils/
│   │   └── dataParser.js    # CSV processing
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🖼️ Adding Brand Logos

Place PNG logos (100x100px, transparent background) in `/public/logos/`:

- relyte.png
- lmnt.png
- liquid-iv.png
- gatorade.png
- bodyarmour.png
- etc.

See `/public/logos/README.md` for complete list.

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Deploy automatically

Or use Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

## 📈 Key Metrics

The visualization focuses on **Price per 1000mg of Electrolytes**:

```
Price per 1000mg = (Price per 16oz) ÷ (Total cations ÷ 1000)
```

This normalizes products for fair comparison regardless of serving size or format.

## 🎯 Marketing Use

### Embed in Shopify

```html
<iframe
  src="https://your-project.vercel.app"
  width="100%"
  height="800px"
  frameborder="0">
</iframe>
```

### Share Direct Link

The deployed site is fully standalone and can be shared directly.

## 📝 License

Proprietary - Re-Lyte Marketing

## 🤝 Contributing

For internal use. Contact the marketing team for access.
