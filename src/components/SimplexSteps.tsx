import React from 'react';

interface SimplexTableau {
  basicVars: string[];
  nonBasicVars: string[];
  coefficients: number[][];
  rhs: number[];
  z: number[];
  z0: number;
}

interface SimplexStepsProps {
  steps: {
    tableau: SimplexTableau;
    pivot?: {
      row: number;
      col: number;
    };
    enteringVar?: string;
    leavingVar?: string;
    explanation: string;
  }[];
}

const SimplexSteps: React.FC<SimplexStepsProps> = ({ steps }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-lg">Método Simplex</h3>
      {steps.map((step, index) => (
        <div key={index} className="bg-white p-4 rounded-lg shadow">
          <div className="mb-2">
            <span className="font-medium">Paso {index + 1}:</span> {step.explanation}
          </div>
          
          {step.pivot && (
            <div className="text-sm text-blue-600 mb-2">
              Variable entrante: {step.enteringVar}, Variable saliente: {step.leavingVar}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-2 py-1 bg-gray-50">Base</th>
                  {step.tableau.nonBasicVars.map((var_, i) => (
                    <th key={i} className="border px-2 py-1 bg-gray-50">{var_}</th>
                  ))}
                  <th className="border px-2 py-1 bg-gray-50">RHS</th>
                </tr>
              </thead>
              <tbody>
                {step.tableau.coefficients.map((row, i) => (
                  <tr key={i}>
                    <td className="border px-2 py-1 font-medium">{step.tableau.basicVars[i]}</td>
                    {row.map((coef, j) => (
                      <td 
                        key={j} 
                        className={`border px-2 py-1 ${
                          step.pivot && i === step.pivot.row && j === step.pivot.col 
                            ? 'bg-yellow-100' 
                            : ''
                        }`}
                      >
                        {coef.toFixed(2)}
                      </td>
                    ))}
                    <td className="border px-2 py-1">{step.tableau.rhs[i].toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50">
                  <td className="border px-2 py-1 font-medium">Z</td>
                  {step.tableau.z.map((coef, i) => (
                    <td key={i} className="border px-2 py-1">{coef.toFixed(2)}</td>
                  ))}
                  <td className="border px-2 py-1">{step.tableau.z0.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SimplexSteps; 