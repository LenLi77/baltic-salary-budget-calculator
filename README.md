# baltic-salary-budget-calculator
# Baltic Salary Budget Calculator

A professional salary budget planning tool for companies operating in Estonia, Latvia, and Lithuania.

## Features

- **Two Calculation Modes:**
  - **Raise % → Cost Impact**: Calculate total budget impact from planned salary increases
  - **Budget € → Affordable Raise**: Determine maximum affordable raise from budget constraints

- **Country-Specific Tax Calculations:**
  - Estonia: 33.8% employer burden
  - Latvia: 23.59% employer burden  
  - Lithuania: 1.77% employer burden

- **Monthly & Annual Projections**: View both short and long-term financial impact
- **Real-time Calculations**: Instant results as you adjust inputs
- **Professional UI**: Clean, sophisticated design suitable for business use

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/baltic-salary-budget-calculator.git
cd baltic-salary-budget-calculator
```

2. Install dependencies:
```bash
npm install
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Deploy automatically

## Project Structure

```
baltic-salary-budget-calculator/
├── app/
│   ├── page.js              # Main calculator component
│   ├── layout.js            # App layout
│   └── globals.css          # Global styles
├── package.json
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Usage

### Raise % → Cost Impact
1. Select your country
2. Enter current total monthly gross salary
3. Enter planned raise percentage
4. View monthly and annual cost impact

### Budget € → Affordable Raise
1. Select your country
2. Enter current total monthly gross salary
3. Enter maximum budget increase in EUR
4. View affordable raise percentage and breakdown

## Tax Rates (2026)

| Country | Employer Social Tax |
|---------|-------------------|
| Estonia | 33.8% |
| Latvia  | 23.59% |
| Lithuania | 1.77% |

## Technologies

- Next.js 14
- React 18
- Tailwind CSS
- Lucide React (icons)

## License

MIT

## Support

For professional consultation on compensation planning, contact us.
