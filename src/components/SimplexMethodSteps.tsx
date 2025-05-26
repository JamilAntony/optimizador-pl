import React from 'react';
import type { SimplexStep } from '@/types/lpTypes';

interface SimplexMethodStepsProps {
  steps: SimplexStep[];
  variables: string[];
}

const SimplexMethodSteps: React.FC<SimplexMethodStepsProps> = ({ steps, variables }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Método Simplex</h2>
      {/* Steps Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-blue-100 rounded-xl overflow-hidden">
          <thead className="bg-blue-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">Iteración</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">Tabla</th>
              <th className="px-4 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider border-b border-blue-100">Explicación</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-blue-50">
            {steps.map((step: SimplexStep, index: number) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold text-blue-900 align-top">
                  {index + 1}
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-blue-100 border border-blue-100 rounded-lg">
                      <thead className="bg-blue-100">
                        <tr>
                          {step.tableau.basicVars.map((header: string, i: number) => (
                            <th
                              key={i}
                              className="px-2 py-1 text-xs font-semibold text-blue-700 border-b border-blue-200"
                            >
                              {header}
                            </th>
                          ))}
                          <th className="px-2 py-1 text-xs font-semibold text-blue-700 border-b border-blue-200">RHS</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-blue-50">
                        {step.tableau.coefficients.map((row: number[], i: number) => (
                          <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-blue-50/50'}>
                            {row.map((cell: number, j: number) => (
                              <td
                                key={j}
                                className={`px-2 py-1 text-sm text-blue-900 text-center ${
                                  step.pivot && step.pivot.row === i && step.pivot.col === j
                                    ? 'bg-yellow-100 font-bold border-2 border-yellow-400'
                                    : ''
                                }`}
                              >
                                {cell.toFixed(2)}
                              </td>
                            ))}
                            <td className="px-2 py-1 text-sm text-blue-900 text-center font-semibold">
                              {step.tableau.rhs[i].toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-blue-50">
                          {step.tableau.z.map((cell: number, j: number) => (
                            <td
                              key={j}
                              className="px-2 py-1 text-sm font-bold text-blue-700 text-center"
                            >
                              {cell.toFixed(2)}
                            </td>
                          ))}
                          <td className="px-2 py-1 text-sm font-bold text-blue-700 text-center">
                            {step.tableau.z0.toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
                <td className="px-4 py-4 align-top">
                  <div className="text-sm text-blue-900 space-y-2">
                    <p className="whitespace-pre-line font-medium">{step.explanation}</p>
                    {step.enteringVar && (
                      <p className="text-blue-600 font-semibold">
                        Variable entrante: {step.enteringVar}
                      </p>
                    )}
                    {step.leavingVar && (
                      <p className="text-red-600 font-semibold">
                        Variable saliente: {step.leavingVar}
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Final Solution */}
      {steps.length > 0 && (
        <div className="bg-blue-100 border border-blue-300 rounded-xl shadow p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Solución Óptima</h3>
          <div className="space-y-1 text-blue-800 text-base">
            {variables.map((varName: string, i: number) => (
              <div key={i}>
                <span className="font-semibold">{varName}:</span>{' '}
                {steps[steps.length - 1].tableau.basicVars.includes(varName)
                  ? steps[steps.length - 1].tableau.rhs[
                      steps[steps.length - 1].tableau.basicVars.indexOf(varName)
                    ].toFixed(2)
                  : '0.00'}
              </div>
            ))}
            <div>
              <span className="font-semibold">Valor objetivo:</span>{' '}
              {steps[steps.length - 1].tableau.z0.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimplexMethodSteps; 