# LUMEN — Nordic Heirloom Wooden Toys & Executive Admin Suite

A high-craft direct-to-consumer (D2C) wooden toy storefront, developmental Montessori catalog, and executive business operations suite built with **React 19**, **TypeScript**, and **Tailwind CSS**.

---

## 🌟 Key Features

1. **Artisan Heirloom Storefront (`/`)**:
   - Curated collections: *Wheels & Motion*, *Rocking & Balance*, *Climbing & Play Gyms*, *Learning & Montessori*, *Play Furniture*.
   - Interactive 360° product inspector, live wood engraving monogram preview, and provenance specs.
   - Dynamic multi-currency checkout (INR ₹, USD $, EUR €) with custom gift registry support.
   - Built-in AI Gift Advisor powered by Google Gemini.

2. **Executive & Founder Portal (`#founder-portal`)**:
   - Live prototype cost waterfall & dynamic COGS simulator.
   - Interactive batch run sizing (25 to 500 units) with timber grade selection (Bavarian Steamed Beech vs White Birch).
   - Instant financial calculations: Gross Margin %, unit contribution profit, breakeven analysis.
   - Presentation Mask Mode for investor pitches & CSV financial export.

3. **WOODKIND Business Admin & CRM (`/admin.html`)**:
   - Leads / CRM tracking with pipeline stages.
   - Unit costing calculator & product pricing margin analysis.
   - Clay & Excel bidirectional CSV import/export.
   - Marketing campaigns & spend tracker.

---

## 🚀 Running Locally (Offline / Online)

### Option 1: Development Server
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Production Build & Preview
```bash
npm run build
npm run preview
```

### Option 3: Direct Offline Static View
The pre-compiled production build is in `dist/`. Because relative asset paths (`base: './'`) are configured:
- Open `dist/index.html` in any browser to browse the storefront.
- Open `dist/admin.html` to access the Woodkind CRM & admin tools.

---

## 📂 Project Structure
```
toy-store/
├── dist/                   # Compiled production build (ready for offline viewing)
├── docs/                   # Business & integration documentation
├── public/                 # Static assets & standalone admin.html
│   └── admin.html          # Full-screen WOODKIND Business Admin & CRM
├── src/
│   ├── components/         # Reusable UI, modals, header, footer
│   ├── data/               # Product catalog, currencies, specs
│   ├── screens/            # Home, Collections, ProductDetail, Checkout, FounderPortal, MarketingKit
│   ├── types.ts            # TypeScript definitions
│   └── App.tsx             # Root application orchestrator
├── .github/workflows/      # Automated GitHub Pages CI/CD workflow
├── package.json
└── vite.config.ts
```

---

## 🌐 Deployment
- **GitHub Repository**: [https://github.com/an420kit/toy-store](https://github.com/an420kit/toy-store)
- **Live GitHub Pages URL**: [https://an420kit.github.io/toy-store/](https://an420kit.github.io/toy-store/)
