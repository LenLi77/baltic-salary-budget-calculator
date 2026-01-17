'use client';

import React, { useState } from 'react';
import { TrendingUp } from 'lucide-react';

export default function SalaryBudgetCalculator() {
  const [country, setCountry] = useState('EE');
  const [mode, setMode] = useState('raise-to-cost');
  const [currentSalary, setCurrentSalary] = useState('100000');
  const [raisePercent, setRaisePercent] = useState('5');
  const [budgetEur, setBudgetEur] = useState('5000');

  const rates = {
    EE: 0.338,
    LV: 0.2359,
    LT: 0.0177
  };

  const countries = {
    EE: 'Estonia',
    LV: 'Latvia',
    LT: 'Lithuania'
  };

  const getCost = (salary) => salary * (1 + rates[country]);
  
  const salary = parseFloat(currentSalary) || 0;
  const raise = parseFloat(raisePercent) || 0;
  const budget = parseFloat(budgetEur) || 0;

  // Mode 1: Raise % to Cost
  const newSalary1 = salary * (1 + raise / 100);
  const salaryInc1 = newSalary1 - salary;
  const currentCost = getCost(salary);
  const newCost1 = getCost(newSalary1);
  const costInc1 = newCost1 - currentCost;

  // Mode 2: Budget EUR to Raise %
  const targetCost = currentCost + budget;
  const newSalary2 = targetCost / (1 + rates[country]);
  const salaryInc2 = newSalary2 - salary;
  const raisePercent2 = salary > 0 ? (salaryInc2 / salary) * 100 : 0;
  const budgetPercent = currentCost > 0 ? (budget / currentCost) * 100 : 0;

  const TableRow = ({ label, monthly, annual, highlight = false, bold = false }) => (
    <tr className={highlight ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}>
      <td className={`px-4 py-3 text-sm ${bold ? 'font-bold text-slate-800' : 'text-slate-700'}`}>{label}</td>
      <td className={`px-4 py-3 text-right font-mono text-sm ${highlight ? 'text-red-600 font-semibold' : 'text-slate-800'} ${bold ? 'font-bold' : ''}`}>
        €{monthly.toFixed(2)}
      </td>
      <td className={`px-4 py-3 text-right font-mono text-sm ${highlight ? 'text-red-600 font-semibold' : 'text-slate-800'} ${bold ? 'font-bold' : ''}`}>
        €{annual.toFixed(2)}
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
              <h1 className="text-3xl font-light text-slate-800">Salary Budget Calculator</h1>
            </div>
            <p className="text-slate-600 text-sm">
              Plan your compensation budget for {countries[country]}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full md:w-64 px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="EE">🇪🇪 Estonia</option>
              <option value="LV">🇱🇻 Latvia</option>
              <option value="LT">🇱🇹 Lithuania</option>
            </select>
          </div>

          <div className="space-y-6">
            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
              <h3 className="text-lg font-medium text-slate-800 mb-4">Choose Calculation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('raise-to-cost')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    mode === 'raise-to-cost' ? 'border-red-600 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="font-semibold text-slate-800 mb-1">Raise % → Cost Impact</div>
                  <div className="text-sm text-slate-600">Calculate budget impact from planned raise %</div>
                </button>
                <button
                  onClick={() => setMode('budget-to-raise')}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    mode === 'budget-to-raise' ? 'border-red-600 bg-red-50' : 'border-slate-300 bg-white hover:border-slate-400'
                  }`}
                >
                  <div className="font-semibold text-slate-800 mb-1">Budget € → Affordable Raise</div>
                  <div className="text-sm text-slate-600">Calculate max raise from budget limit</div>
                </button>
              </div>
            </div>

            {mode === 'raise-to-cost' && (
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Calculate Cost Impact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Monthly Gross Salary (€)
                    </label>
                    <input
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      placeholder="100000"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
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
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b-2 border-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800"></th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">Monthly</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">Annual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <TableRow label="Current Salaries" monthly={salary} annual={salary * 12} />
                      <TableRow label="New Salaries" monthly={newSalary1} annual={newSalary1 * 12} />
                      <TableRow label="Salary Increase" monthly={salaryInc1} annual={salaryInc1 * 12} highlight />
                      <tr className="border-t-2 border-slate-300"><td colSpan="3" className="py-2"></td></tr>
                      <TableRow label="Current Employer Cost" monthly={currentCost} annual={currentCost * 12} />
                      <TableRow label="New Employer Cost" monthly={newCost1} annual={newCost1 * 12} />
                      <TableRow label="Total Cost Increase" monthly={costInc1} annual={costInc1 * 12} highlight bold />
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1 uppercase tracking-wider">Budget Impact</div>
                    <div className="text-2xl font-light text-red-600">
                      {currentCost > 0 ? ((costInc1 / currentCost) * 100).toFixed(2) : '0.00'}%
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                    <div className="text-xs text-slate-600 mb-1 uppercase tracking-wider">Employer Tax</div>
                    <div className="text-2xl font-light text-slate-800">
                      {(rates[country] * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {mode === 'budget-to-raise' && (
              <div className="bg-white rounded-lg p-6 border border-slate-200">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Calculate Affordable Raise</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Current Monthly Gross Salary (€)
                    </label>
                    <input
                      type="number"
                      value={currentSalary}
                      onChange={(e) => setCurrentSalary(e.target.value)}
                      placeholder="100000"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Maximum Budget Increase (€)
                    </label>
                    <input
                      type="number"
                      value={budgetEur}
                      onChange={(e) => setBudgetEur(e.target.value)}
                      placeholder="5000"
                      className="w-full px-4 py-2.5 border border-slate-300 rounded bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 mb-4">
                  <div className="text-center">
                    <div className="text-sm text-slate-600 mb-2">
                      With €{budget.toFixed(2)} additional budget ({budgetPercent.toFixed(2)}%), you can afford:
                    </div>
                    <div className="text-5xl font-light text-red-600 mb-2">
                      {raisePercent2.toFixed(2)}%
                    </div>
                    <div className="text-sm text-slate-600">salary increase</div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b-2 border-slate-300">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-800"></th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">Monthly</th>
                        <th className="px-4 py-3 text-right text-sm font-semibold text-slate-800">Annual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      <TableRow label="Current Salaries" monthly={salary} annual={salary * 12} />
                      <TableRow label="Affordable New Salaries" monthly={newSalary2} annual={newSalary2 * 12} />
                      <TableRow label="Affordable Increase" monthly={salaryInc2} annual={salaryInc2 * 12} highlight />
                      <tr className="border-t-2 border-slate-300"><td colSpan="3" className="py-2"></td></tr>
                      <TableRow label="Current Employer Cost" monthly={currentCost} annual={currentCost * 12} />
                      <TableRow label="Maximum New Cost" monthly={targetCost} annual={targetCost * 12} />
                      <TableRow label="Cost Increase (at limit)" monthly={budget} annual={budget * 12} highlight bold />
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-xs text-slate-500 text-center">
              Employer costs include social taxes for {countries[country]}. 
              For consultation on compensation planning, contact us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
