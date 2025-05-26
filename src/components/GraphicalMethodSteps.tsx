import React from 'react';
import Plot from 'react-plotly.js';
import type { Layout, Data } from 'plotly.js';
import type { LPProblem, Point } from '@/types/lpTypes';

interface GraphicalMethodStepsProps {
  objective: LPProblem['objective'];
  constraints: LPProblem['constraints'];
  variables: string[];
  feasiblePoints: Point[];
  optimalPoint?: Point;
  steps: string[];
}

const GraphicalMethodSteps: React.FC<GraphicalMethodStepsProps> = ({
  objective,
  constraints,
  variables,
  feasiblePoints,
  optimalPoint,
  steps,
}) => {
  const plotData: Data[] = [
    {
      x: feasiblePoints.map(p => p.x),
      y: feasiblePoints.map(p => p.y),
      type: 'scatter',
      mode: 'markers',
      name: 'Puntos Factibles',
      marker: {
        color: '#2563eb',
        size: 8,
      },
      text: feasiblePoints.map(p => p.label),
      hoverinfo: 'text',
    },
  ];

  if (optimalPoint) {
    plotData.push({
      x: [optimalPoint.x],
      y: [optimalPoint.y],
      type: 'scatter',
      mode: 'markers',
      name: 'Punto Óptimo',
      marker: {
        color: '#f59e42',
        size: 14,
        symbol: 'star',
      },
      text: [optimalPoint.label],
      hoverinfo: 'text',
    });
  }

  constraints.forEach((constraint, index) => {
    if (constraint.coefficients[0] !== 0 || constraint.coefficients[1] !== 0) {
      const allPoints = [...feasiblePoints];
      if (optimalPoint) allPoints.push(optimalPoint);

      const maxX = Math.max(...allPoints.map(p => p.x)) + 10;
      const xRange = [0, maxX]; // rango extendido dinámicamente

      const y = xRange.map(xVal => {
        if (constraint.coefficients[1] === 0) {
          return constraint.value / constraint.coefficients[0];
        }
        return (constraint.value - constraint.coefficients[0] * xVal) / constraint.coefficients[1];
      });

      plotData.push({
        x: xRange,
        y,
        type: 'scatter',
        mode: 'lines',
        name: `Restricción ${index + 1}`,
        line: {
          color: '#60a5fa',
          dash: 'dashdot',
        },
      });

    }
  });

  const layout: Partial<Layout> = {
    title: { text: 'Región Factible', font: { color: '#2563eb', size: 20 } },
    xaxis: {
      title: { text: variables[0], font: { color: '#2563eb' } },
      showgrid: true,
      gridcolor: '#e0e7ef',
      linecolor: '#d1d5db',
      tickfont: { color: '#2563eb' },
    },
    yaxis: {
      title: { text: variables[1], font: { color: '#2563eb' } },
      showgrid: true,
      gridcolor: '#e0e7ef',
      linecolor: '#d1d5db',
      tickfont: { color: '#2563eb' },
    },
    font: {
      family: 'Inter, system-ui, sans-serif',
      size: 13,
      color: '#374151',
    },
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    showlegend: true,
    legend: {
      x: 1,
      xanchor: 'right',
      y: 1,
      bgcolor: 'rgba(255,255,255,0.8)',
      bordercolor: '#dbeafe',
      borderwidth: 1,
      font: { color: '#2563eb' },
    },
    margin: { t: 40, r: 40, b: 40, l: 40 },
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 sm:p-8 flex flex-col gap-8">
      <h2 className="text-2xl font-bold text-blue-700 mb-2 text-center">Método Gráfico</h2>
      <div className="w-full flex flex-col items-center justify-center">
        <div className="w-full max-w-2xl bg-white border border-blue-100 rounded-xl shadow p-2">
          <Plot
            data={plotData as any}
            layout={layout as any}

            style={{ width: '100%', minHeight: '350px', maxHeight: '500px' }}

          />
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl shadow p-4">
        <h3 className="text-lg font-semibold text-blue-700 mb-3">Pasos del Método</h3>
        <ol className="list-decimal list-inside space-y-2">
          {steps.map((step, index) => (
            <li key={index} className="text-blue-900">
              {step}
            </li>
          ))}
        </ol>
      </div>

      {optimalPoint && (
        <div className="bg-blue-100 border border-blue-300 rounded-xl shadow p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold text-blue-900 mb-2">Solución Óptima</h3>
          <div className="space-y-1 text-blue-800 text-base">
            <div>
              <span className="font-semibold">Punto óptimo:</span> {optimalPoint.label}
            </div>
            <div>
              <span className="font-semibold">Valor objetivo:</span>{' '}
              {(objective.coefficients[0] * optimalPoint.x + objective.coefficients[1] * optimalPoint.y).toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GraphicalMethodSteps;
