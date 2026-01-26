'use client';

import React, { useState, useMemo } from 'react';
import { TrendingUp, Info } from 'lucide-react';

// 2026 Employer Tax Rates - Verified against official sources
// These are the ADDITIONAL costs employers pay ON TOP OF gross salary
const EMPLOYER_RATES = {
  EE: {
    name: 'Estonia',
    flag: '🇪🇪',
    // Social tax: 33% + Unemployment insurance: 0.8% = 33.8%
    socialTax: 0.33,
    unemployment: 0.008,
    total: 0.338,
    breakdown: '33% social tax + 0.8% unemployment',
  },
  LV: {
    name: 'Latvia',
    flag: '🇱🇻',
    // Employer social security contributions: 23.59%
    // Note: From 2026, may be reduced to 22% with employee paying more
    socialTax: 0.2359,
    unemployment: 0,
    total: 0.2359,
    breakdown: '23.59% social contributions',
  },
  LT: {
    name: 'Lithuania',
    flag: '🇱🇹',
    // Base: 1.77% (varies 1.45-2.71% by contract type)
    // + Guarantee Fund: 0.16%
    // + Long-term Employment Fund: 0.16%
    // Total: approximately 2.09%
    socialTax: 0.0177,
    guaranteeFund: 0.0016,
    longTermFund: 0.0016,
    total: 0.0209,
    breakdown: '1.77% social + 0.16% guarantee + 0.16% LT fund',
  },
};

export default function SalaryBudgetCalculator() {
  const [country, setCountry] = useState('EE');
  const [mode, setMode] = useState('raise-to-cost');
  const [currentSalary, setCurrentSalary] = useState('100000');
  const [raisePercent, setRaisePercent] = useState('5');
  const [budgetEur, setBudgetEur] = useState('5000');

  const config = EMPLOYER_RATES[country];

  const calculations = useMemo(() => {
    const salary = parseFloat(currentSalary) || 0;
    const raise = parseFloat(raisePercent) || 0;
    const budget = parseFloat(budgetEur) || 0;

    const getCost = (sal) => sal * (1 + config.total);

    // Current costs
    const currentCost = getCost(salary);

    // Mode 1: Raise % → Cost Impact
    const newSalary1 = salary * (1 + raise / 100);
    const salaryInc1 = newSalary1 - salary;
    const newCost1 = getCost(newSalary1);
    const costInc1 = newCost1 - currentCost;
    const budgetImpact1 = currentCost > 0 ? (costInc1 / currentCost) * 100 : 0;

    // Mode 2: Budget € → Affordable Raise %
    const targetCost = currentCost + budget;
    const newSalary2 = targetCost / (1 + config.total);
    const salaryInc2 = newSalary2 - salary;
    const raisePercent2 = salary > 0 ? (salaryInc2 / salary) * 100 : 0;
    const budgetPercent = currentCost > 0 ? (budget / currentCost) * 100 : 0;

    return {
      salary,
      currentCost,
      // Mode 1 results
      newSalary1,
      salaryInc1,
      newCost1,
      costInc1,
      budgetImpact1,
      // Mode 2 results
      targetCost,
      newSalary2,
      salaryInc2,
      raisePercent2,
      budgetPercent,
      budget,
    };
  }, [currentSalary, raisePercent, budgetEur, config]);

  const formatCurrency = (value) => {
    return `€${value.toLocaleString('en-US', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const TableRow = ({ label, monthly, annual, highlight = false, bold = false }) => (
    <tr className={highlight ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}>
      <td className={`px-4 py-3 text-sm ${bold ? 'font-bold text-slate-800' : 'text-slate-700'}`}>
        {label}
      </td>
      <td className={`px-4 py-3 text-right font-mono text-sm ${
        highlight ? 'text-red-600 font-semibold' : 'text-slate-800'
      } ${bold ? 'font-bold' : ''}`}>
        {formatCurrency(monthly)}
      </td>
      <td className={`px-4 py-3 text-right font-mono text-sm ${
        highlight ? 'text-red-600 font-semibold' : 'text-slate-800'
      } ${bold ? 'font-bold' : ''}`}>
        {formatCurrency(annual)}
      </td>
    </tr>
  );

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-10">
          <div className="mb-8 pb-6 border-b border-slate-200">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-7 h-7 text-red-600" />
              <h1 className="text-3xl font-light text-slate-800">
                Salary Budget Calculator
              </h1>
            </div>
            <p className="text-slate-600 text-sm">
              Plan your compensation budget for {config.name} (2026 employer tax rates)
            </p>
          </div>

          {/* Country Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Country
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full md:w-64 px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {Object.entries(EMPLOYER_RATES).map(([code, cfg]) => (
                <option key={code} value={code}>
                  {cfg.flag} {cfg.name}
                </option>
              ))}
            </select>
          </div>

          {/* Employer Tax Rate Info */}
          <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-800">
                  {config.name} Employer Tax Rate: {(config.total * 100).toFixed(2)}%
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {config.breakdown}
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  For every €1,000 gross salary, employer pays €{(1000 * config.total).toFixed(2)} in taxes
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Mode Selection */}
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-medium text-slate-800 mb-4">
                Choose Calculation Mode
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('raise-to-cost')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    mode === 'raise-to-cost' 
                      ? 'border-red-600 bg-red-50' 
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="font-semibold text-slate-800 mb-1">
                    Raise % → Cost Impact
                  </div>
                  <div className="text-sm text-slate-600">
                    Calculate budget impact from planned raise percentage
                  </div>
                </button>
                <button
                  onClick={() => setMode('budget-to-raise')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    mode === 'budget-to-raise' 
                      ? 'border-red-600 bg-red-50' 
                      : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="font-semibold text-slate-800 mb-1">
                    Budget € → Affordable Raise
                  </div>
                  <div className="text-sm text-slate-600">
                    Calculate maximum raise from budget limit
                  </div>
                </button>
              </div>
            </div>

            {/* Mode 1: Raise to Cost */}
            {mode === 'raise-to-cost' && (
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Calculate Cost Impact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Total Monthly Gross Salaries (€)
                    </label>
                    <input
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      placeholder="100000"
                      min="0"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Sum of all employee gross salaries
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Planned Raise (%)
                    </label>
                    <input
                      type="number"
                      value={raisePercent}
                      onChange={(e) => setRaisePercent(e.target.value)}
                      placeholder="5"
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b-2 border-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800"></th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                          Monthly
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                          Annual
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <TableRow 
                        label="Current Salaries" 
                        monthly={calculations.salary} 
                        annual={calculations.salary * 12} 
                      />
                      <TableRow 
                        label="New Salaries" 
                        monthly={calculations.newSalary1} 
                        annual={calculations.newSalary1 * 12} 
                      />
                      <TableRow 
                        label="Salary Increase" 
                        monthly={calculations.salaryInc1} 
                        annual={calculations.salaryInc1 * 12} 
                        highlight 
                      />
                      <tr className="border-t-2 border-slate-300">
                        <td colSpan="3" className="py-2"></td>
                      </tr>
                      <TableRow 
                        label="Current Employer Cost" 
                        monthly={calculations.currentCost} 
                        annual={calculations.currentCost * 12} 
                      />
                      <TableRow 
                        label="New Employer Cost" 
                        monthly={calculations.newCost1} 
                        annual={calculations.newCost1 * 12} 
                      />
                      <TableRow 
                        label="Total Cost Increase" 
                        monthly={calculations.costInc1} 
                        annual={calculations.costInc1 * 12} 
                        highlight 
                        bold 
                      />
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1 uppercase tracking-wider">
                      Budget Impact
                    </div>
                    <div className="text-2xl font-light text-red-600">
                      {calculations.budgetImpact1.toFixed(2)}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      increase in total cost
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1 uppercase tracking-wider">
                      Employer Tax Rate
                    </div>
                    <div className="text-2xl font-light text-slate-800">
                      {(config.total * 100).toFixed(2)}%
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {config.breakdown}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mode 2: Budget to Raise */}
            {mode === 'budget-to-raise' && (
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4">
                  Calculate Affordable Raise
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Total Monthly Gross Salaries (€)
                    </label>
                    <input
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      placeholder="100000"
                      min="0"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Sum of all employee gross salaries
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Monthly Budget Increase (€)
                    </label>
                    <input
                      type="number"
                      value={budgetEur}
                      onChange={(e) => setBudgetEur(e.target.value)}
                      placeholder="5000"
                      min="0"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <p className="text-xs text-slate-500 mt-1">
                      Additional monthly budget available
                    </p>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-600 mb-2">
                      With {formatCurrency(calculations.budget)} additional monthly budget 
                      ({calculations.budgetPercent.toFixed(2)}% increase), you can afford:
                    </div>
                    <div className="text-5xl font-light text-red-600 mb-2">
                      {calculations.raisePercent2.toFixed(2)}%
                    </div>
                    <div className="text-sm text-slate-600">salary increase</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b-2 border-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800"></th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                          Monthly
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">
                          Annual
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <TableRow 
                        label="Current Salaries" 
                        monthly={calculations.salary} 
                        annual={calculations.salary * 12} 
                      />
                      <TableRow 
                        label="Affordable New Salaries" 
                        monthly={calculations.newSalary2} 
                        annual={calculations.newSalary2 * 12} 
                      />
                      <TableRow 
                        label="Affordable Increase" 
                        monthly={calculations.salaryInc2} 
                        annual={calculations.salaryInc2 * 12} 
                        highlight 
                      />
                      <tr className="border-t-2 border-slate-300">
                        <td colSpan="3" className="py-2"></td>
                      </tr>
                      <TableRow 
                        label="Current Employer Cost" 
                        monthly={calculations.currentCost} 
                        annual={calculations.currentCost * 12} 
                      />
                      <TableRow 
                        label="Maximum New Cost" 
                        monthly={calculations.targetCost} 
                        annual={calculations.targetCost * 12} 
                      />
                      <TableRow 
                        label="Budget Increase (at limit)" 
                        monthly={calculations.budget} 
                        annual={calculations.budget * 12} 
                        highlight 
                        bold 
                      />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Country Comparison */}
          <div className="mt-8 bg-slate-50 rounded-lg p-5 border border-slate-200">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider">
              Employer Tax Rate Comparison (2026)
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(EMPLOYER_RATES).map(([code, cfg]) => (
                <div 
                  key={code}
                  className={`p-3 rounded-lg border ${
                    code === country 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="text-lg font-semibold">
                    {cfg.flag} {cfg.name}
                  </div>
                  <div className={`text-2xl font-light ${
                    code === country ? 'text-red-600' : 'text-slate-800'
                  }`}>
                    {(cfg.total * 100).toFixed(2)}%
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {cfg.breakdown}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Employer costs include social taxes for {config.name} (2026 rates). 
              Estonia has the highest employer burden at 33.8%, 
              while Lithuania has the lowest at ~2.09%.
              For consultation on compensation planning, consult with a tax professional or contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
